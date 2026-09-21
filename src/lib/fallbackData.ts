import type { IProfile } from '@/models/Profile';
import type { IProject } from '@/models/Project';
import type { ISkill } from '@/models/Skill';
import type { ISettings } from '@/models/Settings';

export const fallbackProfile: IProfile = {
  _id: 'main',
  name: 'Alex Vance',
  role: 'Staff Systems Designer & Full-Stack Architect',
  tagline: 'Designing high-concurrency architectures and tactical telemetry interfaces that scale.',
  shortBio: 'Specializing in distributed web systems, industrial brutalist frontend engineering, and high-density telemetry dashboards.',
  longBio: 'With a decade of experience bridging the gap between raw backend performance and uncompromising visual craft, I architect digital products that prioritize zero-latency responsiveness, modular determinism, and memorable interactive weight. From real-time telemetry systems to custom design engines, every project is engineered to withstand extreme scale while delivering an editorial, tactical user experience.',
  designPhilosophy: 'Form follows telemetry. We reject generic decorative consumer fluff in favor of visible modular compartmentalization, mathematical grid discipline, razor-thin 1px structures, and micro-physics feedback.',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  resumeUrl: '',
  email: 'alex.vance@telemetry.systems',
  location: 'Zurich / Remote [UTC+1]',
  availability: 'AVAILABLE FOR SELECT CONTRACTS // Q3-Q4',
  socials: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    dribbble: 'https://dribbble.com',
    behance: 'https://behance.net',
  },
};

export const fallbackProjects: IProject[] = [
  {
    _id: 'proj-1',
    title: 'Chronos Realtime Telemetry',
    slug: 'chronos-realtime-telemetry',
    summary: 'High-frequency metrics observation engine processing 400k events/sec with sub-millisecond HUD visualization.',
    role: 'Principal Architect & Frontend Lead',
    year: '2025',
    timeline: '8 Weeks',
    status: 'published',
    featured: true,
    order: 1,
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
    ],
    techStack: ['Next.js 15', 'TypeScript', 'Tailwind CSS', 'WebSockets', 'ClickHouse', 'Motion'],
    tags: ['Telemetry', 'High Concurrency', 'Industrial UI'],
    links: {
      live: 'https://example.com/chronos',
      repository: 'https://github.com/example/chronos',
    },
    metrics: [
      { label: 'Ingestion Throughput', value: '420,000 evt/s' },
      { label: 'Render Latency', value: '< 1.4ms' },
      { label: 'Memory Footprint', value: '-64% vs V1' },
    ],
    processSteps: [
      'Telemetry Protocol Specification',
      'Buffer Pool & WebSocket Gateway',
      'Canvas/DOM Telemetry Viewport',
      'Stress Testing under Synthetic Spikes',
    ],
    caseStudyBlocks: [
      {
        id: 'b1',
        type: 'heading',
        content: 'The High-Frequency Observation Challenge',
      },
      {
        id: 'b2',
        type: 'paragraph',
        content: 'Modern distributed infrastructure produces overwhelming volumes of telemetry data. Traditional consumer dashboard libraries collapse under continuous 60fps streaming updates due to catastrophic React state re-render cascades. Chronos was architected to solve this with direct memory buffers and decoupled rendering pipelines.',
      },
      {
        id: 'b3',
        type: 'quote',
        quote: 'Chronos reduced our mean-time-to-detection from minutes to instant visual anomalies.',
        author: 'Infrastructure Lead, Apex Cloud',
      },
      {
        id: 'b4',
        type: 'metric',
        label: 'Telemetry Processing Velocity',
        value: '420,000 evt/s',
      },
      {
        id: 'b5',
        type: 'paragraph',
        content: 'By replacing standard SVG charts with a custom WebGL and CSS Grid telemetry matrix, DOM reflows were eradicated. The interface maintains a rock-solid 120Hz refresh rate even during cascading failover simulations.',
      },
    ],
  },
  {
    _id: 'proj-2',
    title: 'Krypton Industrial Design System',
    slug: 'krypton-industrial-design-system',
    summary: 'Tactical UI component architecture synthesizing mid-century Swiss graphic print with aerospace HUD aesthetics.',
    role: 'Design System Architect',
    year: '2024',
    timeline: '6 Weeks',
    status: 'published',
    featured: true,
    order: 2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    ],
    techStack: ['React', 'Tailwind CSS', 'Radix UI', 'CSS Grid', 'Storybook'],
    tags: ['Design System', 'Swiss Typographic', 'Accessibility'],
    links: {
      live: 'https://example.com/krypton',
      repository: 'https://github.com/example/krypton',
    },
    metrics: [
      { label: 'Component Primitives', value: '48 Modules' },
      { label: 'Bundle Size (Gzipped)', value: '11.8 KB' },
      { label: 'WCAG Compliance', value: '100% AAA' },
    ],
    processSteps: [
      'Substrate & Metric Token Architecture',
      'Rigid 1px Grid Determinism',
      'Monospace Telemetry Standards',
      'Accessibility & Keyboard Traversal',
    ],
    caseStudyBlocks: [
      {
        id: 'k1',
        type: 'heading',
        content: 'Architecting for Mechanical Rigidity',
      },
      {
        id: 'k2',
        type: 'paragraph',
        content: 'Krypton discards soft, amorphous rounded corners in favor of mathematical 90-degree intersections and razor-sharp 1px border dividers. Engineered for data-intensive control planes, it prioritizes clarity over visual noise.',
      },
      {
        id: 'k3',
        type: 'metric',
        label: 'Zero-Layout-Shift Accuracy',
        value: '0.00 CLS',
      },
    ],
  },
  {
    _id: 'proj-3',
    title: 'AeroMesh Edge Gateway',
    slug: 'aeromesh-edge-gateway',
    summary: 'Decentralized service discovery and low-latency packet routing interface for geo-distributed clusters.',
    role: 'Full-Stack Systems Engineer',
    year: '2024',
    timeline: '10 Weeks',
    status: 'published',
    featured: false,
    order: 3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    ],
    techStack: ['Go', 'Next.js', 'MongoDB', 'Docker', 'eBPF'],
    tags: ['Networking', 'Edge Routing', 'Distributed'],
    links: {
      live: 'https://example.com/aeromesh',
      repository: 'https://github.com/example/aeromesh',
    },
    metrics: [
      { label: 'Packet Forwarding Overhead', value: '< 18µs' },
      { label: 'Global Node Discovery', value: 'Instant' },
    ],
    processSteps: [
      'eBPF Filter Layer Implementation',
      'Distributed Consensus Bridge',
      'Next.js Operator Dashboard',
    ],
    caseStudyBlocks: [
      {
        id: 'a1',
        type: 'heading',
        content: 'Zero-Overhead Edge Observation',
      },
      {
        id: 'a2',
        type: 'paragraph',
        content: 'Engineered an operator UI that exposes real-time route health, circuit breaker states, and packet jitter metrics across 24 edge regions without placing query load on the underlying routing daemon.',
      },
    ],
  },
  {
    _id: 'proj-4',
    title: 'Neural Canvas Vector Synthesis',
    slug: 'neural-canvas-vector-synthesis',
    summary: 'AI-assisted procedural design engine generating mathematical typography and kinetic SVG patterns.',
    role: 'Creative Technologist',
    year: '2023',
    timeline: '5 Weeks',
    status: 'published',
    featured: false,
    order: 4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    galleryUrls: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    ],
    techStack: ['TypeScript', 'WebGL', 'Canvas API', 'Next.js', 'Groq API'],
    tags: ['Creative Coding', 'AI Vectors', 'Generative'],
    links: {
      live: 'https://example.com/neuralcanvas',
      repository: 'https://github.com/example/neuralcanvas',
    },
    metrics: [
      { label: 'Procedural Generation Rate', value: '60 fps' },
      { label: 'Export Formats', value: 'SVG / GLTF / EPS' },
    ],
    processSteps: [
      'Parametric Curve Math Engine',
      'AI Prompt Latent Space Mapper',
      'GPU-Accelerated Rasterizer',
    ],
    caseStudyBlocks: [
      {
        id: 'n1',
        type: 'heading',
        content: 'Parametric Code as Aesthetic Medium',
      },
      {
        id: 'n2',
        type: 'paragraph',
        content: 'Combining mathematical bezier curves with LLM semantic weighting to generate deterministic, unslop vector assets for high-end digital publishing.',
      },
    ],
  },
];

