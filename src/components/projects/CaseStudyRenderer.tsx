import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { ICaseStudyBlock } from '@/models/Project';
import { slugify } from '@/lib/utils';

export function headingsOf(blocks: ICaseStudyBlock[] = []) {
  return blocks
    .filter((b) => b.type === 'heading' && b.content)
    .map((b) => ({ id: slugify(b.content!), text: b.content! }));
}

const figure = 'relative overflow-hidden rounded-[14px] bg-ink/[0.05] ring-1 ring-rule';
const unoptimized = (src: string) => src.startsWith('data:');

export function CaseStudyRenderer({ blocks }: { blocks: ICaseStudyBlock[] }) {
  if (!blocks?.length) {
    return (
      <p className="text-[1.0625rem] leading-relaxed text-ink-2">
        The write-up for this project is on its way. The code and the summary above are the best source for now.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {blocks.map((block, idx) => {
        const key = block.id || idx;
        switch (block.type) {
          case 'heading':
            return (
              <h2
                key={key}
                id={slugify(block.content || '')}
                className="scroll-mt-24 pt-10 text-[1.75rem] font-bold leading-tight tracking-[-0.02em] first:pt-0 md:text-[2rem]"
              >
                {block.content}
              </h2>
            );

          case 'paragraph':
            return (
              <p key={key} className="whitespace-pre-line text-[1.0625rem] leading-[1.7] text-ink-2 md:text-[1.125rem]">
                {block.content}
              </p>
            );

          case 'image':
            if (!block.imageUrl) return null;
            return (
              <figure key={key} className="!my-10 space-y-3">
                <div className={`${figure} aspect-[16/10]`}>
                  <Image
                    src={block.imageUrl}
                    alt={block.caption || ''}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 46rem"
                    unoptimized={unoptimized(block.imageUrl)}
                  />
                </div>
                {block.caption && <figcaption className="text-[0.875rem] text-ink-2">{block.caption}</figcaption>}
              </figure>
            );

          case 'gallery':
            if (!block.galleryUrls?.length) return null;
            return (
              <figure key={key} className="!my-10 space-y-3">
                <div className={`grid gap-4 ${block.galleryUrls.length > 1 ? 'sm:grid-cols-2' : ''}`}>
                  {block.galleryUrls.map((src, i) => (
                    <div key={i} className={`${figure} aspect-[4/3]`}>
                      <Image
                        src={src}
                        alt={block.caption ? `${block.caption}, ${i + 1}` : ''}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 23rem"
                        unoptimized={unoptimized(src)}
                      />
                    </div>
                  ))}
                </div>
                {block.caption && <figcaption className="text-[0.875rem] text-ink-2">{block.caption}</figcaption>}
              </figure>
            );

          case 'table':
            return <DataTable key={key} content={block.content || ''} caption={block.caption} />;

          case 'quote':
            // The one line that matters in this section.
            return (
              <figure key={key} className="!my-10">
                <span className="mb-4 flex h-[18px] w-10 items-center" aria-hidden>
                  <span className="h-[5px] w-full rounded-full" style={{ background: 'rgb(var(--line))' }} />
                </span>
                <blockquote className="text-[1.5rem] font-semibold leading-snug tracking-[-0.015em] text-ink md:text-[1.75rem]">
                  {block.quote}
                </blockquote>
                {block.author && <figcaption className="mt-3 text-[0.875rem] text-ink-2">{block.author}</figcaption>}
              </figure>
            );

          case 'metric':
            return (
              <div key={key} className="!my-8 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-y border-rule py-5">
                <span className="num text-[2rem] font-bold tracking-[-0.02em]">{block.value}</span>
                <span className="text-[0.9375rem] text-ink-2">{block.label}</span>
              </div>
            );

          case 'link': {
            // Consecutive links share one row: the first is the main action, the rest are quieter.
            if (blocks[idx - 1]?.type === 'link') return null;
            const run: ICaseStudyBlock[] = [];
            for (let i = idx; blocks[i]?.type === 'link'; i++) if (blocks[i].url) run.push(blocks[i]);
            if (!run.length) return null;
            return (
              <p key={key} className="flex flex-wrap gap-3 pt-6">
                {run.map((b, i) => (
                  <a key={b.url} href={b.url} target="_blank" rel="noopener noreferrer" className={i ? 'btn-quiet' : 'btn-ink'}>
                    {b.label || 'Open link'}
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden />
                  </a>
                ))}
              </p>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}

function DataTable({ content, caption }: { content: string; caption?: string }) {
  const rows = content
    .split('\n')
    .map((r) => r.split('|').map((c) => c.trim()))
    .filter((r) => r.some(Boolean));
  if (rows.length < 2) return null;
  const [head, ...body] = rows;
  const numeric = (c: string) => /^[<>~]?\s*[\d.,]+\s*(ms|s|%|x)?$/i.test(c);

  return (
    <figure className="!my-10">
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0" data-lenis-prevent>
        <table className="w-full min-w-[34rem] border-collapse text-[0.9375rem]">
          <thead>
            <tr className="border-b-2 border-ink">
              {head.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`whitespace-nowrap py-2.5 pr-4 font-semibold last:pr-0 ${i === 0 ? 'text-left' : 'text-right'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {body.map((row, r) => (
              <tr key={r} className="border-b border-rule">
                {head.map((_, i) => {
                  const cell = row[i] ?? '';
                  const Cell = i === 0 ? 'th' : 'td';
                  return (
                    <Cell
                      key={i}
                      scope={i === 0 ? 'row' : undefined}
                      className={`py-3 pr-4 last:pr-0 ${
                        i === 0 ? 'text-left font-medium text-ink' : 'num text-right text-ink-2'
                      } ${numeric(cell) ? 'num' : ''}`}
                    >
                      {cell}
                    </Cell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <figcaption className="mt-3 text-[0.875rem] leading-relaxed text-ink-2">{caption}</figcaption>}
    </figure>
  );
}
