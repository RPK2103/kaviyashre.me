'use client';

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  type CSSProperties,
} from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { skillsGraph, type SkillItem } from '@/data/skills';
import { SkillNode } from './SkillNode';
import { SkillDetailCard } from './SkillDetailCard';

// ─── Canvas coordinate space ──────────────────────────────────────────────────
// All node pos values (0–1) are relative to this logical canvas.
const CW = 1000;
const CH = 500;

// ─── Derived data (computed once at module load) ───────────────────────────────

function flattenSkills(items: SkillItem[]): SkillItem[] {
  const out: SkillItem[] = [];
  for (const item of items) {
    out.push(item);
    if (item.children) out.push(...flattenSkills(item.children));
  }
  return out;
}

interface Edge {
  id: string;
  sourceId: string;
  targetId: string;
  x1: number; // SVG coords
  y1: number;
  x2: number;
  y2: number;
  d: string;
}

function buildEdges(items: SkillItem[]): Edge[] {
  const nodeMap = new Map(flattenSkills(items).map((n) => [n.id, n]));
  const edges: Edge[] = [];
  for (const root of items) {
    for (const childId of root.connections) {
      const child = nodeMap.get(childId);
      if (!child) continue;
      const x1 = root.pos.x * CW;
      const y1 = root.pos.y * CH;
      const x2 = child.pos.x * CW;
      const y2 = child.pos.y * CH;
      const mx = (x1 + x2) / 2;
      edges.push({
        id: `${root.id}→${childId}`,
        sourceId: root.id,
        targetId: childId,
        x1, y1, x2, y2,
        d: `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`,
      });
    }
  }
  return edges;
}

const ALL_NODES = flattenSkills(skillsGraph);
const ALL_EDGES = buildEdges(skillsGraph);

// ─── Card position helper ─────────────────────────────────────────────────────

const CARD_W = 272;
const CARD_H_EST = 360;
const CARD_GAP = 14;

function getCardStyle(
  node: SkillItem,
  canvasW: number,
  canvasH: number,
): CSSProperties {
  const cx = node.pos.x * canvasW;
  const cy = node.pos.y * canvasH;
  // Approximate half-width of the rendered node
  const halfW = node.type === 'root' ? 46 : 62;

  // Vertical: centre on node, clamped
  const rawTop = cy - CARD_H_EST / 2;
  const top = Math.max(8, Math.min(canvasH - CARD_H_EST - 8, rawTop));

  // Horizontal: prefer right, fallback left, last-resort clamp
  if (cx + halfW + CARD_GAP + CARD_W <= canvasW - 8) {
    return { position: 'absolute', top, left: cx + halfW + CARD_GAP, zIndex: 20 };
  }
  if (cx - halfW - CARD_GAP - CARD_W >= 8) {
    return { position: 'absolute', top, left: cx - halfW - CARD_GAP - CARD_W, zIndex: 20 };
  }
  return { position: 'absolute', top, left: Math.max(8, canvasW - CARD_W - 8), zIndex: 20 };
}

// ─── Main component ───────────────────────────────────────────────────────────

interface CardState {
  nodeId: string;
  isPinned: boolean;
}

