import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import { cn } from '@/lib/utils';

import type { BreathProfile, Mode, Next } from '@/features/orchestration/useBreathworkOrchestration';

const PROFILE_TIMINGS: Record<BreathProfile, { inhale: number; hold: number; exhale: number }> = {
  calm_soft: { inhale: 4200, hold: 1400, exhale: 5200 },
  standard_soft: { inhale: 4000, hold: 1800, exhale: 5800 },
  long_exhale_focus: { inhale: 3600, hold: 2000, exhale: 6800 },
};

const GUIDANCE_TEXT: Record<'none' | 'soft_anchor' | 'long_exhale', string | null> = {
  none: null,
  soft_anchor: 'Respire doucement, tu es ancré·e.',
  long_exhale: 'Allonge chaque sortie d’air, laisse tomber la tension.',
};

const PHASE_LABEL: Record<'inhale' | 'hold' | 'exhale', string> = {
  inhale: 'Inspire en douceur.',
  hold: 'Suspends l’air avec souplesse.',
  exhale: 'Laisse l’expiration descendre longuement.',
};

interface BreathFlowControllerProps {
  profile: BreathProfile;
  ambience: 'very_soft' | 'soft' | 'standard';
  guidance: 'none' | 'soft_anchor' | 'long_exhale';
  summaryLabel: string;
  mode: Mode;
  next: Next;
  onFinish?: (payload: { durationSec: number }) => void;
}

export const BreathFlowController: React.FC<BreathFlowControllerProps> = ({
  profile,
  ambience,
  guidance,
  summaryLabel,
  mode,
  next,
  onFinish,
}) => {
  const { prefersReducedMotion } = useMotionPrefs();
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const startedAtRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [softlyEnding, setSoftlyEnding] = useState(false);

  const allowMotion = !prefersReducedMotion;

  const palette = useMemo(() => {
    if (mode === 'sleep_preset') {
      return 'bg-slate-900 text-slate-100 border-slate-700 shadow-none';
    }
    if (ambience === 'very_soft') {
      return 'bg-indigo-950 text-indigo-50 border-indigo-900/80 shadow-lg shadow-indigo-900/20';
    }
    if (ambience === 'soft') {
      return 'bg-slate-950 text-slate-100 border-slate-800 shadow-md shadow-slate-900/20';
    }
    return 'bg-slate-900 text-slate-100 border-slate-800';
  }, [ambience, mode]);

  const haloClass = useMemo(() => {
    if (mode === 'sleep_preset') {
      return 'from-amber-500/10 via-amber-400/5 to-transparent';
    }
    if (ambience === 'very_soft') {
      return 'from-sky-400/20 via-indigo-400/10 to-transparent';
    }
    if (ambience === 'soft') {
      return 'from-cyan-400/20 via-sky-400/10 to-transparent';
    }
    return 'from-sky-500/30 via-slate-300/5 to-transparent';
  }, [ambience, mode]);

  const phaseDuration = useMemo(() => PROFILE_TIMINGS[profile][phase], [phase, profile]);

  const radius = useMemo(() => {
    const base = profile === 'long_exhale_focus' ? 14 : profile === 'standard_soft' ? 13 : 12;
    if (phase === 'inhale') return base + 2;
    if (phase === 'hold') return base + 1;
    return base - 1;
  }, [phase, profile]);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setTimeout(() => {
      setPhase((current) => (current === 'inhale' ? 'hold' : current === 'hold' ? 'exhale' : 'inhale'));
    }, phaseDuration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [phase, phaseDuration]);

  useEffect(() => {
    if (softlyEnding) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      const elapsed = Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000));
      onFinish?.({ durationSec: elapsed });
    }
  }, [softlyEnding, onFinish]);

  useEffect(() => {
    startedAtRef.current = Date.now();
  }, []);

  const finish = () => {
    setSoftlyEnding(true);
  };

  const guidanceText = GUIDANCE_TEXT[guidance];

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-3xl border px-6 py-8 sm:px-10 sm:py-12 transition-colors',
        palette,
      )}
      aria-live="polite"
      data-zero-number-check="true"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-70',
            allowMotion ? 'animate-pulse-slow' : '',
            `bg-gradient-to-br ${haloClass}`,
          )}
          style={{ width: allowMotion ? '32rem' : '28rem', height: allowMotion ? '32rem' : '28rem' }}
        />
      </div>

      <div className="relative space-y-6">
        <p className="text-base font-medium text-slate-200/90" data-zero-number-check="true">
          {summaryLabel}
        </p>
        {guidanceText ? (
          <p className="text-lg font-semibold" role="status" data-zero-number-check="true">
            {guidanceText}
          </p>
        ) : null}
        <div className="flex items-center justify-center py-8">
          <div
            className={cn(
              'relative rounded-full border border-white/10 bg-white/5 transition-all ease-in-out',
              allowMotion ? 'duration-1000' : 'duration-0',
              mode === 'sleep_preset' ? 'shadow-[0_0_50px_rgba(250,214,165,0.15)]' : 'shadow-[0_0_50px_rgba(125,211,252,0.15)]',
            )}
            style={{
              width: `${radius}rem`,
              height: `${radius}rem`,
              opacity: phase === 'exhale' ? 0.85 : 1,
            }}
            aria-label="Visualisation du souffle"
          >
            <div className="absolute inset-6 rounded-full border border-white/10" aria-hidden="true" />
          </div>
        </div>
        <p className="text-base text-slate-200/80" data-zero-number-check="true">
          {PHASE_LABEL[phase]}
        </p>
        {next === 'offer_more_silence' ? (
          <p className="text-sm text-amber-200/90" data-zero-number-check="true">
            Encore un moment tranquille ? Tu peux rester dans cette bulle paisible autant que tu le souhaites.
          </p>
        ) : null}
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" className="text-sm" onClick={finish} aria-label="Clore la session en douceur">
            Clore en douceur
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BreathFlowController;
