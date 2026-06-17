'use client';

import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

const directionOffset = {
  up: { y: 20 },
  down: { y: -20 },
  left: { x: 24 },
  right: { x: -24 },
  none: {},
};

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.55,
  direction = 'up',
}: FadeInProps) {
  const hidden = { opacity: 0, ...directionOffset[direction] };
  const visible = {
    opacity: 1,
    y: 0,
    x: 0,
    transition: {
      duration,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{ hidden, visible }}
    >
      {children}
    </motion.div>
  );
}
