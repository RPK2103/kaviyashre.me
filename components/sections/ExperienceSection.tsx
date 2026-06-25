'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { experienceData, type ExperienceItem } from '@/data/experience';
import { SECTION_PY } from '@/lib/constants';

/* ── Shared viewport config ───────────────────────────────────────────────── */

const VIEWPORT = { once: false, amount: 0.35 } as const;

/* ── Slide variant (card + date) — spring per spec ───────────────────────── */

function slideVariant(fromX: number, delay = 0) {
  return {
    hidden: { opacity: 0, x: fromX },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 90,
        damping: 18,
        delay,
      },
    },
  };
}

// Opacity-only fallback for reduced-motion users
function fadeVariant(delay = 0) {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.4, delay },
    },
  };
}

/* ── Logo node spring — overshoots to ~1.06 then settles at 1 ────────────── */

const nodeSpring = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      opacity: { duration: 0.25, delay: 0.06 },
      scale: {
        type: 'spring' as const,
        stiffness: 180,
        damping: 12,
        delay: 0.06,
      },
    },
  },
};

const nodeFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

/* ── Section header reveal ────────────────────────────────────────────────── */

const headerReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

/* ── Company logo (image + initials fallback) ─────────────────────────────── */

function CompanyLogo({ item }: { item: ExperienceItem }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!item.logoUrl || imageFailed) {
    return (
      <span className="label-mono select-none text-xs font-semibold text-[var(--primary)]">
        {item.logoFallback}
      </span>
    );
  }

  return (
    <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.logoUrl}
        alt={`${item.company} logo`}
        className="h-full w-full rounded-full object-cover"
        onError={() => setImageFailed(true)}
      />
    </span>
  );
}

/* ── Logo node ────────────────────────────────────────────────────────────── */

interface LogoNodeProps {
  item: ExperienceItem;
  isActive: boolean;
  onActivate: (id: string | null) => void;
}

function LogoNode({ item, isActive, onActivate }: LogoNodeProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      aria-label={`${item.role} at ${item.company}`}
      className="group relative z-10 flex cursor-default items-center justify-center focus:outline-none"
      /* ── Scroll-entry animation ── */
      variants={prefersReduced ? nodeFade : nodeSpring}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      /* ── Hover / focus → connected state ── */
      onHoverStart={() => onActivate(item.id)}
      onHoverEnd={() => onActivate(null)}
      onFocus={() => onActivate(item.id)}
      onBlur={() => onActivate(null)}
    >
      {/* Glow ring */}
      <span
        className="pointer-events-none absolute rounded-full transition-all duration-300"
        style={{
          inset: '-6px',
          opacity: isActive ? 1 : 0,
          boxShadow: '0 0 0 2px var(--primary), 0 0 24px var(--glow-primary)',
        }}
      />
      {/* Focus ring */}
      <span
        className="pointer-events-none absolute rounded-full opacity-0 transition-opacity duration-200 group-focus-visible:opacity-100"
        style={{ inset: '-4px', boxShadow: '0 0 0 2px var(--ring)' }}
      />
      {/* Circle */}
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full',
          'h-[52px] w-[52px] md:h-16 md:w-16',
          'border transition-all duration-300 ease-out',
          isActive ? 'scale-[1.04] border-primary' : 'border-border',
        )}
        style={{
          background: '#ffffff',
          boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)',
        }}
      >
        <CompanyLogo item={item} />
      </div>
    </motion.button>
  );
}

/* ── Date / location label ────────────────────────────────────────────────── */

interface DateLabelProps {
  item: ExperienceItem;
  align: 'left' | 'right';
}

