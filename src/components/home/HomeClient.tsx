'use client';

import { useState, useEffect } from 'react';
import type { IProfile } from '@/models/Profile';
import type { IProject } from '@/models/Project';
import type { ISkill } from '@/models/Skill';
import type { ISettings } from '@/models/Settings';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/home/Hero';
import { FeaturedProjects } from '@/components/home/FeaturedProjects';
import { ProjectGrid } from '@/components/home/ProjectGrid';
import { AboutSection } from '@/components/home/AboutSection';
import { SkillsMarquee } from '@/components/home/SkillsMarquee';
import { ContactSection } from '@/components/home/ContactSection';
import { Footer } from '@/components/layout/Footer';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { AssistantOrb } from '@/components/ai/AssistantOrb';

interface HomeClientProps {
  profile: IProfile;
  projects: IProject[];
  skills: ISkill[];
  settings: ISettings;
}

export function HomeClient({
  profile,
  projects,
  skills,
  settings,
}: HomeClientProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', handleOpen);
    return () => window.removeEventListener('open-command-palette', handleOpen);
  }, []);

  // Section visibility mapping from settings
  const isVisible = (sectionId: string) => {
    const found = settings?.sections?.find((s) => s.id === sectionId);
    return found ? found.visible : true;
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-substrate text-white">
      <Navbar
        name={profile.name}
        role={profile.role}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      <main className="flex-1 flex flex-col">
        {isVisible('hero') && <Hero profile={profile} settings={settings} />}

        {isVisible('featured-projects') && (
          <FeaturedProjects projects={projects} />
        )}

        {isVisible('projects') && <ProjectGrid projects={projects} />}

        {isVisible('about') && <AboutSection profile={profile} />}

        {isVisible('skills') && <SkillsMarquee skills={skills} />}

        {isVisible('contact') && <ContactSection profile={profile} />}
      </main>

      <Footer settings={settings} name={profile.name} />

      {/* Interactive Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        projects={projects}
      />

      {/* Floating AI Digital Twin Assistant */}
      {settings?.ai?.enabled && (
        <AssistantOrb
          greeting={settings.ai.greeting}
          fallbackMessage={settings.ai.fallbackMessage}
        />
      )}
    </div>
  );
}
