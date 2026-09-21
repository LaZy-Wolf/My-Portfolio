import { ProjectForm } from '@/components/admin/ProjectForm';

export default function AdminNewProjectPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-telemetry-border pb-4">
        <span className="telemetry-tag text-signal">
          [ PROJECT REGISTRATION PROTOCOL ]
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
          Register New Showcase Project
        </h1>
        <p className="text-xs font-mono text-telemetry-muted">
          Define case study metadata, quantitative telemetry, process stages, and modular narrative blocks.
        </p>
      </div>

      <ProjectForm isEditing={false} />
    </div>
  );
}
