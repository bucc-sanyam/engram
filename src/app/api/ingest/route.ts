import { NextResponse, after } from "next/server";
import dns from "node:dns";
import { Agent } from "undici";
import { createClient } from "@/lib/supabase/server";
import { extractKnowledge } from "@/lib/gemini";
import { advanceStreak } from "@/lib/progress";
import { indexContent, retrieveContext, formatContext, findDuplicateEntry, linkRetrievalLogToEntry } from "@/lib/rag";
import { looksLikeGibberish, sanitizeField } from "@/lib/guardrails";
import { CATEGORY_COLORS } from "@/lib/types";
import { clampTz, localTodayForOffset, dayStartUtcIso } from "@/lib/dates";

export const maxDuration = 60;

/**
 * Max ingests per user per day — protects the Gemini quota and storage.
 * Deliberately leaves the 10th daily Gemini-call "slot" unused by ingest:
 * QUIZ_AI_DAILY_LIMIT (src/app/api/quiz/route.ts) always keeps 1 call/day
 * reserved for AI quiz grading regardless of how much of this cap is used,
 * so a heavy ingest day can never fully starve the review flow.
 */
const INGEST_DAILY_LIMIT = Number(process.env.INGEST_DAILY_LIMIT || 9);

/** True if a resolved IPv4 address is loopback, private, link-local, CGNAT, or reserved/multicast. */
function isBlockedIPv4(ip: string): boolean {
  const m = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return false;
  const a = Number(m[1]);
  const b = Number(m[2]);
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 100 && b >= 64 && b <= 127) || // CGNAT
    (a === 169 && b === 254) ||           // link-local / cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224                              // multicast/reserved
  );
}

/** True if a resolved IPv6 address is unspecified, loopback, link-local, or ULA. */
function isBlockedIPv6(ip: string): boolean {
  const h = ip.toLowerCase().replace(/^\[|\]$/, "").replace(/\]$/, "");
  if (h === "::" || h === "::1") return true;
  if (/^(fe80|fc|fd)/i.test(h)) return true; // link-local / unique local
  const v4Mapped = h.match(/^::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i);
  if (v4Mapped) return isBlockedIPv4(v4Mapped[1]);
  return false;
}

function isBlockedIp(address: string, family: number): boolean {
  return family === 6 ? isBlockedIPv6(address) : isBlockedIPv4(address);
}

/**
 * SSRF guard, part 1 — fast string-level pre-check (protocol, credentials,
 * port, obviously-internal hostnames, literal IPs). Cheap and gives a clear
 * error before any network activity, but is NOT the real security boundary:
 * a hostname like "evil.example.com" passes this check even if its DNS
 * record points at 127.0.0.1 or 169.254.169.254 — that gap is closed by
 * `ssrfSafeDispatcher` below, which validates the address DNS *actually
 * resolves to* at the moment of connection (see its comment).
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
  const v4 = host.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
  if (v4 && isBlockedIPv4(host)) throw new Error("That address can't be fetched.");
  if (host.includes(":") && isBlockedIPv6(host)) throw new Error("That address can't be fetched.");
}

/**
 * SSRF guard, part 2 — the real boundary. A hostname-string check alone is
 * bypassable by DNS rebinding: register any domain, point its DNS record at
 * an internal address, and a "check the hostname, then fetch(url)" pattern
 * validates the harmless-looking domain string while `fetch()` performs its
 * OWN separate DNS lookup and connects wherever that domain resolves *right
 * now* — the two lookups can legitimately return different answers.
 *
 * This custom `lookup` plugs into undici's connection layer as the ONLY
 * DNS resolution step for the actual TCP connect — there is no second,
 * unvalidated lookup afterwards. It resolves the hostname, rejects the
 * whole request if ANY returned address is private/loopback/link-local, and
 * only then hands the validated address back to establish the connection.
 * The original hostname is still used for the TLS SNI/Host header (Node
 * derives those from the URL, not from what `lookup` returns), so normal
 * HTTPS certificate validation is unaffected.
 */
type LookupCallback = (
  err: NodeJS.ErrnoException | null,
  address: string | dns.LookupAddress[],
  family?: number
) => void;

