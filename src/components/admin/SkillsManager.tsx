'use client';

import { useState } from 'react';
import type { ISkill } from '@/models/Skill';
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
} from 'lucide-react';

export function SkillsManager({ initialSkills }: { initialSkills: ISkill[] }) {
  const [skills, setSkills] = useState<ISkill[]>(initialSkills);
  const [newCategory, setNewCategory] = useState('');
  const [newSkillText, setNewSkillText] = useState<{ [categoryId: string]: string }>({});
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setLoading(true);
    setToast(null);

    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCategory.trim(), items: [] }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create skill category');
      }

      const created = await res.json();
      setSkills([...skills, created]);
      setNewCategory('');
      setToast({
        type: 'success',
        message: 'NEW SKILLS TAXONOMY CATEGORY INITIALIZED',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setToast({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategoryTitle = async (id: string, name: string) => {
    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: name }),
      });

      if (!res.ok) throw new Error('Failed to update category');

      setSkills(
        skills.map((s) => (s._id === id ? { ...s, category: name } : s))
      );
      setEditingCategory(null);
      setToast({
        type: 'success',
        message: 'CATEGORY IDENTIFIER UPDATED',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      setToast({ type: 'error', message: msg });
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`Delete category "${name}" and all its skills?`)) return;

    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete category');

      setSkills(skills.filter((s) => s._id !== id));
      setToast({
        type: 'success',
        message: `CATEGORY "${name.toUpperCase()}" DELETED`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      setToast({ type: 'error', message: msg });
    }
  };

  const handleAddItem = async (categoryId: string) => {
    const itemText = (newSkillText[categoryId] || '').trim();
    if (!itemText) return;

    const targetCategory = skills.find((s) => s._id === categoryId);
    if (!targetCategory) return;

    const nextItems = [...targetCategory.items, itemText];

    try {
      const res = await fetch(`/api/skills/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: nextItems }),
      });

      if (!res.ok) throw new Error('Failed to add skill item');

      setSkills(
        skills.map((s) =>
          s._id === categoryId ? { ...s, items: nextItems } : s
        )
      );
      setNewSkillText({ ...newSkillText, [categoryId]: '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setToast({ type: 'error', message: msg });
    }
  };

  const handleRemoveItem = async (categoryId: string, itemIndex: number) => {
    const targetCategory = skills.find((s) => s._id === categoryId);
    if (!targetCategory) return;

    const nextItems = targetCategory.items.filter((_, i) => i !== itemIndex);

    try {
      const res = await fetch(`/api/skills/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: nextItems }),
      });

      if (!res.ok) throw new Error('Failed to remove skill item');

      setSkills(
        skills.map((s) =>
          s._id === categoryId ? { ...s, items: nextItems } : s
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Operation failed';
      setToast({ type: 'error', message: msg });
    }
  };

  return (
    <div className="space-y-6">
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

      {/* Add New Category Header Bar */}
      <form
        onSubmit={handleAddCategory}
        className="border border-telemetry-border bg-substrate-surface p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
      >
        <span className="telemetry-tag text-signal shrink-0">
          + NEW TAXONOMY:
        </span>
        <input
          type="text"
          required
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="e.g. Distributed Infrastructure & Networking"
          className="flex-1 bg-substrate border border-telemetry-border px-3 py-1.5 text-xs font-mono text-white focus:border-signal outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="brutalist-btn brutalist-btn-accent text-xs py-1.5 px-4 shrink-0 flex items-center gap-1.5"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
          CREATE CATEGORY
        </button>
      </form>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((cat, idx) => (
          <div
            key={cat._id || idx}
            className="border border-telemetry-border bg-substrate-surface p-5 space-y-4"
          >
            {/* Category Header */}
            <div className="flex items-center justify-between border-b border-telemetry-border/60 pb-3">
              {editingCategory && editingCategory.id === cat._id ? (
                <div className="flex items-center gap-2 flex-1 mr-2">
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    }
                    className="flex-1 bg-substrate border border-signal px-2 py-1 text-xs font-mono text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleUpdateCategoryTitle(cat._id!, editingCategory.name)
                    }
                    className="brutalist-btn text-xs py-1 px-2"
                  >
                    <Save className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="p-1 text-telemetry-muted hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-signal">
                    0{idx + 1}
                  </span>
                  <h3 className="font-mono text-xs font-bold uppercase text-white tracking-wide">
                    {cat.category}
                  </h3>
                </div>
              )}

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setEditingCategory({ id: cat._id!, name: cat.category })
                  }
                  className="p-1 text-telemetry-muted hover:text-white"
                  title="Rename category"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cat._id!, cat.category)}
                  className="p-1 text-telemetry-muted hover:text-signal"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Chips List */}
            <div className="flex flex-wrap gap-2 min-h-[48px]">
              {cat.items.length === 0 ? (
                <span className="text-[11px] font-mono text-telemetry-faint italic py-1">
                  No skills added in this category.
                </span>
              ) : (
                cat.items.map((item, itemIdx) => (
                  <span
                    key={itemIdx}
                    className="inline-flex items-center gap-1.5 border border-telemetry-border bg-substrate px-2.5 py-1 text-xs font-mono text-white group"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(cat._id!, itemIdx)}
                      className="text-telemetry-faint group-hover:text-signal transition-colors"
                      title={`Remove ${item}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Add Skill Item Input */}
            <div className="pt-2 border-t border-telemetry-border/40 flex gap-2">
              <input
                type="text"
                value={newSkillText[cat._id!] || ''}
                onChange={(e) =>
                  setNewSkillText({
                    ...newSkillText,
                    [cat._id!]: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddItem(cat._id!);
                  }
                }}
                placeholder="Add skill (e.g. Docker, eBPF)..."
                className="flex-1 bg-substrate border border-telemetry-border px-2.5 py-1 text-xs font-mono text-white focus:border-signal outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddItem(cat._id!)}
                className="brutalist-btn text-xs py-1 px-3"
              >
                + Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
