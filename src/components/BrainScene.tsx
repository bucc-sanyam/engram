"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { Topic, TopicLink } from "@/lib/types";
import { categoryColor } from "@/lib/types";

/**
 * A stylised 3D human brain rendered as a glowing particle shell.
 * Topics are not floating spheres — each one lights up a patch of the
 * cortex (a brighter cluster of surface particles + a soft bloom), so it
 * reads as the brain itself glowing there. Titles surface on hover.
 * Selecting topics walks a lit "route" across the brain: consecutive
 * picks light the synapse between them and pulse along it.
 *
 * Optimised for 200+ topic nodes: merged cluster draw call, throttled
 * label declutter, per-vertex sizing, capped pixel ratio.
 */

// ---------- deterministic randomness (topics keep their spot on the cortex) ----------
function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Point on a stylised brain cortex. sign: +1 right hemisphere, -1 left. */
function brainPoint(u: number, v: number, sign: number, part: 'cortex' | 'cerebellum' = 'cortex', out = new THREE.Vector3()) {
  let x = 0, y = 0, z = 0;
  let crease = 0;
  let isCerebellum = part === 'cerebellum';

  if (part === 'cortex') {
    const clampU = Math.max(-1, Math.min(1, 1 - 1.55 * u));
    const phi = Math.acos(clampU);
    const lam = v * Math.PI;
    
    // Base shape
    x = 1.35 * Math.sin(phi) * Math.cos(lam);
    y = 0.9 * Math.cos(phi);
    z = 0.65 * Math.sin(phi) * Math.sin(lam);
    
    // Frontal taper (narrower front, wider back)
    z *= 0.7 + 0.25 * ((x + 1.4) / 2.8);
    
    // Flatten underside
    if (y < -0.4 && x < 0.4) {
      y = -0.4 + (y + 0.4) * 0.4;
    }
    
    // Geometric sulci
    const f1 = Math.sin(8 * phi + 4 * lam);
    const f2 = Math.sin(6 * lam + 2 * phi);
    const f3 = Math.sin(10 * phi) * Math.sin(8 * lam);
    
    // Absolute value creates round bulbous ridges and sharp, deep valleys
    const wave = Math.abs((f1 * f2) * 0.6 + f3 * 0.4);
    
    crease = wave; // values > 0 are valleys
    
    // Pull inwards aggressively in valleys (muscle folds)
    const pull = 1 - 0.25 * crease;
    x *= pull; y *= pull; z *= pull;
    
    // Medial gap
    const medialGap = 0.06 + 0.02 * Math.max(0, y);
    z += medialGap; // shift out from center
  } 
  else if (part === 'cerebellum') {
    // Squashed ellipsoid tucked under rear
    const theta = u * 2 * Math.PI;
    const clampV = Math.max(-1, Math.min(1, 2 * v - 1));
    const phi = Math.acos(clampV);
    
    x = 0.85 + 0.35 * Math.sin(phi) * Math.cos(theta); // rear
    y = -0.65 + 0.25 * Math.cos(phi); // under
    z = 0.45 * Math.sin(phi) * Math.sin(theta);
    
    // Horizontal striations
    const rings = Math.abs(Math.sin(y * 45));
    const rScale = 1 - 0.05 * rings;
    
    // apply striation radius modulation towards center of cerebellum
    const cx = 0.85, cy = -0.65, cz = 0;
    x = cx + (x - cx) * rScale;
    y = cy + (y - cy) * rScale;
    z = cz + (z - cz) * rScale;
    
    z += 0.03; // small medial gap
  }
  
  out.set(x, y, sign * z);
  return { pos: out, crease, isCerebellum };
}

const LOBES = [
  { name: 'Frontal', uRange: [0.1, 0.8], vRange: [0.55, 0.95] },
  { name: 'Parietal', uRange: [0.05, 0.45], vRange: [0.25, 0.6] },
  { name: 'Temporal', uRange: [0.5, 0.9], vRange: [0.35, 0.85] },
  { name: 'Occipital', uRange: [0.2, 0.7], vRange: [0.05, 0.3] },
  { name: 'Cerebellum', uRange: [0.0, 1.0], vRange: [0.0, 1.0] },
];

function placeTopic(topic: Topic, rng: () => number, existingPoints: THREE.Vector3[]) {
  const lobeIdx = hashStr(topic.category || "") % LOBES.length;
  const lobe = LOBES[lobeIdx];
  const sign = rng() < 0.5 ? 1 : -1;
  const part = lobe.name === 'Cerebellum' ? 'cerebellum' : 'cortex';
  
  let bestPos = new THREE.Vector3();
  let bestDist = -1;
  let bestU = 0, bestV = 0;
  
  const CANDIDATES = 15;
  for (let i = 0; i < CANDIDATES; i++) {
    const u = lobe.uRange[0] + rng() * (lobe.uRange[1] - lobe.uRange[0]);
    const v = lobe.vRange[0] + rng() * (lobe.vRange[1] - lobe.vRange[0]);
    const { pos } = brainPoint(u, v, sign, part, new THREE.Vector3());
    
    let minDist = 999;
    for (const ep of existingPoints) {
      const d = pos.distanceToSquared(ep);
      if (d < minDist) minDist = d;
    }
    if (minDist > bestDist) {
      bestDist = minDist;
      bestPos.copy(pos);
      bestU = u;
      bestV = v;
    }
  }
  
  existingPoints.push(bestPos.clone());
  return { pos: bestPos, sign, u: bestU, v: bestV, part };
}

// ---------- sprite textures ----------
function makeCircleTexture(size = 64) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.4, "rgba(255,255,255,0.8)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

/** A softer, wider falloff — used for the outer bloom halo. */
function makeGlowTexture(size = 128) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.25, "rgba(255,255,255,0.45)");
  g.addColorStop(0.6, "rgba(255,255,255,0.12)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(c);
}

