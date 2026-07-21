import { Fragment, type ReactNode } from "react";
import VizBlock from "./viz/VizBlock";

/**
 * A small, dependency-free Markdown renderer — enough for personal notes:
 * headings, bold/italic/inline-code, links, ordered/unordered lists,
 * blockquotes, fenced code, horizontal rules and paragraphs. Deliberately
 * forgiving rather than spec-perfect.
 */

// Only http(s)/mailto (or scheme-less relative) links render as clickable —
// blocks javascript:/data:/vbscript: URI XSS from a pasted markdown link.
function isSafeHref(href: string): boolean {
  if (/^[/#?]/.test(href) || href.startsWith("//")) return true; // relative/protocol-relative
  const scheme = href.match(/^([a-z][a-z0-9+.-]*):/i)?.[1]?.toLowerCase();
  if (!scheme) return true; // no scheme at all — treat as relative
  return scheme === "http" || scheme === "https" || scheme === "mailto";
}

// ---- inline math ($…$) — lightweight LaTeX-ish renderer ----
// The hand-authored DSA/SQL content is peppered with inline math like
// `$O(N^2)$`, `$O(1)$`, `$O(N \log K)$`, `$2^N$`, `$A_{left}$`. Without this
// they render as literal `$O(1)$` text. We don't pull in KaTeX (keeps the
// zero-dependency Markdown renderer) — instead we translate the common command
// set to Unicode + real <sup>/<sub> nodes, which covers everything used here.
const MATH_SYMBOLS: [RegExp, string][] = [
  [/\\cdot/g, "·"], [/\\times/g, "×"], [/\\div/g, "÷"],
  [/\\leq|\\le\b/g, "≤"], [/\\geq|\\ge\b/g, "≥"], [/\\neq|\\ne\b/g, "≠"],
  [/\\approx/g, "≈"], [/\\equiv/g, "≡"], [/\\pm/g, "±"], [/\\mp/g, "∓"],
  [/\\infty/g, "∞"], [/\\ldots|\\cdots|\\dots/g, "…"],
  [/\\in\b/g, "∈"], [/\\notin\b/g, "∉"], [/\\forall/g, "∀"], [/\\exists/g, "∃"],
  [/\\subseteq/g, "⊆"], [/\\subset/g, "⊂"], [/\\cup/g, "∪"], [/\\cap/g, "∩"],
  [/\\emptyset|\\varnothing/g, "∅"],
  [/\\Rightarrow/g, "⇒"], [/\\Leftarrow/g, "⇐"], [/\\rightarrow|\\to\b/g, "→"], [/\\leftarrow/g, "←"],
  [/\\sum/g, "∑"], [/\\prod/g, "∏"], [/\\sqrt/g, "√"], [/\\partial/g, "∂"], [/\\nabla/g, "∇"],
  [/\\log\b/g, "log"], [/\\ln\b/g, "ln"], [/\\lg\b/g, "lg"], [/\\bmod\b/g, "mod"],
  [/\\Theta/g, "Θ"], [/\\theta/g, "θ"], [/\\Omega/g, "Ω"], [/\\omega/g, "ω"],
  [/\\alpha/g, "α"], [/\\beta/g, "β"], [/\\gamma/g, "γ"], [/\\delta/g, "δ"],
  [/\\lambda/g, "λ"], [/\\mu/g, "μ"], [/\\pi/g, "π"], [/\\sigma/g, "σ"], [/\\phi/g, "φ"],
  [/\\lfloor/g, "⌊"], [/\\rfloor/g, "⌋"], [/\\lceil/g, "⌈"], [/\\rceil/g, "⌉"],
  [/\\%/g, "%"], [/\\&/g, "&"], [/\\#/g, "#"], [/\\_/g, "_"],
  [/\\,|\\;|\\:|\\!/g, " "], [/\\ /g, " "], [/\\left|\\right/g, ""],
];

// Distinguishes an inline-math span from a stray currency pair like
// "$1 billion … $3 billion" (real in the Competition Act content). Math is
// short, and either has a math operator/command or has no internal spaces.
function looksLikeMath(content: string): boolean {
  if (content.length > 60) return false; // long → prose, not a formula
  if (/[₹]|\b(billion|million|trillion|crore|lakh|USD|INR|dollars?)\b/i.test(content)) return false;
  return /[\\^_=<>≤≥≠+\-/·×∑∏√]|O\(|Θ\(|Ω\(/.test(content) || !/\s/.test(content);
}

// Parse `^`/`_` runs (with optional {…} grouping) into <sup>/<sub> nodes.
function tokenizeScripts(s: string, keyBase: number): ReactNode[] {
  const nodes: ReactNode[] = [];
  let buf = "";
  let k = 0;
  const flush = () => { if (buf) { nodes.push(buf); buf = ""; } };
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "^" || ch === "_") {
      flush();
      let content: string;
      if (s[i + 1] === "{") {
        const end = s.indexOf("}", i + 2);
        content = end === -1 ? s.slice(i + 1) : s.slice(i + 2, end);
        i = end === -1 ? s.length : end;
      } else {
        content = s[i + 1] ?? "";
        i += 1;
      }
      content = content.replace(/[{}]/g, "");
      nodes.push(
        ch === "^"
          ? <sup key={`${keyBase}-s-${k++}`}>{content}</sup>
          : <sub key={`${keyBase}-s-${k++}`}>{content}</sub>
      );
    } else if (ch === "{" || ch === "}") {
      // drop grouping braces
    } else {
      buf += ch;
    }
  }
  flush();
  return nodes;
}

function renderMath(tex: string, keyBase: number): ReactNode {
  let s = tex;
  for (const [re, rep] of MATH_SYMBOLS) s = s.replace(re, rep);
  // \frac{a}{b} → a⁄b
  s = s.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, "$1⁄$2");
  // Split out upright text runs (\text/\mathrm/\operatorname/…) from math runs;
  // words read upright, single-letter variables stay italic for a real math feel.
  const parts: ReactNode[] = [];
  const re = /\\(?:text|textrm|textbf|textit|mathrm|mathbf|mathit|operatorname|mbox)\{([^{}]*)\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) {
      parts.push(
        <em key={`${keyBase}-m-${k++}`} className="italic">
          {tokenizeScripts(s.slice(last, m.index), keyBase * 31 + k)}
        </em>
      );
    }
    parts.push(
      <span key={`${keyBase}-t-${k++}`} className="not-italic">
        {tokenizeScripts(m[1], keyBase * 37 + k)}
      </span>
    );
    last = m.index + m[0].length;
  }
  if (last < s.length) {
    parts.push(
      <em key={`${keyBase}-m-${k++}`} className="italic">
        {tokenizeScripts(s.slice(last), keyBase * 31 + k)}
      </em>
    );
  }
  return (
    <span key={keyBase} className="font-serif tracking-tight text-white/90">
      {parts}
    </span>
  );
}

// ---- inline (math / bold / italic / code / links) ----
type InlineRule = {
  re: RegExp;
  render: (m: RegExpMatchArray, key: number) => ReactNode;
};

const INLINE: InlineRule[] = [
  {
    re: /\$([^$\n]+)\$/,
    render: (m, key) =>
      looksLikeMath(m[1]) ? renderMath(m[1], key) : <Fragment key={key}>{m[0]}</Fragment>,
  },
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
    render: (m, key) =>
      isSafeHref(m[2]) ? (
        <a
          key={key}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#f5b95f] underline decoration-[#f5b95f]/40 underline-offset-2 hover:decoration-[#f5b95f]"
        >
          {m[1]}
        </a>
      ) : (
        <span key={key}>{m[1]}</span>
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
export default function Markdown({
  children,
  className,
  vizAccent,
  strictViz = false,
}: {
  children: string;
  className?: string;
  /** Accent colour passed through to `viz:*` diagrams (defaults per-primitive). */
  vizAccent?: string;
  /** Set by hand-authored story content — a malformed `viz:*` payload throws
   * (fails the SSG build loudly) instead of rendering an inline error card.
   * Never set for user-authored content (e.g. personal notes). */
  strictViz?: boolean;
}) {
  const lines = children.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // fenced code (and viz:* diagram blocks — same fence, an info-string tag)
    const fence = line.trim().match(/^```(\S*)/);
    if (fence) {
      const lang = fence[1] ?? "";
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) buf.push(lines[i++]);
      i++; // closing fence
      const content = buf.join("\n");
      if (lang.startsWith("viz:")) {
        blocks.push(<VizBlock key={key++} kind={lang.slice(4)} raw={content} accent={vizAccent} strict={strictViz} />);
      } else {
        blocks.push(
          <pre key={key++} className="my-3 overflow-x-auto rounded-xl bg-black/30 p-4 font-mono text-[0.85em] leading-relaxed text-white/85">
            <code>{content}</code>
          </pre>
        );
      }
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
