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
function brainPoint(u: number, v: number, sign: number, out = new THREE.Vector3()) {
  const phi = Math.acos(1 - 1.55 * u); // polar angle, biased to the upper dome
  const lam = v * Math.PI; // half-turn per hemisphere
  let x = 1.32 * Math.sin(phi) * Math.cos(lam); // front(-)/back(+)
  let y = 0.92 * Math.cos(phi); // up/down
  let z = 0.6 * Math.sin(phi) * Math.sin(lam); // outward, >= 0
  // gyri-like organic bumps
  const bump = 1 + 0.055 * Math.sin(7 * phi + 3 * lam) * Math.sin(5 * lam + 1.7 * phi);
  x *= bump;
  y *= bump;
  z *= bump;
  // taper the frontal lobe, widen the back
  z *= 0.78 + 0.16 * ((x + 1.4) / 2.8);
  // flatten the underside
  if (y < -0.5) y = -0.5 + (y + 0.5) * 0.35;
  out.set(x, y, sign * (z + 0.115)); // hemisphere gap along the fissure
  return out;
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
  clusterMat: THREE.PointsMaterial; // brightened cortex patch
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
  hovered: boolean;
  // screen-space declutter: labelA is the logical opacity; visK fades the
  // label out when no clear spot exists; labelCenterY nudges it vertically
  labelA: number;
  visK: number;
  targetVisK: number;
  labelCenterY: number;
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";

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

    // ---------- particle shell (the brain itself) ----------
    const SHELL_N = 3200;
    const shellPos = new Float32Array(SHELL_N * 3);
    const shellCol = new Float32Array(SHELL_N * 3);
    const palette = [
      new THREE.Color("#ff7a5c").multiplyScalar(0.55),
      new THREE.Color("#f5b95f").multiplyScalar(0.45),
      new THREE.Color("#43d6b5").multiplyScalar(0.4),
      new THREE.Color("#bfa8f5").multiplyScalar(0.42),
      new THREE.Color("#e8d5c4").multiplyScalar(0.38),
      new THREE.Color("#e8d5c4").multiplyScalar(0.38),
    ];
    const rng = mulberry32(20260712);
    const tmp = new THREE.Vector3();
    for (let i = 0; i < SHELL_N; i++) {
      brainPoint(rng(), rng(), i % 2 === 0 ? 1 : -1, tmp);
      shellPos[i * 3] = tmp.x;
      shellPos[i * 3 + 1] = tmp.y;
      shellPos[i * 3 + 2] = tmp.z;
      const col = palette[Math.floor(rng() * palette.length)];
      shellCol[i * 3] = col.r;
      shellCol[i * 3 + 1] = col.g;
      shellCol[i * 3 + 2] = col.b;
    }
    const shellGeo = new THREE.BufferGeometry();
    shellGeo.setAttribute("position", new THREE.BufferAttribute(shellPos, 3));
    shellGeo.setAttribute("color", new THREE.BufferAttribute(shellCol, 3));
    const shellMat = new THREE.PointsMaterial({
      size: 0.045,
      map: dotTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
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

    const CLUSTER_N = 46;
    const nodes = new Map<string, NodeObj>();
    for (const t of topics) {
      const r = mulberry32(hashStr(t.id));
      const sign = r() < 0.5 ? 1 : -1;
      const uu = 0.12 + r() * 0.74;
      const vv = 0.08 + r() * 0.84;
      const pos = brainPoint(uu, vv, sign).multiplyScalar(1.04);
      // story focus: highlighted nodes take the story colour, the rest dim out
      const inStory = highlight ? highlight.topicIds.has(t.id) : false;
      const dimK = highlight && !inStory ? 0.45 : 1;
      const baseColor = topicColors?.get(t.id) ?? categoryColor(t.category);
      const color = new THREE.Color(inStory ? highlight!.color : baseColor);
      const baseScale =
        0.06 + Math.min(0.045, (degree.get(t.id) ?? 0) * 0.01) + Math.min(0.018, (t.review_count / 10) * 0.018);

      // brightened cortex patch around the topic
      const cPos = new Float32Array(CLUSTER_N * 3);
      const cp = new THREE.Vector3();
      for (let j = 0; j < CLUSTER_N; j++) {
        const du = (r() - 0.5) * 0.075;
        const dv = (r() - 0.5) * 0.075;
        brainPoint(uu + du, vv + dv, sign, cp).multiplyScalar(1.02 + r() * 0.035);
        cPos[j * 3] = cp.x;
        cPos[j * 3 + 1] = cp.y;
        cPos[j * 3 + 2] = cp.z;
      }
      const clusterGeo = new THREE.BufferGeometry();
      clusterGeo.setAttribute("position", new THREE.BufferAttribute(cPos, 3));
      const clusterColor = color.clone().multiplyScalar(1.45);
      const clusterMat = new THREE.PointsMaterial({
        size: 0.05,
        map: dotTex,
        color: clusterColor.clone(),
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      });
      group.add(new THREE.Points(clusterGeo, clusterMat));

      // soft outer bloom
      const haloMat = new THREE.SpriteMaterial({
        map: glowTex,
        color: color.clone(),
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const halo = new THREE.Sprite(haloMat);
      halo.position.copy(pos);
      halo.scale.setScalar(baseScale * 9);
      group.add(halo);

      // bright tight core
      const coreMat = new THREE.SpriteMaterial({
        map: dotTex,
        color: color.clone().lerp(white, 0.55),
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const core = new THREE.Sprite(coreMat);
      core.position.copy(pos);
      core.scale.setScalar(baseScale * 2.4);
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

      disposables.push(clusterGeo, clusterMat, haloMat, coreMat, pickMat, labelMat, tex);

      nodes.set(t.id, {
        id: t.id,
        pos,
        pick,
        core,
        coreMat,
        halo,
        haloMat,
        clusterMat,
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
        haloK: 9,
        targetHaloK: 9,
        hovered: false,
        labelA: 0,
        visK: 1,
        targetVisK: 1,
        labelCenterY: 0.5,
      });
    }

    // ---------- synapse links ----------
    const linkObjs: LinkObj[] = [];
    const baseLinkColor = new THREE.Color("#e8d5c4");
    const activeLinkColor = new THREE.Color("#ffb497");
    const routeLinkColor = new THREE.Color("#ffd0a8");
    for (const l of links) {
      const a = nodes.get(l.source);
      const b = nodes.get(l.target);
      if (!a || !b) continue;
      const mid = a.pos.clone().add(b.pos).multiplyScalar(0.5);
      const lift = 1.18 + Math.min(0.5, a.pos.distanceTo(b.pos) * 0.28);
      mid.normalize().multiplyScalar(((a.pos.length() + b.pos.length()) / 2) * lift);
      const curve = new THREE.QuadraticBezierCurve3(a.pos, mid, b.pos);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
      const mat = new THREE.LineBasicMaterial({
        color: baseLinkColor.clone(),
        transparent: true,
        opacity: 0.13,
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
        targetOpacity: 0.13,
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
          n.targetHaloK = 9;
        } else if (n.id === tail) {
          // the ONE bright bloom — everything else stays crisp
          n.restScale = n.baseScale * 1.5;
          n.restGlow = 1;
          n.restLabel = 1;
          n.targetHaloK = 9;
        } else if (pathSet.has(n.id)) {
          n.restScale = n.baseScale * 1.05;
          n.restGlow = 0.6;
          n.restLabel = 0.85;
          n.targetHaloK = 3.6;
        } else if (neigh.has(n.id)) {
          // name rides the connecting edge instead of floating at the node
          n.restScale = n.baseScale;
          n.restGlow = 0.55;
          n.restLabel = 0;
          n.targetHaloK = 3.2;
        } else {
          n.restScale = n.baseScale * 0.82;
          n.restGlow = 0.1;
          n.restLabel = 0;
          n.targetHaloK = 3;
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
          l.targetOpacity = tail ? 0.03 : 0.13;
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
    const declutterLabels = () => {
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

      // brain swells around the viewer on selection (dive-inside), settles back out on close
      scaleVec.setScalar(scaleTarget);
      group.scale.lerp(scaleVec, Math.min(1, dt * 1.9));

      if (tailId) {
        const diff = ((targetYaw - group.rotation.y + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        group.rotation.y += diff * Math.min(1, dt * 2.6);
        group.rotation.x += (targetPitch - group.rotation.x) * Math.min(1, dt * 2.6);
      } else {
        if (performance.now() - lastInteract > 3200 && !dragging) {
          group.rotation.y += dt * 0.12;
        }
        group.rotation.x += (userPitch - group.rotation.x) * Math.min(1, dt * 4);
      }

      // camera: outside → orbit distance; inside → sit within the cortex,
      // widening the view so the selection's connections stay on screen
      const insideZ = camera.aspect < 0.9 ? 2.0 : 1.45;
      const camZ = tailId ? insideZ : zoomTarget;
      camera.position.z += (camZ - camera.position.z) * Math.min(1, dt * 1.9);
      camera.fov += (fovTarget - camera.fov) * Math.min(1, dt * 1.9);
      camera.updateProjectionMatrix();
      clusterK += (clusterKTarget - clusterK) * k;

      shellMat.opacity = 0.5 + 0.08 * Math.sin(t * 0.7);

      for (const n of nodes.values()) {
        // ease glow (0..1) — drives core, halo and cortex-patch opacity together
        const glow = n.coreMat.opacity / 0.85;
        const g2 = glow + (n.targetGlow - glow) * k;
        n.coreMat.opacity = 0.85 * g2 * n.dimK;
        n.haloMat.opacity = 0.4 * g2 * (1 + 0.12 * Math.sin(t * 2 + n.pos.x * 5)) * n.dimK;
        // patches dissolve while focused so every topic reads as one node
        n.clusterMat.opacity = 0.9 * g2 * clusterK * n.dimK;
        // ease scale (drives core + halo + pick radius)
        const sc = n.core.scale.x / 2.4;
        const ns = sc + (n.targetScale - sc) * k;
        n.haloK += (n.targetHaloK - n.haloK) * k;
        n.core.scale.setScalar(ns * 2.4);
        n.halo.scale.setScalar(ns * n.haloK * (1 + 0.06 * Math.sin(t * 2 + n.pos.y * 4)));
        n.pick.scale.setScalar(Math.max(n.baseScale, ns) * 3);
        // ease label (visK / labelCenterY come from the declutter pass)
        n.labelA += (n.targetLabel - n.labelA) * k;
        n.visK += (n.targetVisK - n.visK) * k;
        n.label.center.y += (n.labelCenterY - n.label.center.y) * Math.min(1, dt * 8);
        n.labelMat.opacity = n.labelA * n.visK * n.dimK;
      }

      const sinceBurst = burstStart > 0 ? (performance.now() - burstStart) / 1000 : 99;
      for (const l of linkObjs) {
        l.mat.opacity += (l.targetOpacity - l.mat.opacity) * k;
        l.labelA += (l.targetLabel - l.labelA) * k;
        l.visK += (l.targetVisK - l.visK) * k;
        l.label.center.y += (l.labelCenterY - l.label.center.y) * Math.min(1, dt * 8);
        l.labelMat.opacity = l.labelA * l.visK;
        l.pulseOffset = (l.pulseOffset + dt * l.pulseSpeed) % 1;
        const p = l.curve.getPoint(l.dir > 0 ? l.pulseOffset : 1 - l.pulseOffset);
        l.pulse.position.copy(p);
        const burstBoost = sinceBurst < 0.9 ? (0.9 - sinceBurst) * 0.6 : 0;
        const sc = l.targetPulseScale * (1 + burstBoost * 6);
        l.pulse.scale.setScalar(l.pulse.scale.x + (sc - l.pulse.scale.x) * k);
        l.pulseMat.opacity = Math.min(0.95, l.targetOpacity * 1.4 + burstBoost);
      }

      declutterLabels();
      renderer.render(scene, camera);
    };

    // seed node scales so the first frame doesn't jump
    for (const n of nodes.values()) {
      n.restScale = n.targetScale = n.baseScale;
      n.core.scale.setScalar(n.baseScale * 2.4);
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