function makeLabelTexture(text: string, font: string) {
  const c = document.createElement("canvas");
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 2;
  // draw() (re)renders the glyphs and returns the canvas aspect so the sprite
  // can be scaled to match. Kept as a closure so a label can be redrawn once
  // the Space Grotesk webfont loads (a canvas can't swap fonts retroactively).
  const draw = () => {
    const measure = document.createElement("canvas").getContext("2d")!;
    measure.font = font;
    const w = Math.ceil(measure.measureText(text).width) + 36;
    const h = 64;
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d")!;
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // soft shadow for legibility over the starfield — no hard outline
    ctx.shadowColor = "rgba(6,5,8,0.55)";
    ctx.shadowBlur = 6;
    ctx.fillStyle = "rgba(247,244,238,0.98)";
    ctx.fillText(text, w / 2, h / 2);
    tex.needsUpdate = true;
    return w / h;
  };
  const aspect = draw();
  return { tex, aspect, draw };
}

interface NodeObj {
  id: string;
  pos: THREE.Vector3;
  pick: THREE.Mesh; // invisible, for raycasting
  core: THREE.Sprite; // bright tight center
  coreMat: THREE.SpriteMaterial;
  halo: THREE.Sprite; // soft wide bloom
  haloMat: THREE.SpriteMaterial;
  clusterStart: number; // index into merged cluster buffer
  clusterCount: number;
  clusterColor: THREE.Color;
  label: THREE.Sprite;
  labelMat: THREE.SpriteMaterial;
  baseScale: number;
  // story-focus dim multiplier (1 = normal, <1 = dimmed while another story is focused)
  dimK: number;
  // "rest" = where the highlight state wants this node; hover can override
  restScale: number;
  restGlow: number;
  restLabel: number;
  targetScale: number;
  targetGlow: number;
  targetLabel: number;
  // halo spread multiplier — big soft bloom when idle/selected, tight crisp
  // point for neighbours while focused so nearby nodes stay readable
  haloK: number;
  targetHaloK: number;
  // hover state properties
  hovered: boolean;
  labelA: number;
  visK: number;
  targetVisK: number;
  labelCenterY: number;
  // animated flare when data pulse arrives
  flashK: number;
}

interface LinkObj {
  aId: string;
  bId: string;
  curve: THREE.QuadraticBezierCurve3;
  mat: THREE.LineBasicMaterial;
  targetOpacity: number;
  pulse: THREE.Sprite;
  pulseMat: THREE.SpriteMaterial;
  pulseOffset: number;
  pulseSpeed: number;
  targetPulseScale: number;
  // pulse travel direction: +1 = a→b, -1 = b→a (always away from the selection)
  dir: number;
  // when focused, the connected topic's name rides on the edge itself
  label: THREE.Sprite;
  labelMat: THREE.SpriteMaterial;
  targetLabel: number;
  route: boolean;
  labelA: number;
  visK: number;
  targetVisK: number;
  labelCenterY: number;
  isVein?: boolean;
}

