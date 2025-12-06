'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';

import { ZeroNumberBoundary } from '@/components/a11y/ZeroNumberBoundary';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { createSession } from '@/services/sessions/sessionsApi';

import { deriveBreathProfile } from '@/features/vr/deriveProfile';
import useVRTier from '@/features/vr/useVRTier';
import { computeBreathActions } from '@/features/vr/vrBreath.orchestrator';

const COMFORT_LABELS: Record<'very_low' | 'low' | 'medium', string> = {
  very_low: 'confort très doux',
  low: 'confort doux',
  medium: 'confort fluide',
};

const DURATION_LABELS: Record<'short' | 'normal', string> = {
  short: 'scène courte',
  normal: 'scène ample',
};

const LOCOMOTION_LABELS: Record<'teleport' | 'smooth', string> = {
  teleport: 'déplacements par pauses',
  smooth: 'glisse feutrée',
};

const FOV_LABELS: Record<'narrow' | 'default', string> = {
  narrow: 'vision resserrée',
  default: 'vision ouverte',
};

const AUDIO_LABELS: Record<'calm' | 'soft', string> = {
  calm: 'paysage sonore calme',
  soft: 'paysage sonore doux',
};

const GUIDANCE_LABELS: Record<'long_exhale' | 'none', string> = {
  long_exhale: 'guidance longues expirations',
  none: 'guidance légère',
};

const VIGNETTE_LABELS: Record<'none' | 'soft' | 'comfort', string> = {
  none: 'halo neutre',
  soft: 'halo délicat',
  comfort: 'halo confort',
};

const PARTICLE_LABELS: Record<'low' | 'medium' | 'high', string> = {
  low: 'particules très légères',
  medium: 'particules douces',
  high: 'particules riches',
};

const fallbackCopy = {
  headline: 'Version sans mouvement conseillée',
  body: "Ton confort passe avant tout. Tu peux savourer la version immobile aussi longtemps que tu le souhaites.",
};

const normalizeLevel = (value: number | undefined | null): 0 | 1 | 2 | 3 | 4 | undefined => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return undefined;
  }
  const clamped = Math.max(0, Math.min(4, Math.round(value)));
  return clamped as 0 | 1 | 2 | 3 | 4;
};

const metaFromProfile = (profile: ReturnType<typeof deriveBreathProfile>) => ({
  module: 'vr_breath',
  comfort: COMFORT_LABELS[profile.comfort],
  duration: DURATION_LABELS[profile.duration],
  locomotion: LOCOMOTION_LABELS[profile.locomotion],
  fov: FOV_LABELS[profile.fov],
  audio: AUDIO_LABELS[profile.audio],
  guidance: GUIDANCE_LABELS[profile.guidance],
  vignette: VIGNETTE_LABELS[profile.vignette],
  particules: PARTICLE_LABELS[profile.particles],
  fallback_next: profile.fallback2dNext ? 'prévu' : 'non prévu',
});

