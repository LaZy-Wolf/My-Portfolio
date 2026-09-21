import { connectDB } from '@/lib/db';
import { Project } from '@/models/Project';
import { fallbackProjects } from '@/lib/fallbackData';
import { SortableProjectList } from '@/components/admin/SortableProjectList';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default async function AdminProjectsPage() {
  let projects = fallbackProjects;

  try {
    await connectDB();
    const docs = await Project.find().sort({ order: 1, createdAt: -1 }).lean();
    if (docs && docs.length > 0) {
      projects = JSON.parse(JSON.stringify(docs));
    }
  } catch (error) {
    console.warn('Failed to load projects from DB, using fallback list:', error);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-telemetry-border pb-4">
        <div>
          <span className="telemetry-tag text-signal">
            [ CONTENT INVENTORY // PROJECTS ]
          </span>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
            Project Sequence & Case Studies
          </h1>
          <p className="text-xs font-mono text-telemetry-muted">
            Drag items using the handle to immediately update public order in MongoDB. Accessible up/down arrows supported.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="brutalist-btn brutalist-btn-accent flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          NEW PROJECT
        </Link>
      </div>

      <SortableProjectList initialProjects={projects} />
    </div>
  );
}
