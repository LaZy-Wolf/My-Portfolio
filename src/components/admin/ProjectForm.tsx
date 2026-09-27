'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { IProject } from '@/models/Project';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { BlockEditor } from '@/components/admin/BlockEditor';
import { slugify } from '@/lib/utils';
import {
  Save,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface ProjectFormProps {
  initialProject?: Partial<IProject>;
  isEditing?: boolean;
}

export function ProjectForm({ initialProject, isEditing = false }: ProjectFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<IProject>>({
    title: initialProject?.title || '',
    slug: initialProject?.slug || '',
    summary: initialProject?.summary || '',
    role: initialProject?.role || '',
    year: initialProject?.year || new Date().getFullYear().toString(),
    timeline: initialProject?.timeline || '',
    status: initialProject?.status || 'published',
    featured: initialProject?.featured ?? false,
    order: initialProject?.order ?? 0,
    thumbnailUrl: initialProject?.thumbnailUrl || '',
    galleryUrls: initialProject?.galleryUrls || [],
    techStack: initialProject?.techStack || [],
    tags: initialProject?.tags || [],
    links: {
      live: initialProject?.links?.live || '',
      repository: initialProject?.links?.repository || '',
    },
    metrics: initialProject?.metrics || [],
    processSteps: initialProject?.processSteps || [],
    note: initialProject?.note || '',
    caseStudyBlocks: initialProject?.caseStudyBlocks || [],
  });

  const [techInput, setTechInput] = useState(formData.techStack?.join(', ') || '');
  const [tagInput, setTagInput] = useState(formData.tags?.join(', ') || '');
  const [autoSlug, setAutoSlug] = useState(!isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: autoSlug ? slugify(val) : prev.slug,
    }));
  };

  const handleAddMetric = () => {
    setFormData((prev) => ({
      ...prev,
      metrics: [...(prev.metrics || []), { label: '', value: '' }],
    }));
  };

  const handleUpdateMetric = (index: number, field: 'label' | 'value', val: string) => {
    const next = [...(formData.metrics || [])];
    next[index] = { ...next[index], [field]: val };
    setFormData({ ...formData, metrics: next });
  };

  const handleRemoveMetric = (index: number) => {
    setFormData({
      ...formData,
      metrics: formData.metrics?.filter((_, i) => i !== index),
    });
  };

  const handleAddProcessStep = () => {
    setFormData((prev) => ({
      ...prev,
      processSteps: [...(prev.processSteps || []), ''],
    }));
  };

  const handleUpdateProcessStep = (index: number, val: string) => {
    const next = [...(formData.processSteps || [])];
    next[index] = val;
    setFormData({ ...formData, processSteps: next });
  };

  const handleRemoveProcessStep = (index: number) => {
    setFormData({
      ...formData,
      processSteps: formData.processSteps?.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const payload = {
      ...formData,
      techStack: techInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      tags: tagInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const url = isEditing
        ? `/api/projects/${formData.slug || initialProject?._id}`
        : '/api/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save project');
      }

      router.push('/admin/projects');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 border border-signal/40 bg-signal/10 text-signal font-mono text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>[ ERROR: {error} ]</span>
        </div>
      )}

      {/* Basic Metadata */}
      <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-telemetry-border/60 pb-3">
          <div>
            <span className="telemetry-tag text-signal">[ MODULE 01 // METRICS ]</span>
            <h2 className="text-base font-black uppercase text-white tracking-tight mt-1">
              Project Header & Coordinates
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-telemetry-muted">
              <input
                type="checkbox"
                checked={formData.status === 'published'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value ? (e.target.checked ? 'published' : 'draft') : 'draft',
                  })
                }
                className="accent-signal"
              />
              PUBLISHED TO PUBLIC HUD
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-telemetry-muted">
              <input
                type="checkbox"
                checked={formData.featured ?? false}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="accent-signal"
              />
              FEATURED BADGE
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="telemetry-tag text-telemetry-muted">Project Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Chronos Realtime Telemetry"
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-sm font-mono text-white focus:border-signal outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="telemetry-tag text-telemetry-muted">URL Slug</label>
                <label className="text-[10px] font-mono text-telemetry-faint flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSlug}
                    onChange={(e) => setAutoSlug(e.target.checked)}
                    className="accent-signal"
                  />
                  Auto-sync with Title
                </label>
              </div>
              <input
                type="text"
                required
                value={formData.slug}
                disabled={autoSlug}
                onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none disabled:opacity-60"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="telemetry-tag text-telemetry-muted">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="Lead Architect"
                  className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
                />
              </div>
              <div>
                <label className="telemetry-tag text-telemetry-muted">Year</label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2025"
                  className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
                />
              </div>
              <div>
                <label className="telemetry-tag text-telemetry-muted">Timeline</label>
                <input
                  type="text"
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  placeholder="8 Weeks"
                  className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
                />
              </div>
            </div>

            <div>
              <label className="telemetry-tag text-telemetry-muted">Short Summary (Card Preview)</label>
              <textarea
                rows={3}
                required
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Compact synopsis for project cards and telemetry listings..."
                className="w-full bg-substrate border border-telemetry-border p-3 text-sm font-mono text-white focus:border-signal outline-none"
              />
            </div>
            <div>
              <label className="telemetry-tag text-telemetry-muted">Margin note (optional, handwritten beside the line)</label>
              <input
                type="text"
                maxLength={60}
                value={formData.note || ''}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                placeholder="e.g. still chasing that 512 ms"
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-sm font-mono text-white focus:border-signal outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <ImageUpload
              label="Primary Thumbnail"
              aspectRatio="video"
              value={formData.thumbnailUrl || ''}
              onChange={(url) => setFormData({ ...formData, thumbnailUrl: url })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="telemetry-tag text-telemetry-muted">Live Prototype URL</label>
                <input
                  type="url"
                  value={formData.links?.live || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      links: { ...formData.links!, live: e.target.value },
                    })
                  }
                  placeholder="https://..."
                  className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
                />
              </div>
              <div>
                <label className="telemetry-tag text-telemetry-muted">Source Code Repository</label>
                <input
                  type="url"
                  value={formData.links?.repository || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      links: { ...formData.links!, repository: e.target.value },
                    })
                  }
                  placeholder="https://github.com/..."
                  className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-telemetry-border/40">
          <div>
            <label className="telemetry-tag text-telemetry-muted">
              Tech Stack (Comma Separated)
            </label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Next.js 15, TypeScript, Tailwind, WebSockets, ClickHouse"
              className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
            />
          </div>
          <div>
            <label className="telemetry-tag text-telemetry-muted">
              Classification Tags (Comma Separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Telemetry, High Concurrency, Swiss Design"
              className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
            />
          </div>
        </div>
      </div>

      {/* Impact Metrics & Process Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Metrics */}
        <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-telemetry-border/60 pb-3">
            <div>
              <span className="telemetry-tag text-signal">[ TELEMETRY IMPACT ]</span>
              <h3 className="text-sm font-mono uppercase font-bold text-white mt-1">
                Quantitative Metrics
              </h3>
            </div>
            <button
              type="button"
              onClick={handleAddMetric}
              className="brutalist-btn text-xs py-1 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> + Metric
            </button>
          </div>

          <div className="space-y-3">
            {formData.metrics?.map((metric, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={metric.label}
                  onChange={(e) => handleUpdateMetric(i, 'label', e.target.value)}
                  placeholder="Label (e.g. Time to first audio, p50). A metric named Target draws a ghost marker."
                  className="flex-1 bg-substrate border border-telemetry-border px-3 py-1.5 text-xs font-mono text-white focus:border-signal outline-none"
                />
                <input
                  type="text"
                  value={metric.value}
                  onChange={(e) => handleUpdateMetric(i, 'value', e.target.value)}
                  placeholder="Value (e.g. 1412 ms)"
                  className="w-32 bg-substrate border border-telemetry-border px-3 py-1.5 text-xs font-mono text-white focus:border-signal outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveMetric(i)}
                  className="p-1.5 text-telemetry-muted hover:text-signal"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Process Steps */}
        <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-telemetry-border/60 pb-3">
            <div>
              <span className="telemetry-tag text-signal">[ PROCESS ENGINE ]</span>
              <h3 className="text-sm font-mono uppercase font-bold text-white mt-1">
                Line stations
              </h3>
              <p className="text-[11px] font-mono text-telemetry-faint mt-1">
                Stops drawn on this project&apos;s line, in order. End a stop with &quot;@ 165&quot; to record the measured ms from the previous stop; timed stops are drawn to scale.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddProcessStep}
              className="brutalist-btn text-xs py-1 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> + Step
            </button>
          </div>

          <div className="space-y-3">
            {formData.processSteps?.map((step, i) => (
              <div key={i} className="flex gap-2 items-center">
                <span className="text-xs font-mono text-signal font-bold w-6">
                  0{i + 1}
                </span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleUpdateProcessStep(i, e.target.value)}
                  placeholder="e.g. Deepgram transcript @ 165"
                  className="flex-1 bg-substrate border border-telemetry-border px-3 py-1.5 text-xs font-mono text-white focus:border-signal outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveProcessStep(i)}
                  className="p-1.5 text-telemetry-muted hover:text-signal"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Case Study Block Editor */}
      <div className="border border-telemetry-border bg-substrate-surface p-6">
        <BlockEditor
          blocks={formData.caseStudyBlocks || []}
          onChange={(blocks) => setFormData({ ...formData, caseStudyBlocks: blocks })}
        />
      </div>

      {/* Form Submission Footer */}
      <div className="flex items-center justify-between border-t border-telemetry-border pt-6">
        <Link
          href="/admin/projects"
          className="brutalist-btn flex items-center gap-2 text-xs py-2.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel & Return
        </Link>

        <button
          type="submit"
          disabled={isSaving}
          className="brutalist-btn brutalist-btn-accent px-8 py-3 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              COMMITTING PROJECT...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEditing ? 'UPDATE PROJECT' : 'CREATE PROJECT'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
