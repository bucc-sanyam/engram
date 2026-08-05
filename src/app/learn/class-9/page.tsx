import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Link from "next/link";
import { AccentText } from "@/components/AccentText";
import { SUBJECT_META } from "@/lib/cbse/class9";
import type { Subject } from "@/lib/cbse/types";

export const metadata: Metadata = {
  title: "Class 9 · Knovis",
  description: "Interactive CBSE Class 9 study material — Science (Exploration) and Mathematics (Ganita Manjari).",
};

export default function GradeHubPage() {
  if (process.env.NEXT_PUBLIC_SCHOOL_TRACK !== "1") notFound();

  const subjects = Object.values(SUBJECT_META) as {
    slug: Subject; label: string; book: string; accent: string; blurb: string;
  }[];

  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <header className="mb-10">
          <AccentText color="#43d6b5" className="micro">
            Class 9 · CBSE
          </AccentText>
          <h1 className="text-warm-gradient mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Class 9
          </h1>
          <p className="article-lead mt-3">
            NCF-SE 2023 editions (First Edition, April 2026). Choose a subject to begin.
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {subjects.map((s) => (
            <Link
              key={s.slug}
              href={`/learn/class-9/${s.slug}`}
              className="glass glass-hover rise rounded-[1.5rem] p-6"
            >
              <AccentText color={s.accent} className="micro">
                {s.book}
              </AccentText>
              <h2 className="mt-2 text-xl font-semibold text-white/85">{s.label}</h2>
              <p className="mt-2 text-sm text-muted">{s.blurb}</p>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
