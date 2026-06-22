'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type SkillItem } from '@/data/skills';

interface SkillNodeProps {
  node: SkillItem;
  isActive: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}

export function SkillNode({
  node,
  isActive,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}: SkillNodeProps) {
  const reduce = useReducedMotion();

  if (node.type === 'root') {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onFocus={onFocus}
        onBlur={onBlur}
        aria-pressed={isActive}
        whileHover={reduce ? undefined : { scale: 1.08 }}
        whileTap={reduce ? undefined : { scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        className={cn(
          'flex flex-col items-center justify-center rounded-xl border px-3.5 py-2.5',
          'min-w-[72px] cursor-pointer text-center select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'transition-colors duration-200',
          isActive
            ? [
                'border-accent/50 bg-accent-muted text-accent',
                'shadow-[0_0_18px_color-mix(in_srgb,var(--accent)_22%,transparent)]',
              ]
            : [
                'border-border bg-surface text-foreground',
                'hover:border-accent/35 hover:bg-surface-raised',
                'shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.25)]',
              ],
        )}
      >
        {node.emoji && (
          <span className="text-lg leading-none" aria-hidden>
            {node.emoji}
          </span>
        )}
        <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em]">
          {node.label}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      aria-pressed={isActive}
      whileHover={reduce ? undefined : { scale: 1.06 }}
      whileTap={reduce ? undefined : { scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className={cn(
        'flex items-center rounded-lg border px-2.5 py-1.5',
        'text-[11px] font-medium whitespace-nowrap cursor-pointer select-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
        'transition-colors duration-200',
        isActive
          ? [
              'border-accent/40 bg-accent-muted text-accent',
              'shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_15%,transparent)]',
            ]
          : [
              'border-border-subtle bg-surface text-foreground-secondary',
              'hover:border-accent/30 hover:bg-surface-raised hover:text-foreground',
            ],
      )}
    >
      {node.label}
    </motion.button>
  );
}
