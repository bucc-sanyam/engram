"use client";

import React from "react";
import Link from "next/link";
import { useReadingTheme } from "@/context/ReadingThemeContext";
import { darkenForPaper, tintForPaper } from "@/lib/viz-theme";

/**
 * Accent-coloured text that stays legible in Paper Mode.
 *
 * Topic accents are bright pastels tuned for the dark theme; on the cream page
 * they wash out. These wrappers darken the accent at render time when Paper
 * Mode is active (see `viz-theme.ts`), instead of relying on the brittle
 * `[style*="color:#…"]` CSS remaps that can't enumerate arbitrary per-topic hexes.
 */
export function AccentText({
  color,
  className,
  style,
  children,
  as: Tag = "span",
}: {
  color: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  as?: "span" | "p" | "div" | "h2" | "h3";
}) {
  const { isPaperMode } = useReadingTheme();
  const c = isPaperMode ? darkenForPaper(color) : color;
  return (
    <Tag className={className} style={{ ...style, color: c }}>
      {children}
    </Tag>
  );
}

/** Difficulty chip (Easy/Medium/Hard) — readable tinted pill in both themes. */
export function DifficultyPill({
  difficulty,
  color,
  className = "",
}: {
  difficulty: string;
  color: string;
  className?: string;
}) {
  const { isPaperMode } = useReadingTheme();
  const text = isPaperMode ? darkenForPaper(color) : color;
  const bg = isPaperMode ? tintForPaper(color, 0.16) : `${color}1a`;
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className}`}
      style={{ background: bg, color: text }}
    >
      {difficulty}
    </span>
  );
}

/**
 * Tinted accent pill that stays legible in Paper Mode. Renders as a `<Link>`
 * when `href` is given, otherwise a `<span>`.
 */
export function AccentPill({
  color,
  href,
  className = "",
  children,
}: {
  color: string;
  href?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { isPaperMode } = useReadingTheme();
  const style: React.CSSProperties = {
    background: isPaperMode ? tintForPaper(color, 0.16) : `${color}1a`,
    color: isPaperMode ? darkenForPaper(color) : color,
  };
  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <span className={className} style={style}>
      {children}
    </span>
  );
}




