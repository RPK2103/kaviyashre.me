'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SkillGraphCanvas } from '@/components/skills/SkillGraphCanvas';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/animations';

export function SkillsGraphSection() {
  return (
    <section id="skills" aria-label="Skills">
      <Container className="py-20 lg:py-28">

        {/* ── Section header ──────────────────────────────────────────── */}
        <motion.div
          className="mb-10 lg:mb-12"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            Skills
          </p>
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
            The Skill Graph
          </h2>
          <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-foreground-secondary">
            Each node connects to real evidence — projects shipped, technologies used, and the
            context that shaped it. Hover or click any node to explore.
          </p>
        </motion.div>

        {/* ── Graph canvas ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'rounded-xl border border-black/[0.07] dark:border-white/[0.06]',
            'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_14px_-2px_rgba(180,100,110,0.08),0_8px_28px_-4px_rgba(0,0,0,0.05)]',
            'dark:shadow-[0_1px_2px_rgba(0,0,0,0.22),0_4px_14px_-2px_rgba(88,42,148,0.16),0_10px_32px_-4px_rgba(0,0,0,0.35)]',
            'bg-background-subtle overflow-hidden p-4 sm:p-5 md:p-6',
          )}
        >
          <SkillGraphCanvas />
        </motion.div>

      </Container>
    </section>
  );
}
