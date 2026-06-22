'use client';

// SVG layer: bezier connection lines + animated particles + constellation dots.
//
// viewBox="0 0 100 100" preserveAspectRatio="none" maps SVG (x,y) coordinates
// directly onto DOM percentage positions — no pixel conversion needed.
//
// Particles use SVG <animateMotion> + <mpath> which natively understands
// SVG user units, giving sub-pixel accurate movement along every path.

import { useReducedMotion } from 'framer-motion';
import { type CapabilityEdge, CAPABILITY_EDGES, IDLE_PARTICLE_PATHS } from './capability-data';

// ─── Background constellation dots ───────────────────────────────────────────
// Deterministic pseudo-random positions using two primes as strides.
const CONSTELLATION = Array.from({ length: 48 }, (_, i) => ({
  cx: 1 + ((i * 19) % 98),
  cy: 1 + ((i * 31 + 7) % 98),
  r:  i % 4 === 0 ? 0.55 : 0.3,
}));

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  activeNodeId: string | null;
  connectedIds: Set<string>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function GraphConnections({ activeNodeId, connectedIds }: Props) {
  const reduce = useReducedMotion();

  function isEdgeConnected(edge: CapabilityEdge): boolean {
    return edge.sourceId === activeNodeId || edge.targetId === activeNodeId;
  }

  const hasActive = !!activeNodeId;

  // Edges whose particles should be lit during active state
  const activeEdges = hasActive
    ? CAPABILITY_EDGES.filter(isEdgeConnected)
    : [];

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* ── Defs ──────────────────────────────────────────────────────────── */}
      <defs>
        {/* Line glow: spreads perpendicular to the stroke — large y range */}
        <filter id="cgn-line-glow" x="-15%" y="-400%" width="130%" height="900%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Dot glow: symmetric bloom around the particle circle */}
        <filter id="cgn-dot-glow" x="-180%" y="-180%" width="460%" height="460%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Path shapes reused by <animateMotion><mpath> references */}
        {CAPABILITY_EDGES.map((edge) => (
          <path key={`def-${edge.id}`} id={`cgn-path-${edge.id}`} d={edge.d} />
        ))}
      </defs>

      {/* ── Faint constellation background ─────────────────────────────── */}
      {CONSTELLATION.map((dot, i) => (
        <circle
          key={`star-${i}`}
          cx={dot.cx}
          cy={dot.cy}
          r={dot.r}
          fill="currentColor"
          className="text-foreground"
          opacity="0.07"
        />
      ))}

      {/* ── Connection lines ───────────────────────────────────────────── */}
      {CAPABILITY_EDGES.map((edge) => {
        const connected = isEdgeConnected(edge);
        const dimmed    = hasActive && !connected;
        return (
          <path
            key={edge.id}
            d={edge.d}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth={connected ? 1.4 : 0.7}
            strokeOpacity={dimmed ? 0.06 : connected ? 0.75 : 0.22}
            strokeLinecap="round"
            filter={connected ? 'url(#cgn-line-glow)' : undefined}
            style={{ transition: 'stroke-opacity .3s, stroke-width .3s' }}
          />
        );
      })}

      {/* ── Idle particles (shown when nothing is hovered) ─────────────── */}
      {!reduce && !hasActive && IDLE_PARTICLE_PATHS.map((p) => (
        <circle
          key={`idle-${p.edgeId}`}
          r="1.6"
          fill="var(--color-accent)"
          opacity="0.55"
          filter="url(#cgn-dot-glow)"
        >
          <animateMotion dur={`${p.dur}s`} repeatCount="indefinite" begin={`${p.begin}s`}>
            <mpath href={`#cgn-path-${p.edgeId}`} />
          </animateMotion>
        </circle>
      ))}

      {/* ── Active-state particles (two staggered per connected edge) ───── */}
      {!reduce && hasActive && activeEdges.map((edge, ei) =>
        [0, 1].map((pi) => (
          <circle
            key={`active-${edge.id}-${pi}`}
            r={pi === 0 ? 2.0 : 1.5}
            fill="var(--color-accent)"
            opacity={pi === 0 ? 0.92 : 0.65}
            filter="url(#cgn-dot-glow)"
          >
            <animateMotion
              dur={`${1.8 + ei * 0.3}s`}
              repeatCount="indefinite"
              begin={`${pi * 0.9 + ei * 0.2}s`}
            >
              <mpath href={`#cgn-path-${edge.id}`} />
            </animateMotion>
          </circle>
        ))
      )}
    </svg>
  );
}
