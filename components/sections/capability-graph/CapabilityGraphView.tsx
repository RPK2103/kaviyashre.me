'use client';

import {
  useState, useRef, useEffect, useCallback, useMemo,
  type CSSProperties,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { capabilityNodes, CAPABILITY_EDGES, type CapabilityNode } from './capability-data';
import { CapabilityNodeButton } from './CapabilityNodeButton';
import { GraphConnections } from './GraphConnections';
import { CapabilityHoverCard } from './CapabilityHoverCard';

// ─── Card position constants ──────────────────────────────────────────────────
const CARD_W     = 268;
const CARD_H_EST = 230;
const NODE_R     = 27;  // half of 54px node circle (in px)
const CARD_GAP   = 16;

function computeCardStyle(
  node: CapabilityNode,
  cw: number,
  ch: number,
): CSSProperties {
  const cx = (node.position.x / 100) * cw;
  const cy = (node.position.y / 100) * ch;
  const top = Math.max(8, Math.min(ch - CARD_H_EST - 8, cy - CARD_H_EST / 2));

  // Prefer right, fallback left, then clamp
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

// ─── Node map ─────────────────────────────────────────────────────────────────
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

  // ── Resize observer ────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const sync = () => setCanvasSize({ w: el.offsetWidth, h: el.offsetHeight });
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Timer helpers ──────────────────────────────────────────────────────────
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

  // ── Desktop interaction handlers ───────────────────────────────────────────
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

  // ── Escape key ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setCard(null); setMobileActive(null); }
    };
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, []);

  // ── Connected node set (for dimming) ───────────────────────────────────────
  const connectedIds = useMemo(() => {
    if (!activeNodeId) return new Set<string>();
    return new Set(NODE_MAP.get(activeNodeId)?.related ?? []);
  }, [activeNodeId]);

  const mobileConnectedIds = useMemo(() => {
    if (!mobileActive) return new Set<string>();
    return new Set(NODE_MAP.get(mobileActive)?.related ?? []);
  }, [mobileActive]);

  // ── Floating card position ─────────────────────────────────────────────────
  const cardStyle = useMemo((): CSSProperties | null => {
    if (!activeNode || canvasSize.w === 0) return null;
    return computeCardStyle(activeNode, canvasSize.w, canvasSize.h);
  }, [activeNode, canvasSize]);

  // ── Canvas background style ────────────────────────────────────────────────
  const canvasBg: CSSProperties = {
    backgroundImage:
      'radial-gradient(circle at 50% 50%, ' +
      'color-mix(in srgb, var(--color-accent) 4%, transparent) 0%, ' +
      'transparent 70%)',
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ══ Desktop graph ══════════════════════════════════════════════════ */}
      <div className="hidden md:block">
        {/*
          Outer: relative, no overflow-hidden → floating card can bleed
          Inner bg layer: overflow-hidden + rounded → clips dot grid to corners
        */}
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: '500px' }}
          role="region"
          aria-label="Capability graph — hover or click a node to explore"
        >
          {/* Background tint + rounded border — overflow hidden to clip bg to corners */}
          <div
            aria-hidden
            className={cn(
              'pointer-events-none absolute inset-0 rounded-2xl overflow-hidden',
              'border border-black/[0.06] dark:border-white/[0.05]',
            )}
            style={canvasBg}
          />

          {/* SVG: connections + particles + constellation */}
          <GraphConnections activeNodeId={activeNodeId} connectedIds={connectedIds} />

          {/* Nodes */}
          {capabilityNodes.map((node) => {
            const isActive    = node.id === activeNodeId;
            const isConnected = !isActive && connectedIds.has(node.id);
            const isDimmed    = !!activeNodeId && !isActive && !isConnected;
            return (
              <CapabilityNodeButton
                key={node.id}
                node={node}
                isActive={isActive}
                isConnected={isConnected}
                isDimmed={isDimmed}
                onClick={() => handleClick(node.id)}
                onMouseEnter={() => handleEnter(node.id)}
                onMouseLeave={handleLeave}
                onFocus={() => handleFocus(node.id)}
                onBlur={handleBlur}
              />
            );
          })}

          {/* Floating evidence card */}
          <AnimatePresence>
            {activeNode && cardStyle && (
              <motion.div
                key={activeNode.id}
                style={cardStyle}
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 6 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1,    y: 0 }}
                exit={reduce  ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 6 }}
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

          {/* First-load hint */}
          {!card && (
            <p
              aria-hidden
              className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 select-none text-[10px] text-muted-foreground/40"
            >
              Hover or click any node to explore
            </p>
          )}
        </div>
      </div>

      {/* ══ Mobile: horizontal scroll + card below ═════════════════════════ */}
      <div className="md:hidden">
        {/* Scroll wrapper */}
        <div
          className="overflow-x-auto scrollbar-none rounded-2xl border border-black/[0.06] dark:border-white/[0.05]"
          style={canvasBg}
        >
          <div
            className="relative min-w-[640px]"
            style={{ height: '420px' }}
            role="region"
            aria-label="Capability graph — tap a node to explore"
          >
            {/* SVG (uses mobile connected IDs) */}
            <GraphConnections activeNodeId={mobileActive} connectedIds={mobileConnectedIds} />

            {/* Nodes */}
            {capabilityNodes.map((node) => {
              const isActive    = node.id === mobileActive;
              const isConnected = !isActive && mobileConnectedIds.has(node.id);
              const isDimmed    = !!mobileActive && !isActive && !isConnected;
              return (
                <CapabilityNodeButton
                  key={node.id}
                  node={node}
                  isActive={isActive}
                  isConnected={isConnected}
                  isDimmed={isDimmed}
                  onClick={() => setMobileActive((p) => (p === node.id ? null : node.id))}
                  onMouseEnter={() => undefined}
                  onMouseLeave={() => undefined}
                  onFocus={() => setMobileActive(node.id)}
                  onBlur={() => undefined}
                />
              );
            })}
          </div>
        </div>

        {/* Mobile evidence card — in document flow below the graph */}
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
