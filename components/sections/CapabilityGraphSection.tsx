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
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">

          {/* ── Left column (~26%) ─────────────────────────────────────── */}
          <motion.aside
            className="shrink-0 lg:w-[26%] lg:max-w-[17rem]"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={SECTION_VIEWPORT}
          >
            <SectionHeader
              eyebrow="Engineering System"
              title="Skills"
              headingId="skills-heading"
            />
            <div className="mt-3 flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <p className="max-w-[13rem] text-[12.5px] leading-relaxed text-muted-foreground">
                Hover or click any node to explore real project evidence and context.
              </p>
            </div>
          </motion.aside>

          {/* ── Graph canvas (~74%) ────────────────────────────────────── */}
          <motion.div
            className="min-w-0 flex-1 lg:w-[74%]"
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
                  'flex h-[480px] w-full items-center justify-center rounded-2xl',
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
