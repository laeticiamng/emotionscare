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

const VALENCE_WORDS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'ombre protectrice',
  1: 'brume légère',
  2: 'équilibre posé',
  3: 'clair matin',
  4: 'halo solaire',
};

const AROUSAL_WORDS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'repos profond',
  1: 'souffle doux',
  2: 'présence paisible',
  3: 'élan maîtrisé',
  4: 'vibration vive',
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
        <h2 className="text-lg font-semibold text-foreground">Réglage sensoriel</h2>
        <p className="text-sm text-muted-foreground">
          Deux curseurs illustrés : une palette entre ombre et lumière, un souffle entre repos et vibration.
        </p>
      </div>

      <div className="mt-6 space-y-8">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Palette ressentie</span>
            <span className="text-sm text-muted-foreground">{valenceDescriptor}</span>
          </div>
          <Slider
            max={100}
            step={1}
            value={[Math.round(valence * 100)]}
            onValueChange={handleValence}
            aria-label="Palette ressentie"
            aria-valuetext={valenceDescriptor}
            aria-describedby="sam-valence-hints"
            className="mt-3"
          />
          <div id="sam-valence-hints" className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>ombre</span>
            <span>lumière</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Activation intérieure</span>
            <span className="text-sm text-muted-foreground">{arousalDescriptor}</span>
          </div>
          <Slider
            max={100}
            step={1}
            value={[Math.round(arousal * 100)]}
            onValueChange={handleArousal}
            aria-label="Activation intérieure"
            aria-valuetext={arousalDescriptor}
            aria-describedby="sam-arousal-hints"
            className="mt-3"
          />
          <div id="sam-arousal-hints" className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>calme</span>
            <span>tonus</span>
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
