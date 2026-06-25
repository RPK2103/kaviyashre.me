'use client';

import { useEffect, useRef, useState } from 'react';

/** Navbar is h-16 — bias active detection to the upper viewport band. */
const OBSERVER_ROOT_MARGIN = '-72px 0px -45% 0px';

/**
 * Tracks which homepage section is currently in view for nav highlighting.
 * Uses IntersectionObserver with a visibility map so the last section still
 * activates correctly near the page bottom.
 */
export function useActiveSection(sectionIds: readonly string[]) {
  const visibilityRef = useRef<Map<string, number>>(new Map());

  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window === 'undefined') return sectionIds[0] ?? 'home';
    const hash = window.location.hash.replace('#', '');
    return hash && sectionIds.includes(hash) ? hash : sectionIds[0] ?? 'home';
  });

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const pickActive = () => {
      let bestId = sectionIds[0] ?? 'home';
      let bestRatio = -1;

      for (const id of sectionIds) {
        const ratio = visibilityRef.current.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }

      if (bestRatio > 0) {
        setActiveSection(bestId);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityRef.current.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        });
        pickActive();
      },
      {
        rootMargin: OBSERVER_ROOT_MARGIN,
        threshold: [0, 0.05, 0.1, 0.2, 0.35, 0.5, 0.75],
      },
    );

    sections.forEach((section) => observer.observe(section));

    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && sectionIds.includes(hash)) {
        setActiveSection(hash);
      }
    };

    window.addEventListener('hashchange', onHashChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', onHashChange);
      visibilityRef.current.clear();
    };
  }, [sectionIds]);

  return activeSection;
}

function sectionIdFromHref(href: string): string {
  const hashIndex = href.indexOf('#');
  return hashIndex >= 0 ? href.slice(hashIndex + 1) : href;
}

export { sectionIdFromHref };
