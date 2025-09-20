'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';

import { ZeroNumberBoundary } from '@/components/a11y/ZeroNumberBoundary';
import ConsentGate from '@/components/consent/ConsentGate';
import { ConsentProvider, useConsent } from '@/features/clinical-optin/ConsentProvider';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { persistOrchestrationSession, screenSilkOrchestrator } from '@/features/orchestration';
import { useReducedMotion } from '@/components/ui/AccessibilityOptimized';

const BLINK_LABEL = 'Pense à cligner doucement';
const BLUR_LABELS: Record<'neutral' | 'low' | 'very_low', string> = {
  neutral: 'Clarté normale',
  low: 'Voile très doux',
  very_low: 'Voile à peine perceptible',
};

function ScreenSilkExperience() {
  const { flags } = useFlags();
  const { clinicalAccepted } = useConsent();
  const assessment = useAssessment('CVSQ');
  const prefersReducedMotion = useReducedMotion();
  const [overrideLevel, setOverrideLevel] = useState<number | null>(null);

  const zeroNumbersActive = flags.FF_ZERO_NUMBERS !== false;
  const orchestrationEnabled = flags.FF_ORCH_SCREENSILK !== false;
  const assessmentEnabled = flags.FF_ASSESS_CVSQ !== false;

  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
      return;
    }
    try {
      const raw = window.localStorage.getItem('orchestration:screen_silk');
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw);
      setOverrideLevel(typeof parsed?.cvsqLevel === 'number' ? parsed.cvsqLevel : null);
    } catch (error) {
      console.warn('[screen-silk/page] unable to parse override level', error);
    }
  }, []);

  const cvsqLevel = overrideLevel ?? (assessment.lastLevel ?? undefined);

  const hints = useMemo(() => {
    if (!orchestrationEnabled || !assessmentEnabled) {
      return [{ action: 'none' as const }];
    }
    return screenSilkOrchestrator({
      cvsqLevel: typeof cvsqLevel === 'number' ? cvsqLevel : undefined,
      prm: prefersReducedMotion,
    });
  }, [assessmentEnabled, cvsqLevel, orchestrationEnabled, prefersReducedMotion]);

  const actionable = hints.filter((hint) => hint.action !== 'none');
  const blinkHint = actionable.find((hint) => hint.action === 'set_blink_reminder');
  const blurHints = actionable.filter((hint) => hint.action === 'set_blur_opacity');
  const ctaHint = actionable.find((hint) => hint.action === 'post_cta' && hint.key === 'screen_silk');

  const blurKey = blurHints.length ? blurHints[blurHints.length - 1].key : ('neutral' as const);

  const metadata = useMemo(() => {
    if (!actionable.length) {
      return {};
    }
    return {
      blink: blinkHint ? 'gentle' : undefined,
      blur: blurKey === 'neutral' ? undefined : blurKey,
      cta: ctaHint ? 'screen_silk' : undefined,
    } satisfies Record<string, string | undefined>;
  }, [actionable.length, blinkHint, blurKey, ctaHint]);

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
    void persistOrchestrationSession('screen_silk', metadata);
  }, [consented, metadata]);

  const breadcrumbLogged = useRef<boolean>(false);
  useEffect(() => {
    if (!breadcrumbLogged.current && (blinkHint || blurHints.length)) {
      Sentry.addBreadcrumb({
        category: 'orchestration',
        level: 'info',
        message: 'orch:screensilk:gentle',
      });
      breadcrumbLogged.current = true;
    }
  }, [blinkHint, blurHints.length]);

  const handleShare = useCallback(() => {
    void assessment.triggerAssessment('CVSQ');
  }, [assessment]);

  if (!zeroNumbersActive) {
    return (
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16 text-sky-900">
        <h1 className="text-2xl font-semibold">Screen Silk en veille</h1>
        <p className="text-base text-sky-700">Active la protection sans chiffres pour recevoir les conseils optiques humanisés.</p>
      </section>
    );
  }

  if (!assessmentEnabled) {
    return (
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16 text-sky-900">
        <h1 className="text-2xl font-semibold">Hygiène visuelle douce</h1>
        <p className="text-base text-sky-700">L'instrument Screen Silk repose pour l'instant. Les rappels restent neutres.</p>
      </section>
    );
  }

  if (!orchestrationEnabled) {
    return (
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16 text-sky-900">
        <h1 className="text-2xl font-semibold">Ajustements neutres</h1>
        <p className="text-base text-sky-700">L'orchestration Screen Silk est en pause. Tu peux conserver tes habitudes visuelles.</p>
      </section>
    );
  }

  const blinkLabel = blinkHint ? BLINK_LABEL : 'Clignements spontanés';
  const blurLabel = BLUR_LABELS[blurKey];

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12 text-sky-900">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-sky-600">Screen Silk</p>
        <h1 className="text-3xl font-semibold leading-tight">Repos visuel orchestré</h1>
        <p className="max-w-2xl text-base text-sky-700">
          Ton partage CVS Q ajuste le rappel de clignement et la douceur du flou, sans chiffres ni intensités abruptes.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-500">Rappel</h2>
          <p className="mt-2 text-base text-sky-800">{blinkLabel}</p>
        </article>
        <article className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-500">Voile visuel</h2>
          <p className="mt-2 text-base text-sky-800">{blurLabel}</p>
        </article>
        <article className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-500">Confort</h2>
          <p className="mt-2 text-base text-sky-800">
            {prefersReducedMotion ? 'Animations adoucies pour ton confort' : 'Transitions fluides et légères'}
          </p>
        </article>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="rounded-full bg-sky-900 px-5 py-2 text-sm font-semibold text-sky-50 transition hover:bg-sky-900/90"
        >
          Partager un ressenti Screen Silk
        </button>
        {ctaHint && (
          <button
            type="button"
            className="rounded-full border border-sky-400 px-5 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
          >
            Ouvrir l'espace repos écran
          </button>
        )}
      </div>

      <footer className="rounded-3xl bg-sky-50 px-6 py-5 text-sm text-sky-700">
        {consented
          ? 'Merci pour ton partage, chaque session ajuste la douceur visuelle automatiquement.'
          : 'Tu peux profiter de Screen Silk sans partage, l\'expérience reste calme par défaut.'}
      </footer>
    </main>
  );
}

export default function ScreenSilkPage() {
  return (
    <ConsentProvider defaultAccepted={false}>
      <ZeroNumberBoundary className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-sky-100 text-sky-900">
        <ConsentGate>
          <ScreenSilkExperience />
        </ConsentGate>
      </ZeroNumberBoundary>
    </ConsentProvider>
  );
}

