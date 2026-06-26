'use client';

import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type Certification } from './certifications-data';

// ─── Point-up hexagon geometry (viewBox 0 0 100 116) ───────────────────────────

const HEX_CX = 50;
const HEX_CY = 58;
const CORNER_R = 4.2;

const OUTER_VERTS: ReadonlyArray<readonly [number, number]> = [
  [50, 2],
  [94, 28],
  [94, 88],
  [50, 114],
  [6, 88],
  [6, 28],
];

function normalize(v: readonly [number, number]): [number, number] {
  const len = Math.hypot(v[0], v[1]);
  return len === 0 ? [0, 0] : [v[0] / len, v[1] / len];
}

function roundedHexPath(
  verts: ReadonlyArray<readonly [number, number]>,
  radius: number,
): string {
  const n = verts.length;
  const parts: string[] = [];

  for (let i = 0; i < n; i++) {
    const curr = verts[i]!;
    const prev = verts[(i - 1 + n) % n]!;
    const next = verts[(i + 1) % n]!;
    const toPrev = normalize([prev[0] - curr[0], prev[1] - curr[1]]);
    const toNext = normalize([next[0] - curr[0], next[1] - curr[1]]);
    const sx = curr[0] + toPrev[0] * radius;
    const sy = curr[1] + toPrev[1] * radius;
    const ex = curr[0] + toNext[0] * radius;
    const ey = curr[1] + toNext[1] * radius;

    if (i === 0) parts.push(`M ${sx.toFixed(2)} ${sy.toFixed(2)}`);
    else parts.push(`L ${sx.toFixed(2)} ${sy.toFixed(2)}`);
    parts.push(`Q ${curr[0]} ${curr[1]} ${ex.toFixed(2)} ${ey.toFixed(2)}`);
  }

  parts.push('Z');
  return parts.join(' ');
}

function scaleVerts(factor: number): ReadonlyArray<readonly [number, number]> {
  return OUTER_VERTS.map(([x, y]) => [
    HEX_CX + (x - HEX_CX) * factor,
    HEX_CY + (y - HEX_CY) * factor,
  ] as const);
}

const OUTER_PATH = roundedHexPath(OUTER_VERTS, CORNER_R);
const FACE_PATH = roundedHexPath(scaleVerts(0.93), CORNER_R * 0.93);
const INSET_STROKE_PATH = roundedHexPath(scaleVerts(0.88), CORNER_R * 0.88);

// ─── Accent tokens ────────────────────────────────────────────────────────────

interface AccentStyle {
  rimStops: [string, string, string];
  rimStopsDark: [string, string, string];
  innerStroke: string;
  innerStrokeDark: string;
  glowLight: string;
  glowDark: string;
  orbit: string;
  label: string;
}

const ACCENT_STYLES: Record<Certification['accent'], AccentStyle> = {
  orange: {
    rimStops: ['#fcd34d', '#f59e0b', '#d97706'],
    rimStopsDark: ['#fde68a', '#fbbf24', '#b45309'],
    innerStroke: 'rgba(217,119,6,0.35)',
    innerStrokeDark: 'rgba(251,191,36,0.40)',
    glowLight: 'rgba(245,158,11,0.18)',
    glowDark: 'rgba(251,191,36,0.28)',
    orbit: 'rgba(251,191,36,0.28)',
    label: 'text-amber-900 dark:text-amber-100',
  },
  blue: {
    rimStops: ['#7dd3fc', '#3b82f6', '#2563eb'],
    rimStopsDark: ['#93c5fd', '#60a5fa', '#1d4ed8'],
    innerStroke: 'rgba(37,99,235,0.32)',
    innerStrokeDark: 'rgba(96,165,250,0.38)',
    glowLight: 'rgba(59,130,246,0.16)',
    glowDark: 'rgba(96,165,250,0.26)',
    orbit: 'rgba(96,165,250,0.28)',
    label: 'text-blue-900 dark:text-sky-100',
  },
  red: {
    rimStops: ['#fda4af', '#ef4444', '#dc2626'],
    rimStopsDark: ['#fca5a5', '#f87171', '#b91c1c'],
    innerStroke: 'rgba(220,38,38,0.32)',
    innerStrokeDark: 'rgba(244,63,94,0.36)',
    glowLight: 'rgba(239,68,68,0.14)',
    glowDark: 'rgba(244,63,94,0.24)',
    orbit: 'rgba(244,63,94,0.26)',
    label: 'text-rose-900 dark:text-rose-100',
  },
  violet: {
    rimStops: ['#d8b4fe', '#a855f7', '#7c3aed'],
    rimStopsDark: ['#e9d5ff', '#a78bfa', '#6d28d9'],
    innerStroke: 'rgba(124,58,237,0.32)',
    innerStrokeDark: 'rgba(167,139,250,0.36)',
    glowLight: 'rgba(139,92,246,0.16)',
    glowDark: 'rgba(167,139,250,0.26)',
    orbit: 'rgba(167,139,250,0.26)',
    label: 'text-violet-900 dark:text-violet-100',
  },
};

