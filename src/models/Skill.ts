import mongoose, { Schema, Model } from 'mongoose';

export interface ISkill {
  _id?: string;
  category: string;
  items: string[];
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    category: { type: String, required: true },
    items: { type: [String], default: [] },
    order: { type: Number, default: 0, index: true },
  },
  {
    timestamps: true,
  }
);

export const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);
