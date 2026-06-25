'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProjectData } from '@/data/projects';

// ─── Entrance animation variants ─────────────────────────────────────────────

const cardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

const cardVariantsReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProjectShowcaseCardProps {
  project: ProjectData;
  index: number;
  onOpenModal: (project: ProjectData) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectShowcaseCard({
  project,
  index,
  onOpenModal,
}: ProjectShowcaseCardProps) {
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  // ── Shared video play helper ────────────────────────────────────────────────

  const playVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video || !project.videoPath) return;
    // Set muted programmatically — the HTML attribute alone is not
    // sufficient for some browsers' autoplay policies.
    video.muted = true;
    video.currentTime = 0;
    video.play().catch(() => {
      /* Autoplay blocked — cover image stays visible, no broken state */
    });
  }, [project.videoPath]);

  const pauseVideo = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }, []);

  // ── Pointer handlers ────────────────────────────────────────────────────────

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    playVideo();
  }, [playVideo]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    pauseVideo();
  }, [pauseVideo]);

  // ── Keyboard handlers (mirror hover behaviour) ──────────────────────────────

  const handleFocus = useCallback(() => {
    setIsHovered(true);
    playVideo();
  }, [playVideo]);

  const handleBlur = useCallback(() => {
    setIsHovered(false);
    pauseVideo();
  }, [pauseVideo]);

  // ── Modal open ──────────────────────────────────────────────────────────────

  const handleOpen = useCallback(() => onOpenModal(project), [onOpenModal, project]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    },
    [handleOpen],
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <motion.div
      variants={reduced ? cardVariantsReduced : cardVariants}
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} case study`}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      /* Subtle lift on hover */
      animate={
        reduced
          ? {}
          : { y: isHovered ? -4 : 0 }
      }
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'group relative flex flex-col lg:flex-row',
        'w-full overflow-hidden rounded-2xl',
        'cursor-pointer select-none',
        'bg-[var(--surface)] border',
        isHovered ? 'border-[var(--primary)]' : 'border-[var(--border)]',
        /* shadow — light theme */
        'shadow-[0_2px_16px_-2px_rgba(121,84,101,0.10),0_1px_4px_rgba(30,27,24,0.04)]',
        isHovered &&
          'shadow-[0_8px_40px_-4px_rgba(121,84,101,0.18),0_2px_12px_rgba(30,27,24,0.08)]',
        /* shadow — dark theme */
        'dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5),0_1px_6px_rgba(0,0,0,0.3)]',
        isHovered &&
          'dark:shadow-[0_8px_48px_-4px_rgba(139,92,246,0.22),0_2px_16px_rgba(0,0,0,0.5)]',
        'transition-[border-color,box-shadow] duration-300 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
      )}
    >
      {/* ── Media panel ───────────────────────────────────────────────────── */}
      {/*
       * Sizing strategy: cover + center-top
       *   `cover` fills the panel with no empty margins so the image feels
       *   confident and editorial. `center top` anchors the crop to the top of
       *   the screenshot where the most important UI chrome lives (headers,
       *   nav bars, key metrics), letting the less critical lower portion crop
       *   off naturally. This balances coverage vs. content visibility far
       *   better than pure `contain` (too much empty space) or `center`
       *   (crops the top navigation of many dashboards).
       *
       *   Video uses the same sizing rules so the image→video transition is
       *   seamless with no layout shift.
       */}
      <div
        className={cn(
          'relative w-full overflow-hidden',
          'aspect-video',
          'lg:aspect-auto lg:w-[40%] lg:flex-shrink-0',
        )}
      >
        {/* Placeholder gradient — always underneath, visible if image fails */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: project.placeholderGradient }}
        />

        {/* Cover image — cover + top anchor */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${project.imagePath})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Video overlay — only rendered when videoPath exists */}
        {project.videoPath && (
          <video
            ref={videoRef}
            aria-hidden
            className={cn(
              'absolute inset-0 h-full w-full',
              'object-cover [object-position:center_top]',
              'transition-opacity duration-500',
              videoReady && isHovered ? 'opacity-100' : 'opacity-0',
            )}
            muted
            loop
            playsInline
            preload="metadata"
            onCanPlay={() => setVideoReady(true)}
          >
            <source src={project.videoPath} type="video/mp4" />
          </video>
        )}

        {/* Bottom depth gradient — mobile only */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent lg:hidden"
        />

        {/* Badge — overlaid on image (mobile only) */}
        <div className="absolute top-4 left-4 lg:hidden">
          <span
            className={cn(
              'label-mono inline-block rounded-full px-3 py-1',
              'text-[10px] font-semibold uppercase tracking-[0.16em]',
              'bg-black/50 text-white/90 backdrop-blur-sm',
            )}
          >
            {project.badge}
          </span>
        </div>
      </div>

      {/* ── Content panel ─────────────────────────────────────────────────── */}
      {/*
       * Layout intent (editorial print model):
       *   • Outer div  — owns the card padding.
       *   • Inner div  — constrains line-length to 680 px and uses flex-col
       *                  with an explicit flex-1 spacer so the typographic
       *                  headline cluster sits at the top and the technical
       *                  detail footer (chips + meta) sits at the bottom.
       *                  This avoids the cramped top-heavy feel of justify-between
       *                  while keeping the footer firmly grounded.
       */}
      <div className="flex min-w-0 flex-1 p-7 lg:p-10">
        <div className="flex w-full max-w-[680px] flex-col">

          {/* ── Eyebrow: project index + category badge (desktop only) ──────── */}
          {/*
           * PROJECT 01 / AI PLATFORM stacked pair gives each card an
           * editorial sequence number — signals curated, purposeful selection
           * rather than a flat list of items.
           */}
          <div className="mb-5 hidden lg:block">
            <p
              className={cn(
                'label-mono mb-1.5 text-[9px] font-semibold uppercase tracking-[0.22em]',
                'text-[var(--foreground)] opacity-30',
                'transition-opacity duration-200',
                isHovered && 'opacity-45',
              )}
            >
              PROJECT {String(index + 1).padStart(2, '0')}
            </p>
            <span
              className={cn(
                'label-mono inline-block rounded-full px-3 py-1',
                'text-[10px] font-semibold uppercase tracking-[0.16em]',
                'bg-[var(--accent-muted)] text-[var(--accent)]',
                'border border-[var(--accent-soft)]/30',
                'transition-transform duration-200',
                isHovered ? '-translate-y-px' : '',
              )}
            >
              {project.badge}
            </span>
          </div>

          {/* ── Title ──────────────────────────────────────────────────────── */}
          {/*
           * Reduced ~12 % from previous values so long titles like
           * "Plant Outage Orchestrator" remain balanced against the
           * description text without dominating the card.
           *   min  1.3 rem  (20.8 px) — comfortable on small mobile
           *   pref 2.1 vw   — smooth proportional scaling
           *   max  2.2 rem  (35.2 px) — caps at a premium-but-measured size
           */}
          <h3
            className={cn(
              'font-display font-semibold leading-tight tracking-tight',
              'text-[var(--foreground)]',
              'mb-3',
            )}
            style={{ fontSize: 'clamp(1.3rem, 2.1vw, 2.2rem)' }}
          >
            {project.title}
          </h3>

          {/* ── Description ────────────────────────────────────────────────── */}
          <p className="text-sm leading-relaxed text-[var(--foreground-secondary)] lg:text-[0.9375rem]">
            {project.description}
          </p>

          {/* ── Spacer — absorbs leftover height, grounds footer ────────────── */}
          <div className="min-h-[28px] flex-1" aria-hidden />

          {/* ── Tech stack chips ───────────────────────────────────────────── */}
          {/*
           * Slightly stronger border + text colour compared with previous
           * iteration so chips read clearly without looking like buttons.
           * Opacity eases from 72 % at rest to 100 % on card hover —
           * the resting state recedes the chips to avoid competing with the title.
           */}
          <div
            className="mb-5 flex flex-wrap gap-1.5"
            role="list"
            aria-label={`Technologies used in ${project.title}`}
          >
            {project.tech.map((t) => (
              <span
                key={t}
                role="listitem"
                className={cn(
                  'label-mono rounded border px-2.5 py-1',
                  'text-[10px] font-medium',
                  'border-[var(--border)] bg-[var(--surface-raised)]',
                  'text-[var(--foreground-secondary)]',
                  'transition-opacity duration-200',
                  isHovered ? 'opacity-100' : 'opacity-[0.72]',
                )}
              >
                {t}
              </span>
            ))}
          </div>

          {/* ── Footer: metadata · CTA — hairline separator ─────────────────── */}
          <div
            className={cn(
              'border-t pt-4',
              'transition-colors duration-300',
              isHovered ? 'border-[var(--border)]' : 'border-[var(--border-subtle)]',
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <span className="label-mono text-[11px] text-[var(--muted-foreground)]">
                {project.meta}
              </span>

              <span
                className={cn(
                  'inline-flex items-center text-[12px] font-medium',
                  'text-[var(--primary)] transition-all duration-200',
                  isHovered ? 'gap-2.5' : 'gap-1.5',
                )}
                aria-hidden
              >
                View Case Study
                <ArrowRight
                  size={13}
                  aria-hidden
                  className={cn(
                    'transition-transform duration-200',
                    isHovered ? 'translate-x-1' : '',
                  )}
                />
              </span>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
