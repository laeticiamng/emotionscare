'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as Sentry from '@sentry/react';

import { ZeroNumberBoundary } from '@/components/a11y/ZeroNumberBoundary';
import ConsentGate from '@/components/consent/ConsentGate';
import { ConsentProvider, useConsent } from '@/features/clinical-optin/ConsentProvider';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { activityJardinOrchestrator, persistOrchestrationSession } from '@/features/orchestration';

function ActivityExperience() {
  const { flags } = useFlags();
  const { clinicalAccepted } = useConsent();
  const assessment = useAssessment('WHO5');

  const zeroNumbersActive = flags.FF_ZERO_NUMBERS !== false;
  const orchestrationEnabled = flags.FF_ORCH_ACTIVITY !== false;
  const assessmentEnabled = flags.FF_ASSESS_WHO5 !== false;

  const who5Level = assessment.lastLevel ?? undefined;

  const hints = useMemo(() => {
    if (!orchestrationEnabled || !assessmentEnabled) {
      return [{ action: 'none' as const }];
    }
    return activityJardinOrchestrator({ who5Level: typeof who5Level === 'number' ? who5Level : undefined });
  }, [assessmentEnabled, orchestrationEnabled, who5Level]);

  const actionable = hints.filter((hint) => hint.action !== 'none');
  const highlightsHint = actionable.find((hint) => hint.action === 'show_highlights');
  const highlights = highlightsHint && 'items' in highlightsHint ? highlightsHint.items : [];

  const metadata = useMemo(() => {
    if (!highlights?.length) {
      return {};
    }
    return {
      highlights: highlights.map((item) => item.toLowerCase().replace(/[^a-zàâçéèêëîïôûùüÿñœ\s-]/gi, '')).join('|'),
    } satisfies Record<string, string | undefined>;
  }, [highlights]);

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
    void persistOrchestrationSession('activity_jardin', metadata);
  }, [consented, metadata]);

  const breadcrumbLogged = useRef<boolean>(false);
  useEffect(() => {
    if (!breadcrumbLogged.current && highlights.length) {
      Sentry.addBreadcrumb({
        category: 'orchestration',
        level: 'info',
        message: 'orch:activity:highlights',
      });
      breadcrumbLogged.current = true;
    }
  }, [highlights.length]);

  const handleShare = useCallback(() => {
    void assessment.triggerAssessment('WHO5');
  }, [assessment]);

  if (!zeroNumbersActive) {
    return (
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16 text-emerald-900">
        <h1 className="text-2xl font-semibold">Jardin en pause</h1>
        <p className="text-base text-emerald-700">Active la protection sans chiffres pour recevoir ces appuis tout en douceur.</p>
      </section>
    );
  }

  if (!assessmentEnabled) {
    return (
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16 text-emerald-900">
        <h1 className="text-2xl font-semibold">Jardin apaisé</h1>
        <p className="text-base text-emerald-700">L'instrument bien-être est en veille. Tu peux toutefois profiter d'une promenade calme.</p>
      </section>
    );
  }

  if (!orchestrationEnabled) {
    return (
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16 text-emerald-900">
        <h1 className="text-2xl font-semibold">Activités libres</h1>
        <p className="text-base text-emerald-700">L'orchestration est momentanément désactivée. Choisis les gestes qui te semblent soutenants.</p>
      </section>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12 text-emerald-900">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-emerald-600">Activity Jardin</p>
        <h1 className="text-3xl font-semibold leading-tight">Trois appuis pour la semaine</h1>
        <p className="max-w-2xl text-base text-emerald-700">
          Ton ressenti partagé via le WHO cinq inspire une sélection douce, sans aucun chiffre.
        </p>
      </header>

      <section className="rounded-3xl bg-emerald-50 px-6 py-5 text-emerald-800 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-500">Ce qui peut aider</h2>
        <ul className="mt-3 space-y-3">
          {(highlights.length ? highlights : ['Respiration calme', 'Écriture brève', 'Moment Nyvée']).map((item) => (
            <li key={item} className="rounded-2xl bg-white px-4 py-3 text-base">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="rounded-full bg-emerald-900 px-5 py-2 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-900/90"
        >
          Partager un ressenti WHO cinq
        </button>
        <button
          type="button"
          className="rounded-full border border-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
        >
          Planter une pause
        </button>
      </div>

      <footer className="rounded-3xl bg-emerald-50 px-6 py-5 text-sm text-emerald-700">
        {consented
          ? 'Merci pour ton partage, ces appuis s\'ajustent selon ton équilibre émotionnel.'
          : 'Tu peux explorer le jardin sans partage, les suggestions resteront très douces.'}
      </footer>
    </main>
  );
}

export default function ActivityPage() {
  return (
    <ConsentProvider defaultAccepted={false}>
      <ZeroNumberBoundary className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-emerald-100 text-emerald-900">
        <ConsentGate>
          <ActivityExperience />
        </ConsentGate>
      </ZeroNumberBoundary>
    </ConsentProvider>
  );
}

