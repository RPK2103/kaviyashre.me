'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { NAV_ITEMS, NAV_SECTION_IDS } from '@/lib/constants';
import { useActiveSection, sectionIdFromHref } from '@/lib/useActiveSection';

// ─── Shared nav link styles ───────────────────────────────────────────────────

function navLinkClass(isActive: boolean, variant: 'desktop' | 'mobile') {
  return cn(
    'text-sm font-medium transition-colors duration-200',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring',
    variant === 'desktop' && [
      'relative px-3.5 py-2 rounded-full',
      isActive
        ? 'text-primary'
        : 'text-foreground-secondary hover:text-foreground',
      isActive &&
        'after:absolute after:bottom-1 after:left-1/2 after:h-0.5 after:w-4 after:-translate-x-1/2 after:rounded-full after:bg-primary',
    ],
    variant === 'mobile' && [
      'block px-6 py-3',
      isActive
        ? 'border-l-2 border-primary bg-accent-muted/40 text-primary pl-[22px]'
        : 'text-foreground-secondary hover:bg-border-subtle hover:text-foreground',
    ],
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(NAV_SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

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
        <ul className="hidden items-center gap-0.5 md:flex">
          {NAV_ITEMS.map((item) => {
            const sectionId = sectionIdFromHref(item.href);
            const isActive = activeSection === sectionId;

            if (item.comingSoon) {
              return (
                <li key={item.href}>
                  <span
                    aria-label={`${item.label} — coming soon`}
                    title="Coming soon"
                    className="cursor-default select-none rounded-full px-3.5 py-2 text-sm font-medium text-foreground/30"
                  >
                    {item.label}
                  </span>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={navLinkClass(isActive, 'desktop')}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full md:hidden',
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
            'border-t border-border-subtle md:hidden',
            'bg-background/95 backdrop-blur-md',
          )}
        >
          <ul className="flex flex-col py-2">
            {NAV_ITEMS.map((item) => {
              const sectionId = sectionIdFromHref(item.href);
              const isActive = activeSection === sectionId;

              if (item.comingSoon) {
                return (
                  <li key={item.href}>
                    <span className="flex cursor-default select-none items-center justify-between px-6 py-3 text-sm font-medium text-muted-foreground/50">
                      {item.label}
                      <span className="text-[10px] uppercase tracking-wide text-muted-foreground/40">
                        Soon
                      </span>
                    </span>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={closeMobile}
                    className={navLinkClass(isActive, 'mobile')}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
