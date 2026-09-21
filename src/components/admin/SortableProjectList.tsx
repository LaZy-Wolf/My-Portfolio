'use client';

import { useState } from 'react';
import type { IProject } from '@/models/Project';
import { SortableProjectItem } from '@/components/admin/SortableProjectItem';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface SortableProjectListProps {
  initialProjects: IProject[];
}

export function SortableProjectList({ initialProjects }: SortableProjectListProps) {
  const [projects, setProjects] = useState<IProject[]>(initialProjects);
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const persistReorder = async (reordered: IProject[]) => {
    setIsUpdating(true);
    setToast(null);

    const projectIds = reordered.map((p) => p._id || p.slug);

    try {
      const res = await fetch('/api/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectIds }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Reorder update failed');
      }

      setToast({
        type: 'success',
        message: 'PROJECT TELEMETRY SEQUENCE SYNCHRONIZED ACROSS SYSTEM',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Reorder failed';
      setToast({ type: 'error', message: msg });
      // Rollback on failure
      setProjects(initialProjects);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => (p._id || p.slug) === active.id);
      const newIndex = projects.findIndex((p) => (p._id || p.slug) === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = arrayMove(projects, oldIndex, newIndex);
        setProjects(reordered);
        persistReorder(reordered);
      }
    }
  };

  const handleManualMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = arrayMove(projects, index, targetIndex);
    setProjects(reordered);
    persistReorder(reordered);
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `[ CONFIRM DELETION ] Permanently delete project "${title}"?`
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Deletion failed');
      }

      setProjects(projects.filter((p) => (p._id || p.slug) !== id));
      setToast({
        type: 'success',
        message: `PROJECT "${title.toUpperCase()}" REMOVED FROM DATABASE`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Deletion failed';
      setToast({ type: 'error', message: msg });
    }
  };

  const itemIds = projects.map((p) => p._id || p.slug);

  return (
    <div className="space-y-4">
      {/* Status Notifications */}
      {toast && (
        <div
          className={`p-3 border font-mono text-xs flex items-center gap-2 ${
            toast.type === 'success'
              ? 'border-terminal/40 bg-terminal/10 text-terminal'
              : 'border-signal/40 bg-signal/10 text-signal'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {isUpdating && (
        <div className="flex items-center gap-2 font-mono text-xs text-signal">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>SYNCING PROJECT SEQUENCE TO MONGODB ATLAS...</span>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="p-12 border border-dashed border-telemetry-border text-center space-y-3 bg-substrate-surface">
          <p className="text-sm font-mono text-telemetry-muted">
            NO PROJECTS REGISTERED IN DATABASE.
          </p>
          <p className="text-xs font-mono text-telemetry-faint">
            Create your first project using the button above to populate the public showcase.
          </p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {projects.map((project, index) => (
                <SortableProjectItem
                  key={project._id || project.slug}
                  project={project}
                  index={index}
                  total={projects.length}
                  onMoveUp={(i) => handleManualMove(i, 'up')}
                  onMoveDown={(i) => handleManualMove(i, 'down')}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
