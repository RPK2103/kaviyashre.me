'use client';

import { cn } from '@/lib/utils';

export type GraphTab = 'graph' | 'certifications';

interface SegmentedToggleProps {
  value: GraphTab;
  onChange: (value: GraphTab) => void;
}

const TABS: Array<{ id: GraphTab; label: string; disabled?: boolean }> = [
  { id: 'graph',          label: 'Skills' },
  { id: 'certifications', label: 'Certifications', disabled: true },
];

export function SegmentedToggle({ value, onChange }: SegmentedToggleProps) {
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
      {TABS.map((tab) => {
        const isActive = value === tab.id;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-pressed={isActive}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
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
