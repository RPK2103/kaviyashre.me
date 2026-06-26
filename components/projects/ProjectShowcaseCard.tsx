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
  onOpenModal: (project: ProjectData) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProjectShowcaseCard({
  project,
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
      /* Subtle lift on hover — no scale to avoid layout shift */
      animate={
        reduced
          ? {}
          : { y: isHovered ? -3 : 0 }
      }
      transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'group relative flex flex-col lg:flex-row lg:items-stretch',
        'w-full overflow-hidden rounded-2xl',
        'cursor-pointer select-none',
        'bg-[var(--surface)] border',
        isHovered ? 'border-[var(--primary)]/80' : 'border-[var(--border)]',
        /* shadow — light theme */
        'shadow-[0_2px_16px_-2px_rgba(121,84,101,0.10),0_1px_4px_rgba(30,27,24,0.04)]',
        isHovered &&
          'shadow-[0_8px_36px_-4px_rgba(121,84,101,0.18),0_3px_12px_rgba(30,27,24,0.07)]',
        /* shadow — dark theme */
        'dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5),0_1px_6px_rgba(0,0,0,0.3)]',
        isHovered &&
          'dark:shadow-[0_8px_44px_-4px_rgba(139,92,246,0.24),0_0_0_1px_rgba(139,92,246,0.22),0_3px_16px_rgba(0,0,0,0.5)]',
        'transition-[border-color,box-shadow] duration-300 ease-out',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
      )}
    >
      {/* ── Media panel ───────────────────────────────────────────────────── */}
      {/*
       * Sizing: cover + slight top bias (center 18 %) keeps dashboard chrome
       * readable while avoiding harsh top/bottom crops. Video uses matching
       * object-position for seamless image→video transition. Static-only cards
       * gently zoom the image on hover (1.05×, clipped inside overflow-hidden).
       */}
      <div
        className={cn(
          'relative w-full overflow-hidden',
          'aspect-video',
          'lg:aspect-auto lg:w-[40%] lg:flex-shrink-0 lg:self-stretch',
        )}
      >
        {/* Placeholder gradient — always underneath, visible if image fails */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: project.placeholderGradient }}
        />

        {/* Cover image — zoom on hover when no video; clipped inside panel */}
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <div
            className={cn(
              'absolute inset-0 origin-center',
              'transition-transform ease-out',
              !reduced && 'duration-[650ms]',
              !project.videoPath &&
                isHovered &&
                !reduced &&
                'scale-[1.05]',
            )}
            style={{
              backgroundImage: `url(${project.imagePath})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 18%',
              backgroundRepeat: 'no-repeat',
            }}
          />
        </div>

        {/* Video overlay — only rendered when videoPath exists */}
        {project.videoPath && (
          <video
            ref={videoRef}
            aria-hidden
            className={cn(
              'absolute inset-0 h-full w-full',
              'object-cover [object-position:center_18%]',
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

        {/* Desktop edge fade — softens media-to-content transition */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-8',
            'bg-gradient-to-l from-[var(--surface)]/95 via-[var(--surface)]/40 to-transparent',
            'lg:block',
          )}
        />

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
      <div className="flex min-w-0 flex-1 items-center p-6 lg:px-9 lg:py-7">
        <div className="flex w-full max-w-[680px] flex-col">

          {/* ── Category badge (desktop) ──────────────────────────────────── */}
          <div className="mb-4 hidden lg:block">
            <span
              className={cn(
                'label-mono inline-block rounded-full px-3 py-1',
                'text-[10px] font-semibold uppercase tracking-[0.16em]',
                'bg-[var(--accent-muted)] text-[var(--accent)]',
                'border border-[var(--accent-soft)]/25',
                'dark:text-[var(--accent)]/90',
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
              'mb-2.5',
            )}
            style={{ fontSize: 'clamp(1.3rem, 2.1vw, 2.2rem)' }}
          >
            {project.title}
          </h3>

          {/* ── Description ────────────────────────────────────────────────── */}
          <p
            className={cn(
              'max-w-[88%] text-sm leading-relaxed lg:max-w-[700px] lg:text-[0.9375rem]',
              'text-[var(--foreground-secondary)]',
              'dark:text-[#b4b4bc]',
            )}
          >
            {project.description}
          </p>

          {/* ── Spacer — absorbs leftover height, grounds footer ────────────── */}
          <div className="min-h-[16px] flex-1" aria-hidden />

          {/* ── Tech stack chips ───────────────────────────────────────────── */}
          {/*
           * Slightly stronger border + text colour compared with previous
           * iteration so chips read clearly without looking like buttons.
           * Opacity eases from 72 % at rest to 100 % on card hover —
           * the resting state recedes the chips to avoid competing with the title.
           */}
          <div
            className="mb-4 flex flex-wrap gap-1.5"
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
                  'text-[var(--foreground-secondary)] dark:text-[#b0b0b8]',
                  'transition-opacity duration-200',
                  isHovered ? 'opacity-100' : 'opacity-[0.78] dark:opacity-[0.82]',
                )}
              >
                {t}
              </span>
            ))}
          </div>

          {/* ── Footer: metadata · CTA — hairline separator ─────────────────── */}
          <div
            className={cn(
              'border-t pt-3.5',
              'transition-colors duration-300',
              isHovered ? 'border-[var(--border)]' : 'border-[var(--border-subtle)]',
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
              <span className="label-mono text-[11px] text-[var(--muted-foreground)] dark:text-[#9a9aa3]">
                {project.meta}
              </span>

              <span
                className={cn(
                  'relative inline-flex items-center text-[12px] font-medium',
                  'transition-[gap,color,opacity] duration-200 ease-out',
                  isHovered
                    ? 'gap-2.5 text-[var(--primary)] opacity-100 dark:brightness-110'
                    : 'gap-1.5 text-[var(--primary)] opacity-90',
                )}
                aria-hidden
              >
                <span className="relative">
                  View Case Study
                  <span
                    aria-hidden
                    className={cn(
                      'absolute -bottom-px left-0 h-px bg-[var(--primary)]',
                      'transition-[width,opacity] duration-200 ease-out',
                      isHovered && !reduced
                        ? 'w-full opacity-50'
                        : 'w-0 opacity-0',
                    )}
                  />
                </span>
                <ArrowRight
                  size={13}
                  aria-hidden
                  className={cn(
                    'transition-transform duration-200 ease-out',
                    isHovered && !reduced ? 'translate-x-1' : '',
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
