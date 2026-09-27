'use client';

import { useEffect, type ComponentProps, type MouseEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

/*
  Client navigation wrapped in the View Transitions API. The route bullet and title the visitor
  clicked get a shared name, so they fly into place on the case study; everything else crossfades.
  Browsers without the API, modified clicks and reduced motion get a normal navigation.
*/

let finish: (() => void) | null = null;

type ViewTransitionDocument = Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };

/** Mount once per page: resolves the pending transition when the new route has rendered. */
export function TransitionDone() {
  const pathname = usePathname();
  useEffect(() => {
    finish?.();
    finish = null;
  }, [pathname]);
  return null;
}

export function navigateWithTransition(href: string, push: (href: string) => void, from?: Element | null) {
  const doc = document as ViewTransitionDocument;
  if (!doc.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    push(href);
    return;
  }
  const slug = href.match(/^\/projects\/([^/?#]+)/)?.[1];
  const scope = from?.closest('[data-vt-scope]') || from;
  const named: HTMLElement[] = [];
  if (slug && scope) {
    for (const [attr, name] of [
      ['data-vt-bullet', `vt-bullet-${slug}`],
      ['data-vt-title', `vt-title-${slug}`],
    ] as const) {
      const el = scope.querySelector<HTMLElement>(`[${attr}]`);
      if (el) {
        el.style.viewTransitionName = name;
        named.push(el);
      }
    }
  }
  doc.startViewTransition(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
        push(href);
        window.setTimeout(resolve, 1500); // never hold the page hostage
      })
  );
  window.setTimeout(() => named.forEach((el) => (el.style.viewTransitionName = '')), 1600);
}

export function TransitionLink({ href, onClick, ...props }: ComponentProps<typeof Link> & { href: string }) {
  const router = useRouter();
  return (
    <Link
      href={href}
      {...props}
      onClick={(e: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (props.target === '_blank') return;
        e.preventDefault();
        navigateWithTransition(href, router.push, e.currentTarget);
      }}
    />
  );
}