// undici's connector calls this exactly like Node's own dns.lookup, including
// its overloads: `lookup(hostname, callback)` (options omitted) or
// `lookup(hostname, options, callback)` — and its Happy-Eyeballs (dual-stack)
// logic requests `{ all: true }`, expecting an ARRAY back, not a single
// address. Both shapes must be honored or real (non-malicious) requests break.
function ssrfSafeLookup(
  hostname: string,
  optionsOrCallback: dns.LookupAllOptions | dns.LookupOneOptions | LookupCallback,
  maybeCallback?: LookupCallback
): void {
  const callback = typeof optionsOrCallback === "function" ? optionsOrCallback : maybeCallback!;
  const wantAll = typeof optionsOrCallback === "object" && !!optionsOrCallback?.all;

  dns.lookup(hostname, { all: true, verbatim: true }, (err, addresses) => {
    if (err) return callback(err, wantAll ? [] : "", 4);
    if (!addresses.length) {
      return callback(new Error(`DNS resolution for ${hostname} returned no addresses`), wantAll ? [] : "", 4);
    }
    for (const { address, family } of addresses) {
      if (isBlockedIp(address, family)) {
        return callback(new Error(`${hostname} resolves to a non-public address`), wantAll ? [] : "", 4);
      }
    }
    if (wantAll) return callback(null, addresses);
    const chosen = addresses[0];
    callback(null, chosen.address, chosen.family);
  });
}

const ssrfSafeDispatcher = new Agent({ connect: { lookup: ssrfSafeLookup } });

