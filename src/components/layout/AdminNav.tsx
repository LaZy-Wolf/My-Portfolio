'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  FolderKanban,
  User,
  Wrench,
  Settings,
  DatabaseBackup,
  ExternalLink,
  LogOut,
  Terminal,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/skills', label: 'Skills', icon: Wrench },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/backup', label: 'Backup', icon: DatabaseBackup },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-telemetry-border bg-substrate-surface sticky top-0 z-40">
      {/* Top Telemetry Strip */}
      <div className="border-b border-telemetry-border/40 px-4 py-1.5 flex items-center justify-between text-[10px] font-mono text-telemetry-muted">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-terminal">
            <span className="w-1.5 h-1.5 bg-terminal rounded-full animate-pulse" />
            SYS: AUTHENTICATED
          </span>
          <span className="text-telemetry-faint">|</span>
          <span className="text-telemetry-muted">OPERATOR: ADMIN</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-telemetry-faint">NEXTJS 15 // MONGODB M0</span>
          <Link
            href="/"
            target="_blank"
            className="text-signal hover:underline flex items-center gap-1"
          >
            VIEW SITE <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Admin Navigation */}
      <div className="px-4 flex items-center justify-between h-14">
        <div className="flex items-center gap-6 overflow-x-auto">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-black uppercase text-sm tracking-tight text-white shrink-0"
          >
            <Terminal className="w-4 h-4 text-signal" />
            CONTROL PLANE
          </Link>

          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors shrink-0 ${
                    isActive
                      ? 'bg-substrate text-signal border-b-2 border-signal font-bold'
                      : 'text-telemetry-muted hover:text-white hover:bg-substrate/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="brutalist-btn text-xs py-1 px-2.5 text-telemetry-muted hover:text-signal hover:border-signal shrink-0"
          title="Sign out of admin session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">DISCONNECT</span>
        </button>
      </div>
    </header>
  );
}
