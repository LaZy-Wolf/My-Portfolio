'use client';

import { useState } from 'react';
import type { ICaseStudyBlock } from '@/models/Project';
import { ImageUpload } from '@/components/admin/ImageUpload';
import {
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Heading,
  AlignLeft,
  Image as ImageIcon,
  Quote,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';

interface BlockEditorProps {
  blocks: ICaseStudyBlock[];
  onChange: (blocks: ICaseStudyBlock[]) => void;
}

export function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [activeType, setActiveType] = useState<ICaseStudyBlock['type']>('paragraph');

  const addBlock = (type: ICaseStudyBlock['type']) => {
    const newBlock: ICaseStudyBlock = {
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type,
      content: '',
      imageUrl: '',
      galleryUrls: [],
      caption: '',
      quote: '',
      author: '',
      label: '',
      value: '',
      url: '',
    };
    onChange([...blocks, newBlock]);
  };

  const updateBlock = (index: number, updates: Partial<ICaseStudyBlock>) => {
    const next = [...blocks];
    next[index] = { ...next[index], ...updates };
    onChange(next);
  };

  const removeBlock = (index: number) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return;
    }
    const next = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-telemetry-border/60 pb-3">
        <div>
          <span className="telemetry-tag text-signal">[ MODULAR CONTENT ENGINE ]</span>
          <h3 className="text-sm font-mono uppercase font-bold text-white mt-0.5">
            Case Study Narrative Blocks
          </h3>
        </div>
        <span className="telemetry-tag text-telemetry-muted">
          {blocks.length} BLOCKS ACTIVE
        </span>
      </div>

      {/* Block List */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="p-8 border border-dashed border-telemetry-border text-center space-y-2">
            <p className="text-xs font-mono text-telemetry-muted">
              NO CASE STUDY BLOCKS ADDED YET.
            </p>
            <p className="text-[11px] font-mono text-telemetry-faint">
              Add headings, deep-dive paragraphs, high-res images, quotes, or metrics below.
            </p>
          </div>
        ) : (
          blocks.map((block, index) => (
            <div
              key={block.id || index}
              className="border border-telemetry-border bg-substrate p-4 space-y-3 relative group"
            >
              {/* Block Header Toolbar */}
              <div className="flex items-center justify-between border-b border-telemetry-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <span className="telemetry-tag text-signal font-bold">
                    #{index + 1}
                  </span>
                  <span className="telemetry-tag bg-substrate-surface px-2 py-0.5 text-telemetry-muted border border-telemetry-border">
                    {block.type.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveBlock(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-telemetry-muted hover:text-white disabled:opacity-30"
                    title="Move block up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveBlock(index, 'down')}
                    disabled={index === blocks.length - 1}
                    className="p-1 text-telemetry-muted hover:text-white disabled:opacity-30"
                    title="Move block down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeBlock(index)}
                    className="p-1 text-telemetry-muted hover:text-signal ml-2"
                    title="Delete block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Block Content Inputs */}
              {block.type === 'heading' && (
                <div>
                  <label className="telemetry-tag text-telemetry-muted">Section Heading</label>
                  <input
                    type="text"
                    value={block.content || ''}
                    onChange={(e) => updateBlock(index, { content: e.target.value })}
                    placeholder="e.g. Architectural Foundations & Throughput"
                    className="w-full bg-substrate-surface border border-telemetry-border px-3 py-2 text-sm font-mono text-white focus:border-signal outline-none"
                  />
                </div>
              )}

              {block.type === 'paragraph' && (
                <div>
                  <label className="telemetry-tag text-telemetry-muted">Narrative Body</label>
                  <textarea
                    rows={4}
                    value={block.content || ''}
                    onChange={(e) => updateBlock(index, { content: e.target.value })}
                    placeholder="Detail the technical hurdles, design solutions, performance profiling, and tradeoffs..."
                    className="w-full bg-substrate-surface border border-telemetry-border p-3 text-sm font-mono text-white focus:border-signal outline-none"
                  />
                </div>
              )}

              {block.type === 'image' && (
                <div className="space-y-3">
                  <ImageUpload
                    label="Case Study Visual"
                    value={block.imageUrl || ''}
                    onChange={(url) => updateBlock(index, { imageUrl: url })}
                  />
                  <div>
                    <label className="telemetry-tag text-telemetry-muted">Technical Caption</label>
                    <input
                      type="text"
                      value={block.caption || ''}
                      onChange={(e) => updateBlock(index, { caption: e.target.value })}
                      placeholder="e.g. FIG 01: Telemetry pipeline stream buffer graph."
                      className="w-full bg-substrate-surface border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
                    />
                  </div>
                </div>
              )}

              {block.type === 'quote' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="md:col-span-2">
                    <label className="telemetry-tag text-telemetry-muted">Quote Text</label>
                    <textarea
                      rows={2}
                      value={block.quote || ''}
                      onChange={(e) => updateBlock(index, { quote: e.target.value })}
                      placeholder="e.g. The new pipeline eliminated our 3am alert fatigue entirely."
                      className="w-full bg-substrate-surface border border-telemetry-border p-2.5 text-xs font-mono text-white focus:border-signal outline-none"
                    />
                  </div>
                  <div>
                    <label className="telemetry-tag text-telemetry-muted">Author & Title</label>
                    <input
                      type="text"
                      value={block.author || ''}
                      onChange={(e) => updateBlock(index, { author: e.target.value })}
                      placeholder="e.g. Sarah Connor, VP of Reliability"
                      className="w-full bg-substrate-surface border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
                    />
                  </div>
                </div>
              )}

              {block.type === 'metric' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="telemetry-tag text-telemetry-muted">Metric Label</label>
                    <input
                      type="text"
                      value={block.label || ''}
                      onChange={(e) => updateBlock(index, { label: e.target.value })}
                      placeholder="e.g. Ingestion Latency"
                      className="w-full bg-substrate-surface border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
                    />
                  </div>
                  <div>
                    <label className="telemetry-tag text-telemetry-muted">Value / Figure</label>
                    <input
                      type="text"
                      value={block.value || ''}
                      onChange={(e) => updateBlock(index, { value: e.target.value })}
                      placeholder="e.g. < 1.4ms (99th pct)"
                      className="w-full bg-substrate-surface border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
                    />
                  </div>
                </div>
              )}

              {block.type === 'link' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="telemetry-tag text-telemetry-muted">Link Label</label>
                    <input
                      type="text"
                      value={block.label || ''}
                      onChange={(e) => updateBlock(index, { label: e.target.value })}
                      placeholder="e.g. View Live System Demo"
                      className="w-full bg-substrate-surface border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
                    />
                  </div>
                  <div>
                    <label className="telemetry-tag text-telemetry-muted">Destination URL</label>
                    <input
                      type="url"
                      value={block.url || ''}
                      onChange={(e) => updateBlock(index, { url: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-substrate-surface border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Block Adder Palette */}
      <div className="border border-telemetry-border bg-substrate-surface p-4 space-y-3">
        <span className="telemetry-tag text-telemetry-muted block">
          INSERT NEW BLOCK
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => addBlock('heading')}
            className="brutalist-btn text-xs py-1.5 flex items-center gap-1.5"
          >
            <Heading className="w-3.5 h-3.5" /> + Heading
          </button>
          <button
            type="button"
            onClick={() => addBlock('paragraph')}
            className="brutalist-btn text-xs py-1.5 flex items-center gap-1.5"
          >
            <AlignLeft className="w-3.5 h-3.5" /> + Paragraph
          </button>
          <button
            type="button"
            onClick={() => addBlock('image')}
            className="brutalist-btn text-xs py-1.5 flex items-center gap-1.5"
          >
            <ImageIcon className="w-3.5 h-3.5" /> + Image
          </button>
          <button
            type="button"
            onClick={() => addBlock('quote')}
            className="brutalist-btn text-xs py-1.5 flex items-center gap-1.5"
          >
            <Quote className="w-3.5 h-3.5" /> + Quote
          </button>
          <button
            type="button"
            onClick={() => addBlock('metric')}
            className="brutalist-btn text-xs py-1.5 flex items-center gap-1.5"
          >
            <TrendingUp className="w-3.5 h-3.5" /> + Metric
          </button>
          <button
            type="button"
            onClick={() => addBlock('link')}
            className="brutalist-btn text-xs py-1.5 flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" /> + Link
          </button>
        </div>
      </div>
    </div>
  );
}
