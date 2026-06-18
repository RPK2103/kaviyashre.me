// ─── Tab identifiers ───────────────────────────────────────────────────────────

export type AboutTabId = 'whoami' | 'now';

export interface AboutTab {
  id: AboutTabId;
  label: string;
}

export const aboutTabs: AboutTab[] = [
  { id: 'whoami', label: 'whoami' },
  { id: 'now',    label: 'now'    },
];

export const PANEL_COMMANDS: Record<AboutTabId, string> = {
  whoami: 'whoami',
  now:    'now',
};

// ─── whoami ───────────────────────────────────────────────────────────────────

export interface WhoamiContent {
  origin: string;
  currentState: string;
  curiosity: string;
}

export const whoamiData: WhoamiContent = {
  origin:
    'Started with computer science, grew into backend engineering, and slowly became fascinated by the space where AI, products, and user experience meet.',
  currentState:
    "Right now, I'm working as a Cloud & AI Engineer while building my own AI projects, experimenting with product ideas, and learning how great software is designed from both an engineering and user perspective.",
  curiosity:
    "I'm most drawn to messy ideas that can become useful products — the kind that solve real problems, feel simple to use, and still have strong systems underneath.",
};

// ─── now ──────────────────────────────────────────────────────────────────────

export interface NowCard {
  key: string;
  values: readonly string[];
  note: string;
}

export const nowData: NowCard[] = [
  {
    key: 'currently_reading',
    values: ['The Mom Test'],
    note: 'Learning how to ask better questions and understand real user problems.',
  },
  {
    key: 'building',
    values: ['Portfolio OS', 'SignalForge', 'AI Experiments'],
    note: 'Turning ideas into products instead of leaving them in Notion.',
  },
  {
    key: 'learning',
    values: ['Agent Architectures', 'System Design', 'Product Thinking'],
    note: 'Trying to connect engineering depth with product clarity.',
  },
  {
    key: 'training_for',
    values: ['Half Marathon'],
    note: 'Building discipline outside code too.',
  },
  {
    key: 'thinking_about',
    values: [
      'How AI changes software development.',
      'How products become intuitive.',
    ],
    note: 'Mostly during walks, workouts, and late-night debugging.',
  },
  {
    key: 'side_quest',
    values: ['Trying not to redesign this portfolio every weekend.'],
    note: 'Current success rate is questionable.',
  },
];
