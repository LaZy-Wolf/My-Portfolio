'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError('ACCESS DENIED // INVALID TELEMETRY CREDENTIALS');
      } else {
        router.push('/admin');
        router.refresh();
      }
    } catch {
      setError('AUTHENTICATION PROTOCOL FAILURE');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-4 bg-substrate">
      <div className="w-full max-w-md border border-telemetry-border bg-substrate-surface p-8 relative">
        {/* Decorative corner markers */}
        <div className="absolute -top-1 -left-1 w-2 h-2 bg-signal" />
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-signal" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-signal" />
        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-signal" />

        <div className="space-y-6">
          <div className="space-y-2 border-b border-telemetry-border pb-4">
            <div className="flex items-center justify-between">
              <span className="telemetry-tag text-signal flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                RESTRICTED // PROTOCOL 04
              </span>
              <span className="text-[10px] font-mono text-telemetry-faint">
                AUTH GATE
              </span>
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight">
              Control Panel
            </h1>
            <p className="text-xs font-mono text-telemetry-muted">
              Enter authorized administrator credentials to access content management telemetry.
            </p>
          </div>

          {error && (
            <div className="p-3 border border-signal/40 bg-signal/10 text-signal text-xs font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="telemetry-tag text-telemetry-muted">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-sm font-mono text-white focus:border-signal outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="telemetry-tag text-telemetry-muted">
                Access Key / Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-substrate border border-telemetry-border px-3 py-2 text-sm font-mono text-white focus:border-signal outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full brutalist-btn brutalist-btn-accent py-3 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  AUTHENTICATE SYSTEM
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-telemetry-border/60 flex items-center justify-between text-[11px] font-mono text-telemetry-muted">
            <Link href="/" className="hover:text-white transition-colors">
              &larr; Return to Public Telemetry
            </Link>
            <span>v2.0 // ZERO COST</span>
          </div>
        </div>
      </div>
    </main>
  );
}
