'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { NoteData } from '@/data/notes';

// ─── Entrance animation — participates in parent stagger container ────────────

const rowVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const rowVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface NoteRowProps {
  note: NoteData;
  /** Wraps in motion.div for parent stagger — false inside the archive modal. */
  animated?: boolean;
  /** Thin bottom separator — true for all rows except the last. */
  showDivider?: boolean;
}

// ─── Status label ─────────────────────────────────────────────────────────────

function NoteStatus({ note, isHovered }: { note: NoteData; isHovered: boolean }) {
  if (note.status === 'coming-soon') {
    return (
      <span
        className="label-mono inline-flex items-center gap-1.5 text-[10.5px] text-[var(--muted-foreground)] opacity-50"
        aria-label="This note is not yet published"
      >
        <span
          className="h-[5px] w-[5px] shrink-0 rounded-full bg-current"
          aria-hidden
        />
        Coming soon
      </span>
    );
  }

  if (note.status === 'published') {
    return (
      <span
        className={cn(
          'label-mono text-[11px] font-medium text-[var(--primary)]',
          'transition-all duration-200',
          isHovered ? 'opacity-100 translate-x-0.5' : 'opacity-60',
        )}
        aria-hidden
      >
        Read note →
      </span>
    );
  }

  return null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NoteRow({ note, animated = true, showDivider = false }: NoteRowProps) {
  const reduced = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const isComingSoon = note.status === 'coming-soon';
  const isPublished = note.status === 'published';

  const rowContent = (
    <div
      className={cn(
        'flex items-start justify-between gap-5 py-5 sm:gap-8 sm:py-6',
        isPublished && 'cursor-pointer',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── Text content ───────────────────────────────────────────────────── */}
      <div className="min-w-0 flex-1">

        {/* Meta: category · read time · date */}
        <p
          className="label-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]"
          aria-label={`${note.category}, ${note.readTime}${note.date ? `, ${note.date}` : ''}`}
        >
          {note.category}
          <span className="mx-1.5 opacity-40" aria-hidden>·</span>
          {note.readTime}
          {note.date && (
            <>
              <span className="mx-1.5 opacity-40" aria-hidden>·</span>
              <span>{note.date}</span>
            </>
          )}
          {isComingSoon && (
            <>
              <span className="mx-1.5 opacity-40 sm:hidden" aria-hidden>·</span>
              <span className="sm:hidden opacity-50">Coming soon</span>
            </>
          )}
        </p>

        {/* Title */}
        {isPublished ? (
          <a
            href={`/notes/${note.slug}`}
            className={cn(
              'mt-1.5 block font-display text-[1.0625rem] font-semibold leading-snug tracking-tight',
              'transition-colors duration-200 outline-none',
              'focus-visible:underline focus-visible:decoration-[var(--primary)]',
              isHovered ? 'text-[var(--primary)]' : 'text-[var(--foreground)]',
            )}
          >
            {note.title}
          </a>
        ) : (
          <h3
            className={cn(
              'mt-1.5 font-display text-[1.0625rem] font-semibold leading-snug tracking-tight',
              'transition-colors duration-200',
              isHovered ? 'text-[var(--primary)]' : 'text-[var(--foreground)]',
            )}
          >
            {note.title}
          </h3>
        )}

        {/* Summary */}
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--foreground-secondary)] sm:line-clamp-1">
          {note.summary}
        </p>
      </div>

      {/* ── Status — desktop right column ──────────────────────────────────── */}
      <div className="hidden shrink-0 pt-0.5 sm:block">
        <NoteStatus note={note} isHovered={isHovered} />
      </div>
    </div>
  );

  const dividerClass = showDivider ? 'border-b border-[var(--border-subtle)]' : '';

  if (!animated) {
    return <div className={dividerClass}>{rowContent}</div>;
  }

  return (
    <motion.div
      className={dividerClass}
      variants={reduced ? rowVariantsReduced : rowVariants}
    >
      {rowContent}
    </motion.div>
  );
}
