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
      {/* Two widths, because this route has two layouts. Below 1400 it is a
          single reading column and wants an article measure. At 1400 the rail
          appears and the page fills the window instead — wider than anything
          else on the site, deliberately: at `max-w-6xl` the diagram rail took
          more of the page than the prose it illustrates. `Nav` mirrors both
          (see WIDE_ROUTE there) so the wordmark stays over the title. */}
      <main className="mx-auto w-full max-w-[46rem] flex-1 px-5 pb-32 pt-8 sm:px-8 md:pb-24 min-[1400px]:max-w-[1600px]">
        <ChapterReader subject={s} chapterKey={chapter} />
      </main>
    </>
  );
}
