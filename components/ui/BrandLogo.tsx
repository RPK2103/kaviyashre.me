'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BrandLogoProps {
  className?: string;
}

/**
 * BrandLogo — premium theme-aware brand mark for the navbar.
 *
 * Theme swap uses the CSS `.dark` class (applied by next-themes) so there is
 * zero hydration flash — no JS useTheme read needed.
 *
 * Soft/light theme → brand-logo-dark.png   (charcoal mark, minimal hover glow)
 * Dark/space theme → brand-logo-light.png  (white mark + brightness boost so it
 *                                           reads clearly against deep-navy bg)
 *
 * Logo only — no adjacent text label.
 */
export function BrandLogo({ className }: BrandLogoProps) {
  // Inner image sizes: 36px → 42px → 48px
  const imgBase = cn(
    'h-9 w-9 sm:h-[42px] sm:w-[42px] lg:h-12 lg:w-12',
    'object-contain select-none',
    'transition-all duration-[250ms] ease-out',
    'group-hover:scale-[1.04]',
  );

  return (
    <Link
      href="/#home"
      aria-label="Go to homepage"
      className={cn(
        'group inline-flex flex-shrink-0 items-center justify-center',
        // Wrapper: 48px mobile → 56px tablet → 64px desktop
        'h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16',
        'rounded-sm',
        // Focus ring: uses --ring token (mauve in soft, violet in dark)
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4',
        'focus-visible:outline-[var(--ring)]',
        className,
      )}
    >
      {/* ── Charcoal mark — soft/light theme only ───────────────────────── */}
      <Image
        src="/logo/brand-logo-dark.png"
        alt="Kaviyashre brand logo"
        width={136}
        height={104}
        priority
        style={{ width: 'auto' }}
        className={cn(
          imgBase,
          'block dark:hidden',
          // Soft theme: no base filter — keep it clean and understated
          // Hover: whisper of mauve glow
          'group-hover:[filter:drop-shadow(0_0_8px_rgba(121,84,101,0.28))]',
        )}
      />

      {/* ── Light mark — dark/space theme only ──────────────────────────── */}
      <Image
        src="/logo/brand-logo-light.png"
        alt="Kaviyashre brand logo"
        width={136}
        height={104}
        priority
        style={{ width: 'auto' }}
        className={cn(
          imgBase,
          'hidden dark:block',
          // Base: brighten the mark so it reads clearly on deep-navy —
          // imagetraced PNGs need a boost to appear confident in dark mode.
          'dark:[filter:brightness(1.8)_contrast(1.15)_drop-shadow(0_0_10px_rgba(139,92,246,0.35))]',
          // Hover: intensify the violet glow slightly
          'dark:group-hover:[filter:brightness(2)_contrast(1.2)_drop-shadow(0_0_14px_rgba(139,92,246,0.55))]',
        )}
      />

    </Link>
  );
}
