'use client';

import {
  useState, useRef, useEffect, useCallback, useMemo,
  type CSSProperties,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { capabilityNodes, type CapabilityNode } from './capability-data';
import { CapabilityNodeButton } from './CapabilityNodeButton';
import { ParticleField } from './ParticleField';
import { CapabilityHoverCard } from './CapabilityHoverCard';

// ─── Card position constants ──────────────────────────────────────────────────
const CARD_W     = 268;
const CARD_H_EST = 230;
const NODE_R     = 27;
const CARD_GAP   = 16;

function computeCardStyle(
  node: CapabilityNode,
  cw: number,
  ch: number,
): CSSProperties {
  const cx = (node.position.x / 100) * cw;
  const cy = (node.position.y / 100) * ch;
  const top = Math.max(8, Math.min(ch - CARD_H_EST - 8, cy - CARD_H_EST / 2));

  if (cx + NODE_R + CARD_GAP + CARD_W <= cw - 8) {
    return { position: 'absolute', top, left: cx + NODE_R + CARD_GAP, zIndex: 30 };
  }
  if (cx - NODE_R - CARD_GAP - CARD_W >= 8) {
    return { position: 'absolute', top, left: cx - NODE_R - CARD_GAP - CARD_W, zIndex: 30 };
  }
  return { position: 'absolute', top: Math.max(8, top), left: Math.max(8, cw - CARD_W - 8), zIndex: 30 };
}

// ─── State types ──────────────────────────────────────────────────────────────
interface CardState { nodeId: string; isPinned: boolean }

const NODE_MAP = new Map(capabilityNodes.map((n) => [n.id, n]));

// ─── Component ────────────────────────────────────────────────────────────────

export function CapabilityGraphView() {
  const reduce       = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [card,          setCard]          = useState<CardState | null>(null);
  const [canvasSize,    setCanvasSize]    = useState({ w: 0, h: 0 });
  const [mobileActive,  setMobileActive]  = useState<string | null>(null);

  const activeNodeId  = card?.nodeId ?? null;
  const activeNode    = activeNodeId ? (NODE_MAP.get(activeNodeId) ?? null) : null;
  const mobileNode    = mobileActive ? (NODE_MAP.get(mobileActive) ?? null) : null;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const sync = () => setCanvasSize({ w: el.offsetWidth, h: el.offsetHeight });
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(
      () => setCard((p) => (p?.isPinned ? p : null)),
      240,
    );
  }, [cancelClose]);

  const handleEnter = useCallback((id: string) => {
    cancelClose();
    setCard((p) => p?.isPinned ? p : { nodeId: id, isPinned: false });
  }, [cancelClose]);

  const handleLeave = useCallback(() => scheduleClose(), [scheduleClose]);

  const handleClick = useCallback((id: string) => {
    cancelClose();
    setCard((p) => (p?.nodeId === id && p.isPinned) ? null : { nodeId: id, isPinned: true });
  }, [cancelClose]);

  const handleFocus = useCallback((id: string) => {
    cancelClose();
    setCard((p) => p?.isPinned ? p : { nodeId: id, isPinned: false });
  }, [cancelClose]);

  const handleBlur         = useCallback(() => scheduleClose(),  [scheduleClose]);
  const handleCardEnter    = useCallback(() => cancelClose(),    [cancelClose]);
  const handleCardLeave    = useCallback(() => scheduleClose(), [scheduleClose]);
  const handleCardClose    = useCallback(() => setCard(null),    []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setCard(null); setMobileActive(null); }
    };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  const cardStyle = useMemo((): CSSProperties | null => {
    if (!activeNode || canvasSize.w === 0) return null;
    return computeCardStyle(activeNode, canvasSize.w, canvasSize.h);
  }, [activeNode, canvasSize]);

  const canvasBg: CSSProperties = {
    backgroundColor: 'var(--surface)',
    backgroundImage:
      'radial-gradient(ellipse 68% 52% at 56% 44%, ' +
      'color-mix(in srgb, var(--color-primary) 4%, transparent) 0%, ' +
      'transparent 70%)',
  };

  const renderNodes = (
    activeId: string | null,
    handlers: {
      onClick: (id: string) => void;
      onEnter: (id: string) => void;
      onLeave: () => void;
      onFocus: (id: string) => void;
      onBlur: () => void;
    },
    showOrbitals: boolean,
  ) =>
    capabilityNodes.map((node) => (
      <CapabilityNodeButton
        key={node.id}
        node={node}
        isActive={node.id === activeId}
        isConnected={false}
        isDimmed={false}
        showOrbitals={showOrbitals}
        onClick={() => handlers.onClick(node.id)}
        onMouseEnter={() => handlers.onEnter(node.id)}
        onMouseLeave={handlers.onLeave}
        onFocus={() => handlers.onFocus(node.id)}
        onBlur={handlers.onBlur}
      />
    ));

  return (
    <>
      {/* ══ Desktop ════════════════════════════════════════════════════════ */}
      <div className="hidden md:block">
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: '480px' }}
          role="region"
          aria-label="Capability graph — hover or click a node to explore"
        >
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 overflow-hidden rounded-2xl',
              'border border-black/[0.05] dark:border-white/[0.06]',
            )}
            style={canvasBg}
          />

          <ParticleField activeNodeId={activeNodeId} variant="desktop" />

          {renderNodes(activeNodeId, {
            onClick: handleClick,
            onEnter: handleEnter,
            onLeave: handleLeave,
            onFocus: handleFocus,
            onBlur: handleBlur,
          }, true)}

          <AnimatePresence>
            {activeNode && cardStyle && (
              <motion.div
                key={activeNode.id}
                style={cardStyle}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 6 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 6 }}
                transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <CapabilityHoverCard
                  node={activeNode}
                  isPinned={card?.isPinned ?? false}
                  onClose={handleCardClose}
                  onMouseEnter={handleCardEnter}
                  onMouseLeave={handleCardLeave}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ══ Mobile ═══════════════════════════════════════════════════════════ */}
      <div className="md:hidden">
        <div
          className="overflow-x-auto scrollbar-none rounded-2xl border border-black/[0.05] dark:border-white/[0.06]"
          style={canvasBg}
        >
          <div
            className="relative min-w-[640px]"
            style={{ height: '420px' }}
            role="region"
            aria-label="Capability graph — tap a node to explore"
          >
            <ParticleField activeNodeId={mobileActive} variant="mobile" />

            {renderNodes(mobileActive, {
              onClick: (id) => setMobileActive((p) => (p === id ? null : id)),
              onEnter: () => undefined,
              onLeave: () => undefined,
              onFocus: (id) => setMobileActive(id),
              onBlur: () => undefined,
            }, false)}
          </div>
        </div>

        <AnimatePresence>
          {mobileNode && (
            <motion.div
              key={mobileNode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mt-4"
            >
              <CapabilityHoverCard
                node={mobileNode}
                isPinned
                fullWidth
                onClose={() => setMobileActive(null)}
                onMouseEnter={() => undefined}
                onMouseLeave={() => undefined}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
