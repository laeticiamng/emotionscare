'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Sentry from '@sentry/react';

import { ZeroNumberBoundary } from '@/components/a11y/ZeroNumberBoundary';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { createSession } from '@/services/sessions/sessionsApi';

import { deriveGalaxyProfile } from '@/features/vr/deriveProfile';
import useVRTier from '@/features/vr/useVRTier';
import { computeGalaxyActions } from '@/features/vr/vrGalaxy.orchestrator';

const COMFORT_LABELS: Record<'very_low' | 'low' | 'medium', string> = {
  very_low: 'confort cosmique très doux',
  low: 'confort cosmique doux',
  medium: 'confort cosmique fluide',
};

const DURATION_LABELS: Record<'short' | 'normal', string> = {
  short: 'voyage court',
  normal: 'voyage ample',
};

const LOCOMOTION_LABELS: Record<'teleport' | 'smooth', string> = {
  teleport: 'sauts d’étoiles apaisés',
  smooth: 'glisse orbitale douce',
};

const FOV_LABELS: Record<'narrow' | 'default', string> = {
  narrow: 'hublot resserré',
  default: 'hublot ouvert',
};

const AUDIO_LABELS: Record<'calm' | 'soft', string> = {
  calm: 'ondes sonores calmes',
  soft: 'ondes sonores douces',
};

const NAVIGATION_LABELS: Record<'drift' | 'gentle' | 'cruise', string> = {
  drift: 'navigation en dérive',
  gentle: 'navigation feutrée',
  cruise: 'navigation fluide',
};

const STELLAR_LABELS: Record<'thin' | 'balanced' | 'lush', string> = {
  thin: 'voile stellaire léger',
  balanced: 'voile stellaire équilibré',
  lush: 'voile stellaire généreux',
};

const VIGNETTE_LABELS: Record<'none' | 'soft' | 'comfort', string> = {
  none: 'halo neutre',
  soft: 'halo délicat',
  comfort: 'halo confort',
};

const PARTICLE_LABELS: Record<'low' | 'medium' | 'high', string> = {
  low: 'poussière d’étoiles légère',
  medium: 'poussière d’étoiles douce',
  high: 'poussière d’étoiles généreuse',
};

const fallbackCopy = {
  headline: 'Exploration statique recommandée',
  body: 'Ton équilibre prime. Les constellations restent accessibles en version immobile.',
};

const normalizeLevel = (value: number | undefined | null): 0 | 1 | 2 | 3 | 4 | undefined => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return undefined;
  }
  const clamped = Math.max(0, Math.min(4, Math.round(value)));
  return clamped as 0 | 1 | 2 | 3 | 4;
};

const metaFromProfile = (profile: ReturnType<typeof deriveGalaxyProfile>) => ({
  module: 'vr_galaxy',
  comfort: COMFORT_LABELS[profile.comfort],
  duration: DURATION_LABELS[profile.duration],
  locomotion: LOCOMOTION_LABELS[profile.locomotion],
  fov: FOV_LABELS[profile.fov],
  audio: AUDIO_LABELS[profile.audio],
  navigation: NAVIGATION_LABELS[profile.navigation],
  voile_stellaire: STELLAR_LABELS[profile.stellarDensity],
  vignette: VIGNETTE_LABELS[profile.vignette],
  particules: PARTICLE_LABELS[profile.particles],
  fallback_next: profile.fallback2dNext ? 'prévu' : 'non prévu',
});

