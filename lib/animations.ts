import type { Transition, Variants } from 'framer-motion';

/** Premium ease — used for reveals and section entrances */
export const MOTION_EASE = [0.25, 0.46, 0.45, 0.94] as const;

/** Shared timing tokens */
export const MOTION_HOVER_MS = 0.25;
export const MOTION_REVEAL_MS = 0.55;

export const hoverTransition: Transition = {
  duration: MOTION_HOVER_MS,
  ease: MOTION_EASE,
};

export const revealTransition: Transition = {
  duration: MOTION_REVEAL_MS,
  ease: MOTION_EASE,
};

/** Default whileInView viewport for section headers */
export const SECTION_VIEWPORT = { once: true, margin: '-80px' } as const;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: MOTION_REVEAL_MS, ease: MOTION_EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const titleSwap: Variants = {
  enter: { opacity: 0, y: 14 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};
