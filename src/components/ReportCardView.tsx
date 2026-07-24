"use client";

import RichText from "@/components/RichText";
import type { ReportCard, ReportItem } from "@/lib/types";

export const KIND_LABEL: Record<string, string> = {
  open: "Deep recall",
  quickfire: "Quick-fire",
  mcq: "Multiple choice",
  truefalse: "True or false",
  multi: "Multi-select",
};

/**
 * The full report card: score header + one detailed card per question
 * (prompt, the answer given, the correct answer, feedback). Shared by the
 * /recall report phase and the calendar's day-report modal.
 */
export default function ReportCardView({
  report,
  heading = "Report card",
}: {
  report: ReportCard;
  heading?: string;
}) {
  return (
    <div className="space-y-5">
      <div className="glass p-7 text-center sm:p-8">
        <p className="micro mb-4">{heading} · {report.date}</p>
        <div className="mb-4 flex items-center justify-center gap-6">
          <BigScoreRing pct={report.score_pct} />
          <div className="text-left">
            <div className="display text-2xl font-bold text-[#43d6b5]">
              {report.items.length} question{report.items.length === 1 ? "" : "s"}
            </div>
            <div className="text-sm text-muted">
              {report.items.filter((i) => !i.skipped).length} answered ·{" "}
              {report.items.filter((i) => i.skipped).length} skipped
            </div>
          </div>
        </div>
        <p className="mx-auto max-w-lg leading-relaxed text-white/85">{report.summary}</p>

        {(report.strengths.length > 0 || report.focus.length > 0) && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {report.strengths.map((s) => (
              <span key={s} className="rounded-full bg-[#43d6b5]/[0.12] px-3.5 py-1.5 text-xs font-semibold text-[#7fe5cb]">
                ✓ {s}
              </span>
            ))}
            {report.focus.map((s) => (
              <span key={s} className="rounded-full bg-[#f5b95f]/[0.12] px-3.5 py-1.5 text-xs font-semibold text-[#f5b95f]">
                ↺ {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {report.items.map((r) => (
        <ReportItemCard key={r.index} item={r} />
      ))}
    </div>
  );
}

export function ReportItemCard({ item }: { item: ReportItem }) {
  const isChoice = item.kind === "mcq" || item.kind === "truefalse" || item.kind === "multi";
  const isMulti = item.kind === "multi";
  return (
    <div className="glass p-6">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="font-semibold">{item.topic_name}</span>
        <span className="micro rounded-full bg-white/[0.05] px-3 py-1">
          {KIND_LABEL[item.kind] ?? item.kind}
        </span>
        <span className="ml-auto shrink-0">
          {item.skipped ? (
            <span className="micro rounded-full bg-white/[0.05] px-3 py-1.5">Skipped</span>
          ) : isChoice ? (
            <span
              className="rounded-full px-3 py-1.5 text-xs font-bold"
              style={{
                background: item.correct ? "#43d6b51c" : item.score > 0 && isMulti ? "#f5b95f1c" : "#f871711c",
                color: item.correct ? "#43d6b5" : item.score > 0 && isMulti ? "#f5b95f" : "#f87171",
              }}
            >
              {item.correct ? "✓ Correct" : item.score > 0 && isMulti ? "◐ Partly right" : "✗ Incorrect"}
            </span>
          ) : (
            <ScoreRing score={item.score} size={44} />
          )}
        </span>
      </div>

      <RichText className="mb-4 block font-medium leading-relaxed">{item.prompt}</RichText>

      {isChoice && item.options ? (
        <div className="mb-4 space-y-1.5">
          {item.options.map((opt, i) => {
            const isCorrect = isMulti
              ? item.correct_indices?.includes(i) ?? false
              : i === item.correct_index;
            const isPicked = isMulti
              ? item.selected_indices?.includes(i) ?? false
              : i === item.selected_index;
            return (
              <div
                key={i}
                className={`rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed ${
                  isCorrect
                    ? "border-[#43d6b5]/50 bg-[#43d6b5]/[0.08] text-[#7fe5cb]"
                    : isPicked
                      ? "border-[#f87171]/50 bg-[#f87171]/[0.07] text-[#fca5a5]"
                      : "border-white/[0.06] text-white/60"
                }`}
              >
                <span className="mr-2 text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                <RichText className="inline">{opt}</RichText>
                {isCorrect && <span className="ml-2 text-xs">✓{isPicked ? " your pick" : ""}</span>}
                {isPicked && !isCorrect && <span className="ml-2 text-xs">your pick</span>}
              </div>
            );
          })}
        </div>
      ) : (
        !item.skipped &&
        item.answer && (
          <div className="mb-4 rounded-2xl bg-white/[0.03] p-4">
            <div className="micro mb-1.5">Your answer</div>
            <RichText className="block text-sm leading-relaxed text-white/75">{item.answer}</RichText>
          </div>
        )
      )}

      {item.feedback && <RichText className="mb-4 block text-sm leading-relaxed text-white/85">{item.feedback}</RichText>}

      {item.correct_answer && (
        <div className="rounded-2xl bg-[#43d6b5]/[0.05] p-4">
          <div className="micro mb-1.5 !text-[#43d6b5]">
            {isChoice ? "Correct answer" : "Model answer"}
          </div>
          <RichText className="block text-sm leading-relaxed text-muted">{item.correct_answer}</RichText>
        </div>
      )}
    </div>
  );
}

export function BigScoreRing({ pct }: { pct: number }) {
  const color = pct >= 75 ? "#43d6b5" : pct >= 50 ? "#f5b95f" : "#f87171";
  const C = 2 * Math.PI * 40;
  return (
    <svg width="104" height="104" viewBox="0 0 104 104">
      <circle cx="52" cy="52" r="40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
      <circle
        cx="52" cy="52" r="40" fill="none"
        stroke={color} strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * C} ${C}`}
        transform="rotate(-90 52 52)"
      />
      <text x="52" y="52" textAnchor="middle" dominantBaseline="central" fill={color} fontSize="22" fontWeight="700">
        {pct}%
      </text>
    </svg>
  );
}

export function ScoreRing({ score, size = 68 }: { score: number; size?: number }) {
  const pct = (score / 5) * 100;
  const color = score >= 4 ? "#43d6b5" : score >= 3 ? "#f5b95f" : "#f87171";
  const r = size * 0.38;
  const C = 2 * Math.PI * r;
  const mid = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={mid} cy={mid} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={size * 0.09} />
      <circle
        cx={mid} cy={mid} r={r} fill="none"
        stroke={color} strokeWidth={size * 0.09} strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * C} ${C}`}
        transform={`rotate(-90 ${mid} ${mid})`}
      />
      <text x={mid} y={mid} textAnchor="middle" dominantBaseline="central" fill={color} fontSize={size * 0.28} fontWeight="700">
        {score}
      </text>
    </svg>
  );
}