// ─── Back-face typography ─────────────────────────────────────────────────────

const BACK_LABEL = 'text-[8px] font-semibold uppercase tracking-[0.12em] text-[#795465] dark:text-[#22d3ee]';
const BACK_VALUE = 'text-[10px] font-semibold leading-tight text-[#1e1b18] dark:text-[#f8fafc]';

// ─── Deterministic motion offsets ─────────────────────────────────────────────

function hashDelay(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return (Math.abs(h) % 40) / 10;
}

function hashDuration(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 19 + id.charCodeAt(i)) | 0;
  return 5 + (Math.abs(h) % 4);
}

function hashOrbitTilt(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 13 + id.charCodeAt(i)) | 0;
  return (Math.abs(h) % 30) - 15;
}

// ─── Provider marks ───────────────────────────────────────────────────────────

function ProviderMark({ markKey }: { markKey: Certification['markKey'] }) {
  switch (markKey) {
    case 'aws':
      return (
        <span className="flex flex-col items-center leading-none">
          <span className="text-[14px] font-bold tracking-tight text-[#232F3E] dark:text-[#f5f5f4]">
            aws
          </span>
          <span
            aria-hidden
            className="mt-0.5 h-[1.5px] w-6 rounded-full bg-gradient-to-r from-[#232F3E] via-[#ff9900] to-[#f5a623]"
          />
        </span>
      );
    case 'azure':
      return (
        <span
          className="flex h-6 w-6 items-center justify-center rounded-[3px] bg-gradient-to-br from-[#0078d4] to-[#50e6ff] text-xs font-bold text-white"
          aria-hidden
        >
          A
        </span>
      );
    case 'oracle':
      return (
        <span className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#c74634] dark:text-[#fca5a5]">
          ORACLE
        </span>
      );
  }
}

// ─── SVG hexagon badge shell ──────────────────────────────────────────────────

