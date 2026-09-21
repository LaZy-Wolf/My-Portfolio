import { connectDB } from '@/lib/db';
import { Project, type IProject } from '@/models/Project';
import { fallbackProjects } from '@/lib/fallbackData';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { notFound } from 'next/navigation';
import mongoose from 'mongoose';

interface Params {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProjectPage({ params }: Params) {
  const { id } = await params;
  let project: IProject | null = null;

  try {
    await connectDB();
    if (mongoose.Types.ObjectId.isValid(id)) {
      project = await Project.findById(id).lean();
    }
    if (!project) {
      project = await Project.findOne({ slug: id }).lean();
    }
  } catch (error) {
    console.warn('Failed to load project from DB, searching fallbacks:', error);
  }

  if (!project) {
    const fallback = fallbackProjects.find((p) => p.slug === id || p._id === id);
    if (fallback) {
      project = fallback as unknown as IProject;
    } else {
      notFound();
    }
  }

  const cleanProject = JSON.parse(JSON.stringify(project));

  return (
    <div className="space-y-6">
      <div className="border-b border-telemetry-border pb-4">
        <span className="telemetry-tag text-signal">
          [ PROJECT MODIFICATION // {cleanProject.slug.toUpperCase()} ]
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
          Edit: {cleanProject.title}
        </h1>
        <p className="text-xs font-mono text-telemetry-muted">
          Modify case study blocks, metrics, asset URLs, and publication status.
        </p>
      </div>

      <ProjectForm initialProject={cleanProject} isEditing={true} />
    </div>
  );
}
