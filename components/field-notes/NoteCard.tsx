'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NoteData } from '@/data/notes';

// ─── Entrance animation variants ─────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const cardVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface NoteCardProps {
  note: NoteData;
  /** Renders the prominent featured layout with accent bar and larger type scale. */
  featured?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function NoteCard({ note, featured = false }: NoteCardProps) {
  const reduced = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const isPublished = note.status === 'published';
  const isComingSoon = note.status === 'coming-soon';

  // ── Wrapper props — only fully interactive when published ───────────────────
  // Coming-soon cards still receive hover visual feedback (border + shadow)
  // so the section doesn't feel dead, but they carry no interactive role.

  const interactiveProps = isPublished
    ? {
        role: 'link' as const,
        tabIndex: 0,
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        onFocus: () => setIsHovered(true),
        onBlur: () => setIsHovered(false),
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter') window.location.href = `/notes/${note.slug}`;
        },
        'aria-label': `Read ${note.title}`,
      }
    : {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        'aria-label': `${note.title} — coming soon`,
      };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <motion.div
      variants={reduced ? cardVariantsReduced : cardVariants}
      animate={
        reduced
          ? {}
          : {
              // Only lift published cards — coming-soon cards should not imply
              // interactivity they don't have, but featured gets a slightly
              // more generous lift due to its larger visual footprint.
              y: isPublished && isHovered ? (featured ? -5 : -4) : 0,
            }
      }
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      {...interactiveProps}
      className={cn(
        'group relative flex flex-col',
        'w-full overflow-hidden rounded-2xl',
        'bg-[var(--surface)]',
        'border transition-[border-color,box-shadow,transform] duration-300 ease-out',
        isHovered ? 'border-[var(--primary)]' : 'border-[var(--border)]',
        /* light — resting */
        'shadow-[0_1px_4px_rgba(30,27,24,0.04),0_2px_14px_-2px_rgba(121,84,101,0.08)]',
        /* light — hover */
        isHovered && featured
          ? 'shadow-[0_6px_36px_-4px_rgba(121,84,101,0.20),0_2px_12px_rgba(30,27,24,0.06)]'
          : isHovered
          ? 'shadow-[0_4px_24px_-4px_rgba(121,84,101,0.15),0_1px_8px_rgba(30,27,24,0.05)]'
          : '',
        /* dark — resting */
        'dark:shadow-[0_1px_3px_rgba(0,0,0,0.28),0_4px_18px_-4px_rgba(0,0,0,0.42)]',
        /* dark — hover */
        isHovered &&
          'dark:shadow-[0_4px_32px_-4px_rgba(139,92,246,0.20),0_1px_10px_rgba(0,0,0,0.38)]',
        isPublished && 'cursor-pointer select-none',
        isPublished &&
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background-subtle)]',
      )}
    >
      {/* ── Featured accent bar ──────────────────────────────────────────────── */}
      {/*
       * A 3 px left bar signals this is the primary piece without adding
       * decorative chrome. Absolute + full-height so it stays flush to the
       * card edge regardless of padding or content height.
       */}
      {featured && (
        <div
          className="absolute inset-y-0 left-0 w-[3px] rounded-r-sm bg-[var(--primary)]"
          aria-hidden
        />
      )}

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div
        className={cn(
          'flex flex-1 flex-col',
          featured ? 'p-7 lg:p-10' : 'p-6',
        )}
      >

        {/* ── Category — flat editorial label, not a pill/badge ─────────────── */}
        {/*
         * Plain small-caps tracking instead of a rounded pill keeps this
         * feeling like a curated journal rather than a tag cloud.
         */}
        <p className="label-mono mb-3 text-[10px] font-semibold uppercase tracking-[0.20em] text-[var(--muted-foreground)]">
          {note.category}
          {featured && (
            <span className="opacity-40"> · Featured</span>
          )}
        </p>

        {/* ── Title ────────────────────────────────────────────────────────── */}
        <h3
          className={cn(
            'font-display font-semibold leading-tight tracking-tight',
            'text-[var(--foreground)] mb-3',
            featured
              ? 'text-2xl sm:text-[1.75rem] lg:text-[2rem]'
              : 'text-[1.0625rem] sm:text-[1.125rem]',
          )}
        >
          {note.title}
        </h3>

        {/* ── Summary ──────────────────────────────────────────────────────── */}
        <p
          className={cn(
            'leading-relaxed text-[var(--foreground-secondary)]',
            featured
              ? 'text-[0.9375rem] max-w-[56ch]'
              : 'text-sm max-w-[44ch]',
          )}
        >
          {note.summary}
        </p>

        {/* ── Spacer ───────────────────────────────────────────────────────── */}
        <div className="min-h-[20px] flex-1" aria-hidden />

        {/* ── Tags (featured card only) ─────────────────────────────────────── */}
        {featured && note.tags.length > 0 && (
          <div
            className="mb-5 flex flex-wrap gap-1.5"
            role="list"
            aria-label={`Tags for ${note.title}`}
          >
            {note.tags.map((tag) => (
              <span
                key={tag}
                role="listitem"
                className={cn(
                  'label-mono rounded border px-2.5 py-[0.3125rem]',
                  'text-[10px] font-medium',
                  'border-[var(--border)] bg-[var(--surface-raised)]',
                  'text-[var(--foreground-secondary)]',
                  'transition-opacity duration-200',
                  isHovered ? 'opacity-100' : 'opacity-[0.65]',
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Footer: read time · date  /  CTA ─────────────────────────────── */}
        <div
          className={cn(
            'border-t pt-4',
            'transition-colors duration-300',
            isHovered ? 'border-[var(--border)]' : 'border-[var(--border-subtle)]',
          )}
        >
          <div className="flex items-center justify-between gap-x-4">

            {/* Left — read time + date */}
            <span
              className="label-mono inline-flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)]"
              aria-label={`${note.readTime}${note.date ? `, ${note.date}` : ''}`}
            >
              <Clock size={11} aria-hidden />
              {note.readTime}
              {note.date && (
                <>
                  <span className="opacity-35" aria-hidden>·</span>
                  <span>{note.date}</span>
                </>
              )}
            </span>

            {/* Right — CTA */}
            {isComingSoon ? (
              <span
                className="label-mono inline-flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)] opacity-55"
                aria-label="This note is not yet published"
              >
                <span
                  className="h-[5px] w-[5px] shrink-0 rounded-full bg-current"
                  aria-hidden
                />
                Coming soon
              </span>
            ) : (
              <span
                className={cn(
                  'inline-flex items-center text-[12px] font-medium',
                  'text-[var(--primary)] transition-all duration-200',
                  isHovered ? 'gap-2.5' : 'gap-1.5',
                )}
                aria-hidden
              >
                Read note
                <ArrowRight
                  size={12}
                  aria-hidden
                  className={cn(
                    'transition-transform duration-200',
                    isHovered ? 'translate-x-0.5' : '',
                  )}
                />
              </span>
            )}

          </div>
        </div>

      </div>
    </motion.div>
  );
}
