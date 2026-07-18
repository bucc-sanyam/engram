"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { ApiError, ingestLink, ingestText, isDemo, type IngestResult } from "@/lib/data";

type Phase = "input" | "processing" | "done";
type Mode = "notes" | "link";

export default function AddPage() {
  const [mode, setMode] = useState<Mode>("notes");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IngestResult | null>(null);
  const [showDemoGate, setShowDemoGate] = useState(false);
  const [limitResetAt, setLimitResetAt] = useState<string | null>(null);
  // Guest-cookie-dependent, so read after mount to keep hydration stable.
  const [demo, setDemo] = useState(false);
  useEffect(() => setDemo(isDemo), []);

  async function submit() {
    if (demo) {
      // Guests can look around but can't write real data — no simulated
      // "success", just an honest gate pointing at sign-in.
      setShowDemoGate(true);
      return;
    }
    setError(null);
    setPhase("processing");
    try {
      const r = mode === "link" ? await ingestLink(url.trim()) : await ingestText(text);
      setResult(r);
      setPhase("done");
    } catch (e) {
      if (e instanceof ApiError && e.status === 429 && e.resetAt) {
        setLimitResetAt(e.resetAt);
      } else {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
      setPhase("input");
    }
  }

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const urlValid = /^https?:\/\/\S+\.\S+/.test(url.trim());
  const canSubmit = mode === "link" ? urlValid : words >= 8;

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-8 sm:px-6 md:pb-16">
        <div className="rise mb-6">
          <p className="micro mb-3">Feed your brain</p>
          <h1 className="text-warm-gradient text-4xl font-bold">Log a learning</h1>
          <p className="mt-2 text-muted">
            Paste an AI conversation, your reading notes — or drop a link to a blog or
            article. The AI reads it, extracts the topics, and wires them into your brain.
          </p>
        </div>

        {phase !== "done" && (
          <div className="glass rise rise-1 p-5 sm:p-6" data-tour="add-form">
            {/* Mode toggle */}
            <div className="mb-4 inline-flex rounded-full bg-white/[0.045] p-1">
              {(["notes", "link"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    mode === m ? "bg-[#f4f1e9] text-[#131118]" : "text-muted hover:text-white"
                  }`}
                  disabled={phase === "processing"}
                >
                  {m === "notes" ? "Paste text" : "Add a link"}
                </button>
              ))}
            </div>

            {mode === "notes" ? (
              <textarea
                className="input min-h-[320px] resize-y font-[15px] leading-relaxed"
                placeholder={`Paste your conversation or notes here…\n\nExample:\n"Today I discussed how transformers work. The key insight was that self-attention lets every token look at every other token…"`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={phase === "processing"}
              />
            ) : (
              <>
                <input
                  className="input"
                  type="url"
                  inputMode="url"
                  placeholder="https://a-blog-you-just-read.com/great-article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={phase === "processing"}
                  autoFocus
                />
                <p className="mt-3 text-sm text-muted">
                  The article is fetched and read for you — its topics, key points and
                  connections are extracted, and the link stays attached to the entry so
                  you can always get back to the source.
                </p>
              </>
            )}

            <div className="mt-4 flex items-center justify-between">
              <span className="micro">
                {mode === "notes"
                  ? `${words.toLocaleString()} words`
                  : urlValid
                    ? new URL(url.trim()).hostname.replace(/^www\./, "")
                    : "paste a full url"}
              </span>
              <button className="btn-primary" onClick={submit} disabled={phase === "processing" || !canSubmit}>
                {phase === "processing" ? (
                  <>
                    <Spinner /> {mode === "link" ? "Reading the article…" : "Extracting knowledge…"}
                  </>
                ) : mode === "link" ? (
                  "Fetch & learn"
                ) : (
                  "Extract & save"
                )}
              </button>
            </div>
            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
            {demo && (
              <p className="mt-3 text-xs text-[#f5b95f]/80">
                Demo mode — guests can look around but can&apos;t add real data. Sign in to save for real.
              </p>
            )}
          </div>
        )}

        {showDemoGate && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div
              className="absolute inset-0 bg-[rgba(8,7,12,0.78)] backdrop-blur-sm"
              onClick={() => setShowDemoGate(false)}
            />
            <div className="overlay-panel relative w-full max-w-sm p-7 text-center" data-allow-nav>
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a5c] to-[#f5b95f] shadow-[0_0_36px_rgba(255,122,92,0.45)]">
                <LockIcon className="h-7 w-7 text-[#1a120e]" />
              </span>
              <h3 className="mb-2 text-lg font-bold">This is a demo</h3>
              <p className="mb-5 text-sm leading-relaxed text-muted">
                Guest sessions can explore freely but can&apos;t add new data. Sign in — it&apos;s free — to
                start building your own knowledge graph.
              </p>
              <div className="flex flex-col gap-2">
                <Link href="/login" className="btn-primary w-full justify-center">
                  Sign in
                </Link>
                <button onClick={() => setShowDemoGate(false)} className="btn-ghost w-full justify-center">
                  Not now
                </button>
              </div>
            </div>
          </div>
        )}

        {limitResetAt && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div
              className="absolute inset-0 bg-[rgba(8,7,12,0.78)] backdrop-blur-sm"
              onClick={() => setLimitResetAt(null)}
            />
            <div className="overlay-panel relative w-full max-w-sm p-7 text-center">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#43d6b5] to-[#7fe5cb] shadow-[0_0_36px_rgba(67,214,181,0.4)]">
                <ClockIcon className="h-7 w-7 text-[#0b1f1a]" />
              </span>
              <h3 className="mb-2 text-lg font-bold">You&apos;re all caught up for today</h3>
              <p className="mb-1 text-sm leading-relaxed text-muted">
                You&apos;ve hit today&apos;s limit on adding new learnings.
              </p>
              <p className="mb-5 text-sm font-medium text-[#7fe5cb]">
                You can add more starting {formatResetTime(limitResetAt)}.
              </p>
              <button onClick={() => setLimitResetAt(null)} className="btn-primary w-full justify-center">
                Got it
              </button>
            </div>
          </div>
        )}

        {phase === "done" && result && (
          <div className="glass rise p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#43d6b5]/15 text-3xl">
              🧠
            </div>
            <h2 className="mb-1 text-xl font-bold">
              {result.duplicate ? (
                <>You already added &ldquo;{result.entryTitle}&rdquo;</>
              ) : (
                <>&ldquo;{result.entryTitle}&rdquo; saved</>
              )}
            </h2>
            {result.duplicate && result.message && (
              <p className="mx-auto mb-1 max-w-sm text-sm text-muted">{result.message}</p>
            )}
            {result.sourceUrl && (
              <a
                href={result.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-1 inline-block max-w-full truncate text-sm text-[#7fe5cb] underline decoration-[#7fe5cb]/40 underline-offset-4 hover:decoration-[#7fe5cb]"
              >
                {result.sourceUrl}
              </a>
            )}
            <p className="mb-2 mt-5 text-sm text-muted">
              {result.duplicate ? "Already part of your brain:" : "Topics added to your brain:"}
            </p>
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {result.topicNames.map((n) => (
                <span key={n} className="rounded-full bg-[#43d6b5]/12 px-3.5 py-1 text-sm text-[#7fe5cb]">
                  {n}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/brain" className="btn-primary">See it in your brain</Link>
              <button
                className="btn-ghost"
                onClick={() => {
                  setText("");
                  setUrl("");
                  setResult(null);
                  setPhase("input");
                }}
              >
                Log another
              </button>
            </div>
          </div>
        )}

        {/* Tips */}
        {phase === "input" && (
          <div className="rise rise-2 mt-6 grid gap-3 sm:grid-cols-3">
            <Tip emoji="💬" text="Whole conversations work best — context helps the AI find connections." />
            <Tip emoji="🔗" text="Read something great? Drop the link — the source stays attached to the entry." />
            <Tip emoji="📅" text="Log daily. Fresh topics enter tomorrow's revision plan automatically." />
          </div>
        )}
      </main>
    </>
  );
}

/** "tomorrow at 12:00 AM" (falls back to a weekday name if resetAt isn't literally tomorrow). */
function formatResetTime(iso: string): string {
  const reset = new Date(iso);
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const isTomorrow =
    reset.getFullYear() === tomorrow.getFullYear() &&
    reset.getMonth() === tomorrow.getMonth() &&
    reset.getDate() === tomorrow.getDate();
  const time = reset.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return isTomorrow ? `tomorrow at ${time}` : reset.toLocaleString([], { weekday: "long", hour: "numeric", minute: "2-digit" });
}

function ClockIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

function LockIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function Tip({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="glass p-4 text-sm text-muted">
      <span className="mr-2">{emoji}</span>
      {text}
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
