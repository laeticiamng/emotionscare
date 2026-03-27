// @ts-nocheck
import React from 'react';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { toLevel, summary as computeSummary, useMoodPublisher } from '@/features/mood/useMoodPublisher';
import type { MoodEventDetail } from '@/features/mood/mood-bus';
import { scanAnalytics } from '@/lib/analytics/scanEvents';
import { ArrowDown, Sparkles } from 'lucide-react';

interface SamSlidersProps {
  detail?: MoodEventDetail | null;
  summary?: string;
}

const clampNormalized = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0.5;
  }
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

const VALENCE_WORDS: Record<0 | 1 | 2 | 3 | 4, { label: string; description: string }> = {
  0: { label: 'Ressenti négatif', description: 'Émotions difficiles, mal-être' },
  1: { label: 'Plutôt négatif', description: 'Légère tension, inconfort' },
  2: { label: 'État neutre', description: 'Ni positif ni négatif' },
  3: { label: 'Plutôt positif', description: 'Agréable, confortable' },
  4: { label: 'Très positif', description: 'Joie, bien-être intense' },
};

const AROUSAL_WORDS: Record<0 | 1 | 2 | 3 | 4, { label: string; description: string }> = {
  0: { label: 'Très calme', description: 'Repos, relaxation profonde' },
  1: { label: 'Calme', description: 'Détendu, tranquille' },
  2: { label: 'État modéré', description: 'Ni tendu ni calme' },
  3: { label: 'Énergique', description: 'Activé, dynamique' },
  4: { label: 'Très énergique', description: 'Excité, très stimulé' },
};

/** Scroll to the MicroGestes recommendations section */
const scrollToRecommendations = () => {
  const target =
    document.getElementById('micro-gestes-section') ??
    document.querySelector('[data-section="micro-gestes"]');
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const SamSliders: React.FC<SamSlidersProps> = ({ detail, summary }) => {
  const publishMood = useMoodPublisher();
  const [valence, setValence] = useState(0.5);
  const [arousal, setArousal] = useState(0.5);
  const [liveMessage, setLiveMessage] = useState('');
  const [hasInteracted, setHasInteracted] = useState(false);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (detail && detail.source === 'scan_sliders') {
      setValence(clampNormalized(detail.valence / 100));
      setArousal(clampNormalized(detail.arousal / 100));
    }
  }, [detail]);

  useEffect(() => {
    if (summary) {
      setLiveMessage(summary);
    }
  }, [summary]);

  const valenceLevel = useMemo(() => toLevel(Math.round(valence * 100)), [valence]);
  const arousalLevel = useMemo(() => toLevel(Math.round(arousal * 100)), [arousal]);

  const valenceDescriptor = useMemo(() => VALENCE_WORDS[valenceLevel], [valenceLevel]);
  const arousalDescriptor = useMemo(() => AROUSAL_WORDS[arousalLevel], [arousalLevel]);

  const valencePercent = useMemo(() => Math.round(valence * 100), [valence]);
  const arousalPercent = useMemo(() => Math.round(arousal * 100), [arousal]);

  /** Dynamic human-readable summary of detected state */
  const detectedSummary = useMemo(
    () => computeSummary(valenceLevel, arousalLevel),
    [valenceLevel, arousalLevel],
  );

  const handleValence = useCallback(
    (values: number[]) => {
      const next = clampNormalized((values[0] ?? 50) / 100);
      setValence(next);
      setHasInteracted(true);
      publishMood('scan_sliders', next, arousal);

      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }

      scanAnalytics.sliderAdjusted('valence', Math.round(next * 100));
    },
    [arousal, publishMood],
  );

  const handleArousal = useCallback(
    (values: number[]) => {
      const next = clampNormalized((values[0] ?? 50) / 100);
      setArousal(next);
      setHasInteracted(true);
      publishMood('scan_sliders', valence, next);

      if ('vibrate' in navigator) {
        navigator.vibrate(10);
      }

      scanAnalytics.sliderAdjusted('arousal', Math.round(next * 100));
    },
    [publishMood, valence],
  );

  return (
    <section className="relative rounded-3xl border border-transparent bg-white/5 p-6 shadow-lg backdrop-blur mood-surface dark:bg-slate-800/40">
      {/* 1. Microcopy guidage */}
      <div className="mb-4 rounded-xl bg-primary/5 px-4 py-3">
        <p className="text-sm font-medium text-primary">
          Étape 1 : indiquez votre ressenti, puis découvrez vos recommandations
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Réglage émotionnel</h2>
        <p className="text-sm text-muted-foreground">
          Ajustez deux dimensions : votre ressenti (positif/négatif) et votre niveau d'énergie (calme/énergique).
        </p>
      </div>

      <div className="mt-6 space-y-8">
        {/* Valence slider */}
        <div>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">Comment vous sentez-vous ?</span>
            </div>
            <div className="rounded-lg bg-primary/5 px-3 py-2">
              <span className="text-base font-semibold text-foreground">{valenceDescriptor.label}</span>
              <p className="text-xs text-muted-foreground mt-0.5">{valenceDescriptor.description}</p>
            </div>
          </div>
          <Slider
            max={100}
            step={1}
            value={[valencePercent]}
            onValueChange={handleValence}
            aria-label="Ressenti émotionnel"
            aria-valuetext={valenceDescriptor.label}
            aria-describedby="sam-valence-hints"
            className="mt-3"
          />
          <div id="sam-valence-hints" className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>😔 Négatif</span>
            <span>🙂 Positif</span>
          </div>
        </div>

        {/* Arousal slider */}
        <div>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">Quel est votre niveau d'énergie ?</span>
            </div>
            <div className="rounded-lg bg-primary/5 px-3 py-2">
              <span className="text-base font-semibold text-foreground">{arousalDescriptor.label}</span>
              <p className="text-xs text-muted-foreground mt-0.5">{arousalDescriptor.description}</p>
            </div>
          </div>
          <Slider
            max={100}
            step={1}
            value={[arousalPercent]}
            onValueChange={handleArousal}
            aria-label="Niveau d'énergie"
            aria-valuetext={arousalDescriptor.label}
            aria-describedby="sam-arousal-hints"
            className="mt-3"
          />
          <div id="sam-arousal-hints" className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>😴 Calme</span>
            <span>⚡ Énergique</span>
          </div>
        </div>
      </div>

      {/* 2. Résumé dynamique permanent */}
      <div
        className="mt-6 rounded-2xl bg-accent/10 px-4 py-3 text-center transition-all duration-300"
        aria-live="polite"
      >
        <p className="text-sm font-medium text-foreground">
          Vous semblez en état de{' '}
          <span className="font-bold text-primary">{detectedSummary}</span>
        </p>
      </div>

      {/* 3. CTA "Voir mes recommandations" */}
      <div className="mt-5 flex flex-col items-center gap-2">
        <Button
          variant="premium"
          size="lg"
          onClick={scrollToRecommendations}
          className="w-full sm:w-auto gap-2"
          aria-label="Voir mes recommandations personnalisées"
        >
          <Sparkles className="h-4 w-4" />
          Voir mes recommandations
          <ArrowDown className="h-4 w-4" />
        </Button>

        {/* 4. Teaser */}
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Musique, respiration et micro-gestes adaptés à votre état
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {liveMessage}
      </p>
    </section>
  );
};

export default SamSliders;
