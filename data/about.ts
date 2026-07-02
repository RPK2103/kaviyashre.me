// ─── Tab identifiers ───────────────────────────────────────────────────────────

export type AboutTabId = 'intro' | 'current-track';

export interface AboutTab {
  id: AboutTabId;
  label: string;
}

export const aboutTabs: AboutTab[] = [
  { id: 'intro', label: 'intro.exe' },
  { id: 'current-track', label: 'current.track' },
];

export const PANEL_COMMANDS: Record<AboutTabId, string> = {
  intro: 'intro.exe',
  'current-track': 'current.track',
};

// Alternative section heading options (reference only):
// personal.log
// human side of the system
// not just the build logs
// behind the interface
// system notes
// the person behind the product
// readme: human
// identity, but make it human
// logs from a curious engineer
// where the human shows up

// ─── intro.exe ────────────────────────────────────────────────────────────────

export const introLines: readonly string[] = [
  'Part engineer. Part problem-solver. Part curious human who enjoys building things that make life easier — and occasionally more fun.',
  '',
  'I like turning chaotic ideas into structured systems, shipping them, breaking them, fixing them, and learning something new in the process.',
  '',
  "When I'm not deep in code, I'm probably training for my next race, reading, or planning my next creative obsession.",
  '',
  'Always building. Always learning.',
];

// ─── current.track ────────────────────────────────────────────────────────────

export interface CurrentTrackEntry {
  key: string;
  value: string;
}

export const currentTrackData: CurrentTrackEntry[] = [
  { key: 'reading', value: 'The Mom Test' },
  { key: 'building', value: 'Portfolio OS, SignalForge, AI experiments' },
  { key: 'learning', value: 'Agent architectures, system design, product thinking' },
  { key: 'training_for', value: 'Half Marathon' },
  { key: 'thinking_about', value: 'How AI changes software development' },
  { key: 'side_quest', value: 'Trying not to redesign this portfolio every weekend' },
];

// ─── journey timeline ─────────────────────────────────────────────────────────

export type JourneyIconId =
  | 'graduation'
  | 'rocket'
  | 'bank'
  | 'code'
  | 'sparkles'
  | 'globe';

export interface JourneyMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  icon: JourneyIconId;
  isPresent?: boolean;
}

export const journeyMilestones: JourneyMilestone[] = [
  {
    id: 'first-commit',
    year: '2019',
    title: 'First Commit',
    description:
      'Started my computer science journey with curiosity, late nights, and a lot of debugging.',
    icon: 'graduation',
  },
  {
    id: 'first-internships',
    year: '2021',
    title: 'First Internships',
    description:
      'Explored the real world of tech, built small things, and learned big lessons.',
    icon: 'rocket',
  },
  {
    id: 'jpmc-intern',
    year: 'May 2023',
    title: 'JPMC Intern',
    description:
      'Dove into backend systems, worked on meaningful financial products, and learned how enterprise engineering works.',
    icon: 'bank',
  },
  {
    id: 'jpmc-se',
    year: 'Jun 2023 – Aug 2025',
    title: 'Software Engineer @ JPMC',
    description:
      'Owned, shipped, scaled, and learned what real production impact feels like.',
    icon: 'code',
  },
  {
    id: 'rapid-circle',
    year: 'Mar 2026 – Present',
    title: 'Cloud & AI Engineer @ Rapid Circle',
    description:
      'Building AI systems, automations, and internal platforms with purpose.',
    icon: 'sparkles',
    isPresent: true,
  },
  {
    id: 'whats-next',
    year: 'Next →',
    title: "What's Next?",
    description:
      "Forward deployed roles. Global impact. Building what's next.",
    icon: 'globe',
  },
];

export const journeyQuote =
  "It's not about having it all figured out. It's about staying curious and building anyway.";
