// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

// ─── Skills ───────────────────────────────────────────────────────────────────

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type SkillCategory =
  | 'language'
  | 'framework'
  | 'ai-ml'
  | 'cloud'
  | 'database'
  | 'tooling'
  | 'other';

export interface Skill {
  name: string;
  category: SkillCategory;
  level?: SkillLevel;
  icon?: string;
}

// ─── Work Experience ──────────────────────────────────────────────────────────

export interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate: string | 'Present';
  location: string;
  description: string;
  highlights: string[];
  technologies: string[];
  logoUrl?: string;
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export type ProjectStatus = 'live' | 'in-progress' | 'archived';

export type ProjectCategory = 'ai' | 'fullstack' | 'frontend' | 'backend' | 'tooling';

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  status: ProjectStatus;
  category: ProjectCategory;
  tags: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  hasCaseStudy: boolean;
}

// ─── Case Studies ─────────────────────────────────────────────────────────────

export type CaseStudySectionType =
  | 'overview'
  | 'problem'
  | 'solution'
  | 'architecture'
  | 'challenges'
  | 'results'
  | 'learnings';

export interface CaseStudySection {
  type: CaseStudySectionType;
  title: string;
  content: string;
  imageUrl?: string;
  metrics?: { label: string; value: string }[];
}

// ─── Certifications ───────────────────────────────────────────────────────────

export interface Certification {
  title: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
  credentialUrl?: string;
  badgeUrl?: string;
}
