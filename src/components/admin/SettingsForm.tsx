'use client';

import { useState } from 'react';
import type { ISettings } from '@/models/Settings';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export function SettingsForm({ initialSettings }: { initialSettings: ISettings }) {
  const [formData, setFormData] = useState<ISettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setToast(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update settings');
      }

      setToast({
        type: 'success',
        message: 'SYSTEM PARAMETERS SAVED // TELEMETRY TOKENS PROPAGATED',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      setToast({ type: 'error', message: msg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSection = (sectionId: string) => {
    setFormData({
      ...formData,
      sections: formData.sections.map((s) =>
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      ),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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

      {/* Visual System & Branding */}
      <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-6">
        <div className="border-b border-telemetry-border/60 pb-3">
          <span className="telemetry-tag text-signal">[ PARAM 01 // SUBSTRATE ]</span>
          <h2 className="text-base font-black uppercase text-white tracking-tight mt-1">
            Visual Substrate & Telemetry Accent
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="telemetry-tag text-telemetry-muted">
              Primary Signal Accent Color
            </label>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="color"
                value={formData.accentColor}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="w-10 h-10 border border-telemetry-border bg-substrate cursor-pointer p-0"
              />
              <input
                type="text"
                value={formData.accentColor}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="w-32 bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none uppercase"
              />
              <span className="text-[11px] font-mono text-telemetry-muted">
                (Default: #E61919 Aviation Red)
              </span>
            </div>
          </div>

          <div>
            <label className="telemetry-tag text-telemetry-muted">Theme Substrate</label>
            <select
              value={formData.theme}
              onChange={(e) =>
                setFormData({ ...formData, theme: e.target.value as 'dark' | 'light' })
              }
              className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none mt-1"
            >
              <option value="dark">Dark Substrate (#0A0A0A // Tactical HUD)</option>
              <option value="light">Light Substrate (#F4F4F0 // Swiss Print)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Hero Telemetry Section */}
      <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-6">
        <div className="border-b border-telemetry-border/60 pb-3">
          <span className="telemetry-tag text-signal">[ PARAM 02 // HERO ]</span>
          <h2 className="text-base font-black uppercase text-white tracking-tight mt-1">
            Hero Headline & Callouts
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="telemetry-tag text-telemetry-muted">
              Hero Architectural Headline
            </label>
            <textarea
              rows={2}
              required
              value={formData.hero.headline}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, headline: e.target.value },
                })
              }
              className="w-full bg-substrate border border-telemetry-border p-3 text-sm font-mono text-white focus:border-signal outline-none uppercase font-bold"
            />
          </div>

          <div>
            <label className="telemetry-tag text-telemetry-muted">Hero Subtext</label>
            <textarea
              rows={3}
              required
              value={formData.hero.subtext}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  hero: { ...formData.hero, subtext: e.target.value },
                })
              }
              className="w-full bg-substrate border border-telemetry-border p-3 text-sm font-mono text-white focus:border-signal outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="telemetry-tag text-telemetry-muted">Primary CTA Label</label>
              <input
                type="text"
                value={formData.hero.primaryCtaLabel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, primaryCtaLabel: e.target.value },
                  })
                }
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
              />
            </div>
            <div>
              <label className="telemetry-tag text-telemetry-muted">Secondary CTA Label</label>
              <input
                type="text"
                value={formData.hero.secondaryCtaLabel}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hero: { ...formData.hero, secondaryCtaLabel: e.target.value },
                  })
                }
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section Visibility Switches */}
      <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-6">
        <div className="border-b border-telemetry-border/60 pb-3">
          <span className="telemetry-tag text-signal">[ PARAM 03 // VISIBILITY ]</span>
          <h2 className="text-base font-black uppercase text-white tracking-tight mt-1">
            Homepage Section Visibility Matrix
          </h2>
          <p className="text-xs font-mono text-telemetry-muted mt-0.5">
            Toggle public visibility of any section without modifying source code.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {formData.sections.map((section) => (
            <label
              key={section.id}
              className={`p-3.5 border flex items-center justify-between cursor-pointer transition-colors ${
                section.visible
                  ? 'border-signal/40 bg-substrate text-white'
                  : 'border-telemetry-border bg-substrate/40 text-telemetry-muted'
              }`}
            >
              <span className="font-mono text-xs uppercase font-bold">
                {section.label}
              </span>
              <input
                type="checkbox"
                checked={section.visible}
                onChange={() => handleToggleSection(section.id)}
                className="accent-signal"
              />
            </label>
          ))}
        </div>
      </div>

      {/* AI Digital Twin Configuration */}
      <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-6">
        <div className="border-b border-telemetry-border/60 pb-3 flex items-center justify-between">
          <div>
            <span className="telemetry-tag text-signal">[ PARAM 04 // AI TWIN ]</span>
            <h2 className="text-base font-black uppercase text-white tracking-tight mt-1">
              Digital Twin AI Assistant
            </h2>
          </div>
          <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-telemetry-muted">
            <input
              type="checkbox"
              checked={formData.ai.enabled}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ai: { ...formData.ai, enabled: e.target.checked },
                })
              }
              className="accent-signal"
            />
            ASSISTANT ORB ACTIVE
          </label>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="telemetry-tag text-telemetry-muted">Active AI Engine</label>
              <select
                value={formData.ai.provider}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ai: { ...formData.ai, provider: e.target.value },
                  })
                }
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
              >
                <option value="groq">Groq (Llama 3.3 70B // Free Tier)</option>
                <option value="gemini">Google Gemini (Flash // Free Tier)</option>
                <option value="disabled">Offline / Fallback Notice Only</option>
              </select>
            </div>
            <div>
              <label className="telemetry-tag text-telemetry-muted">Greeting Prompt</label>
              <input
                type="text"
                value={formData.ai.greeting}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ai: { ...formData.ai, greeting: e.target.value },
                  })
                }
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
              />
            </div>
          </div>

          <div>
            <label className="telemetry-tag text-telemetry-muted">Offline Fallback Notice</label>
            <textarea
              rows={2}
              value={formData.ai.fallbackMessage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ai: { ...formData.ai, fallbackMessage: e.target.value },
                })
              }
              className="w-full bg-substrate border border-telemetry-border p-3 text-xs font-mono text-white focus:border-signal outline-none"
            />
          </div>
        </div>
      </div>

      {/* SEO & Footer */}
      <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-6">
        <div className="border-b border-telemetry-border/60 pb-3">
          <span className="telemetry-tag text-signal">[ PARAM 05 // SEO & FOOTER ]</span>
          <h2 className="text-base font-black uppercase text-white tracking-tight mt-1">
            Search Indexing & Footer Copy
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="telemetry-tag text-telemetry-muted">Global Meta Title</label>
            <input
              type="text"
              value={formData.seo.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seo: { ...formData.seo, title: e.target.value },
                })
              }
              className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
            />
          </div>

          <div>
            <label className="telemetry-tag text-telemetry-muted">Meta Description</label>
            <textarea
              rows={2}
              value={formData.seo.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  seo: { ...formData.seo, description: e.target.value },
                })
              }
              className="w-full bg-substrate border border-telemetry-border p-3 text-xs font-mono text-white focus:border-signal outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-telemetry-border/40">
            <div>
              <label className="telemetry-tag text-telemetry-muted">Footer Text Readout</label>
              <input
                type="text"
                value={formData.footer.text}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    footer: { ...formData.footer, text: e.target.value },
                  })
                }
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
              />
            </div>
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-mono text-xs text-telemetry-muted">
                <input
                  type="checkbox"
                  checked={formData.footer.showAdminLink}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footer: { ...formData.footer, showAdminLink: e.target.checked },
                    })
                  }
                  className="accent-signal"
                />
                Show discreet admin portal access link in footer
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end border-t border-telemetry-border pt-6">
        <button
          type="submit"
          disabled={isSaving}
          className="brutalist-btn brutalist-btn-accent px-8 py-3 flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              UPDATING SYSTEM...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              COMMIT SETTINGS
            </>
          )}
        </button>
      </div>
    </form>
  );
}
