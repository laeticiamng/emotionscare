'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useConsent } from '@/features/clinical-optin/ConsentProvider';
import { useFlags } from '@/core/flags';
import { useAssessment } from '@/hooks/useAssessment';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import { useMusicEngine } from '@/features/music/useMusicEngine';
import { useMusicSession } from '@/features/music/useMusicSession';

const TEXTURE_LABELS: Record<'ambient_very_low' | 'calm_low' | 'warm_soft' | 'neutral', string> = {
  ambient_very_low: 'Texture brume délicate',
  calm_low: 'Texture calme',
  warm_soft: 'Texture chaleureuse',
  neutral: 'Texture neutre',
};

const INTENSITY_LABELS: Record<'very_low' | 'low' | 'medium', string> = {
  very_low: 'Intensité très douce',
  low: 'Intensité légère',
  medium: 'Intensité moyenne',
};

const BPM_LABELS: Record<'slow' | 'neutral', string> = {
  slow: 'Tempo ralenti',
  neutral: 'Tempo souple',
};

const CTA_LABELS: Record<'nyvee' | 'encore_2min' | 'none', string> = {
  nyvee: 'Besoin d’une présence Nyvée apaisante ?',
  encore_2min: 'Encore deux minutes dans la bulle ?',
  none: '',
};

export default function MusicPage() {
  const { flags } = useFlags();
  const enabled = flags.FF_ORCH_MUSIC !== false;
  const { clinicalAccepted } = useConsent();
  const motion = useMotionPrefs();
  const assessment = useAssessment('POMS');
  const engine = useMusicEngine();
  const session = useMusicSession(engine);
  const { apply, persist, state: sessionState } = session;
  const [hasStarted, setHasStarted] = useState(false);
  const [persisting, setPersisting] = useState(false);

  const consented = clinicalAccepted && assessment.state.hasConsent;

  const tensionLevel = assessment.lastSubscaleLevel('tension');
  const fatigueLevel = assessment.lastSubscaleLevel('fatigue');
  const vigorLevel = assessment.lastSubscaleLevel('vigor');

  useEffect(() => {
    apply({
      tensionLevel,
      fatigueLevel,
      vigorLevel,
      consented,
      prm: motion.prefersReducedMotion,
    });
  }, [apply, consented, fatigueLevel, motion.prefersReducedMotion, tensionLevel, vigorLevel]);

  const handleLaunch = useCallback(async () => {
    setHasStarted(true);
    engine.queue('gentle-welcome', { crossfadeMs: engine.state.crossfadeMs });
    await engine.playRecommended('gentle');
  }, [engine]);

  const handleExtension = useCallback(async () => {
    engine.queue('soft-extension', { crossfadeMs: engine.state.crossfadeMs });
    await engine.playRecommended('extension');
  }, [engine]);

  const handleNyvee = useCallback(() => {
    window.open('/nyvee', '_blank', 'noopener');
  }, []);

  const handlePersist = useCallback(async () => {
    setPersisting(true);
    try {
      await persist({ durationSec: hasStarted ? 600 : 0 });
    } finally {
      setPersisting(false);
    }
  }, [hasStarted, persist]);

  const postCtaButton = useMemo(() => {
    if (sessionState.postCta === 'nyvee') {
      return (
        <button
          type="button"
          onClick={handleNyvee}
          className="rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted/80"
        >
          {CTA_LABELS.nyvee}
        </button>
      );
    }

    if (sessionState.postCta === 'encore_2min') {
      return (
        <button
          type="button"
          onClick={handleExtension}
          className="rounded-full border border-muted px-4 py-2 text-sm font-medium transition hover:bg-muted/20"
        >
          {CTA_LABELS.encore_2min}
        </button>
      );
    }

    return null;
  }, [handleExtension, handleNyvee, sessionState.postCta]);

  if (!enabled) {
    return (
      <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10">
        <section className="rounded-lg border border-dashed border-muted-foreground/40 bg-background/60 p-6 text-sm text-muted-foreground">
          <h1 className="text-lg font-semibold text-foreground">Musique adaptative</h1>
          <p className="mt-3 leading-relaxed">
            La bulle sonore personnalisée arrive très bientôt. En attendant, tu peux savourer les playlists existantes dans ton espace.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-10">
      <section className="rounded-3xl bg-gradient-to-br from-muted/40 via-background to-background/80 p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Bulle musicale sur-mesure</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              La texture et l’intensité s’ajustent à ton ressenti partagé. Aucun chiffre, juste des nuances pour te sentir entouré·e.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="rounded-full bg-muted/70 px-3 py-1 text-muted-foreground">{TEXTURE_LABELS[engine.state.texture]}</span>
            <span className="rounded-full bg-muted/70 px-3 py-1 text-muted-foreground">{INTENSITY_LABELS[engine.state.intensity]}</span>
            <span className="rounded-full bg-muted/70 px-3 py-1 text-muted-foreground">{BPM_LABELS[engine.state.bpmProfile]}</span>
            {sessionState.visualizerMode === 'reduced' && (
              <span className="rounded-full bg-muted/70 px-3 py-1 text-muted-foreground">Visualisations adoucies</span>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleLaunch}
              className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              Lancer la bulle sonore
            </button>
            <button
              type="button"
              onClick={handlePersist}
              disabled={persisting}
              className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-semibold text-foreground transition hover:bg-foreground/5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {persisting ? 'Enregistrement...' : 'Enregistrer la douceur'}
            </button>
            {postCtaButton}
          </div>

          <div className="rounded-2xl bg-background/60 p-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              {consented
                ? 'Merci pour ton partage : la sélection reste toute en douceur, avec crossfade prolongé si la tension persiste.'
                : 'Tu peux profiter de la musique sans partager ton ressenti. La texture reste calmante par défaut.'}
            </p>
            {sessionState.postCta === 'none' && (
              <p className="mt-2">Tu peux rester dans cette ambiance aussi longtemps que tu le souhaites.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
