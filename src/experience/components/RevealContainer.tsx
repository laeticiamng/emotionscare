// @ts-nocheck
/**
 * Experience Layer — RevealContainer
 * Wraps content that starts veiled (blurred, dimmed) and reveals on trigger.
 * Used for locked badges, hidden achievements, progressive disclosure.
 *
 * States:
 *   veiled:    blur(20px) + opacity(0.3) — mysterious, enticing
 *   revealing: animated transition to clear
 *   revealed:  fully visible with optional glow aftereffect
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useExperienceStore } from '../store/experience.store';

interface RevealContainerProps {
  children: React.ReactNode;
  revealed?: boolean;
  /** Auto-reveal when scrolled into view */
  revealOnView?: boolean;
  /** Duration of reveal animation in ms */
  duration?: number;
  /** Show glow effect after reveal */
  glowAfterReveal?: boolean;
  /** Optional callback when reveal completes */
  onReveal?: () => void;
  className?: string;
  /** Placeholder shown while veiled */
  placeholder?: React.ReactNode;
}

export function RevealContainer({
  children,
  revealed = false,
  revealOnView = false,
  duration = 800,
  glowAfterReveal = true,
  onReveal,
  className,
  placeholder,
}: RevealContainerProps) {
  const reducedMotion = useExperienceStore((s) => s.preferences.reducedMotion);
  const palette = useExperienceStore((s) => s.ambient.palette);
  const [hasRevealed, setHasRevealed] = useState(revealed);
  const [showGlow, setShowGlow] = useState(false);

  const handleReveal = useCallback(() => {
    if (hasRevealed) return;
    setHasRevealed(true);
    if (glowAfterReveal) {
      setShowGlow(true);
      setTimeout(() => setShowGlow(false), 1500);
    }
    onReveal?.();
  }, [hasRevealed, glowAfterReveal, onReveal]);

  // Auto-trigger if revealed prop changes
  React.useEffect(() => {
    if (revealed && !hasRevealed) {
      handleReveal();
    }
  }, [revealed, hasRevealed, handleReveal]);

  const durationS = reducedMotion ? 0.2 : duration / 1000;

  return (
    <motion.div
      className={cn('relative', className)}
      initial={false}
      animate={
        hasRevealed
          ? { filter: 'blur(0px)', opacity: 1 }
          : { filter: reducedMotion ? 'blur(0px)' : 'blur(12px)', opacity: 0.35 }
      }
      transition={{ duration: durationS, ease: [0.16, 1, 0.3, 1] }}
      {...(revealOnView && !hasRevealed
        ? {
            whileInView: { filter: 'blur(0px)', opacity: 1 },
            viewport: { once: true, margin: '-50px' },
            onViewportEnter: handleReveal,
          }
        : {})}
    >
      {/* Glow aftereffect */}
      <AnimatePresence>
        {showGlow && !reducedMotion && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{
              boxShadow: `0 0 40px 8px ${palette.glow}40, inset 0 0 20px 4px ${palette.glow}20`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Content or placeholder */}
      {hasRevealed ? children : (placeholder ?? children)}
    </motion.div>
  );
}
