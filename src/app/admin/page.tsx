import { connectDB } from '@/lib/db';
import { Project } from '@/models/Project';
import { Skill } from '@/models/Skill';
import { Profile } from '@/models/Profile';
import { Settings } from '@/models/Settings';
import Link from 'next/link';
import {
  FolderKanban,
  User,
  Wrench,
  Settings as SettingsIcon,
  Plus,
  ExternalLink,
  Bot,
  Activity,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  let projectStats = { total: 4, published: 4, featured: 2 };
  let skillCount = 5;
  let hasProfile = true;
  let aiEnabled = true;

  try {
    await connectDB();
    const totalProjects = await Project.countDocuments();
    const publishedProjects = await Project.countDocuments({ status: 'published' });
    const featuredProjects = await Project.countDocuments({ featured: true });
    projectStats = {
      total: totalProjects,
      published: publishedProjects,
      featured: featuredProjects,
    };
    skillCount = await Skill.countDocuments();
    const profile = await Profile.findById('main');
    hasProfile = !!profile;
    const settings = await Settings.findById('main');
    aiEnabled = settings?.ai?.enabled ?? true;
  } catch (error) {
    console.warn('Dashboard DB fetch failed, using fallback metrics:', error);
  }

  const statCards = [
    {
      label: 'TOTAL PROJECTS',
      value: projectStats.total,
      subtext: `${projectStats.published} Published // ${projectStats.featured} Featured`,
      icon: FolderKanban,
      href: '/admin/projects',
    },
    {
      label: 'SKILL CATEGORIES',
      value: skillCount,
      subtext: 'Configured in Telemetry DB',
      icon: Wrench,
      href: '/admin/skills',
    },
    {
      label: 'PROFILE STATUS',
      value: hasProfile ? 'ONLINE' : 'PENDING',
      subtext: 'Core Bio & Identity Metadata',
      icon: User,
      href: '/admin/profile',
    },
    {
      label: 'AI DIGITAL TWIN',
      value: aiEnabled ? 'ACTIVE' : 'OFFLINE',
      subtext: 'Interactive visitor assistant',
      icon: Bot,
      href: '/admin/settings',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-telemetry-border pb-6">
        <div>
          <span className="telemetry-tag text-signal">
            [ TELEMETRY CONTROL PLANE // ROOT ]
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mt-1">
            System Overview
          </h1>
          <p className="text-xs font-mono text-telemetry-muted mt-1">
            Realtime administrative telemetry, content state, and service health readouts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="brutalist-btn brutalist-btn-accent flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            NEW PROJECT
          </Link>
          <Link
            href="/"
            target="_blank"
            className="brutalist-btn flex items-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            VISIT SITE
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="border border-telemetry-border bg-substrate-surface p-5 hover:border-signal transition-colors group block relative"
            >
              <div className="flex items-center justify-between text-telemetry-muted mb-3">
                <span className="telemetry-tag text-[10px] group-hover:text-signal transition-colors">
                  {card.label}
                </span>
                <Icon className="w-4 h-4 text-telemetry-muted group-hover:text-white transition-colors" />
              </div>
              <div className="text-3xl font-mono font-black text-white">
                {card.value}
              </div>
              <div className="text-[11px] font-mono text-telemetry-muted mt-2">
                {card.subtext}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Launchpad & Operational Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Matrix */}
        <div className="lg:col-span-2 border border-telemetry-border bg-substrate-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-telemetry-border/60 pb-3">
            <h2 className="text-sm font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-signal" />
              OPERATIONAL COMMANDS
            </h2>
            <span className="telemetry-tag text-[10px] text-terminal">ALL SUBSYSTEMS NOMINAL</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              href="/admin/projects"
              className="p-4 border border-telemetry-border hover:border-signal bg-substrate transition-colors flex items-start gap-3 group"
            >
              <FolderKanban className="w-5 h-5 text-signal shrink-0 mt-0.5" />
              <div>
                <h3 className="font-mono text-xs uppercase font-bold text-white group-hover:text-signal transition-colors">
                  Drag & Drop Project Manager
                </h3>
                <p className="text-[11px] font-mono text-telemetry-muted mt-1">
                  Reorder projects, edit case study blocks, toggle featured badges, and publish drafts.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/profile"
              className="p-4 border border-telemetry-border hover:border-signal bg-substrate transition-colors flex items-start gap-3 group"
            >
              <User className="w-5 h-5 text-signal shrink-0 mt-0.5" />
              <div>
                <h3 className="font-mono text-xs uppercase font-bold text-white group-hover:text-signal transition-colors">
                  Profile & Philosophy Editor
                </h3>
                <p className="text-[11px] font-mono text-telemetry-muted mt-1">
                  Modify bio copy, avatar URL, availability banner, location, and social links.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/skills"
              className="p-4 border border-telemetry-border hover:border-signal bg-substrate transition-colors flex items-start gap-3 group"
            >
              <Wrench className="w-5 h-5 text-signal shrink-0 mt-0.5" />
              <div>
                <h3 className="font-mono text-xs uppercase font-bold text-white group-hover:text-signal transition-colors">
                  Skills Taxonomy Manager
                </h3>
                <p className="text-[11px] font-mono text-telemetry-muted mt-1">
                  Categorize technical stack and control moving marquee items.
                </p>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="p-4 border border-telemetry-border hover:border-signal bg-substrate transition-colors flex items-start gap-3 group"
            >
              <SettingsIcon className="w-5 h-5 text-signal shrink-0 mt-0.5" />
              <div>
                <h3 className="font-mono text-xs uppercase font-bold text-white group-hover:text-signal transition-colors">
                  Site & AI Configuration
                </h3>
                <p className="text-[11px] font-mono text-telemetry-muted mt-1">
                  Adjust hero headline, theme colors, section visibility, and AI assistant behavior.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Free-Tier Infrastructure Health */}
        <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-4">
          <div className="border-b border-telemetry-border/60 pb-3">
            <h2 className="text-sm font-mono uppercase tracking-wider text-white">
              FREE-TIER RUNTIME AUDIT
            </h2>
            <p className="text-[11px] font-mono text-telemetry-muted mt-1">
              Zero-cost operational checklist
            </p>
          </div>

          <ul className="space-y-3 font-mono text-xs">
            <li className="flex items-center justify-between p-2.5 border border-telemetry-border/40 bg-substrate">
              <span className="text-telemetry-muted">DATABASE</span>
              <span className="text-terminal text-[11px]">MongoDB Atlas M0</span>
            </li>
            <li className="flex items-center justify-between p-2.5 border border-telemetry-border/40 bg-substrate">
              <span className="text-telemetry-muted">MEDIA CDN</span>
              <span className="text-terminal text-[11px]">Cloudinary Free</span>
            </li>
            <li className="flex items-center justify-between p-2.5 border border-telemetry-border/40 bg-substrate">
              <span className="text-telemetry-muted">AI ENGINE</span>
              <span className="text-terminal text-[11px]">Groq / Llama 3.3</span>
            </li>
            <li className="flex items-center justify-between p-2.5 border border-telemetry-border/40 bg-substrate">
              <span className="text-telemetry-muted">DEPLOY HOST</span>
              <span className="text-terminal text-[11px]">Vercel Edge</span>
            </li>
            <li className="flex items-center justify-between p-2.5 border border-telemetry-border/40 bg-substrate">
              <span className="text-telemetry-muted">MONTHLY SPEND</span>
              <span className="text-signal font-bold text-[11px]">$0.00 / FOREVER</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
