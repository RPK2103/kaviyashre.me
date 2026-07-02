'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  type AboutTabId,
  PANEL_COMMANDS,
  introLines,
  currentTrackData,
} from '@/data/about';
import { TypewriterIntro } from '@/components/about/TypewriterIntro';
import { JourneyModal } from '@/components/about/JourneyModal';

interface Props {
  activeTab: AboutTabId;
}

export function AboutPanel({ activeTab }: Props) {
  return (
    <div
      id={`about-panel-${activeTab}`}
      role="tabpanel"
      aria-labelledby={`about-tab-${activeTab}`}
      className="relative min-h-[320px]"
    >
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 -mx-5 -my-5 sm:-mx-6 sm:-my-6 lg:-mx-7 lg:-my-7',
          'bg-[radial-gradient(circle,rgba(219,112,147,0.10)_1px,transparent_1px)]',
          'bg-[length:20px_20px]',
          'dark:bg-[radial-gradient(circle,rgba(139,92,246,0.14)_1px,transparent_1px)]',
        )}
      />

      <div className="relative">
        <div className="mb-4 flex items-center gap-2 font-mono text-[12px]" aria-hidden>
          <span className="select-none text-accent">$</span>
          <span className="text-foreground-secondary">{PANEL_COMMANDS[activeTab]}</span>
          <span className="animate-cursor-blink inline-block h-[13px] w-[6px] translate-y-px rounded-[1px] bg-accent/50" />
        </div>

        <div className="mb-5 h-px bg-border-subtle" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {activeTab === 'intro' && <IntroPanel />}
            {activeTab === 'current-track' && <CurrentTrackPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function IntroPanel() {
  const [journeyOpen, setJourneyOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <div className="mx-auto w-[150px] shrink-0 sm:mx-0 sm:w-[156px] lg:w-[172px]">
          <CasualPhoto />
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-3 font-mono text-[12px] text-accent">$ whoami</p>
          <TypewriterIntro lines={introLines} />

          <button
            type="button"
            onClick={() => setJourneyOpen(true)}
            className={cn(
              'mt-6 inline-flex items-center gap-1 rounded-md border border-accent/35 px-3.5 py-2',
              'font-mono text-[12px] text-accent transition-colors duration-200',
              'hover:border-accent/55 hover:bg-accent/8',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
            )}
          >
            read more about my journey →
          </button>
        </div>
      </div>

      <JourneyModal isOpen={journeyOpen} onClose={() => setJourneyOpen(false)} />
    </>
  );
}

function CasualPhoto() {
  const reduced = useReducedMotion();
  const [error, setError] = useState(false);

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-3 rounded-2xl bg-accent/12 blur-2xl dark:bg-accent/18"
      />

      <motion.div
        className="relative aspect-[3/4] w-full overflow-hidden rounded-lg shadow-[0_8px_24px_-6px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_28px_-6px_rgba(0,0,0,0.45)]"
        animate={reduced ? undefined : { y: [0, -6, 0] }}
        transition={
          reduced
            ? undefined
            : { duration: 6, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 border border-border-subtle bg-background-subtle px-3 text-center">
            <span className="font-mono text-[10px] text-muted-foreground/50 select-none">
              about-casual.jpg
            </span>
            <span className="font-mono text-[9px] text-muted-foreground/30 select-none">
              not found
            </span>
          </div>
        ) : (
          <Image
            src="/images/about-casual.jpg"
            alt="Kaviyashre — casual photo"
            fill
            sizes="(max-width: 640px) 150px, (max-width: 1024px) 156px, 172px"
            className="object-cover object-top"
            onError={() => setError(true)}
          />
        )}
      </motion.div>
    </div>
  );
}

function CurrentTrackPanel() {
  return (
    <div className="space-y-2.5">
      {currentTrackData.map(({ key, value }) => (
        <div
          key={key}
          className="rounded-md border border-border-subtle/80 bg-background-subtle/60 px-3.5 py-2.5"
        >
          <p className="font-mono text-[12px] leading-relaxed">
            <span className="text-accent">{key}</span>
            <span className="text-muted-foreground/60">: </span>
            <span className="text-foreground-secondary">{value}</span>
          </p>
        </div>
      ))}
    </div>
  );
}
