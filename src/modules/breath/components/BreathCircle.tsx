// @ts-nocheck
import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import type { BreathStepKind } from '@/modules/breath/protocols';

interface BreathCircleProps {
  phase: BreathStepKind;
  phaseProgress: number;
}

const PHASE_SCALE: Record<BreathStepKind, number> = {
  in: 1.2,
  hold: 1.32,
  out: 0.92,
};

export function BreathCircle({ phase, phaseProgress }: BreathCircleProps) {
  const scale = useSpring(PHASE_SCALE[phase], { stiffness: 110, damping: 18, mass: 0.6 });
  const glow = useSpring(phaseProgress, { stiffness: 120, damping: 20 });
  const highlight = useTransform(glow, value =>
    `radial-gradient(circle at 50% 30%, rgba(255,255,255,${0.15 + value * 0.2}), rgba(79,70,229,0.4))`,
  );

  useEffect(() => {
    scale.set(PHASE_SCALE[phase]);
  }, [phase, scale]);

  useEffect(() => {
    glow.set(phaseProgress);
  }, [phaseProgress, glow]);

  return (
    <div className="relative flex h-64 w-64 items-center justify-center" aria-hidden="true">
      <motion.div
        className="absolute h-60 w-60 rounded-full bg-gradient-to-br from-sky-400/60 via-indigo-500/70 to-purple-500/60 blur-2xl"
        style={{ scale }}
      />
      <motion.div
        className="absolute h-64 w-64 rounded-full border border-white/40"
        style={{ opacity: glow }}
      />
      <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-slate-900/60 backdrop-blur">
        <motion.div
          className="h-40 w-40 rounded-full bg-gradient-to-b from-white/15 via-white/5 to-white/10 shadow-inner"
          style={{ scale }}
        />
        <motion.div
          className="absolute h-40 w-40 rounded-full"
          style={{ background: highlight, opacity: 0.85 }}
        />
      </div>
    </div>
  );
}
