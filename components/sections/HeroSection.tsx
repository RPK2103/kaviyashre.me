'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Download } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { AnimatedTitle } from '@/components/motion/AnimatedTitle';
import { staggerContainer, fadeInUp, fadeInRight } from '@/lib/animations';
import { profile } from '@/data/profile';

/* Navbar is h-16 (64px / 4rem) — offset so hero fills the remaining viewport */
const NAVBAR_H = '4rem';

export function HeroSection() {
  return (
    <section
      id="home"
      aria-label="Hero"
      style={{ minHeight: `calc(100vh - ${NAVBAR_H})` }}
      className="relative mt-16 flex scroll-mt-20 items-center overflow-hidden"
    >
      {/* Ambient radial gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10
          bg-[radial-gradient(ellipse_70%_55%_at_65%_45%,var(--color-accent-muted),transparent)]
          dark:bg-[radial-gradient(ellipse_60%_50%_at_68%_40%,color-mix(in_srgb,var(--color-accent)_8%,transparent),transparent)]"
      />

      <Container className="py-10 lg:py-12">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-8 xl:gap-12">

          {/* ── Left: Text ─────────────────────────────────────────────── */}
          <motion.div
            className="flex flex-col gap-0 text-center lg:text-left"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Name headline */}
            <motion.h1
              variants={fadeInUp}
              className="mb-4 font-bold tracking-[-0.02em] text-foreground leading-[1.08]
                text-[clamp(2.6rem,5.5vw,3.5rem)]"
            >
              {profile.name}
            </motion.h1>

            {/* Rotating role */}
            <motion.div
              variants={fadeInUp}
              className="mb-4 flex flex-wrap items-baseline justify-center gap-x-1.5 lg:justify-start"
            >
              <span className="text-lg font-medium text-foreground-secondary sm:text-xl">
                I&apos;m an
              </span>
              <AnimatedTitle
                titles={profile.roles}
                className="text-lg font-semibold text-accent sm:text-xl"
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              variants={fadeInUp}
              className="mx-auto mb-7 max-w-[30rem] text-[0.95rem] leading-[1.65] text-foreground-secondary
                sm:text-base lg:mx-0"
            >
              {profile.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            >
              <Button
                variant="primary"
                size="md"
                href={profile.projectsHref}
                aria-label="View my projects"
              >
                View Projects
                <ArrowRight className="h-[15px] w-[15px]" strokeWidth={2.2} />
              </Button>

              <Button
                variant="outline"
                size="md"
                href={profile.resumeUrl}
                download="Kaviyashre_Ragupathy_Resume.pdf"
                aria-label="Download my resume as PDF"
              >
                <Download className="h-[15px] w-[15px]" strokeWidth={2.2} />
                Download Resume
              </Button>
            </motion.div>
          </motion.div>

          {/* ── Right: Profile image ──────────────────────────────────── */}
          <motion.div
            className="flex items-center justify-center lg:justify-center"
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
          >
            <ProfileImage />
          </motion.div>

        </div>
      </Container>
    </section>
  );
}

/*
 * Desktop: 280px image + soft halo field
 * Tablet:  260px image
 * Mobile:  220px image
 */
function ProfileImage() {
  const reduced = useReducedMotion();

  return (
    <div
      className="group relative flex h-[270px] w-[270px] items-center justify-center
        sm:h-[316px] sm:w-[316px] lg:h-[340px] lg:w-[340px]"
    >
      {/* Atmospheric radial gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full opacity-75 transition-opacity duration-300 group-hover:opacity-100
          bg-[radial-gradient(circle_at_50%_52%,color-mix(in_srgb,var(--color-accent-soft)_26%,transparent)_0%,color-mix(in_srgb,var(--color-accent)_10%,transparent)_40%,transparent_72%)]
          dark:bg-[radial-gradient(circle_at_50%_52%,color-mix(in_srgb,#8b5cf6_20%,transparent)_0%,color-mix(in_srgb,#6366f1_10%,transparent)_42%,transparent_74%)]"
      />

      {/* Blurred glow layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl
          h-[205px] w-[205px] opacity-55 transition-opacity duration-300 group-hover:opacity-80
          sm:h-[245px] sm:w-[245px] lg:h-[265px] lg:w-[265px]
          bg-[color-mix(in_srgb,var(--color-accent-soft)_32%,transparent)]
          dark:bg-[color-mix(in_srgb,#7c3aed_24%,transparent)] dark:opacity-45 dark:group-hover:opacity-70"
      />

      {/* Outer halo ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full border border-accent/[0.06] transition-[border-color,opacity] duration-300
          group-hover:border-accent/[0.10] dark:border-accent/[0.05] dark:group-hover:border-accent/[0.09]
          h-[256px] w-[256px] sm:h-[300px] sm:w-[300px] lg:h-[320px] lg:w-[320px]"
      />

      {/* Inner halo ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute rounded-full border border-accent/[0.10] transition-[border-color] duration-300
          group-hover:border-accent/[0.14] dark:border-accent/[0.08] dark:group-hover:border-accent/[0.12]
          h-[246px] w-[246px] sm:h-[290px] sm:w-[290px] lg:h-[310px] lg:w-[310px]"
      />

      <motion.div
        className="relative will-change-transform"
        animate={reduced ? undefined : { y: [0, -6, 0] }}
        transition={
          reduced
            ? undefined
            : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <motion.div
          className="relative overflow-hidden rounded-full
            ring-1 ring-accent/18 ring-offset-2 ring-offset-background
            transition-[box-shadow,ring-color] duration-300
            group-hover:ring-accent/28 dark:ring-accent/10 dark:group-hover:ring-accent/16
            h-[220px] w-[220px] sm:h-[260px] sm:w-[260px] lg:h-[280px] lg:w-[280px]"
          whileHover={reduced ? undefined : { scale: 1.02 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {/* Gradient placeholder */}
          <div
            aria-hidden
            className="absolute inset-0 z-0 flex items-end justify-center pb-6
              bg-gradient-to-br from-accent-muted via-secondary-muted to-background-subtle"
          >
            <span className="select-none text-4xl font-bold tracking-tight text-foreground-secondary opacity-35">
              KR
            </span>
          </div>

          <Image
            src={profile.imageUrl}
            alt={`${profile.name} — profile photo`}
            fill
            sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 280px"
            className="z-10 scale-[1.08] object-cover object-[50%_42%]"
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
