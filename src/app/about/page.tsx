import Link from "next/link";
import Nav from "@/components/Nav";

export const metadata = {
  title: "About — Knovis",
  description: "The human (singular) behind Knovis.",
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
            Hi, I&apos;m Sanyam. I built Knovis because my brain kept ghosting me.
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
              forgetting — the irony was not lost on me) about how memories
              aren&apos;t files, they&apos;re footpaths — walk them again right
              before they fade and they turn into roads. What I actually wanted
              wasn&apos;t a name for forgetting. It was a name for the opposite:
              seeing what you know.
            </p>
            <p>
              So I landed on{" "}
              <span className="font-semibold text-white">Knovis</span>
              {" "}— knowledge plus vision. Say it out loud and it lands suspiciously
              close to &ldquo;novice,&rdquo; which I decided was a feature, not a
              bug. Because that&apos;s the secret nobody puts on the syllabus:
              every real learner stays a novice forever. You just get better at
              revisiting.
            </p>
            <p>
              So I built the thing that keeps you a well-informed novice on
              purpose. Knovis takes whatever you learn, wires it into a living
              knowledge graph, and quizzes you at exactly the moment you were
              about to forget. It is, in essence, a very polite nag with a PhD in
              timing.
            </p>
          </div>
        </section>

        {/* The Math behind the Magic */}
        <section className="glass rise mb-6 p-6 sm:p-7">
          <p className="micro mb-4 !text-[#3b82f6]">The math behind the nagging</p>
          <div className="space-y-4 text-[15px] leading-relaxed text-white/85">
            <p>
              Under the hood, Knovis uses something called the <strong>SM-2 algorithm</strong>. It was invented in the 80s, which makes it older than the internet you are currently scrolling, but it remains the gold standard for spaced repetition.
            </p>
            <p>
              Its entire job is to combat the <strong>Ebbinghaus Forgetting Curve</strong> — a rather depressing graph that illustrates how quickly your brain dumps information it doesn&apos;t think it needs.
            </p>
            
            {/* Graph container */}
            <div className="my-8 rounded-2xl bg-white/[0.02] p-4 sm:p-6 border border-white/[0.05]">
              <svg viewBox="0 0 500 250" className="w-full h-auto text-white" aria-label="Ebbinghaus Forgetting Curve Graph">
                {/* Axes */}
                <line x1="40" y1="210" x2="480" y2="210" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
                <line x1="40" y1="40" x2="40" y2="210" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
                
                {/* Labels */}
                <text x="36" y="55" fill="currentColor" opacity="0.5" fontSize="12" textAnchor="end">100%</text>
                <text x="36" y="215" fill="currentColor" opacity="0.5" fontSize="12" textAnchor="end">0%</text>
                
                <text x="260" y="240" fill="currentColor" opacity="0.5" fontSize="12" textAnchor="middle">Time (Days)</text>
                <text x="12" y="125" fill="currentColor" opacity="0.5" fontSize="12" textAnchor="middle" transform="rotate(-90 12 125)">Retention</text>

                {/* The sad forgetting curve (No reviews) */}
                <path d="M 40 50 Q 80 190, 460 200" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" />
                <text x="475" y="195" fill="#ef4444" fontSize="11" textAnchor="end">No review</text>

                {/* The SM-2 negotiated curves */}
                {/* Review 1 */}
                <line x1="100" y1="165" x2="100" y2="50" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="4 2" />
                <path d="M 100 50 Q 170 150, 460 170" fill="none" stroke="#f5b95f" strokeWidth="3" strokeLinecap="round" />
                
                {/* Review 2 */}
                <line x1="220" y1="120" x2="220" y2="50" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="4 2" />
                <path d="M 220 50 Q 320 120, 460 140" fill="none" stroke="#43d6b5" strokeWidth="3" strokeLinecap="round" />

                {/* Review 3 */}
                <line x1="360" y1="100" x2="360" y2="50" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="4 2" />
                <path d="M 360 50 Q 420 90, 480 100" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />

                {/* Data points */}
                <circle cx="40" cy="50" r="4" fill="#ef4444" />
                <circle cx="100" cy="50" r="4" fill="#f5b95f" />
                <circle cx="220" cy="50" r="4" fill="#43d6b5" />
                <circle cx="360" cy="50" r="4" fill="#3b82f6" />
                
                {/* Review Labels */}
                <text x="100" y="38" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="middle">Review 1</text>
                <text x="220" y="38" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="middle">Review 2</text>
                <text x="360" y="38" fill="currentColor" opacity="0.6" fontSize="10" textAnchor="middle">Review 3</text>
              </svg>
            </div>

            <p>
              Notice how the curve gets flatter every time you review? That&apos;s what SM-2 does. It calculates your personal &ldquo;ease factor&rdquo; and grades your recall from 0 (total blackout) to 5 (perfect). 
            </p>
            <p>
              If you bomb a question, it politely resets your interval and tests you again tomorrow. If you ace it, the algorithm aggressively kicks the can down the road, spacing out the reviews until the memory is basically superglued to your cortex. It&apos;s not magic — it&apos;s just very stubborn math.
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
            remembered something because of Knovis — my inbox is open.
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
