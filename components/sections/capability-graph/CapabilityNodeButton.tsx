'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Code2, Layers, Globe, Terminal, Zap, Database, Cloud,
  Bot, Server, Network, Box, Atom, Braces, Wind, GitBranch,
  Workflow, type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type CapabilityNode, type CapabilityCategory } from './capability-data';

// ─── Icon registry ────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Code2, Layers, Globe, Terminal, Zap, Database, Cloud,
  Bot, Server, Network, Box, Atom, Braces, Wind, GitBranch, Workflow,
};

// ─── Deterministic per-node motion params ─────────────────────────────────────

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return h;
}

function nodeDrift(id: string): { dx: number; dy: number; duration: number; delay: number } {
  const h = hashId(id);
  const h2 = hashId(`${id}-y`);
  const dxMag = 6 + (Math.abs(h) % 7);
  const dyMag = 5 + (Math.abs(h2) % 6);
  const dxSign = h % 2 === 0 ? 1 : -1;
  const dySign = h2 % 2 === 0 ? 1 : -1;

  return {
    dx: dxSign * dxMag,
    dy: dySign * dyMag,
    duration: 5 + (Math.abs(h) % 5),
    delay: (Math.abs(h) % 35) / 10,
  };
}

function nodeOrbit(id: string) {
  const h = hashId(id);
  const h2 = hashId(`${id}-orbit`);

  return {
    width:  90 + (Math.abs(h) % 26),
    height: 42 + (Math.abs(h2) % 19),
    tilt:   (Math.abs(h) % 50) - 25,
    clockwise: h % 2 === 0,
    duration: 8 + (Math.abs(h2) % 7),
    delay: (Math.abs(h) % 40) / 10,
    dotSize: 4 + (Math.abs(h2) % 2),
  };
}

// ─── Category visual config ───────────────────────────────────────────────────

interface CatVisual {
  border: string;
  borderActive: string;
  icon: string;
  orbitalColor: string;
  ringColor: string;
  idleGlow: string;
  activeGlow: string;
  innerHighlight: string;
}

const CAT_VISUAL: Record<CapabilityCategory, CatVisual> = {
  AI: {
    border:         'border-pink-400/75 dark:border-pink-400/65',
    borderActive:   'border-pink-500 dark:border-pink-300',
    icon:           'text-pink-500 dark:text-pink-400',
    orbitalColor:   'rgba(236,72,153,0.75)',
    ringColor:      'rgba(236,72,153,0.35)',
    idleGlow:       '0 0 0 1px rgba(236,72,153,0.30), 0 0 24px rgba(236,72,153,0.20), inset 0 1px 6px rgba(255,255,255,0.55)',
    activeGlow:     '0 0 0 1px rgba(236,72,153,0.58), 0 0 30px rgba(236,72,153,0.36), 0 0 48px rgba(236,72,153,0.14), inset 0 1px 8px rgba(255,255,255,0.65)',
    innerHighlight: 'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.55) 0%, transparent 62%)',
  },
  Backend: {
    border:         'border-violet-400/75 dark:border-violet-400/65',
    borderActive:   'border-violet-500 dark:border-violet-300',
    icon:           'text-violet-600 dark:text-violet-400',
    orbitalColor:   'rgba(139,92,246,0.75)',
    ringColor:      'rgba(139,92,246,0.35)',
    idleGlow:       '0 0 0 1px rgba(139,92,246,0.30), 0 0 24px rgba(139,92,246,0.20), inset 0 1px 6px rgba(255,255,255,0.55)',
    activeGlow:     '0 0 0 1px rgba(139,92,246,0.58), 0 0 30px rgba(139,92,246,0.36), 0 0 48px rgba(139,92,246,0.14), inset 0 1px 8px rgba(255,255,255,0.65)',
    innerHighlight: 'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.55) 0%, transparent 62%)',
  },
  Cloud: {
    border:         'border-blue-400/75 dark:border-blue-400/65',
    borderActive:   'border-blue-500 dark:border-blue-300',
    icon:           'text-blue-500 dark:text-blue-400',
    orbitalColor:   'rgba(59,130,246,0.75)',
    ringColor:      'rgba(59,130,246,0.32)',
    idleGlow:       '0 0 0 1px rgba(59,130,246,0.28), 0 0 24px rgba(59,130,246,0.18), inset 0 1px 6px rgba(255,255,255,0.55)',
    activeGlow:     '0 0 0 1px rgba(59,130,246,0.55), 0 0 30px rgba(59,130,246,0.34), 0 0 48px rgba(59,130,246,0.13), inset 0 1px 8px rgba(255,255,255,0.65)',
    innerHighlight: 'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.55) 0%, transparent 62%)',
  },
  Frontend: {
    border:         'border-pink-400/75 dark:border-pink-400/65',
    borderActive:   'border-pink-500 dark:border-pink-300',
    icon:           'text-pink-500 dark:text-pink-400',
    orbitalColor:   'rgba(236,72,153,0.75)',
    ringColor:      'rgba(236,72,153,0.35)',
    idleGlow:       '0 0 0 1px rgba(236,72,153,0.30), 0 0 24px rgba(236,72,153,0.20), inset 0 1px 6px rgba(255,255,255,0.55)',
    activeGlow:     '0 0 0 1px rgba(236,72,153,0.58), 0 0 30px rgba(236,72,153,0.36), 0 0 48px rgba(236,72,153,0.14), inset 0 1px 8px rgba(255,255,255,0.65)',
    innerHighlight: 'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.55) 0%, transparent 62%)',
  },
  Automation: {
    border:         'border-violet-400/75 dark:border-violet-400/65',
    borderActive:   'border-violet-500 dark:border-violet-300',
    icon:           'text-violet-600 dark:text-violet-400',
    orbitalColor:   'rgba(139,92,246,0.75)',
    ringColor:      'rgba(139,92,246,0.35)',
    idleGlow:       '0 0 0 1px rgba(139,92,246,0.30), 0 0 24px rgba(139,92,246,0.20), inset 0 1px 6px rgba(255,255,255,0.55)',
    activeGlow:     '0 0 0 1px rgba(139,92,246,0.58), 0 0 30px rgba(139,92,246,0.36), 0 0 48px rgba(139,92,246,0.14), inset 0 1px 8px rgba(255,255,255,0.65)',
    innerHighlight: 'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.55) 0%, transparent 62%)',
  },
  DevOps: {
    border:         'border-blue-400/75 dark:border-blue-400/65',
    borderActive:   'border-blue-500 dark:border-blue-300',
    icon:           'text-blue-500 dark:text-blue-400',
    orbitalColor:   'rgba(59,130,246,0.75)',
    ringColor:      'rgba(59,130,246,0.32)',
    idleGlow:       '0 0 0 1px rgba(59,130,246,0.28), 0 0 24px rgba(59,130,246,0.18), inset 0 1px 6px rgba(255,255,255,0.55)',
    activeGlow:     '0 0 0 1px rgba(59,130,246,0.55), 0 0 30px rgba(59,130,246,0.34), 0 0 48px rgba(59,130,246,0.13), inset 0 1px 8px rgba(255,255,255,0.65)',
    innerHighlight: 'radial-gradient(circle at 38% 32%, rgba(255,255,255,0.55) 0%, transparent 62%)',
  },
};

