'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';
import { fadeInUp, SECTION_VIEWPORT } from '@/lib/animations';
import { SECTION_PY } from '@/lib/constants';
import { CapabilityGraphView } from './capability-graph/CapabilityGraphView';
import { SegmentedToggle, type GraphTab } from './capability-graph/SegmentedToggle';
import { CATEGORY_DOT, type CapabilityCategory } from './capability-graph/capability-data';

// ─── Category legend items ────────────────────────────────────────────────────

const CATEGORIES: Array<{ id: CapabilityCategory; label: string }> = [
  { id: 'AI',         label: 'AI' },
  { id: 'Backend',    label: 'Backend' },
  { id: 'Cloud',      label: 'Cloud' },
  { id: 'DevOps',     label: 'DevOps' },
  { id: 'Frontend',   label: 'Frontend' },
  { id: 'Automation', label: 'Automation' },
];

// ─── Section ──────────────────────────────────────────────────────────────────

export function CapabilityGraphSection() {
  const [tab, setTab] = useState<GraphTab>('graph');

  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="relative overflow-hidden scroll-mt-20"
    >
      {/* Subtle radial tint matching the soft/dark theme accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 65% 50%, ' +
            'color-mix(in srgb, var(--color-accent) 5%, transparent) 0%, ' +
            'transparent 70%)',
        }}
      />

      <Container className={cn('relative', SECTION_PY)}>

        {/* ── Segmented toggle ─────────────────────────────────────────── */}
        <div className="mb-10 flex justify-center">
          <SegmentedToggle value={tab} onChange={setTab} />
        </div>

        {/* ── Main content row ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10">

          {/* ── Left column ────────────────────────────────────────────── */}
          <motion.aside
            className="shrink-0 lg:flex lg:w-60 lg:flex-col xl:w-64"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={SECTION_VIEWPORT}
          >
            <SectionHeader
              eyebrow="Engineering System"
              title={
                <>
                  Capability
                  <br />
                  Graph
                </>
              }
              subtitle="An AI-inspired map of the technologies and disciplines I use to build scalable systems and intelligent products."
              headingId="skills-heading"
            />
              {/* Helper hint */}
              <div className="mt-4 flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                  Hover or click any node to explore real project evidence and context.
                </p>
              </div>

            {/* Category legend — pushed to bottom of column on desktop */}
            <div className="mt-10 lg:mt-auto lg:pt-16">
              <p className="mb-3 text-[9.5px] font-bold uppercase tracking-[0.20em] text-muted-foreground">
                Categories
              </p>
              <ul className="flex flex-col gap-2" aria-label="Node categories">
                {CATEGORIES.map((cat) => (
                  <li key={cat.id} className="flex items-center gap-2.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: CATEGORY_DOT[cat.id] }}
                    />
                    <span className="text-[12px] text-muted-foreground">{cat.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>

          {/* ── Graph canvas ─────────────────────────────────────────────── */}
          <motion.div
            className="min-w-0 flex-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            {tab === 'graph' ? (
              <CapabilityGraphView />
            ) : (
              /* Certifications placeholder — not implemented yet */
              <div
                className={cn(
                  'flex h-[500px] w-full items-center justify-center rounded-2xl',
                  'border border-dashed border-border text-muted-foreground',
                )}
              >
                <p className="text-sm">Certifications coming soon</p>
              </div>
            )}
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
