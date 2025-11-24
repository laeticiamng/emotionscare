import React from 'react';

import { useFlags } from '@/core/flags';
import { useMoodStore } from '@/hooks/useMood';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { getVibeEmoji, getVibeLabel, type MoodVibe } from '@/utils/moodVibes';

interface SamStep {
  value: number;
  label: string;
  helper: string;
  emoji: string;
}

interface MoodHistoryItem {
  id: string;
  summary: string;
  color: string;
  textColor: string;
  vibe: MoodVibe;
}

const SAM_VALENCE_STEPS: SamStep[] = [
  { value: -80, label: 'Très difficile', helper: 'Besoin de soutien immédiat', emoji: '😣' },
  { value: -40, label: 'Plutôt difficile', helper: 'Un peu de douceur aiderait', emoji: '🙁' },
  { value: 0, label: 'Neutre', helper: 'État stable et posé', emoji: '😐' },
  { value: 40, label: 'Plutôt agréable', helper: 'Sensation agréable et légère', emoji: '🙂' },
  { value: 80, label: 'Rayonnant', helper: 'Énergie positive communicative', emoji: '😄' },
];

const SAM_AROUSAL_STEPS: SamStep[] = [
  { value: 10, label: 'Somnolent', helper: 'Repos complet nécessaire', emoji: '😴' },
  { value: 30, label: 'Apaisé', helper: 'Respiration calme et profonde', emoji: '😌' },
  { value: 50, label: 'Équilibré', helper: 'Présence tranquille', emoji: '🙂' },
  { value: 70, label: 'Tonus', helper: 'Énergie constructive', emoji: '😃' },
  { value: 90, label: 'Vibrant', helper: 'Ébullition créative', emoji: '🤩' },
];

const getClosestIndex = (value: number, steps: SamStep[]) => {
  return steps.reduce((closestIndex, step, index) => {
    const currentDiff = Math.abs(step.value - value);
    const bestDiff = Math.abs(steps[closestIndex].value - value);
    return currentDiff < bestDiff ? index : closestIndex;
  }, 0);
};

const getSecondaryTextColor = (textColor: string) => {
  const normalized = textColor.toLowerCase();
  if (normalized === '#f8fafc' || normalized === '#ffffff') {
    return 'rgba(248, 250, 252, 0.78)';
  }
  return 'rgba(15, 23, 42, 0.68)';
};

