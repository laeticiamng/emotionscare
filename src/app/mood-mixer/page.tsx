'use client';

import { useCallback } from 'react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useMoodMixerSession } from '@/features/mood-mixer/hooks/useMoodMixerSession';

const hintClassName = 'rounded-full bg-white/10 px-3 py-1 text-sm text-slate-100';

const toLevel = (raw: number | undefined): 0 | 1 | 2 | 3 | 4 => {
  if (typeof raw !== 'number' || Number.isNaN(raw)) return 0;
  const clamped = Math.min(4, Math.max(0, Math.round(raw)));
  return clamped as 0 | 1 | 2 | 3 | 4;
};

export default function MoodMixerPage(): JSX.Element {
  const {
    valenceLevel,
    arousalLevel,
    valenceTrack,
    arousalTrack,
    badges,
    microGesture,
    microGestureKey,
    isApplying,
    updateValence,
    commitValence,
    updateArousal,
    commitArousal,
    applyTarget,
    prefersReducedMotion,
    enabled,
  } = useMoodMixerSession();

  const valenceDescriptor = valenceTrack.find((entry) => entry.level === valenceLevel) ?? valenceTrack[2];
  const arousalDescriptor = arousalTrack.find((entry) => entry.level === arousalLevel) ?? arousalTrack[2];

  const sliderClass = prefersReducedMotion ? 'transition-none' : 'transition-all duration-300 ease-out';

  const handleValenceChange = useCallback(
    (value: number[]) => {
      updateValence(toLevel(value[0]));
    },
    [updateValence],
  );

  const handleValenceCommit = useCallback(
    async (value: number[]) => {
      await commitValence(toLevel(value[0]));
    },
    [commitValence],
  );

  const handleArousalChange = useCallback(
    (value: number[]) => {
      updateArousal(toLevel(value[0]));
    },
    [updateArousal],
  );

  const handleArousalCommit = useCallback(
    async (value: number[]) => {
      await commitArousal(toLevel(value[0]));
    },
    [commitArousal],
  );

  const microGestureCta = microGestureKey === 'long_exhale'
    ? "On inspire doucement, on laisse une expiration longue guider l'écoute."
    : microGestureKey === 'soft_breath'
      ? 'Souffle discret conseillé avant de lancer le mix.'
      : 'Respiration libre selon ton rythme.';

  return (
    <ZeroNumberBoundary className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-12 text-slate-100">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-wide text-slate-300">Mood Mixer</p>
          <h1 className="text-3xl font-semibold leading-tight">Orchestration sensible sans chiffres</h1>
          <p className="max-w-2xl text-base text-slate-300">
            Ajuste la texture émotionnelle et la vitalité du mix. Chaque mouvement déclenche une prévisualisation douce sans affichage numérique.
          </p>
        </header>

        {!enabled && (
          <Card className="border-white/10 bg-white/5 text-slate-100">
            <CardHeader>
              <CardTitle>Orchestration inactive</CardTitle>
              <CardDescription className="text-slate-200">
                Active le réglage adaptatif pour guider la musique selon ton ressenti actuel.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <section className="grid gap-6" aria-live="polite">
          <Card className="border-transparent bg-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Texture émotionnelle</CardTitle>
              <CardDescription className="text-slate-200">
                Du voile le plus doux vers la clarté scintillante.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-200">Doux ←→ Clair</span>
                <span className={hintClassName}>{valenceDescriptor.label}</span>
              </div>
              <Slider
                className={sliderClass}
                aria-label="Ambiance sonore (doux vers clair)"
                aria-valuetext={valenceDescriptor.aria}
                value={[valenceLevel]}
                min={0}
                max={4}
                step={1}
                onValueChange={handleValenceChange}
                onValueCommit={handleValenceCommit}
              />
              <div className="flex justify-between text-sm text-slate-400">
                <span>plus doux</span>
                <span>plus clair</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-transparent bg-white/5">
            <CardHeader>
              <CardTitle className="text-lg">Énergie et tempo</CardTitle>
              <CardDescription className="text-slate-200">
                Du rythme posé à l'élan tonique.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-200">Posé ←→ Tonique</span>
                <span className={hintClassName}>{arousalDescriptor.label}</span>
              </div>
              <Slider
                className={sliderClass}
                aria-label="Cadence du mix (posé vers tonique)"
                aria-valuetext={arousalDescriptor.aria}
                value={[arousalLevel]}
                min={0}
                max={4}
                step={1}
                onValueChange={handleArousalChange}
                onValueCommit={handleArousalCommit}
              />
              <div className="flex justify-between text-sm text-slate-400">
                <span>plus posé</span>
                <span>plus énergique</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {badges.length > 0 && (
          <section className="flex flex-wrap gap-3" aria-live="polite">
            {badges.map((badge) => (
              <Badge key={badge} className="bg-white/10 text-slate-100">
                {badge}
              </Badge>
            ))}
          </section>
        )}

        <section className="space-y-3" aria-live="polite">
          <p className="text-sm text-slate-200">{microGesture}</p>
          <p className="text-base text-slate-100">{microGestureCta}</p>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="button" onClick={applyTarget} disabled={isApplying} variant="secondary">
            {isApplying ? 'Synchronisation en cours' : 'Ancrer cette ambiance'}
          </Button>
          <p className="text-sm text-slate-300">
            Les transitions respectent la réduction des mouvements lorsque nécessaire.
          </p>
        </div>
      </main>
    </ZeroNumberBoundary>
  );
}
