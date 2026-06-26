'use client';

import { cn } from '@/lib/utils';
import { certifications } from './certifications-data';
import { CertificationBadge } from './CertificationBadge';

export function CertificationsView() {
  return (
    <div
      role="region"
      aria-label="Certification achievements gallery"
      className={cn(
        'relative w-full overflow-hidden rounded-2xl',
        'border border-border/50 bg-surface',
        'shadow-md dark:border-white/[0.06] dark:bg-surface/90',
        'min-h-[480px]',
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 72% 48% at 50% 38%, ' +
            'color-mix(in srgb, var(--color-accent) 5%, transparent) 0%, ' +
            'transparent 72%)',
        }}
      />

      <div className="relative px-4 py-8 sm:px-10 sm:py-10">
        <ul
          className={cn(
            'hidden list-none sm:grid',
            'sm:grid-cols-2 sm:gap-x-10 sm:gap-y-12',
            'lg:max-w-2xl lg:mx-auto',
            'place-items-center',
          )}
        >
          {certifications.map((cert, i) => (
            <li key={cert.id} className="list-none">
              <CertificationBadge certification={cert} index={i} />
            </li>
          ))}
        </ul>

        <ul
          className={cn(
            'flex list-none gap-8 overflow-x-auto pb-4 sm:hidden',
            'snap-x snap-mandatory scrollbar-none',
            'px-3',
          )}
        >
          {certifications.map((cert, i) => (
            <li key={cert.id} className="w-36 shrink-0 snap-center list-none">
              <CertificationBadge certification={cert} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
