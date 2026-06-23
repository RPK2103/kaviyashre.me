'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { NAV_ITEMS } from '@/lib/constants';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header
      role="banner"
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border-subtle shadow-sm'
          : 'bg-transparent',
      )}
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-12"
      >
        {/* Logo */}
        <BrandLogo />

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-0.5">
          {NAV_ITEMS.map((item) =>
            item.comingSoon ? (
              <li key={item.href}>
                <span
                  aria-label={`${item.label} — coming soon`}
                  title="Coming soon"
                  className="px-3.5 py-2 rounded-full text-sm font-medium text-foreground/30 cursor-default select-none"
                >
                  {item.label}
                </span>
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'px-3.5 py-2 rounded-full text-sm font-medium',
                    'text-foreground-secondary hover:text-foreground',
                    'transition-colors duration-200',
                    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          {/* Mobile hamburger */}
          <button
            className={cn(
              'md:hidden flex h-9 w-9 items-center justify-center rounded-full',
              'text-foreground-secondary hover:text-foreground',
              'hover:bg-border-subtle transition-colors duration-200',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring',
            )}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" strokeWidth={1.8} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.8} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className={cn(
            'md:hidden border-t border-border-subtle',
            'bg-background/95 backdrop-blur-md',
          )}
        >
          <ul className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                {item.comingSoon ? (
                  <span
                    className="flex items-center justify-between px-6 py-3 text-sm font-medium text-muted-foreground/50 cursor-default select-none"
                  >
                    {item.label}
                    <span className="text-[10px] tracking-wide uppercase text-muted-foreground/40">
                      Soon
                    </span>
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block px-6 py-3 text-sm font-medium',
                      'text-foreground-secondary hover:text-foreground',
                      'hover:bg-border-subtle transition-colors duration-150',
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