// ─── Elliptical atom orbit ring ───────────────────────────────────────────────

interface OrbitProps {
  width: number;
  height: number;
  tilt: number;
  clockwise: boolean;
  duration: number;
  delay: number;
  dotSize: number;
  ringColor: string;
  dotColor: string;
  isActive: boolean;
  reduce: boolean | null;
}

function NodeAtomOrbit({
  width, height, tilt, clockwise, duration, delay, dotSize,
  ringColor, dotColor, isActive, reduce,
}: OrbitProps) {
  const ringOpacity = isActive ? 0.48 : 0.24;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-[27px] z-0 -translate-x-1/2 -translate-y-1/2"
      style={{ width, height }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ rotate: tilt }}
        animate={
          reduce
            ? { rotate: tilt }
            : { rotate: tilt + (clockwise ? 360 : -360) }
        }
        transition={
          reduce
            ? undefined
            : { duration, repeat: Infinity, ease: 'linear', delay }
        }
      >
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden
        >
          <ellipse
            cx={width / 2}
            cy={height / 2}
            rx={width / 2 - 3}
            ry={height / 2 - 3}
            fill="none"
            stroke={ringColor}
            strokeWidth={1}
            strokeDasharray="5 6"
            opacity={ringOpacity}
          />
        </svg>

        <span
          className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            background: dotColor,
            opacity: isActive ? 0.85 : 0.7,
            boxShadow: `0 0 6px 1px ${dotColor}`,
          }}
        />
      </motion.div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  node: CapabilityNode;
  isActive: boolean;
  isConnected: boolean;
  isDimmed: boolean;
  showOrbitals?: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function CapabilityNodeButton({
  node, isActive, showOrbitals = false,
  onClick, onMouseEnter, onMouseLeave, onFocus, onBlur,
}: Props) {
  const reduce = useReducedMotion();
  const cfg = CAT_VISUAL[node.category];
  const Icon = ICON_MAP[node.iconKey] ?? Globe;
  const drift = nodeDrift(node.id);
  const orbit = nodeOrbit(node.id);

  return (
    <div
      className="absolute"
      style={{
        left: `${node.position.x}%`,
        top:  `${node.position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isActive ? 20 : 10,
      }}
    >
      <motion.div
        animate={
          reduce
            ? undefined
            : { x: [0, drift.dx, 0], y: [0, drift.dy, 0] }
        }
        transition={
          reduce
            ? undefined
            : {
                duration: drift.duration,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
                delay: drift.delay,
              }
        }
      >
        <motion.div
          animate={reduce ? undefined : { scale: isActive ? 1.06 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        >
          <button
            type="button"
            aria-label={`View evidence for ${node.label}`}
            aria-pressed={isActive}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onFocus={onFocus}
            onBlur={onBlur}
            className="group relative flex flex-col items-center gap-2 focus-visible:outline-none"
          >
            {showOrbitals && (
              <NodeAtomOrbit
                width={orbit.width}
                height={orbit.height}
                tilt={orbit.tilt}
                clockwise={orbit.clockwise}
                duration={orbit.duration}
                delay={orbit.delay}
                dotSize={orbit.dotSize}
                ringColor={cfg.ringColor}
                dotColor={cfg.orbitalColor}
                isActive={isActive}
                reduce={reduce}
              />
            )}

            <div
              className={cn(
                'relative z-[1] flex h-[54px] w-[54px] items-center justify-center rounded-full',
                'border bg-white transition-[box-shadow,border-color] duration-300',
                'dark:bg-surface',
                isActive ? cfg.borderActive : cfg.border,
                'group-focus-visible:ring-2 group-focus-visible:ring-ring',
                'group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background',
              )}
              style={{
                boxShadow: isActive ? cfg.activeGlow : cfg.idleGlow,
                backgroundImage: cfg.innerHighlight,
              }}
            >
              <Icon
                className={cn('relative z-10 h-5 w-5', cfg.icon)}
                strokeWidth={1.75}
              />
            </div>

            <span
              className={cn(
                'relative z-[1] max-w-[72px] text-center text-[10px] font-medium leading-tight',
                'transition-colors duration-200',
                isActive ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              {node.label}
            </span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
