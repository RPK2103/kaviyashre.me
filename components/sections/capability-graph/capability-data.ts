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
// S-curve formula: M x1 y1 C mx y1 mx y2 x2 y2
// where mx = (x1+x2)/2.

export interface CapabilityEdge {
  id: string;
  sourceId: string;
  targetId: string;
  d: string;
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
      const mx = (x1 + x2) / 2;
      edges.push({
        id: key,
        sourceId: node.id,
        targetId: relId,
        d: `M ${x1} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2} ${y2}`,
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

// Pre-built edge list (consumed by GraphConnections)
export const CAPABILITY_EDGES = buildEdges(capabilityNodes);

// Idle particle paths — spread across clusters for visual variety
export const IDLE_PARTICLE_PATHS: Array<{ edgeId: string; dur: number; begin: number }> = [
  { edgeId: 'java::spring-boot',        dur: 3.0, begin: 0.0 },
  { edgeId: 'rest-apis::azure',         dur: 3.8, begin: 0.8 },
  { edgeId: 'azure::kubernetes',        dur: 3.2, begin: 1.6 },
  { edgeId: 'react::typescript',        dur: 2.6, begin: 0.4 },
  { edgeId: 'python::fastapi',          dur: 3.5, begin: 1.2 },
  { edgeId: 'framer-motion::github-actions', dur: 4.0, begin: 2.0 },
];
