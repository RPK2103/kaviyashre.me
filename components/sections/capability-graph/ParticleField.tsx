'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { capabilityNodes } from './capability-data';

// ─── Types ────────────────────────────────────────────────────────────────────

type ParticleLayer = 'far' | 'mid' | 'near' | 'star';
type ParticleTier = 'desktop' | 'tablet' | 'mobile';
type ParticleKind = 'dot' | 'star';

interface Sparkle {
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

interface Props {
  activeNodeId: string | null;
  variant?: 'desktop' | 'mobile';
}

// ─── Tier counts ──────────────────────────────────────────────────────────────

const TIER_COUNTS: Record<ParticleTier, { far: number; mid: number; near: number; star: number }> = {
  desktop: { far: 82, mid: 52, near: 26, star: 12 },
  tablet:  { far: 54, mid: 36, near: 18, star: 9 },
  mobile:  { far: 30, mid: 20, near: 11, star: 5 },
};

// ─── Deterministic PRNG ───────────────────────────────────────────────────────

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildFarLayer(count: number, rand: () => number, offset: number): Sparkle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const drift = 2 + rand() * 1.5;
    return {
      id: `far-${offset + i}`,
      layer: 'far',
      kind: 'dot',
      x: 2 + rand() * 96,
      y: 2 + rand() * 96,
      size: rand() > 0.6 ? 2 : 1,
      colorIndex: Math.floor(rand() * 4),
      duration: 6 + rand() * 6,
      delay: rand() * 6,
      baseOpacity: 0.10 + rand() * 0.12,
      peakOpacity: 0.20 + rand() * 0.16,
      driftX: Math.cos(angle) * drift,
      driftY: Math.sin(angle) * drift,
      glow: false,
      zIndex: 0,
    };
  });
}

function buildMidLayer(count: number, rand: () => number, offset: number): Sparkle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = rand() * Math.PI * 2;
    const drift = 2.5 + rand() * 2;
    return {
      id: `mid-${offset + i}`,
      layer: 'mid',
      kind: 'dot',
      x: 3 + rand() * 94,
      y: 3 + rand() * 94,
      size: rand() > 0.4 ? 3 : 2,
      colorIndex: Math.floor(rand() * 4),
      duration: 5 + rand() * 5,
      delay: rand() * 5,
      baseOpacity: 0.16 + rand() * 0.14,
      peakOpacity: 0.30 + rand() * 0.18,
      driftX: Math.cos(angle) * drift,
      driftY: Math.sin(angle) * drift,
      glow: false,
      zIndex: 1,
    };
  });
}

function buildNearLayer(count: number, rand: () => number, offset: number): Sparkle[] {
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
      x: Math.max(3, Math.min(97, anchor.position.x + Math.cos(angle) * radius)),
      y: Math.max(3, Math.min(97, anchor.position.y + Math.sin(angle) * radius)),
      size: rand() > 0.35 ? 3 : 2,
      colorIndex: Math.floor(rand() * 4),
      duration: 4 + rand() * 5,
      delay: rand() * 4,
      baseOpacity: 0.22 + rand() * 0.14,
      peakOpacity: 0.40 + rand() * 0.16,
      driftX: Math.cos(angle + 0.5) * drift,
      driftY: Math.sin(angle + 0.5) * drift,
      glow: true,
      zIndex: 2,
    };
  });
}

function buildStarLayer(count: number, rand: () => number, offset: number): Sparkle[] {
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
      x: Math.max(4, Math.min(96, anchor.position.x + Math.cos(angle) * radius)),
      y: Math.max(4, Math.min(96, anchor.position.y + Math.sin(angle) * radius)),
      size: 5 + Math.floor(rand() * 4),
      colorIndex: Math.floor(rand() * 4),
      duration: 5 + rand() * 7,
      delay: rand() * 5,
      baseOpacity: 0.14 + rand() * 0.10,
      peakOpacity: 0.28 + rand() * 0.14,
      driftX: Math.cos(angle) * drift,
      driftY: Math.sin(angle) * drift,
      glow: true,
      zIndex: 1,
      starRotation: rand() * 90,
    };
  });
}

function buildLayeredField(tier: ParticleTier, seed: number): Sparkle[] {
  const { far, mid, near, star } = TIER_COUNTS[tier];
  const rand = mulberry32(seed);
  const farLayer = buildFarLayer(far, rand, 0);
  const midLayer = buildMidLayer(mid, rand, far);
  const nearLayer = buildNearLayer(near, rand, far + mid);
  const starLayer = buildStarLayer(star, rand, far + mid + near);
  return [...farLayer, ...midLayer, ...nearLayer, ...starLayer];
}

