/**
 * One-off generator for static particle sparkle data.
 * Run: node scripts/generate-particle-data.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Inline capability node positions (must match capability-data.ts)
const capabilityNodes = [
  { position: { x: 28, y: 18 } },
  { position: { x: 42, y: 15 } },
  { position: { x: 43, y: 36 } },
  { position: { x: 28, y: 52 } },
  { position: { x: 44, y: 58 } },
  { position: { x: 58, y: 52 } },
  { position: { x: 60, y: 28 } },
  { position: { x: 74, y: 22 } },
  { position: { x: 90, y: 14 } },
  { position: { x: 73, y: 50 } },
  { position: { x: 84, y: 42 } },
  { position: { x: 68, y: 78 } },
  { position: { x: 27, y: 76 } },
  { position: { x: 40, y: 82 } },
  { position: { x: 55, y: 82 } },
  { position: { x: 82, y: 76 } },
];

const TIER_COUNTS = {
  desktop: { far: 82, mid: 52, near: 26, star: 12 },
  tablet:  { far: 54, mid: 36, near: 18, star: 9 },
  mobile:  { far: 30, mid: 20, near: 11, star: 5 },
};

function mulberry32(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (n, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

function buildFarLayer(count, rand, offset) {
  return Array.from({ length: count }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const drift = 2 + rand() * 1.5;
    return {
      id: `far-${offset + i}`,
      layer: 'far',
      kind: 'dot',
      x: round(2 + rand() * 96),
      y: round(2 + rand() * 96),
      size: rand() > 0.6 ? 2 : 1,
      colorIndex: Math.floor(rand() * 4),
      duration: round(6 + rand() * 6),
      delay: round(rand() * 6),
      baseOpacity: round(0.10 + rand() * 0.12, 2),
      peakOpacity: round(0.20 + rand() * 0.16, 2),
      driftX: round(Math.cos(angle) * drift),
      driftY: round(Math.sin(angle) * drift),
      glow: false,
      zIndex: 0,
    };
  });
}

function buildMidLayer(count, rand, offset) {
  return Array.from({ length: count }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const drift = 2.5 + rand() * 2;
    return {
      id: `mid-${offset + i}`,
      layer: 'mid',
      kind: 'dot',
      x: round(3 + rand() * 94),
      y: round(3 + rand() * 94),
      size: rand() > 0.4 ? 3 : 2,
      colorIndex: Math.floor(rand() * 4),
      duration: round(5 + rand() * 5),
      delay: round(rand() * 5),
      baseOpacity: round(0.16 + rand() * 0.14, 2),
      peakOpacity: round(0.30 + rand() * 0.18, 2),
      driftX: round(Math.cos(angle) * drift),
      driftY: round(Math.sin(angle) * drift),
      glow: false,
      zIndex: 1,
    };
  });
}

function buildNearLayer(count, rand, offset) {
  const nodes = capabilityNodes;
  return Array.from({ length: count }, (_, i) => {
    const anchor = nodes[Math.floor(rand() * nodes.length)];
    const angle = rand() * Math.PI * 2;
    const radius = 5 + rand() * 14;
    const drift = 3 + rand() * 2;
    return {
      id: `near-${offset + i}`,
      layer: 'near',
      kind: 'dot',
      x: round(Math.max(3, Math.min(97, anchor.position.x + Math.cos(angle) * radius))),
      y: round(Math.max(3, Math.min(97, anchor.position.y + Math.sin(angle) * radius))),
      size: rand() > 0.35 ? 3 : 2,
      colorIndex: Math.floor(rand() * 4),
      duration: round(4 + rand() * 5),
      delay: round(rand() * 4),
      baseOpacity: round(0.22 + rand() * 0.14, 2),
      peakOpacity: round(0.40 + rand() * 0.16, 2),
      driftX: round(Math.cos(angle + 0.5) * drift),
      driftY: round(Math.sin(angle + 0.5) * drift),
      glow: true,
      zIndex: 2,
    };
  });
}

function buildStarLayer(count, rand, offset) {
  const nodes = capabilityNodes;
  return Array.from({ length: count }, (_, i) => {
    const anchor = nodes[Math.floor(rand() * nodes.length)];
    const angle = rand() * Math.PI * 2;
    const radius = 8 + rand() * 18;
    const drift = 2 + rand() * 2;
    return {
      id: `star-${offset + i}`,
      layer: 'star',
      kind: 'star',
      x: round(Math.max(4, Math.min(96, anchor.position.x + Math.cos(angle) * radius))),
      y: round(Math.max(4, Math.min(96, anchor.position.y + Math.sin(angle) * radius))),
      size: 5 + Math.floor(rand() * 4),
      colorIndex: Math.floor(rand() * 4),
      duration: round(5 + rand() * 7),
      delay: round(rand() * 5),
      baseOpacity: round(0.14 + rand() * 0.10, 2),
      peakOpacity: round(0.28 + rand() * 0.14, 2),
      driftX: round(Math.cos(angle) * drift),
      driftY: round(Math.sin(angle) * drift),
      glow: true,
      zIndex: 1,
      starRotation: round(rand() * 90),
    };
  });
}

function buildLayeredField(tier, seed) {
  const { far, mid, near, star } = TIER_COUNTS[tier];
  const rand = mulberry32(seed);
  const farLayer = buildFarLayer(far, rand, 0);
  const midLayer = buildMidLayer(mid, rand, far);
  const nearLayer = buildNearLayer(near, rand, far + mid);
  const starLayer = buildStarLayer(star, rand, far + mid + near);
  return [...farLayer, ...midLayer, ...nearLayer, ...starLayer];
}

const fields = {
  desktop: buildLayeredField('desktop', 42_791),
  tablet: buildLayeredField('tablet', 52_103),
  mobile: buildLayeredField('mobile', 61_407),
};

const output = `// AUTO-GENERATED by scripts/generate-particle-data.mjs — do not edit by hand.
// Re-run the script after changing particle counts or generation logic.

export type ParticleLayer = 'far' | 'mid' | 'near' | 'star';
export type ParticleTier = 'desktop' | 'tablet' | 'mobile';
export type ParticleKind = 'dot' | 'star';

export interface Sparkle {
  id: string;
  layer: ParticleLayer;
  kind: ParticleKind;
  x: number;
  y: number;
  size: number;
  colorIndex: number;
  duration: number;
  delay: number;
  baseOpacity: number;
  peakOpacity: number;
  driftX: number;
  driftY: number;
  glow: boolean;
  zIndex: number;
  starRotation?: number;
}

export const PARTICLE_FIELDS: Record<ParticleTier, Sparkle[]> = ${JSON.stringify(fields, null, 2)} as const;
`;

writeFileSync(
  join(root, 'components/sections/capability-graph/particle-data.ts'),
  output,
  'utf8',
);

console.log('Wrote particle-data.ts');
console.log('Counts:', Object.fromEntries(
  Object.entries(fields).map(([k, v]) => [k, v.length]),
));
