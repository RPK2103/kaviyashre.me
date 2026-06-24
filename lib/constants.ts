export const SITE_URL = 'https://kaviyashre.me';
export const SITE_NAME = 'Kaviyashre Ragupathy';
export const SITE_TITLE = 'Kaviyashre Ragupathy — Software Engineer';
export const SITE_DESCRIPTION =
  'Software Engineer specializing in AI engineering, full-stack development, and product-minded solutions. Explore projects, career highlights, and technical writing.';

// TODO: update with verified handles before launch
export const SOCIAL_LINKS = {
  github: 'https://github.com/kaviyashre',
  linkedin: 'https://linkedin.com/in/kaviyashre',
  email: 'mailto:hello@kaviyashre.me',
} as const;

export const NAV_ITEMS = [
  { label: 'About',      href: '/#about',      comingSoon: true  },
  { label: 'Experience', href: '/#experience', comingSoon: false },
  { label: 'Projects',   href: '/#projects',   comingSoon: true  },
  { label: 'Contact',    href: '/#contact',    comingSoon: true  },
] as const;

export const OG_IMAGE = `${SITE_URL}/og-image.png`;
