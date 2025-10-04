import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';
import { Loader2, RotateCcw, Sparkles, Trash2, Wand2 } from 'lucide-react';
import { ZodError } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import { PreviewPlayer } from '@/components/music/PreviewPlayer';
import {
  createPreset,
  deletePreset,
  listMyPresets,
  updatePreset,
} from '@/services/mixer/moodPresetsApi';
import {
  PREVIEW_FALLBACK_URL,
  PreviewUnavailableError,
  previewFromMood,
} from '@/services/music/recoApi';
import {
  describeLevel,
  buildMoodSummary,
  computeGradient,
  presetEmoji,
  sortPresetsByFreshness,
} from './utils';
import { PresetInsertSchema, type Preset, type PresetUpdate } from './types';
import { useMoodMixer } from './useMoodMixer';
import { cn } from '@/lib/utils';

interface MixerActionState {
  type: 'save' | 'update' | 'delete' | null;
  busy: boolean;
}

const sliderOrder: Array<{ key: keyof Preset['sliders']; label: string; tone: string }> = [
  { key: 'energy', label: 'Énergie', tone: 'from-orange-400/40 to-pink-500/40' },
  { key: 'calm', label: 'Calme', tone: 'from-sky-400/40 to-indigo-500/30' },
  { key: 'focus', label: 'Focus', tone: 'from-violet-400/40 to-blue-500/30' },
  { key: 'light', label: 'Lumière', tone: 'from-amber-300/40 to-rose-400/30' },
];

