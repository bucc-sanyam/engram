import Link from "next/link";
import Nav from "@/components/Nav";

export const metadata = {
  title: "About — Engramia",
  description: "The human (singular) behind Engramia.",
};

/**
 * About page — one founder, one slightly dramatic origin story. Deliberately
 * quirky: the goal is that visitors leave smiling and knowing who to email.
 */
export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 pb-24 pt-10 sm:px-6">
        {/* Header */}
        <header className="rise relative mb-12">
          <div
            className="pointer-events-none absolute -left-24 -top-16 h-56 w-56 rounded-full bg-[#ff7a5c] opacity-15 blur-3xl"
            aria-hidden
          />
          <p className="micro mb-4 !text-[#f5b95f]">
            About us · population: 1
          </p>
          <h1 className="text-warm-gradient text-4xl font-bold leading-[1.1] sm:text-5xl">
            Hi, I&apos;m Sanyam. I built Engramia because my brain kept ghosting me.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            I&apos;m Sanyam Gupta — engineer, chronic learner, and former world
            champion at reading something brilliant on a Tuesday and forgetting
            it by Friday.
          </p>
        </header>

        {/* Origin story */}
        <section className="glass rise mb-6 p-6 sm:p-7">
          <p className="micro mb-3 !text-[#ff9a80]">The origin story</p>
          <div className="space-y-4 text-[15px] leading-relaxed text-white/85">
            <p>
              It went like this: I&apos;d learn something genuinely fascinating —
              how transformers work, why Rome fell, what Bayes was actually on
              about — feel smarter for roughly 72 hours, and then watch it quietly
              evaporate. My notes app became a graveyard of good intentions.
              Beautiful. Organised. Never opened again.
            </p>
            <p>
              A normal person would have made peace with this. I, instead, read a
              stack of memory-science papers (which, yes, I also started
              forgetting — the irony was not lost on me) and learned about the{" "}
              <span className="font-semibold text-white">engram</span>: the
              physical trace a memory leaves in your brain. Memories aren&apos;t
              files, they&apos;re footpaths — walk them again right before they
              fade and they turn into roads.
            </p>
            <p>
              So I built the thing that walks them for me. Engramia takes whatever
              you learn, wires it into a living knowledge graph, and quizzes you
              at exactly the moment you were about to forget. It is, in essence,
              a very polite nag with a PhD in timing.
            </p>
          </div>
        </section>

        {/* Beliefs */}
        <section className="glass rise mb-6 p-6 sm:p-7">
          <p className="micro mb-4 !text-[#43d6b5]">Things I firmly believe</p>
          <ul className="space-y-3 text-[15px] leading-relaxed text-white/85">
            {[
              ["01", "Re-reading your notes is the learning equivalent of watching the gym from your car."],
              ["02", "If you can't explain it from memory, you don't know it yet — you just recognise it."],
              ["03", "The forgetting curve is undefeated. But it can be negotiated with."],
              ["04", "Every 'I'll definitely remember this' is a lie we tell ourselves with total confidence."],
              ["05", "Knowledge compounds like interest — but only if you don't let the account leak."],
            ].map(([n, line]) => (
              <li key={n} className="flex gap-4">
                <span className="display shrink-0 text-lg font-bold tabular-nums text-[#43d6b5] opacity-50">
                  {n}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* The fine print */}
        <section className="rise mb-10 rounded-[2rem] bg-gradient-to-br from-[#f5b95f]/[0.08] via-transparent to-[#ff7a5c]/[0.04] p-6 sm:p-7">
          <p className="micro mb-3 !text-[#f5b95f]">Full disclosure</p>
          <p className="text-[15px] leading-relaxed text-white/85">
            There&apos;s no team page because there&apos;s no team — it&apos;s me,
            an editor, and an amount of coffee that my doctor would describe as
            &ldquo;a personality trait.&rdquo; If something breaks, I broke it.
            If something delights you, that was absolutely intentional and I
            planned it from the start.
          </p>
        </section>

        {/* Contact */}
        <section className="rise text-center">
          <h2 className="mb-2 text-2xl font-bold">Come say hi</h2>
          <p className="mx-auto mb-6 max-w-md text-muted">
            Ideas, bugs, memory-science hot takes, or just proof that you
            remembered something because of Engramia — my inbox is open.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href="mailto:sanyamgupta2307@gmail.com" className="btn-primary">
              Email me
            </a>
            <a
              href="https://www.linkedin.com/in/sanyamgupta7/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              LinkedIn (the serious version of me) ↗
            </a>
          </div>
          <p className="mt-10 text-sm text-faint">
            P.S. If you read this far, congratulations — that&apos;s exactly the
            kind of attention span we&apos;re trying to protect.{" "}
            <Link href="/add" className="text-muted underline underline-offset-2 transition-colors hover:text-white">
              Go feed your brain.
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
