'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type CapabilityNode, CATEGORY_DOT } from './capability-data';

interface Props {
  node: CapabilityNode;
  isPinned: boolean;
  fullWidth?: boolean;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function CapabilityHoverCard({
  node, isPinned, fullWidth = false, onClose, onMouseEnter, onMouseLeave,
}: Props) {
  const dotColor = CATEGORY_DOT[node.category];

  return (
    <div
      role="tooltip"
      className={cn(
        'overflow-hidden rounded-2xl border border-border/70 bg-surface',
        'shadow-[0_8px_36px_rgba(0,0,0,.10),0_2px_10px_rgba(0,0,0,.06)]',
        'dark:shadow-[0_8px_36px_rgba(0,0,0,.50),0_2px_10px_rgba(0,0,0,.25)]',
        fullWidth ? 'w-full' : 'w-[268px]',
      )}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3 border-b border-border-subtle bg-background-subtle px-4 py-3">
        {/* Category dot */}
        <span
          className="mt-1 h-2 w-2 shrink-0 rounded-full"
          style={{ background: dotColor }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold leading-tight text-foreground">
            {node.label}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {node.category}
          </p>
        </div>
        {isPinned && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-border-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="p-4 space-y-3">
        {/* Used In */}
        <div>
          <p className="mb-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Used In
          </p>
          <div className="flex flex-wrap gap-1.5">
            {node.usedIn.map((proj) => (
              <span
                key={proj}
                className="rounded-full border px-2.5 py-0.5 text-[10.5px] font-medium"
                style={{
                  borderColor: `${dotColor}40`,
                  background: `${dotColor}18`,
                  color: dotColor,
                }}
              >
                {proj}
              </span>
            ))}
          </div>
        </div>

        {/* Context */}
        <div>
          <p className="mb-1 text-[9.5px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Context
          </p>
          <p className="text-[12px] leading-relaxed text-foreground-secondary">
            {node.context}
          </p>
        </div>
      </div>
    </div>
  );
}
