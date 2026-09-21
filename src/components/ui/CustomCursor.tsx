'use client';

import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop devices with fine pointers
    if (typeof window === 'undefined') return;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouchDevice || prefersReducedMotion) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });

      // Check if cursor is over interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], .interactive-element');
        setIsHovered(!!isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Smooth trailing lerp
  useEffect(() => {
    if (!isVisible) return;
    let animationFrameId: number;

    const lerp = () => {
      setTrailingPos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.2,
        y: prev.y + (pos.y - prev.y) * 0.2,
      }));
      animationFrameId = requestAnimationFrame(lerp);
    };

    animationFrameId = requestAnimationFrame(lerp);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pos, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Precision Core Dot */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ${
          isClicking ? 'scale-75' : isHovered ? 'scale-150' : 'scale-100'
        }`}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      >
        <div className="w-1.5 h-1.5 bg-signal" />
      </div>

      {/* Trailing Tactical Reticle Box */}
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ${
          isHovered
            ? 'w-10 h-10 border-signal/80 bg-signal/5'
            : 'w-6 h-6 border-telemetry-border/80 bg-transparent'
        } ${isClicking ? 'scale-90 border-signal' : 'scale-100'} border`}
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
        }}
      />
    </>
  );
}
