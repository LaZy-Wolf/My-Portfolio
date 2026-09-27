import mongoose, { Schema, Model } from 'mongoose';

export interface ISectionConfig {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

export interface ISettings {
  _id?: string;
  theme: 'system' | 'dark' | 'light';
  accentColor: string;
  hero: {
    headline: string;
    subtext: string;
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    showAvailabilityBadge: boolean;
    /** Handwritten line beside the numbers under the hero. */
    quote?: string;
  };
  /** The numbers strip under the hero. */
  stats?: { value: string; label: string }[];
  /** "How I build": a heading, its grey second half, and the steps. */
  approach?: { title: string; subtitle: string; steps: { title: string; text: string }[] };
  sections: ISectionConfig[];
  footer: {
    text: string;
    showAdminLink: boolean;
  };
  ai: {
    enabled: boolean;
    greeting: string;
    fallbackMessage: string;
    provider: string;
  };
  seo: {
    title: string;
    description: string;
    ogImageUrl: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const SectionConfigSchema = new Schema<ISectionConfig>(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    visible: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const SettingsSchema = new Schema<ISettings>(
  {
    _id: { type: String, default: 'main' },
    theme: { type: String, enum: ['system', 'dark', 'light'], default: 'system' },
    accentColor: { type: String, default: '#E61919' },
    hero: {
      headline: {
        type: String,
        default: 'DESIGNING HIGH-CONCURRENCY ARCHITECTURES THAT SCALE.',
      },
      subtext: {
        type: String,
        default:
          'Full-stack engineer & systems designer building expressive, resilient digital products with precision telemetry.',
      },
      primaryCtaLabel: { type: String, default: 'View Work' },
      secondaryCtaLabel: { type: String, default: 'Contact' },
      showAvailabilityBadge: { type: Boolean, default: true },
      quote: { type: String, default: '' },
    },
    stats: { type: [{ _id: false, value: String, label: String }], default: [] },
    approach: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      steps: { type: [{ _id: false, title: String, text: String }], default: [] },
    },
    sections: {
      type: [SectionConfigSchema],
      default: [
        { id: 'hero', label: 'Hero', visible: true, order: 1 },
        { id: 'featured-projects', label: 'Featured Projects', visible: true, order: 2 },
        { id: 'projects', label: 'All Projects', visible: true, order: 3 },
        { id: 'about', label: 'About', visible: true, order: 4 },
        { id: 'skills', label: 'Skills', visible: true, order: 5 },
        { id: 'contact', label: 'Contact', visible: true, order: 6 },
      ],
    },
    footer: {
      text: { type: String, default: 'SYSTEM ACTIVE // ZERO DOWNTIME' },
      showAdminLink: { type: Boolean, default: true },
    },
    ai: {
      enabled: { type: Boolean, default: true },
      greeting: {
        type: String,
        default:
          'Telemetry active. I am the digital twin of this portfolio. Ask me anything about systems, stack, or case studies.',
      },
      fallbackMessage: {
        type: String,
        default:
          'AI digital twin telemetry offline. Please review case studies below or connect directly via email.',
      },
      provider: { type: String, default: 'groq' },
    },
    seo: {
      title: { type: String, default: 'Portfolio // System Architecture & Engineering' },
      description: {
        type: String,
        default:
          'High-performance full-stack web engineering, distributed systems, and industrial brutalist interface design.',
      },
      ogImageUrl: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
