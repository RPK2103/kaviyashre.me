'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  type AboutTabId,
  PANEL_COMMANDS,
  whoamiData,
  nowData,
} from '@/data/about';

interface Props {
  activeTab: AboutTabId;
}

export function AboutPanel({ activeTab }: Props) {
  return (
    <div
      id={`about-panel-${activeTab}`}
      role="tabpanel"
      aria-labelledby={`about-tab-${activeTab}`}
      className="min-h-[320px]"
    >
      {/* Terminal prompt header */}
      <div className="mb-4 flex items-center gap-2 font-mono text-[12px]" aria-hidden>
        <span className="select-none text-accent">$</span>
        <span className="text-foreground-secondary">{PANEL_COMMANDS[activeTab]}</span>
        {/* Blinking block cursor */}
        <span className="animate-cursor-blink inline-block h-[13px] w-[6px] translate-y-px rounded-[1px] bg-accent/50" />
      </div>

      {/* Rule */}
      <div className="mb-5 h-px bg-border-subtle" />

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {activeTab === 'whoami' && <WhoamiPanel />}
          {activeTab === 'now'    && <NowPanel />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── whoami ───────────────────────────────────────────────────────────────────

function WhoamiPanel() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
      {/* Casual photo */}
      <div className="mx-auto w-[150px] shrink-0 sm:mx-0 sm:w-[156px] lg:w-[164px]">
        <CasualPhoto />
      </div>

      {/* Terminal blocks */}
      <div className="flex-1 space-y-5">
        <TerminalBlock label="origin"        text={whoamiData.origin} />
        <TerminalBlock label="current_state" text={whoamiData.currentState} />
        <TerminalBlock label="curiosity"     text={whoamiData.curiosity} />
      </div>
    </div>
  );
}

function CasualPhoto() {
  const [error, setError] = useState(false);

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-border-subtle bg-background-subtle">
      {error ? (
        /* Graceful placeholder */
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3 text-center">
          <span className="font-mono text-[10px] text-muted-foreground/50 select-none">
            casual_photo.jpg
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
          sizes="(max-width: 640px) 150px, (max-width: 1024px) 156px, 164px"
          className="object-cover object-top"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}

interface TerminalBlockProps {
  label: string;
  text: string;
}

function TerminalBlock({ label, text }: TerminalBlockProps) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[11px]">
        <span className="mr-1 select-none text-muted-foreground/45">&gt;</span>
        <span className="text-accent">{label}</span>
      </p>
      <p className="text-[0.9rem] leading-[1.75] text-foreground-secondary">{text}</p>
    </div>
  );
}

// ─── now ──────────────────────────────────────────────────────────────────────

function NowPanel() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {nowData.map(({ key, values, note }) => (
        <NowCardItem key={key} termKey={key} values={values} note={note} />
      ))}
    </div>
  );
}

interface NowCardItemProps {
  termKey: string;
  values: readonly string[];
  note: string;
}

function NowCardItem({ termKey, values, note }: NowCardItemProps) {
  return (
    <div className="flex flex-col rounded-lg border border-border-subtle bg-background-subtle p-4">
      {/* Terminal key */}
      <p className="mb-2 font-mono text-[11px] text-accent">{termKey}</p>

      <div className="mb-2 h-px bg-border-subtle" />

      {/* Values */}
      <ul className="mb-2 flex-1 space-y-0.5">
        {values.map((v) => (
          <li key={v} className="font-mono text-[12px] leading-snug text-foreground">
            {v}
          </li>
        ))}
      </ul>

      <div className="mb-2 h-px bg-border-subtle" />

      {/* Note */}
      <p className="text-[11px] leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );
}
