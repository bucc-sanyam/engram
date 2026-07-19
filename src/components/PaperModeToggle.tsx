"use client";

import { useReadingTheme } from "@/context/ReadingThemeContext";

export default function PaperModeToggle({ className = "" }: { className?: string }) {
  const { isPaperMode, isSnapping, togglePaperMode } = useReadingTheme();

  return (
    <button
      type="button"
      onClick={togglePaperMode}
      disabled={isSnapping}
      aria-label="Toggle Paper Mode reading view"
      title={isPaperMode ? "Switch to Dark Mode (Thanos Snap)" : "Switch to E-Ink Paper Mode (Thanos Snap)"}
      className={`group relative inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-all duration-300 ${
        isPaperMode
          ? "bg-[#1c1a17] text-[#f5f2eb] shadow-[0_2px_12px_rgba(28,26,23,0.25)] hover:bg-[#332e29]"
          : "bg-white/[0.06] text-[#f2f0eb] border border-white/10 hover:bg-white/[0.12] hover:border-white/20 shadow-[0_2px_14px_rgba(0,0,0,0.3)]"
      } ${isSnapping ? "scale-95 opacity-80" : "hover:scale-[1.03] active:scale-95"} ${className}`}
    >
      {isPaperMode ? (
        <>
          <MoonIcon className="h-3.5 w-3.5 text-[#f5b95f] transition-transform group-hover:-rotate-12" />
          <span>Ink Dark</span>
        </>
      ) : (
        <>
          <BookSparkleIcon className="h-3.5 w-3.5 text-[#f5b95f] transition-transform group-hover:rotate-12" />
          <span>Paper Mode</span>
        </>
      )}

      {/* Thanos snap visual indicator badge */}
      <span
        className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase ${
          isPaperMode
            ? "bg-[#b87b28]/20 text-[#b87b28]"
            : "bg-[#ff7a5c]/20 text-[#ff9a80]"
        }`}
      >
        Snap
      </span>
    </button>
  );
}

function BookSparkleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M12 6l.8 1.6L14.4 8l-1.6.8-.8 1.6-.8-1.6L9.6 8l1.6-.4z" />
    </svg>
  );
}

function MoonIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