function HexBadgeGraphic({
  accent,
  uid,
  elevated,
}: {
  accent: AccentStyle;
  uid: string;
  elevated?: boolean;
}) {
  const rimId = `${uid}-rim`;
  const rimDarkId = `${uid}-rim-dark`;
  const faceId = `${uid}-face`;
  const faceDarkId = `${uid}-face-dark`;
  const depthId = `${uid}-depth`;
  const shineId = `${uid}-shine`;

  return (
    <svg
      viewBox="0 0 100 116"
      className="h-full w-full overflow-visible"
      aria-hidden
    >
      <defs>
        <linearGradient id={rimId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent.rimStops[0]} />
          <stop offset="50%" stopColor={accent.rimStops[1]} />
          <stop offset="100%" stopColor={accent.rimStops[2]} />
        </linearGradient>
        <linearGradient id={rimDarkId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={accent.rimStopsDark[0]} />
          <stop offset="50%" stopColor={accent.rimStopsDark[1]} />
          <stop offset="100%" stopColor={accent.rimStopsDark[2]} />
        </linearGradient>
        <linearGradient id={faceId} x1="20%" y1="8%" x2="80%" y2="92%">
          <stop offset="0%" stopColor="#fdfcfb" />
          <stop offset="45%" stopColor="#f3f0ec" />
          <stop offset="100%" stopColor="#e6e1db" />
        </linearGradient>
        <linearGradient id={faceDarkId} x1="20%" y1="8%" x2="80%" y2="92%">
          <stop offset="0%" stopColor="#3a3f4a" />
          <stop offset="45%" stopColor="#2a2e38" />
          <stop offset="100%" stopColor="#1a1d26" />
        </linearGradient>
        <linearGradient id={depthId} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#9a9088" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5c534c" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id={shineId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <path
        d={OUTER_PATH}
        fill={`url(#${depthId})`}
        transform="translate(0, 5)"
        opacity="0.45"
        className="dark:opacity-60"
      />

      <path
        d={OUTER_PATH}
        fill={`url(#${rimId})`}
        className="dark:hidden"
        style={{
          filter: elevated
            ? 'drop-shadow(0 5px 8px rgba(30,27,24,0.16))'
            : 'drop-shadow(0 3px 5px rgba(30,27,24,0.10))',
        }}
      />
      <path
        d={OUTER_PATH}
        fill={`url(#${rimDarkId})`}
        className="hidden dark:block"
        style={{
          filter: elevated
            ? 'drop-shadow(0 6px 12px rgba(0,0,0,0.45))'
            : 'drop-shadow(0 4px 8px rgba(0,0,0,0.35))',
        }}
      />

      <path d={FACE_PATH} fill={`url(#${faceId})`} className="dark:hidden" />
      <path d={FACE_PATH} fill={`url(#${faceDarkId})`} className="hidden dark:block" />

      <path
        d={INSET_STROKE_PATH}
        fill="none"
        stroke={accent.innerStroke}
        strokeWidth="0.65"
        className="dark:hidden"
        opacity="0.85"
      />
      <path
        d={INSET_STROKE_PATH}
        fill="none"
        stroke={accent.innerStrokeDark}
        strokeWidth="0.65"
        className="hidden dark:block"
        opacity="0.85"
      />

      <path d={FACE_PATH} fill={`url(#${shineId})`} opacity="0.42" />
    </svg>
  );
}

function HexBadgeFace({
  accent,
  uid,
  elevated,
  children,
}: {
  accent: AccentStyle;
  uid: string;
  elevated?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative h-full w-full">
      <HexBadgeGraphic accent={accent} uid={uid} elevated={elevated} />
      <div className="absolute inset-0 flex items-center justify-center px-2 pt-1">
        {children}
      </div>
    </div>
  );
}

// ─── Orbit ring ───────────────────────────────────────────────────────────────

function OrbitRing({ color, tilt, reduce }: { color: string; tilt: number; reduce: boolean | null }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[52%] h-[115%] w-[115%] -translate-x-1/2 -translate-y-1/2"
      style={{ transform: `translate(-50%, -50%) rotateX(68deg) rotateZ(${tilt}deg)` }}
    >
      <motion.div
        className="h-full w-full rounded-full border border-dashed opacity-20 transition-opacity duration-300 group-hover:opacity-38 group-focus-visible:opacity-38"
        style={{ borderColor: color }}
        animate={reduce ? undefined : { rotate: 360 }}
        transition={reduce ? undefined : { duration: 20, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// ─── Back face metadata ───────────────────────────────────────────────────────

function BadgeExpiry({ expires }: { expires?: string }) {
  return (
    <div className="text-center">
      <p className={BACK_LABEL}>Expires</p>
      <p className={cn('mt-1', BACK_VALUE)}>
        {expires ?? 'No Expiry Listed'}
      </p>
    </div>
  );
}

// ─── Flip faces ───────────────────────────────────────────────────────────────

const FACE_BACK: CSSProperties = {
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
  transform: 'rotateY(180deg)',
};

const FACE_FRONT: CSSProperties = {
  backfaceVisibility: 'hidden',
  WebkitBackfaceVisibility: 'hidden',
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface CertificationBadgeProps {
  certification: Certification;
  index: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CertificationBadge({ certification }: CertificationBadgeProps) {
  const reduce = useReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const uid = useId().replace(/:/g, '');
  const accent = ACCENT_STYLES[certification.accent];
  const delay = hashDelay(certification.id);
  const floatDuration = hashDuration(certification.id);
  const orbitTilt = hashOrbitTilt(certification.id);

  const frontContent = (
    <div className="flex flex-col items-center gap-0.5 text-center">
      <ProviderMark markKey={certification.markKey} />
      <span className={cn('text-[9.5px] font-bold leading-tight', accent.label)}>
        {certification.shortLabel}
      </span>
      <span className="max-w-[4.5rem] truncate text-[6px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {certification.provider}
      </span>
    </div>
  );

  const backContent = (
    <BadgeExpiry expires={certification.expires} />
  );

  return (
    <div className="flex flex-col items-center text-center">
      <a
        href={certification.credentialUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open certificate for ${certification.name}`}
        onMouseEnter={() => setRevealed(true)}
        onMouseLeave={() => setRevealed(false)}
        onFocus={() => setRevealed(true)}
        onBlur={() => setRevealed(false)}
        className={cn(
          'group relative block rounded-2xl p-2',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        )}
      >
        <motion.div
          className="relative h-[7rem] w-[6rem] sm:h-[7.5rem] sm:w-[6.5rem]"
          style={{ perspective: 1000 }}
          animate={reduce ? undefined : { y: [-3, 3, -3] }}
          transition={
            reduce
              ? undefined
              : { duration: floatDuration, repeat: Infinity, ease: 'easeInOut', delay }
          }
        >
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute -inset-2 opacity-30 transition-opacity duration-300',
              'group-hover:opacity-55 group-focus-visible:opacity-55 dark:hidden',
            )}
            style={{ background: `radial-gradient(ellipse, ${accent.glowLight} 0%, transparent 70%)` }}
          />
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute -inset-2 hidden opacity-40 transition-opacity duration-300',
              'group-hover:opacity-65 group-focus-visible:opacity-65 dark:block',
            )}
            style={{ background: `radial-gradient(ellipse, ${accent.glowDark} 0%, transparent 70%)` }}
          />

          <OrbitRing color={accent.orbit} tilt={orbitTilt} reduce={reduce} />

          <div
            aria-hidden
            className={cn(
              'absolute -bottom-0.5 left-1/2 h-2 w-[68%] -translate-x-1/2 rounded-[100%]',
              'bg-black/[0.07] blur-[3px] transition-all duration-300',
              'group-hover:h-2.5 group-hover:bg-black/[0.11] group-focus-visible:h-2.5',
              'dark:bg-black/45 dark:group-hover:bg-black/55',
            )}
          />

          {reduce ? (
            <div className="relative h-full w-full">
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: revealed ? 0 : 1 }}
                transition={{ duration: 0.25 }}
              >
                <HexBadgeFace accent={accent} uid={`${uid}-front`} elevated={revealed}>
                  {frontContent}
                </HexBadgeFace>
              </motion.div>
              <motion.div
                className="absolute inset-0"
                animate={{ opacity: revealed ? 1 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <HexBadgeFace accent={accent} uid={`${uid}-back`} elevated={revealed}>
                  {backContent}
                </HexBadgeFace>
              </motion.div>
            </div>
          ) : (
            <motion.div
              className="relative h-full w-full"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{
                rotateY: revealed ? 180 : 0,
                y: revealed ? -3 : 0,
              }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="absolute inset-0" style={FACE_FRONT}>
                <HexBadgeFace accent={accent} uid={`${uid}-front`} elevated={revealed}>
                  {frontContent}
                </HexBadgeFace>
              </div>
              <div className="absolute inset-0" style={FACE_BACK}>
                <HexBadgeFace accent={accent} uid={`${uid}-back`} elevated={revealed}>
                  {backContent}
                </HexBadgeFace>
              </div>
            </motion.div>
          )}
        </motion.div>
      </a>

      <p className="mt-3 max-w-[11rem] text-center text-sm font-semibold text-foreground">
        {certification.name}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {certification.issued}
      </p>
    </div>
  );
}
