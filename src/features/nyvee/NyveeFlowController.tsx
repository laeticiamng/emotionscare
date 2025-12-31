/**
 * NyveeFlowController - Contrôleur de flux post-session avec transitions douces
 */

import { useState, useRef, useMemo, useEffect, useCallback, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import FiveFourThreeTwoOneCard from '@/features/grounding/FiveFourThreeTwoOneCard';
import useStai6Orchestration from '@/features/orchestration/useStai6Orchestration';
import { logger } from '@/lib/logger';
import { Sentry } from '@/lib/errors/sentry-compat';
import { supabase } from '@/integrations/supabase/client';

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
  description: "Une courte carte d'ancrage peut t'aider à revenir dans le présent.",
};

const softExitCopy = {
  title: 'Sortie sereine',
  description: "La transition est lancée. Prends encore quelques respirations avant de quitter.",
};

const DEFAULT_ANCHOR_DURATION = 60_000;

/**
 * Persiste une session Nyvee dans la base de données
 */
const persistNyveeSession = async (
  moduleName: string,
  data: {
    profile: string;
    next: string;
    exit: string;
    notes?: string;
  }
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('breathing_vr_sessions').insert({
    user_id: user.id,
    pattern: data.next === 'anchor' ? 'anchor' : '54321',
    duration_seconds: 60,
    cycles_completed: 1,
    completed_at: new Date().toISOString(),
  });
};

const NyveeFlowController = ({
  profile,
  anchorDurationMs = DEFAULT_ANCHOR_DURATION,
  className,
  children,
}: NyveeFlowControllerProps) => {
  const { toast } = useToast();
  const orchestration = useStai6Orchestration();
  const [phase, setPhase] = useState<FlowPhase>('awaiting_assessment');
  const [nextStep, setNextStep] = useState<NyveeNextStep | null>(null);
  const [softExitTriggered, setSoftExitTriggered] = useState(false);
  const anchorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Use orchestration state for decision-ready check
  const decisionReady = !orchestration.preDue && !orchestration.postDue;

  // Determine next step based on scene profile
  const decision = useMemo(() => {
    if (!decisionReady) {
      return null;
    }
    // Use sceneProfile to determine the path
    return orchestration.sceneProfile === 'silent_anchor' ? 'down' : 'up';
  }, [decisionReady, orchestration.sceneProfile]);

  useEffect(() => {
    if (!decisionReady || nextStep || !decision) {
      return;
    }

    const step: NyveeNextStep = decision === 'down' ? 'repeat_soft_anchor' : 'offer_54321';
    setNextStep(step);

    logger.info(step === 'repeat_soft_anchor' ? 'nyvee:next:anchor' : 'nyvee:next:54321', undefined, 'NYVEE');

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

      logger.info('nyvee:exit:soft', undefined, 'NYVEE');

      toast({
        title: softExitCopy.title,
        description: softExitCopy.description,
        duration: 5_000,
      });

      try {
        await persistNyveeSession('nyvee', {
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
        <Card className="border-primary/50 bg-primary/10">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">Nyvée t'écoute</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Partage ton ressenti avant et après pour que je puisse t'orienter en douceur.
            </CardDescription>
          </CardHeader>
          {children ? <CardContent className="text-sm text-muted-foreground">{children}</CardContent> : null}
        </Card>
      );
    }

    if (phase === 'anchor_prompt') {
      return (
        <Card className="border-emerald-400/50 bg-emerald-500/10">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">{anchorPromptCopy.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{anchorPromptCopy.description}</CardDescription>
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
        <Card className="border-emerald-300/50 bg-emerald-500/15">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">{anchorHoldCopy.title}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">{anchorHoldCopy.description}</CardDescription>
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
          <Card className="border-primary/50 bg-primary/10">
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">{groundingCopy.title}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">{groundingCopy.description}</CardDescription>
            </CardHeader>
          </Card>
          <FiveFourThreeTwoOneCard onComplete={handleGroundingComplete} />
        </div>
      );
    }

    return (
      <Card className="border-primary/50 bg-primary/10">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">{softExitCopy.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{softExitCopy.description}</CardDescription>
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
          className="pointer-events-none absolute inset-0 rounded-2xl bg-background/60"
          data-testid="nyvee-soft-exit"
        />
      )}
    </div>
  );
};

export default NyveeFlowController;
