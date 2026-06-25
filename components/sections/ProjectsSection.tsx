'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { ProjectShowcaseCard } from '@/components/projects/ProjectShowcaseCard';
import { ProjectCaseStudyModal } from '@/components/projects/ProjectCaseStudyModal';
import { projectsData, type ProjectData } from '@/data/projects';
import { fadeInUp } from '@/lib/animations';

// ─── Featured projects ────────────────────────────────────────────────────────
//
// Only projects with `featured: true` are rendered. Set a project's `featured`
// field to true in data/projects.ts when it is ready to publish.
// The domain field on each project powers future filter-bar functionality —
// when a filter bar is added, map these slugs to display labels:
//   ai → "AI"  |  enterprise → "Enterprise"  |  automation → "Automation"
//   cloud → "Cloud"  |  backend → "Backend"
//
const featuredProjects = projectsData.filter((p) => p.featured);

// ─── Stagger container ────────────────────────────────────────────────────────

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

// ─── Section ──────────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const reduced = useReducedMotion();
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleOpenModal = useCallback((project: ProjectData) => {
    setActiveProject(project);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <>
      <section
        id="projects"
        aria-labelledby="projects-heading"
        className="relative overflow-x-hidden bg-[var(--background)]"
      >
        {/* Top rule — matches ExperienceSection pattern */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-[var(--border-subtle)]"
          aria-hidden="true"
        />

        <Container className="pt-20 pb-24 lg:pt-28 lg:pb-32">

          {/* ── Section header ────────────────────────────────────────────── */}
          <motion.div
            className="mb-14 max-w-2xl lg:mb-16"
            variants={
              reduced
                ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
                : fadeInUp
            }
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <p className="label-mono mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">
              Selected Builds
            </p>
            <h2
              id="projects-heading"
              className="font-display text-4xl font-semibold leading-none tracking-tight text-[var(--foreground)] sm:text-5xl"
            >
              Projects
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-[var(--foreground-secondary)]">
              AI systems, backend platforms, cloud-native tools, and automation
              workflows — built with product thinking, engineering depth, and
              execution ownership.
            </p>
          </motion.div>

          {/* ── Project cards ──────────────────────────────────────────────── */}
          <motion.div
            className="flex flex-col gap-5 lg:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {featuredProjects.map((project, i) => (
              <ProjectShowcaseCard
                key={project.id}
                project={project}
                index={i}
                onOpenModal={handleOpenModal}
              />
            ))}
          </motion.div>

        </Container>
      </section>

      {/* Modal rendered outside section to escape any stacking context */}
      <ProjectCaseStudyModal
        project={activeProject}
        onClose={handleCloseModal}
        triggerRef={triggerRef as React.RefObject<HTMLElement | null>}
      />
    </>
  );
}
