// ─── Field Notes data ─────────────────────────────────────────────────────────
//
// Each note is a lightweight knowledge artifact:
//   published   → live, links to /notes/[slug]
//   draft       → hidden from the UI; never rendered
//   coming-soon → visible but not linked; CTA reads "Coming soon"
//
// Future extensions: MDX content, Notion CMS, AI semantic search, recruiter
// knowledge base. Add those as optional fields here without touching the UI.
// ─────────────────────────────────────────────────────────────────────────────

export type NoteStatus = 'published' | 'draft' | 'coming-soon';

export type NoteCategory =
  | 'AI Systems'
  | 'Build Log'
  | 'Backend Engineering'
  | 'Platform Engineering'
  | 'Product Thinking'
  | 'Cloud Engineering';

export interface NoteData {
  id: string;
  /** URL-safe slug — used for /notes/[slug] routing when published. */
  slug: string;
  title: string;
  category: NoteCategory;
  summary: string;
  /** Display date string, e.g. "Jun 2026" or "2026". */
  date: string;
  readTime: string;
  status: NoteStatus;
  /** When true the note receives the featured layout slot. */
  featured?: boolean;
  tags: string[];
}

export const notesData: NoteData[] = [
  {
    id: 'building-signalforge',
    slug: 'building-signalforge',
    title: 'Building SignalForge',
    category: 'Build Log',
    summary:
      'How I built an AI delivery intelligence platform with FastAPI, Azure OpenAI, product workflows, and execution-focused prompts — shipped in 48 hours for Microsoft Build AI Hackathon 2026.',
    date: 'Jun 2026',
    readTime: '5 min read',
    status: 'coming-soon',
    featured: true,
    tags: ['FastAPI', 'Azure OpenAI', 'Hackathon', 'Build Log'],
  },
  {
    id: 'what-makes-a-good-ai-agent',
    slug: 'what-makes-a-good-ai-agent',
    title: 'What makes a good AI agent?',
    category: 'AI Systems',
    summary:
      'Notes on agent design, orchestration, tool use, memory, and why most agent demos fail before they reach production.',
    date: '2026',
    readTime: '4 min read',
    status: 'coming-soon',
    tags: ['Agents', 'LLM', 'Orchestration'],
  },
  {
    id: 'jpmorgan-backend-ownership',
    slug: 'jpmorgan-backend-ownership',
    title: 'What J.P. Morgan taught me about backend ownership',
    category: 'Backend Engineering',
    summary:
      'Reflections on production systems, accuracy fixes, daily ownership, and why reliability matters more than clever code.',
    date: '2026',
    readTime: '4 min read',
    status: 'coming-soon',
    tags: ['Backend', 'Production', 'Reliability'],
  },
  {
    id: 'event-driven-workflows',
    slug: 'event-driven-workflows',
    title: 'Event-driven workflows in enterprise systems',
    category: 'Platform Engineering',
    summary:
      'How async workers, queues, Service Bus, and real-time updates shape scalable internal platforms.',
    date: '2026',
    readTime: '3 min read',
    status: 'coming-soon',
    tags: ['Async', 'Service Bus', 'Architecture'],
  },
  {
    id: 'ai-projects-need-product-judgment',
    slug: 'ai-projects-need-product-judgment',
    title: 'AI projects need product judgment, not just prompts',
    category: 'Product Thinking',
    summary:
      'Why strong AI products depend on problem framing, user workflows, constraints, and measurable outcomes — not prompt cleverness.',
    date: '2026',
    readTime: '4 min read',
    status: 'coming-soon',
    tags: ['AI', 'Product', 'Systems'],
  },
  {
    id: 'learning-azure-by-building',
    slug: 'learning-azure-by-building',
    title: 'Learning Azure by building small systems',
    category: 'Cloud Engineering',
    summary:
      'Notes from building serverless tools, monitoring workflows, and cloud-native foundations through small focused projects.',
    date: '2026',
    readTime: '3 min read',
    status: 'coming-soon',
    tags: ['Azure', 'Serverless', 'Cloud'],
  },
];
