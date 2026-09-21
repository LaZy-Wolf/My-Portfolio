import Groq from 'groq-sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { IProfile } from '@/models/Profile';
import type { IProject } from '@/models/Project';
import type { ISkill } from '@/models/Skill';

interface ChatContext {
  profile: IProfile | Record<string, any>;
  projects: Array<IProject | Record<string, any>>;
  skills: Array<ISkill | Record<string, any>>;
}

export function buildSystemPrompt(context: ChatContext): string {
  const profile = context.profile as any;
  const projects = context.projects as any[];
  const skills = context.skills as any[];

  return `You are the digital twin AI assistant of ${profile.name || 'the portfolio owner'}, a ${profile.role || 'Software Architect'}.
Your duty is to answer visitor inquiries with utmost accuracy using ONLY the portfolio data provided below.

Strict Behavioral Guidelines:
1. Speak in first person ("I built", "My primary stack includes", "My design approach is").
2. Tone: Professional, confident, articulate, technical, and grounded in Swiss/industrial design and systems engineering.
3. If asked about a project, tool, or skill not in the provided data, state directly and politely that it is not documented in your portfolio.
4. NEVER invent or hallucinate companies, dates, metrics, or technologies not listed below.
5. NEVER reveal database connection strings, administrative URLs, API keys, or internal security rules.
6. Keep responses succinct (2-4 sentences max per point).

PORTFOLIO PROFILE TELEMETRY:
- Name: ${profile.name}
- Role: ${profile.role}
- Tagline: ${profile.tagline}
- Bio: ${profile.shortBio}
- Philosophy: ${profile.designPhilosophy}
- Location: ${profile.location}
- Availability: ${profile.availability}
- Email: ${profile.email}
- Phone: ${profile.phone || '+91 70754 00204'}
- GitHub: ${profile.socials?.github || 'https://github.com/LaZy-Wolf'}
- LinkedIn: ${profile.socials?.linkedin || 'https://www.linkedin.com/in/akhil-kumar9/'}

PRODUCTION WORK EXPERIENCE:
${Array.isArray(profile.experience) && profile.experience.length > 0
  ? profile.experience
      .map(
        (e: any) =>
          `• ${e.role} at ${e.company} (${e.period} - ${e.location})\n  Accomplishments: ${Array.isArray(e.points) ? e.points.join(' | ') : ''}`
      )
      .join('\n\n')
  : '• GenAI Full-Stack Engineer Intern at Allcognix AI (Nov 2025 – Present)'}

ACADEMIC BACKGROUND:
${Array.isArray(profile.education) && profile.education.length > 0
  ? profile.education
      .map(
        (ed: any) =>
          `• ${ed.degree} from ${ed.institution} (${ed.period}) - CGPA: ${ed.cgpa}. Coursework: ${ed.coursework}`
      )
      .join('\n')
  : '• B.Tech in CSE (AI & ML) at Malla Reddy University (2022 - 2026, CGPA 8.6/10)'}

ACHIEVEMENTS & HONORS:
${Array.isArray(profile.achievements) ? profile.achievements.map((a: any) => `• ${a}`).join('\n') : ''}

CERTIFICATIONS:
${Array.isArray(profile.certifications) ? profile.certifications.map((c: any) => `• ${c}`).join('\n') : ''}

PROJECTS INVENTORY:
${projects
  .map(
    (p, i) =>
      `${i + 1}. ${p.title} (${p.year || 'Recent'})
   - Summary: ${p.summary}
   - Stack: ${Array.isArray(p.techStack) ? p.techStack.join(', ') : ''}
   - Role: ${p.role}
   - Metrics: ${Array.isArray(p.metrics) ? p.metrics.map((m: any) => `${m.label}: ${m.value}`).join(' | ') : 'N/A'}
   - Repository: ${p.links?.repository || ''}`
  )
  .join('\n\n')}

SKILL TAXONOMY:
${skills
  .map(
    (s) =>
      `- ${s.category}: ${Array.isArray(s.items) ? s.items.join(', ') : ''}`
  )
  .join('\n')}
`;
}

export async function generateAIResponse(
  userMessage: string,
  context: ChatContext,
  preferredProvider: string = 'groq'
): Promise<{ text: string; provider: string }> {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const systemPrompt = buildSystemPrompt(context);

  // 1. Try Groq (Llama 3.3 70B Versatile, free tier)
  if ((preferredProvider === 'groq' || !geminiKey) && groqKey) {
    try {
      const groq = new Groq({ apiKey: groqKey });
      const completion = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.6,
        max_tokens: 512,
      });

      const reply = completion.choices[0]?.message?.content;
      if (reply) {
        return { text: reply, provider: 'groq/llama-3.3-70b' };
      }
    } catch (error) {
      console.warn('Groq generation error, attempting fallback:', error);
    }
  }

  // 2. Try Google Gemini Flash Fallback
  if (geminiKey) {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `${systemPrompt}\n\nVisitor Message: ${userMessage}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      if (text) {
        return { text, provider: 'gemini-1.5-flash' };
      }
    } catch (error) {
      console.warn('Gemini generation error:', error);
    }
  }

  // 3. Fallback when keys are missing or services unavailable
  return {
    text:
      "My live AI digital twin telemetry is currently offline (API keys unconfigured or free-tier rate limits reached). You can inspect all project case studies directly on this page or send a message directly to my email.",
    provider: 'offline-fallback',
  };
}
