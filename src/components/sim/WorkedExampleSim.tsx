"use client";

import { useState } from "react";
import type { WorkedExampleSpec } from "@/lib/sim/types";
import { useVizPalette } from "@/lib/viz-theme";
import SimSlider from "./controls/SimSlider";

export default function WorkedExampleSim({
  spec,
  accent,
}: {
  spec: WorkedExampleSpec;
  accent: string;
}) {
  const p = useVizPalette(accent);
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const inp of spec.inputs) init[inp.id] = inp.default;
    return init;
  });

  const set = (id: string, n: number) =>
    setValues((prev) => ({ ...prev, [id]: n }));

  let resultStr: string;
  try {
    resultStr = spec.result(values);
  } catch {
    resultStr = "—";
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold" style={{ color: p.accent }}>
        {spec.title}
      </h3>
      <p className="sr-only">{spec.altText}</p>

      {/* Sliders */}
      <div className="mb-4 flex flex-col gap-3">
        {spec.inputs.map((inp) => (
          <SimSlider
            key={inp.id}
            label={inp.label}
            min={inp.min}
            max={inp.max}
            step={inp.step}
            value={values[inp.id]}
            unit={inp.unit}
            accent={accent}
            onChange={(n) => set(inp.id, n)}
          />
        ))}
      </div>

      {/* Steps */}
      <ol className="flex flex-col gap-3">
        {spec.steps.map((step, i) => {
          let computed: string;
          try {
            computed = step.compute(values);
          } catch {
            computed = "—";
          }
          return (
            <li key={i}>
              <p className="text-xs" style={{ color: p.muted }}>
                {step.explain}
              </p>
              <p
                className="mt-0.5 text-sm"
                style={{
                  color: p.ink,
                  fontFamily: "var(--font-jetmono), monospace",
                }}
              >
                {computed}
              </p>
            </li>
          );
        })}
      </ol>

      {/* Result */}
      <div
        className="mt-4 rounded-xl px-4 py-3"
        style={{ backgroundColor: p.accentFill }}
      >
        <p
          className="text-base font-semibold"
          style={{
            color: p.accent,
            fontFamily: "var(--font-jetmono), monospace",
          }}
        >
          {resultStr}
        </p>
      </div>
    </div>
  );
}
