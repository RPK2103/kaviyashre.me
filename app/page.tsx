import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { CapabilityGraphSection } from '@/components/sections/CapabilityGraphSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { BeyondSection } from '@/components/sections/BeyondSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { FieldNotesSection } from '@/components/sections/FieldNotesSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/layout/Footer';

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
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
