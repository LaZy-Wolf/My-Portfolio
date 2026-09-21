import { MetadataRoute } from 'next';
import { connectDB } from '@/lib/db';
import { Project } from '@/models/Project';
import { fallbackProjects } from '@/lib/fallbackData';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  let projectSlugs: string[] = fallbackProjects.map((p) => p.slug);

  try {
    await connectDB();
    const docs = await Project.find({ status: 'published' }).select('slug updatedAt').lean();
    if (docs && docs.length > 0) {
      projectSlugs = docs.map((d) => d.slug);
    }
  } catch {
    // Keep fallback slugs
  }

  const projectEntries: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...projectEntries,
  ];
}
