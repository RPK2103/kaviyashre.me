'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ExternalLink, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectData } from '@/data/projects';

// ─── Animation variants ───────────────────────────────────────────────────────

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } },
};

const overlayVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 12,
    transition: { duration: 0.22, ease: 'easeIn' },
  },
};

const modalVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// ─── Case study section renderer ─────────────────────────────────────────────

interface SectionProps {
  label: string;
  content: string;
}

function CaseStudySection({ label, content }: SectionProps) {
  return (
    <div className="space-y-2">
      <h4 className="label-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
        {label}
      </h4>
      <p className="text-[0.9375rem] leading-relaxed text-[var(--foreground-secondary)]">
        {content}
      </p>
    </div>
  );
}

// ─── CTA button ──────────────────────────────────────────────────────────────

interface CtaButtonProps {
  href?: string;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}

function CtaButton({ href, icon, label, disabled }: CtaButtonProps) {
  const base = cn(
    'inline-flex items-center gap-2 rounded-full px-5 py-2.5',
    'text-sm font-medium transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
  );

  if (disabled || !href) {
    return (
      <span
        className={cn(
          base,
          'cursor-not-allowed opacity-50',
          'border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]',
        )}
        aria-label={`${label} — coming soon`}
        title="Coming soon"
      >
        {icon}
        {label}
        <span className="label-mono text-[9px] uppercase tracking-wider opacity-60">
          Soon
        </span>
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        base,
        'border border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]',
        'hover:opacity-90 active:opacity-95',
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {icon}
      {label}
    </a>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProjectCaseStudyModalProps {
  project: ProjectData | null;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function ProjectCaseStudyModal({
  project,
  onClose,
  triggerRef,
}: ProjectCaseStudyModalProps) {
  const reduced = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isOpen = project !== null;

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Move focus into modal on open; return to trigger on close
  useEffect(() => {
    if (isOpen) {
      // Defer to allow AnimatePresence to mount the element
      const id = setTimeout(() => closeButtonRef.current?.focus(), 50);
      return () => clearTimeout(id);
    } else {
      triggerRef?.current?.focus();
    }
  }, [isOpen, triggerRef]);

  // Trap focus within modal (Tab / Shift+Tab)
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
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    }
  }, []);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  return (
    <AnimatePresence>
      {isOpen && project && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[3px]"
            variants={reduced ? overlayVariantsReduced : overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleBackdropClick}
          />

          {/* ── Modal container (centered via flex) ── */}
          <div
            aria-hidden="false"
            className={cn(
              'fixed inset-0 z-50 flex items-center justify-center',
              'px-4 py-4 sm:px-6 sm:py-6',
            )}
            onClick={handleBackdropClick}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-project-title"
              className={cn(
                'relative flex flex-col',
                'w-[90vw] max-h-[90vh]',
                'overflow-hidden rounded-2xl',
                'bg-[var(--surface)] border border-[var(--border)]',
                /* light shadow */
                'shadow-[0_24px_80px_-8px_rgba(30,27,24,0.20),0_4px_24px_rgba(30,27,24,0.10)]',
                /* dark shadow */
                'dark:shadow-[0_24px_80px_-8px_rgba(0,0,0,0.70),0_4px_32px_rgba(139,92,246,0.12)]',
              )}
              variants={reduced ? modalVariantsReduced : modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleModalKeyDown}
            >
              {/* ── Sticky header ─────────────────────────────────────────── */}
              <div
                className={cn(
                  'flex flex-shrink-0 items-start justify-between gap-4',
                  'border-b border-[var(--border-subtle)]',
                  'px-7 py-5 sm:px-10 sm:py-6',
                  'bg-[var(--surface)]',
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5 mb-1">
                    <span
                      className={cn(
                        'label-mono rounded-full px-3 py-1',
                        'text-[10px] font-semibold uppercase tracking-[0.16em]',
                        'bg-[var(--accent-muted)] text-[var(--accent)]',
                        'border border-[var(--accent-soft)]/30',
                      )}
                    >
                      {project.badge}
                    </span>
                    <span className="label-mono text-[11px] text-[var(--muted-foreground)]">
                      {project.meta}
                    </span>
                  </div>
                  <h2
                    id="modal-project-title"
                    className="font-display text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl"
                  >
                    {project.title}
                  </h2>
                </div>

                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label="Close case study"
                  onClick={onClose}
                  className={cn(
                    'mt-1 flex-shrink-0 rounded-full p-2',
                    'text-[var(--muted-foreground)] transition-all duration-200',
                    'hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
                  )}
                >
                  <X size={18} aria-hidden />
                </button>
              </div>

              {/* ── Scrollable body ───────────────────────────────────────── */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* Cover image strip */}
                <div
                  className="relative w-full aspect-[21/9] sm:aspect-[3/1]"
                  aria-hidden
                >
                  <div
                    className="absolute inset-0"
                    style={{ background: project.placeholderGradient }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${project.imagePath})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)]/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="px-7 py-8 sm:px-10 sm:py-10">
                  {/* Summary */}
                  <p className="mb-8 text-base leading-relaxed text-[var(--foreground-secondary)] border-l-2 border-[var(--primary)] pl-4 italic">
                    {project.description}
                  </p>

                  {/* Tech stack */}
                  <div className="mb-10">
                    <h4 className="label-mono mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          role="listitem"
                          className={cn(
                            'label-mono rounded border px-3 py-1',
                            'text-[11px] font-medium',
                            'border-[var(--border)] bg-[var(--surface-raised)]',
                            'text-[var(--foreground-secondary)]',
                          )}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Case study sections */}
                  <div className="space-y-8">
                    <CaseStudySection
                      label="Overview"
                      content={project.caseStudy.overview}
                    />
                    <div
                      aria-hidden
                      className="h-px bg-[var(--border-subtle)]"
                    />
                    <CaseStudySection
                      label="Problem"
                      content={project.caseStudy.problem}
                    />
                    <CaseStudySection
                      label="What I Built"
                      content={project.caseStudy.whatIBuilt}
                    />
                    <CaseStudySection
                      label="My Role"
                      content={project.caseStudy.myRole}
                    />
                    <div
                      aria-hidden
                      className="h-px bg-[var(--border-subtle)]"
                    />
                    <CaseStudySection
                      label="Architecture / Technical Decisions"
                      content={project.caseStudy.architecture}
                    />
                    <CaseStudySection
                      label="Impact"
                      content={project.caseStudy.impact}
                    />
                    <div
                      aria-hidden
                      className="h-px bg-[var(--border-subtle)]"
                    />
                    <CaseStudySection
                      label="What I'd Improve Next"
                      content={project.caseStudy.improvements}
                    />
                  </div>

                  {/* CTAs */}
                  <div
                    className={cn(
                      'mt-10 flex flex-wrap items-center gap-3',
                      'border-t border-[var(--border-subtle)] pt-8',
                    )}
                  >
                    <CtaButton
                      href={project.liveDemoUrl}
                      icon={<ExternalLink size={14} aria-hidden />}
                      label="Live Demo"
                      disabled={!project.liveDemoUrl}
                    />
                    <CtaButton
                      href={project.githubUrl}
                      icon={<Code2 size={14} aria-hidden />}
                      label="GitHub"
                      disabled={!project.githubUrl}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
