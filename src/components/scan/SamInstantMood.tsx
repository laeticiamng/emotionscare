import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useMood } from '@/contexts/MoodContext';
import { getVibeEmoji, getVibeLabel, mapMoodToVibe } from '@/utils/moodVibes';

interface SamStep {
  value: number;
  label: string;
  helper: string;
  emoji: string;
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

const SamInstantMood: React.FC = () => {
  const { updateMood, currentMood } = useMood();

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

  React.useEffect(() => {
    setValenceIndex(initialValenceIndex);
  }, [initialValenceIndex]);

  React.useEffect(() => {
    setArousalIndex(initialArousalIndex);
  }, [initialArousalIndex]);

  const applyMood = React.useCallback(
    (nextValenceIndex: number, nextArousalIndex: number) => {
      const safeValenceIndex = Math.min(Math.max(nextValenceIndex, 0), SAM_VALENCE_STEPS.length - 1);
      const safeArousalIndex = Math.min(Math.max(nextArousalIndex, 0), SAM_AROUSAL_STEPS.length - 1);
      const valenceValue = SAM_VALENCE_STEPS[safeValenceIndex].value;
      const arousalValue = SAM_AROUSAL_STEPS[safeArousalIndex].value;
      updateMood(valenceValue, arousalValue);
    },
    [updateMood],
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
  const vibe = React.useMemo(
    () => mapMoodToVibe(currentValence.value, currentArousal.value),
    [currentArousal.value, currentValence.value],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Check-in instantané (SAM)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Vibe actuelle</p>
            <p className="text-lg font-semibold flex items-center gap-2">
              <span aria-hidden="true">{getVibeEmoji(vibe)}</span>
              {getVibeLabel(vibe)}
            </p>
          </div>
          <Badge variant="secondary" className="text-sm py-1 px-3">
            SAM synchronisé
          </Badge>
        </div>

        <section className="space-y-3">
          <header>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Ressenti</p>
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
              aria-label="Ressenti"
            />
            <div className="flex justify-between text-2xl" aria-hidden="true">
              {SAM_VALENCE_STEPS.map((step, index) => (
                <button
                  key={step.label}
                  type="button"
                  className={`transition-transform ${index === valenceIndex ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
                  onClick={() => selectValence(index)}
                >
                  <span role="img" aria-label={step.label}>{step.emoji}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <header>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Énergie</p>
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
              aria-label="Énergie"
            />
            <div className="flex justify-between text-2xl" aria-hidden="true">
              {SAM_AROUSAL_STEPS.map((step, index) => (
                <button
                  key={step.label}
                  type="button"
                  className={`transition-transform ${index === arousalIndex ? 'scale-110' : 'opacity-70 hover:opacity-100'}`}
                  onClick={() => selectArousal(index)}
                >
                  <span role="img" aria-label={step.label}>{step.emoji}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  );
};

export default SamInstantMood;
