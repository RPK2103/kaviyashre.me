export const SITE_URL = 'https://kaviyashre.me';
export const SITE_NAME = 'Kaviyashre Ragupathy';
export const SITE_TITLE = 'Kaviyashre Ragupathy — Software Engineer';
export const SITE_DESCRIPTION =
  'Software Engineer specializing in AI engineering, full-stack development, and product-minded solutions. Explore projects, career highlights, and technical writing.';

// TODO: update with verified handles before launch
export const SOCIAL_LINKS = {
  github: 'https://github.com/RPK2103',
  linkedin: 'https://linkedin.com/in/kaviyashre-ragupathy-2103',
  email: 'mailto:kaviyashreragupathy@gmail.com',
} as const;

export const NAV_ITEMS = [
  { label: 'Home',       href: '/#home',        comingSoon: false },
  { label: 'About',      href: '/#about',       comingSoon: false },
  { label: 'Skills',     href: '/#skills',      comingSoon: false },
  { label: 'Experience', href: '/#experience',  comingSoon: false },
  { label: 'Beyond',     href: '/#beyond',      comingSoon: false },
  { label: 'Projects',   href: '/#projects',    comingSoon: false },
  { label: 'Blogs',      href: '/#field-notes', comingSoon: false },
  { label: 'Contact',    href: '/#contact',     comingSoon: false },
] as const;

/** Section ids observed for scroll-spy active nav state. */
export const NAV_SECTION_IDS = NAV_ITEMS.filter((item) => !item.comingSoon).map(
  (item) => item.href.replace('/#', ''),
);

export const OG_IMAGE = `${SITE_URL}/og-image.png`;
