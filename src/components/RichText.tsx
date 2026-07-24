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

const MATH_SYMBOLS: [RegExp, string][] = [
  [/\\cdot/g, "·"], [/\\times/g, "×"], [/\\div/g, "÷"],
  [/\\leq|\\le\b/g, "≤"], [/\\geq|\\ge\b/g, "≥"], [/\\neq|\\ne\b/g, "≠"],
  [/\\approx/g, "≈"], [/\\equiv/g, "≡"], [/\\pm/g, "±"], [/\\mp/g, "∓"],
  [/\\infty/g, "∞"], [/\\ldots|\\cdots|\\dots/g, "…"],
  [/\\in\b/g, "∈"], [/\\notin\b/g, "∉"], [/\\forall/g, "∀"], [/\\exists/g, "∃"],
  [/\\subseteq/g, "⊆"], [/\\subset/g, "⊂"], [/\\cup/g, "∪"], [/\\cap/g, "∩"],
  [/\\emptyset|\\varnothing/g, "∅"],
  [/\\implies/g, "⇒"], [/\\iff/g, "⇔"],
  [/\\Rightarrow/g, "⇒"], [/\\Leftarrow/g, "⇐"], [/\\rightarrow|\\to\b/g, "→"], [/\\leftarrow/g, "←"],
  [/\\nearrow/g, "↗"], [/\\searrow/g, "↘"], [/\\swarrow/g, "↙"], [/\\nwarrow/g, "↖"],
  [/\\sum/g, "∑"], [/\\prod/g, "∏"], [/\\sqrt/g, "√"], [/\\partial/g, "∂"], [/\\nabla/g, "∇"],
  [/\\oplus/g, "⊕"], [/\\otimes/g, "⊗"], [/\\ll\b/g, "≪"], [/\\gg\b/g, "≫"],
  [/\\log\b/g, "log"], [/\\ln\b/g, "ln"], [/\\lg\b/g, "lg"], [/\\bmod\b/g, "mod"],
  [/\\Theta/g, "Θ"], [/\\theta/g, "θ"], [/\\Omega/g, "Ω"], [/\\omega/g, "ω"],
  [/\\alpha/g, "α"], [/\\beta/g, "β"], [/\\gamma/g, "γ"], [/\\delta/g, "δ"],
  [/\\lambda/g, "λ"], [/\\mu/g, "μ"], [/\\pi/g, "π"], [/\\sigma/g, "σ"], [/\\phi/g, "φ"],
  [/\\floor|\\lfloor/g, "⌊"], [/\\rfloor/g, "⌋"], [/\\ceil|\\lceil/g, "⌈"], [/\\rceil/g, "⌉"],
  [/\\quad|\\qquad/g, "  "],
  [/\\%/g, "%"], [/\\&/g, "&"], [/\\#/g, "#"], [/\\_/g, "_"],
  [/\\,|\\;|\\:|\\!/g, " "], [/\\ /g, " "], [/\\left|\\right/g, ""],
];

function looksLikeMath(content: string): boolean {
  if (/[₹]|\b(billion|million|trillion|crore|lakh|USD|INR|dollars?|cents?)\b/i.test(content)) return false;
  if (!/\s/.test(content)) return true;
  return /[\\^_=<>≤≥≠+\-*\/·×∑∏√:|&~,;!()[\]{}]|O\(|Θ\(|Ω\(/.test(content);
}

function renderMath(tex: string, key: number): ReactNode {
  let s = tex
    .replace(/\r(ightarrow|ight|eal|eturn|ho)/g, "\\r$1")
    .replace(/\t(ext|extrm|extbf|extit|o|au|heta|imes|ilde|op|riangle)/g, "\\t$1")
    .replace(/\n(otin|eq|abla|u|atural|earrow|warrow)/g, "\\n$1")
    .replace(/\b(eta|mod|inom|ar|ullet|oundary)/g, "\\b$1")
    .replace(/\\\\/g, "\\");

  for (const [re, rep] of MATH_SYMBOLS) s = s.replace(re, rep);
  s = s.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, "$1⁄$2");
  s = s.replace(/\\([a-zA-Z]+)/g, "$1");

  return (
    <span key={key} className="font-serif tracking-tight text-white/90 italic">
      {s}
    </span>
  );
}

// token order matters: math ($…$) before bold (**/__) before italic (*/_)
const RULES: Array<{
  re: RegExp;
  render: (inner: ReactNode, key: number, rawMatch?: string) => ReactNode;
}> = [
  {
    re: /\$([^$\n]+)\$/,
    render: (_, key, rawMatch) => {
      const innerStr = rawMatch?.slice(1, -1) ?? "";
      return looksLikeMath(innerStr) ? renderMath(innerStr, key) : <Fragment key={key}>{rawMatch}</Fragment>;
    },
  },
  { re: /\*\*([^*]+)\*\*/, render: (inner, key) => <strong key={key} className="font-semibold text-white">{inner}</strong> },
  { re: /__([^_]+)__/, render: (inner, key) => <strong key={key} className="font-semibold text-white">{inner}</strong> },
  { re: /`([^`]+)`/, render: (inner, key) => <code key={key} className="rounded-md bg-white/[0.07] px-1.5 py-0.5 font-mono text-[0.85em] text-[#f5b95f]">{inner}</code> },
  { re: /\*([^*\n]+)\*/, render: (inner, key) => <em key={key} className="italic text-white/95">{inner}</em> },
  { re: /_([^_\n]+)_/, render: (inner, key) => <em key={key} className="italic text-white/95">{inner}</em> },
];

function parse(text: string, keyOffset = 0): ReactNode[] {
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
    rule.render(parse(match[1], keyOffset + 1), keyOffset, match[0]),
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
