import mongoose, { Schema, Model } from 'mongoose';

export interface IExperience {
  role: string;
  company: string;
  location: string;
  period: string;
  /** The company's website. */
  url?: string;
  points: string[];
  /** Products built in this role. They belong to the employer; the page says so. */
  products?: IWorkProduct[];
}

export interface IWorkProduct {
  name: string;
  kind: string;
  url: string;
  status: 'live' | 'offline';
  image: string;
  summary: string;
  points: string[];
  note?: string;
}

export interface IEducation {
  degree: string;
  institution: string;
  period: string;
  cgpa: string;
  coursework: string;
}

export interface IProfile {
  _id?: string;
  name: string;
  role: string;
  tagline: string;
  shortBio: string;
  longBio: string;
  designPhilosophy: string;
  avatarUrl: string;
  resumeUrl: string;
  email: string;
  phone?: string;
  location: string;
  availability: string;
  socials: {
    github: string;
    linkedin: string;
    twitter: string;
    dribbble: string;
    behance: string;
  };
  experience?: IExperience[];
  education?: IEducation[];
  achievements?: string[];
  certifications?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

const ProfileSchema = new Schema<IProfile>(
  {
    _id: { type: String, default: 'main' },
    name: { type: String, required: true },
    role: { type: String, required: true },
    tagline: { type: String, default: '' },
    shortBio: { type: String, default: '' },
    longBio: { type: String, default: '' },
    designPhilosophy: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    availability: { type: String, default: 'Available for hire & contract' },
    socials: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      dribbble: { type: String, default: '' },
      behance: { type: String, default: '' },
    },
    experience: { type: [Schema.Types.Mixed], default: [] },
    education: { type: [Schema.Types.Mixed], default: [] },
    achievements: { type: [String], default: [] },
    certifications: { type: [String], default: [] },
  },
  {
    timestamps: true,
    _id: false,
  }
);

export const Profile: Model<IProfile> =
  mongoose.models.Profile || mongoose.model<IProfile>('Profile', ProfileSchema);
