import { connectDB } from '@/lib/db';
import { Settings } from '@/models/Settings';
import { fallbackSettings } from '@/lib/fallbackData';
import { SettingsForm } from '@/components/admin/SettingsForm';

export default async function AdminSettingsPage() {
  let settings = fallbackSettings;

  try {
    await connectDB();
    const doc = await Settings.findById('main').lean();
    if (doc) {
      settings = JSON.parse(JSON.stringify(doc));
    }
  } catch (error) {
    console.warn('Failed to load settings from DB, using fallback:', error);
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-telemetry-border pb-4">
        <span className="telemetry-tag text-signal">
          [ SYSTEM ARCHITECTURE // SETTINGS ]
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
          Site & AI Telemetry Configuration
        </h1>
        <p className="text-xs font-mono text-telemetry-muted">
          Calibrate theme substrate colors, hero statements, homepage section visibility, and digital twin AI keys.
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}
