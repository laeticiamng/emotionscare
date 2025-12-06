'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import * as Sentry from '@sentry/react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useReducedMotion } from '@/components/ui/AccessibilityOptimized';
import { useFlags } from '@/core/flags';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import { screenSilkOrchestrator } from '@/features/orchestration/screenSilk.orchestrator';
import type { SetBlinkReminderAction, SetBlurOpacityAction } from '@/features/orchestration/types';
import { useAssessment } from '@/hooks/useAssessment';
import { createSession } from '@/services/sessions/sessionsApi';

const STORAGE_KEY = 'orchestration:screen_silk';

const readStoredLevel = (): number | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { cvsqLevel?: number } | null;
    return typeof parsed?.cvsqLevel === 'number' ? parsed.cvsqLevel : undefined;
  } catch (error) {
    console.warn('[screen-silk] unable to parse stored level', error);
    return undefined;
  }
};

const blinkLabel = (action: SetBlinkReminderAction | undefined) =>
  action?.key === 'gentle' ? 'Rappel de clignement doux activé.' : 'Rappel visuel désactivé pour laisser ton rythme naturel.';

const blurLabel = (action: SetBlurOpacityAction | undefined) => {
  if (!action) {
    return 'Affichage net sans filtre supplémentaire.';
  }
  if (action.key === 'very_low') {
    return 'Flou extrêmement léger pour ménager la sensibilité visuelle.';
  }
  return 'Flou discret pour adoucir la lumière de l’écran.';
};

const persistScreenSilkSession = async (payload: { blink: 'gentle' | 'none'; blur: 'very_low' | 'low' | 'none' }) => {
  try {
    await createSession({
      type: 'screen_silk',
      duration_sec: 0,
      mood_delta: null,
      meta: {
        module: 'screen_silk',
        blink: payload.blink,
        blur: payload.blur,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
  }
};

export default function ScreenSilkPage(): JSX.Element {
  const { flags } = useFlags();
  const assessment = useAssessment('CVSQ');
  const prefersReducedMotion = useReducedMotion();
  const [storedLevel, setStoredLevel] = useState<number | undefined>(undefined);
  const persistedSignatureRef = useRef<string | null>(null);
  const breadcrumbRef = useRef<string | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      setStoredLevel(readStoredLevel());
    }
  }, []);

  const zeroNumbersReady = flags.FF_ZERO_NUMBERS !== false;
  const orchestrationEnabled = Boolean(flags.FF_ORCH_SCREENSILK);
  const assessmentEnabled = Boolean(flags.FF_ASSESS_CVSQ);

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
    return screenSilkOrchestrator({ cvsqLevel: resolvedLevel, prm: prefersReducedMotion });
  }, [assessmentEnabled, orchestrationEnabled, prefersReducedMotion, resolvedLevel]);

  const blinkAction = hints.find((hint) => hint.action === 'set_blink_reminder') as SetBlinkReminderAction | undefined;
  const blurActions = hints.filter((hint) => hint.action === 'set_blur_opacity') as SetBlurOpacityAction[];
  const blurAction = blurActions.length ? blurActions[blurActions.length - 1] : undefined;
  const ctaVisible = hints.some((hint) => hint.action === 'post_cta' && hint.key === 'screen_silk');

  useEffect(() => {
    if (blinkAction && breadcrumbRef.current !== 'gentle') {
      Sentry.addBreadcrumb({ category: 'orch:screensilk', level: 'info', message: 'orch:screensilk:gentle' });
      breadcrumbRef.current = 'gentle';
    }
  }, [blinkAction]);

  useEffect(() => {
    if (!zeroNumbersReady || !orchestrationEnabled) {
      return;
    }
    const payload = {
      blink: blinkAction ? 'gentle' : 'none',
      blur: blurAction ? blurAction.key : 'none',
    } as const;
    const signature = JSON.stringify(payload);
    if (persistedSignatureRef.current === signature) {
      return;
    }
    persistedSignatureRef.current = signature;
    void persistScreenSilkSession(payload);
  }, [blinkAction, blurAction, orchestrationEnabled, zeroNumbersReady]);

  const ready = zeroNumbersReady && orchestrationEnabled && assessmentEnabled;

  const fallback = (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-6 px-6 py-12 text-slate-950">
      <h1 className="text-3xl font-semibold">Screen Silk</h1>
      <p className="text-base text-slate-700">
        Autorise l’opt-in clinique pour adapter les rappels de clignement et la douceur visuelle.
      </p>
    </main>
  );

  return (
    <ZeroNumberBoundary className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <ConsentGate fallback={fallback}>
        {ready ? (
          <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12 text-slate-950" id="main-content">
            <header className="space-y-3">
              <Badge className="bg-slate-900 text-slate-100" variant="secondary">
                Screen Silk
              </Badge>
              <h1 className="text-3xl font-semibold leading-tight">Repos visuel piloté par tes signaux</h1>
              <p className="max-w-2xl text-base text-slate-700">
                Le module ajuste automatiquement les rappels et le léger flou pour apaiser ton regard, sans jamais afficher de
                chiffres.
              </p>
            </header>

            <section className="grid gap-6 md:grid-cols-2" aria-label="Réglages Screen Silk">
              <Card aria-live="polite">
                <CardHeader>
                  <CardTitle>Rappels doux</CardTitle>
                  <CardDescription>Un signal léger t’invite à cligner en douceur</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-900">
                  <p>{blinkLabel(blinkAction)}</p>
                  <p>
                    Le rappel reste discret. Aucun son n’est utilisé, uniquement une légère pulsation visuelle lorsque nécessaire.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Filtre visuel</CardTitle>
                  <CardDescription>Le flou adaptatif s’ajuste à ton besoin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-900">
                  <p>{blurLabel(blurAction)}</p>
                  <p>
                    Tu peux réduire encore davantage les mouvements dans les préférences d’accessibilité si besoin. Screen Silk
                    respecte toujours le mode réduit.
                  </p>
                </CardContent>
              </Card>
            </section>

            {ctaVisible && (
              <Card>
                <CardHeader>
                  <CardTitle>Aller plus loin</CardTitle>
                  <CardDescription>Prolonge le confort après ta pause écran</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-sm text-slate-900">
                  <p>
                    Lorsque tu termines la routine Screen Silk, tu peux enchaîner avec une lumière respirante pour relancer
                    l’humidité oculaire.
                  </p>
                  <Link
                    href="/app/flash-glow"
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-slate-50 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500"
                  >
                    Lancer Flash Glow apaisé
                  </Link>
                </CardContent>
              </Card>
            )}
          </main>
        ) : (
          <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-8 px-6 py-12 text-slate-950">
            <h1 className="text-3xl font-semibold">Screen Silk</h1>
            <p className="max-w-2xl text-base text-slate-700">
              Active l’orchestration clinique pour que Screen Silk module automatiquement les rappels et le voile visuel.
            </p>
          </main>
        )}
      </ConsentGate>
    </ZeroNumberBoundary>
  );
}
