'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';
import {
  X,
  GraduationCap,
  Rocket,
  Landmark,
  Code2,
  Sparkles,
  Globe,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  journeyMilestones,
  journeyQuote,
  type JourneyIconId,
} from '@/data/about';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' as const } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' as const } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 10,
    transition: { duration: 0.22, ease: 'easeIn' as const },
  },
};

const ICON_MAP: Record<JourneyIconId, LucideIcon> = {
  graduation: GraduationCap,
  rocket: Rocket,
  bank: Landmark,
  code: Code2,
  sparkles: Sparkles,
  globe: Globe,
};

interface JourneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JourneyModal({ isOpen, onClose }: JourneyModalProps) {
  const reduced = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(
    journeyMilestones.findIndex((m) => m.isPresent) ?? 0,
  );

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [isOpen]);

  const handleModalKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return;
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  const scrollToIndex = (index: number) => {
    const clamped = Math.max(0, Math.min(index, journeyMilestones.length - 1));
    setActiveIndex(clamped);
    const container = scrollRef.current;
    if (!container) return;
    const item = container.querySelector<HTMLElement>(
      `[data-milestone-index="${clamped}"]`,
    );
    item?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[3px]"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleBackdropClick}
          />

          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 sm:px-6"
            onClick={handleBackdropClick}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="journey-modal-title"
              className={cn(
                'relative flex max-h-[90vh] w-[92vw] max-w-5xl flex-col overflow-hidden rounded-2xl lg:w-[80vw]',
                'border border-border bg-surface',
                'shadow-[0_24px_80px_-8px_rgba(30,27,24,0.18),0_4px_24px_rgba(30,27,24,0.08)]',
                'dark:shadow-[0_24px_80px_-8px_rgba(0,0,0,0.65),0_4px_32px_rgba(139,92,246,0.10)]',
              )}
              variants={reduced ? overlayVariants : modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleModalKeyDown}
            >
              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close journey modal"
                onClick={onClose}
                className={cn(
                  'absolute right-4 top-4 z-10 rounded-full p-2',
                  'text-muted-foreground transition-colors duration-200',
                  'hover:bg-background-subtle hover:text-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
              >
                <X size={18} aria-hidden />
              </button>

              <div className="shrink-0 px-6 pb-4 pt-8 sm:px-10 sm:pt-10">
                <p className="label-mono mb-2 text-[10px] font-semibold uppercase tracking-[0.20em] text-primary">
                  my_journey.timeline
                </p>
                <h2
                  id="journey-modal-title"
                  className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
                >
                  the story behind the system
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground-secondary sm:text-base">
                  Key chapters that shaped the engineer and human I am today.
                </p>
              </div>

              <div className="relative min-h-0 flex-1 overflow-hidden px-4 sm:px-6">
                <button
                  type="button"
                  aria-label="Previous milestone"
                  onClick={() => scrollToIndex(activeIndex - 1)}
                  disabled={activeIndex === 0}
                  className={cn(
                    'absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full p-2 lg:flex',
                    'border border-border-subtle bg-surface/90 text-muted-foreground backdrop-blur-sm',
                    'transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  )}
                >
                  <ChevronLeft size={18} aria-hidden />
                </button>

                <button
                  type="button"
                  aria-label="Next milestone"
                  onClick={() => scrollToIndex(activeIndex + 1)}
                  disabled={activeIndex === journeyMilestones.length - 1}
                  className={cn(
                    'absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full p-2 lg:flex',
                    'border border-border-subtle bg-surface/90 text-muted-foreground backdrop-blur-sm',
                    'transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  )}
                >
                  <ChevronRight size={18} aria-hidden />
                </button>

                <div
                  ref={scrollRef}
                  className={cn(
                    'flex gap-0 overflow-x-auto overflow-y-visible pb-6 pt-2 scrollbar-none',
                    'lg:px-8',
                    'max-lg:flex-col max-lg:gap-6 max-lg:overflow-x-visible max-lg:px-2',
                  )}
                  role="list"
                  aria-label="Career journey timeline"
                >
                  {journeyMilestones.map((milestone, index) => {
                    const Icon = ICON_MAP[milestone.icon];
                    const isActive = index === activeIndex;

                    return (
                      <div
                        key={milestone.id}
                        data-milestone-index={index}
                        role="listitem"
                        className={cn(
                          'relative flex shrink-0 flex-col items-center',
                          'w-[min(100%,220px)] lg:w-[200px]',
                          'max-lg:w-full max-lg:flex-row max-lg:items-start max-lg:gap-4',
                        )}
                      >
                        {index < journeyMilestones.length - 1 && (
                          <div
                            aria-hidden
                            className={cn(
                              'absolute bg-border-subtle',
                              'max-lg:left-[19px] max-lg:top-10 max-lg:h-[calc(100%+12px)] max-lg:w-px',
                              'lg:left-[calc(50%+28px)] lg:top-5 lg:h-px lg:w-[calc(100%-56px)]',
                            )}
                          />
                        )}

                        <div
                          className={cn(
                            'relative z-[1] flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
                            milestone.isPresent
                              ? 'border-accent/40 bg-accent/15 text-accent shadow-[0_0_20px_-4px] shadow-accent/40'
                              : 'border-border-subtle bg-background-subtle text-muted-foreground',
                            isActive && !milestone.isPresent && 'border-accent/30 text-accent',
                          )}
                        >
                          <Icon size={18} aria-hidden />
                        </div>

                        <div className="mt-3 max-lg:mt-0 max-lg:flex-1 max-lg:pt-1 lg:text-center">
                          <p className="label-mono mb-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                            {milestone.year}
                          </p>
                          <h3 className="mb-1.5 text-sm font-semibold leading-snug text-foreground">
                            {milestone.title}
                          </h3>
                          <p className="text-[12px] leading-relaxed text-foreground-secondary">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="shrink-0 border-t border-border-subtle px-6 py-5 sm:px-10">
                <blockquote className="relative rounded-xl border border-border-subtle bg-background-subtle px-5 py-4 sm:px-6">
                  <span
                    className="font-display text-4xl leading-none text-accent/40 select-none"
                    aria-hidden
                  >
                    &ldquo;
                  </span>
                  <p className="mt-1 text-sm leading-relaxed text-foreground-secondary sm:text-[0.95rem]">
                    {journeyQuote}
                  </p>
                </blockquote>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
