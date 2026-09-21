import { BackupManager } from '@/components/admin/BackupManager';

export default function AdminBackupPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-telemetry-border pb-4">
        <span className="telemetry-tag text-signal">
          [ DISASTER RECOVERY // PERSISTENCE ]
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
          Backup & Snapshot Recovery
        </h1>
        <p className="text-xs font-mono text-telemetry-muted">
          Export your entire portfolio state as raw JSON or restore collections directly into MongoDB Atlas.
        </p>
      </div>

      <BackupManager />
    </div>
  );
}
