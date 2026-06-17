import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';

/*
 * Phase 1: Hero only.
 * Future sections are imported here as they are built:
 *   import { AboutSection }      from '@/components/sections/AboutSection';
 *   import { ExperienceSection } from '@/components/sections/ExperienceSection';
 *   import { ProjectsSection }   from '@/components/sections/ProjectsSection';
 *   import { ContactSection }    from '@/components/sections/ContactSection';
 */

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        {/* <AboutSection />      — Phase 2 */}
        {/* <ExperienceSection /> — Phase 3 */}
        {/* <ProjectsSection />   — Phase 4 */}
        {/* <ContactSection />    — Phase 5 */}
      </main>
    </>
  );
}
