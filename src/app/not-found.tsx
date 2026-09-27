import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[88rem] flex-col justify-center px-5 sm:px-8 lg:px-10">
      <div className="flex h-[19px] w-full max-w-[28rem] items-center" aria-hidden>
        <span className="h-[6px] flex-1 rounded-full bg-line-red" />
        <span className="h-[6px] w-24 rounded-full bg-[repeating-linear-gradient(90deg,rgb(var(--line-red)/0.45)_0_10px,transparent_10px_18px)]" />
        <span className="h-[19px] w-[19px] rounded-full bg-paper shadow-[inset_0_0_0_4.5px_rgb(var(--ink-3))]" />
      </div>
      <h1 className="mt-10 text-[clamp(2.5rem,1.5rem+3.5vw,4rem)] font-bold leading-[1] tracking-[-0.035em]">
        This stop is not on the map.
      </h1>
      <p className="mt-5 max-w-[34rem] text-[1.125rem] leading-relaxed text-ink-2">
        The page may have moved, or the link has a typo. The work is still where it was.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn-ink">
          Back to the start
        </Link>
        <Link href="/#work" className="btn-quiet">
          See the work
        </Link>
      </div>
    </main>
  );
}
