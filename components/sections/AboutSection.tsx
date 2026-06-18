'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { AboutSidebar } from '@/components/about/AboutSidebar';
import { AboutPanel } from '@/components/about/AboutPanel';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/animations';
import { type AboutTabId } from '@/data/about';

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<AboutTabId>('whoami');

  return (
    <section id="about" aria-label="About Kaviyashre">
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
            About
          </p>
          <h2 className="text-2xl font-bold tracking-[-0.02em] text-foreground sm:text-3xl">
            The Operating System
          </h2>
        </motion.div>

        {/* ── Floating Mac-style window ────────────────────────────────── */}
        <motion.div
          /* Subtle window entrance: fade up + imperceptible scale */
          initial={{ opacity: 0, y: 12, scale: 0.994 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'overflow-hidden rounded-xl',
            /* Window border */
            'border border-black/[0.07] dark:border-white/[0.06]',
            /* Soft layered shadow — light: blush-neutral, dark: navy-purple */
            'shadow-[0_1px_2px_rgba(0,0,0,0.04),0_3px_10px_-2px_rgba(180,100,110,0.08),0_6px_20px_-4px_rgba(0,0,0,0.05)]',
            'dark:shadow-[0_1px_2px_rgba(0,0,0,0.22),0_3px_12px_-2px_rgba(88,42,148,0.16),0_8px_28px_-4px_rgba(0,0,0,0.32)]',
          )}
        >

          {/* ── Title bar ─────────────────────────────────────────────── */}
          <div
            className={cn(
              'relative flex h-9 shrink-0 items-center px-4',
              'bg-background-subtle',
              'border-b border-black/[0.06] dark:border-white/[0.05]',
            )}
          >
            {/* Traffic-light dots */}
            <div className="flex items-center gap-1.5" aria-hidden>
              <span className="h-3 w-3 rounded-full bg-[#ff5f57] opacity-90" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e] opacity-90" />
              <span className="h-3 w-3 rounded-full bg-[#28c840] opacity-90" />
            </div>

            {/* Centred title */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <span className="font-mono text-[11px] text-muted-foreground/55 select-none">
                ~/kavi/personal-os
              </span>
            </div>
          </div>

          {/* ── Window body ───────────────────────────────────────────── */}
          <div className="flex flex-col lg:flex-row">

            {/* Sidebar column */}
            <div
              className={cn(
                'shrink-0 bg-background-subtle',
                'border-b border-black/[0.05] dark:border-white/[0.04]',
                'lg:w-32 xl:w-36 lg:border-b-0 lg:border-r',
              )}
            >
              <div className="p-3 lg:px-3 lg:py-4">
                <AboutSidebar activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
            </div>

            {/* Panel column */}
            <div className="min-w-0 flex-1 bg-surface">
              <div className="p-5 sm:p-6 lg:p-7">
                <AboutPanel activeTab={activeTab} />
              </div>
            </div>

          </div>
        </motion.div>

      </Container>
    </section>
  );
}
