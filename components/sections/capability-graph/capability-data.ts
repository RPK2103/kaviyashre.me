// ─── Types ────────────────────────────────────────────────────────────────────

export type CapabilityCategory =
  | 'AI'
  | 'Backend'
  | 'Cloud'
  | 'Frontend'
  | 'Automation'
  | 'DevOps';

export type CapabilityNode = {
  id: string;
  label: string;
  category: CapabilityCategory;
  /** lucide-react component name */
  iconKey: string;
  /** Percentage of canvas, 0–100 each axis */
  position: { x: number; y: number };
  /** 2–3 project / context names */
  usedIn: string[];
  /** One-sentence evidence statement */
  context: string;
  /** IDs of directly connected nodes (all edges are bidirectional) */
  related: string[];
};

// ─── Category color tokens ────────────────────────────────────────────────────
// Used in legend + node ring / glow.  Values are literal CSS colors so they
// render identically in both themes (they sit on top of a tinted bg layer).

export const CATEGORY_DOT: Record<CapabilityCategory, string> = {
  AI:         '#f472b6',
  Backend:    '#a78bfa',
  Cloud:      '#38bdf8',
  DevOps:     '#94a3b8',
  Frontend:   '#fb7185',
  Automation: '#c084fc',
};

// ─── Edges ────────────────────────────────────────────────────────────────────
// Connections per spec (18 directed → 18 unique bidirectional edges).
// Cubic Bezier paths with deterministic perpendicular bend for organic routing.

export type ConnectionColor = 'violet' | 'pink' | 'blue';

export const CATEGORY_CONNECTION_COLOR: Record<CapabilityCategory, ConnectionColor> = {
  AI:         'pink',
  Backend:    'violet',
  Cloud:      'blue',
  DevOps:     'blue',
  Frontend:   'pink',
  Automation: 'violet',
};

export interface CapabilityEdge {
  id: string;
  sourceId: string;
  targetId: string;
  d: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  colorFrom: ConnectionColor;
  colorTo: ConnectionColor;
}

/** Deterministic bend sign from edge key — keeps routing stable across renders. */
function edgeBendSign(key: string): number {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0;
  return hash % 2 === 0 ? 1 : -1;
}

/** Smooth cubic Bezier with organic perpendicular offset. */
function buildCurveD(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  key: string,
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.001) return `M ${x1} ${y1} L ${x2} ${y2}`;

  const sign = edgeBendSign(key);
  const px = (-dy / dist) * sign;
  const py = (dx / dist) * sign;
  const offset = Math.min(dist * 0.30, 13);

  const c1x = x1 + dx * 0.28 + px * offset;
  const c1y = y1 + dy * 0.28 + py * offset;
  const c2x = x1 + dx * 0.72 + px * offset * 0.88;
  const c2y = y1 + dy * 0.72 + py * offset * 0.88;

  const fmt = (n: number) => n.toFixed(2);
  return `M ${fmt(x1)} ${fmt(y1)} C ${fmt(c1x)} ${fmt(c1y)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(x2)} ${fmt(y2)}`;
}

export function buildEdges(nodes: CapabilityNode[]): CapabilityEdge[] {
  const map = new Map(nodes.map((n) => [n.id, n]));
  const seen = new Set<string>();
  const edges: CapabilityEdge[] = [];

  for (const node of nodes) {
    for (const relId of node.related) {
      const key = [node.id, relId].sort().join('::');
      if (seen.has(key)) continue;
      seen.add(key);
      const target = map.get(relId);
      if (!target) continue;
      const { x: x1, y: y1 } = node.position;
      const { x: x2, y: y2 } = target.position;
      edges.push({
        id: key,
        sourceId: node.id,
        targetId: relId,
        d: buildCurveD(x1, y1, x2, y2, key),
        x1,
        y1,
        x2,
        y2,
        colorFrom: CATEGORY_CONNECTION_COLOR[node.category],
        colorTo: CATEGORY_CONNECTION_COLOR[target.category],
      });
    }
  }
  return edges;
}

// ─── Node data ────────────────────────────────────────────────────────────────

