'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import Link from 'next/link';
import type { IProject } from '@/models/Project';
import {
  GripVertical,
  Edit2,
  Trash2,
  Eye,
  Star,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

interface SortableProjectItemProps {
  project: IProject;
  index: number;
  total: number;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDelete: (id: string, title: string) => void;
}

export function SortableProjectItem({
  project,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
}: SortableProjectItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project._id || project.slug });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border border-telemetry-border bg-substrate p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
        isDragging ? 'border-signal bg-substrate-elevated shadow-lg' : 'hover:border-telemetry-muted'
      }`}
    >
      {/* Left: Drag Handle & Meta */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 text-telemetry-muted hover:text-white shrink-0"
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <span className="font-mono text-xs font-bold text-signal w-6 text-center shrink-0">
          0{index + 1}
        </span>

        {project.thumbnailUrl ? (
          <div className="w-16 h-11 relative border border-telemetry-border overflow-hidden shrink-0 bg-substrate-surface">
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover"
              unoptimized={project.thumbnailUrl.startsWith('data:')}
            />
          </div>
        ) : (
          <div className="w-16 h-11 border border-telemetry-border bg-substrate-surface flex items-center justify-center shrink-0 text-[10px] font-mono text-telemetry-faint">
            NO ASSET
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-mono font-bold text-white uppercase truncate">
              {project.title}
            </h3>
            {project.featured && (
              <span className="telemetry-tag text-[9px] bg-signal/20 text-signal border border-signal/40 px-1.5 py-0.5 flex items-center gap-1">
                <Star className="w-2.5 h-2.5 fill-signal" /> FEATURED
              </span>
            )}
            <span
              className={`telemetry-tag text-[9px] px-1.5 py-0.5 border ${
                project.status === 'published'
                  ? 'border-terminal/40 bg-terminal/10 text-terminal'
                  : 'border-telemetry-border bg-substrate-surface text-telemetry-muted'
              }`}
            >
              {project.status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-telemetry-muted mt-1 truncate">
            <span>/{project.slug}</span>
            {project.role && <span>&bull; {project.role}</span>}
            {project.year && <span>&bull; {project.year}</span>}
          </div>
        </div>
      </div>

      {/* Right: Accessible Controls & Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {/* Mobile/Accessible manual sort arrows */}
        <div className="flex items-center border border-telemetry-border bg-substrate-surface mr-2">
          <button
            type="button"
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            className="p-1 text-telemetry-muted hover:text-white disabled:opacity-20 transition-opacity"
            title="Move project up"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(index)}
            disabled={index === total - 1}
            className="p-1 text-telemetry-muted hover:text-white disabled:opacity-20 transition-opacity border-l border-telemetry-border"
            title="Move project down"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <Link
          href={`/projects/${project.slug}`}
          target="_blank"
          className="brutalist-btn text-xs py-1.5 px-2.5"
          title="Preview public project page"
        >
          <Eye className="w-3.5 h-3.5" />
        </Link>

        <Link
          href={`/admin/projects/${project._id || project.slug}/edit`}
          className="brutalist-btn text-xs py-1.5 px-2.5"
          title="Edit project"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => onDelete(project._id || project.slug, project.title)}
          className="brutalist-btn text-xs py-1.5 px-2.5 text-telemetry-muted hover:text-signal hover:border-signal"
          title="Delete project"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
