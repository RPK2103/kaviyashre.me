'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoteRow } from '@/components/field-notes/NoteRow';
import { notesData, type NoteData, type NoteCategory } from '@/data/notes';

// ─── Animation variants — mirrors ProjectCaseStudyModal patterns ──────────────

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
  hidden: { opacity: 0, scale: 0.97, y: 18 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 10,
    transition: { duration: 0.22, ease: 'easeIn' },
  },
};

const modalVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// ─── Category filter — short visible labels, mapped to note categories ─────────

type FilterKey = 'All' | 'AI' | 'Backend' | 'Cloud' | 'Tech' | 'Product';

const FILTER_OPTIONS: { key: FilterKey; label: string }[] = [
  { key: 'All', label: 'All' },
  { key: 'AI', label: 'AI' },
  { key: 'Backend', label: 'Backend' },
  { key: 'Cloud', label: 'Cloud' },
  { key: 'Tech', label: 'Tech' },
  { key: 'Product', label: 'Product' },
];

const TECH_CATEGORIES: NoteCategory[] = ['Platform Engineering', 'Build Log'];

function matchesFilter(note: NoteData, filter: FilterKey): boolean {
  switch (filter) {
    case 'All':
      return true;
    case 'AI':
      return note.category === 'AI Systems';
    case 'Backend':
      return note.category === 'Backend Engineering';
    case 'Cloud':
      return note.category === 'Cloud Engineering';
    case 'Tech':
      return TECH_CATEGORIES.includes(note.category);
    case 'Product':
      return note.category === 'Product Thinking';
    default:
      return true;
  }
}

function filterLabel(filter: FilterKey): string {
  return FILTER_OPTIONS.find((o) => o.key === filter)?.label ?? filter;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const allVisibleNotes = notesData.filter((n) => n.status !== 'draft');

// ─── Props ────────────────────────────────────────────────────────────────────

interface FieldNotesArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function FieldNotesArchiveModal({
  isOpen,
  onClose,
}: FieldNotesArchiveModalProps) {
  const reduced = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('All');

  const filteredNotes = allVisibleNotes.filter((n) => matchesFilter(n, activeFilter));

  useEffect(() => {
    if (!isOpen) setActiveFilter('All');
  }, [isOpen]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px]"
            variants={reduced ? overlayVariantsReduced : overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleBackdropClick}
          />

          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-5 sm:px-6 sm:py-6"
            onClick={handleBackdropClick}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="fn-archive-title"
              className={cn(
                'relative flex min-h-0 w-[88vw] max-w-[52rem] flex-col',
                'max-h-[88vh] overflow-hidden rounded-2xl',
                'bg-[var(--surface)] border border-[var(--border)]',
                'shadow-[0_24px_80px_-8px_rgba(30,27,24,0.18),0_4px_24px_rgba(30,27,24,0.08)]',
                'dark:shadow-[0_24px_80px_-8px_rgba(0,0,0,0.65),0_4px_32px_rgba(139,92,246,0.10)]',
              )}
              variants={reduced ? modalVariantsReduced : modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={handleModalKeyDown}
            >
              {/* ── Header ─────────────────────────────────────────────────── */}
              <div
                className={cn(
                  'flex shrink-0 items-start justify-between gap-3',
                  'border-b border-[var(--border-subtle)]',
                  'px-6 py-5 sm:px-8 sm:py-6',
                  'bg-[var(--surface)]',
                )}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <p className="label-mono mb-1.5 text-[10px] font-semibold uppercase tracking-[0.20em] text-[var(--primary)]">
                    Knowledge Layer
                  </p>
                  <h2
                    id="fn-archive-title"
                    className="font-display text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl"
                  >
                    More of my words
                  </h2>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label="Close field notes"
                  onClick={onClose}
                  className={cn(
                    'mt-0.5 shrink-0 rounded-full p-2',
                    'text-[var(--muted-foreground)] transition-all duration-200',
                    'hover:bg-[var(--surface-raised)] hover:text-[var(--foreground)]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
                  )}
                >
                  <X size={18} aria-hidden />
                </button>
              </div>

              {/* ── Filter pills — wrap inside modal bounds ────────────────── */}
              <div
                className={cn(
                  'flex shrink-0 flex-wrap gap-2',
                  'border-b border-[var(--border-subtle)]',
                  'px-6 py-3.5 sm:px-8',
                  'bg-[var(--surface)]',
                )}
                role="group"
                aria-label="Filter notes by category"
              >
                {FILTER_OPTIONS.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveFilter(key)}
                    aria-pressed={activeFilter === key}
                    className={cn(
                      'label-mono rounded-full px-3 py-1.5',
                      'text-[10px] font-semibold uppercase tracking-[0.12em]',
                      'border transition-all duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
                      activeFilter === key
                        ? 'border-[var(--accent-soft)]/40 bg-[var(--accent-muted)] text-[var(--accent)]'
                        : [
                            'border-[var(--border)] bg-transparent',
                            'text-[var(--muted-foreground)]',
                            'hover:border-[var(--border)] hover:text-[var(--foreground-secondary)]',
                          ],
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* ── Scrollable notes feed ──────────────────────────────────── */}
              <div
                className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
                role="region"
                aria-label="Notes list"
                aria-live="polite"
              >
                {filteredNotes.length > 0 ? (
                  <ul
                    className="px-6 sm:px-8"
                    aria-label={
                      activeFilter === 'All'
                        ? 'All field notes'
                        : `Field notes in ${filterLabel(activeFilter)}`
                    }
                  >
                    {filteredNotes.map((note, i) => (
                      <li key={note.id}>
                        <NoteRow
                          note={note}
                          animated={false}
                          showDivider={i < filteredNotes.length - 1}
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center px-6 py-16 text-center sm:px-8">
                    <p className="label-mono mb-2 text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)] opacity-40">
                      Nothing here yet
                    </p>
                    <p className="text-sm text-[var(--foreground-secondary)]">
                      Notes in this category are coming soon.
                    </p>
                  </div>
                )}
              </div>

              {/* ── Footer ─────────────────────────────────────────────────── */}
              <div
                className={cn(
                  'shrink-0 border-t border-[var(--border-subtle)]',
                  'px-6 py-3.5 sm:px-8',
                  'bg-[var(--surface)]',
                )}
              >
                <p className="label-mono text-[10px] text-[var(--muted-foreground)] opacity-45">
                  {allVisibleNotes.length} note
                  {allVisibleNotes.length !== 1 ? 's' : ''} in the archive —
                  more being written.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
