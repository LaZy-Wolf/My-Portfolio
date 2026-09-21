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
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Zap } from 'lucide-react';

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
  const [easterEggActive, setEasterEggActive] = useState(false);

  useEffect(() => {
    const handleOpen = () => setCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', handleOpen);
    return () => window.removeEventListener('open-command-palette', handleOpen);
  }, []);

  // Easter Egg keyboard shortcut: press `~` (backtick/tilde)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        setEasterEggActive((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Section visibility mapping from settings
  const isVisible = (sectionId: string) => {
    const found = settings?.sections?.find((s) => s.id === sectionId);
    return found ? found.visible : true;
  };

  return (
    <div className={`min-h-[100dvh] flex flex-col bg-substrate text-white transition-colors duration-500 ${easterEggActive ? 'matrix-overclock ring-1 ring-terminal' : ''}`}>
      {/* Easter Egg Overlay Banner */}
      {easterEggActive && (
        <div className="bg-terminal text-black font-mono text-[11px] font-black uppercase tracking-widest py-1 px-4 text-center sticky top-0 z-[100] flex items-center justify-center gap-2 animate-pulse">
          <Zap className="w-3.5 h-3.5 fill-black" />
          <span>[ OVERCLOCK PROTOCOL ACTIVE // HIGH FREQUENCY MATRIX TELEMETRY // PRESS ~ TO EXIT ]</span>
          <Zap className="w-3.5 h-3.5 fill-black" />
        </div>
      )}

      {/* Desktop Custom Cursor */}
      <CustomCursor />

      <Navbar
        name={profile.name}
        role={easterEggActive ? 'OVERCLOCKED ARCHITECT' : profile.role}
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