export function SkillGraphCanvas() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [cardState, setCardState] = useState<CardState | null>({ nodeId: 'ai', isPinned: false });
  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  const activeNode = cardState ? (ALL_NODES.find((n) => n.id === cardState.nodeId) ?? null) : null;

  // Track canvas size for card positioning
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const sync = () => setCanvasSize({ w: el.offsetWidth, h: el.offsetHeight });
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── Timer helpers ─────────────────────────────────────────────────────────
  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = setTimeout(() => {
      setCardState((prev) => (prev?.isPinned ? prev : null));
    }, 220);
  }, [cancelClose]);

  // ── Interaction handlers ──────────────────────────────────────────────────
  const handleNodeEnter = useCallback(
    (id: string) => {
      cancelClose();
      setCardState((prev) => (prev?.isPinned ? prev : { nodeId: id, isPinned: false }));
    },
    [cancelClose],
  );

  const handleNodeLeave = useCallback(() => scheduleClose(), [scheduleClose]);

  const handleNodeClick = useCallback(
    (id: string) => {
      cancelClose();
      setCardState((prev) => {
        if (prev?.nodeId === id && prev.isPinned) return null; // toggle off
        return { nodeId: id, isPinned: true };
      });
    },
    [cancelClose],
  );

  const handleNodeFocus = useCallback(
    (id: string) => {
      cancelClose();
      setCardState((prev) => (prev?.isPinned ? prev : { nodeId: id, isPinned: false }));
    },
    [cancelClose],
  );

  const handleNodeBlur = useCallback(() => scheduleClose(), [scheduleClose]);

  const handleCardEnter = useCallback(() => cancelClose(), [cancelClose]);
  const handleCardLeave = useCallback(() => scheduleClose(), [scheduleClose]);
  const handleCardClose = useCallback(() => setCardState(null), []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCardState(null);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // ── Edge opacity based on active node ─────────────────────────────────────
  const edgesWithState = useMemo(
    () =>
      ALL_EDGES.map((edge) => ({
        ...edge,
        isActive:
          cardState?.nodeId === edge.sourceId || cardState?.nodeId === edge.targetId,
      })),
    [cardState?.nodeId],
  );

  // ── Floating card style ───────────────────────────────────────────────────
  const cardStyle = useMemo((): CSSProperties | null => {
    if (!activeNode || canvasSize.w === 0) return null;
    return getCardStyle(activeNode, canvasSize.w, canvasSize.h);
  }, [activeNode, canvasSize]);

  // ── Card animation variants ───────────────────────────────────────────────
  const cardInitial = reduce ? { opacity: 0 } : { opacity: 0, scale: 0.93, y: 5 };
  const cardAnimate = reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 };
  const cardExit = reduce ? { opacity: 0 } : { opacity: 0, scale: 0.93, y: 5 };

  return (
    <>
      {/* ══ Desktop: full node-graph ══════════════════════════════════════════ */}
      <div className="hidden md:block">
        <div
          ref={containerRef}
          className="relative w-full select-none overflow-hidden rounded-xl"
          style={{
            aspectRatio: `${CW}/${CH}`,
            maxWidth: '1000px',
            margin: '0 auto',
            // Subtle dot-grid background
            backgroundImage:
              'radial-gradient(circle, var(--color-border) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            backgroundPosition: '14px 14px',
          }}
          role="region"
          aria-label="Interactive skills graph — hover or click a node to explore"
        >
          {/* SVG connection lines */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${CW} ${CH}`}
            preserveAspectRatio="xMidYMid meet"
          >
            {edgesWithState.map((edge) => (
              <motion.path
                key={edge.id}
                d={edge.d}
                fill="none"
                stroke="var(--color-accent)"
                animate={{
                  strokeWidth: edge.isActive ? 2 : 1.5,
                  strokeOpacity: edge.isActive ? 0.5 : 0.16,
                }}
                transition={{ duration: 0.25 }}
              />
            ))}
          </svg>

          {/* Nodes */}
          {ALL_NODES.map((node) => (
            <div
              key={node.id}
              className="absolute"
              style={{
                left: `${node.pos.x * 100}%`,
                top: `${node.pos.y * 100}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
              }}
            >
              <SkillNode
                node={node}
                isActive={cardState?.nodeId === node.id}
                onClick={() => handleNodeClick(node.id)}
                onMouseEnter={() => handleNodeEnter(node.id)}
                onMouseLeave={handleNodeLeave}
                onFocus={() => handleNodeFocus(node.id)}
                onBlur={handleNodeBlur}
              />
            </div>
          ))}

          {/* Floating evidence card */}
          <AnimatePresence>
            {activeNode && cardStyle && (
              <motion.div
                key={activeNode.id}
                style={cardStyle}
                initial={cardInitial}
                animate={cardAnimate}
                exit={cardExit}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              >
                <SkillDetailCard
                  node={activeNode}
                  isPinned={cardState?.isPinned ?? false}
                  onClose={handleCardClose}
                  onMouseEnter={handleCardEnter}
                  onMouseLeave={handleCardLeave}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hint overlay — only before any interaction */}
          {!cardState && (
            <p
              aria-hidden
              className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 select-none text-[10px] text-muted-foreground/45"
            >
              Hover or click any node to explore
            </p>
          )}
        </div>
      </div>

      {/* ══ Mobile: vertical skill-path ══════════════════════════════════════ */}
      <div className="md:hidden">
        <MobileSkillPath />
      </div>
    </>
  );
}

