import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps {
  /** Small uppercase eyebrow label */
  eyebrow: string;
  /** Main heading — string or JSX for line breaks / emphasis */
  title: ReactNode;
  /** `id` for aria-labelledby on parent sections */
  headingId?: string;
  className?: string;
  align?: 'left' | 'center';
  /** Tighter heading scale for nested layouts (e.g. contact card) */
  size?: 'default' | 'compact';
}

const alignClasses = {
  left: 'text-left',
  center: 'mx-auto text-center',
} as const;

const titleClasses = {
  default:
    'font-display text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-4xl',
  compact:
    'font-display text-2xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-3xl',
} as const;

/**
 * Shared section heading pattern: eyebrow → title.
 * Keeps visual rhythm consistent across homepage sections.
 */
export function SectionHeader({
  eyebrow,
  title,
  headingId,
  className,
  align = 'left',
  size = 'default',
}: SectionHeaderProps) {
  return (
    <header className={cn(alignClasses[align], className)}>
      <p className="label-mono mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
        {eyebrow}
      </p>
      <h2 id={headingId} className={titleClasses[size]}>
        {title}
      </h2>
    </header>
  );
}
