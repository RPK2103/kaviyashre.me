'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
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
        'text-foreground-secondary transition-all duration-200',
        'hover:bg-border-subtle hover:text-foreground',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        className,
      )}
    >
      {isDark ? (
        <Sun className="h-[18px] w-[18px]" strokeWidth={1.8} />
      ) : (
        <Moon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      )}
    </button>
  );
}
