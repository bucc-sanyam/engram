"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BrainIcon } from "@/components/Nav";
import { BigScoreRing } from "@/components/ReportCardView";
import { clearGuestMode, isDemo } from "@/lib/demo";
import {
  DEMO_REVIEW_QUESTION,
  TOUR_STEPS,
  clearTourState,
  hasSeenTour,
  markTourSeen,
  readTourState,
  saveTourState,
  type TourState,
} from "@/lib/tour";

type SpotRect = { top: number; left: number; width: number; height: number };

const CARD_W = 400;
const CARD_W_CENTERED = 440;
const CARD_W_REVIEW = 460;
const CARD_H_EST = 260;
const GAP = 16;
const DIM = "rgba(8,7,12,0.78)";

/**
 * Full-screen guided tour: dims the page, cuts a glowing spotlight around the
 * feature being described, and floats a translucent step card next to it.
 * Mounted once in the root layout; renders nothing unless a tour is armed
 * (see src/lib/tour.ts for when that happens).
 */
export default function TutorialTour() {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<TourState | null>(null);
  const [rect, setRect] = useState<SpotRect | null>(null);
  const [ready, setReady] = useState(false);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const tourActive = useRef(false);

  // Block link navigation while the tour is active so a stray click on the
  // Nav, a plan row, a blog card, etc. can't route the visitor away from the
  // guided flow — the tour drives its own navigation via router.push.
  // Everything that *isn't* a link (buttons, the brain canvas, inputs) is
  // untouched, so spotlighted features stay genuinely clickable. Opt out
  // with `data-allow-nav` on an ancestor (used by the demo-mode add gate).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!tourActive.current) return;
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor || anchor.closest("[data-allow-nav]")) return;
      e.preventDefault();
      e.stopPropagation();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // Pick up an armed tour after mount (storage is client-only). Visitors who
  // land straight in demo mode without ever finishing the tour still get it.
  useEffect(() => {
    const s = readTourState();
    if (s) {
      setState(s);
      return;
    }
    if (window.location.pathname !== "/login" && isDemo && !hasSeenTour()) {
      setState({ mode: "first", step: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const upd = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    upd();
    window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  // Step driver: navigate to the step's page, then poll for its anchor —
  // pages load their data client-side, so the target can appear late. The
  // same poll keeps the spotlight glued to the element afterwards.
  useEffect(() => {
    if (!state) return;
    const step = TOUR_STEPS[state.step];
    saveTourState(state);
    setReady(false);
    setRect(null);

    if (window.location.pathname !== step.route) router.push(step.route);

    let el: HTMLElement | null = null;
    let scrolled = false;
    let tries = 0;

    const tick = () => {
      if (window.location.pathname !== step.route) return;
      if (!step.target) {
        setReady(true);
        return;
      }
      if (!el || !el.isConnected) {
        el = null;
        scrolled = false;
        // Several elements can share an anchor (desktop vs mobile nav) —
        // spotlight the one that's actually visible.
        const nodes = document.querySelectorAll<HTMLElement>(`[data-tour="${step.target}"]`);
        for (const n of Array.from(nodes)) {
          const r = n.getBoundingClientRect();
          if (r.width > 4 && r.height > 4) {
            el = n;
            break;
          }
        }
      }
      if (el) {
        if (!scrolled) {
          el.scrollIntoView({ block: "center", behavior: "auto" });
          scrolled = true;
        }
        const r = el.getBoundingClientRect();
        setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
        setReady(true);
      } else if (++tries > 33) {
        // Anchor never appeared (edge layouts / empty states) — show the
        // step centered rather than stalling the tour.
        setReady(true);
      }
    };

    tick();
    const iv = window.setInterval(tick, 150);
    return () => window.clearInterval(iv);
  }, [state, router, pathname]);

  const total = TOUR_STEPS.length;

  function end() {
    if (!state) return;
    const wasFirstVisit = state.mode === "first";
    markTourSeen();
    clearTourState();
    setState(null);
    if (wasFirstVisit) {
      // First-ever visit: demo mode only existed to power the tour — hand
      // the visitor to the login page to start for real.
      clearGuestMode();
      window.location.assign("/login");
    }
  }

  function next() {
    if (!state) return;
    if (state.step >= total - 1) return end();
    setState({ ...state, step: state.step + 1 });
  }

  function back() {
    if (state && state.step > 0) setState({ ...state, step: state.step - 1 });
  }

  useEffect(() => {
    if (!state) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") end();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  tourActive.current = !!state;

  if (!state || vp.w === 0) return null;

  const step = TOUR_STEPS[state.step];
  const body = state.mode === "demo" && step.bodyDemo ? step.bodyDemo : step.body;
  const isMobile = vp.w < 768;
  const pad = 10;
  const spot =
    ready && rect
      ? {
          top: rect.top - pad,
          left: rect.left - pad,
          width: rect.width + pad * 2,
          height: rect.height + pad * 2,
        }
      : null;

  // Place the card below the spotlight, above it when there's no room, or
  // floated near the bottom when the target fills the screen (3D brain).
  const centeredW = step.custom === "review-demo" ? CARD_W_REVIEW : CARD_W_CENTERED;
  const cardW = Math.min(spot ? CARD_W : centeredW, vp.w - 32);
  let cardStyle: React.CSSProperties;
  if (!spot) {
    const halfH = step.custom === "review-demo" ? 260 : 190;
    cardStyle = {
      left: Math.max(GAP, (vp.w - cardW) / 2),
      top: Math.max(24, vp.h * 0.5 - halfH),
      width: cardW,
    };
  } else if (isMobile) {
    cardStyle = { left: 12, right: 12, bottom: "calc(88px + env(safe-area-inset-bottom))" };
  } else {
    const below = spot.top + spot.height + GAP;
    let top: number;
    if (below + CARD_H_EST + GAP <= vp.h) top = below;
    else if (spot.top - CARD_H_EST - GAP >= GAP) top = spot.top - CARD_H_EST - GAP;
    else top = vp.h - CARD_H_EST - GAP * 1.5;
    top = Math.min(Math.max(GAP, top), vp.h - CARD_H_EST - GAP);
    const left = Math.min(Math.max(GAP, spot.left), vp.w - cardW - GAP);
    cardStyle = { top, left, width: cardW };
  }

  const centered = !spot;

  return (
    <div
      className="fixed inset-0 z-[120]"
      style={{ pointerEvents: spot ? "none" : "auto" }}
      role="dialog"
      aria-modal="true"
      aria-label="Guided tour"
    >
      {/* Dim + click shield on centered steps (nothing underneath is meant to
          be touched). Spotlight steps make the whole overlay pointer-events:
          none, so the spotlighted feature underneath stays genuinely
          clickable (calendar days, the brain canvas, search, …) — only the
          tour card re-enables pointer-events on itself. Dimming there comes
          from the cut-out shadow below, which is pointer-events-none too.
          Link navigation is still blocked globally so a stray click can't
          route away from the tour. */}
      {!spot && (
        <div
          className="absolute inset-0"
          style={{ background: DIM, backdropFilter: "blur(3px)", WebkitBackdropFilter: "blur(3px)" }}
        />
      )}

      {spot && (
        <div
          className="pointer-events-none absolute"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            borderRadius: 26,
            boxShadow: `0 0 0 200vmax ${DIM}, 0 0 0 1.5px rgba(245,185,95,0.4), 0 0 60px rgba(245,185,95,0.14), inset 0 0 44px rgba(245,185,95,0.05)`,
            transition: "top .18s ease-out, left .18s ease-out, width .18s ease-out, height .18s ease-out",
          }}
        />
      )}

      {ready && (
        <div key={state.step} className={`tour-card ${centered ? "text-center" : ""}`} style={cardStyle}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="micro !text-[#f5b95f]">
              tour · {state.step + 1} / {total}
            </p>
            <button onClick={end} className="micro !text-faint transition-colors hover:!text-white">
              skip ✕
            </button>
          </div>

          {step.custom === "review-demo" ? (
            <ReviewDemoCard title={step.title} onBack={state.step > 0 ? back : undefined} onContinue={next} />
          ) : (
            <>
              {centered && (
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#ff7a5c] to-[#f5b95f] shadow-[0_0_40px_rgba(255,122,92,0.5)]">
                  <BrainIcon className="h-8 w-8 text-[#1a120e]" />
                </span>
              )}

              <h3 className="display mb-2 text-[19px] font-bold leading-snug">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{body}</p>

              <div className={`mt-5 flex items-center gap-3 ${centered ? "justify-center" : "justify-between"}`}>
                {!centered && (
                  <div className="flex items-center gap-1.5" aria-hidden>
                    {TOUR_STEPS.map((_, i) => (
                      <span
                        key={i}
                        className={`rounded-full transition-all duration-300 ${
                          i === state.step
                            ? "h-1.5 w-5 bg-gradient-to-r from-[#ff7a5c] to-[#f5b95f]"
                            : "h-1.5 w-1.5 bg-white/15"
                        }`}
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {state.step > 0 && (
                    <button
                      onClick={back}
                      className="rounded-full bg-white/[0.06] px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:bg-white/[0.1] hover:text-white"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={next}
                    className="rounded-full bg-gradient-to-r from-[#ff7a5c] to-[#f5b95f] px-5 py-2 text-[13px] font-semibold text-[#1a120e] shadow-[0_0_18px_rgba(255,122,92,0.35)] transition-all hover:shadow-[0_0_28px_rgba(255,122,92,0.55)]"
                  >
                    {state.step === total - 1
                      ? state.mode === "first"
                        ? "Create my account →"
                        : "Start exploring →"
                      : state.step === 0
                        ? "Show me around →"
                        : "Next →"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Self-contained mock review question, embedded directly in the tour card —
 * never touches real quiz state or Supabase, so it works identically for
 * every visitor regardless of demo progress. Submitting reveals a mocked
 * report card, then "Continue" advances the tour like any other step.
 */
function ReviewDemoCard({
  title,
  onBack,
  onContinue,
}: {
  title: string;
  onBack?: () => void;
  onContinue: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const q = DEMO_REVIEW_QUESTION;
  const correct = selected === q.correctIndex;

  if (!submitted) {
    return (
      <>
        <h3 className="display mb-2 text-[19px] font-bold leading-snug">{title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-muted">
          Here&apos;s a made-up question so you can feel the flow — pick an answer and submit it.
        </p>
        <div className="rounded-2xl bg-white/[0.03] p-4">
          <p className="micro mb-3 !text-[#f5b95f]">
            {q.kind} · {q.topic}
          </p>
          <p className="mb-4 font-medium leading-relaxed">{q.prompt}</p>
          <div className="space-y-1.5">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-left text-sm leading-relaxed transition-colors ${
                  selected === i
                    ? "border-[#f5b95f]/50 bg-[#f5b95f]/[0.1] text-white"
                    : "border-white/[0.07] text-white/70 hover:bg-white/[0.04]"
                }`}
              >
                <span className="mr-2 text-xs font-bold">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3">
          {onBack ? (
            <button
              onClick={onBack}
              className="rounded-full bg-white/[0.06] px-4 py-2 text-[13px] font-medium text-muted transition-colors hover:bg-white/[0.1] hover:text-white"
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <button
            onClick={() => setSubmitted(true)}
            disabled={selected === null}
            className="btn-primary disabled:opacity-40"
          >
            Submit answer
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        <BigScoreRing pct={correct ? 100 : 40} />
        <div>
          <p className="font-bold leading-snug">{correct ? "Nice — correct!" : "Close, not quite."}</p>
          <p className="micro mt-0.5">demo report card</p>
        </div>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-white/85">
        {correct ? q.correctFeedback : q.incorrectFeedback}
      </p>
      <div className="rounded-2xl bg-[#43d6b5]/[0.05] p-4">
        <p className="micro mb-1.5 !text-[#43d6b5]">Correct answer</p>
        <p className="text-sm leading-relaxed text-muted">{q.options[q.correctIndex]}</p>
      </div>
      <button onClick={onContinue} className="btn-primary mt-5 w-full justify-center">
        Continue →
      </button>
    </>
  );
}
