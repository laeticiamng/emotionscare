import type { FC, ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import * as Sentry from '@sentry/react';

import type { CalmProfile, Guidance } from '@/features/orchestration/useStai6Orchestration';
import { cn } from '@/lib/utils';

interface NyveeFlowControllerProps {
  sceneProfile: CalmProfile;
  guidance: Guidance;
  prefersReducedMotion?: boolean;
  summaryLabel: string;
  children?: ReactNode;
}

const profileClasses: Record<CalmProfile, string> = {
  silent_anchor: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-indigo-50',
  soft_guided: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-violet-50',
  standard: 'bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-indigo-100',
};

const guidanceMessage: Record<Guidance, string> = {
  none: 'Laisse-toi porter par la scène, sans indication particulière.',
  breath_long_exhale: 'Respiration longue : inspire doucement, relâche encore plus lentement.',
  grounding_soft: 'Ancrage délicat : sens tes appuis, écoute le souffle calmement.',
};

export const NyveeFlowController: FC<NyveeFlowControllerProps> = ({
  sceneProfile,
  guidance,
  prefersReducedMotion = false,
  summaryLabel,
  children,
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'nyvee',
      level: 'info',
      message: 'nyvee:scene:started',
      data: { profile: sceneProfile, guidance },
    });

    return () => {
      Sentry.addBreadcrumb({ category: 'nyvee', level: 'info', message: 'nyvee:scene:ended' });
    };
  }, [guidance, sceneProfile]);

  const containerClass = useMemo(
    () =>
      cn(
        'relative isolate overflow-hidden rounded-3xl border border-indigo-700/40 p-6 shadow-xl transition-colors',
        profileClasses[sceneProfile],
        prefersReducedMotion ? 'motion-reduce:transition-none' : 'motion-safe:duration-500 motion-safe:ease-out',
      ),
    [prefersReducedMotion, sceneProfile],
  );

  const auraClass = useMemo(
    () =>
      cn(
        'pointer-events-none absolute inset-0 opacity-60 blur-3xl transition-opacity',
        prefersReducedMotion ? 'opacity-40' : 'motion-safe:animate-pulse opacity-70',
        sceneProfile === 'silent_anchor' && 'bg-indigo-900/50',
        sceneProfile === 'soft_guided' && 'bg-violet-900/40',
        sceneProfile === 'standard' && 'bg-indigo-800/30',
      ),
    [prefersReducedMotion, sceneProfile],
  );

  const label = guidanceMessage[guidance];

  return (
    <section
      aria-label="Scène Nyvée"
      data-scene-profile={sceneProfile}
      data-guidance={guidance}
      className={containerClass}
    >
      <div className={auraClass} aria-hidden />
      <div className="relative z-10 flex flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-indigo-200/70">Nyvée</p>
          <h1 className="text-2xl font-semibold leading-tight">{summaryLabel}</h1>
          <p className="text-sm text-indigo-100/80" aria-live="polite">
            {label}
          </p>
        </header>
        <div className="rounded-2xl bg-black/20 p-4">
          {children}
        </div>
      </div>
    </section>
  );
};

export default NyveeFlowController;
