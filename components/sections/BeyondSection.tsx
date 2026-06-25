'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Transition } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { beyondPanels, type BeyondPanel } from '@/data/beyond';
import { fadeInUp } from '@/lib/animations';
import { cn } from '@/lib/utils';

// ─── Animation constants ──────────────────────────────────────────────────────

const ACCORDION_SPRING: Transition = {
  type: 'spring',
  stiffness: 140,
  damping: 20,
};

const CONTENT_TRANSITION: Transition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1],
};

// ─── Section ──────────────────────────────────────────────────────────────────

export function BeyondSection() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const accordionSpring: Transition = reduced
    ? { duration: 0.2, ease: 'easeOut' }
    : ACCORDION_SPRING;

  return (
    <section
      id="beyond"
      aria-label="Beyond 9-5"
      className="scroll-mt-20 overflow-x-hidden bg-background"
    >
      {/* ── Section header ── */}
      <Container className="pt-20 pb-10 lg:pt-28 lg:pb-14">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">
            Offline System
          </p>
          <h2 className="text-3xl font-bold tracking-[-0.025em] text-foreground sm:text-4xl">
            Beyond 9–5
          </h2>
          <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-foreground-secondary">
            The parts of me that keep the engineering brain alive outside work.
          </p>
        </motion.div>
      </Container>

      {/* ── Desktop: horizontal image accordion ── */}
      {/* Outer shell: visibility + centering only */}
      <div className="hidden md:block">
        <motion.div
          role="list"
          aria-label="Interest panels"
          className={cn(
            /* height — tablet → desktop → xl */
            'flex md:h-[460px] lg:h-[540px] xl:max-h-[580px]',
            /* visual shell */
            'overflow-hidden rounded-[28px]',
            /* border */
            'border border-border-subtle dark:border-white/10',
            /* light theme: warm mauve shadow */
            'shadow-[0_2px_16px_-2px_rgba(121,84,101,0.14),0_1px_4px_rgba(30,27,24,0.05)]',
            /* dark theme: violet glow */
            'dark:shadow-[0_4px_32px_-4px_rgba(139,92,246,0.24),0_8px_48px_-8px_rgba(0,0,0,0.50)]',
          )}
          style={{ width: '80%', maxWidth: 1280, marginInline: 'auto' }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
        {beyondPanels.map((panel) => (
          <DesktopPanel
            key={panel.id}
            panel={panel}
            isActive={activeId === panel.id}
            hasActive={activeId !== null}
            onActivate={() => setActiveId(panel.id)}
            onDeactivate={() => setActiveId(null)}
            spring={accordionSpring}
            reduced={!!reduced}
          />
        ))}
        </motion.div>
      </div>

      {/* ── Mobile: stacked tap-to-expand cards ── */}
      <Container className="md:hidden pb-20 pt-2">
        <div className="flex flex-col gap-3">
          {beyondPanels.map((panel) => (
            <MobileCard
              key={panel.id}
              panel={panel}
              isActive={activeId === panel.id}
              onToggle={() =>
                setActiveId(activeId === panel.id ? null : panel.id)
              }
            />
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── Desktop panel ────────────────────────────────────────────────────────────

interface DesktopPanelProps {
  panel: BeyondPanel;
  isActive: boolean;
  hasActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  spring: Transition;
  reduced: boolean;
}

function DesktopPanel({
  panel,
  isActive,
  hasActive,
  onActivate,
  onDeactivate,
  spring,
  reduced,
}: DesktopPanelProps) {
  return (
    <motion.div
      role="listitem"
      tabIndex={0}
      aria-label={`${panel.title}: ${panel.caption}`}
      /* flexGrow drives the accordion expansion */
      animate={{ flexGrow: isActive ? 4.5 : hasActive ? 0.62 : 1 }}
      transition={spring}
      style={{ flexBasis: '0%', flexShrink: 1, minWidth: 44 }}
      className={cn(
        'relative overflow-hidden cursor-pointer',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent',
      )}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          isActive ? onDeactivate() : onActivate();
        }
      }}
    >
      {/* Gradient placeholder — shows through whenever image is absent */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: panel.placeholderGradient }}
      />

      {/* Image via CSS background — bypasses Next.js optimization, loads directly */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${panel.imagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: isActive
            ? 'grayscale(0%) brightness(1)'
            : 'grayscale(100%) brightness(0.65)',
          transition: reduced ? 'opacity 0.2s ease' : 'filter 0.45s ease',
          opacity: reduced && !isActive ? 0.65 : 1,
        }}
      />

      {/* Dark gradient overlay — fades in on active */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={CONTENT_TRANSITION}
      />

      {/* Title + caption — revealed on active */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-5 lg:p-6"
        animate={
          reduced
            ? { opacity: isActive ? 1 : 0 }
            : { opacity: isActive ? 1 : 0, y: isActive ? 0 : 16 }
        }
        transition={{
          ...CONTENT_TRANSITION,
          delay: isActive ? 0.08 : 0,
        }}
        aria-hidden={!isActive}
      >
        <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/70">
          {panel.title}
        </p>
        <p className="text-[13px] leading-relaxed text-white/60 max-w-[24ch]">
          {panel.caption}
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Mobile card ──────────────────────────────────────────────────────────────

interface MobileCardProps {
  panel: BeyondPanel;
  isActive: boolean;
  onToggle: () => void;
}

function MobileCard({ panel, isActive, onToggle }: MobileCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      aria-expanded={isActive}
      aria-label={isActive ? `${panel.title} — ${panel.caption}` : panel.title}
      onClick={onToggle}
      animate={{ height: isActive ? 220 : 100 }}
      transition={
        reduced
          ? { duration: 0.2 }
          : { type: 'spring', stiffness: 160, damping: 22 }
      }
      style={{ height: 100 }}
      className={cn(
        'relative w-full overflow-hidden rounded-xl text-left',
        'border border-black/[0.07] dark:border-white/[0.05]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
      )}
    >
      {/* Gradient fallback — shows through whenever image is absent */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: panel.placeholderGradient }}
      />

      {/* Image via CSS background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${panel.imagePath})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: isActive
            ? 'grayscale(0%) brightness(1)'
            : 'grayscale(100%) brightness(0.65)',
          transition: 'filter 0.4s ease',
        }}
      />

      {/* Overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"
      />

      {/* Always-visible title + conditional caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/80">
          {panel.title}
        </p>
        <AnimatePresence>
          {isActive && (
            <motion.p
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: 4 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="mt-1.5 text-[13px] leading-relaxed text-white/70"
            >
              {panel.caption}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  );
}
