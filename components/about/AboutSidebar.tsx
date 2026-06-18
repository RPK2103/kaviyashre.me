'use client';

import { cn } from '@/lib/utils';
import { aboutTabs, type AboutTabId } from '@/data/about';

interface Props {
  activeTab: AboutTabId;
  onTabChange: (id: AboutTabId) => void;
}

export function AboutSidebar({ activeTab, onTabChange }: Props) {
  return (
    <nav aria-label="About navigation">
      <ul
        role="tablist"
        aria-label="About sections"
        /* Mobile: horizontal scrollable pills / Desktop: vertical nav list */
        className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none lg:flex-col lg:gap-0.5 lg:overflow-x-visible lg:pb-0"
      >
        {aboutTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <li key={tab.id} role="presentation">
              <button
                type="button"
                id={`about-tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`about-panel-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex items-center font-mono text-left transition-all duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',

                  /* Mobile: compact pill */
                  'whitespace-nowrap rounded-md px-3 py-1.5 text-[12px]',

                  /* Desktop: full-width row */
                  'lg:w-full lg:rounded-md lg:px-3 lg:py-2 lg:text-[13px] lg:whitespace-normal',

                  isActive
                    ? 'bg-accent/15 text-accent font-medium dark:bg-accent/12'
                    : 'text-muted-foreground hover:bg-black/[0.05] hover:text-foreground-secondary dark:hover:bg-white/[0.05]',
                )}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
