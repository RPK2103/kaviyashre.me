'use client';

import { useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';

export type GraphTab = 'graph' | 'certifications';

interface SegmentedToggleProps {
  value: GraphTab;
  onChange: (value: GraphTab) => void;
}

const TABS: Array<{ id: GraphTab; label: string; disabled?: boolean }> = [
  { id: 'graph',          label: 'Skills' },
  { id: 'certifications', label: 'Certifications' },
];

export function SegmentedToggle({ value, onChange }: SegmentedToggleProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusTab = useCallback((index: number) => {
    tabRefs.current[index]?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      let nextIndex: number | null = null;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        nextIndex = (index + 1) % TABS.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        nextIndex = (index - 1 + TABS.length) % TABS.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = TABS.length - 1;
      }

      if (nextIndex !== null) {
        const next = TABS[nextIndex];
        if (!next.disabled) {
          onChange(next.id);
          focusTab(nextIndex);
        }
      }
    },
    [onChange, focusTab],
  );

  return (
    <div
      role="tablist"
      aria-label="Section view"
      className={cn(
        'inline-flex items-center gap-1 rounded-full p-1',
        'border border-border bg-background-subtle',
        'shadow-sm',
      )}
    >
      {TABS.map((tab, index) => {
        const isActive = value === tab.id;
        return (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[index] = el; }}
            role="tab"
            type="button"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'relative rounded-full px-5 py-1.5',
              'text-[13px] font-medium transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              isActive
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
              tab.disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