export default function VrBreathPage() {
  const { flags } = useFlags();
  const tier = useVRTier();
  const ssqAssessment = useAssessment('SSQ');
  const tensionAssessment = useAssessment('POMS_TENSION');

  const [sessionStartedAt, setSessionStartedAt] = useState<number | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [persisting, setPersisting] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const fallbackLoggedRef = useRef(false);
  const ssqOfferLoggedRef = useRef(false);
  const tensionOfferLoggedRef = useRef(false);

  useEffect(() => {
    Sentry.addBreadcrumb({ category: 'vr', level: 'info', message: 'vr:enter', data: { module: 'vr_breath' } });
    return () => {
      Sentry.addBreadcrumb({ category: 'vr', level: 'info', message: 'vr:exit', data: { module: 'vr_breath' } });
    };
  }, []);

  const ssqLevel = normalizeLevel(ssqAssessment.state.lastComputation?.level ?? undefined);
  const tensionLevel = normalizeLevel(tensionAssessment.state.lastComputation?.level ?? undefined);

  const actions = useMemo(
    () =>
      computeBreathActions({
        vrTier: tier.vrTier,
        prm: tier.prm,
        ssqLevel: ssqLevel,
        tensionLevel: tensionLevel,
      }),
    [ssqLevel, tensionLevel, tier.prm, tier.vrTier],
  );

  const profile = useMemo(() => deriveBreathProfile(actions), [actions]);

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'vr',
      level: 'info',
      message: 'vr:actions:applied',
      data: {
        module: 'vr_breath',
        comfort: profile.comfort,
        duration: profile.duration,
        locomotion: profile.locomotion,
        fallback2d: profile.fallback2dNext,
      },
    });
    Sentry.configureScope((scope) => {
      scope.setTag('vr_module', 'vr_breath');
      scope.setTag('vr_comfort', profile.comfort);
      scope.setTag('vr_duration', profile.duration);
      scope.setTag('vr_locomotion', profile.locomotion);
      scope.setTag('vr_audio', profile.audio);
    });
  }, [profile]);

  useEffect(() => {
    const fallbackCondition = profile.fallback2dNext || !tier.supported || tier.prm || tier.fallbackReason === 'no_xr';
    if (fallbackCondition && !fallbackLoggedRef.current) {
      Sentry.addBreadcrumb({
        category: 'vr',
        level: 'warning',
        message: 'fallback2d:set',
        data: { module: 'vr_breath', reason: tier.fallbackReason ?? 'comfort' },
      });
      fallbackLoggedRef.current = true;
    }
  }, [profile.fallback2dNext, tier.fallbackReason, tier.prm, tier.supported]);

  const ssqDue = ssqAssessment.isDue('post');
  const tensionDue = tensionAssessment.isDue('post');

  useEffect(() => {
    if (ssqDue && !ssqOfferLoggedRef.current) {
      Sentry.addBreadcrumb({ category: 'vr', level: 'info', message: 'ssq:post:offered', data: { module: 'vr_breath' } });
      ssqOfferLoggedRef.current = true;
    }
  }, [ssqDue]);

  useEffect(() => {
    if (tensionDue && !tensionOfferLoggedRef.current) {
      Sentry.addBreadcrumb({
        category: 'vr',
        level: 'info',
        message: 'poms_tension:post:offered',
        data: { module: 'vr_breath' },
      });
      tensionOfferLoggedRef.current = true;
    }
  }, [tensionDue]);

  const zeroNumberEnabled = flags.FF_ZERO_NUMBERS !== false;
  const vrEnabled = flags.FF_VR !== false;
  const forceFallback = !vrEnabled || !tier.supported || tier.prm || profile.fallback2dNext;

  const handleConsent = useCallback(async () => {
    await ssqAssessment.grantConsent();
  }, [ssqAssessment]);

  const handleDecline = useCallback(async () => {
    await ssqAssessment.declineConsent();
  }, [ssqAssessment]);

  const startSession = useCallback(() => {
    setSessionActive(true);
    setSessionSaved(false);
    setSessionStartedAt(Date.now());
  }, []);

  const stopSession = useCallback(async () => {
    if (!sessionActive) {
      return;
    }
    setSessionActive(false);
    const startedAt = sessionStartedAt;
    setSessionStartedAt(null);
    setPersisting(true);
    try {
      const durationSec = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 0;
      await createSession({ type: 'vr_breath', duration_sec: durationSec, meta: metaFromProfile(profile) });
      setSessionSaved(true);
    } catch (error) {
      Sentry.captureException(error, { tags: { module: 'vr_breath' } });
    } finally {
      setPersisting(false);
    }
  }, [profile, sessionActive, sessionStartedAt]);

  const openFallback = useCallback(() => {
    window.location.href = '/app/vr-breath-2d';
  }, []);

  const handleStartAssessments = useCallback(
    async (instrument: 'SSQ' | 'POMS_TENSION') => {
      const target = instrument === 'SSQ' ? ssqAssessment : tensionAssessment;
      await target.triggerAssessment();
    },
    [ssqAssessment, tensionAssessment],
  );

  if (ssqAssessment.state.isConsentLoading) {
    return (
      <ZeroNumberBoundary className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-10">
        <div className="rounded-3xl bg-muted/40 p-8 text-center text-sm text-muted-foreground">Préparation de la bulle immersive.</div>
      </ZeroNumberBoundary>
    );
  }

  if (!ssqAssessment.state.hasConsent) {
    return (
      <ZeroNumberBoundary className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12">
        <section className="rounded-3xl bg-gradient-to-br from-muted/30 via-background to-background/70 p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-foreground">Accord nécessaire pour la bulle immersive</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Pour activer la respiration immersive, nous avons besoin de ton accord explicite. Tu peux choisir la version sans
            mouvement si tu préfères rester au calme.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleConsent}
              className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              J’autorise la bulle immersive douce
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-foreground/5"
            >
              Je reste sur la version sans mouvement
            </button>
            <button
              type="button"
              onClick={openFallback}
              className="rounded-full border border-foreground/30 px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-foreground/5"
            >
              Ouvrir la version sans mouvement
            </button>
          </div>
        </section>
      </ZeroNumberBoundary>
    );
  }

  if (forceFallback) {
    return (
      <ZeroNumberBoundary className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12">
        <section className="rounded-3xl bg-muted/20 p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-foreground">{fallbackCopy.headline}</h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">{fallbackCopy.body}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openFallback}
              className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Explorer la version sans mouvement
            </button>
            {tier.supported && !tier.prm && !profile.fallback2dNext && (
              <button
                type="button"
                onClick={startSession}
                className="rounded-full border border-foreground/30 px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-foreground/5"
              >
                Lancer la bulle immersive malgré tout
              </button>
            )}
          </div>
        </section>
      </ZeroNumberBoundary>
    );
  }

  const content = (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-10 text-slate-50 shadow-lg">
        <div className="flex flex-col gap-6">
          <header>
            <h1 className="text-3xl font-semibold">Respiration immersive sécurisée</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200/80">
              Les mouvements sont ajustés selon ton confort partagé. Aucun chiffre n’est affiché, seulement des repères doux.
            </p>
          </header>

          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-slate-100/80">
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{COMFORT_LABELS[profile.comfort]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{DURATION_LABELS[profile.duration]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{LOCOMOTION_LABELS[profile.locomotion]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{FOV_LABELS[profile.fov]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{AUDIO_LABELS[profile.audio]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{GUIDANCE_LABELS[profile.guidance]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{VIGNETTE_LABELS[profile.vignette]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{PARTICLE_LABELS[profile.particles]}</span>
          </div>

          {profile.fallback2dNext && (
            <div className="rounded-2xl bg-slate-800/60 p-4 text-sm text-slate-100/80">
              On te proposera la version douce par défaut la prochaine fois.
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {!sessionActive ? (
              <button
                type="button"
                onClick={startSession}
                className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                Entrer dans la bulle immersive
              </button>
            ) : (
              <button
                type="button"
                onClick={stopSession}
                disabled={persisting}
                className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {persisting ? 'Enregistrement en cours' : 'Terminer en douceur'}
              </button>
            )}
            <button
              type="button"
              onClick={openFallback}
              className="rounded-full border border-slate-100/30 px-5 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-100/10"
            >
              Basculer vers la version sans mouvement
            </button>
          </div>

          {sessionSaved && (
            <p className="text-sm text-slate-200/80">Ta session a été enregistrée avec les paramètres apaisés.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-muted-foreground/20 bg-background/80 p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Partager ton ressenti après la bulle</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Ces mini-questionnaires sont facultatifs. Ils nous aident à maintenir un niveau de confort très doux.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={!ssqDue || ssqAssessment.state.isStarting}
            onClick={() => handleStartAssessments('SSQ')}
            className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Partager mon confort corporel
          </button>
          <button
            type="button"
            disabled={!tensionDue || tensionAssessment.state.isStarting}
            onClick={() => handleStartAssessments('POMS_TENSION')}
            className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Partager ma tension émotionnelle
          </button>
        </div>
      </section>
    </div>
  );

  if (!zeroNumberEnabled) {
    return content;
  }

  return <ZeroNumberBoundary className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">{content.props.children}</ZeroNumberBoundary>;
}
