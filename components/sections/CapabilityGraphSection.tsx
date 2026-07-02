'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { cn } from '@/lib/utils';
import { fadeInUp, SECTION_VIEWPORT } from '@/lib/animations';
import { SECTION_PY } from '@/lib/constants';
import { CapabilityGraphView } from './capability-graph/CapabilityGraphView';
import { CertificationsView } from './capability-graph/CertificationsView';
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
        <div className="mb-8 flex justify-center">
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
              title={tab === 'graph' ? 'Skills' : 'Certifications'}
              headingId="skills-heading"
            />
          </motion.aside>

          {/* ── Graph canvas (~74%) ────────────────────────────────────── */}
          <motion.div
            className="relative min-w-0 flex-1 lg:w-[74%]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {tab === 'graph' ? (
                <motion.div
                  key="graph"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <CapabilityGraphView />
                </motion.div>
              ) : (
                <motion.div
                  key="certifications"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <CertificationsView />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </Container>
    </section>
  );
}
