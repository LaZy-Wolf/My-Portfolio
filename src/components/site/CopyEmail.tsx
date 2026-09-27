'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={() =>
        navigator.clipboard?.writeText(email).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1800);
        })
      }
      className="btn-quiet h-10 px-4 text-sm"
    >
      {copied ? (
        <Check className="h-4 w-4" strokeWidth={2} aria-hidden />
      ) : (
        <Copy className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      )}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy address'}</span>
    </button>
  );
}
