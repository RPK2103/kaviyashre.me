'use client';

import { motion, useReducedMotion } from 'framer-motion';
import {
  Code2, Layers, Globe, Terminal, Zap, Database, Cloud,
  Bot, Server, Network, Box, Atom, Braces, Wind, GitBranch,
  Workflow, type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type CapabilityNode, type CapabilityCategory, CATEGORY_DOT } from './capability-data';

// ─── Icon registry ────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Code2, Layers, Globe, Terminal, Zap, Database, Cloud,
  Bot, Server, Network, Box, Atom, Braces, Wind, GitBranch, Workflow,
};

// ─── Category visual config ───────────────────────────────────────────────────
// Ring / bg colors use Tailwind standard palette (pink, violet, sky, etc.)
// which are included in Tailwind v4's default theme.
// Glow values are CSS box-shadow strings for inline style — needed because
// Tailwind can't generate the multi-layer color values dynamically.

interface CatVisual {
  border: string;   // Tailwind class
  bg: string;       // Tailwind class
  icon: string;     // Tailwind class
  idleGlow: string; // CSS box-shadow
  activeGlow: string;
}

const CAT_VISUAL: Record<CapabilityCategory, CatVisual> = {
  AI: {
    border:     'border-pink-300/60 dark:border-pink-400/50',
    bg:         'bg-pink-50/70 dark:bg-pink-950/25',
    icon:       'text-pink-500 dark:text-pink-400',
    idleGlow:   '0 0 0 1px rgba(244,114,182,.10), inset 0 1px 3px rgba(244,114,182,.08)',
    activeGlow: '0 0 22px rgba(244,114,182,.55), 0 0 44px rgba(244,114,182,.22), inset 0 1px 4px rgba(244,114,182,.18)',
  },
  Backend: {
    border:     'border-violet-300/60 dark:border-violet-400/50',
    bg:         'bg-violet-50/70 dark:bg-violet-950/25',
    icon:       'text-violet-500 dark:text-violet-400',
    idleGlow:   '0 0 0 1px rgba(167,139,250,.10), inset 0 1px 3px rgba(167,139,250,.08)',
    activeGlow: '0 0 22px rgba(167,139,250,.55), 0 0 44px rgba(167,139,250,.22), inset 0 1px 4px rgba(167,139,250,.18)',
  },
  Cloud: {
    border:     'border-sky-300/60 dark:border-sky-400/50',
    bg:         'bg-sky-50/70 dark:bg-sky-950/25',
    icon:       'text-sky-500 dark:text-sky-400',
    idleGlow:   '0 0 0 1px rgba(56,189,248,.10), inset 0 1px 3px rgba(56,189,248,.08)',
    activeGlow: '0 0 22px rgba(56,189,248,.55), 0 0 44px rgba(56,189,248,.22), inset 0 1px 4px rgba(56,189,248,.18)',
  },
  Frontend: {
    border:     'border-rose-300/60 dark:border-rose-400/50',
    bg:         'bg-rose-50/70 dark:bg-rose-950/25',
    icon:       'text-rose-500 dark:text-rose-400',
    idleGlow:   '0 0 0 1px rgba(251,113,133,.10), inset 0 1px 3px rgba(251,113,133,.08)',
    activeGlow: '0 0 22px rgba(251,113,133,.55), 0 0 44px rgba(251,113,133,.22), inset 0 1px 4px rgba(251,113,133,.18)',
  },
  Automation: {
    border:     'border-purple-300/60 dark:border-purple-400/50',
    bg:         'bg-purple-50/70 dark:bg-purple-950/25',
    icon:       'text-purple-500 dark:text-purple-400',
    idleGlow:   '0 0 0 1px rgba(192,132,252,.10), inset 0 1px 3px rgba(192,132,252,.08)',
    activeGlow: '0 0 22px rgba(192,132,252,.55), 0 0 44px rgba(192,132,252,.22), inset 0 1px 4px rgba(192,132,252,.18)',
  },
  DevOps: {
    border:     'border-slate-300/60 dark:border-slate-500/50',
    bg:         'bg-slate-50/70 dark:bg-slate-900/25',
    icon:       'text-slate-500 dark:text-slate-400',
    idleGlow:   '0 0 0 1px rgba(148,163,184,.10), inset 0 1px 3px rgba(148,163,184,.08)',
    activeGlow: '0 0 18px rgba(148,163,184,.45), 0 0 36px rgba(148,163,184,.18), inset 0 1px 4px rgba(148,163,184,.15)',
  },
};

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  node: CapabilityNode;
  isActive: boolean;
  isConnected: boolean;
  isDimmed: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function CapabilityNodeButton({
  node, isActive, isConnected, isDimmed,
  onClick, onMouseEnter, onMouseLeave, onFocus, onBlur,
}: Props) {
  const reduce = useReducedMotion();
  const cfg = CAT_VISUAL[node.category];
  const Icon = ICON_MAP[node.iconKey] ?? Globe;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${node.position.x}%`,
        top:  `${node.position.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isActive ? 20 : 10,
      }}
      animate={
        reduce
          ? { opacity: isDimmed ? 0.35 : 1 }
          : {
              scale:   isActive ? 1.1 : isConnected ? 1.04 : 1,
              opacity: isDimmed ? 0.35 : 1,
            }
      }
      transition={{ type: 'spring', stiffness: 310, damping: 24 }}
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
        className="group flex flex-col items-center gap-2 focus-visible:outline-none"
      >
        {/* ── Glassy circle ─────────────────────────────────────────────── */}
        <div
          className={cn(
            'relative flex h-[54px] w-[54px] items-center justify-center rounded-full',
            'border-2 backdrop-blur-sm transition-shadow duration-350',
            cfg.border,
            cfg.bg,
            // Focus ring rendered on the circle, not the full button
            'group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background',
          )}
          style={{
            boxShadow: isActive ? cfg.activeGlow : cfg.idleGlow,
            // Radial inner glow using the category color
            background: isActive
              ? `radial-gradient(circle at 38% 32%, rgba(255,255,255,.55) 0%, transparent 65%),
                 radial-gradient(circle at 65% 70%, ${CATEGORY_DOT[node.category]}22 0%, transparent 55%)`
              : `radial-gradient(circle at 38% 32%, rgba(255,255,255,.40) 0%, transparent 65%)`,
          }}
        >
          <Icon
            className={cn('relative z-10 h-5 w-5', cfg.icon)}
            strokeWidth={1.75}
          />
        </div>

        {/* ── Label ─────────────────────────────────────────────────────── */}
        <span
          className={cn(
            'max-w-[72px] text-center text-[10px] font-medium leading-tight',
            'transition-colors duration-200',
            isActive ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {node.label}
        </span>
      </button>
    </motion.div>
  );
}