function DateLabel({ item, align }: DateLabelProps) {
  const prefersReduced = useReducedMotion();
  // align="right" → date is in LEFT column → enters from LEFT (negative x)
  // align="left"  → date is in RIGHT column → enters from RIGHT (positive x)
  const fromX = align === 'right' ? -40 : 40;

  return (
    <motion.div
      className={cn(
        'flex flex-col gap-1',
        align === 'right' ? 'items-end text-right' : 'items-start text-left',
      )}
      variants={prefersReduced ? fadeVariant(0.1) : slideVariant(fromX, 0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <span className="label-mono text-xs font-semibold uppercase tracking-[0.15em] text-[var(--primary)]">
        {item.startDate} — {item.endDate}
      </span>
      <span className="mt-0.5 text-xs text-[var(--muted-foreground)]">{item.location}</span>
    </motion.div>
  );
}

/* ── Card notch + horizontal connector trace ──────────────────────────────── */

function CardNotch({ isLeft, isActive }: { isLeft: boolean; isActive: boolean }) {
  const prefersReduced = useReducedMotion();
  const borderColor = isActive ? 'var(--primary)' : 'var(--border)';
  // Connector trace: fades in from notch tip toward the node
  const connectorOpacity = isActive ? 0.5 : 0;
  // top: 36px aligns with the visual center of the 16px-tall triangle (top-7=28px + 8px)
  const connectorTop = '36px';

  if (isLeft) {
    return (
      <>
        {/* Border triangle */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-7 hidden md:block"
          style={{
            right: '-9px',
            width: 0, height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: `9px solid ${borderColor}`,
            transition: 'border-left-color 300ms',
          }}
        />
        {/* Fill triangle */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-7 hidden md:block"
          style={{
            right: '-8px',
            width: 0, height: 0,
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            borderLeft: '8px solid var(--surface)',
          }}
        />
        {/* Connector trace: extends from notch tip toward the center node */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute hidden md:block"
          style={{
            top: connectorTop,
            right: '-26px',    // starts at notch tip (+9px) and extends ~17px further right
            width: '17px',
            height: '1px',
            opacity: connectorOpacity,
            transition: 'opacity 300ms ease',
            background: 'linear-gradient(to right, var(--primary), transparent)',
            boxShadow: prefersReduced ? 'none' : '0 0 3px 1px var(--glow-primary)',
          }}
        />
      </>
    );
  }

  return (
    <>
      {/* Border triangle */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-7 hidden md:block"
        style={{
          left: '-9px',
          width: 0, height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: `9px solid ${borderColor}`,
          transition: 'border-right-color 300ms',
        }}
      />
      {/* Fill triangle */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-7 hidden md:block"
        style={{
          left: '-8px',
          width: 0, height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '8px solid var(--surface)',
        }}
      />
      {/* Connector trace: extends from notch tip toward the center node */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute hidden md:block"
        style={{
          top: connectorTop,
          left: '-26px',
          width: '17px',
          height: '1px',
          opacity: connectorOpacity,
          transition: 'opacity 300ms ease',
          background: 'linear-gradient(to left, var(--primary), transparent)',
          boxShadow: prefersReduced ? 'none' : '0 0 3px 1px var(--glow-primary)',
        }}
      />
    </>
  );
}

/* ── Experience card ──────────────────────────────────────────────────────── */

interface CardProps {
  item: ExperienceItem;
  isLeft: boolean;
  showMobileMeta: boolean;
  isActive: boolean;
  onActivate: (id: string | null) => void;
}

function ExperienceCard({ item, isLeft, showMobileMeta, isActive, onActivate }: CardProps) {
  const prefersReduced = useReducedMotion();
  // Left card slides from left, right card slides from right
  const fromX = isLeft ? -60 : 60;

  return (
    <motion.article
      className={cn(
        'relative rounded-md border bg-[var(--surface)]',
        'w-full max-w-[460px]',
        'transition-[border-color,box-shadow] duration-300',
        isActive ? 'border-[var(--primary)]' : 'border-[var(--border)]',
      )}
      style={{ boxShadow: isActive ? 'var(--shadow-md)' : 'var(--shadow-sm)' }}
      onMouseEnter={() => onActivate(item.id)}
      onMouseLeave={() => onActivate(null)}
      /* ── Scroll-entry animation ── */
      variants={prefersReduced ? fadeVariant() : slideVariant(fromX)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      <CardNotch isLeft={isLeft} isActive={isActive} />

      <div className="p-5">
        {/* Mobile: date header */}
        {showMobileMeta && (
          <div className="mb-3.5 border-b border-[var(--border-subtle)] pb-3">
            <span className="label-mono block text-xs font-semibold uppercase tracking-[0.15em] text-[var(--primary)]">
              {item.startDate} — {item.endDate}
            </span>
            <span className="mt-1 block text-xs text-[var(--muted-foreground)]">
              {item.location}
            </span>
          </div>
        )}

        {/* Role (most prominent) + company (mono, muted) */}
        <header className="mb-3">
          <h3 className="font-display text-base font-semibold leading-snug text-[var(--foreground)]">
            {item.role}
          </h3>
          <p className="label-mono mt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--primary)] opacity-70">
            {item.company}
          </p>
        </header>

        {/* Summary */}
        <p className="mb-3.5 text-sm leading-relaxed text-[var(--foreground-secondary)]">
          {item.summary}
        </p>

        {/* Bullets */}
        <ul className="mb-4 space-y-2" aria-label="Key contributions">
          {item.bullets.map((bullet, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs leading-relaxed text-[var(--foreground-secondary)]"
            >
              <span
                className="mt-[5px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--primary)] opacity-50"
                aria-hidden="true"
              />
              {bullet}
            </li>
          ))}
        </ul>

        {/* Tech chips */}
        <div className="flex flex-wrap gap-1.5" role="list" aria-label="Technologies">
          {item.tech.map((t) => (
            <span
              key={t}
              role="listitem"
              className={cn(
                'label-mono rounded-sm border border-[var(--border-subtle)]',
                'bg-[var(--surface-raised)] px-2 py-[3px] text-[10px]',
                'text-[var(--foreground-secondary)]',
              )}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Growth signal */}
      <div className="rounded-b-md border-t border-[var(--border-subtle)] bg-[var(--surface-raised)] px-5 py-3">
        <span className="label-mono mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Growth Signal
        </span>
        <p className="text-xs leading-relaxed text-[var(--foreground-secondary)]">
          {item.growth}
        </p>
      </div>
    </motion.article>
  );
}

/* ── Timeline item (one row) ──────────────────────────────────────────────── */

interface TimelineItemProps {
  item: ExperienceItem;
  index: number;
  activeId: string | null;
  onActivate: (id: string | null) => void;
}

function TimelineItem({ item, index, activeId, onActivate }: TimelineItemProps) {
  const prefersReduced = useReducedMotion();
  const isLeft = index % 2 === 0; // even → card left, odd → card right
  const isActive = activeId === item.id;

  return (
    <div>
      {/* ── Desktop: 3-column grid ──────────────────────────────────────── */}
      <div className="hidden md:grid grid-cols-[1fr_72px_1fr] items-start gap-x-3">
        {/* Left column */}
        <div className="flex justify-end">
          {isLeft ? (
            <ExperienceCard
              item={item}
              isLeft
              showMobileMeta={false}
              isActive={isActive}
              onActivate={onActivate}
            />
          ) : (
            <div className="pt-[22px] flex w-full justify-end">
              <DateLabel item={item} align="right" />
            </div>
          )}
        </div>

        {/* Center node — relative so the segment glow is contained here */}
        <div className="relative flex justify-center pt-[22px]">
          {/* Local vertical segment glow: lights up the timeline at this node */}
          <span
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-0 bottom-0"
            style={{
              width: '4px',
              borderRadius: '9999px',
              opacity: isActive ? 1 : 0,
              transition: 'opacity 350ms ease',
              background: 'var(--primary)',
              filter: prefersReduced ? 'none' : 'blur(3px)',
              boxShadow: prefersReduced ? 'none' : '0 0 10px 3px var(--glow-primary)',
            }}
            aria-hidden="true"
          />
          <LogoNode item={item} isActive={isActive} onActivate={onActivate} />
        </div>

        {/* Right column */}
        <div className="flex justify-start">
          {isLeft ? (
            <div className="pt-[22px] flex w-full justify-start">
              <DateLabel item={item} align="left" />
            </div>
          ) : (
            <ExperienceCard
              item={item}
              isLeft={false}
              showMobileMeta={false}
              isActive={isActive}
              onActivate={onActivate}
            />
          )}
        </div>
      </div>

      {/* ── Mobile: node left + card right ──────────────────────────────── */}
      <div className="flex items-start gap-4 md:hidden">
        <div className="relative z-10 w-14 flex-shrink-0 pt-1">
          <LogoNode item={item} isActive={isActive} onActivate={onActivate} />
        </div>
        <div className="min-w-0 flex-1">
          <ExperienceCard
            item={item}
            isLeft={false}
            showMobileMeta
            isActive={isActive}
            onActivate={onActivate}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Main section ─────────────────────────────────────────────────────────── */

export function ExperienceSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const hasActive = activeId !== null;

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className={cn('relative scroll-mt-20 bg-background', SECTION_PY)}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[var(--border-subtle)]" aria-hidden="true" />

      <Container>
        {/* ── Section header ─────────────────────────────────────────────── */}
        <motion.div
          className="mb-14 max-w-xl lg:mb-16"
          variants={headerReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <SectionHeader
            eyebrow="Career System"
            title="Experience."
            subtitle="A timeline of engineering ownership, production systems, and applied AI growth."
            headingId="experience-heading"
          />
        </motion.div>

        {/* ── Timeline ───────────────────────────────────────────────────── */}
        <div className="relative">
          {/* Desktop vertical line */}
          <div
            className={cn(
              'timeline-line absolute left-1/2 top-0 bottom-0 hidden -translate-x-1/2 md:block',
              'transition-opacity duration-300',
            )}
            style={{ width: '1px', opacity: hasActive ? 0.5 : 1 }}
            aria-hidden="true"
          />

          {/* Desktop hover-active line overlay */}
          <div
            className="timeline-line-active absolute left-1/2 top-0 bottom-0 hidden -translate-x-1/2 md:block"
            style={{ width: '2px', opacity: hasActive ? 1 : 0, transition: 'opacity 300ms' }}
            aria-hidden="true"
          />

          {/* Mobile left line — left-7 = center of w-14 node */}
          <div
            className="timeline-line absolute left-7 top-0 bottom-0 md:hidden"
            style={{ width: '1px' }}
            aria-hidden="true"
          />

          <ol aria-label="Career timeline" className="flex flex-col gap-10 md:gap-14">
            {experienceData.map((item, index) => (
              <li key={item.id}>
                <TimelineItem
                  item={item}
                  index={index}
                  activeId={activeId}
                  onActivate={setActiveId}
                />
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
