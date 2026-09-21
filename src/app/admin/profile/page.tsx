import { connectDB } from '@/lib/db';
import { Profile } from '@/models/Profile';
import { fallbackProfile } from '@/lib/fallbackData';
import { ProfileForm } from '@/components/admin/ProfileForm';

export default async function AdminProfilePage() {
  let profileData = fallbackProfile;

  try {
    await connectDB();
    const doc = await Profile.findById('main').lean();
    if (doc) {
      profileData = JSON.parse(JSON.stringify(doc));
    }
  } catch (error) {
    console.warn('Failed to load profile from DB, using fallback:', error);
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-telemetry-border pb-4">
        <span className="telemetry-tag text-signal">
          [ METADATA CONFIGURATION // PROFILE ]
        </span>
        <h1 className="text-2xl font-black uppercase tracking-tight text-white mt-1">
          Profile & Philosophy Editor
        </h1>
        <p className="text-xs font-mono text-telemetry-muted">
          Update public identity, bio narrative, design manifesto, and social telemetry endpoints.
        </p>
      </div>

      <ProfileForm initialProfile={profileData} />
    </div>
  );
}
