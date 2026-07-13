import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractKnowledge } from "@/lib/gemini";
import { awardXp } from "@/lib/progress";

export const maxDuration = 60;

/** Fetch an article and reduce it to readable plain text (title + body). */
async function fetchReadable(url: string): Promise<{ pageTitle: string | null; text: string }> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; EngramBot/1.0; +learning-app)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(15000),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`The page responded with ${res.status}.`);
  const type = res.headers.get("content-type") ?? "";
  if (!type.includes("html") && !type.includes("text")) {
    throw new Error("That link isn't an article page (unsupported content type).");
  }
  const html = (await res.text()).slice(0, 800_000);

  const pageTitle =
    html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)/i)?.[1] ??
    html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ??
    null;

  // Prefer the <article>/<main> body when the page marks one up.
  const bodyMatch =
    html.match(/<article[\s\S]*?<\/article>/i)?.[0] ??
    html.match(/<main[\s\S]*?<\/main>/i)?.[0] ??
    html;

  const text = bodyMatch
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<nav[\s\S]*?<\/nav>/gi, " ")
    .replace(/<footer[\s\S]*?<\/footer>/gi, " ")
    .replace(/<(h[1-6]|p|li|br|div|section|blockquote)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#?\w+;/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, 30_000); // keep the Gemini prompt bounded

  return { pageTitle, text };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { text: rawText, title, url } = await request.json();

  // Link mode: fetch the article and use its content as the text to extract from.
  let text = rawText as string | undefined;
  let sourceUrl: string | null = null;
  let pageTitle: string | null = null;
  if (url && typeof url === "string") {
    let parsed: URL;
    try {
      parsed = new URL(url.trim());
      if (!/^https?:$/.test(parsed.protocol)) throw new Error();
    } catch {
      return NextResponse.json({ error: "That doesn't look like a valid link." }, { status: 400 });
    }
    try {
      const page = await fetchReadable(parsed.toString());
      pageTitle = page.pageTitle;
      text = page.text;
      sourceUrl = parsed.toString();
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error ? e.message : "Couldn't fetch that link." },
        { status: 422 }
      );
    }
  }

  if (!text || typeof text !== "string" || text.trim().length < 40) {
    return NextResponse.json(
      {
        error: sourceUrl
          ? "That page didn't contain enough readable text to learn from."
          : "Paste at least a few sentences of your conversation or notes.",
      },
      { status: 400 }
    );
  }

  // Give Gemini the existing topic names so knowledge accumulates per topic.
  const { data: existing } = await supabase
    .from("topics")
    .select("id, name, category, summary, key_points")
    .eq("user_id", user.id);
  const existingTopics = existing ?? [];

  let extraction;
  try {
    extraction = await extractKnowledge(
      text,
      existingTopics.map((t) => ({ name: t.name, category: t.category }))
    );
  } catch (e) {
    console.error("Gemini extraction failed", e);
    return NextResponse.json(
      { error: "The AI couldn't process this text. Check your GEMINI_API_KEY and try again." },
      { status: 502 }
    );
  }

  // 1. Save the entry (keeping the source link when it came from one).
  const { data: entry, error: entryErr } = await supabase
    .from("entries")
    .insert({
      user_id: user.id,
      title: title || pageTitle || extraction.title,
      raw_text: text,
      summary: extraction.summary,
      source_url: sourceUrl,
    })
    .select("id")
    .single();
  if (entryErr) return NextResponse.json({ error: entryErr.message }, { status: 500 });

  // 2. Upsert topics (merge into existing topics of the same name).
  const nameToId = new Map<string, string>();
  let newTopics = 0;
  for (const t of extraction.topics) {
    const match = existingTopics.find(
      (e) => e.name.toLowerCase() === t.name.toLowerCase()
    );
    if (match) {
      const mergedPoints = Array.from(
        new Set([...(match.key_points as string[]), ...t.key_points])
      ).slice(0, 12);
      await supabase
        .from("topics")
        .update({
          summary: t.summary,
          key_points: mergedPoints,
          // Fresh material on an old topic → surface it for review again soon.
          next_review_at: new Date().toISOString(),
        })
        .eq("id", match.id);
      nameToId.set(t.name.toLowerCase(), match.id);
    } else {
      const { data: created } = await supabase
        .from("topics")
        .insert({
          user_id: user.id,
          name: t.name,
          category: t.category,
          summary: t.summary,
          key_points: t.key_points,
        })
        .select("id")
        .single();
      if (created) {
        nameToId.set(t.name.toLowerCase(), created.id);
        newTopics++;
      }
    }
  }
  // Existing topics referenced only in connections.
  for (const e of existingTopics) nameToId.set(e.name.toLowerCase(), e.id);

  // 3. Link entry ↔ topics.
  const topicIds = extraction.topics
    .map((t) => nameToId.get(t.name.toLowerCase()))
    .filter(Boolean) as string[];
  if (topicIds.length) {
    await supabase
      .from("entry_topics")
      .upsert(topicIds.map((topic_id) => ({ entry_id: entry.id, topic_id })));
  }

  // 4. Connections between topics.
  for (const c of extraction.connections) {
    const a = nameToId.get(c.a.toLowerCase());
    const b = nameToId.get(c.b.toLowerCase());
    if (!a || !b || a === b) continue;
    // Normalise direction so (a,b) and (b,a) don't duplicate.
    const [source, target] = a < b ? [a, b] : [b, a];
    await supabase
      .from("topic_links")
      .upsert(
        { user_id: user.id, source, target, reason: c.reason },
        { onConflict: "user_id,source,target" }
      );
  }

  // 5. Flashcards.
  const cards = extraction.flashcards
    .map((f) => ({
      user_id: user.id,
      topic_id: nameToId.get(f.topic.toLowerCase()),
      question: f.question,
      answer: f.answer,
    }))
    .filter((f) => f.topic_id);
  if (cards.length) await supabase.from("flashcards").insert(cards);

  // 5b. Question bank — pre-generated here so review sessions cost no AI calls.
  const KINDS = new Set(["open", "quickfire", "mcq"]);
  const DIFFICULTIES = new Set(["basic", "intermediate", "advanced"]);
  const questions = (extraction.questions ?? [])
    .map((q) => {
      const isMcq = q.kind === "mcq";
      const options = isMcq && Array.isArray(q.options) ? q.options.slice(0, 4) : null;
      return {
        user_id: user.id,
        topic_id: nameToId.get(q.topic.toLowerCase()),
        kind: KINDS.has(q.kind) ? q.kind : "open",
        prompt: q.prompt,
        options,
        correct_index:
          isMcq && options && typeof q.correct_index === "number"
            ? Math.max(0, Math.min(options.length - 1, q.correct_index))
            : null,
        model_answer: q.model_answer,
        difficulty: DIFFICULTIES.has(q.difficulty) ? q.difficulty : "basic",
      };
    })
    // Drop malformed rows (missing topic, mcq without options, empty prompt).
    .filter((q) => q.topic_id && q.prompt && q.model_answer && (q.kind !== "mcq" || (q.options && q.options.length >= 2)));
  if (questions.length) await supabase.from("questions").insert(questions);

  // 5c. Facts pool — feeds the zero-AI "fact of the day".
  const facts = (extraction.facts ?? [])
    .map((f) => ({
      user_id: user.id,
      topic_id: nameToId.get(f.topic.toLowerCase()),
      fact: f.fact,
    }))
    .filter((f) => f.topic_id && f.fact);
  if (facts.length) await supabase.from("facts").insert(facts);

  // 6. XP: 15 per new topic, 5 per refreshed one, 10 for logging at all.
  const xp = await awardXp(
    supabase,
    user.id,
    10 + newTopics * 15 + (extraction.topics.length - newTopics) * 5
  );

  return NextResponse.json({
    entryTitle: pageTitle ?? extraction.title,
    topicNames: extraction.topics.map((t) => t.name),
    sourceUrl,
    xp,
  });
}
