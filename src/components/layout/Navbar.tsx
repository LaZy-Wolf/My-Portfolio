'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, Command, Menu, X } from 'lucide-react';

interface NavbarProps {
  name?: string;
  role?: string;
  onOpenCommandPalette?: () => void;
}

export function Navbar({
  name = 'ALEX VANCE',
  role = 'SYSTEMS ARCHITECT',
  onOpenCommandPalette,
}: NavbarProps) {
  const [time, setTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toUTCString().slice(17, 25) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '#projects', label: 'WORK' },
    { href: '#about', label: 'ABOUT' },
    { href: '#skills', label: 'STACK' },
    { href: '#contact', label: 'CONNECT' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-substrate/90 backdrop-blur-md border-b border-telemetry-border">
      {/* Top micro telemetry ribbon */}
      <div className="border-b border-telemetry-border/40 px-4 sm:px-8 py-1 flex items-center justify-between text-[10px] font-mono text-telemetry-muted">
        <div className="flex items-center gap-3">
          <span className="text-terminal flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-terminal rounded-full animate-pulse" />
            LIVE // TEL: 200 OK
          </span>
          <span className="text-telemetry-faint hidden sm:inline">|</span>
          <span className="hidden sm:inline">LATENCY: 12ms</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-white font-bold">{time || '--:--:-- UTC'}</span>
          <span className="text-telemetry-faint">|</span>
          <span className="text-telemetry-muted hidden md:inline">ZURICH // UTC+1</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Callsign / Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-substrate-surface border border-telemetry-border group-hover:border-signal flex items-center justify-center transition-colors">
            <Terminal className="w-4 h-4 text-signal" />
          </div>
          <div>
            <div className="font-mono text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              {name}
              <span className="text-[10px] font-normal text-signal">/26</span>
            </div>
            <div className="text-[9px] font-mono text-telemetry-muted tracking-widest uppercase">
              {role}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-telemetry-muted hover:text-white hover:border-b-2 hover:border-signal pb-1 transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action: Command Palette & Mobile Menu */}
        <div className="flex items-center gap-3">
          {onOpenCommandPalette && (
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="brutalist-btn text-xs py-1.5 px-3 text-telemetry-muted hover:text-white flex items-center gap-2"
              title="Open Command Palette (Ctrl+K or Cmd+K)"
            >
              <Command className="w-3.5 h-3.5 text-signal" />
              <span className="hidden sm:inline font-mono text-[11px]">CMD + K</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-telemetry-muted hover:text-white border border-telemetry-border"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-telemetry-border bg-substrate-surface p-6 space-y-4 font-mono text-sm uppercase">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-telemetry-muted hover:text-signal py-1.5 border-b border-telemetry-border/30"
            >
              &rarr; {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
