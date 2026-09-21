import Image from 'next/image';
import type { IProfile } from '@/models/Profile';
import { Terminal, Briefcase, GraduationCap, Award, CheckCircle2, ArrowUpRight, Phone, Mail } from 'lucide-react';

interface AboutSectionProps {
  profile: IProfile;
}

export function AboutSection({ profile }: AboutSectionProps) {
  const experiences = profile.experience && profile.experience.length > 0 ? profile.experience : [
    {
      role: 'GenAI Full-Stack Engineer Intern',
      company: 'Allcognix AI',
      location: 'Remote (India)',
      period: 'Nov 2025 – Present',
      points: [
        'Built and shipped 4+ production AI products end-to-end across sales automation, automated software QA, financial operations and an AI-native CRM, consolidating manual multi-tool workflows into single AI-driven platforms.',
        'Deliver full-stack features that integrate LLMs into FastAPI backends and React/Next.js frontends, using PostgreSQL for persistence and Redis for caching.',
        'Design LLM-powered agentic workflows with LangGraph/LangChain that automate enterprise operations and cut manual effort.',
        'Collaborate in an agile team to take AI features from prototype to reliable, scalable production deployments.',
      ],
    },
  ];

  const educations = profile.education && profile.education.length > 0 ? profile.education : [
    {
      degree: 'B.Tech, Computer Science and Engineering (Artificial Intelligence & Machine Learning)',
      institution: 'Malla Reddy University, Hyderabad',
      period: '2022 – Jun 2026',
      cgpa: '8.6 / 10.0',
      coursework: 'Artificial Intelligence, Machine Learning, Deep Learning, Cloud Computing',
    },
  ];

  const achievements = profile.achievements && profile.achievements.length > 0 ? profile.achievements : [
    '2nd Prize, National Hackathon, Malla Reddy University (GenAI chatbot)',
    'Second-Round Qualifier, Google GRID Hackathon',
    'Participant & Innovator, Bolt AI Hackathon',
  ];

  const certifications = profile.certifications && profile.certifications.length > 0 ? profile.certifications : [
    'Google Cloud Computing Certification (GDSC, 2024)',
    'Programming in Java (NPTEL, 2024)',
  ];

  return (
    <section id="about" className="border-b border-telemetry-border px-4 sm:px-8 py-16 sm:py-20 max-w-7xl mx-auto w-full space-y-12">
      {/* Section Header */}
      <div className="border-b border-telemetry-border/40 pb-4">
        <span className="telemetry-tag text-signal font-bold">
          [ SECTOR 04 // IDENTITY, EXPERIENCE & TRACK RECORD ]
        </span>
        <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
          Architectural Manifesto & Career Telemetry
        </h2>
      </div>

      {/* Blueprint Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Avatar & Meta Data (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {profile.avatarUrl && (
            <div className="relative aspect-square w-full border border-telemetry-border bg-substrate-surface overflow-hidden">
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                fill
                className="object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 1024px) 100vw, 33vw"
                unoptimized={profile.avatarUrl.startsWith('data:')}
              />
              <div className="absolute bottom-2 left-2 bg-substrate/90 border border-telemetry-border px-2 py-0.5 text-[10px] font-mono text-white">
                OPERATOR // {profile.name.toUpperCase()}
              </div>
            </div>
          )}

          <div className="border border-telemetry-border bg-substrate-surface p-5 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-telemetry-border/40 pb-2">
              <span className="text-telemetry-muted">LOCATION:</span>
              <span className="text-white font-bold">{profile.location || 'HYDERABAD, INDIA'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-telemetry-border/40 pb-2">
              <span className="text-telemetry-muted">AVAILABILITY:</span>
              <span className="text-terminal font-bold">{profile.availability}</span>
            </div>
            {profile.phone && (
              <div className="flex items-center justify-between border-b border-telemetry-border/40 pb-2">
                <span className="text-telemetry-muted flex items-center gap-1">
                  <Phone className="w-3 h-3 text-signal" />
                  PHONE:
                </span>
                <a
                  href={`tel:${profile.phone.replace(/[^0-9+]/g, '')}`}
                  className="text-white hover:text-signal transition-colors font-bold"
                >
                  {profile.phone}
                </a>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-telemetry-muted flex items-center gap-1">
                <Mail className="w-3 h-3 text-signal" />
                EMAIL:
              </span>
              <a
                href={`mailto:${profile.email}`}
                className="text-signal hover:underline truncate max-w-[190px]"
              >
                {profile.email}
              </a>
            </div>
          </div>

          {/* Social Network Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(profile.socials || {}).map(([key, url]) => {
              if (!url) return null;
              return (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-telemetry-border bg-substrate-surface p-3 hover:border-signal transition-colors flex items-center justify-between group"
                >
                  <span className="font-mono text-xs uppercase text-telemetry-muted group-hover:text-white transition-colors">
                    {key}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-telemetry-faint group-hover:text-signal transition-colors" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Column: Narrative, Experience, Education & Certs (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Main Bio Card */}
          <div className="border border-telemetry-border bg-substrate-surface p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-signal">
              <Terminal className="w-4 h-4" />
              <span>THE PRODUCTION DISCIPLINE</span>
            </div>
            <p className="text-sm sm:text-base font-mono text-telemetry-muted leading-relaxed whitespace-pre-line">
              {profile.longBio || profile.shortBio}
            </p>
          </div>

          {/* Manifesto Callout */}
          {profile.designPhilosophy && (
            <div className="border-l-2 border-signal bg-substrate-surface/60 p-6 space-y-3">
              <span className="telemetry-tag text-signal">
                [ MANIFESTO // ENGINEERING PHILOSOPHY ]
              </span>
              <blockquote className="text-sm sm:text-base font-mono text-white italic leading-relaxed">
                &ldquo;{profile.designPhilosophy}&rdquo;
              </blockquote>
            </div>
          )}

          {/* Industry Experience */}
          <div className="border border-telemetry-border bg-substrate-surface p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-telemetry-border/40 pb-3">
              <div className="flex items-center gap-2 text-xs font-mono text-white font-bold tracking-wider uppercase">
                <Briefcase className="w-4 h-4 text-signal" />
                <span>Production Work Experience</span>
              </div>
              <span className="text-[11px] font-mono text-terminal border border-terminal/30 bg-terminal/10 px-2 py-0.5">
                ACTIVE
              </span>
            </div>

            <div className="space-y-6">
              {experiences.map((exp, idx) => (
                <div key={idx} className="space-y-3 font-mono">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-white uppercase">
                        {exp.role}
                      </h4>
                      <div className="text-xs text-signal font-semibold">
                        {exp.company} &bull; <span className="text-telemetry-muted">{exp.location}</span>
                      </div>
                    </div>
                    <span className="text-[11px] text-telemetry-muted border border-telemetry-border px-2 py-0.5 bg-substrate">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs text-telemetry-muted leading-relaxed pt-1">
                    {exp.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <span className="text-signal font-bold mt-0.5">&gt;</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education & Academic Rigor */}
          <div className="border border-telemetry-border bg-substrate-surface p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-mono text-white font-bold tracking-wider uppercase border-b border-telemetry-border/40 pb-3">
              <GraduationCap className="w-4 h-4 text-signal" />
              <span>Academic Engineering Foundation</span>
            </div>

            <div className="space-y-4 font-mono">
              {educations.map((edu, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-sm font-bold text-white uppercase">
                      {edu.degree}
                    </h4>
                    <span className="text-[11px] text-telemetry-muted border border-telemetry-border px-2 py-0.5 bg-substrate">
                      {edu.period}
                    </span>
                  </div>
                  <div className="text-xs text-signal">
                    {edu.institution}
                  </div>
                  <div className="inline-block text-[11px] text-terminal border border-terminal/30 bg-terminal/10 px-2.5 py-0.5 font-bold">
                    CGPA: {edu.cgpa}
                  </div>
                  {edu.coursework && (
                    <div className="text-xs text-telemetry-muted pt-1">
                      <span className="text-white font-semibold">Key Coursework:</span> {edu.coursework}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dual Grid: Achievements & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hackathons & Honors */}
            <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-white font-bold uppercase tracking-wider border-b border-telemetry-border/40 pb-2">
                <Award className="w-4 h-4 text-signal" />
                <span>Honors & Hackathons</span>
              </div>
              <ul className="space-y-2.5 font-mono text-xs text-telemetry-muted">
                {achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-signal font-bold mt-0.5">&bull;</span>
                    <span className="leading-snug text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Certifications */}
            <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs font-mono text-white font-bold uppercase tracking-wider border-b border-telemetry-border/40 pb-2">
                <CheckCircle2 className="w-4 h-4 text-terminal" />
                <span>Certifications</span>
              </div>
              <ul className="space-y-2.5 font-mono text-xs text-telemetry-muted">
                {certifications.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-terminal font-bold mt-0.5">&bull;</span>
                    <span className="leading-snug text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
