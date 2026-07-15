import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractKnowledge } from "@/lib/gemini";
import { awardXp } from "@/lib/progress";
import { indexContent, retrieveContext, formatContext } from "@/lib/rag";

export const maxDuration = 60;

/** Max ingests per user per day — protects the Gemini quota and storage. */
const INGEST_DAILY_LIMIT = Number(process.env.INGEST_DAILY_LIMIT || 20);

/**
 * SSRF guard: only allow public http(s) hosts on default ports. Blocks
 * loopback, private and link-local ranges (cloud metadata endpoints live
 * there), IPv6 equivalents and internal-sounding hostnames. Applied to the
 * initial URL AND to every redirect hop.
 */
function assertPublicHttpUrl(u: URL): void {
  if (!/^https?:$/.test(u.protocol)) throw new Error("Only http(s) links are supported.");
  if (u.username || u.password) throw new Error("Links with credentials aren't allowed.");
  if (u.port && u.port !== "80" && u.port !== "443") {
    throw new Error("Links on non-standard ports aren't allowed.");
  }
  const host = u.hostname.toLowerCase().replace(/\.$/, "");
  if (!host.includes(".") || host === "localhost" || host.endsWith(".localhost")) {
    throw new Error("That host can't be fetched.");
  }
  if (/\.(local|internal|intranet|home\.arpa)$/.test(host)) {
    throw new Error("That host can't be fetched.");
  }
  // Literal IPv4
  const v4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    const isPrivate =
      a === 0 || a === 10 || a === 127 ||
      (a === 100 && b >= 64 && b <= 127) || // CGNAT
      (a === 169 && b === 254) ||           // link-local / cloud metadata
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224;                             // multicast/reserved
    if (isPrivate) throw new Error("That address can't be fetched.");
  }
  // Literal IPv6 (URL hostname keeps brackets off)
  if (host.includes(":")) {
    const h = host.replace(/^\[|\]$/g, "");
    if (
      h === "::" || h === "::1" ||
      /^(fe80|fc|fd)/i.test(h) ||           // link-local / ULA
      /^::ffff:/i.test(h)                   // v4-mapped — re-check as v4 elsewhere
    ) {
      throw new Error("That address can't be fetched.");
    }
  }
}

/** Fetch an article and reduce it to readable plain text (title + body). */
async function fetchReadable(url: string): Promise<{ pageTitle: string | null; text: string }> {
  // Follow redirects manually so every hop is SSRF-checked too.
  let current = new URL(url);
  let res: Response | null = null;
  for (let hop = 0; hop < 5; hop++) {
    assertPublicHttpUrl(current);
    res = await fetch(current.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KnovisBot/1.0; +learning-app)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15000),
      redirect: "manual",
    });
    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      current = new URL(location, current);
      continue;
    }
    break;
  }
  if (!res) throw new Error("Couldn't fetch that link.");
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

  let body: { text?: unknown; title?: unknown; url?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { text: rawText, url } = body;
  const title = typeof body.title === "string" ? body.title.slice(0, 300) : undefined;

  // Per-user daily cap: every ingest is one Gemini call, so an unthrottled
  // account could burn the whole free-tier quota (and DB storage) alone.
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const { count: todayCount } = await supabase
    .from("entries")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", dayStart.toISOString());
  if ((todayCount ?? 0) >= INGEST_DAILY_LIMIT) {
    return NextResponse.json(
      { error: `Daily limit reached (${INGEST_DAILY_LIMIT} learnings/day) — come back tomorrow!` },
      { status: 429 }
    );
  }

  // Link mode: fetch the article and use its content as the text to extract from.
  let text = typeof rawText === "string" ? rawText : undefined;
  let sourceUrl: string | null = null;
  let pageTitle: string | null = null;
  if (url && typeof url === "string") {
    let parsed: URL;
    try {
      parsed = new URL(url.trim());
      assertPublicHttpUrl(parsed);
    } catch (e) {
      return NextResponse.json(
        { error: e instanceof Error && e.message ? e.message : "That doesn't look like a valid link." },
        { status: 400 }
      );
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
  // Bound what we store — pathological pastes shouldn't eat the DB.
  text = text.slice(0, 120_000);

  // Give Gemini the existing topic names so knowledge accumulates per topic.
  const { data: existing } = await supabase
    .from("topics")
    .select("id, name, category, summary, key_points")
    .eq("user_id", user.id);
  const existingTopics = existing ?? [];

  // RAG grounding: retrieve the user's own earlier notes most relevant to this
  // new text, so the extraction stays consistent with what they've saved
  // before. Skipped on the very first ingest (nothing to retrieve).
  let priorContext = "";
  if (existingTopics.length) {
    const hits = await retrieveContext(supabase, text.slice(0, 2000), 6);
    priorContext = formatContext(hits);
  }

  let extraction;
  try {
    extraction = await extractKnowledge(
      text,
      existingTopics.map((t) => ({ name: t.name, category: t.category })),
      priorContext
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

  // 1b. RAG index: chunk + embed this entry so future generation retrieves it.
  // Best-effort — a missing RAG table or embedding hiccup never fails ingest.
  await indexContent(supabase, {
    userId: user.id,
    entryId: entry.id,
    source: "entry",
    text,
  });

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

  // 5. Question bank — pre-generated here so review sessions cost no AI calls.
  const KINDS = new Set(["open", "quickfire", "mcq", "truefalse", "multi"]);
  const DIFFICULTIES = new Set(["basic", "intermediate", "advanced"]);
  const questions = (extraction.questions ?? [])
    .map((q) => {
      const kind = KINDS.has(q.kind) ? q.kind : "open";
      let options: string[] | null = null;
      let correctIndex: number | null = null;
      let correctIndices: number[] | null = null;
      if (kind === "mcq" && Array.isArray(q.options)) {
        options = q.options.slice(0, 4);
        if (typeof q.correct_index === "number") {
          correctIndex = Math.max(0, Math.min(options.length - 1, q.correct_index));
        }
      } else if (kind === "truefalse") {
        options = ["True", "False"];
        // Fall back to the model answer when Gemini omits the index.
        correctIndex =
          q.correct_index === 0 || q.correct_index === 1
            ? q.correct_index
            : /^\s*true\b/i.test(q.model_answer) ? 0 : 1;
      } else if (kind === "multi" && Array.isArray(q.options)) {
        options = q.options.slice(0, 5);
        const max = options.length - 1;
        correctIndices = Array.from(
          new Set(
            (q.correct_indices ?? [])
              .filter((i): i is number => typeof i === "number" && i >= 0 && i <= max)
              .map((i) => Math.round(i))
          )
        ).sort((a, b) => a - b);
      }
      return {
        user_id: user.id,
        topic_id: nameToId.get(q.topic.toLowerCase()),
        kind,
        prompt: q.prompt,
        options,
        correct_index: correctIndex,
        correct_indices: correctIndices,
        model_answer: q.model_answer,
        difficulty: DIFFICULTIES.has(q.difficulty) ? q.difficulty : "basic",
      };
    })
    // Drop malformed rows (missing topic, empty prompt, choice kinds without a usable answer key).
    .filter(
      (q) =>
        q.topic_id &&
        q.prompt &&
        q.model_answer &&
        (q.kind !== "mcq" || (q.options && q.options.length >= 2 && q.correct_index !== null)) &&
        (q.kind !== "multi" || (q.options && q.options.length >= 3 && (q.correct_indices?.length ?? 0) >= 1))
    );
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
