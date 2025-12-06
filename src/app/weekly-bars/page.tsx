'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlags } from '@/core/flags';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { weeklyBarsOrchestrator } from '@/features/orchestration/weeklyBars.orchestrator';
import type { ShowBarsTextAction } from '@/features/orchestration/types';
import { useAssessment } from '@/hooks/useAssessment';
import { createSession } from '@/services/sessions/sessionsApi';

const STORAGE_KEY = 'orchestration:weekly_bars';

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
    console.warn('[weekly-bars] unable to parse stored level', error);
    return undefined;
  }
};

const describeBars = (items: string[]) =>
  items.length
    ? `Ta semaine se traduit par les couleurs « ${items.join(' » et « ')} ». `
    : 'Ta semaine reste ouverte à interprétation, aucune barre n’est affichée.';

const persistWeeklyBarsSession = async (payload: { bars: string[]; cta: 'flash_glow' | 'none' }) => {
  try {
    await createSession({
      type: 'weekly_bars',
      duration_sec: 0,
      mood_delta: null,
      meta: {
        module: 'weekly_bars',
        bars: payload.bars,
        cta: payload.cta,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
  }
};

export default function WeeklyBarsPage(): JSX.Element {
  const { flags } = useFlags();
  const assessment = useAssessment('WHO5');
  const [storedLevel, setStoredLevel] = useState<number | undefined>(undefined);
  const persistedSignatureRef = useRef<string | null>(null);
  const breadcrumbRef = useRef<boolean>(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      setStoredLevel(readStoredLevel());
    }
  }, []);

  const zeroNumbersReady = flags.FF_ZERO_NUMBERS !== false;
  const orchestrationEnabled = Boolean(flags.FF_ORCH_WEEKLYBARS);
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
    return weeklyBarsOrchestrator({ who5Level: resolvedLevel });
  }, [assessmentEnabled, orchestrationEnabled, resolvedLevel]);

  const barsAction = hints.find((hint) => hint.action === 'show_bars_text') as ShowBarsTextAction | undefined;
  const barItems = barsAction?.items ?? [];
  const ctaAction = hints.find((hint) => hint.action === 'post_cta' && hint.key === 'flash_glow');

  useEffect(() => {
    if (barItems.length && !breadcrumbRef.current) {
      Sentry.addBreadcrumb({ category: 'orch:weekly', level: 'info', message: 'orch:weekly:bars' });
      breadcrumbRef.current = true;
    }
  }, [barItems]);

  useEffect(() => {
    if (!zeroNumbersReady || !orchestrationEnabled) {
      return;
    }
    const payload = {
      bars: barItems,
      cta: ctaAction ? 'flash_glow' : 'none',
    } as const;
    const signature = JSON.stringify(payload);
    if (persistedSignatureRef.current === signature) {
      return;
    }
    persistedSignatureRef.current = signature;
    void persistWeeklyBarsSession(payload);
  }, [barItems, ctaAction, orchestrationEnabled, zeroNumbersReady]);

  const ready = zeroNumbersReady && orchestrationEnabled && assessmentEnabled;

  const fallback = (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-12 text-amber-950">
      <h1 className="text-3xl font-semibold">Weekly Bars</h1>
      <p className="text-base text-amber-800">
        Active les évaluations bien-être pour découvrir les barres verbales personnalisées.
      </p>
    </main>
  );

  return (
    <ZeroNumberBoundary className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100">
      <ConsentGate fallback={fallback}>
        {ready ? (
          <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12 text-amber-950" id="main-content">
            <header className="space-y-3">
              <Badge className="bg-amber-900 text-amber-100" variant="secondary">
                Weekly Bars
              </Badge>
              <h1 className="text-3xl font-semibold leading-tight">Ta semaine en mots vivants</h1>
              <p className="max-w-2xl text-base text-amber-800">
                Les barres verbales reflètent ton état général sans afficher de chiffres. Laisse-toi guider par la texture des
                mots proposés.
              </p>
            </header>

            <Card aria-live="polite">
              <CardHeader>
                <CardTitle>Palette hebdomadaire</CardTitle>
                <CardDescription>{describeBars(barItems)}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3 text-sm text-amber-900">
                {barItems.map((item) => (
                  <span key={item} className="rounded-full bg-amber-900 px-4 py-2 text-amber-50">
                    {item}
                  </span>
                ))}
                {!barItems.length && (
                  <span className="rounded-full bg-amber-100 px-4 py-2 text-amber-700">
                    Aucun repère cette fois-ci, écoute ton ressenti du moment.
                  </span>
                )}
              </CardContent>
            </Card>

            {ctaAction && (
              <Card>
                <CardHeader>
                  <CardTitle>Proposition apaisante</CardTitle>
                  <CardDescription>Respire doucement pour prolonger cet état</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-sm text-amber-900">
                  <p>
                    Lorsque la barre « posé » ressort, Flash Glow offre une lumière qui accompagne ton rythme sans chiffres ni
                    compte à rebours.
                  </p>
                  <Link
                    href="/app/flash-glow"
                    className="inline-flex items-center justify-center rounded-full bg-amber-900 px-4 py-2 text-amber-50 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    aria-label="Respirer deux minutes avec Flash Glow"
                  >
                    Respirer deux minutes ?
                  </Link>
                </CardContent>
              </Card>
            )}
          </main>
        ) : (
          <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-12 text-amber-950">
            <h1 className="text-3xl font-semibold">Weekly Bars</h1>
            <p className="max-w-2xl text-base text-amber-800">
              Active l’orchestration clinique pour visualiser ta semaine en mots plutôt qu’en chiffres.
            </p>
          </main>
        )}
      </ConsentGate>
    </ZeroNumberBoundary>
  );
}
