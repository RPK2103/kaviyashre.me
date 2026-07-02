'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const CHAR_DELAY_MS = 18;
const LINE_PAUSE_MS = 120;

interface Props {
  lines: readonly string[];
  className?: string;
}

function BlinkingCursor() {
  return (
    <span
      className="animate-cursor-blink ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] rounded-[1px] bg-accent/60 align-middle"
      aria-hidden
    />
  );
}

function IntroText({ lines, showCursor }: { lines: readonly string[]; showCursor: boolean }) {
  return (
    <>
      {lines.map((line, i, arr) => (
        <p
          key={i}
          className={
            line === ''
              ? 'h-3'
              : 'text-[0.9rem] leading-[1.75] text-foreground-secondary'
          }
        >
          {line}
          {showCursor && i === arr.length - 1 && <BlinkingCursor />}
        </p>
      ))}
    </>
  );
}

function AnimatedTypewriter({
  fullText,
  className,
}: {
  fullText: string;
  className?: string;
}) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let index = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (index >= fullText.length) return;

      const nextChar = fullText[index];
      index += 1;
      setVisibleCount(index);

      const delay =
        nextChar === '\n' ? CHAR_DELAY_MS + LINE_PAUSE_MS : CHAR_DELAY_MS;
      timeoutId = setTimeout(tick, delay);
    };

    timeoutId = setTimeout(tick, 280);

    return () => clearTimeout(timeoutId);
  }, [fullText]);

  const displayed = fullText.slice(0, visibleCount);
  const displayedLines = displayed.split('\n');

  return (
    <div className={className}>
      {displayedLines.map((line, i, arr) => (
        <p
          key={i}
          className={
            line === ''
              ? 'h-3'
              : 'text-[0.9rem] leading-[1.75] text-foreground-secondary'
          }
        >
          {line}
          {i === arr.length - 1 && <BlinkingCursor />}
        </p>
      ))}
      {displayed.length === 0 && <BlinkingCursor />}
    </div>
  );
}

export function TypewriterIntro({ lines, className }: Props) {
  const reduced = useReducedMotion();
  const fullText = lines.join('\n');

  if (reduced) {
    return (
      <div className={className}>
        <IntroText lines={lines} showCursor />
      </div>
    );
  }

  return (
    <AnimatedTypewriter fullText={fullText} className={className} />
  );
}