/** Fetch an article and reduce it to readable plain text (title + body). */
async function fetchReadable(url: string): Promise<{ pageTitle: string | null; text: string }> {
  // Follow redirects manually so every hop is SSRF-checked too. Bound the
  // WHOLE chain (not a fresh timeout per hop) — 5 hops at 15s each could
  // otherwise take up to 75s, blowing past the function's duration on its own.
  const deadline = Date.now() + 20_000;
  let current = new URL(url);
  let res: Response | null = null;
  for (let hop = 0; hop < 5; hop++) {
    assertPublicHttpUrl(current);
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error("That link took too long to load.");
    res = await fetch(current.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KnovisBot/1.0; +learning-app)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(remaining),
      redirect: "manual",
      // @ts-expect-error -- `dispatcher` is a real, documented Node/undici fetch
      // option (Node's global fetch accepts any undici-compatible Dispatcher)
      // that TypeScript's bundled fetch types don't know about.
      dispatcher: ssrfSafeDispatcher,
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

/**
 * Build the "you already added this" response, reusing the existing entry's
 * title/topics/source. Wrapped in try/catch so a lookup hiccup can never
 * crash the request — worst case it falls back to a bare duplicate notice.
 */
async function duplicateResponse(
  supabase: Awaited<ReturnType<typeof createClient>>,
  entryId: string,
  message: string
) {
  try {
    const [{ data: existingEntry }, { data: linkedTopics }] = await Promise.all([
      supabase.from("entries").select("title, source_url").eq("id", entryId).maybeSingle(),
      supabase.from("entry_topics").select("topics(name)").eq("entry_id", entryId),
    ]);
    const topicNames = (linkedTopics ?? []).flatMap((r: any) => {
      const t = r.topics;
      if (!t) return [];
      return Array.isArray(t) ? t.map((x) => x?.name).filter(Boolean) : t.name ? [t.name] : [];
    });
    return NextResponse.json({
      entryTitle: existingEntry?.title ?? "Untitled",
      topicNames,
      sourceUrl: existingEntry?.source_url ?? null,
      duplicate: true,
      message,
    });
  } catch (e) {
    console.error("Duplicate response lookup failed", e);
    return NextResponse.json({
      entryTitle: "Untitled",
      topicNames: [],
      sourceUrl: null,
      duplicate: true,
      message,
    });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  let body: { text?: unknown; title?: unknown; url?: unknown; tz?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const { text: rawText, url } = body;
  const title = typeof body.title === "string" ? body.title.slice(0, 300) : undefined;

  // Per-user daily cap: every ingest is one Gemini call, so an unthrottled
  // account could burn the whole free-tier quota (and DB storage) alone.
  // "Today" is the CLIENT's calendar day (same convention as /api/plan and
  // /api/quiz finish) so the reset time shown to the user is actually correct
  // for their timezone, not the server's.
  const tz = clampTz(body.tz);
  const today = localTodayForOffset(tz);
  const dayStart = dayStartUtcIso(today, tz);
  const dayEnd = new Date(new Date(dayStart).getTime() + 86_400_000).toISOString();
  const { count: todayCount } = await supabase
    .from("entries")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", dayStart);
  if ((todayCount ?? 0) >= INGEST_DAILY_LIMIT) {
    return NextResponse.json(
      {
        error: `Daily limit reached (${INGEST_DAILY_LIMIT} learnings/day) — come back tomorrow!`,
        resetAt: dayEnd,
      },
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
    // Fast path: this exact URL was already ingested — skip the network
    // fetch AND the Gemini call entirely (re-fetching can yield slightly
    // different text — ads/timestamps/related-post widgets — so this catches
    // "same link" cases the later content-hash check might miss).
    const normalizedUrl = parsed.toString();
    const { data: existingByUrl } = await supabase
      .from("entries")
      .select("id")
      .eq("user_id", user.id)
      .eq("source_url", normalizedUrl)
      .limit(1)
      .maybeSingle();
    if (existingByUrl) {
      return duplicateResponse(supabase, existingByUrl.id, "You've already added this link — no new entry was created.");
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

  // Reject obvious junk (keyboard mashing, spam floods) before it burns a
  // Gemini call, a daily-cap slot, and pollutes the knowledge base.
  if (looksLikeGibberish(text)) {
    return NextResponse.json(
      { error: "That doesn't look like real content to learn from — try pasting actual notes or an article." },
      { status: 400 }
    );
  }

  // Exact-duplicate short-circuit: if this content was already ingested,
  // reuse that entry instead of burning a Gemini call, a daily-cap slot, and
  // creating duplicate chunks/questions.
  const duplicate = await findDuplicateEntry(supabase, user.id, text);
  if (duplicate) {
    return duplicateResponse(
      supabase,
      duplicate.entryId,
      "You've already added this exact content — no new entry was created."
    );
  }

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
  let retrievalLogId: string | null = null;
  if (existingTopics.length) {
    const retrieval = await retrieveContext(supabase, user.id, text.slice(0, 2000), 6);
    priorContext = formatContext(retrieval.chunks);
    retrievalLogId = retrieval.logId;
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

  // Validate/clamp everything Gemini returned before it touches the DB —
  // defense in depth against a manipulated or hallucinating model. A
  // successful prompt injection can still only produce valid-JSON-shaped
  // output (responseMimeType is enforced), but nothing else bounds what's
  // INSIDE those strings or which categories get used without this.
  extraction.title = sanitizeField(extraction.title, 200);
  extraction.summary = sanitizeField(extraction.summary, 1000);
  extraction.topics = (extraction.topics ?? [])
    .map((t) => ({
      name: sanitizeField(t.name, 120),
      category: t.category in CATEGORY_COLORS ? t.category : "General",
      summary: sanitizeField(t.summary, 800),
      key_points: (t.key_points ?? [])
        .slice(0, 8)
        .map((k) => sanitizeField(k, 300))
        .filter(Boolean),
    }))
    .filter((t) => t.name);
  extraction.connections = (extraction.connections ?? [])
    .map((c) => ({ a: sanitizeField(c.a, 120), b: sanitizeField(c.b, 120), reason: sanitizeField(c.reason, 300) }))
    .filter((c) => c.a && c.b);
  extraction.questions = (extraction.questions ?? []).map((q) => ({
    ...q,
    topic: sanitizeField(q.topic, 120),
    prompt: sanitizeField(q.prompt, 500),
    model_answer: sanitizeField(q.model_answer, 400),
    options: Array.isArray(q.options) ? q.options.map((o) => sanitizeField(o, 200)) : q.options,
  }));
  extraction.facts = (extraction.facts ?? [])
    .map((f) => ({ topic: sanitizeField(f.topic, 120), fact: sanitizeField(f.fact, 400) }))
    .filter((f) => f.topic && f.fact);

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

  // 1b. RAG bookkeeping (grounding-log backfill + chunk/embed indexing) is
  // strictly best-effort and never affects this response — deferred to run
  // AFTER the response is sent (Next's after()) instead of blocking on it.
  // This blocking work (embedding calls + several extra DB round-trips) was
  // the root cause of a 504 FUNCTION_INVOCATION_TIMEOUT on link ingests.
  after(async () => {
    if (retrievalLogId) await linkRetrievalLogToEntry(supabase, retrievalLogId, entry.id);
    await indexContent(supabase, {
      userId: user.id,
      entryId: entry.id,
      source: "entry",
      text,
    });
  });

  // 2. Upsert topics (merge into existing topics of the same name).
  const nameToId = new Map<string, string>();
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

  // 6. Streak: advance on any successful ingest.
  await advanceStreak(supabase, user.id);

  return NextResponse.json({
    entryTitle: pageTitle ?? extraction.title,
    topicNames: extraction.topics.map((t) => t.name),
    sourceUrl,
  });
}
