// @ts-nocheck
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';

import { Slider } from '@/components/ui/slider';
import { toLevel, useMoodPublisher } from '@/features/mood/useMoodPublisher';
import type { MoodEventDetail } from '@/features/mood/mood-bus';
import { scanAnalytics } from '@/lib/analytics/scanEvents';

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

const SamSliders: React.FC<SamSlidersProps> = ({ detail, summary }) => {
  const publishMood = useMoodPublisher();
  const [valence, setValence] = useState(0.5);
  const [arousal, setArousal] = useState(0.5);
  const [liveMessage, setLiveMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
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

  const valenceDescriptor = useMemo(() => VALENCE_WORDS[toLevel(Math.round(valence * 100))], [valence]);
  const arousalDescriptor = useMemo(() => AROUSAL_WORDS[toLevel(Math.round(arousal * 100))], [arousal]);
  
  const valencePercent = useMemo(() => Math.round(valence * 100), [valence]);
  const arousalPercent = useMemo(() => Math.round(arousal * 100), [arousal]);

  const handleValence = useCallback(
    (values: number[]) => {
      const next = clampNormalized((values[0] ?? 50) / 100);
      setValence(next);
      publishMood('scan_sliders', next, arousal);
      
      // Clear existing timeout
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      
      setShowFeedback(true);
      
      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(10); // 10ms subtle vibration
      }
      
      scanAnalytics.sliderAdjusted('valence', Math.round(next * 100));
      scanAnalytics.feedbackShown('badge', 1000);
      
      feedbackTimeoutRef.current = setTimeout(() => setShowFeedback(false), 1000);
    },
    [arousal, publishMood],
  );

  const handleArousal = useCallback(
    (values: number[]) => {
      const next = clampNormalized((values[0] ?? 50) / 100);
      setArousal(next);
      publishMood('scan_sliders', valence, next);
      
      // Clear existing timeout
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      
      setShowFeedback(true);
      
      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate(10); // 10ms subtle vibration
      }
      
      scanAnalytics.sliderAdjusted('arousal', Math.round(next * 100));
      scanAnalytics.feedbackShown('badge', 1000);
      
      feedbackTimeoutRef.current = setTimeout(() => setShowFeedback(false), 1000);
    },
    [publishMood, valence],
  );

  return (
    <section className="relative rounded-3xl border border-transparent bg-white/5 p-6 shadow-lg backdrop-blur mood-surface dark:bg-slate-800/40">
      {showFeedback && (
        <div className="absolute top-4 right-4 rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary animate-in fade-in slide-in-from-top-2 duration-300">
          Mis à jour ✓
        </div>
      )}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Réglage émotionnel</h2>
        <p className="text-sm text-muted-foreground">
          Ajustez deux dimensions : votre ressenti (positif/négatif) et votre niveau d'énergie (calme/énergique).
        </p>
      </div>

      <div className="mt-6 space-y-8">
        <div>
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">Comment vous sentez-vous ?</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {valencePercent}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-foreground">{valenceDescriptor.label}</span>
              <span className="text-xs text-muted-foreground">· {valenceDescriptor.description}</span>
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

        <div>
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-foreground">Quel est votre niveau d'énergie ?</span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {arousalPercent}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-foreground">{arousalDescriptor.label}</span>
              <span className="text-xs text-muted-foreground">· {arousalDescriptor.description}</span>
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

      <p aria-live="polite" className="sr-only">
        {liveMessage}
      </p>
    </section>
  );
};

export default SamSliders;