// ─── Mobile skill-path ────────────────────────────────────────────────────────

function MobileSkillPath() {
  const [expandedRootId, setExpandedRootId] = useState<string>('ai');

  return (
    <div className="flex flex-col gap-3">
      {skillsGraph.map((root, i) => (
        <MobileRootCard
          key={root.id}
          root={root}
          isFirst={i === 0}
          isLast={i === skillsGraph.length - 1}
          isExpanded={expandedRootId === root.id}
          onToggle={() =>
            setExpandedRootId((prev) => (prev === root.id ? '' : root.id))
          }
        />
      ))}
    </div>
  );
}

interface MobileRootCardProps {
  root: SkillItem;
  isFirst: boolean;
  isLast: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function MobileRootCard({ root, isFirst, isLast, isExpanded, onToggle }: MobileRootCardProps) {
  return (
    <div className="relative">
      {/* Vertical connector */}
      {!isFirst && (
        <div
          aria-hidden
          className="absolute left-[22px] -top-3 h-3 w-px bg-border-subtle"
        />
      )}
      {!isLast && isExpanded && (
        <div
          aria-hidden
          className="absolute left-[22px] top-full h-3 w-px bg-border-subtle"
        />
      )}

      {/* Root header button */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
          isExpanded
            ? 'border-accent/40 bg-accent-muted text-accent'
            : 'border-border bg-surface text-foreground hover:border-accent/25 hover:bg-surface-raised',
        )}
      >
        <span className="text-lg leading-none shrink-0" aria-hidden>
          {root.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold">{root.label}</p>
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
            {root.description}
          </p>
        </div>
        <span
          aria-hidden
          className={cn(
            'text-[10px] text-muted-foreground transition-transform duration-200',
            isExpanded && 'rotate-180',
          )}
        >
          ▾
        </span>
      </button>

      {/* Expanded children */}
      <AnimatePresence>
        {isExpanded && root.children && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-5 mt-2 flex flex-col gap-1.5 border-l border-border-subtle pl-4">
              {root.children.map((child) => (
                <MobileChildCard key={child.id} child={child} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileChildCard({ child }: { child: SkillItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border transition-colors duration-200',
        open ? 'border-accent/25 bg-surface' : 'border-border-subtle bg-surface',
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center gap-2 px-3 py-2 text-left',
          'text-[12px] font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
          open ? 'text-accent' : 'text-foreground-secondary hover:text-foreground',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'text-[9px] transition-transform duration-150',
            open && 'rotate-90',
          )}
        >
          ▸
        </span>
        {child.label}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-subtle px-3 py-3">
              <p className="mb-3 text-[12px] leading-[1.65] text-foreground-secondary">
                {child.description}
              </p>

              {/* Technologies */}
              <div className="mb-2.5 flex flex-wrap gap-1">
                {child.technologies.slice(0, 5).map((t) => (
                  <span
                    key={t}
                    className="rounded border border-border-subtle bg-background-subtle px-1.5 py-0.5 text-[10px] font-medium text-foreground-secondary"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Projects */}
              <div className="mb-2.5 flex flex-wrap gap-1">
                {child.projects.map((p) => (
                  <span
                    key={p}
                    className="rounded border border-accent/20 bg-accent-muted px-1.5 py-0.5 text-[10px] font-medium text-accent"
                  >
                    {p}
                  </span>
                ))}
              </div>

              {/* Context */}
              <p className="text-[11px] italic leading-relaxed text-muted-foreground">
                {child.usageContext}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
