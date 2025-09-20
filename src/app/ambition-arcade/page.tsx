'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { useAssessmentHistory } from '@/hooks/useAssessmentHistory';
import { createSession } from '@/services/sessions/sessionsApi';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { AMBITION_MICRO_LEVERS, ambitionArcadeOrchestrator } from '@/features/orchestration/ambitionArcade.orchestrator';
import type { TextProgressKey } from '@/features/orchestration/types';

interface MicroLeverState {
  id: string;
  label: string;
  checked: boolean;
}

const DEFAULT_MICRO_LEVERS = [...AMBITION_MICRO_LEVERS];

const PROGRESS_LABELS: Record<TextProgressKey, { title: string; helper: string }> = {
  doucement: {
    title: 'On avance doucement',
    helper: 'Petits pas doux pour rester en mouvement sans pression.',
  },
  'sur la bonne voie': {
    title: 'Tu es sur la bonne voie',
    helper: 'La dynamique est installée, on cultive l’élan avec délicatesse.',
  },
  'presque là': {
    title: 'Presque au point d’étincelle',
    helper: 'Encore un mini geste et l’objectif prend forme.',
  },
};

const slugify = (value: string, index: number) =>
  `${value
    .normalize('NFD')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()}-${index}`;

const toLeverState = (items: string[]): MicroLeverState[] =>
  items.map((label, index) => ({
    id: slugify(label, index),
    label,
    checked: false,
  }));

const AMBITION_DURATION_SEC = 180;

export default function AmbitionArcadePage(): JSX.Element {
  const { flags } = useFlags();
  const assessment = useAssessment('GAS');
  const { data: history } = useAssessmentHistory('GAS', {
    limit: 1,
    enabled: assessment.isEligible,
  });

  const [textProgress, setTextProgress] = useState<TextProgressKey>('sur la bonne voie');
  const [microLevers, setMicroLevers] = useState<MicroLeverState[]>(() => toLeverState(DEFAULT_MICRO_LEVERS));
  const [isSaving, setIsSaving] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const latestLevel = useMemo(() => {
    if (typeof assessment.state.lastComputation?.level === 'number') {
      return assessment.state.lastComputation.level;
    }
    if (history && history.length > 0 && typeof history[0]?.level === 'number') {
      return history[0].level;
    }
    return null;
  }, [assessment.state.lastComputation?.level, history]);

  useEffect(() => {
    if (!flags.FF_ORCH_AMBITION || !flags.FF_ASSESS_GAS) {
      return;
    }
    if (!assessment.isEligible || typeof latestLevel !== 'number') {
      return;
    }

    const actions = ambitionArcadeOrchestrator({ gasLevel: latestLevel ?? undefined });
    const textAction = actions.find((action) => action.action === 'set_progress_text');
    const leversAction = actions.find((action) => action.action === 'inject_micro_levers');

    Sentry.addBreadcrumb({
      category: 'orch',
      message: 'orch:ambition:levers',
      level: 'info',
      data: {
        progress: textAction?.key ?? null,
        micro_levers: leversAction && 'items' in leversAction ? leversAction.items : [],
      },
    });

    if (textAction && 'key' in textAction) {
      setTextProgress(textAction.key);
    }

    if (leversAction && 'items' in leversAction) {
      setMicroLevers(toLeverState(leversAction.items));
      setSessionSaved(false);
    }
  }, [assessment.isEligible, flags.FF_ASSESS_GAS, flags.FF_ORCH_AMBITION, latestLevel]);

  const toggleLever = useCallback((id: string) => {
    setMicroLevers((prev) =>
      prev.map((lever) =>
        lever.id === id
          ? {
              ...lever,
              checked: !lever.checked,
            }
          : lever,
      ),
    );
  }, []);

  const allCompleted = microLevers.length > 0 && microLevers.every((lever) => lever.checked);

  const handleSessionComplete = useCallback(async () => {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await createSession({
        type: 'ambition',
        duration_sec: AMBITION_DURATION_SEC,
        meta: {
          module: 'ambition',
          progress: textProgress,
          levers: microLevers.map((lever) => lever.label),
        },
      });
      setSessionSaved(true);
    } catch (error) {
      Sentry.captureException(error);
      setErrorMessage('Impossible de mémoriser cette mini-session pour le moment. Réessaye dans un instant.');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, microLevers, textProgress]);

  const progressContent = PROGRESS_LABELS[textProgress];

  return (
    <ZeroNumberBoundary className="min-h-screen bg-muted/20 px-4 py-10">
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <header className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Ambition Arcade</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Cap sur l’élan tout en douceur</h1>
          <p className="text-base text-muted-foreground">
            Ces mini-briques s’adaptent à ton ressenti pour entretenir la motivation sans afficher de chiffres.
          </p>
        </header>

        <ConsentGate>
          <div className="space-y-6">
            {!assessment.isEligible && (
              <Card role="region" aria-label="Activation des mini-indications">
                <CardHeader>
                  <CardTitle>Activer l’écoute clinique douce</CardTitle>
                  <CardDescription>
                    Les micro-leviers se synchroniseront après avoir accepté les bilans express. Tu peux gérer ton choix dans les
                    préférences de confidentialité.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}

            {assessment.isEligible && (
              <Card role="region" aria-live="polite">
                <CardHeader>
                  <CardTitle>{progressContent.title}</CardTitle>
                  <CardDescription>{progressContent.helper}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <section>
                    <p className="text-sm font-medium text-muted-foreground">Micro-leviers du jour</p>
                    <form className="mt-3 space-y-3" aria-label="Liste de micro-leviers">
                      {microLevers.map((lever) => (
                        <div key={lever.id} className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
                          <Checkbox
                            id={lever.id}
                            checked={lever.checked}
                            onCheckedChange={() => toggleLever(lever.id)}
                            aria-describedby={`${lever.id}-description`}
                          />
                          <div className="flex-1">
                            <Label htmlFor={lever.id} className="text-sm font-medium text-foreground">
                              {lever.label}
                            </Label>
                            <p id={`${lever.id}-description`} className="text-sm text-muted-foreground">
                              Coche pour ancrer ce geste dans ta journée.
                            </p>
                          </div>
                        </div>
                      ))}
                    </form>
                  </section>

                  {errorMessage && (
                    <div role="alert" className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <Button type="button" onClick={handleSessionComplete} disabled={!allCompleted || isSaving}>
                      {isSaving ? 'Enregistrement en cours…' : 'Terminer ma mini-session'}
                    </Button>
                    {sessionSaved && (
                      <p className="text-sm text-muted-foreground" aria-live="assertive">
                        Ta mini-session est notée. Tu peux en créer une nouvelle à tout moment.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ConsentGate>
      </main>
    </ZeroNumberBoundary>
  );
}
