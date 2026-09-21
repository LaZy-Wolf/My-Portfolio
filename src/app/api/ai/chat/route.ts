import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Profile } from '@/models/Profile';
import { Project } from '@/models/Project';
import { Skill } from '@/models/Skill';
import { Settings } from '@/models/Settings';
import { fallbackProfile, fallbackProjects, fallbackSkills } from '@/lib/fallbackData';
import { generateAIResponse } from '@/lib/ai';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Rate-limiting check: limit message length to 500 characters
    const sanitizedMessage = message.trim().slice(0, 500);

    let profile: any = fallbackProfile;
    let projects: any[] = fallbackProjects;
    let skills: any[] = fallbackSkills;
    let preferredProvider = 'groq';

    try {
      await connectDB();
      const [dbProfile, dbProjects, dbSkills, dbSettings] = await Promise.all([
        Profile.findById('main').lean(),
        Project.find({ status: 'published' }).sort({ order: 1 }).lean(),
        Skill.find().sort({ order: 1 }).lean(),
        Settings.findById('main').lean(),
      ]);

      if (dbProfile) profile = dbProfile;
      if (dbProjects && dbProjects.length > 0) projects = dbProjects;
      if (dbSkills && dbSkills.length > 0) skills = dbSkills;
      if (dbSettings?.ai?.provider) preferredProvider = dbSettings.ai.provider;
    } catch (dbErr) {
      console.warn('DB query failed during AI context assembly, using fallback data:', dbErr);
    }

    const aiResult = await generateAIResponse(
      sanitizedMessage,
      { profile, projects, skills },
      preferredProvider
    );

    return NextResponse.json(aiResult);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'AI chat processing error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