const SamInstantMood: React.FC = () => {
  const currentMood = useMoodStore();
  const { updateMood } = currentMood;
  const { has } = useFlags();

  const isScanEnabled = has('FF_SCAN');
  const isSamEnabled = has('FF_ASSESS_SAM');

  const valenceLabelId = React.useId();
  const arousalLabelId = React.useId();
  const timelineLabelId = React.useId();

  const initialValenceIndex = React.useMemo(
    () => getClosestIndex(currentMood.valence, SAM_VALENCE_STEPS),
    [currentMood.valence],
  );
  const initialArousalIndex = React.useMemo(
    () => getClosestIndex(currentMood.arousal, SAM_AROUSAL_STEPS),
    [currentMood.arousal],
  );

  const [valenceIndex, setValenceIndex] = React.useState(initialValenceIndex);
  const [arousalIndex, setArousalIndex] = React.useState(initialArousalIndex);
  const [timeline, setTimeline] = React.useState<MoodHistoryItem[]>([]);
  const lastTimestampRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    setValenceIndex(initialValenceIndex);
  }, [initialValenceIndex]);

  React.useEffect(() => {
    setArousalIndex(initialArousalIndex);
  }, [initialArousalIndex]);

  React.useEffect(() => {
    if (!currentMood.timestamp || !currentMood.summary) {
      return;
    }

    if (lastTimestampRef.current === currentMood.timestamp) {
      return;
    }

    lastTimestampRef.current = currentMood.timestamp;
    setTimeline(prev => {
      const entry: MoodHistoryItem = {
        id: currentMood.timestamp,
        summary: currentMood.summary,
        color: currentMood.palette.base,
        textColor: currentMood.palette.text,
        vibe: currentMood.vibe,
      };
      const next = [entry, ...prev];
      return next.slice(0, 9);
    });
  }, [currentMood.timestamp, currentMood.summary, currentMood.palette.base, currentMood.vibe]);

  const applyMood = React.useCallback(
    (nextValenceIndex: number, nextArousalIndex: number) => {
      if (!isSamEnabled) {
        return;
      }
      const safeValenceIndex = Math.min(Math.max(nextValenceIndex, 0), SAM_VALENCE_STEPS.length - 1);
      const safeArousalIndex = Math.min(Math.max(nextArousalIndex, 0), SAM_AROUSAL_STEPS.length - 1);
      const valenceValue = SAM_VALENCE_STEPS[safeValenceIndex].value;
      const arousalValue = SAM_AROUSAL_STEPS[safeArousalIndex].value;
      updateMood(valenceValue, arousalValue);
    },
    [isSamEnabled, updateMood],
  );

  const handleValenceChange = React.useCallback(
    (values: number[]) => {
      const index = Math.round(values[0] ?? 0);
      if (!Number.isFinite(index) || index === valenceIndex) {
        return;
      }
      setValenceIndex(index);
      applyMood(index, arousalIndex);
    },
    [applyMood, arousalIndex, valenceIndex],
  );

  const handleArousalChange = React.useCallback(
    (values: number[]) => {
      const index = Math.round(values[0] ?? 0);
      if (!Number.isFinite(index) || index === arousalIndex) {
        return;
      }
      setArousalIndex(index);
      applyMood(valenceIndex, index);
    },
    [applyMood, arousalIndex, valenceIndex],
  );

  const selectValence = React.useCallback(
    (index: number) => {
      if (index === valenceIndex) {
        return;
      }
      setValenceIndex(index);
      applyMood(index, arousalIndex);
    },
    [applyMood, arousalIndex, valenceIndex],
  );

  const selectArousal = React.useCallback(
    (index: number) => {
      if (index === arousalIndex) {
        return;
      }
      setArousalIndex(index);
      applyMood(valenceIndex, index);
    },
    [applyMood, arousalIndex, valenceIndex],
  );

  const currentValence = SAM_VALENCE_STEPS[valenceIndex];
  const currentArousal = SAM_AROUSAL_STEPS[arousalIndex];
  const vibe = currentMood.vibe;
  const palette = currentMood.palette;
  const secondaryTextColor = React.useMemo(() => getSecondaryTextColor(palette.text), [palette.text]);

  if (!isScanEnabled) {
    return null;
  }

  return (
    <Card aria-label="Scan express SAM">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          <span>Scan express SAM</span>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Optionnel</span>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Deux pictos à ressentir puis à ajuster, rien n’est chiffré : le signal colore simplement l’écosystème.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <section
          aria-live="polite"
          className="rounded-xl border p-4 shadow-inner transition-colors"
          style={{
            background: `linear-gradient(135deg, ${palette.surface}, ${palette.glow})`,
            borderColor: palette.border,
          }}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2 text-sm" style={{ color: palette.text }}>
              <p className="text-xs uppercase tracking-wide" style={{ color: secondaryTextColor }}>
                Ambiance instantanée
              </p>
              <p className="text-lg font-semibold">{currentMood.summary}</p>
              <p style={{ color: secondaryTextColor }}>{currentMood.microGesture}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge
                variant="secondary"
                className="border-0 text-xs font-semibold"
                style={{ background: palette.base, color: palette.text }}
              >
                {isSamEnabled ? 'SAM synchronisé' : 'SAM en veille'}
              </Badge>
              <span
                aria-label={`Vibe ${getVibeLabel(vibe)}`}
                className="flex h-12 w-12 items-center justify-center rounded-full shadow-lg"
                style={{ background: palette.base, color: palette.text }}
              >
                <span aria-hidden="true" className="text-2xl">
                  {getVibeEmoji(vibe)}
                </span>
              </span>
            </div>
          </div>
        </section>

        {!isSamEnabled && (
          <p className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-3 text-sm text-muted-foreground">
            Le suivi SAM est en pause pour le moment. Réactivez-le dans les paramètres pour alimenter les recommandations.
          </p>
        )}

        <section className="space-y-3">
          <header className="space-y-1">
            <p id={valenceLabelId} className="text-sm uppercase tracking-wide text-muted-foreground">
              Ressenti émotionnel
            </p>
            <p className="font-medium text-foreground flex items-center gap-2">
              <span aria-hidden="true" className="text-xl">{currentValence.emoji}</span>
              {currentValence.label}
            </p>
            <p className="text-sm text-muted-foreground">{currentValence.helper}</p>
          </header>
          <div className="space-y-2">
            <Slider
              value={[valenceIndex]}
              max={SAM_VALENCE_STEPS.length - 1}
              min={0}
              step={1}
              onValueChange={handleValenceChange}
              aria-labelledby={valenceLabelId}
              aria-valuetext={currentValence.label}
              disabled={!isSamEnabled}
            />
            <ul className="flex justify-between text-2xl" role="list">
              {SAM_VALENCE_STEPS.map((step, index) => {
                const isActive = index === valenceIndex;
                return (
                  <li key={step.label}>
                    <button
                      type="button"
                      onClick={() => selectValence(index)}
                      disabled={!isSamEnabled}
                      aria-pressed={isActive}
                      aria-label={step.label}
                      className={`rounded-full p-1 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        isActive ? 'scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span role="img" aria-hidden="true">
                        {step.emoji}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <header className="space-y-1">
            <p id={arousalLabelId} className="text-sm uppercase tracking-wide text-muted-foreground">
              Niveau d’énergie
            </p>
            <p className="font-medium text-foreground flex items-center gap-2">
              <span aria-hidden="true" className="text-xl">{currentArousal.emoji}</span>
              {currentArousal.label}
            </p>
            <p className="text-sm text-muted-foreground">{currentArousal.helper}</p>
          </header>
          <div className="space-y-2">
            <Slider
              value={[arousalIndex]}
              max={SAM_AROUSAL_STEPS.length - 1}
              min={0}
              step={1}
              onValueChange={handleArousalChange}
              aria-labelledby={arousalLabelId}
              aria-valuetext={currentArousal.label}
              disabled={!isSamEnabled}
            />
            <ul className="flex justify-between text-2xl" role="list">
              {SAM_AROUSAL_STEPS.map((step, index) => {
                const isActive = index === arousalIndex;
                return (
                  <li key={step.label}>
                    <button
                      type="button"
                      onClick={() => selectArousal(index)}
                      disabled={!isSamEnabled}
                      aria-pressed={isActive}
                      aria-label={step.label}
                      className={`rounded-full p-1 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                        isActive ? 'scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span role="img" aria-hidden="true">
                        {step.emoji}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="space-y-2" aria-labelledby={timelineLabelId}>
          <p id={timelineLabelId} className="text-xs uppercase tracking-wide text-muted-foreground">
            Nuances récentes
          </p>
          {timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Le prochain scan dessinera votre première trace de couleur.
            </p>
          ) : (
            <ul className="flex flex-wrap items-center gap-2" role="list">
              {timeline.map(item => (
                <li key={item.id} className="flex items-center gap-2">
                  <span
                    role="img"
                    aria-label={`${item.summary} – ${getVibeLabel(item.vibe)}`}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full shadow-sm ring-2 ring-white/25"
                    style={{ background: item.color, color: item.textColor }}
                  >
                    <span aria-hidden="true" className="text-xs">
                      {getVibeEmoji(item.vibe)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </CardContent>
    </Card>
  );
};

export default SamInstantMood;
