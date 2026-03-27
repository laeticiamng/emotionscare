// @ts-nocheck
/**
 * Experience Layer — useDepthInteraction
 * Mouse/touch tracking for parallax, glow position, and depth effects.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useExperienceStore } from '../store/experience.store';

interface DepthInteraction {
  /** Normalized mouse position (-1 to 1) */
  mouseX: number;
  mouseY: number;
  /** CSS custom property values for glow position */
  glowX: string;
  glowY: string;
  /** Whether the pointer is over the element */
  isHovering: boolean;
  /** Ref to attach to the container */
  ref: React.RefObject<HTMLDivElement | null>;
}

export function useDepthInteraction(): DepthInteraction {
  const ref = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const rafRef = useRef<number>(0);
  const reducedMotion = useExperienceStore((s) => s.preferences.reducedMotion);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (reducedMotion) return;
      const el = ref.current;
      if (!el) return;

      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        setMouseX(x);
        setMouseY(y);
      });
    },
    [reducedMotion]
  );

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setMouseX(0);
    setMouseY(0);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.addEventListener('mousemove', handleMouseMove, { passive: true });
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return {
    mouseX,
    mouseY,
    glowX: `${((mouseX + 1) / 2) * 100}%`,
    glowY: `${((mouseY + 1) / 2) * 100}%`,
    isHovering,
    ref,
  };
}
