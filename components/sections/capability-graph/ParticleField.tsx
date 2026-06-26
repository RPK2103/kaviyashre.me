'use client';

import { useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { capabilityNodes } from './capability-data';
import {
  PARTICLE_FIELDS,
  type Sparkle,
  type ParticleTier,
} from './particle-data';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  activeNodeId: string | null;
  variant?: 'desktop' | 'mobile';
}

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

// ─── Single sparkle renderer ──────────────────────────────────────────────────

function SparkleElement({
  sparkle: s,
  activePos,
  reduce,
}: {
  sparkle: Sparkle;
  activePos: { x: number; y: number } | null;
  reduce: boolean | null;
}) {
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
}

function SparkleLayer({
  tier,
  activePos,
  reduce,
  className,
}: {
  tier: ParticleTier;
  activePos: { x: number; y: number } | null;
  reduce: boolean | null;
  className?: string;
}) {
  const sparkles = PARTICLE_FIELDS[tier];

  return (
    <div className={cn('absolute inset-0', className)}>
      {sparkles.map((s) => (
        <SparkleElement key={s.id} sparkle={s} activePos={activePos} reduce={reduce} />
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ParticleField({ activeNodeId, variant = 'desktop' }: Props) {
  const reduce = useReducedMotion();

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
      {variant === 'mobile' ? (
        <SparkleLayer tier="mobile" activePos={activePos} reduce={reduce} />
      ) : (
        <>
          <SparkleLayer
            tier="desktop"
            activePos={activePos}
            reduce={reduce}
            className="hidden lg:block"
          />
          <SparkleLayer
            tier="tablet"
            activePos={activePos}
            reduce={reduce}
            className="md:block lg:hidden"
          />
        </>
      )}
    </div>
  );
}
