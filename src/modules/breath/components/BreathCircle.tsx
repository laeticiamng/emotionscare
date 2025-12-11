import { useEffect, useMemo } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import type { BreathStepKind } from '@/modules/breath/protocols';

interface BreathCircleProps {
  phase: BreathStepKind;
  phaseProgress: number;
  countdown?: number;
  showLabel?: boolean;
}

const PHASE_SCALE: Record<BreathStepKind, number> = {
  in: 1.2,
  hold: 1.32,
  out: 0.92,
};

const PHASE_LABELS: Record<BreathStepKind, string> = {
  in: 'Inspirez',
  hold: 'Retenez',
  out: 'Expirez',
};

const PHASE_COLORS: Record<BreathStepKind, string> = {
  in: 'from-sky-400/60 via-indigo-500/70 to-purple-500/60',
  hold: 'from-amber-400/60 via-orange-500/70 to-red-400/60',
  out: 'from-emerald-400/60 via-teal-500/70 to-cyan-500/60',
};

export function BreathCircle({ phase, phaseProgress, countdown, showLabel = true }: BreathCircleProps) {
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

  const gradientClass = useMemo(() => PHASE_COLORS[phase], [phase]);

  return (
    <div className="relative flex h-64 w-64 items-center justify-center" aria-hidden="true">
      {/* Cercle de fond animé */}
      <motion.div
        className={`absolute h-60 w-60 rounded-full bg-gradient-to-br ${gradientClass} blur-2xl`}
        style={{ scale }}
        key={phase}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 0.8 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Anneau de progression */}
      <motion.div
        className="absolute h-64 w-64 rounded-full border border-white/40"
        style={{ opacity: glow }}
      />
      
      {/* Cercle central */}
      <div className="relative flex h-44 w-44 items-center justify-center rounded-full bg-slate-900/60 backdrop-blur">
        <motion.div
          className="h-40 w-40 rounded-full bg-gradient-to-b from-white/15 via-white/5 to-white/10 shadow-inner"
          style={{ scale }}
        />
        <motion.div
          className="absolute h-40 w-40 rounded-full"
          style={{ background: highlight, opacity: 0.85 }}
        />
        
        {/* Label et countdown au centre */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {showLabel && (
              <motion.span
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-lg font-medium text-white/90 drop-shadow-lg"
              >
                {PHASE_LABELS[phase]}
              </motion.span>
            )}
          </AnimatePresence>
          
          {countdown !== undefined && countdown > 0 && (
            <motion.span
              key={countdown}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-bold text-white drop-shadow-lg mt-1"
            >
              {countdown}
            </motion.span>
          )}
        </div>
      </div>
      
      {/* Indicateur de phase (points) */}
      <div className="absolute bottom-0 flex gap-2">
        {(['in', 'hold', 'out'] as BreathStepKind[]).map((p) => (
          <div
            key={p}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              p === phase ? 'bg-white scale-125' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