export const capabilityNodes: CapabilityNode[] = [
  // ── Backend ──────────────────────────────────────────────────────────────
  {
    id: 'java',
    label: 'Java',
    category: 'Backend',
    iconKey: 'Code2',
    position: { x: 28, y: 18 },
    usedIn: ['Internal Platforms', 'Skill Repository Pro'],
    context: 'Primary backend language at work — enterprise REST services and microservice APIs.',
    related: ['spring-boot', 'rest-apis'],
  },
  {
    id: 'spring-boot',
    label: 'Spring Boot',
    category: 'Backend',
    iconKey: 'Layers',
    position: { x: 42, y: 15 },
    usedIn: ['Internal Platforms', 'Skill Repository Pro'],
    context: 'Production microservices with Spring Security, Spring Data JPA, and Spring Cloud.',
    related: ['java', 'rest-apis'],
  },
  {
    id: 'rest-apis',
    label: 'REST APIs',
    category: 'Backend',
    iconKey: 'Globe',
    position: { x: 43, y: 36 },
    usedIn: ['SignalForge', 'Internal Platforms', 'AI Resume Matcher'],
    context: 'Designed and consumed REST APIs following OpenAPI spec across all backend and AI projects.',
    related: ['spring-boot', 'java', 'python', 'azure'],
  },
  {
    id: 'python',
    label: 'Python',
    category: 'Backend',
    iconKey: 'Terminal',
    position: { x: 28, y: 52 },
    usedIn: ['AI Resume Matcher', 'AI Interview Coach', 'SignalForge'],
    context: 'Core language for AI and automation — FastAPI services to data-scripting pipelines.',
    related: ['fastapi', 'rest-apis'],
  },
  {
    id: 'fastapi',
    label: 'FastAPI',
    category: 'Backend',
    iconKey: 'Zap',
    position: { x: 44, y: 58 },
    usedIn: ['AI Resume Matcher', 'AI Interview Coach', 'SignalForge'],
    context: 'Go-to framework for AI-integrated APIs — type-safe, self-documenting, production-ready.',
    related: ['python', 'postgresql', 'react'],
  },
  {
    id: 'postgresql',
    label: 'PostgreSQL',
    category: 'Backend',
    iconKey: 'Database',
    position: { x: 58, y: 52 },
    usedIn: ['SignalForge', 'Skill Repository Pro'],
    context: 'Production relational storage for internal services and AI pipeline data.',
    related: ['fastapi'],
  },

  // ── Cloud ────────────────────────────────────────────────────────────────
  {
    id: 'azure',
    label: 'Azure',
    category: 'Cloud',
    iconKey: 'Cloud',
    position: { x: 60, y: 28 },
    usedIn: ['Internal Platforms', 'SignalForge'],
    context: 'Primary cloud at work — App Service, AKS, Functions, AI Services, and DevOps pipelines.',
    related: ['rest-apis', 'azure-openai', 'kubernetes'],
  },
  {
    id: 'azure-openai',
    label: 'Azure OpenAI',
    category: 'AI',
    iconKey: 'Bot',
    position: { x: 74, y: 22 },
    usedIn: ['SignalForge', 'Portfolio Assistant'],
    context: 'Used for executive insight generation, reasoning workflows, and AI-powered analysis.',
    related: ['azure', 'aws', 'docker'],
  },
  {
    id: 'aws',
    label: 'AWS',
    category: 'Cloud',
    iconKey: 'Server',
    position: { x: 90, y: 14 },
    usedIn: ['Personal Projects', 'AI Experiments'],
    context: 'Lambda, S3, EC2 for personal projects and cross-cloud experimentation.',
    related: ['azure-openai'],
  },

  // ── DevOps ───────────────────────────────────────────────────────────────
  {
    id: 'kubernetes',
    label: 'Kubernetes',
    category: 'DevOps',
    iconKey: 'Network',
    position: { x: 73, y: 50 },
    usedIn: ['Internal Platforms'],
    context: 'Managed containerised workloads in production AKS — deployments, scaling, secrets.',
    related: ['azure', 'docker', 'github-actions'],
  },
  {
    id: 'docker',
    label: 'Docker',
    category: 'DevOps',
    iconKey: 'Box',
    position: { x: 84, y: 42 },
    usedIn: ['Internal Platforms', 'SignalForge'],
    context: 'Containerised all services for consistent local development and production parity.',
    related: ['azure-openai', 'kubernetes'],
  },
  {
    id: 'github-actions',
    label: 'GitHub Actions',
    category: 'DevOps',
    iconKey: 'GitBranch',
    position: { x: 68, y: 78 },
    usedIn: ['Internal Platforms', 'Portfolio OS'],
    context: 'CI/CD pipelines for automated testing, Docker builds, and cloud deployments.',
    related: ['kubernetes', 'framer-motion', 'power-platform'],
  },

  // ── Frontend ─────────────────────────────────────────────────────────────
  {
    id: 'react',
    label: 'React',
    category: 'Frontend',
    iconKey: 'Atom',
    position: { x: 27, y: 76 },
    usedIn: ['Portfolio OS', 'SignalForge'],
    context: 'Built interactive UIs with React + TypeScript — including this portfolio.',
    related: ['typescript', 'fastapi'],
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    category: 'Frontend',
    iconKey: 'Braces',
    position: { x: 40, y: 82 },
    usedIn: ['Portfolio OS', 'SignalForge'],
    context: 'Strict TypeScript across all frontend work — no any, typed interfaces everywhere.',
    related: ['react', 'framer-motion'],
  },
  {
    id: 'framer-motion',
    label: 'Framer Motion',
    category: 'Frontend',
    iconKey: 'Wind',
    position: { x: 55, y: 82 },
    usedIn: ['Portfolio OS'],
    context: 'All portfolio animations — scroll-triggered, spring physics, reduced-motion support.',
    related: ['typescript', 'github-actions'],
  },

  // ── Automation ────────────────────────────────────────────────────────────
  {
    id: 'power-platform',
    label: 'Power Platform',
    category: 'Automation',
    iconKey: 'Workflow',
    position: { x: 82, y: 76 },
    usedIn: ['Internal Platforms'],
    context: 'Power Automate flows to streamline internal engineering workflows and approvals.',
    related: ['github-actions'],
  },
];

// Pre-built edge list (retained for data model; connectors not rendered)
export const CAPABILITY_EDGES = buildEdges(capabilityNodes);
