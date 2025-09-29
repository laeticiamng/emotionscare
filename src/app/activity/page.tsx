'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlags } from '@/core/flags';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { activityJardinOrchestrator } from '@/features/orchestration/activityJardin.orchestrator';
import type { ShowHighlightsAction } from '@/features/orchestration/types';
import { useAssessment } from '@/hooks/useAssessment';
import { createSession } from '@/services/sessions/sessionsApi';

const STORAGE_KEY = 'orchestration:activity';

const readStoredLevel = (): number | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { who5Level?: number } | null;
    return typeof parsed?.who5Level === 'number' ? parsed.who5Level : undefined;
  } catch (error) {
    console.warn('[activity] unable to parse stored level', error);
    return undefined;
  }
};

const humanizeHighlight = (item: string) =>
  item
    .replace(/1\s*min/gi, 'une minute')
    .replace(/2\s*phrases/gi, 'deux phrases')
    .replace(/\d+/g, (match) => (match === '1' ? 'une' : match === '2' ? 'deux' : 'quelques'));

const persistActivitySession = async () => {
  try {
    await createSession({
      type: 'activity',
      duration_sec: 0,
      mood_delta: null,
      meta: {
        module: 'activity',
        highlights: ['respirer', 'journal', 'nyvée'],
      },
    });
  } catch (error) {
    Sentry.captureException(error);
  }
};

export default function ActivityPage(): JSX.Element {
  const { flags } = useFlags();
  const assessment = useAssessment('WHO5');
  const [storedLevel, setStoredLevel] = useState<number | undefined>(undefined);
  const persistedRef = useRef<boolean>(false);
  const breadcrumbRef = useRef<boolean>(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      setStoredLevel(readStoredLevel());
    }
  }, []);

  const zeroNumbersReady = flags.FF_ZERO_NUMBERS !== false;
  const orchestrationEnabled = Boolean(flags.FF_ORCH_ACTIVITY);
  const assessmentEnabled = Boolean(flags.FF_ASSESS_WHO5);

  const resolvedLevel =
    typeof storedLevel === 'number'
      ? storedLevel
      : typeof assessment.lastLevel === 'number'
        ? assessment.lastLevel
        : undefined;

  const hints = useMemo(() => {
    if (!orchestrationEnabled || !assessmentEnabled) {
      return [{ action: 'none' as const }];
    }
    return activityJardinOrchestrator({ who5Level: resolvedLevel });
  }, [assessmentEnabled, orchestrationEnabled, resolvedLevel]);

  const highlightAction = hints.find((hint) => hint.action === 'show_highlights') as ShowHighlightsAction | undefined;
  const displayHighlights = (highlightAction?.items ?? []).map(humanizeHighlight);

  useEffect(() => {
    if (highlightAction && !breadcrumbRef.current) {
      Sentry.addBreadcrumb({ category: 'orch:activity', level: 'info', message: 'orch:activity:highlights' });
      breadcrumbRef.current = true;
    }
  }, [highlightAction]);

  useEffect(() => {
    if (!highlightAction || !zeroNumbersReady || !orchestrationEnabled || persistedRef.current) {
      return;
    }
    persistedRef.current = true;
    void persistActivitySession();
  }, [highlightAction, orchestrationEnabled, zeroNumbersReady]);

  const ready = zeroNumbersReady && orchestrationEnabled && assessmentEnabled;

  const fallback = (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-12 text-emerald-950">
      <h1 className="text-3xl font-semibold">Activity Jardin</h1>
      <p className="text-base text-emerald-800">
        Autorise le partage clinique pour recevoir des suggestions apaisantes adaptées à ton ressenti.
      </p>
    </main>
  );

  return (
    <ZeroNumberBoundary className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100">
      <ConsentGate fallback={fallback}>
        {ready ? (
          <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12 text-emerald-950" id="main-content">
            <header className="space-y-3">
              <Badge className="bg-emerald-900 text-emerald-100" variant="secondary">
                Activity Jardin
              </Badge>
              <h1 className="text-3xl font-semibold leading-tight">Trois appuis qui aident cette semaine</h1>
              <p className="max-w-2xl text-base text-emerald-800">
                Les propositions ci-dessous s’appuient sur ton dernier ressenti bien-être. Tout est exprimé en mots doux, sans
                chiffres ni graphiques.
              </p>
            </header>

            <Card aria-live="polite">
              <CardHeader>
                <CardTitle>Palette de soutien</CardTitle>
                <CardDescription>Nous avons sélectionné trois gestes pour nourrir ton énergie</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-emerald-900">
                <ul className="space-y-3">
                  {displayHighlights.map((item) => (
                    <li key={item} className="rounded-lg bg-emerald-50 px-4 py-3">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-emerald-700">
                  Choisis ce qui résonne le plus aujourd’hui. Tu peux noter ton ressenti après chaque geste pour affiner les
                  prochaines suggestions.
                </p>
              </CardContent>
            </Card>

            <section className="grid gap-6 md:grid-cols-2" aria-label="Continuer l’exploration">
              <Card>
                <CardHeader>
                  <CardTitle>Journal doux</CardTitle>
                  <CardDescription>Écris deux phrases pour ancrer ton ressenti</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-emerald-900">
                  <p>
                    Tu peux ouvrir la section Journal pour déposer quelques mots. Nous te suggérons un format très court, sans
                    contrainte.
                  </p>
                  <Link
                    href="/app/modules"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-900 px-4 py-2 text-emerald-50 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    Ouvrir le journal
                  </Link>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Respiration douce</CardTitle>
                  <CardDescription>Prolonge ta pause par une lumière respirante</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-emerald-900">
                  <p>
                    Un détour par Flash Glow peut prolonger la détente. La session se cale automatiquement sur ton état du moment.
                  </p>
                  <Link
                    href="/app/flash-glow"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-900 px-4 py-2 text-emerald-50 hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    Rejoindre Flash Glow
                  </Link>
                </CardContent>
              </Card>
            </section>
          </main>
        ) : (
          <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-12 text-emerald-950">
            <h1 className="text-3xl font-semibold">Activity Jardin</h1>
            <p className="max-w-2xl text-base text-emerald-800">
              Active les évaluations bien-être pour révéler les trois appuis de soutien personnalisés.
            </p>
          </main>
        )}
      </ConsentGate>
    </ZeroNumberBoundary>
  );
}
