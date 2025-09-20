'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';

import { ZeroNumberBoundary } from '@/components/a11y/ZeroNumberBoundary';
import ConsentGate from '@/components/consent/ConsentGate';
import { ConsentProvider, useConsent } from '@/features/clinical-optin/ConsentProvider';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { persistOrchestrationSession, storySynthOrchestrator } from '@/features/orchestration';

const BED_LABELS = {
  cocon: 'Ambiance cocon',
} as const;

const VOICE_LABELS = {
  slow: 'Voix apaisée',
} as const;

const SCENE_LABEL = 'Scène concentrée';

function StorySynthExperience() {
  const { flags } = useFlags();
  const { clinicalAccepted } = useConsent();
  const assessment = useAssessment('POMS');
  const [overrideLevels, setOverrideLevels] = useState<{ tension?: number; fatigue?: number } | null>(null);

  const zeroNumbersActive = flags.FF_ZERO_NUMBERS !== false;
  const orchestrationEnabled = flags.FF_ORCH_STORY !== false;
  const assessmentEnabled = flags.FF_ASSESS_POMS !== false;

  useEffect(() => {
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
      return;
    }
    try {
      const raw = window.localStorage.getItem('orchestration:story_synth');
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw);
      setOverrideLevels({
        tension: typeof parsed?.tensionLevel === 'number' ? parsed.tensionLevel : undefined,
        fatigue: typeof parsed?.fatigueLevel === 'number' ? parsed.fatigueLevel : undefined,
      });
    } catch (error) {
      console.warn('[story-synth/page] unable to parse override levels', error);
    }
  }, []);

  const tensionLevel = overrideLevels?.tension ?? assessment.lastSubscaleLevel('tension');
  const fatigueLevel = overrideLevels?.fatigue ?? assessment.lastSubscaleLevel('fatigue');

  const hints = useMemo(() => {
    if (!orchestrationEnabled || !assessmentEnabled) {
      return [{ action: 'none' as const }];
    }
    return storySynthOrchestrator({
      tensionLevel: typeof tensionLevel === 'number' ? tensionLevel : undefined,
      fatigueLevel: typeof fatigueLevel === 'number' ? fatigueLevel : undefined,
    });
  }, [assessmentEnabled, fatigueLevel, orchestrationEnabled, tensionLevel]);

  const actionable = hints.filter((hint) => hint.action !== 'none');
  const bedHint = actionable.find((hint) => hint.action === 'set_story_bed' && hint.key === 'cocon');
  const voiceHint = actionable.find((hint) => hint.action === 'set_story_voice' && hint.key === 'slow');
  const shortenHint = actionable.find((hint) => hint.action === 'shorten_scene');

  const announcement = useMemo(() => {
    if (!actionable.length) {
      return 'Narration douce maintenue sans adaptation particulière.';
    }

    const parts: string[] = [];
    if (bedHint) {
      parts.push('Ambiance cocon enclenchée');
    }
    if (voiceHint) {
      parts.push('Voix ralentie pour accompagner la détente');
    }
    if (shortenHint) {
      parts.push('Scène condensée pour économiser l\'énergie');
    }
    return parts.join('. ');
  }, [actionable.length, bedHint, shortenHint, voiceHint]);

  const metadata = useMemo(() => {
    if (!actionable.length) {
      return {};
    }
    return {
      bed: bedHint ? 'cocon' : undefined,
      voice: voiceHint ? 'slow' : undefined,
      shorten: shortenHint ? 'short' : undefined,
    } satisfies Record<string, string | undefined>;
  }, [actionable.length, bedHint, shortenHint, voiceHint]);

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
    void persistOrchestrationSession('story_synth', metadata);
  }, [consented, metadata]);

  const breadcrumbLogged = useRef<boolean>(false);
  useEffect(() => {
    if (!breadcrumbLogged.current && (bedHint || voiceHint || shortenHint)) {
      Sentry.addBreadcrumb({
        category: 'orchestration',
        level: 'info',
        message: 'orch:story:cocon',
      });
      breadcrumbLogged.current = true;
    }
  }, [bedHint, shortenHint, voiceHint]);

  const handleShare = useCallback(() => {
    void assessment.triggerAssessment('POMS_TENSION');
  }, [assessment]);

  if (!zeroNumbersActive) {
    return (
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16 text-slate-900">
        <h1 className="text-2xl font-semibold">Story Synth en veille</h1>
        <p className="text-base text-slate-700">
          Active la protection sans chiffres pour profiter de la narration adaptée.
        </p>
      </section>
    );
  }

  if (!assessmentEnabled) {
    return (
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16 text-slate-900">
        <h1 className="text-2xl font-semibold">Narration standard</h1>
        <p className="text-base text-slate-700">
          L'instrument POMS est momentanément indisponible. La narration reste douce par défaut.
        </p>
      </section>
    );
  }

  if (!orchestrationEnabled) {
    return (
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-4 px-6 py-16 text-slate-900">
        <h1 className="text-2xl font-semibold">Narration neutre</h1>
        <p className="text-base text-slate-700">
          L'orchestration Story Synth est en pause. Tu peux tout de même lancer une lecture apaisée.
        </p>
      </section>
    );
  }

  const bedLabel = bedHint ? BED_LABELS.cocon : 'Ambiance neutre';
  const voiceLabel = voiceHint ? VOICE_LABELS.slow : 'Voix fluide';
  const sceneLabel = shortenHint ? SCENE_LABEL : 'Scène ample';

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12 text-slate-900">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-wide text-slate-600">Story Synth</p>
        <h1 className="text-3xl font-semibold leading-tight">Histoire modulée par ton ressenti</h1>
        <p className="max-w-2xl text-base text-slate-700">
          Ton partage POMS ajuste le lit sonore, la voix et la durée de la scène. Aucun chiffre n'est affiché, seulement des nuances.
        </p>
      </header>

      <section aria-live="polite" className="rounded-3xl bg-slate-100 px-6 py-5 text-slate-800 shadow-sm">
        {announcement}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Lit de l'histoire</h2>
          <p className="mt-2 text-base text-slate-800">{bedLabel}</p>
        </article>
        <article className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Voix</h2>
          <p className="mt-2 text-base text-slate-800">{voiceLabel}</p>
        </article>
        <article className="rounded-2xl bg-white px-5 py-4 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tempo de scène</h2>
          <p className="mt-2 text-base text-slate-800">{sceneLabel}</p>
        </article>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleShare}
          className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-900/90"
        >
          Partager un ressenti récent
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-400 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Lancer la narration apaisée
        </button>
      </div>

      <footer className="rounded-3xl bg-slate-50 px-6 py-5 text-sm text-slate-600">
        {consented
          ? 'Merci pour ton partage : la scène s\'adapte automatiquement à ton niveau de tension et de fatigue.'
          : 'Tu peux profiter de la narration même sans partage, elle restera douce et enveloppante.'}
      </footer>
    </main>
  );
}

export default function StorySynthPage() {
  return (
    <ConsentProvider defaultAccepted={false}>
      <ZeroNumberBoundary className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900">
        <ConsentGate>
          <StorySynthExperience />
        </ConsentGate>
      </ZeroNumberBoundary>
    </ConsentProvider>
  );
}

