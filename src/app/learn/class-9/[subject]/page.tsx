import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Link from "next/link";
import { AccentText } from "@/components/AccentText";
import { CLASS9_CHAPTERS, SUBJECT_META, getSubject, chapterHref } from "@/lib/cbse/class9";

export function generateStaticParams() {
  return [{ subject: "science" }, { subject: "maths" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>;
}): Promise<Metadata> {
  const { subject } = await params;
  const meta = getSubject(subject) ? SUBJECT_META[subject as keyof typeof SUBJECT_META] : null;
  if (!meta) return { title: "Not found · Knovis" };
  return { title: `${meta.label} · Class 9 · Knovis`, description: meta.blurb };
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  const s = getSubject(subject);
  if (!s) notFound();

  const meta = SUBJECT_META[s];
  const chapters = CLASS9_CHAPTERS[s];

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <header className="mb-10">
          <AccentText color={meta.accent} className="micro">
            Class 9 · {meta.book}
          </AccentText>
          <h1 className="text-warm-gradient mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            {meta.label}
          </h1>
          <p className="article-lead mt-3">{meta.blurb}</p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {chapters.map((ch) => (
            <Link
              key={ch.key}
              href={chapterHref(s, ch.key)}
              className="glass glass-hover rise rounded-[1.5rem] p-5"
            >
              <AccentText color={ch.accent} className="micro">
                Chapter {ch.number}
              </AccentText>
              <h2 className="mt-1 text-lg font-semibold text-white/85">{ch.title}</h2>
              <p className="mt-2 text-sm text-muted">{ch.summary}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-faint">
                <span>{ch.estMinutes} min</span>
                <span>·</span>
                <span>{ch.questions.length} questions</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
