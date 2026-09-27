'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

/** The hero portrait. Clicking it opens the full photo in a native dialog (Esc or a click outside closes it). */
export function Portrait({ src, name }: { src: string; name: string }) {
  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        className="group shrink-0 rounded-full outline-offset-4"
        aria-label={`Open full photo of ${name}`}
      >
        <Image
          src={src}
          alt={`Portrait of ${name}`}
          width={120}
          height={120}
          priority
          className="h-24 w-24 rounded-full object-cover object-top ring-1 ring-rule transition-transform duration-300 ease-out group-hover:scale-[1.04] md:h-[7.25rem] md:w-[7.25rem]"
        />
      </button>
      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="portrait-dialog"
        aria-label={`Photo of ${name}`}
      >
        <Image src={src} alt={`Portrait of ${name}`} width={720} height={900} sizes="(min-width: 768px) 720px, 92vw" className="block h-[min(82dvh,900px)] w-auto max-w-[92vw] rounded-xl object-contain" />
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-ink ring-1 ring-rule"
          aria-label="Close photo"
        >
          <X className="h-4 w-4" strokeWidth={2} aria-hidden />
        </button>
      </dialog>
    </>
  );
}
