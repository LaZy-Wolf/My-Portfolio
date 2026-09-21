'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Link as LinkIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: 'square' | 'video' | 'any';
}

export function ImageUpload({
  value,
  onChange,
  label = 'Asset Upload',
  aspectRatio = 'video',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirectInput, setIsDirectInput] = useState(false);
  const [directUrl, setDirectUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.secure_url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDirectUrlApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (directUrl.trim()) {
      onChange(directUrl.trim());
      setDirectUrl('');
      setIsDirectInput(false);
    }
  };

  const aspectClasses = {
    square: 'aspect-square max-w-[200px]',
    video: 'aspect-video max-w-md',
    any: 'min-h-[160px] max-w-md',
  }[aspectRatio];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="telemetry-tag text-telemetry-muted">{label}</label>
        <button
          type="button"
          onClick={() => setIsDirectInput(!isDirectInput)}
          className="text-xs font-mono text-telemetry-muted hover:text-white flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          {isDirectInput ? 'Use File Upload' : 'Paste Direct URL'}
        </button>
      </div>

      {isDirectInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 bg-substrate-surface border border-telemetry-border px-3 py-2 text-xs font-mono text-white focus:border-signal outline-none"
          />
          <button
            type="button"
            onClick={handleDirectUrlApply}
            className="brutalist-btn text-xs py-1"
          >
            Apply
          </button>
        </div>
      ) : value ? (
        <div className={`relative border border-telemetry-border bg-substrate-surface overflow-hidden ${aspectClasses}`}>
          <Image
            src={value}
            alt="Asset Preview"
            fill
            className="object-cover"
            unoptimized={value.startsWith('data:')}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-substrate/80 text-white p-1 border border-telemetry-border hover:bg-signal transition-colors"
            title="Remove asset"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed border-telemetry-border hover:border-signal bg-substrate-surface flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-colors ${aspectClasses}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 text-signal animate-spin" />
              <span className="telemetry-tag text-telemetry-muted">UPLOADING ASSET...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-telemetry-muted" />
              <span className="telemetry-tag text-white">CLICK TO SELECT ASSET</span>
              <span className="text-[10px] font-mono text-telemetry-faint">
                JPG, PNG, WEBP, SVG &bull; MAX 5MB
              </span>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs font-mono text-signal">
          [ ERROR: {error} ]
        </p>
      )}
    </div>
  );
}