export default function VrGalaxyPage() {
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
    Sentry.addBreadcrumb({ category: 'vr', level: 'info', message: 'vr:enter', data: { module: 'vr_galaxy' } });
    return () => {
      Sentry.addBreadcrumb({ category: 'vr', level: 'info', message: 'vr:exit', data: { module: 'vr_galaxy' } });
    };
  }, []);

  const ssqLevel = normalizeLevel(ssqAssessment.state.lastComputation?.level ?? undefined);
  const tensionLevel = normalizeLevel(tensionAssessment.state.lastComputation?.level ?? undefined);

  const actions = useMemo(
    () =>
      computeGalaxyActions({
        vrTier: tier.vrTier,
        prm: tier.prm,
        ssqLevel: ssqLevel,
        tensionLevel: tensionLevel,
      }),
    [ssqLevel, tensionLevel, tier.prm, tier.vrTier],
  );

  const profile = useMemo(() => deriveGalaxyProfile(actions), [actions]);

  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'vr',
      level: 'info',
      message: 'vr:actions:applied',
      data: {
        module: 'vr_galaxy',
        comfort: profile.comfort,
        navigation: profile.navigation,
        fallback2d: profile.fallback2dNext,
      },
    });
    Sentry.configureScope((scope) => {
      scope.setTag('vr_module', 'vr_galaxy');
      scope.setTag('vr_comfort', profile.comfort);
      scope.setTag('vr_navigation', profile.navigation);
      scope.setTag('vr_voile', profile.stellarDensity);
    });
  }, [profile]);

  useEffect(() => {
    const fallbackCondition = profile.fallback2dNext || !tier.supported || tier.prm || tier.fallbackReason === 'no_xr';
    if (fallbackCondition && !fallbackLoggedRef.current) {
      Sentry.addBreadcrumb({
        category: 'vr',
        level: 'warning',
        message: 'fallback2d:set',
        data: { module: 'vr_galaxy', reason: tier.fallbackReason ?? 'comfort' },
      });
      fallbackLoggedRef.current = true;
    }
  }, [profile.fallback2dNext, tier.fallbackReason, tier.prm, tier.supported]);

  const ssqDue = ssqAssessment.isDue('post');
  const tensionDue = tensionAssessment.isDue('post');

  useEffect(() => {
    if (ssqDue && !ssqOfferLoggedRef.current) {
      Sentry.addBreadcrumb({ category: 'vr', level: 'info', message: 'ssq:post:offered', data: { module: 'vr_galaxy' } });
      ssqOfferLoggedRef.current = true;
    }
  }, [ssqDue]);

  useEffect(() => {
    if (tensionDue && !tensionOfferLoggedRef.current) {
      Sentry.addBreadcrumb({
        category: 'vr',
        level: 'info',
        message: 'poms_tension:post:offered',
        data: { module: 'vr_galaxy' },
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
      await createSession({ type: 'vr_galaxy', duration_sec: durationSec, meta: metaFromProfile(profile) });
      setSessionSaved(true);
    } catch (error) {
      Sentry.captureException(error, { tags: { module: 'vr_galaxy' } });
    } finally {
      setPersisting(false);
    }
  }, [profile, sessionActive, sessionStartedAt]);

  const openFallback = useCallback(() => {
    window.location.href = '/app/vr-galaxy-2d';
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
        <div className="rounded-3xl bg-muted/40 p-8 text-center text-sm text-muted-foreground">Préparation de la traversée céleste.</div>
      </ZeroNumberBoundary>
    );
  }

  if (!ssqAssessment.state.hasConsent) {
    return (
      <ZeroNumberBoundary className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12">
        <section className="rounded-3xl bg-gradient-to-br from-muted/30 via-background to-background/70 p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-foreground">Accord nécessaire pour le voyage céleste</h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Nous avons besoin de ton accord explicite avant de déployer la navigation immersive. La promenade statique reste disponible à tout moment.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleConsent}
              className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              J’autorise le voyage céleste doux
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-foreground/5"
            >
              Je préfère rester sur la version immobile
            </button>
            <button
              type="button"
              onClick={openFallback}
              className="rounded-full border border-foreground/30 px-4 py-2 text-sm font-medium text-foreground/80 transition hover:bg-foreground/5"
            >
              Ouvrir la promenade immobile
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
              Rejoindre la promenade immobile
            </button>
            {tier.supported && !tier.prm && !profile.fallback2dNext && (
              <button
                type="button"
                onClick={startSession}
                className="rounded-full border border-foreground/30 px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-foreground/5"
              >
                Lancer le voyage doux malgré tout
              </button>
            )}
          </div>
        </section>
      </ZeroNumberBoundary>
    );
  }

  const content = (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 p-10 text-slate-50 shadow-lg">
        <div className="flex flex-col gap-6">
          <header>
            <h1 className="text-3xl font-semibold">Voyage galactique apaisé</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-200/80">
              La vitesse, la densité et les halos sont modulés selon ton ressenti. Aucun chiffre, uniquement des nuances.
            </p>
          </header>

          <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-wide text-slate-100/80">
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{COMFORT_LABELS[profile.comfort]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{DURATION_LABELS[profile.duration]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{LOCOMOTION_LABELS[profile.locomotion]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{FOV_LABELS[profile.fov]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{AUDIO_LABELS[profile.audio]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{NAVIGATION_LABELS[profile.navigation]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{STELLAR_LABELS[profile.stellarDensity]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{VIGNETTE_LABELS[profile.vignette]}</span>
            <span className="rounded-full bg-slate-800/70 px-3 py-1">{PARTICLE_LABELS[profile.particles]}</span>
          </div>

          {profile.fallback2dNext && (
            <div className="rounded-2xl bg-slate-800/60 p-4 text-sm text-slate-100/80">
              On te proposera la promenade immobile par défaut la prochaine fois.
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {!sessionActive ? (
              <button
                type="button"
                onClick={startSession}
                className="rounded-full bg-slate-100 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
              >
                Entrer dans le voyage céleste
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
              Rejoindre la promenade immobile
            </button>
          </div>

          {sessionSaved && (
            <p className="text-sm text-slate-200/80">Ta traversée a été enregistrée avec des paramètres doux.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-muted-foreground/20 bg-background/80 p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground">Partager ton ressenti après le voyage</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Les questionnaires sont facultatifs et sans aucun chiffre. Ils nous guident pour garder la navigation très douce.
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
