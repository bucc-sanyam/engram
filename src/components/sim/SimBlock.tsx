"use client";

import type { SimSpec } from "@/lib/sim/types";
import AnatomySim from "./AnatomySim";
import FigureSim from "./FigureSim";
import WorkedExampleSim from "./WorkedExampleSim";
import GraphPlotSim from "./GraphPlotSim";
import ParticleModelSim from "./ParticleModelSim";
import GeometryBoardSim from "./GeometryBoardSim";

/** Dispatches a typed SimSpec to its renderer. The union is exhaustive —
 *  adding a kind without a case here is a compile error. */
export default function SimBlock({ spec, accent }: { spec: SimSpec; accent: string }) {
  switch (spec.kind) {
    case "anatomy":
      return <AnatomySim spec={spec} accent={accent} />;
    case "figure":
      return <FigureSim spec={spec} accent={accent} />;
    case "worked-example":
      return <WorkedExampleSim spec={spec} accent={accent} />;
    case "graph-plot":
      return <GraphPlotSim spec={spec} accent={accent} />;
    case "particle-model":
      return <ParticleModelSim spec={spec} accent={accent} />;
    case "geometry-board":
      return <GeometryBoardSim spec={spec} accent={accent} />;
    default: {
      const _exhaustive: never = spec;
      return _exhaustive;
    }
  }
}
