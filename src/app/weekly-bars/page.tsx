'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as Sentry from '@sentry/react';

import { ZeroNumberBoundary } from '@/components/a11y/ZeroNumberBoundary';
import ConsentGate from '@/components/consent/ConsentGate';
import { ConsentProvider, useConsent } from '@/features/clinical-optin/ConsentProvider';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { persistOrchestrationSession, weeklyBarsOrchestrator } from '@/features/orchestration';

function WeeklyBarsExperience() {
  const { flags } = useFlags();
  const { clinicalAccepted } = useConsent();
  const assessment = useAssessment('WHO5');

  const zeroNumbersActive = flags.FF_ZERO_NUMBERS !== false;
  const orchestrationEnabled = flags.FF_ORCH_WEEKLYBARS !== false;
  const assessmentEnabled = flags.FF_ASSESS_WHO5 !== false;

  const who5Level = assessment.lastLevel ?? undefined;

  const hints = useMemo(() => {
    if (!orchestrationEnabled || !assessmentEnabled) {
      return [{ action: 'none' as const }];
    }
    return weeklyBarsOrchestrator({ who5Level: typeof who5Level === 'number' ? who5Level : undefined });
  }, [assessmentEnabled, orchestrationEnabled, who5Level]);

  const actionable = hints.filter((hint) => hint.action !== 'none');
  const barsHint = actionable.find((hint) => hint.action === 'show_bars_text');
  const ctaHint = actionable.find((hint) => hint.action === 'post_cta' && hint.key === 'flash_glow');

  const bars = barsHint && 'items' in barsHint ? barsHint.items : ['posé', 'doux'];

  const metadata = useMemo(() => {
    if (!bars?.length) {
      return {};
    }
    return {
      bars: bars.join('|'),
      cta: ctaHint ? 'flash_glow' : undefined,
    } satisfies Record<string, string | undefined>;
  }, [bars, ctaHint]);

  const consented = clinicalAccepted && assessment.state.hasConsent;
  const persistedSignature = useRef<string | null>(null);

  useEffect(() => {
    if (!consented) {
      return;
    }
    const signature = JSON.stringify(metadata);
    if (!signature || signature === '{}' || persistedSignature.current === signature) {
      return;
    }
    persistedSignature.current = signature;
    void persistOrchestrationSession('weekly_bars', metadata);
  }, [consented, metadata]);

  const breadcrumbLogged = useRef<boolean>(false);
  useEffect(() => {
    if (!breadcrumbLogged.current && bars.length) {
      Sentry.addBreadcrumb({
        category: 'orchestration',
        level: 'info',
        message: 'orch:weekly:bars',
      });
      breadcrumbLogged.current = true;
    }
  }, [bars.length]);

  const handleShare = useCallback(() => {
    void assessment.triggerAssessment('WHO5');
  }, [assessment]);

  const handleFlashGlow = useCallback(() => {
    window.open('/flash-glow', '_blank', 'noopener');
  }, []);

  if (!zeroNumbersActive) {
    return (
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16 text-indigo-900">
        <h1 className="text-2xl font-semibold">Weekly Bars en veille</h1>
        <p className="text-base text-indigo-700">Active la protection sans chiffres pour découvrir les barres verbales apaisées.</p>
      </section>
    );
  }

  if (!assessmentEnabled) {
    return (
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16 text-indigo-900">
        <h1 className="text-2xl font-semibold">Semaine contemplative</h1>
        <p className="text-base text-indigo-700">L'instrument WHO cinq se repose. La lecture reste poétique et neutre.</p>
      </section>
    );
  }

  if (!orchestrationEnabled) {
    return (
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16 text-indigo-900">
        <h1 className="text-2xl font-semibold">Barres libres</h1>
        <p className="text-base text-indigo-700">L'orchestration Weekly Bars est en pause. Tu peux inventer tes propres mots.</p>
      </section>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12 text-indigo-900">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-indigo-600">Weekly Bars</p>
        <h1 className="text-3xl font-semibold leading-tight">Ta semaine en mots</h1>
        <p className="max-w-2xl text-base text-indigo-700">
          Ces barres verbales se nourrissent de ton ressenti WHO cinq tout en restant pleinement textuelles.
        </p>
      </header>

      <section className="rounded-3xl bg-indigo-50 px-6 py-5 text-indigo-800 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-500">Palette actuelle</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {bars.map((item) => (
            <span
              key={item}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-indigo-800 shadow-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="rounded-full bg-indigo-900 px-5 py-2 text-sm font-semibold text-indigo-50 transition hover:bg-indigo-900/90"
        >
          Partager un ressenti WHO cinq
        </button>
        {ctaHint && (
          <button
            type="button"
            onClick={handleFlashGlow}
            className="rounded-full border border-indigo-400 px-5 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
          >
            Rejoindre Flash Glow
          </button>
        )}
      </div>

      <footer className="rounded-3xl bg-indigo-50 px-6 py-5 text-sm text-indigo-700">
        {consented
          ? 'Merci pour ton partage, ces mots évoluent au rythme de ton équilibre émotionnel.'
          : 'Tu peux savourer ces mots sans partage, ils resteront enveloppants et doux.'}
      </footer>
    </main>
  );
}

export default function WeeklyBarsPage() {
  return (
    <ConsentProvider defaultAccepted={false}>
      <ZeroNumberBoundary className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 text-indigo-900">
        <ConsentGate>
          <WeeklyBarsExperience />
        </ConsentGate>
      </ZeroNumberBoundary>
    </ConsentProvider>
  );
}