const PARTICLE_FIELDS: Record<ParticleTier, Sparkle[]> = {
  desktop: buildLayeredField('desktop', 42_791),
  tablet:  buildLayeredField('tablet',  52_103),
  mobile:  buildLayeredField('mobile',  61_407),
};

const SPARKLE_LIGHT = [
  'rgba(255,255,255,0.80)',
  'rgba(252,200,220,0.65)',
  'rgba(196,181,253,0.60)',
  'rgba(186,230,253,0.55)',
] as const;

const SPARKLE_DARK = [
  'rgba(255,255,255,0.50)',
  'rgba(167,139,250,0.46)',
  'rgba(34,211,238,0.40)',
  'rgba(96,165,250,0.42)',
] as const;

function useDesktopTier(): ParticleTier {
  const [tier, setTier] = useState<ParticleTier>('desktop');

  useEffect(() => {
    const sync = () => {
      setTier(window.innerWidth < 1024 ? 'tablet' : 'desktop');
    };
    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, []);

  return tier;
}

// ─── Star sparkle mark ────────────────────────────────────────────────────────

function StarSparkle({
  size,
  colorLight,
  colorDark,
  baseOp,
  peakOp,
  driftX,
  driftY,
  duration,
  delay,
  reduce,
}: {
  size: number;
  colorLight: string;
  colorDark: string;
  baseOp: number;
  peakOp: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
  reduce: boolean | null;
}) {
  const arm = Math.max(2, size * 0.22);

  return (
    <span
      className="cgn-sparkle-star block"
      style={{
        width: size,
        height: size,
        ['--sparkle-color-light' as string]: colorLight,
        ['--sparkle-color-dark' as string]: colorDark,
        ['--sparkle-base' as string]: String(baseOp),
        ['--sparkle-peak' as string]: String(peakOp),
        ['--drift-x' as string]: `${driftX}px`,
        ['--drift-y' as string]: `${driftY}px`,
        ['--star-arm' as string]: `${arm}px`,
        opacity: reduce ? baseOp : undefined,
        animation: reduce
          ? undefined
          : `cgn-sparkle-float ${duration}s ease-in-out ${delay}s infinite alternate`,
      }}
    />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ParticleField({ activeNodeId, variant = 'desktop' }: Props) {
  const reduce = useReducedMotion();
  const desktopTier = useDesktopTier();
  const tier: ParticleTier = variant === 'mobile' ? 'mobile' : desktopTier;
  const sparkles = PARTICLE_FIELDS[tier];

  const activePos = useMemo(() => {
    if (!activeNodeId) return null;
    const node = capabilityNodes.find((n) => n.id === activeNodeId);
    return node ? { x: node.position.x, y: node.position.y } : null;
  }, [activeNodeId]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl"
    >
      {sparkles.map((s) => {
        const nearActive = activePos
          ? Math.hypot(s.x - activePos.x, s.y - activePos.y) < 22
          : false;

        const baseOp = nearActive
          ? Math.min(s.peakOpacity + 0.14, s.kind === 'star' ? 0.55 : 0.62)
          : s.baseOpacity;
        const peakOp = nearActive
          ? Math.min(s.peakOpacity + 0.20, s.kind === 'star' ? 0.68 : 0.75)
          : s.peakOpacity;

        if (s.kind === 'star') {
          return (
            <span
              key={s.id}
              className="absolute"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                zIndex: s.zIndex,
                transform: `rotate(${s.starRotation ?? 0}deg)`,
              }}
            >
              <StarSparkle
                size={s.size}
                colorLight={SPARKLE_LIGHT[s.colorIndex]}
                colorDark={SPARKLE_DARK[s.colorIndex]}
                baseOp={baseOp}
                peakOp={peakOp}
                driftX={s.driftX}
                driftY={s.driftY}
                duration={s.duration}
                delay={s.delay}
                reduce={reduce}
              />
            </span>
          );
        }

        return (
          <span
            key={s.id}
            className={cn('absolute rounded-full cgn-sparkle', s.glow && 'cgn-sparkle-glow')}
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              zIndex: s.zIndex,
              ['--sparkle-color-light' as string]: SPARKLE_LIGHT[s.colorIndex],
              ['--sparkle-color-dark' as string]: SPARKLE_DARK[s.colorIndex],
              ['--sparkle-base' as string]: String(baseOp),
              ['--sparkle-peak' as string]: String(peakOp),
              ['--drift-x' as string]: `${s.driftX}px`,
              ['--drift-y' as string]: `${s.driftY}px`,
              opacity: reduce ? baseOp : undefined,
              animation: reduce
                ? undefined
                : `cgn-sparkle-float ${s.duration}s ease-in-out ${s.delay}s infinite alternate`,
            }}
          />
        );
      })}
    </div>
  );
}
