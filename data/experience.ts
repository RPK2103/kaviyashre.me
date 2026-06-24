// ─── Experience data ──────────────────────────────────────────────────────────

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  summary: string;
  bullets: string[];
  tech: string[];
  growth: string;
  logoUrl: string;
  logoFallback: string;
}

export const experienceData: ExperienceItem[] = [
  {
    id: 'rapid-circle',
    company: 'Rapid Circle',
    role: 'Cloud & AI Engineer',
    startDate: 'Mar 2026',
    endDate: 'Present',
    location: 'Pune / Bangalore Hybrid',
    summary:
      'Building cloud, AI, and automation solutions across Microsoft ecosystem and pro-code engineering tracks.',
    bullets: [
      'Built and explored Azure-first engineering solutions across Functions, Storage, Monitor, and Power Platform.',
      'Worked on internal systems across Power Apps, backend APIs, async workers, and real-time updates.',
      'Contributed to AI automation and Copilot Studio solution planning for business process orchestration.',
      'Transitioned into Microsoft cloud and applied AI consulting with a product-engineering mindset.',
    ],
    tech: ['Azure', 'Power Platform', 'FastAPI', 'Azure Functions', 'Service Bus', 'PostgreSQL', 'Copilot Studio'],
    growth:
      'Expanding from backend engineering into cloud-native AI solution design and enterprise automation.',
    logoUrl: '/logos/rapid-circle-logo.jpg',
    logoFallback: 'RC',
  },
  {
    id: 'jpmc-fte',
    company: 'J.P. Morgan Chase',
    role: 'Software Engineer / Technology Analyst',
    startDate: 'Jun 2023',
    endDate: 'Aug 2025',
    location: 'Bengaluru',
    summary:
      'Worked on production-grade financial calculation systems in Asset & Wealth Management.',
    bullets: [
      'Contributed to GWM calculator systems involving R, Java services, REST APIs, SQL, Jenkins, and Kubernetes.',
      'Worked on performance and accuracy improvements for portfolio returns, benchmarks, reporting, and calculator flows.',
      'Owned and supported production-critical daily reporting workflows.',
      'Participated in engineering committee initiatives and led large-scale SEP community events.',
    ],
    tech: ['Java', 'Spring Boot', 'R', 'REST APIs', 'SQL', 'Jenkins', 'Kubernetes', 'BDD'],
    growth:
      'Grew from feature delivery into ownership of production-sensitive financial engineering workflows.',
    logoUrl: '/logos/jpmc-logo.jpg',
    logoFallback: 'JPM',
  },
  {
    id: 'jpmc-intern',
    company: 'J.P. Morgan Chase',
    role: 'Software Engineer Intern',
    startDate: 'Feb 2023',
    endDate: 'May 2023',
    location: 'Bengaluru',
    summary:
      'Contributed to backend services, testing workflows, and financial calculation platform improvements.',
    bullets: [
      'Worked on calculator cleanup and backend service enhancements.',
      'Created BDD feature files and supported Jenkins proof-of-concept work.',
      'Built and tested REST service flows for performance and benchmark calculations.',
    ],
    tech: ['Java', 'R', 'REST APIs', 'Jenkins', 'BDD'],
    growth:
      'Built the foundation for moving from intern-level execution to full-time engineering ownership.',
    logoUrl: '/logos/jpmc-logo.jpg',
    logoFallback: 'JPM',
  },
];
