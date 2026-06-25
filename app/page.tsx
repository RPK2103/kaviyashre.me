import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { CapabilityGraphSection } from '@/components/sections/CapabilityGraphSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { BeyondSection } from '@/components/sections/BeyondSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { FieldNotesSection } from '@/components/sections/FieldNotesSection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <CapabilityGraphSection />
        <ExperienceSection />
        <BeyondSection />
        <ProjectsSection />
        <FieldNotesSection />
        {/* <ContactSection />  — Phase 8 */}
      </main>
    </>
  );
}
