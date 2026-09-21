import mongoose, { Schema, Model } from 'mongoose';

export interface ICaseStudyBlock {
  id?: string;
  type: 'heading' | 'paragraph' | 'image' | 'gallery' | 'quote' | 'metric' | 'link';
  content?: string;
  imageUrl?: string;
  galleryUrls?: string[];
  caption?: string;
  quote?: string;
  author?: string;
  label?: string;
  value?: string;
  url?: string;
}

export interface IProject {
  _id?: string;
  title: string;
  slug: string;
  summary: string;
  role: string;
  year: string;
  timeline: string;
  status: 'draft' | 'published';
  featured: boolean;
  order: number;
  thumbnailUrl: string;
  galleryUrls: string[];
  techStack: string[];
  tags: string[];
  links: {
    live: string;
    repository: string;
  };
  metrics: {
    label: string;
    value: string;
  }[];
  processSteps: string[];
  caseStudyBlocks: ICaseStudyBlock[];
  createdAt?: Date;
  updatedAt?: Date;
}

const CaseStudyBlockSchema = new Schema<ICaseStudyBlock>(
  {
    id: { type: String },
    type: {
      type: String,
      enum: ['heading', 'paragraph', 'image', 'gallery', 'quote', 'metric', 'link'],
      required: true,
    },
    content: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    galleryUrls: { type: [String], default: [] },
    caption: { type: String, default: '' },
    quote: { type: String, default: '' },
    author: { type: String, default: '' },
    label: { type: String, default: '' },
    value: { type: String, default: '' },
    url: { type: String, default: '' },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, default: '' },
    role: { type: String, default: '' },
    year: { type: String, default: '' },
    timeline: { type: String, default: '' },
    status: { type: String, enum: ['draft', 'published'], default: 'published', index: true },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    thumbnailUrl: { type: String, default: '' },
    galleryUrls: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    links: {
      live: { type: String, default: '' },
      repository: { type: String, default: '' },
    },
    metrics: [
      {
        label: { type: String, default: '' },
        value: { type: String, default: '' },
      },
    ],
    processSteps: { type: [String], default: [] },
    caseStudyBlocks: [CaseStudyBlockSchema],
  },
  {
    timestamps: true,
  }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
