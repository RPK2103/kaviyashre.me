'use client';

import { motion } from 'framer-motion';
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
        className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none lg:flex-col lg:gap-1 lg:overflow-x-visible lg:pb-0"
      >
        {aboutTabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <li key={tab.id} role="presentation" className="relative">
              <button
                type="button"
                id={`about-tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`about-panel-${tab.id}`}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'relative z-[1] flex w-full items-center font-mono text-left transition-colors duration-200',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                  'whitespace-nowrap rounded-md px-3 py-2 text-[12px] lg:text-[13px] lg:whitespace-normal',
                  isActive
                    ? 'text-accent font-medium'
                    : 'text-muted-foreground hover:text-foreground-secondary',
                )}
              >
                <span className="mr-1.5 select-none text-muted-foreground/50">&gt;&gt;</span>
                {tab.label}
              </button>

              {isActive && (
                <motion.div
                  layoutId="about-sidebar-active"
                  className="absolute inset-0 rounded-md bg-accent/15 dark:bg-accent/12"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
