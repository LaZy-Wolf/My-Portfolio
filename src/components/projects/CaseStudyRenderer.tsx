import Image from 'next/image';
import type { ICaseStudyBlock } from '@/models/Project';
import { ExternalLink, Quote, TrendingUp } from 'lucide-react';

interface CaseStudyRendererProps {
  blocks: ICaseStudyBlock[];
}

export function CaseStudyRenderer({ blocks }: CaseStudyRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="p-8 border border-dashed border-telemetry-border text-center font-mono text-xs text-telemetry-muted">
        [ CASE STUDY DETAILS CURRENTLY BEING COMPILED FOR THIS DEPLOYMENT ]
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-4xl">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={block.id || idx}
                className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white pt-6 border-t border-telemetry-border/40 first:border-t-0 first:pt-0"
              >
                {block.content}
              </h2>
            );

          case 'paragraph':
            return (
              <p
                key={block.id || idx}
                className="text-sm sm:text-base font-mono text-telemetry-muted leading-relaxed whitespace-pre-line"
              >
                {block.content}
              </p>
            );

          case 'image':
            if (!block.imageUrl) return null;
            return (
              <figure key={block.id || idx} className="space-y-2">
                <div className="relative aspect-video w-full border border-telemetry-border bg-substrate-surface overflow-hidden">
                  <Image
                    src={block.imageUrl}
                    alt={block.caption || 'Case study illustration'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 800px"
                    unoptimized={block.imageUrl.startsWith('data:')}
                  />
                </div>
                {block.caption && (
                  <figcaption className="text-xs font-mono text-telemetry-muted">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'gallery':
            if (!block.galleryUrls || block.galleryUrls.length === 0) return null;
            return (
              <div key={block.id || idx} className="space-y-3">
                <div className={`grid grid-cols-1 ${block.galleryUrls.length > 1 ? 'sm:grid-cols-2' : ''} gap-4`}>
                  {block.galleryUrls.map((gUrl, gIdx) => (
                    <div key={gIdx} className="relative aspect-video w-full border border-telemetry-border bg-substrate-surface overflow-hidden">
                      <Image
                        src={gUrl}
                        alt={`${block.caption || 'Gallery asset'} ${gIdx + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1200px) 100vw, 400px"
                        unoptimized={gUrl.startsWith('data:')}
                      />
                    </div>
                  ))}
                </div>
                {block.caption && (
                  <p className="text-xs font-mono text-telemetry-muted">
                    {block.caption}
                  </p>
                )}
              </div>
            );

          case 'quote':
            return (
              <div
                key={block.id || idx}
                className="border-l-2 border-signal bg-substrate-surface p-6 space-y-2 relative"
              >
                <Quote className="w-5 h-5 text-signal opacity-60 mb-1" />
                <p className="font-mono text-sm sm:text-base text-white italic leading-relaxed">
                  &ldquo;{block.quote}&rdquo;
                </p>
                {block.author && (
                  <div className="text-xs font-mono text-telemetry-muted pt-1">
                    &mdash; {block.author}
                  </div>
                )}
              </div>
            );

          case 'metric':
            return (
              <div
                key={block.id || idx}
                className="border border-telemetry-border bg-substrate-surface p-6 flex items-center justify-between"
              >
                <div>
                  <span className="telemetry-tag text-telemetry-muted block">
                    {block.label || 'PERFORMANCE OBSERVATION'}
                  </span>
                  <div className="text-2xl sm:text-4xl font-mono font-black text-white mt-1">
                    {block.value}
                  </div>
                </div>
                <TrendingUp className="w-8 h-8 text-signal opacity-60" />
              </div>
            );

          case 'link':
            if (!block.url) return null;
            return (
              <div key={block.id || idx} className="pt-2">
                <a
                  href={block.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutalist-btn brutalist-btn-accent text-xs py-3 px-6 inline-flex items-center gap-2"
                >
                  <span>{block.label || 'VISIT EXTERNAL RESOURCE'}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