export default function BrainScene({
  topics,
  links,
  path,
  onSelect,
  highlight,
  topicColors,
}: {
  topics: Topic[];
  links: TopicLink[];
  path: string[];
  onSelect: (id: string | null) => void;
  /**
   * Story focus mode: nodes whose id is in `topicIds` are recoloured to
   * `color` and everything else is dimmed. Null = normal category colouring.
   */
  highlight?: { topicIds: Set<string>; color: string } | null;
  /** Custom base colours for specific topics (e.g. story colours). */
  topicColors?: Map<string, string>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const pathRef = useRef(path);
  const apiRef = useRef<{ setPath: (p: string[]) => void } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---------- renderer / scene / camera ----------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.15, 4.8);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // Cap pixel ratio harder for large topic sets to stay smooth
    const prCap = topics.length > 150 ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, prCap));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

    const lodK = Math.min(1, Math.sqrt(30 / Math.max(1, topics.length)));
    const CLUSTER_N = Math.max(4, Math.floor(24 * lodK));
    const HALO_MULT = 9 * lodK;
    const CORE_MULT = 2.6 * lodK;
    const idleOpacity = 0.13 * Math.min(1, 40 / Math.max(1, links.length));

    const dotTex = makeCircleTexture();
    const glowTex = makeGlowTexture();
    const group = new THREE.Group();
    scene.add(group);
    group.scale.setScalar(0.7); // intro swell

    const disposables: { dispose: () => void }[] = [dotTex, glowTex];
    const white = new THREE.Color("#ffffff");

    // resolve the Space Grotesk family that next/font injected, so the canvas
    // label textures render in it (falls back until the webfont is ready)
    const groteskVar = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-grotesk")
      .trim();
    const labelFont = `600 40px ${groteskVar || "'Space Grotesk'"}, system-ui, sans-serif`;
    const labelDraws: Array<() => void> = [];
    const NODE_LABEL_H = 0.086;

    // ---------- background depth layer (subtle starfield behind the brain) ----------
    const STAR_N = 400;
    const starPos = new Float32Array(STAR_N * 3);
    const starSizes = new Float32Array(STAR_N);
    const starRng = mulberry32(42);
    for (let i = 0; i < STAR_N; i++) {
      // Spread stars on a large sphere behind and around the brain
      const theta = starRng() * Math.PI * 2;
      const phi = Math.acos(2 * starRng() - 1);
      const r = 8 + starRng() * 12;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = -Math.abs(r * Math.cos(phi)) - 2; // bias behind
      starSizes[i] = 0.03 + starRng() * 0.07;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute("size", new THREE.BufferAttribute(starSizes, 1));
    const starMat = new THREE.PointsMaterial({
      size: 0.06,
      map: dotTex,
      color: new THREE.Color("#8090b8"),
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    // Stars go in the scene directly (not the group) so they don't rotate with the brain
    scene.add(new THREE.Points(starGeo, starMat));
    disposables.push(starGeo, starMat);

    // Background ambient glow — a large soft sphere that gives depth
    const bgGlowMat = new THREE.SpriteMaterial({
      map: glowTex,
      color: new THREE.Color("#1a1530"),
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const bgGlow = new THREE.Sprite(bgGlowMat);
    bgGlow.position.set(0, 0, -5);
    bgGlow.scale.setScalar(14);
    scene.add(bgGlow);
    disposables.push(bgGlowMat);

    // ---------- particle shell (the brain itself) ----------
    const SHELL_N = 7500;
    const shellPos = new Float32Array(SHELL_N * 3);
    const shellCol = new Float32Array(SHELL_N * 3);
    const shellSizes = new Float32Array(SHELL_N);
    const palette = [
      new THREE.Color("#ff7a5c").multiplyScalar(0.68),
      new THREE.Color("#f5b95f").multiplyScalar(0.60),
      new THREE.Color("#43d6b5").multiplyScalar(0.52),
      new THREE.Color("#bfa8f5").multiplyScalar(0.55),
      new THREE.Color("#ff8fb1").multiplyScalar(0.50),
      new THREE.Color("#7fd0e8").multiplyScalar(0.50),
      new THREE.Color("#e8d5c4").multiplyScalar(0.48),
    ];
    const rng = mulberry32(20260712);
    const tmp = new THREE.Vector3();
    for (let i = 0; i < SHELL_N; i++) {
      const part: 'cortex' | 'cerebellum' = i < SHELL_N * 0.15 ? 'cerebellum' : 'cortex';
      
      const { crease, isCerebellum } = brainPoint(rng(), rng(), i % 2 === 0 ? 1 : -1, part, tmp);
      shellPos[i * 3] = tmp.x;
      shellPos[i * 3 + 1] = tmp.y;
      shellPos[i * 3 + 2] = tmp.z;
      const col = palette[Math.floor(rng() * palette.length)].clone();
      if (crease > 0) {
        col.lerp(new THREE.Color("#1a1530"), crease * 0.85); // darker deep in sulci
      }
      if (isCerebellum) {
        col.multiplyScalar(0.7); // slightly subdued
        // cooler tint for cerebellum
        col.lerp(new THREE.Color("#4a5b7a"), 0.3);
      }
      shellCol[i * 3] = col.r;
      shellCol[i * 3 + 1] = col.g;
      shellCol[i * 3 + 2] = col.b;
      shellSizes[i] = 0.025 + rng() * 0.05;
    }
    const shellGeo = new THREE.BufferGeometry();
    shellGeo.setAttribute("position", new THREE.BufferAttribute(shellPos, 3));
    shellGeo.setAttribute("color", new THREE.BufferAttribute(shellCol, 3));
    const shellMat = new THREE.PointsMaterial({
      size: 0.045, // slightly larger to compensate for lower N
      map: dotTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    shellMat.onBeforeCompile = (shader) => {
      shader.vertexShader = `
        varying float vRim;
        ${shader.vertexShader}
      `.replace(
        `#include <project_vertex>`,
        `
        #include <project_vertex>
        vec3 worldNorm = normalize(mat3(modelMatrix) * position);
        vec3 viewDir = normalize(cameraPosition - (modelMatrix * vec4(position, 1.0)).xyz);
        float dotNV = 1.0 - max(0.0, dot(worldNorm, viewDir));
        vRim = smoothstep(0.6, 0.95, dotNV);
        `
      );
      shader.fragmentShader = `
        varying float vRim;
        ${shader.fragmentShader}
      `.replace(
        `#include <color_fragment>`,
        `
        #include <color_fragment>
        diffuseColor.rgb += vec3(0.15, 0.05, 0.0) * vRim;
        `
      );
    };
    group.add(new THREE.Points(shellGeo, shellMat));
    disposables.push(shellGeo, shellMat);

    // ---------- topic hotspots (glowing patches on the cortex) ----------
    const pickGeo = new THREE.SphereGeometry(1, 12, 12);
    disposables.push(pickGeo);
    const degree = new Map<string, number>();
    for (const l of links) {
      degree.set(l.source, (degree.get(l.source) ?? 0) + 1);
      degree.set(l.target, (degree.get(l.target) ?? 0) + 1);
    }

    // === MERGED CLUSTER GEOMETRY ===
    const totalClusterParticles = topics.length * CLUSTER_N;
    const allClusterPos = new Float32Array(totalClusterParticles * 3);
    const allClusterCol = new Float32Array(totalClusterParticles * 3);
    let clusterIdx = 0;

    const nodes = new Map<string, NodeObj>();
    const placedPoints: THREE.Vector3[] = [];
    
    for (const t of topics) {
      const r = mulberry32(hashStr(t.id));
      const { pos: bPos, sign, u: uu, v: vv, part } = placeTopic(t, r, placedPoints);
      const pos = bPos.clone().multiplyScalar(1.04);
      
      const inStory = highlight ? highlight.topicIds.has(t.id) : false;
      const dimK = highlight && !inStory ? 0.45 : 1;
      const baseColor = topicColors?.get(t.id) ?? categoryColor(t.category);
      const color = new THREE.Color(inStory ? highlight!.color : baseColor);
      const baseScale =
        0.06 + Math.min(0.045, (degree.get(t.id) ?? 0) * 0.01) + Math.min(0.018, (t.review_count / 10) * 0.018);

      // cluster particles — write into merged buffer
      const clusterStart = clusterIdx;
      const clusterColor = color.clone().multiplyScalar(1.15);
      const cp = new THREE.Vector3();
      for (let j = 0; j < CLUSTER_N; j++) {
        const du = (r() - 0.5) * 0.075;
        const dv = (r() - 0.5) * 0.075;
        const { pos: cPos } = brainPoint(uu + du, vv + dv, sign, part, cp);
        cPos.multiplyScalar(1.02 + r() * 0.035);
        allClusterPos[clusterIdx * 3] = cPos.x;
        allClusterPos[clusterIdx * 3 + 1] = cPos.y;
        allClusterPos[clusterIdx * 3 + 2] = cPos.z;
        allClusterCol[clusterIdx * 3] = clusterColor.r;
        allClusterCol[clusterIdx * 3 + 1] = clusterColor.g;
        allClusterCol[clusterIdx * 3 + 2] = clusterColor.b;
        clusterIdx++;
      }

      // soft outer bloom
      const haloMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: color.clone(),
        transparent: true,
        opacity: 0.5 * lodK,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const halo = new THREE.Sprite(haloMat);
      halo.position.copy(pos);
      halo.scale.setScalar(baseScale * HALO_MULT);
      group.add(halo);

      // bright tight core
      const coreMat = new THREE.SpriteMaterial({
        map: dotTex,
        color: color.clone().lerp(white, 0.45),
        transparent: true,
        opacity: 0.9 * lodK,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const core = new THREE.Sprite(coreMat);
      core.position.copy(pos);
      core.scale.setScalar(baseScale * CORE_MULT);
      group.add(core);

      // invisible pick target (generous radius for easy hover)
      const pickMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
      const pick = new THREE.Mesh(pickGeo, pickMat);
      pick.position.copy(pos);
      pick.scale.setScalar(baseScale * 3);
      pick.userData.topicId = t.id;
      group.add(pick);

      // title label — hidden until hover / selection, and clickable
      const { tex, aspect, draw } = makeLabelTexture(t.name, labelFont);
      const labelMat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        depthTest: false,
      });
      const label = new THREE.Sprite(labelMat);
      label.scale.set(NODE_LABEL_H * aspect, NODE_LABEL_H, 1);
      label.position.copy(pos).add(pos.clone().normalize().multiplyScalar(0.16));
      label.position.y += baseScale + 0.1;
      label.renderOrder = 10;
      label.userData.topicId = t.id; // clicking the name selects the topic
      group.add(label);
      labelDraws.push(() => {
        label.scale.set(NODE_LABEL_H * draw(), NODE_LABEL_H, 1);
      });

      disposables.push(haloMat, coreMat, pickMat, labelMat, tex);

      nodes.set(t.id, {
        id: t.id,
        pos,
        pick,
        core,
        coreMat,
        halo,
        haloMat,
        clusterStart,
        clusterCount: CLUSTER_N,
        clusterColor,
        label,
        labelMat,
        baseScale,
        dimK,
        restScale: 1,
        restGlow: 0.6,
        restLabel: 0,
        targetScale: 1,
        targetGlow: 0.6,
        targetLabel: 0,
        haloK: HALO_MULT,
        targetHaloK: HALO_MULT,
        hovered: false,
        labelA: 0,
        visK: 1,
        targetVisK: 1,
        labelCenterY: 0.5,
        flashK: 0,
      });
    }

    // Build the single merged cluster geometry + material
    const mergedClusterGeo = new THREE.BufferGeometry();
    mergedClusterGeo.setAttribute("position", new THREE.BufferAttribute(allClusterPos, 3));
    mergedClusterGeo.setAttribute("color", new THREE.BufferAttribute(allClusterCol, 3));
    const mergedClusterMat = new THREE.PointsMaterial({
      size: 0.05,
      map: dotTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.6, // reduced from 0.9
      depthWrite: false,
      blending: THREE.NormalBlending, // NormalBlending prevents the huge white blown-out clouds
      sizeAttenuation: true,
    });
    group.add(new THREE.Points(mergedClusterGeo, mergedClusterMat));
    disposables.push(mergedClusterGeo, mergedClusterMat);
    const clusterColAttr = mergedClusterGeo.getAttribute("color") as THREE.BufferAttribute;

    // ---------- synapse links ----------
    const linkObjs: LinkObj[] = [];
    const baseLinkColor = new THREE.Color("#e8d5c4");
    const activeLinkColor = new THREE.Color("#ffb497");
    // ---------- spatial veins (leaf veins) ----------
    // Generate an organic mesh connecting spatial nearest neighbors
    const veinLinks: Array<{a: NodeObj, b: NodeObj}> = [];
    const connected = new Set<string>();
    
    for (const nA of nodes.values()) {
      // Find 3 nearest spatial neighbors to form a delicate web
      const neighbors = Array.from(nodes.values())
        .filter(nB => nB.id !== nA.id)
        .sort((n1, n2) => nA.pos.distanceToSquared(n1.pos) - nA.pos.distanceToSquared(n2.pos))
        .slice(0, 3);
        
      for (const nB of neighbors) {
        const pairId = [nA.id, nB.id].sort().join('-');
        if (!connected.has(pairId)) {
          connected.add(pairId);
          veinLinks.push({a: nA, b: nB});
        }
      }
    }
    
    let veinIdSeq = 0;
    for (const v of veinLinks) {
      const a = v.a;
      const b = v.b;
      const mid = a.pos.clone().add(b.pos).multiplyScalar(0.5);
      // Veins hug the surface very tightly
      const lift = 1.015 + Math.min(0.02, a.pos.distanceTo(b.pos) * 0.02);
      mid.normalize().multiplyScalar(((a.pos.length() + b.pos.length()) / 2) * lift);
      const curve = new THREE.QuadraticBezierCurve3(a.pos, mid, b.pos);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(12));
      const mat = new THREE.LineBasicMaterial({
        color: baseLinkColor.clone(),
        transparent: true,
        opacity: idleOpacity * 0.25, // softer veins
        depthWrite: false,
        blending: THREE.NormalBlending,
      });
      group.add(new THREE.Line(geo, mat));

      // Veins don't have active travelling dots, just the lines themselves glow with the wave
      const pulseMat = new THREE.SpriteMaterial({ visible: false });
      const pulse = new THREE.Sprite(pulseMat);
      
      const linkLabelMat = new THREE.SpriteMaterial({ visible: false });
      const linkLabel = new THREE.Sprite(linkLabelMat);
      
      disposables.push(geo, mat, pulseMat, linkLabelMat);
      
      linkObjs.push({
        id: `vein-${veinIdSeq++}`,
        aId: a.id,
        bId: b.id,
        dir: 1,
        curve,
        mat,
        pulse,
        pulseMat,
        pulseOffset: Math.random(),
        pulseSpeed: 0.05 + Math.random() * 0.02,
        label: linkLabel,
        labelMat: linkLabelMat,
        baseColor: baseLinkColor.clone(),
        targetOpacity: idleOpacity * 0.25, // softer veins
        targetPulseScale: 0,
        labelA: 0,
        visK: 1,
        targetVisK: 1,
        labelCenterY: 0.5,
        isVein: true,
      });
    }

    // ---------- semantic synapse links (the real data edges) ----------
    for (const l of links) {
      const a = nodes.get(l.source);
      const b = nodes.get(l.target);
      if (!a || !b) continue;
      const mid = a.pos.clone().add(b.pos).multiplyScalar(0.5);
      const lift = 1.03 + Math.min(0.05, a.pos.distanceTo(b.pos) * 0.05);
      mid.normalize().multiplyScalar(((a.pos.length() + b.pos.length()) / 2) * lift);
      const curve = new THREE.QuadraticBezierCurve3(a.pos, mid, b.pos);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
      const mat = new THREE.LineBasicMaterial({
        color: baseLinkColor.clone(),
        transparent: true,
        opacity: 0, // semantic links are completely invisible in idle state to prevent mess
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      group.add(new THREE.Line(geo, mat));

      const pulseMat = new THREE.SpriteMaterial({
        map: dotTex,
        color: new THREE.Color("#ffd9c4"),
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const pulse = new THREE.Sprite(pulseMat);
      pulse.scale.setScalar(0.045);
      group.add(pulse);

      // edge label — shows the far topic's name while a selection is active
      const linkLabelMat = new THREE.SpriteMaterial({
        transparent: true,
        opacity: 0,
        depthTest: false,
      });
      const linkLabel = new THREE.Sprite(linkLabelMat);
      linkLabel.renderOrder = 9;
      group.add(linkLabel);
      disposables.push(geo, mat, pulseMat, linkLabelMat);

      linkObjs.push({
        aId: l.source,
        bId: l.target,
        curve,
        mat,
        targetOpacity: idleOpacity,
        pulse,
        pulseMat,
        pulseOffset: Math.random(),
        pulseSpeed: 0.05 + Math.random() * 0.03,
        targetPulseScale: 0.045,
        dir: 1,
        label: linkLabel,
        labelMat: linkLabelMat,
        targetLabel: 0,
        route: false,
        labelA: 0,
        visK: 1,
        targetVisK: 1,
        labelCenterY: 0.5,
        isVein: false,
      });
    }

    // ---------- highlight / path logic ----------
    let tailId: string | null = null;
    let targetYaw = 0;
    let targetPitch = 0;
    let burstStart = -1;
    // selecting a topic dives the camera INSIDE the cortex: the brain swells
    // around the viewer and the chosen topic glows on the far inner wall
    let scaleTarget = 1;
    // focused view reads as single points: cortex patches fade out and the
    // field of view widens so connected nodes stay on screen
    let clusterK = 1;
    let clusterKTarget = 1;
    let fovTarget = 45;

    const linkedTo = (id: string) => {
      const s = new Set<string>();
      for (const l of linkObjs) {
        if (l.aId === id) s.add(l.bId);
        if (l.bId === id) s.add(l.aId);
      }
      return s;
    };

    function setPath(p: string[]) {
      const tail = p.length ? p[p.length - 1] : null;
      tailId = tail;
      const pathSet = new Set(p);
      // which links are steps of the walked route
      const routeKeys = new Set<string>();
      for (let i = 0; i + 1 < p.length; i++) {
        routeKeys.add(`${p[i]}|${p[i + 1]}`);
        routeKeys.add(`${p[i + 1]}|${p[i]}`);
      }
      const neigh = tail ? linkedTo(tail) : new Set<string>();

      for (const n of nodes.values()) {
        if (!tail) {
          n.restScale = n.baseScale;
          n.restGlow = 0.6;
          n.restLabel = 0;
          n.targetHaloK = HALO_MULT;
        } else if (n.id === tail) {
          // the ONE bright bloom — everything else stays crisp
          n.restScale = n.baseScale * 1.5;
          n.restGlow = 1;
          n.restLabel = 1;
          n.targetHaloK = HALO_MULT;
        } else if (pathSet.has(n.id)) {
          n.restScale = n.baseScale * 1.05;
          n.restGlow = 0.6;
          n.restLabel = 0.85;
          n.targetHaloK = 3.6 * lodK;
        } else if (neigh.has(n.id)) {
          // name rides the connecting edge instead of floating at the node
          n.restScale = n.baseScale;
          n.restGlow = 0.55;
          n.restLabel = 0;
          n.targetHaloK = 3.2 * lodK;
        } else {
          n.restScale = n.baseScale * 0.82;
          n.restGlow = 0.1;
          n.restLabel = 0;
          n.targetHaloK = 3 * lodK;
        }
        if (!n.hovered) {
          n.targetScale = n.restScale;
          n.targetGlow = n.restGlow;
          n.targetLabel = n.restLabel;
        }
      }

      clusterKTarget = tail ? 0 : 1;
      fovTarget = tail ? 58 : 45;

      let fanIdx = 0; // counts edges touching the selection, to stagger their labels
      for (const l of linkObjs) {
        const isRoute = routeKeys.has(`${l.aId}|${l.bId}`);
        const touchesTail = tail !== null && (l.aId === tail || l.bId === tail);
        l.route = isRoute;
        if (isRoute) {
          l.targetOpacity = 0.9;
          l.targetPulseScale = 0.1;
          l.mat.color.copy(routeLinkColor);
          l.pulseSpeed = 0.3;
        } else if (touchesTail) {
          l.targetOpacity = 0.55;
          l.targetPulseScale = 0.075;
          l.mat.color.copy(activeLinkColor);
          l.pulseSpeed = 0.2;
        } else {
          l.targetOpacity = tail ? 0.03 * lodK : idleOpacity;
          l.targetPulseScale = tail ? 0.02 : 0.045;
          l.mat.color.copy(baseLinkColor);
          l.pulseSpeed = 0.05 + Math.random() * 0.03;
        }
        // pulses always travel away from the selection; the far topic's name
        // sits on the edge, a third of the way out
        if (touchesTail) {
          l.dir = l.aId === tail ? 1 : -1;
          const other = nodes.get(l.aId === tail ? l.bId : l.aId);
          if (other) {
            l.labelMat.map = other.labelMat.map;
            l.labelMat.needsUpdate = true;
            l.label.userData.topicId = other.id; // clicking walks to that topic
            const aspect = other.label.scale.x / other.label.scale.y;
            const h = 0.066;
            l.label.scale.set(h * aspect, h, 1);
            // stagger each neighbour's name at a different distance along its
            // edge so the fan of labels doesn't stack up near the selection
            const frac = 0.3 + (fanIdx % 3) * 0.13;
            const at = l.curve.getPoint(l.dir > 0 ? frac : 1 - frac);
            l.label.position.copy(at);
            l.label.position.y += 0.04 + (fanIdx % 2) * 0.05;
            fanIdx++;
            l.targetLabel = 0.95;
          }
        } else {
          l.targetLabel = 0;
          l.label.userData.topicId = null;
        }
      }

      if (tail) {
        const n = nodes.get(tail);
        if (n) {
          // rotate the topic to the FAR side so, once the camera is inside,
          // you look across the interior at it glowing on the wall;
          // yaw centres it horizontally (x'→0, z'→-ρ), pitch brings it level
          targetYaw = Math.atan2(n.pos.x, -n.pos.z);
          // on landscape the info card covers the right third — bias the yaw
          // so the selection glows in the centre of the visible area instead
          // of sliding under the card
          if (camera.aspect >= 0.9) targetYaw += 0.32;
          // on portrait screens the info card covers the lower half — tilt a
          // little further so the target glows in the visible upper region
          const lookBias = camera.aspect < 0.9 ? 0.34 : 0.08;
          targetPitch =
            -Math.atan2(n.pos.y, Math.hypot(n.pos.x, n.pos.z)) * 0.85 + lookBias;
          scaleTarget = 2.35;
          burstStart = performance.now();
          for (const l of linkObjs) {
            if (l.route || l.aId === tail || l.bId === tail) l.pulseOffset = 0;
          }
        }
      } else {
        scaleTarget = 1;
      }
    }
    apiRef.current = { setPath };

    // ---------- interaction ----------
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const pickables = Array.from(nodes.values()).map((n) => n.pick);
    // node names + edge names are clickable too (checked before the glows)
    const labelPickables: THREE.Object3D[] = [
      ...Array.from(nodes.values()).map((n) => n.label),
      ...linkObjs.map((l) => l.label),
    ];
    let dragging = false;
    let moved = 0;
    let lastX = 0;
    let lastY = 0;
    let lastInteract = 0;
    let userPitch = 0;
    let zoomTarget = 4.8;
    let hoveredId: string | null = null;

    const pick = (e: PointerEvent): string | null => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      // labels sit on top and are clickable while legible — check them first
      for (const h of raycaster.intersectObjects(labelPickables, false)) {
        const tid = h.object.userData.topicId as string | null | undefined;
        const mat = (h.object as THREE.Sprite).material as THREE.SpriteMaterial;
        if (tid && mat.opacity > 0.3) return tid;
      }
      const hits = raycaster.intersectObjects(pickables, false);
      return hits.length ? (hits[0].object.userData.topicId as string) : null;
    };

    const applyHover = (id: string | null) => {
      if (id === hoveredId) return;
      if (hoveredId) {
        const prev = nodes.get(hoveredId);
        if (prev) {
          prev.hovered = false;
          prev.targetScale = prev.restScale;
          prev.targetGlow = prev.restGlow;
          prev.targetLabel = prev.restLabel;
        }
      }
      hoveredId = id;
      renderer.domElement.style.cursor = id ? "pointer" : "grab";
      if (id) {
        const n = nodes.get(id)!;
        n.hovered = true;
        n.targetScale = n.restScale * 1.28;
        n.targetGlow = Math.max(n.restGlow, 0.85);
        n.targetLabel = 1;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        moved += Math.abs(dx) + Math.abs(dy);
        lastX = e.clientX;
        lastY = e.clientY;
        group.rotation.y += dx * 0.005;
        userPitch = THREE.MathUtils.clamp(userPitch + dy * 0.003, -0.6, 0.6);
        lastInteract = performance.now();
      } else {
        applyHover(pick(e));
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      renderer.domElement.releasePointerCapture(e.pointerId);
      if (moved < 6) {
        const id = pick(e);
        if (id) onSelectRef.current(id);
      }
    };
    const onPointerLeave = () => applyHover(null);
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomTarget = THREE.MathUtils.clamp(zoomTarget + e.deltaY * 0.0035, 2.8, 7.5);
      lastInteract = performance.now();
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", onPointerLeave);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.style.cursor = "grab";

    // ---------- sizing ----------
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      zoomTarget = camera.aspect < 0.9 ? 6.6 : 4.8;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // ---------- screen-space label declutter ----------
    // Labels live in 3D, so after any rotation two names can project onto the
    // same pixels. Each frame, visible labels are projected to the screen and
    // placed in priority order (hovered > selected > route > edge names). A
    // label that would overlap an already-placed one first tries a small
    // vertical nudge (via sprite.center, so it never leaves its anchor) and
    // otherwise fades out until the view gives it room again.
    const projV = new THREE.Vector3();
    const wScaleV = new THREE.Vector3();
    type LabelItem = {
      x: number;
      y: number;
      pw: number;
      ph: number;
      pri: number;
      apply: (vis: number, centerY: number) => void;
    };
    const labelItems: LabelItem[] = [];
    const placedRects: { x0: number; y0: number; x1: number; y1: number }[] = [];
    let declutterFrame = 0;
    const declutterLabels = () => {
      // Throttle: run every 3rd frame for performance
      declutterFrame++;
      if (declutterFrame % 3 !== 0) return;

      const wpx = renderer.domElement.clientWidth;
      const hpx = renderer.domElement.clientHeight;
      if (!wpx || !hpx) return;
      // pixels per world-unit at distance 1 for the current fov
      const pxFactor = hpx / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2));
      labelItems.length = 0;
      const consider = (
        sprite: THREE.Sprite,
        alpha: number,
        pri: number,
        apply: (vis: number, centerY: number) => void,
      ) => {
        if (alpha < 0.04) {
          apply(1, 0.5); // invisible — reset so it reappears cleanly
          return;
        }
        sprite.getWorldPosition(projV);
        const dist = camera.position.distanceTo(projV);
        if (dist < 1e-4) return;
        projV.project(camera);
        if (projV.z > 1) return; // behind the camera — not rendered anyway
        sprite.getWorldScale(wScaleV);
        labelItems.push({
          x: (projV.x * 0.5 + 0.5) * wpx,
          y: (1 - (projV.y * 0.5 + 0.5)) * hpx,
          pw: (wScaleV.x / dist) * pxFactor,
          ph: (wScaleV.y / dist) * pxFactor,
          pri,
          apply,
        });
      };
      for (const n of nodes.values()) {
        const pri = n.hovered ? 4 : n.id === tailId ? 3 : 2;
        consider(n.label, Math.max(n.labelA, n.targetLabel), pri, (vis, cy) => {
          n.targetVisK = vis;
          n.labelCenterY = cy;
        });
      }
      for (const l of linkObjs) {
        // deterministic tiebreak so the same edge label always yields
        const pri = 1 + (hashStr(l.aId + l.bId) % 997) / 100000;
        consider(l.label, Math.max(l.labelA, l.targetLabel), pri, (vis, cy) => {
          l.targetVisK = vis;
          l.labelCenterY = cy;
        });
      }
      labelItems.sort((a, b) => b.pri - a.pri);
      placedRects.length = 0;
      const pad = 5;
      for (const it of labelItems) {
        let placed = false;
        // f is a vertical nudge in units of the label's own height
        for (const f of [0, 0.85, -0.85, 1.6, -1.6]) {
          const cy = it.y - f * it.ph;
          const x0 = it.x - it.pw / 2 - pad;
          const x1 = it.x + it.pw / 2 + pad;
          const y0 = cy - it.ph / 2 - pad;
          const y1 = cy + it.ph / 2 + pad;
          if (!placedRects.some((p) => x0 < p.x1 && x1 > p.x0 && y0 < p.y1 && y1 > p.y0)) {
            placedRects.push({ x0, y0, x1, y1 });
            it.apply(1, 0.5 - f);
            placed = true;
            break;
          }
        }
        if (!placed) it.apply(0, 0.5);
      }
    };

    // ---------- animation loop ----------
    const clock = new THREE.Clock();
    const scaleVec = new THREE.Vector3(1, 1, 1);
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const k = Math.min(1, dt * 5);
      // Frame-rate independent smooth damping for camera/zoom
      const smoothK = 1 - Math.exp(-dt * 4.5);

      // brain swells around the viewer on selection (dive-inside), settles back out on close
      scaleVec.setScalar(scaleTarget);
      group.scale.lerp(scaleVec, smoothK);

      if (tailId) {
        const diff = ((targetYaw - group.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        group.rotation.y += diff * smoothK;
        group.rotation.x += (targetPitch - group.rotation.x) * smoothK;
      } else {
        if (performance.now() - lastInteract > 3200 && !dragging) {
          group.rotation.y += dt * 0.12;
        }
        // User drag rotation is fast and snappy
        group.rotation.x += (userPitch - group.rotation.x) * Math.min(1, dt * 8);
      }

      // camera: outside → orbit distance; inside → sit within the cortex,
      // widening the view so the selection's connections stay on screen
      const insideZ = camera.aspect < 0.9 ? 2.0 : 1.45;
      const camZ = tailId ? insideZ : zoomTarget;
      
      // Use the smooth dampening to make zoom buttery smooth
      camera.position.z += (camZ - camera.position.z) * smoothK;
      camera.fov += (fovTarget - camera.fov) * smoothK;
      camera.updateProjectionMatrix();
      
      clusterK += (clusterKTarget - clusterK) * k;

      // Shell breathing + shimmer — varies with time, slightly brighter than before
      shellMat.opacity = 0.5 + 0.08 * Math.sin(t * 0.7);

      // First, update link pulses and trigger flashes on target nodes
      const sinceBurst = burstStart > 0 ? (performance.now() - burstStart) / 1000 : 99;
      for (const l of linkObjs) {
        
        // --- Edge Pulse Waves ---
        // Light up edges as a global spatial wave passes through the brain
        const nA = nodes.get(l.aId);
        const nB = nodes.get(l.bId);
        let waveEdgeGlow = 0;
        if (nA && nB) {
          const midX = (nA.pos.x + nB.pos.x) * 0.5;
          const midY = (nA.pos.y + nB.pos.y) * 0.5;
          const midZ = (nA.pos.z + nB.pos.z) * 0.5;
          
          // Origin at the base of the brain (brainstem)
          const dist = Math.hypot(midX, midY + 4, midZ + 2);
          // Very low frequency (0.45) so only ONE wave fits across the brain at a time
          const wave = Math.sin(dist * 0.45 - t * 1.5);
          // Sharpen it heavily (power of 8) so it's a distinct, singular pulse traveling outwards
          waveEdgeGlow = Math.pow(Math.max(0, wave), 8.0) * 1.5;
        }

        // Apply waveEdgeGlow to edge opacity, boosting it as the wave passes
        const baseEdgeOpacity = l.targetOpacity; // keep baseline very dim
        // We only apply the sweeping light wave to the spatial veins in the idle state
        const finalWaveGlow = (l.isVein && !highlight) ? waveEdgeGlow : 0;
        l.mat.opacity += ((baseEdgeOpacity + finalWaveGlow) - l.mat.opacity) * k;
        
        l.labelA += (l.targetLabel - l.labelA) * k;
        l.visK += (l.targetVisK - l.visK) * k;
        l.label.center.y += (l.labelCenterY - l.label.center.y) * Math.min(1, dt * 8);
        l.labelMat.opacity = l.labelA * l.visK;
        
        const prevOffset = l.pulseOffset;
        l.pulseOffset = prevOffset + dt * l.pulseSpeed;
        
        // If a pulse reaches its destination (offset >= 1.0)
        if (l.pulseOffset >= 1) {
          l.pulseOffset -= 1;
        }
        
        const p = l.curve.getPoint(l.dir > 0 ? l.pulseOffset : 1 - l.pulseOffset);
        l.pulse.position.copy(p);
        const burstBoost = sinceBurst < 0.9 ? (0.9 - sinceBurst) * 0.6 : 0;
        const sc = l.targetPulseScale * (1 + burstBoost * 6);
        l.pulse.scale.setScalar(l.pulse.scale.x + (sc - l.pulse.scale.x) * k);
        l.pulseMat.opacity = Math.min(0.95, l.targetOpacity * 1.4 + burstBoost);
      }

      // Update merged cluster colours for per-topic opacity changes
      let clusterDirty = false;
      for (const n of nodes.values()) {
        // ease glow (0..1) — drives core, halo and cortex-patch opacity together
        const glow = n.coreMat.opacity / 0.9;
        const g2 = glow + (n.targetGlow - glow) * k;
        
        // Nodes stay relatively dark and quiet, edges carry the light
        n.coreMat.opacity = Math.min(1.0, 0.65 * g2) * n.dimK;
        // Make halos very subtle to avoid blown-out blobs
        n.haloMat.opacity = Math.min(1.0, 0.1 * g2 * (1 + 0.12 * Math.sin(t * 2 + n.pos.x * 5))) * n.dimK;
        
        // Cortex patches do NOT flash intensely, keeping the brain shape solid
        const clusterOpacity = 0.55 * g2 * clusterK * n.dimK;
        
        // Update vertex colors to simulate per-cluster opacity
        const dimFactor = clusterOpacity / 0.9; // normalize against base
        for (let j = n.clusterStart; j < n.clusterStart + n.clusterCount; j++) {
          allClusterCol[j * 3] = n.clusterColor.r * dimFactor;
          allClusterCol[j * 3 + 1] = n.clusterColor.g * dimFactor;
          allClusterCol[j * 3 + 2] = n.clusterColor.b * dimFactor;
        }
        clusterDirty = true;
        // ease scale (drives core + halo + pick radius)
        const sc = n.core.scale.x / 2.6;
        const ns = sc + (n.targetScale - sc) * k;
        n.haloK += (n.targetHaloK - n.haloK) * k;
        
        n.core.scale.setScalar(ns * 2.6);
        n.halo.scale.setScalar(ns * n.haloK * (1 + 0.06 * Math.sin(t * 2 + n.pos.y * 4)));
        n.pick.scale.setScalar(Math.max(n.baseScale, ns) * 3);
        // ease label (visK / labelCenterY come from the declutter pass)
        n.labelA += (n.targetLabel - n.labelA) * k;
        n.visK += (n.targetVisK - n.visK) * k;
        n.label.center.y += (n.labelCenterY - n.label.center.y) * Math.min(1, dt * 8);
        n.labelMat.opacity = n.labelA * n.visK * n.dimK;
      }
      if (clusterDirty) {
        clusterColAttr.needsUpdate = true;
      }



      declutterLabels();
      renderer.render(scene, camera);
    };

    // seed node scales so the first frame doesn't jump
    for (const n of nodes.values()) {
      n.restScale = n.targetScale = n.baseScale;
      n.core.scale.setScalar(n.baseScale * 2.6);
    }
    animate();

    setPath(pathRef.current);

    // once the webfont resolves, redraw every label so it isn't stuck on the
    // fallback face, then refresh the path so edge-label scales pick up the change
    let disposed = false;
    if (typeof document !== "undefined" && document.fonts && !document.fonts.check(labelFont)) {
      document.fonts
        .load(labelFont)
        .then(() => {
          if (disposed) return;
          for (const d of labelDraws) d();
          setPath(pathRef.current);
        })
        .catch(() => {});
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointerleave", onPointerLeave);
      renderer.domElement.removeEventListener("wheel", onWheel);
      for (const d of disposables) d.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
      apiRef.current = null;
    };
  }, [topics, links, highlight]);

  useEffect(() => {
    pathRef.current = path;
    apiRef.current?.setPath(path);
  }, [path]);

  return <div ref={containerRef} className="h-full w-full" />;
}
