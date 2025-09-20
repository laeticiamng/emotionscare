import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import * as Sentry from '@sentry/react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import FiveFourThreeTwoOneCard from '@/features/grounding/FiveFourThreeTwoOneCard';
import { useStai6Orchestration } from '@/features/orchestration/useStai6Orchestration';
import { persistSession } from '@/features/session/persistSession';

export type NyveeNextStep = 'repeat_soft_anchor' | 'offer_54321';

type FlowPhase =
  | 'awaiting_assessment'
  | 'anchor_prompt'
  | 'anchor_hold'
  | 'grounding'
  | 'soft_exit'
  | 'completed';

interface NyveeFlowControllerProps {
  profile: string;
  anchorDurationMs?: number;
  className?: string;
  children?: ReactNode;
}

const anchorPromptCopy = {
  title: 'Transition paisible',
  description: 'Je suis là. Souhaites-tu prolonger un instant de silence ensemble ?',
  accept: 'Prolonger ce silence',
  decline: 'Aller vers la douceur',
};

const anchorHoldCopy = {
  title: 'Silence accompagné',
  description: 'Je veille en silence avec toi. Respire tranquillement, sans rien forcer.',
  end: 'Terminer doucement',
};

const groundingCopy = {
  title: 'Exploration sensorielle',
  description: 'Une courte carte d’ancrage peut t’aider à revenir dans le présent.',
};

const softExitCopy = {
  title: 'Sortie sereine',
  description: 'La transition est lancée. Prends encore quelques respirations avant de quitter.',
};

const DEFAULT_ANCHOR_DURATION = 60_000;

const NyveeFlowController = ({
  profile,
  anchorDurationMs = DEFAULT_ANCHOR_DURATION,
  className,
  children,
}: NyveeFlowControllerProps) => {
  const { toast } = useToast();
  const { snapshots, delta } = useStai6Orchestration();
  const [phase, setPhase] = useState<FlowPhase>('awaiting_assessment');
  const [nextStep, setNextStep] = useState<NyveeNextStep | null>(null);
  const [softExitTriggered, setSoftExitTriggered] = useState(false);
  const anchorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const decisionReady = Boolean(snapshots.pre && snapshots.post);

  const decision = useMemo(() => {
    if (!decisionReady) {
      return null;
    }

    return delta('pre', 'post');
  }, [delta, decisionReady]);

  useEffect(() => {
    if (!decisionReady || nextStep || !decision) {
      return;
    }

    const step: NyveeNextStep = decision === 'down' ? 'repeat_soft_anchor' : 'offer_54321';
    setNextStep(step);

    Sentry.addBreadcrumb({
      category: 'nyvee',
      level: 'info',
      message: step === 'repeat_soft_anchor' ? 'nyvee:next:anchor' : 'nyvee:next:54321',
    });

    setPhase(step === 'repeat_soft_anchor' ? 'anchor_prompt' : 'grounding');
  }, [decision, decisionReady, nextStep]);

  useEffect(() => {
    return () => {
      if (anchorTimerRef.current) {
        clearTimeout(anchorTimerRef.current);
      }
    };
  }, []);

  const triggerSoftExit = useCallback(
    async (_origin: 'anchor' | 'grounding' | 'direct') => {
      if (softExitTriggered) {
        return;
      }

      setSoftExitTriggered(true);
      setPhase('soft_exit');

      Sentry.addBreadcrumb({ category: 'nyvee', level: 'info', message: 'nyvee:exit:soft' });

      toast({
        title: softExitCopy.title,
        description: softExitCopy.description,
        duration: 5_000,
      });

      try {
        await persistSession('nyvee', {
          profile,
          next: nextStep === 'repeat_soft_anchor' ? 'anchor' : '54321',
          exit: 'soft',
          notes: 'verbal_toast',
        });
        Sentry.addBreadcrumb({ category: 'session', level: 'info', message: 'session:persist:ok' });
      } catch (error) {
        Sentry.addBreadcrumb({ category: 'session', level: 'error', message: 'session:persist:fail' });
        Sentry.captureException(error);
      }

      setTimeout(() => setPhase('completed'), 1_000);
    },
    [nextStep, profile, softExitTriggered, toast]
  );

  const handleAnchorAccept = useCallback(() => {
    if (anchorTimerRef.current) {
      clearTimeout(anchorTimerRef.current);
    }

    setPhase('anchor_hold');

    anchorTimerRef.current = setTimeout(() => {
      triggerSoftExit('anchor');
    }, anchorDurationMs);
  }, [anchorDurationMs, triggerSoftExit]);

  const handleAnchorDecline = useCallback(() => {
    triggerSoftExit('direct');
  }, [triggerSoftExit]);

  const handleGroundingComplete = useCallback(() => {
    triggerSoftExit('grounding');
  }, [triggerSoftExit]);

  const renderContent = () => {
    if (!decisionReady) {
      return (
        <Card className="border-indigo-500/50 bg-indigo-900/40 text-indigo-100">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-indigo-50">Nyvée t’écoute</CardTitle>
            <CardDescription className="text-sm text-indigo-200">
              Partage ton ressenti avant et après pour que je puisse t’orienter en douceur.
            </CardDescription>
          </CardHeader>
          {children ? <CardContent className="text-sm text-indigo-100/80">{children}</CardContent> : null}
        </Card>
      );
    }

    if (phase === 'anchor_prompt') {
      return (
        <Card className="border-emerald-400/50 bg-emerald-900/40 text-emerald-50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-emerald-50">{anchorPromptCopy.title}</CardTitle>
            <CardDescription className="text-sm text-emerald-100/90">{anchorPromptCopy.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <Button type="button" variant="secondary" onClick={handleAnchorDecline}>
              {anchorPromptCopy.decline}
            </Button>
            <Button type="button" onClick={handleAnchorAccept}>
              {anchorPromptCopy.accept}
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (phase === 'anchor_hold') {
      return (
        <Card className="border-emerald-300/50 bg-emerald-900/50 text-emerald-50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-emerald-50">{anchorHoldCopy.title}</CardTitle>
            <CardDescription className="text-sm text-emerald-100/80">{anchorHoldCopy.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-end">
            <Button type="button" variant="outline" onClick={() => triggerSoftExit('anchor')}>
              {anchorHoldCopy.end}
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (phase === 'grounding') {
      return (
        <div className="space-y-4">
          <Card className="border-indigo-400/50 bg-indigo-900/40 text-indigo-100">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-indigo-50">{groundingCopy.title}</CardTitle>
              <CardDescription className="text-sm text-indigo-200/80">{groundingCopy.description}</CardDescription>
            </CardHeader>
          </Card>
          <FiveFourThreeTwoOneCard onComplete={handleGroundingComplete} />
        </div>
      );
    }

    return (
      <Card className="border-indigo-400/50 bg-indigo-900/40 text-indigo-100">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-indigo-50">{softExitCopy.title}</CardTitle>
          <CardDescription className="text-sm text-indigo-200/80">{softExitCopy.description}</CardDescription>
        </CardHeader>
      </Card>
    );
  };

  return (
    <div
      className={cn(
        'relative space-y-4 transition-opacity duration-700 ease-out',
        phase === 'soft_exit' || phase === 'completed' ? 'opacity-0' : 'opacity-100',
        className
      )}
    >
      <div data-testid="nyvee-flow-content">{renderContent()}</div>
      {(phase === 'soft_exit' || phase === 'completed') && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl bg-indigo-950/60"
          data-testid="nyvee-soft-exit"
        />
      )}
    </div>
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
