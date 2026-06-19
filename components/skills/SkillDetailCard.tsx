'use client';

import { X } from 'lucide-react';
import { type SkillItem } from '@/data/skills';
import { cn } from '@/lib/utils';

interface Props {
  node: SkillItem;
  isPinned: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function SkillDetailCard({ node, isPinned, onClose, onMouseEnter, onMouseLeave }: Props) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-border bg-surface',
        'shadow-[0_8px_30px_rgba(0,0,0,0.10),0_2px_8px_rgba(0,0,0,0.06)]',
        'dark:shadow-[0_8px_30px_rgba(0,0,0,0.40),0_2px_8px_rgba(0,0,0,0.25)]',
        'w-[272px]',
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="tooltip"
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start gap-2.5 border-b border-border-subtle bg-background-subtle px-4 py-3">
        {node.emoji && (
          <span className="mt-0.5 shrink-0 text-base leading-none" aria-hidden>
            {node.emoji}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-tight text-foreground">
            {node.label}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {node.category}
          </p>
        </div>
        {isPinned && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close evidence card"
            className={cn(
              'ml-auto shrink-0 rounded-md p-1',
              'text-muted-foreground transition-colors hover:bg-border-subtle hover:text-foreground',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            )}
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div className="max-h-[320px] overflow-y-auto p-4 scrollbar-none">
        {/* Description */}
        <p className="mb-4 text-[12.5px] leading-[1.65] text-foreground-secondary">
          {node.description}
        </p>

        {/* Technologies */}
        {node.technologies.length > 0 && (
          <div className="mb-3.5">
            <p className="mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Technologies
            </p>
            <div className="flex flex-wrap gap-1">
              {node.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-border-subtle bg-background-subtle px-1.5 py-0.5 text-[10.5px] font-medium text-foreground-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {node.projects.length > 0 && (
          <div className="mb-3.5">
            <p className="mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Used In
            </p>
            <div className="flex flex-wrap gap-1">
              {node.projects.map((proj) => (
                <span
                  key={proj}
                  className="rounded-md border border-accent/20 bg-accent-muted px-1.5 py-0.5 text-[10.5px] font-medium text-accent"
                >
                  {proj}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Context */}
        <div className="rounded-lg bg-background-subtle px-3 py-2.5">
          <p className="text-[11px] italic leading-relaxed text-foreground-secondary/90">
            {node.usageContext}
          </p>
        </div>
      </div>
    </div>
  );
}
