import Link from "next/link";

const EXPLORE = [
  { href: "/", label: "Today" },
  { href: "/brain", label: "Brain" },
  { href: "/blogs", label: "Blogs" },
  { href: "/blogs/dsa", label: "Pattern Atlas" },
  { href: "/notes", label: "Notes" },
  { href: "/recall", label: "Recall" },
];

const CONNECT = [
  { href: "/about", label: "About us" },
  { href: "mailto:sanyamgupta2307@gmail.com", label: "Contact us" },
  { href: "https://www.linkedin.com/in/sanyamgupta7/", label: "LinkedIn", external: true },
];

/** Global footer — brand, quick links, and ways to reach the human behind it. */
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/[0.06]">
      <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-10 sm:px-6 md:pb-10">
        <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <p className="display text-lg font-bold tracking-tight">Knovis</p>
            <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-faint">
              kno·vis <span className="italic">(n.)</span>{" "}
              — knowledge + vision, and yes, it sounds like
              &ldquo;novice&rdquo; on purpose. We help you see what you know,
              and keep seeing it.
            </p>
          </div>

          {/* Explore */}
          <div>
            <p className="micro mb-3">Explore</p>
            <ul className="space-y-2">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-muted transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="micro mb-3">Connect</p>
            <ul className="space-y-2">
              {CONNECT.map((l) =>
                l.external ? (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted transition-colors hover:text-white"
                    >
                      {l.label} ↗
                    </a>
                  </li>
                ) : (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.05] pt-6">
          <p className="text-xs text-faint">
            © {new Date().getFullYear()} Knovis · Built by Sanyam Gupta
          </p>
          <p className="text-xs text-faint">
            Made with an unhealthy respect for the forgetting curve.
          </p>
        </div>
      </div>
    </footer>
  );
}
