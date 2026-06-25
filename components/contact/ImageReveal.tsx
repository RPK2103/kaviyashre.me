'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const PRIMARY_SRC = '/images/contact/contact-primary.png';
const REVEAL_SRC = '/images/contact/contact-reveal.png';

const DESKTOP_LENS = 120;
const MOBILE_LENS = 92;

/** Soft feathered radial mask — opaque core fading to transparent with no hard edge. */
function revealMask(lensSize: number, x: string, y: string): string {
  return `radial-gradient(circle ${lensSize}px at ${x} ${y}, black 0%, black 26%, rgba(0,0,0,0.82) 40%, rgba(0,0,0,0.48) 54%, rgba(0,0,0,0.18) 66%, rgba(0,0,0,0.04) 76%, transparent 84%)`;
}

interface ImageRevealProps {
  alt: string;
  className?: string;
}

function ImagePlaceholder({ label }: { label: string }) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center',
        'bg-gradient-to-br from-accent-muted/70 via-surface to-secondary-muted/50',
        'dark:from-primary-muted/40 dark:via-surface dark:to-secondary-muted/30',
      )}
      aria-hidden
    >
      <span className="label-mono px-4 text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function ImageReveal({ alt, className }: ImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lensActive, setLensActive] = useState(false);
  const [lensSize, setLensSize] = useState(DESKTOP_LENS);
  const [primaryError, setPrimaryError] = useState(false);
  const [revealError, setRevealError] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const update = () => setLensSize(mq.matches ? MOBILE_LENS : DESKTOP_LENS);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (reduced) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      containerRef.current?.style.setProperty('--x', `${x}px`);
      containerRef.current?.style.setProperty('--y', `${y}px`);
      setLensActive(true);
    },
    [reduced],
  );

  const handlePointerLeave = useCallback(() => {
    setLensActive(false);
  }, []);

  const showReveal = !reduced && lensActive && !revealError;

  return (
    <div
      className={cn(
        'group relative mx-auto w-full max-w-[420px]',
        'transition-transform duration-500 ease-out',
        reduced ? '' : 'hover:-translate-y-0.5',
        className,
      )}
    >
      <div
        className={cn(
          'rounded-[20px] p-3 sm:p-3.5',
          'bg-white shadow-[0_8px_32px_-8px_rgba(30,27,24,0.12)]',
          'dark:bg-surface-variant dark:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.55)]',
          'rotate-[1.5deg] transition-transform duration-500 ease-out',
          !reduced && 'group-hover:rotate-[1deg]',
        )}
      >
        <div
          ref={containerRef}
          className="relative aspect-[4/5] w-full cursor-default overflow-hidden rounded-[14px] bg-surface-variant"
          style={{ '--lens-size': `${lensSize}px` } as React.CSSProperties}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          {primaryError ? (
            <ImagePlaceholder label="Add contact-primary.png" />
          ) : (
            <Image
              src={PRIMARY_SRC}
              alt={alt}
              fill
              sizes="(max-width: 1024px) 85vw, 420px"
              className="object-cover"
              onError={() => setPrimaryError(true)}
              priority={false}
            />
          )}

          {!reduced && !revealError && (
            <div
              className={cn(
                'pointer-events-none absolute inset-0',
                'transition-opacity duration-300 ease-out',
                showReveal ? 'opacity-100' : 'opacity-0',
              )}
              style={{
                WebkitMaskImage: revealMask(
                  lensSize,
                  'var(--x, 50%)',
                  'var(--y, 50%)',
                ),
                maskImage: revealMask(
                  lensSize,
                  'var(--x, 50%)',
                  'var(--y, 50%)',
                ),
              }}
            >
              <Image
                src={REVEAL_SRC}
                alt=""
                fill
                sizes="(max-width: 1024px) 85vw, 420px"
                className="object-cover"
                onError={() => setRevealError(true)}
                aria-hidden
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
