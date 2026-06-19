import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { CapabilityGraphSection } from '@/components/sections/CapabilityGraphSection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <CapabilityGraphSection />
        {/* <ExperienceSection /> — Phase 4 */}
        {/* <ProjectsSection />   — Phase 5 */}
        {/* <ContactSection />    — Phase 6 */}
      </main>
    </>
  );
}
