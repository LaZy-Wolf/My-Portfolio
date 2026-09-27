import fs from 'node:fs';
import mongoose from 'mongoose';

// Content lives in one file shared with the site's offline fallback (src/lib/fallbackData.ts).
const content = JSON.parse(
  fs.readFileSync(new URL('../src/content/portfolio.json', import.meta.url), 'utf8')
);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolionow';

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;
  const now = new Date();

  await db.collection('profiles').updateOne(
    { _id: 'main' },
    { $set: { ...content.profile, updatedAt: now } },
    { upsert: true }
  );
  console.log('Profile seeded.');

  await db.collection('projects').deleteMany({});
  await db
    .collection('projects')
    .insertMany(content.projects.map((p) => ({ ...p, createdAt: now, updatedAt: now })));
  console.log(`Projects seeded (${content.projects.length}).`);

  await db.collection('skills').deleteMany({});
  await db
    .collection('skills')
    .insertMany(content.skills.map((s) => ({ ...s, createdAt: now, updatedAt: now })));
  console.log(`Skills seeded (${content.skills.length} categories).`);

  await db.collection('settings').updateOne(
    { _id: 'main' },
    { $set: { ...content.settings, updatedAt: now } },
    { upsert: true }
  );
  console.log('Settings seeded.');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
