"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { ingestLink, ingestText, isDemo, type IngestResult } from "@/lib/data";

type Phase = "input" | "processing" | "done";
type Mode = "notes" | "link";

export default function AddPage() {
  const [mode, setMode] = useState<Mode>("notes");
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [phase, setPhase] = useState<Phase>("input");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<IngestResult | null>(null);
  // Guest-cookie-dependent, so read after mount to keep hydration stable.
  const [demo, setDemo] = useState(false);
  useEffect(() => setDemo(isDemo), []);

  async function submit() {
    setError(null);
    setPhase("processing");
    try {
      const r = mode === "link" ? await ingestLink(url.trim()) : await ingestText(text);
      setResult(r);
      setPhase("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
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
                Demo mode — extraction is simulated. Add your Supabase & Gemini keys to save for real.
              </p>
            )}
          </div>
        )}

        {phase === "done" && result && (
          <div className="glass rise p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#43d6b5]/15 text-3xl">
              🧠
            </div>
            <h2 className="mb-1 text-xl font-bold">&ldquo;{result.entryTitle}&rdquo; saved</h2>
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
            <p className="display mb-5 text-lg font-semibold text-[#f5b95f]">+{result.xp} XP</p>

            <p className="mb-2 text-sm text-muted">Topics added to your brain:</p>
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
