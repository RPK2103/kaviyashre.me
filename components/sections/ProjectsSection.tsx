'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ProjectShowcaseCard } from '@/components/projects/ProjectShowcaseCard';
import { ProjectCaseStudyModal } from '@/components/projects/ProjectCaseStudyModal';
import { projectsData, type ProjectData } from '@/data/projects';
import { fadeInUp, SECTION_VIEWPORT } from '@/lib/animations';
import { SECTION_PY } from '@/lib/constants';

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
        className="relative scroll-mt-20 overflow-x-hidden bg-[var(--background)]"
      >
        {/* Top rule — matches ExperienceSection pattern */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-[var(--border-subtle)]"
          aria-hidden="true"
        />

        <Container className={SECTION_PY}>

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
            viewport={SECTION_VIEWPORT}
          >
            <SectionHeader
              eyebrow="Selected Builds"
              title="Projects"
              subtitle="AI systems, backend platforms, cloud-native tools, and automation workflows — built with product thinking, engineering depth, and execution ownership."
              headingId="projects-heading"
            />
          </motion.div>

          {/* ── Project cards ──────────────────────────────────────────────── */}
          <motion.div
            className="flex flex-col gap-5 lg:gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {featuredProjects.map((project) => (
              <ProjectShowcaseCard
                key={project.id}
                project={project}
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
