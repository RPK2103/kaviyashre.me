'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

/* Hydration guard — returns true only on the client, false during SSR */
const subscribe = () => () => {};
const mounted = useSyncExternalStore.bind(null, subscribe, () => true, () => false);

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isMounted = mounted();

  if (!isMounted) {
    return (
      <div
        className={cn(
          'h-9 w-9 rounded-full bg-border-subtle animate-pulse',
          className,
        )}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full',
        'text-foreground-secondary transition-colors duration-200',
        'hover:bg-border-subtle hover:text-foreground',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
    >
      <span className="relative flex h-[18px] w-[18px] items-center justify-center">
        <Sun
          className={cn(
            'absolute h-[18px] w-[18px] transition-all duration-300 ease-out',
            isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-75 opacity-0',
          )}
          strokeWidth={1.8}
        />
        <Moon
          className={cn(
            'absolute h-[18px] w-[18px] transition-all duration-300 ease-out',
            isDark ? '-rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100',
          )}
          strokeWidth={1.8}
        />
      </span>
    </button>
  );
}
