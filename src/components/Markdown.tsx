import { Fragment, type ReactNode } from "react";

/**
 * A small, dependency-free Markdown renderer — enough for personal notes:
 * headings, bold/italic/inline-code, links, ordered/unordered lists,
 * blockquotes, fenced code, horizontal rules and paragraphs. Deliberately
 * forgiving rather than spec-perfect.
 */

// ---- inline (bold / italic / code / links) ----
type InlineRule = {
  re: RegExp;
  render: (m: RegExpMatchArray, key: number) => ReactNode;
};

const INLINE: InlineRule[] = [
  {
    re: /`([^`]+)`/,
    render: (m, key) => (
      <code key={key} className="rounded-md bg-white/[0.08] px-1.5 py-0.5 font-mono text-[0.85em] text-[#f5b95f]">
        {m[1]}
      </code>
    ),
  },
  {
    re: /\[([^\]]+)\]\(([^)\s]+)\)/,
    render: (m, key) => (
      <a
        key={key}
        href={m[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-[#f5b95f] underline decoration-[#f5b95f]/40 underline-offset-2 hover:decoration-[#f5b95f]"
      >
        {m[1]}
      </a>
    ),
  },
  {
    re: /\*\*([^*]+)\*\*/,
    render: (m, key) => <strong key={key} className="font-semibold text-white">{inline(m[1], key * 97)}</strong>,
  },
  {
    re: /(?<![*\w])\*([^*\n]+)\*(?!\w)/,
    render: (m, key) => <em key={key} className="italic">{inline(m[1], key * 89)}</em>,
  },
];

function inline(text: string, keyBase = 0): ReactNode[] {
  let best: { rule: InlineRule; m: RegExpMatchArray } | null = null;
  for (const rule of INLINE) {
    const m = text.match(rule.re);
    if (m && m.index !== undefined && (!best || m.index < best.m.index!)) best = { rule, m };
  }
  if (!best) return [text];
  const { m, rule } = best;
  const start = m.index!;
  return [
    text.slice(0, start),
    rule.render(m, keyBase + start + 1),
    ...inline(text.slice(start + m[0].length), keyBase + start + 2),
  ];
}

// ---- block level ----
export default function Markdown({ children, className }: { children: string; className?: string }) {
  const lines = children.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // fenced code
    if (/^```/.test(line.trim())) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) buf.push(lines[i++]);
      i++; // closing fence
      blocks.push(
        <pre key={key++} className="my-3 overflow-x-auto rounded-xl bg-black/30 p-4 font-mono text-[0.85em] leading-relaxed text-white/85">
          <code>{buf.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // blank
    if (line.trim() === "") { i++; continue; }

    // horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push(<hr key={key++} className="my-5 border-white/10" />);
      i++;
      continue;
    }

    // headings
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const sizes = ["text-2xl", "text-xl", "text-lg", "text-base", "text-sm", "text-sm"];
      blocks.push(
        <p key={key++} className={`display mt-4 mb-2 font-bold text-white ${sizes[level - 1]}`}>
          {inline(h[2])}
        </p>
      );
      i++;
      continue;
    }

    // blockquote
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      blocks.push(
        <blockquote key={key++} className="my-3 border-l-2 border-[#f5b95f]/50 pl-4 italic text-white/70">
          {inline(buf.join(" "))}
        </blockquote>
      );
      continue;
    }

    // ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+\.\s+/, ""));
      blocks.push(
        <ol key={key++} className="my-3 ml-1 list-decimal space-y-1.5 pl-5 marker:text-faint">
          {items.map((it, j) => <li key={j} className="pl-1">{inline(it)}</li>)}
        </ol>
      );
      continue;
    }

    // unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*+]\s+/, ""));
      blocks.push(
        <ul key={key++} className="my-3 space-y-1.5">
          {items.map((it, j) => (
            <li key={j} className="flex gap-2.5">
              <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[#f5b95f]/70" />
              <span className="flex-1">{inline(it)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // paragraph — gather consecutive non-blank, non-block lines
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^```/.test(lines[i].trim()) &&
      !/^(#{1,6})\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^(-{3,}|\*{3,}|_{3,})$/.test(lines[i].trim())
    ) {
      buf.push(lines[i++]);
    }
    blocks.push(
      <p key={key++} className="my-2.5 leading-relaxed">
        {buf.map((b, j) => (
          <Fragment key={j}>
            {j > 0 && <br />}
            {inline(b)}
          </Fragment>
        ))}
      </p>
    );
  }

  return <div className={className}>{blocks}</div>;
}
