'use client';

import { useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { NoteRow } from '@/components/field-notes/NoteRow';
import { FieldNotesArchiveModal } from '@/components/field-notes/FieldNotesArchiveModal';
import { notesData } from '@/data/notes';
import { fadeInUp } from '@/lib/animations';
import { cn } from '@/lib/utils';

// ─── Preview config ───────────────────────────────────────────────────────────
//
// Only the first PREVIEW_COUNT visible notes appear in the main-page feed.
// Set SHOW_FIELD_NOTES_ARCHIVE_CTA to true to reveal the archive CTA + modal.
//
const SHOW_FIELD_NOTES_ARCHIVE_CTA = false;

const PREVIEW_COUNT = 2;

const previewNotes = notesData
  .filter((n) => n.status !== 'draft')
  .slice(0, PREVIEW_COUNT);

const totalVisible = notesData.filter((n) => n.status !== 'draft').length;

// ─── Stagger container ────────────────────────────────────────────────────────

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.05 },
  },
};

// ─── Archive CTA + modal (gated by SHOW_FIELD_NOTES_ARCHIVE_CTA) ──────────────

interface FieldNotesArchiveEntryProps {
  reduced: boolean;
}

function FieldNotesArchiveEntry({ reduced }: FieldNotesArchiveEntryProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <>
      <motion.div
        className="mt-10 flex justify-center lg:mt-12"
        variants={
          reduced
            ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
            : fadeInUp
        }
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        <button
          type="button"
          onClick={openModal}
          aria-label={`View all ${totalVisible} field notes`}
          className={cn(
            'group inline-flex items-center gap-2.5',
            'rounded-full border px-6 py-2.5',
            'label-mono text-[11px] font-semibold',
            'border-[var(--border)] text-[var(--muted-foreground)]',
            'bg-[var(--surface)]',
            'hover:border-[var(--primary)] hover:text-[var(--foreground)]',
            'transition-all duration-200',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2',
            'focus-visible:ring-offset-[var(--background-subtle)]',
          )}
        >
          <span
            className="h-[5px] w-[5px] shrink-0 rounded-full bg-current transition-colors duration-200"
            aria-hidden
          />
          More field notes
          <span
            className="opacity-45 transition-opacity duration-200 group-hover:opacity-70"
            aria-hidden
          >
            {totalVisible} total
          </span>
        </button>
      </motion.div>

      <FieldNotesArchiveModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function FieldNotesSection() {
  const reduced = useReducedMotion();

  return (
    <>
      <section
        id="field-notes"
        aria-labelledby="field-notes-heading"
        className="relative scroll-mt-20 overflow-x-hidden bg-[var(--background-subtle)]"
      >
        {/* Top rule */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-[var(--border-subtle)]"
          aria-hidden="true"
        />

        <Container className="pt-20 pb-24 lg:pt-28 lg:pb-32">

          {/* ── Section header ───────────────────────────────────────────── */}
          <motion.div
            className="mb-14 max-w-2xl lg:mb-16"
            variants={
              reduced
                ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                : fadeInUp
            }
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <p className="label-mono mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">
              Knowledge Layer
            </p>
            <h2
              id="field-notes-heading"
              className="font-display text-4xl font-semibold leading-none tracking-tight text-[var(--foreground)] sm:text-5xl"
            >
              Field notes.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--foreground-secondary)]">
              Short essays, build logs, and technical reflections on AI systems,
              backend platforms, cloud infrastructure, and product execution.
            </p>
          </motion.div>

          {/* ── Editorial notes feed (2 rows) ────────────────────────────── */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {previewNotes.map((note, i) => (
              <NoteRow
                key={note.id}
                note={note}
                animated
                showDivider={i < previewNotes.length - 1}
              />
            ))}
          </motion.div>

          {SHOW_FIELD_NOTES_ARCHIVE_CTA && (
            <FieldNotesArchiveEntry reduced={!!reduced} />
          )}

        </Container>
      </section>
    </>
  );
}
