'use client';

import { useState } from 'react';
import type { IProfile } from '@/models/Profile';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Loader2, CheckCircle2, AlertCircle, Save } from 'lucide-react';

export function ProfileForm({ initialProfile }: { initialProfile: IProfile }) {
  const [formData, setFormData] = useState<IProfile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatus(null);

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      setStatus({
        type: 'success',
        message: 'PROFILE METADATA COMMITTED TO TELEMETRY DATABASE',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      setStatus({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {status && (
        <div
          className={`p-4 border font-mono text-xs flex items-center gap-3 ${
            status.type === 'success'
              ? 'border-terminal/40 bg-terminal/10 text-terminal'
              : 'border-signal/40 bg-signal/10 text-signal'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* Identity & Core Telemetry */}
      <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-6">
        <div className="border-b border-telemetry-border/60 pb-3">
          <span className="telemetry-tag text-signal">[ MODULE 01 ]</span>
          <h2 className="text-base font-black uppercase text-white tracking-tight mt-1">
            Identity & Core Telemetry
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="telemetry-tag text-telemetry-muted">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-sm font-mono text-white focus:border-signal outline-none"
              />
            </div>

            <div>
              <label className="telemetry-tag text-telemetry-muted">Primary Role & Title</label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-sm font-mono text-white focus:border-signal outline-none"
              />
            </div>

            <div>
              <label className="telemetry-tag text-telemetry-muted">Contact Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-sm font-mono text-white focus:border-signal outline-none"
              />
            </div>

            <div>
              <label className="telemetry-tag text-telemetry-muted">Location & Timezone</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Zurich / Remote [UTC+1]"
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-sm font-mono text-white focus:border-signal outline-none"
              />
            </div>

            <div>
              <label className="telemetry-tag text-telemetry-muted">Availability Status</label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                placeholder="AVAILABLE FOR CONTRACT // Q3-Q4"
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-sm font-mono text-white focus:border-signal outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <ImageUpload
              label="Avatar / Profile Asset"
              aspectRatio="square"
              value={formData.avatarUrl}
              onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
            />

            <div>
              <label className="telemetry-tag text-telemetry-muted">Resume Document URL</label>
              <input
                type="url"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                placeholder="https://..."
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-sm font-mono text-white focus:border-signal outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="telemetry-tag text-telemetry-muted">Tagline (Hero Secondary)</label>
          <input
            type="text"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-sm font-mono text-white focus:border-signal outline-none"
          />
        </div>
      </div>

      {/* Narrative & Philosophy */}
      <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-6">
        <div className="border-b border-telemetry-border/60 pb-3">
          <span className="telemetry-tag text-signal">[ MODULE 02 ]</span>
          <h2 className="text-base font-black uppercase text-white tracking-tight mt-1">
            Narrative & Design Philosophy
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="telemetry-tag text-telemetry-muted">Short Bio (Hero Intro)</label>
            <textarea
              rows={3}
              value={formData.shortBio}
              onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
              className="w-full bg-substrate border border-telemetry-border p-3 text-sm font-mono text-white focus:border-signal outline-none"
            />
          </div>

          <div>
            <label className="telemetry-tag text-telemetry-muted">Long Bio (About Section Narrative)</label>
            <textarea
              rows={6}
              value={formData.longBio}
              onChange={(e) => setFormData({ ...formData, longBio: e.target.value })}
              className="w-full bg-substrate border border-telemetry-border p-3 text-sm font-mono text-white focus:border-signal outline-none"
            />
          </div>

          <div>
            <label className="telemetry-tag text-telemetry-muted">Design Philosophy (Core Manifesto)</label>
            <textarea
              rows={4}
              value={formData.designPhilosophy}
              onChange={(e) => setFormData({ ...formData, designPhilosophy: e.target.value })}
              className="w-full bg-substrate border border-telemetry-border p-3 text-sm font-mono text-white focus:border-signal outline-none"
            />
          </div>
        </div>
      </div>

      {/* Social Coordinates */}
      <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-6">
        <div className="border-b border-telemetry-border/60 pb-3">
          <span className="telemetry-tag text-signal">[ MODULE 03 ]</span>
          <h2 className="text-base font-black uppercase text-white tracking-tight mt-1">
            Social Coordinates & Network Links
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(formData.socials).map(([key, val]) => (
            <div key={key}>
              <label className="telemetry-tag text-telemetry-muted uppercase">
                {key} URL
              </label>
              <input
                type="url"
                value={val}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socials: { ...formData.socials, [key]: e.target.value },
                  })
                }
                placeholder={`https://${key}.com/...`}
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-4 border-t border-telemetry-border pt-6">
        <button
          type="submit"
          disabled={isSaving}
          className="brutalist-btn brutalist-btn-accent px-8 py-3 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              COMMITTING CHANGES...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              SAVE PROFILE DATA
            </>
          )}
        </button>
      </div>
    </form>
  );
}
