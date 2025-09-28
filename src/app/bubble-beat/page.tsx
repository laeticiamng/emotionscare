'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { createSession } from '@/services/sessions/sessionsApi';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { bubbleBeatOrchestrator } from '@/features/orchestration/bubbleBeat.orchestrator';
import type { PathVariantKey } from '@/features/orchestration/types';

const DEFAULT_DURATION_MS = 300_000;
const CALM_DURATION_MS = 120_000;
const CTA_NYVEE_LINK = '/app/coach';
const CTA_FLASH_LINK = '/flash-glow';
type CTAKey = 'nyvee' | 'flash_glow';

const variantDetails: Record<PathVariantKey, { title: string; description: string; breathingCue: string }> = {
  default: {
    title: 'Parcours vibrant',
    description: 'Un voyage sensoriel dynamique pour relâcher la pression avec un tempo enjoué.',
    breathingCue: 'Respire calmement à ton rythme, les bulles s’adaptent en douceur.',
  },
  hr: {
    title: 'Parcours apaisant',
    description: 'Bulles fluides, palette feutrée et sons respiratoires pour apaiser la charge du moment.',
    breathingCue: 'Allonge l’expiration, la séquence suit un rythme cardiaque tranquille.',
  },
};

export default function BubbleBeatPage(): JSX.Element {
  const { flags } = useFlags();
  const assessment = useAssessment('PSS10');
  const { data: history } = useAssessmentHistory('PSS10', { limit: 1, enabled: assessment.isEligible });

  const [variant, setVariant] = useState<PathVariantKey>('default');
  const [durationMs, setDurationMs] = useState(DEFAULT_DURATION_MS);
  const [ctaKey, setCtaKey] = useState<CTAKey>('flash_glow');
  const [sessionState, setSessionState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [isSaving, setIsSaving] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);

  const level = useMemo(() => {
    if (typeof assessment.state.lastComputation?.level === 'number') {
      return assessment.state.lastComputation.level;
    }
    if (history && history.length > 0) {
      return history[0].level;
    }
    return null;
  }, [assessment.state.lastComputation?.level, history]);

  useEffect(() => {
    if (!flags.FF_ORCH_BUBBLE || !flags.FF_ASSESS_PSS10) {
      return;
    }
    if (!assessment.isEligible) {
      return;
    }

    const actions = bubbleBeatOrchestrator({
      pssLevel: typeof level === 'number' ? level : undefined,
    });
    const variantAction = actions.find((action) => action.action === 'set_path_variant');
    const durationAction = actions.find((action) => action.action === 'set_path_duration');
    const ctaAction = actions.find((action) => action.action === 'post_cta');

    const resolvedVariant = variantAction && 'key' in variantAction ? variantAction.key : 'default';
    const resolvedDuration = durationAction && 'ms' in durationAction ? durationAction.ms : DEFAULT_DURATION_MS;
    const resolvedCta: CTAKey = ctaAction && 'key' in ctaAction ? ctaAction.key : 'flash_glow';
    const breadcrumbMessage = resolvedVariant === 'hr' ? 'orch:bubble:hr' : 'orch:bubble:flash';

    Sentry.addBreadcrumb({
      category: 'orch',
      message: breadcrumbMessage,
      level: 'info',
      data: {
        variant: resolvedVariant,
        cta: resolvedCta,
      },
    });

    setVariant(resolvedVariant);
    setDurationMs(resolvedDuration);
    setCtaKey(resolvedCta);
    setSessionState('idle');
    setSessionSaved(false);
    setSaveError(null);
  }, [assessment.isEligible, flags.FF_ASSESS_PSS10, flags.FF_ORCH_BUBBLE, level]);

  const startSession = useCallback(() => {
    setSessionState('running');
    setSessionSaved(false);
    setSaveError(null);
    setStartedAt(Date.now());
  }, []);

  const completeSession = useCallback(async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    const endedAt = Date.now();
    const elapsedMs = startedAt ? Math.max(endedAt - startedAt, 0) : durationMs;
    const durationSeconds = Math.max(60, Math.round(elapsedMs / 1000));

    try {
      await createSession({
        type: 'bubble',
        duration_sec: durationSeconds,
        meta: {
          module: 'bubble',
          variant,
          duration: durationMs <= CALM_DURATION_MS ? 'short' : 'standard',
          post: ctaKey,
        },
      });
      setSessionState('completed');
      setSessionSaved(true);
    } catch (error) {
      Sentry.captureException(error);
      setSaveError('Impossible de consigner cette bulle sonore pour le moment. Retente bientôt.');
    } finally {
      setIsSaving(false);
    }
  }, [ctaKey, durationMs, isSaving, startedAt, variant]);

  const canDisplay = assessment.isEligible;
  const variantInfo = variantDetails[variant];
  const durationHint = durationMs <= CALM_DURATION_MS ? 'Environ deux minutes' : 'Environ cinq minutes';

  const consentFallback = (
    <main className="px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Bubble Beat</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Libération musicale anti-stress</h1>
          <p className="text-base text-muted-foreground">
            Accepte l’écoute clinique douce pour débloquer un parcours sonore ajusté à ton ressenti.
          </p>
        </header>

        <Card role="region" aria-label="Consentement Bubble Beat">
          <CardHeader>
            <CardTitle>Activer Bubble Beat</CardTitle>
            <CardDescription>
              Après consentement, la bulle choisit automatiquement la variante la plus apaisante sans afficher de scores.
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
          <p className="text-sm font-medium text-muted-foreground">Bubble Beat</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Libération musicale anti-stress</h1>
          <p className="text-base text-muted-foreground">
            La séance ajuste automatiquement son intensité selon ton ressenti, sans jamais afficher de chiffres cliniques.
          </p>
        </header>

        {!canDisplay && (
          <Card role="region" aria-label="Activation de l’orchestration Bubble Beat">
            <CardHeader>
              <CardTitle>Activer le suivi du stress</CardTitle>
              <CardDescription>
                Dès que tu autorises l’évaluation douce PSS, Bubble Beat prépare un parcours adapté et plus léger en cas de pic de stress.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {canDisplay && (
          <Card role="region" aria-live="polite">
            <CardHeader>
              <CardTitle>{variantInfo.title}</CardTitle>
              <CardDescription>{variantInfo.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Cue respiratoire</h2>
                <p className="text-sm text-muted-foreground">{variantInfo.breathingCue}</p>
                <p className="text-sm text-muted-foreground">Durée proposée : {durationHint}.</p>
              </section>

              {sessionState === 'idle' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Installe-toi confortablement, choisis un volume doux et laisse les bulles guider ton relâchement.
                  </p>
                  <Button type="button" onClick={startSession}>
                    Démarrer la séance
                  </Button>
                </div>
              )}

              {sessionState === 'running' && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Ferme les yeux si tu le souhaites, les transitions respectent la réduction des mouvements.
                  </p>
                  <Button type="button" onClick={completeSession} disabled={isSaving}>
                    Terminer la bulle sonore
                  </Button>
                </div>
              )}

              {sessionState === 'completed' && sessionSaved && (
                <div className="space-y-2" aria-live="assertive">
                  <p className="text-sm text-muted-foreground">
                    Séance enregistrée. Respire un instant avant de poursuivre ta journée.
                  </p>
                  {ctaKey === 'nyvee' && (
                    <Button asChild variant="secondary">
                      <Link href={CTA_NYVEE_LINK}>Parler à Nyvée</Link>
                    </Button>
                  )}
                  {ctaKey === 'flash_glow' && (
                    <Button asChild variant="secondary">
                      <Link href={CTA_FLASH_LINK}>Ouvrir Flash Glow</Link>
                    </Button>
                  )}
                </div>
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