export function MoodMixerView() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { prefersReducedMotion } = useMotionPrefs();
  const { sliders, set, reset, fromPreset } = useMoodMixer();

  const [name, setName] = useState('');
  const [presets, setPresets] = useState<Preset[]>([]);
  const [loadingPresets, setLoadingPresets] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [usedFallbackPreview, setUsedFallbackPreview] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [actionState, setActionState] = useState<MixerActionState>({ type: null, busy: false });

  const gradient = useMemo(() => computeGradient(sliders), [sliders]);
  const summary = useMemo(() => buildMoodSummary(sliders), [sliders]);

  const gradientStyle = useMemo(() => ({
    backgroundImage: gradient,
    transition: prefersReducedMotion ? 'none' : 'background-image 600ms ease, filter 600ms ease',
  }), [gradient, prefersReducedMotion]);
  const busySpinnerClassName = useMemo(
    () => cn('mr-2 h-4 w-4', !prefersReducedMotion && 'animate-spin'),
    [prefersReducedMotion]
  );
  const inlineSpinnerClassName = useMemo(
    () => cn('h-4 w-4', !prefersReducedMotion && 'animate-spin'),
    [prefersReducedMotion]
  );

  const fetchPresets = useCallback(async () => {
    if (!user?.id) {
      setPresets([]);
      return;
    }

    setLoadingPresets(true);
    try {
      const data = await listMyPresets();
      setPresets(sortPresetsByFreshness(data));
      const current = data.find((preset) => preset.id === selectedPresetId);
      if (!current) {
        setSelectedPresetId(null);
      }
    } catch (error) {
      Sentry.captureException(error);
      toast({
        title: 'Petit nuage sur le mixer',
        description: 'Impossible de retrouver vos douceurs. Réessayez plus tard.',
        variant: 'warning',
      });
    } finally {
      setLoadingPresets(false);
    }
  }, [selectedPresetId, toast, user?.id]);

  useEffect(() => {
    fetchPresets();
  }, [fetchPresets]);

  useEffect(() => {
    if (!selectedPresetId) {
      return;
    }
    const selected = presets.find((preset) => preset.id === selectedPresetId);
    if (!selected) {
      return;
    }
    fromPreset(selected.sliders);
  }, [fromPreset, presets, selectedPresetId]);

  if (!user) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="py-10 text-center">
          <p className="text-lg font-semibold">Connectez-vous pour composer vos ambiances.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Le Mood Mixer sauvegarde vos douceurs personnelles dans votre espace sécurisé.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleSelectPreset = (preset: Preset) => {
    setSelectedPresetId(preset.id);
    setName(preset.name);
    fromPreset(preset.sliders);
    setPreviewUrl(null);
    setUsedFallbackPreview(false);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleReset = () => {
    setSelectedPresetId(null);
    setName('');
    reset();
    setPreviewUrl(null);
    setUsedFallbackPreview(false);
  };

  const runAction = async <T,>(type: MixerActionState['type'], action: () => Promise<T>): Promise<T | null> => {
    setActionState({ type, busy: true });
    try {
      return await action();
    } finally {
      setActionState({ type: null, busy: false });
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      return;
    }
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast({
        title: 'Choisissez un nom doux',
        description: 'Donnez un petit nom à votre mélange avant de le garder.',
        variant: 'info',
      });
      return;
    }

    try {
      PresetInsertSchema.parse({ name: trimmedName, sliders, userId: user.id });
    } catch (error) {
      if (error instanceof ZodError) {
        toast({
          title: 'Ce nom est un peu long',
          description: 'Utilisez un intitulé de moins de quarante caractères.',
          variant: 'warning',
        });
        return;
      }
      throw error;
    }

    Sentry.addBreadcrumb({ category: 'mixer', level: 'info', message: 'mixer:save' });

    try {
      const created = await runAction('save', () =>
        createPreset({ name: trimmedName, sliders, userId: user.id })
      );

      if (!created) {
        return;
      }

      setPresets((current) =>
        sortPresetsByFreshness([created, ...current.filter((preset) => preset.id !== created.id)])
      );
      setSelectedPresetId(created.id);
      toast({
        title: 'Douceur enregistrée',
        description: 'Votre ambiance reste à portée de main.',
        variant: 'success',
      });
    } catch (error) {
      Sentry.captureException(error);
      toast({
        title: 'Sauvegarde impossible',
        description: 'Le nuage Supabase est injoignable. Réessayez dans un instant.',
        variant: 'warning',
      });
    }
  };

  const handleUpdate = async () => {
    if (!user?.id || !selectedPresetId) {
      return;
    }
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast({
        title: 'Un petit nom est requis',
        description: 'Ajoutez un nom avant de rafraîchir cette douceur.',
        variant: 'info',
      });
      return;
    }

    const payload: PresetUpdate = { name: trimmedName, sliders };

    Sentry.addBreadcrumb({ category: 'mixer', level: 'info', message: 'mixer:update' });

    try {
      const updated = await runAction('update', () => updatePreset(selectedPresetId, payload));

      if (!updated) {
        return;
      }

      setPresets((current) =>
        sortPresetsByFreshness(
          current.map((preset) => (preset.id === updated.id ? updated : preset))
        )
      );
      setName(updated.name);
      toast({
        title: 'Douceur rafraîchie',
        description: 'Les nuances ont bien été ajustées.',
        variant: 'success',
      });
    } catch (error) {
      Sentry.captureException(error);
      toast({
        title: 'Mise à jour impossible',
        description: 'La douceur n’a pas pu être synchronisée. Réessayez d’ici quelques secondes.',
        variant: 'warning',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedPresetId) {
      return;
    }
    const confirmation = window.confirm('Supprimer cette ambiance de votre collection ?');
    if (!confirmation) {
      return;
    }

    Sentry.addBreadcrumb({ category: 'mixer', level: 'info', message: 'mixer:delete' });

    try {
      const result = await runAction('delete', () => deletePreset(selectedPresetId));

      if (result === null) {
        return;
      }

      setPresets((current) => current.filter((preset) => preset.id !== selectedPresetId));
      handleReset();
      toast({
        title: 'Douceur effacée',
        description: 'Votre collection reste légère et inspirante.',
        variant: 'info',
      });
    } catch (error) {
      Sentry.captureException(error);
      toast({
        title: 'Suppression interrompue',
        description: 'Nous n’avons pas pu retirer cette ambiance. Réessayez plus tard.',
        variant: 'warning',
      });
    }
  };

  const handlePreview = async () => {
    Sentry.addBreadcrumb({ category: 'mixer', level: 'info', message: 'mixer:preview:start' });
    setPreviewLoading(true);
    setUsedFallbackPreview(false);

    try {
      const url = await previewFromMood(sliders);
      setPreviewUrl(url);
      setUsedFallbackPreview(url === PREVIEW_FALLBACK_URL);
      Sentry.addBreadcrumb({ category: 'mixer', level: 'info', message: 'mixer:preview:success' });
      if (url === PREVIEW_FALLBACK_URL) {
        toast({
          title: 'Extrait neutre prêt',
          description: 'Nous vous jouons un souffle doux en attendant le morceau sur mesure.',
          variant: 'info',
        });
      }
    } catch (error) {
      Sentry.addBreadcrumb({ category: 'mixer', level: 'info', message: 'mixer:preview:fail' });
      Sentry.captureException(error);
      if (error instanceof PreviewUnavailableError && error.fallbackUrl) {
        setPreviewUrl(error.fallbackUrl);
        setUsedFallbackPreview(true);
      } else {
        setPreviewUrl(null);
      }
      toast({
        title: 'Pré-écoute momentanément silencieuse',
        description: 'Un court instant de calme, réessayez dans un moment.',
        variant: 'info',
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const isBusy = actionState.busy;
  const isSaving = isBusy && actionState.type === 'save';
  const isUpdating = isBusy && actionState.type === 'update';
  const isDeleting = isBusy && actionState.type === 'delete';

  return (
    <div className="space-y-10" data-testid="mood-mixer-root">
      <div
        aria-live="polite"
        role="status"
        className="sr-only"
        data-testid="mood-mixer-live-summary"
      >
        {`Mélange ${name.trim() || 'sans nom'} : ${summary}`}
      </div>
      <section className="rounded-3xl border bg-background/80 p-6 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <div
              className="relative overflow-hidden rounded-3xl border text-white shadow-lg"
              style={gradientStyle}
              aria-label="Aperçu visuel du mélange"
              data-testid="mood-mixer-gradient"
            >
              <div className="absolute inset-0 backdrop-blur-[2px]" aria-hidden="true" />
              <div className="relative space-y-3 p-6">
                <span className="inline-flex items-center gap-2 rounded-full bg-black/20 px-3 py-1 text-xs uppercase tracking-wide">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                  Aperçu sensoriel
                </span>
                <p className="text-2xl font-semibold">
                  {name.trim() || 'Ambiance libre'}
                </p>
                <p className="max-w-xl text-sm text-white/90">{summary}</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="mood-mixer-name">Nom de votre douceur</Label>
              <Input
                id="mood-mixer-name"
                value={name}
                onChange={handleNameChange}
                maxLength={40}
                placeholder="Ex. Brise rosée"
                aria-describedby="mood-mixer-name-hint"
              />
              <p id="mood-mixer-name-hint" className="text-xs text-muted-foreground">
                Jusqu'à quarante caractères, sans chiffres apparents.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {sliderOrder.map(({ key, label, tone }) => (
                <div
                  key={key}
                  className={cn(
                    'space-y-3 rounded-2xl border bg-muted/30 p-4 shadow-inner focus-within:ring-2 focus-within:ring-primary/60',
                    `bg-gradient-to-br ${tone}`
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor={`slider-${key}`} className="font-medium text-foreground">
                      {label}
                    </Label>
                    <span className="text-sm text-muted-foreground">
                      {describeLevel(key, sliders[key])}
                    </span>
                  </div>
                  <Slider
                    id={`slider-${key}`}
                    value={[sliders[key]]}
                    onValueChange={(value) => set(key, value[0] ?? 0)}
                    min={0}
                    max={100}
                    step={1}
                    aria-label={label}
                    aria-valuetext={describeLevel(key, sliders[key])}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSave} disabled={isSaving || actionState.busy}>
                {isSaving ? (
                  <Loader2 className={busySpinnerClassName} aria-hidden="true" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                Sauvegarder
              </Button>
              <Button
                variant="secondary"
                onClick={handleUpdate}
                disabled={!selectedPresetId || isUpdating || actionState.busy}
              >
                {isUpdating ? (
                  <Loader2 className={busySpinnerClassName} aria-hidden="true" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                Rafraîchir
              </Button>
              <Button variant="ghost" onClick={handleReset} disabled={actionState.busy}>
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                Repartir à zéro
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={!selectedPresetId || isDeleting || actionState.busy}
              >
                {isDeleting ? (
                  <Loader2 className={busySpinnerClassName} aria-hidden="true" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                )}
                Supprimer
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border bg-muted/20 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-semibold">Pré-écoute Adaptive Music</p>
                  <p className="text-sm text-muted-foreground">
                    {usedFallbackPreview
                      ? 'Extrait neutre proposé pendant que la piste personnalisée se prépare.'
                      : 'Trente secondes pour ressentir votre mélange avant de le garder.'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handlePreview}
                  disabled={previewLoading}
                  aria-label="Lancer la pré-écoute"
                >
                  {previewLoading ? <Loader2 className={inlineSpinnerClassName} aria-hidden="true" /> : 'Pré-écoute'}
                </Button>
              </div>
              {previewUrl && (
                <div className="mt-4">
                  <PreviewPlayer src={previewUrl} />
                </div>
              )}
            </div>

            <div className="rounded-2xl border bg-muted/20 p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Mes presets récents</p>
                <span className="text-xs text-muted-foreground">Sélectionnez pour ajuster instantanément</span>
              </div>
              <div className="mt-4 grid gap-3">
                {loadingPresets ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={`preset-skeleton-${index}`}
                      className="h-16 animate-pulse rounded-2xl border bg-muted/40"
                    />
                  ))
                ) : presets.length ? (
                  presets.map((preset) => {
                    const selected = preset.id === selectedPresetId;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={cn(
                          'flex w-full items-center gap-3 rounded-2xl border bg-background/80 p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          selected
                            ? 'border-primary shadow-lg'
                            : 'hover:border-primary/40 hover:shadow-sm'
                        )}
                        aria-pressed={selected}
                      >
                        <span className="text-3xl" aria-hidden="true">{presetEmoji(preset.name)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-semibold">{preset.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {buildMoodSummary(preset.sliders)}
                          </p>
                        </div>
                        <span
                          className="h-12 w-12 flex-none rounded-full border"
                          style={{ backgroundImage: computeGradient(preset.sliders) }}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucune douceur gardée pour le moment. Sauvegardez un mélange pour l'afficher ici.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
