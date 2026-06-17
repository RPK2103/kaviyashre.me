export const profile = {
  name: 'Kaviyashre Ragupathy',
  firstName: 'Kaviyashre',
  roles: [
    'AI Engineer',
    'Backend Engineer',
    'Cloud Engineer',
    'Applied AI Builder',
  ] as const,
  tagline:
    'I build AI-powered systems, backend platforms, and cloud-native products with strong engineering depth and product thinking.',
  location: 'United Kingdom',
  email: 'hello@kaviyashre.me',
  resumeUrl: '/resume.pdf',
  projectsHref: '/#projects',
  imageUrl: '/images/profile.jpg',
} as const;

export type Profile = typeof profile;
