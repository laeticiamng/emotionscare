'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { createSession } from '@/services/sessions/sessionsApi';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { bossGritOrchestrator } from '@/features/orchestration/bossGrit.orchestrator';

const SHORT_DURATION_MS = 180_000;
const LONG_DURATION_MS = 600_000;

const durationDetails = {
  short: {
    label: 'Défi douceur (environ trois minutes)',
    description: 'Une séquence brève pour renouer avec ta constance sans puiser dans les réserves.',
  },
  long: {
    label: 'Défi immersif (environ dix minutes)',
    description: 'Quand l’énergie le permet, on entretient la progression avec une exploration plus longue.',
  },
} as const;

export default function BossGritPage(): JSX.Element {
  const { flags } = useFlags();
  const gritAssessment = useAssessment('GRITS');
  const brsAssessment = useAssessment('BRS');
  const { data: gritHistory } = useAssessmentHistory('GRITS', { limit: 1, enabled: gritAssessment.isEligible });
  const { data: brsHistory } = useAssessmentHistory('BRS', { limit: 1, enabled: brsAssessment.isEligible });

  const [challengeDuration, setChallengeDuration] = useState(LONG_DURATION_MS);
  const [compassionStreakEnabled, setCompassionStreakEnabled] = useState(true);
  const [sessionState, setSessionState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const gritLevel = useMemo(() => {
    if (typeof gritAssessment.state.lastComputation?.level === 'number') {
      return gritAssessment.state.lastComputation.level;
    }
    if (gritHistory && gritHistory.length > 0) {
      return gritHistory[0].level;
    }
    return null;
  }, [gritAssessment.state.lastComputation?.level, gritHistory]);

  const brsLevel = useMemo(() => {
    if (typeof brsAssessment.state.lastComputation?.level === 'number') {
      return brsAssessment.state.lastComputation.level;
    }
    if (brsHistory && brsHistory.length > 0) {
      return brsHistory[0].level;
    }
    return null;
  }, [brsAssessment.state.lastComputation?.level, brsHistory]);

  useEffect(() => {
    if (!flags.FF_ORCH_GRIT || !flags.FF_ASSESS_GRITS || !flags.FF_ASSESS_BRS) {
      return;
    }
    if (!gritAssessment.isEligible || !brsAssessment.isEligible) {
      return;
    }

    const actions = bossGritOrchestrator({
      gritLevel: typeof gritLevel === 'number' ? gritLevel : undefined,
      brsLevel: typeof brsLevel === 'number' ? brsLevel : undefined,
    });
    const durationAction = actions.find((action) => action.action === 'set_challenge_duration');
    const compassionAction = actions.find((action) => action.action === 'enable_compassion_streak');

    const resolvedDuration =
      durationAction && 'ms' in durationAction ? durationAction.ms : LONG_DURATION_MS;
    const durationLabel = resolvedDuration === SHORT_DURATION_MS ? 'short' : 'long';
    const breadcrumbMessage = durationLabel === 'short' ? 'orch:grit:short' : 'orch:grit:steady';
    const compassionEnabled =
      compassionAction && 'enabled' in compassionAction ? Boolean(compassionAction.enabled) : true;

    Sentry.addBreadcrumb({
      category: 'orch',
      message: breadcrumbMessage,
      level: 'info',
      data: {
        duration: durationLabel,
        compassion: compassionEnabled,
      },
    });

    setChallengeDuration(resolvedDuration);
    setCompassionStreakEnabled(compassionEnabled);
    setSessionState('idle');
    setSessionSaved(false);
    setSaveError(null);
  }, [
    brsAssessment.isEligible,
    brsLevel,
    flags.FF_ASSESS_BRS,
    flags.FF_ASSESS_GRITS,
    flags.FF_ORCH_GRIT,
    gritAssessment.isEligible,
    gritLevel,
  ]);

  const durationKey = challengeDuration === SHORT_DURATION_MS ? 'short' : 'long';
  const durationInfo = durationDetails[durationKey];

  const startChallenge = useCallback(() => {
    setSessionState('running');
    setSessionSaved(false);
    setSaveError(null);
    setStartedAt(Date.now());
  }, []);

  const endChallenge = useCallback(async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const endedAt = Date.now();
    const elapsedMs = startedAt ? Math.max(endedAt - startedAt, 0) : challengeDuration;
    const durationSeconds = Math.max(60, Math.round(elapsedMs / 1000));

    try {
      await createSession({
        type: 'grit',
        duration_sec: durationSeconds,
        meta: {
          module: 'grit',
          duration: durationKey,
          compassion: compassionStreakEnabled,
        },
      });
      setSessionState('completed');
      setSessionSaved(true);
    } catch (error) {
      Sentry.captureException(error);
      setSaveError('Enregistrement momentanément indisponible. Réessaie dès que tu le sens.');
    } finally {
      setIsSaving(false);
    }
  }, [challengeDuration, compassionStreakEnabled, durationKey, isSaving, startedAt]);

  const canDisplay = gritAssessment.isEligible && brsAssessment.isEligible;

  const consentFallback = (
    <main className="px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Boss Grit</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Défi de résilience bienveillant</h1>
          <p className="text-base text-muted-foreground">
            Accepte le suivi clinique doux pour débloquer les défis ajustés à ta constance du moment.
          </p>
        </header>

        <Card role="region" aria-label="Consentement Boss Grit">
          <CardHeader>
            <CardTitle>Activer Boss Grit</CardTitle>
            <CardDescription>
              Ton opt-in clinique permet d’ajuster la durée et la douceur des défis, sans jamais dévoiler de scores.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </main>
  );

  const pageContent = (
    <main className="px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Boss Grit</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Défi de résilience bienveillant</h1>
          <p className="text-base text-muted-foreground">
            Les durées s’ajustent d’après tes bilans mensuels pour garder la progression accueillante, sans afficher de mesures chiffrées.
          </p>
        </header>

        {!canDisplay && (
          <Card role="region" aria-label="Activation des défis adaptés">
            <CardHeader>
              <CardTitle>Activer les bilans mensuels</CardTitle>
              <CardDescription>
                Lorsque tu autorises les bilans GRIT-S et BRS, les défis s’ajustent automatiquement à ton énergie du moment.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {canDisplay && (
          <Card role="region" aria-live="polite">
            <CardHeader>
              <CardTitle>{durationInfo.label}</CardTitle>
              <CardDescription>{durationInfo.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Compassion streak</h2>
                <p className="text-sm text-muted-foreground">
                  {compassionStreakEnabled
                    ? 'Ta série reste intacte même si tu ralentis ou fais une pause. On salue la régularité, pas la performance.'
                    : 'La série classique est active.'}
                </p>
              </section>

              {sessionState === 'idle' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Prépare ton mini-rituel : quelques respirations, une intention et c’est parti.
                  </p>
                  <Button type="button" onClick={startChallenge}>
                    Lancer le défi bienveillant
                  </Button>
                </div>
              )}

              {sessionState === 'running' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Prends ton temps. Le défi se termine en douceur quand tu appuies sur le bouton ci-dessous.
                  </p>
                  <Button type="button" onClick={endChallenge} disabled={isSaving}>
                    Terminer en douceur
                  </Button>
                </div>
              )}

              {sessionState === 'completed' && sessionSaved && (
                <p className="text-sm text-muted-foreground" aria-live="assertive">
                  Défi enregistré. Tu peux savourer la bienveillance accumulée ou relancer un nouveau défi.
                </p>
              )}

              {saveError && (
                <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {saveError}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );

  return (
    <ZeroNumberBoundary className="min-h-screen bg-muted/20">
      <ConsentGate fallback={consentFallback}>{pageContent}</ConsentGate>
    </ZeroNumberBoundary>
  );
}