export const fallbackSkills: ISkill[] = [
  {
    _id: 'sk-1',
    category: 'Architecture & Core Systems',
    items: ['TypeScript', 'Next.js 15 App Router', 'Node.js', 'Go', 'Distributed Systems', 'REST & GraphQL'],
    order: 1,
  },
  {
    _id: 'sk-2',
    category: 'Design & Tactical UI',
    items: ['Swiss Typographic Grid', 'Industrial Brutalism', 'Design Systems', 'Figma', 'Micro-Interactions', 'WCAG AA A11y'],
    order: 2,
  },
  {
    _id: 'sk-3',
    category: 'Data & Persistence',
    items: ['MongoDB Atlas', 'Mongoose', 'ClickHouse', 'PostgreSQL', 'Redis Caching', 'Cloudinary CDN'],
    order: 3,
  },
  {
    _id: 'sk-4',
    category: 'Motion & Interactive Graphics',
    items: ['Motion (Framer)', 'Lenis Smooth Scroll', 'Tailwind CSS', 'CSS Grid', 'Canvas 2D / WebGL'],
    order: 4,
  },
  {
    _id: 'sk-5',
    category: 'Engineering Principles',
    items: ['Zero-Layout-Shift (CLS 0.00)', 'YAGNI / Ponytail Senior Pragmatism', 'Atomic Commits', 'Vercel Serverless Optimization'],
    order: 5,
  },
];

export const fallbackSettings: ISettings = {
  _id: 'main',
  theme: 'dark',
  accentColor: '#E61919',
  hero: {
    headline: 'DESIGNING HIGH-CONCURRENCY ARCHITECTURES THAT SCALE.',
    subtext: 'Full-stack engineer & systems designer building expressive, resilient digital products with precision telemetry.',
    primaryCtaLabel: 'View Work',
    secondaryCtaLabel: 'Contact',
    showAvailabilityBadge: true,
  },
  sections: [
    { id: 'hero', label: 'Hero', visible: true, order: 1 },
    { id: 'featured-projects', label: 'Featured Projects', visible: true, order: 2 },
    { id: 'projects', label: 'All Projects', visible: true, order: 3 },
    { id: 'about', label: 'About', visible: true, order: 4 },
    { id: 'skills', label: 'Skills', visible: true, order: 5 },
    { id: 'contact', label: 'Contact', visible: true, order: 6 },
  ],
  footer: {
    text: 'TELEMETRY ENGINE ACTIVE // ZERO DOWNTIME',
    showAdminLink: true,
  },
  ai: {
    enabled: true,
    greeting: 'Telemetry active. I am the digital twin of this portfolio. Ask me anything about systems, stack, or case studies.',
    fallbackMessage: 'AI digital twin telemetry offline. Please review case studies below or connect directly via email.',
    provider: 'groq',
  },
  seo: {
    title: 'Alex Vance // Staff Systems Designer & Full-Stack Architect',
    description: 'High-performance full-stack web engineering, distributed systems, and industrial brutalist interface design.',
    ogImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  },
};
