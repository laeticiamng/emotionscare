// @ts-nocheck
/**
 * Experience Layer — MicroFeedback
 * Composable micro-interaction feedback system.
 * Renders pulse, ripple, wave, and glow effects on elements.
 */

import React, { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useExperienceStore } from '../store/experience.store';
import type { FeedbackType } from '../types';

/* ── Hook ────────────────────────────────────────────────────── */

interface FeedbackAction {
  id: number;
  type: FeedbackType;
  x: number;
  y: number;
  color: string;
}

export function useMicroFeedback() {
  const [feedbacks, setFeedbacks] = useState<FeedbackAction[]>([]);
  const idRef = useRef(0);
  const reducedMotion = useExperienceStore((s) => s.preferences.reducedMotion);
  const palette = useExperienceStore((s) => s.ambient.palette);

  const trigger = useCallback(
    (type: FeedbackType, opts?: { x?: number; y?: number; color?: string }) => {
      if (reducedMotion) return;
      const id = ++idRef.current;
      const action: FeedbackAction = {
        id,
        type,
        x: opts?.x ?? 50,
        y: opts?.y ?? 50,
        color: opts?.color ?? palette.glow,
      };
      setFeedbacks((prev) => [...prev, action]);
      setTimeout(() => {
        setFeedbacks((prev) => prev.filter((f) => f.id !== id));
      }, 1000);
    },
    [reducedMotion, palette.glow]
  );

  const pulse = useCallback(
    (opts?: { x?: number; y?: number; color?: string }) => trigger('pulse', opts),
    [trigger]
  );
  const ripple = useCallback(
    (opts?: { x?: number; y?: number; color?: string }) => trigger('ripple', opts),
    [trigger]
  );
  const wave = useCallback(
    (opts?: { x?: number; y?: number; color?: string }) => trigger('wave', opts),
    [trigger]
  );
  const glow = useCallback(
    (opts?: { x?: number; y?: number; color?: string }) => trigger('glow', opts),
    [trigger]
  );

  return { feedbacks, pulse, ripple, wave, glow };
}

/* ── Feedback Overlay Component ──────────────────────────────── */

interface MicroFeedbackOverlayProps {
  feedbacks: FeedbackAction[];
  className?: string;
}

export function MicroFeedbackOverlay({ feedbacks, className }: MicroFeedbackOverlayProps) {
  return (
    <div className={cn('absolute inset-0 pointer-events-none overflow-hidden z-20', className)}>
      <AnimatePresence>
        {feedbacks.map((fb) => (
          <FeedbackEffect key={fb.id} feedback={fb} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function FeedbackEffect({ feedback }: { feedback: FeedbackAction }) {
  const { type, x, y, color } = feedback;

  switch (type) {
    case 'pulse':
      return (
        <motion.div
          className="absolute rounded-full"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
            width: 60,
            height: 60,
            background: `radial-gradient(circle, ${color}40, transparent 70%)`,
          }}
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      );

    case 'ripple':
      return (
        <>
          {[0, 0.15, 0.3].map((delay, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                borderColor: `${color}60`,
              }}
              initial={{ width: 10, height: 10, opacity: 0.6 }}
              animate={{ width: 120, height: 120, opacity: 0 }}
              transition={{ duration: 0.7, delay, ease: 'easeOut' }}
            />
          ))}
        </>
      );

    case 'wave':
      return (
        <motion.div
          className="absolute"
          style={{
            left: 0,
            top: `${y}%`,
            width: '100%',
            height: 2,
            background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
          }}
          initial={{ scaleX: 0, opacity: 0.8 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      );

    case 'glow':
      return (
        <motion.div
          className="absolute rounded-2xl"
          style={{
            left: `${x - 15}%`,
            top: `${y - 15}%`,
            width: '30%',
            height: '30%',
            background: `radial-gradient(ellipse, ${color}30, transparent 70%)`,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      );

    default:
      return null;
  }
}
