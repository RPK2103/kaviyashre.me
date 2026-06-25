'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Mail, FileDown, Calendar, Link2, Code2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ImageReveal } from '@/components/contact/ImageReveal';
import { SOCIAL_LINKS, SECTION_PY } from '@/lib/constants';
import { profile } from '@/data/profile';
import { fadeInUp } from '@/lib/animations';
import { cn } from '@/lib/utils';

const CONTACT_EMAIL = 'kaviyashreragupathy@gmail.com';

/** Set to true when a calendar scheduling link is ready. */
const SHOW_SCHEDULE_SYNC = false;
const SCHEDULE_SYNC_URL = '#';

const socialItems = [
  { label: 'LinkedIn', href: SOCIAL_LINKS.linkedin, icon: Link2 },
  { label: 'GitHub', href: SOCIAL_LINKS.github, icon: Code2 },
] as const;

interface ContactRowProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  ariaLabel: string;
  download?: string;
}

function ContactRow({ href, icon, children, ariaLabel, download }: ContactRowProps) {
  return (
    <Link
      href={href}
      download={download}
      aria-label={ariaLabel}
      className={cn(
        'group flex items-center gap-3.5 rounded-xl py-1',
        'text-[15px] font-medium text-foreground',
        'transition-colors duration-200 hover:text-primary',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-ring focus-visible:ring-offset-2',
        'focus-visible:ring-offset-[var(--background-subtle)]',
      )}
    >
      <span
        className={cn(
          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
          'border border-border-subtle bg-surface/80',
          'text-primary transition-all duration-200',
          'group-hover:border-primary/30 group-hover:bg-accent-muted/50 group-hover:-translate-y-px',
        )}
        aria-hidden
      >
        {icon}
      </span>
      <span className="break-all sm:break-normal">{children}</span>
    </Link>
  );
}

export function ContactSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative scroll-mt-20 overflow-x-hidden bg-background"
    >
      <div
        className="absolute inset-x-0 top-0 h-px bg-border-subtle"
        aria-hidden="true"
      />

      <Container className={SECTION_PY}>
        <motion.article
          className={cn(
            'mx-auto w-[90%] max-w-[1180px] overflow-hidden rounded-[32px]',
            'border border-border-subtle',
            'bg-[linear-gradient(145deg,color-mix(in_srgb,var(--accent-muted)_55%,var(--surface-raised)),var(--surface-raised))]',
            'shadow-[0_2px_20px_-4px_rgba(121,84,101,0.12),0_1px_4px_rgba(30,27,24,0.04)]',
            'dark:bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface)_92%,var(--primary-muted)),var(--surface-raised))]',
            'dark:shadow-[0_4px_40px_-6px_rgba(139,92,246,0.22),0_8px_48px_-12px_rgba(0,0,0,0.45)]',
          )}
          variants={
            reduced
              ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
              : fadeInUp
          }
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          <div className="grid grid-cols-1 items-center gap-12 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-14 lg:py-16 xl:px-16">
            {/* ── Copy & links ─────────────────────────────────────────── */}
            <div className="flex flex-col">
              <SectionHeader
                eyebrow="Let's connect"
                title={
                  <>
                    Let&apos;s build
                    <br />
                    <span className="italic text-primary">together.</span>
                  </>
                }
                subtitle="I'm currently open to AI engineering, backend engineering, cloud engineering, and forward deployed engineering opportunities where product thinking and reliable systems matter."
                headingId="contact-heading"
                className="mb-0"
              />

              <div className="mt-8 flex flex-col gap-4 sm:mt-10">
                <ContactRow
                  href={`mailto:${CONTACT_EMAIL}`}
                  ariaLabel={`Send email to ${CONTACT_EMAIL}`}
                  icon={<Mail className="h-[18px] w-[18px]" strokeWidth={1.75} />}
                >
                  {CONTACT_EMAIL}
                </ContactRow>

                <ContactRow
                  href={profile.resumeUrl}
                  download="Kaviyashre_RP_Resume.pdf"
                  ariaLabel="Download resume as PDF"
                  icon={<FileDown className="h-[18px] w-[18px]" strokeWidth={1.75} />}
                >
                  Download Resume
                </ContactRow>

                {SHOW_SCHEDULE_SYNC && (
                  <ContactRow
                    href={SCHEDULE_SYNC_URL}
                    ariaLabel="Schedule a 15 minute sync"
                    icon={<Calendar className="h-[18px] w-[18px]" strokeWidth={1.75} />}
                  >
                    Schedule a 15m Sync
                  </ContactRow>
                )}
              </div>

              <div className="mt-10 border-t border-border-subtle pt-6">
                <nav aria-label="Social profiles">
                  <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    {socialItems.map(({ label, href, icon: Icon }) => (
                      <li key={label}>
                        <Link
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(
                            'inline-flex items-center gap-2 text-sm font-medium',
                            'text-foreground-secondary transition-colors duration-200',
                            'hover:text-primary',
                            'focus-visible:outline-none focus-visible:ring-2',
                            'focus-visible:ring-ring focus-visible:ring-offset-2',
                            'focus-visible:ring-offset-[var(--background-subtle)]',
                          )}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            {/* ── Editorial image card ───────────────────────────────────── */}
            <div className="flex justify-center lg:justify-end">
              <ImageReveal
                alt="Kaviyashre working at a desk — portrait photograph"
                className="lg:mr-2"
              />
            </div>
          </div>
        </motion.article>
      </Container>
    </section>
  );
}
