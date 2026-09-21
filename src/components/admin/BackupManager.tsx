'use client';

import { useState, useRef } from 'react';
import {
  Download,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Database,
  ShieldCheck,
} from 'lucide-react';

export function BackupManager() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setStatus(null);

    try {
      const res = await fetch('/api/export');
      if (!res.ok) {
        throw new Error('Export generation failed');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `portfolio-telemetry-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setStatus({
        type: 'success',
        message: 'DATABASE TELEMETRY EXPORT GENERATED AND DOWNLOADED',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Export failed';
      setStatus({ type: 'error', message: msg });
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      '[ WARNING: RESTORATION ACTION ] This will overwrite existing MongoDB collections with the contents of this JSON file. Proceed?'
    );
    if (!confirmed) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsImporting(true);
    setStatus(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Import failed');
      }

      setStatus({
        type: 'success',
        message: 'DATABASE TELEMETRY RESTORED FROM JSON SNAPSHOT',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid backup JSON file';
      setStatus({ type: 'error', message: msg });
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-4">
          <div className="flex items-center gap-2 text-signal">
            <Download className="w-5 h-5" />
            <span className="telemetry-tag text-signal">PROTOCOL: DATA EXTRACTION</span>
          </div>
          <h2 className="text-base font-black uppercase text-white tracking-tight">
            Export JSON Telemetry Snapshot
          </h2>
          <p className="text-xs font-mono text-telemetry-muted leading-relaxed">
            Download a portable JSON payload containing all active Profile biography, published & draft Projects, Skill taxonomies, and Site parameters. Store this file safely for off-site disaster recovery.
          </p>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="brutalist-btn brutalist-btn-accent w-full py-3 flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                GENERATING DUMP...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                DOWNLOAD JSON BACKUP
              </>
            )}
          </button>
        </div>

        {/* Import Card */}
        <div className="border border-telemetry-border bg-substrate-surface p-6 space-y-4">
          <div className="flex items-center gap-2 text-terminal">
            <Upload className="w-5 h-5" />
            <span className="telemetry-tag text-terminal">PROTOCOL: DATA RESTORATION</span>
          </div>
          <h2 className="text-base font-black uppercase text-white tracking-tight">
            Restore From JSON Snapshot
          </h2>
          <p className="text-xs font-mono text-telemetry-muted leading-relaxed">
            Upload a verified `.json` backup file to repopulate your MongoDB collections. This completely restores all database documents and replaces the current operational state.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileSelected}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="brutalist-btn w-full py-3 flex items-center justify-center gap-2 hover:border-signal"
          >
            {isImporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                RESTORING DATABASE...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                SELECT BACKUP FILE (.JSON)
              </>
            )}
          </button>
        </div>
      </div>

      {/* Safety & Redundancy Protocol Notice */}
      <div className="border border-telemetry-border bg-substrate p-5 flex items-start gap-4">
        <ShieldCheck className="w-6 h-6 text-terminal shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-mono text-xs uppercase font-bold text-white">
            Zero-Vendor Lock-In Assurance
          </h3>
          <p className="text-[11px] font-mono text-telemetry-muted leading-relaxed">
            All data exported adheres strictly to open, unencrypted JSON specifications. If you ever switch database providers or migrate away from MongoDB Atlas M0, your content can be seamlessly ingested into any database without data conversion loss.
          </p>
        </div>
      </div>
    </div>
  );
}
