// ─── Beyond 9-5 panel data ───────────────────────────────────────────────────

export interface BeyondPanel {
  id: string;
  title: string;
  caption: string;
  imagePath: string;
  /** CSS gradient string used as a fallback when the image is absent */
  placeholderGradient: string;
}

export const beyondPanels: BeyondPanel[] = [
  {
    id: 'dance',
    title: 'Dance',
    caption:
      'Discipline, rhythm, expression — the side of me that learned precision before code.',
    imagePath: '/images/beyond/dance.png',
    placeholderGradient:
      'linear-gradient(160deg, #7c3460 0%, #4a1942 55%, #1a0f2a 100%)',
  },
  {
    id: 'fitness',
    title: 'Fitness & Yoga',
    caption:
      'Training strength, mobility, and consistency one session at a time.',
    imagePath: '/images/beyond/fitness.png',
    placeholderGradient:
      'linear-gradient(160deg, #1a5e52 0%, #0f3d35 55%, #071f1a 100%)',
  },
  {
    id: 'running',
    title: 'Running',
    caption:
      'Building endurance, patience, and the ability to keep moving through discomfort.',
    imagePath: '/images/beyond/running.png',
    placeholderGradient:
      'linear-gradient(160deg, #b84a1a 0%, #7a2e0e 55%, #3d1506 100%)',
  },
  {
    id: 'reading',
    title: 'Reading',
    caption: 'Books, essays, and rabbit holes that sharpen how I think.',
    imagePath: '/images/beyond/reading.png',
    placeholderGradient:
      'linear-gradient(160deg, #1e3a7a 0%, #172a5c 55%, #0e1a3d 100%)',
  },
  {
    id: 'driving',
    title: 'Driving',
    caption:
      'Some of my best ideas arrive somewhere between the destination and the drive itself.',
    imagePath: '/images/beyond/driving.png',
    placeholderGradient:
      'linear-gradient(160deg, #1c3d2e 0%, #122b1e 55%, #081510 100%)',
  },
  {
    id: 'exploration',
    title: 'Exploration',
    caption:
      'New places, hackathons, conversations, and experiences — I enjoy putting myself in environments where there\'s always something new to learn.',
    imagePath: '/images/beyond/side-quests.png',
    placeholderGradient:
      'linear-gradient(160deg, #0e4d5e 0%, #0a3245 55%, #050f1c 100%)',
  },
];
