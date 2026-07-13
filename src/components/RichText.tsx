import { Fragment, type ReactNode } from "react";

/**
 * Gemini sometimes emits light markdown (**bold**, *italic*, `code`). Rather
 * than stripping it (which flattens emphasis), render it as styled inline nodes
 * so the copy keeps its typographic texture — bold reads as a warm accent,
 * italics stay italic, inline code gets a mono chip.
 */

// leading #, list bullets and stray heading markers add nothing inline — drop them
function tidy(s: string): string {
  return s
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*•]\s+/gm, "")
    .trim();
}

// token order matters: bold (**/__) before italic (*/_) so ** isn't eaten as two *
const RULES: Array<{ re: RegExp; render: (inner: ReactNode, key: number) => ReactNode }> = [
  { re: /\*\*([^*]+)\*\*/, render: (inner, key) => <strong key={key} className="font-semibold text-white">{inner}</strong> },
  { re: /__([^_]+)__/, render: (inner, key) => <strong key={key} className="font-semibold text-white">{inner}</strong> },
  { re: /`([^`]+)`/, render: (inner, key) => <code key={key} className="rounded-md bg-white/[0.07] px-1.5 py-0.5 font-mono text-[0.85em] text-[#f5b95f]">{inner}</code> },
  { re: /\*([^*\n]+)\*/, render: (inner, key) => <em key={key} className="italic text-white/95">{inner}</em> },
  { re: /_([^_\n]+)_/, render: (inner, key) => <em key={key} className="italic text-white/95">{inner}</em> },
];

function parse(text: string, keyOffset = 0): ReactNode[] {
  // find the earliest-matching rule and recurse around it
  let best: { rule: (typeof RULES)[number]; match: RegExpMatchArray } | null = null;
  for (const rule of RULES) {
    const m = text.match(rule.re);
    if (m && m.index !== undefined && (!best || m.index < best.match.index!)) {
      best = { rule, match: m };
    }
  }
  if (!best) return [text];

  const { match, rule } = best;
  const start = match.index!;
  const before = text.slice(0, start);
  const after = text.slice(start + match[0].length);
  return [
    before,
    rule.render(parse(match[1], keyOffset + 1), keyOffset),
    ...parse(after, keyOffset + 2),
  ];
}

export default function RichText({ children, className }: { children: string; className?: string }) {
  const nodes = parse(tidy(children));
  return (
    <span className={className}>
      {nodes.map((n, i) => (
        <Fragment key={i}>{n}</Fragment>
      ))}
    </span>
  );
}
