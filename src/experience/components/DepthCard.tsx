// @ts-nocheck
/**
 * Experience Layer — DepthCard
 * Card with CSS perspective, parallax hover, and adaptive shadows.
 * Drop-in enhancement for existing card components.
 *
 * depth=0: Standard card (no perspective)
 * depth=1: Subtle translateZ + light shadow on hover
 * depth=2: Medium translateZ + parallax + glow edge
 * depth=3: Strong translateZ + full parallax + ambient glow border
 */

import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useExperienceStore } from '../store/experience.store';
import type { ImmersionLevel } from '../types';

interface DepthCardProps {
  children: React.ReactNode;
  depth?: ImmersionLevel;
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section' | 'li';
  /** Disable depth effect for this instance */
  flat?: boolean;
}

const DEPTH_CONFIG = {
  0: { translateZ: 0, shadow: 'shadow-sm', scale: 1, parallaxFactor: 0 },
  1: { translateZ: 10, shadow: 'shadow-md', scale: 1.01, parallaxFactor: 0.5 },
  2: { translateZ: 20, shadow: 'shadow-lg', scale: 1.02, parallaxFactor: 1 },
  3: { translateZ: 30, shadow: 'shadow-xl', scale: 1.03, parallaxFactor: 1.5 },
};

export function DepthCard({
  children,
  depth = 1,
  className,
  onClick,
  as = 'div',
  flat = false,
}: DepthCardProps) {
  const reducedMotion = useExperienceStore((s) => s.preferences.reducedMotion);
  const palette = useExperienceStore((s) => s.ambient.palette);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef<number>(0);

  const effectiveDepth = flat || reducedMotion ? 0 : depth;
  const config = DEPTH_CONFIG[effectiveDepth];

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (effectiveDepth === 0) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setRotateY(x * 6 * config.parallaxFactor);
        setRotateX(-y * 6 * config.parallaxFactor);
      });
    },
    [effectiveDepth, config.parallaxFactor]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    cancelAnimationFrame(rafRef.current);
  }, []);

  const MotionComponent = motion[as] ?? motion.div;

  return (
    <MotionComponent
      ref={cardRef as any}
      className={cn(
        'relative rounded-2xl border border-border/50 bg-card transition-shadow duration-300',
        config.shadow,
        effectiveDepth >= 2 && isHovered && 'ring-1 ring-[var(--ambient-glow)]/20',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        perspective: effectiveDepth > 0 ? '1200px' : undefined,
        transformStyle: effectiveDepth > 0 ? 'preserve-3d' : undefined,
      }}
      animate={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        scale: isHovered ? config.scale : 1,
        z: isHovered ? config.translateZ : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {/* Ambient glow overlay for depth >= 2 */}
      {effectiveDepth >= 2 && isHovered && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.06] transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at ${((rotateY / 6) + 0.5) * 100}% ${((-rotateX / 6) + 0.5) * 100}%, ${palette.glow}, transparent 70%)`,
          }}
        />
      )}
      {children}
    </MotionComponent>
  );
}
