'use client';

import { motion } from 'framer-motion';
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
      aria-label="Hero"
      style={{ minHeight: `calc(100vh - ${NAVBAR_H})` }}
      className="relative mt-16 flex items-center overflow-hidden"
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
            {/* Eyebrow */}
            <motion.p
              variants={fadeInUp}
              className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent"
            >
              Software Engineer
            </motion.p>

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
 * Desktop: 280px image, inner halo at 308px, outer halo at 340px
 * Tablet:  260px image, inner halo at 286px, outer halo at 316px
 * Mobile:  220px image, inner halo at 244px, outer halo at 270px
 */
function ProfileImage() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer halo ring */}
      <div
        aria-hidden
        className="absolute rounded-full border border-accent/18 dark:border-accent/8
          h-[270px] w-[270px]
          sm:h-[316px] sm:w-[316px]
          lg:h-[340px] lg:w-[340px]"
      />
      {/* Inner halo ring */}
      <div
        aria-hidden
        className="absolute rounded-full border border-accent/30 dark:border-accent/12
          h-[244px] w-[244px]
          sm:h-[286px] sm:w-[286px]
          lg:h-[308px] lg:w-[308px]"
      />

      {/* Soft glow */}
      <div
        aria-hidden
        className="absolute rounded-full bg-accent/10 dark:bg-accent/5 blur-2xl
          h-[200px] w-[200px]
          sm:h-[240px] sm:w-[240px]
          lg:h-[260px] lg:w-[260px]"
      />

      {/* Circular photo frame */}
      <div
        className="relative overflow-hidden rounded-full
          ring-2 ring-accent/25 dark:ring-accent/15 ring-offset-4 ring-offset-background
          h-[220px] w-[220px]
          sm:h-[260px] sm:w-[260px]
          lg:h-[280px] lg:w-[280px]"
      >
        {/* Gradient placeholder */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-end justify-center pb-6
            bg-gradient-to-br from-accent-muted via-secondary-muted to-background-subtle"
        >
          <span className="select-none text-4xl font-bold tracking-tight text-foreground-secondary opacity-35">
            KR
          </span>
        </div>

        {/* Profile photo — sits above gradient when present */}
        <Image
          src={profile.imageUrl}
          alt={`${profile.name} — profile photo`}
          fill
          sizes="(max-width: 640px) 220px, (max-width: 1024px) 260px, 280px"
          className="relative z-10 object-cover object-center"
          priority
        />
      </div>
    </div>
  );
}
