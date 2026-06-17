'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { titleSwap } from '@/lib/animations';

interface AnimatedTitleProps {
  titles: readonly string[];
  interval?: number;
  className?: string;
}

export function AnimatedTitle({
  titles,
  interval = 2600,
  className,
}: AnimatedTitleProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, interval);
    return () => clearInterval(timer);
  }, [titles.length, interval]);

  return (
    <span
      className="relative inline-block"
      aria-label={titles[index]}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={titles[index]}
          className={className}
          variants={titleSwap}
          initial="enter"
          animate="center"
          exit="exit"
          style={{ display: 'inline-block' }}
        >
          {titles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
