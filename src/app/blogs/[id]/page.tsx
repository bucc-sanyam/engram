"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import { KIND_LABEL } from "@/components/ReportCardView";
import { getLinks, getTopic, getTopics, getTopicQuestions, getTopicSource } from "@/lib/data";
import type { Topic, TopicLink, TopicQuestion, TopicSource } from "@/lib/types";
import { categoryColor } from "@/lib/types";

/**
 * The "blog" view of a single topic — the complete, beautifully typeset read
 * behind the brain's summarised info card. Opened in its own tab so the 3D
 * scene state is never lost.
 */
export default function TopicBlogPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [topic, setTopic] = useState<Topic | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [links, setLinks] = useState<TopicLink[]>([]);
  const [source, setSource] = useState<TopicSource>(null);
  const [questions, setQuestions] = useState<TopicQuestion[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([getTopic(id), getTopics(), getLinks(), getTopicSource(id), getTopicQuestions(id)])
      .then(([t, ts, ls, src, qs]) => {
        setTopic(t);
        setTopics(ts);
        setLinks(ls);
        setSource(src);
        setQuestions(qs);
      })
      .finally(() => setLoaded(true));
  }, [id]);

  const byId = useMemo(() => new Map(topics.map((t) => [t.id, t])), [topics]);

  const related = useMemo(() => {
    if (!topic) return [];
    return links
      .filter((l) => l.source === topic.id || l.target === topic.id)
      .flatMap((l) => {
        const other = byId.get(l.source === topic.id ? l.target : l.source);
        return other ? [{ topic: other, reason: l.reason }] : [];
      });
  }, [topic, links, byId]);

  const color = topic ? categoryColor(topic.category) : "#a8a29e";

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <div className="rise relative z-10 mb-8 flex items-center gap-2 text-sm text-faint">
          <Link href="/blogs" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
            ← All blogs
          </Link>
        </div>

        {loaded && !topic && (
          <div className="glass mt-10 p-8 text-center">
            <h1 className="mb-2 text-xl font-bold">Topic not found</h1>
            <p className="mb-5 text-muted">This topic may have been removed.</p>
            <Link href="/brain" className="btn-primary">Back to your brain</Link>
          </div>
        )}

        {!loaded && (
          <p className="mt-16 text-center text-muted">Loading…</p>
        )}

        {topic && (
          <article className="rise mt-8">
            {/* Header */}
            <header className="relative mb-9">
              <div
                className="pointer-events-none absolute -left-24 -top-16 h-56 w-56 rounded-full opacity-20 blur-3xl"
                style={{ background: color }}
                aria-hidden
              />
              <p
                className="micro mb-4"
                style={{ color }}
              >
                {topic.category}
              </p>
              <h1 className="text-warm-gradient text-4xl font-bold leading-[1.08] sm:text-5xl">
                {topic.name}
              </h1>

              {/* Meta */}
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                  {topic.review_count} review{topic.review_count === 1 ? "" : "s"}
                </span>
              </div>

              {/* Source of this knowledge */}
              {source && (
                <div className="mt-4 flex items-center gap-2 text-sm text-faint">
                  <span className="micro !text-faint">Source</span>
                  {source.kind === "url" ? (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-w-0 items-center gap-1.5 truncate text-muted underline decoration-white/20 underline-offset-2 transition-colors hover:text-white hover:decoration-white/50"
                    >
                      <LinkIcon />
                      <span className="truncate">{sourceLabel(source.url)}</span>
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-muted">
                      <TextIcon /> Text input
                    </span>
                  )}
                </div>
              )}
            </header>

            {/* Lead — the summary, in full */}
            {topic.summary && (
              <p className="article-lead mb-10">{topic.summary}</p>
            )}

            {/* Key ideas, expanded into a read */}
            {topic.key_points?.length > 0 && (
              <section className="mb-12">
                <h2 className="micro mb-6" style={{ color }}>
                  The key ideas
                </h2>
                <ol className="space-y-6">
                  {topic.key_points.map((k, i) => (
                    <li key={i} className="flex gap-5">
                      <span
                        className="display mt-0.5 shrink-0 text-2xl font-bold tabular-nums opacity-40"
                        style={{ color }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="article-body flex-1">{k}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Every question this topic can ask — with the answers */}
            {questions.length > 0 && (
              <section className="mb-12 border-t border-white/[0.07] pt-9">
                <h2 className="micro mb-2" style={{ color }}>
                  Questions &amp; answers
                </h2>
                <p className="mb-6 text-sm text-faint">
                  Every quiz question drawn from this topic. Try answering before you peek.
                </p>
                <ul className="space-y-3">
                  {questions.map((q) => (
                    <li key={q.id}>
                      <details className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors open:bg-white/[0.03]">
                        <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                          <span className="micro mt-1 shrink-0 rounded-full bg-white/[0.05] px-2.5 py-0.5">
                            {KIND_LABEL[q.kind] ?? q.kind}
                          </span>
                          <span className="min-w-0 flex-1 text-[15px] font-medium leading-relaxed">
                            {q.prompt}
                          </span>
                          <span
                            aria-hidden
                            className="mt-1 shrink-0 text-faint transition-transform group-open:rotate-90"
                          >
                            ›
                          </span>
                        </summary>
                        <div className="space-y-2.5 px-4 pb-4">
                          {q.options && (
                            <div className="space-y-1.5">
                              {q.options.map((opt, i) => {
                                const isCorrect =
                                  q.kind === "multi"
                                    ? q.correct_indices?.includes(i) ?? false
                                    : i === q.correct_index;
                                return (
                                  <div
                                    key={i}
                                    className={`rounded-xl border px-3.5 py-2 text-sm leading-relaxed ${
                                      isCorrect
                                        ? "border-[#43d6b5]/50 bg-[#43d6b5]/[0.08] text-[#7fe5cb]"
                                        : "border-white/[0.06] text-white/55"
                                    }`}
                                  >
                                    <span className="mr-2 text-xs font-bold">
                                      {String.fromCharCode(65 + i)}
                                    </span>
                                    {opt}
                                    {isCorrect && <span className="ml-2 text-xs">✓</span>}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <div className="rounded-xl bg-[#43d6b5]/[0.05] p-3.5">
                            <div className="micro mb-1 !text-[#43d6b5]">Answer</div>
                            <p className="text-sm leading-relaxed text-muted">{q.model_answer}</p>
                          </div>
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Connections — walk onward */}
            {related.length > 0 && (
              <section className="border-t border-white/[0.07] pt-9">
                <h2 className="micro mb-5">Connected in your brain</h2>
                <ul className="space-y-2.5">
                  {related.map(({ topic: r, reason }) => {
                    const rc = categoryColor(r.category);
                    return (
                      <li key={r.id}>
                        <Link
                          href={`/blogs/${r.id}`}
                          className="row-soft group flex items-start gap-3.5 px-4 py-3.5"
                        >
                          <span
                            className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                            style={{ background: rc }}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="font-medium" style={{ color: rc }}>
                              {r.name}
                            </span>
                            {reason && (
                              <span className="mt-0.5 block text-sm leading-snug text-faint">
                                {reason}
                              </span>
                            )}
                          </span>
                          <span
                            aria-hidden
                            className="mt-1 shrink-0 text-faint opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* Study CTA */}
            <div className="mt-12 flex flex-wrap gap-3">
              <Link href={`/review?topic=${topic.id}`} className="btn-primary">
                Revise this topic →
              </Link>
              <Link href="/blogs" className="btn-ghost">
                All blogs
              </Link>
              <Link href="/brain" className="btn-ghost">
                Brain graph
              </Link>
            </div>
          </article>
        )}
      </main>
    </>
  );
}

/** Prefer a clean host + path for display, falling back to the raw string. */
function sourceLabel(url: string): string {
  try {
    const u = new URL(url);
    const path = u.pathname.replace(/\/$/, "");
    return u.hostname.replace(/^www\./, "") + (path && path !== "/" ? path : "");
  } catch {
    return url;
  }
}

function LinkIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
}

function TextIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 12h16M4 18h10" />
    </svg>
  );
}
