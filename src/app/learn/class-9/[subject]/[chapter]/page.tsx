import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ChapterReader from "@/components/school/ChapterReader";
import { CLASS9_CHAPTERS, getChapter, getSubject } from "@/lib/cbse/class9";

export function generateStaticParams() {
  return (["science", "maths"] as const).flatMap((subject) =>
    CLASS9_CHAPTERS[subject].map((c) => ({ subject, chapter: c.key }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>;
}): Promise<Metadata> {
  const { subject, chapter } = await params;
  const c = getChapter(subject, chapter);
  if (!c) return { title: "Not found · Knovis" };
  return { title: `${c.title} · Class 9 ${c.book} · Knovis`, description: c.summary };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ subject: string; chapter: string }>;
}) {
  if (process.env.NEXT_PUBLIC_SCHOOL_TRACK !== "1") notFound();
  const { subject, chapter } = await params;
  const s = getSubject(subject);
  if (!s || !getChapter(subject, chapter)) notFound();
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-32 pt-8 sm:px-6 md:pb-24">
        <ChapterReader subject={s} chapterKey={chapter} />
      </main>
    </>
  );
}
