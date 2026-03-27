// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { moodPresetsService, MoodPresetPayload } from '@/services/moodPresetsService';
import { MoodPresetRecord } from '@/types/mood-mixer';
import { toast } from 'sonner';
import { Loader2, Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import { logger } from '@/lib/logger';

interface MoodPresetFormState {
  slug: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  tags: string;
  joy: number;
  calm: number;
  energy: number;
  focus: number;
}

const INITIAL_FORM_STATE: MoodPresetFormState = {
  slug: '',
  name: '',
  description: '',
  icon: '',
  gradient: '',
  tags: '',
  joy: 50,
  calm: 50,
  energy: 50,
  focus: 50,
};

const clampPercent = (value: number) => Math.min(100, Math.max(0, Math.round(value)));
const toPercent = (value: number) => clampPercent(value * 100);
const toRatio = (value: number) => Math.min(Math.max(value / 100, 0), 1);

const MoodPresetsAdminPage: React.FC = () => {
  const [presets, setPresets] = useState<MoodPresetRecord[]>([]);
  const [formState, setFormState] = useState<MoodPresetFormState>(INITIAL_FORM_STATE);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const existingSlugs = useMemo(() => {
    const values = presets
      .map((preset) => preset.slug)
      .filter((slug): slug is string => typeof slug === 'string' && slug.trim().length > 0);
    return new Set(values);
  }, [presets]);

  const loadPresets = async () => {
    setIsLoading(true);
    try {
      const data = await moodPresetsService.listPresets();
      setPresets(data);
    } catch (error) {
      logger.error('Failed to load mood presets', error as Error, 'SYSTEM');
      toast.error('Impossible de charger les presets Mood Mixer.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPresets();
  }, []);

  const resetForm = () => {
    setFormState(INITIAL_FORM_STATE);
    setEditingId(null);
  };

  const handleEdit = (preset: MoodPresetRecord) => {
    setEditingId(preset.id);
    setFormState({
      slug: preset.slug ?? '',
      name: preset.name,
      description: preset.description ?? '',
      icon: preset.icon ?? '',
      gradient: preset.gradient ?? '',
      tags: preset.tags.join(', '),
      joy: toPercent(preset.blend.joy),
      calm: toPercent(preset.blend.calm),
      energy: toPercent(preset.blend.energy),
      focus: toPercent(preset.blend.focus),
    });
  };

  const parseTags = (value: string): string[] =>
    value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

  const buildPayload = (): MoodPresetPayload | null => {
    if (!formState.slug.trim()) {
      toast.error('Le slug est obligatoire.');
      return null;
    }
    if (!formState.name.trim()) {
      toast.error('Le nom est obligatoire.');
      return null;
    }

    const slug = formState.slug.trim();
    if (!editingId && existingSlugs.has(slug)) {
      toast.error('Ce slug existe déjà.');
      return null;
    }

    const blend = {
      joy: toRatio(formState.joy),
      calm: toRatio(formState.calm),
      energy: toRatio(formState.energy),
      focus: toRatio(formState.focus),
    };

    return {
      slug,
      name: formState.name.trim(),
      description: formState.description.trim() || null,
      icon: formState.icon.trim() || null,
      gradient: formState.gradient.trim() || null,
      tags: parseTags(formState.tags),
      blend,
      softness: clampPercent(formState.joy),
      clarity: clampPercent(formState.energy),
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = buildPayload();
    if (!payload) return;

    setIsSubmitting(true);
    try {
      if (editingId) {
        await moodPresetsService.updatePreset(editingId, payload);
        toast.success('Preset mis à jour avec succès.');
      } else {
        await moodPresetsService.createPreset(payload);
        toast.success('Preset créé avec succès.');
      }
      await loadPresets();
      resetForm();
    } catch (error) {
      logger.error('Failed to save mood preset', error as Error, 'SYSTEM');
      toast.error('Erreur lors de la sauvegarde du preset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (preset: MoodPresetRecord) => {
    if (!window.confirm(`Supprimer le preset "${preset.name}" ?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await moodPresetsService.deletePreset(preset.id);
      toast.success('Preset supprimé.');
      await loadPresets();
      if (editingId === preset.id) {
        resetForm();
      }
    } catch (error) {
      logger.error('Failed to delete mood preset', error as Error, 'SYSTEM');
      toast.error('Erreur lors de la suppression du preset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Mood Presets</h1>
          <p className="text-muted-foreground">
            Créez, modifiez et supprimez les ambiances proposées dans le Mood Mixer.
          </p>
        </div>
        <Button variant="outline" onClick={loadPresets} disabled={isLoading || isSubmitting}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Modifier un preset' : 'Créer un nouveau preset'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formState.slug}
                  onChange={(event) => setFormState((prev) => ({ ...prev, slug: event.target.value }))}
                  placeholder="morning-boost"
                  disabled={Boolean(editingId)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={formState.name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Réveil Énergique"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formState.description}
                  onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Commencez la journée avec dynamisme"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                <Input
                  id="tags"
                  value={formState.tags}
                  onChange={(event) => setFormState((prev) => ({ ...prev, tags: event.target.value }))}
                  placeholder="Matin, Énergie, Motivation"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icône (Lucide)</Label>
                <Input
                  id="icon"
                  value={formState.icon}
                  onChange={(event) => setFormState((prev) => ({ ...prev, icon: event.target.value }))}
                  placeholder="sun"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gradient">Gradient Tailwind</Label>
                <Input
                  id="gradient"
                  value={formState.gradient}
                  onChange={(event) => setFormState((prev) => ({ ...prev, gradient: event.target.value }))}
                  placeholder="from-orange-400 to-yellow-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {(['joy', 'calm', 'energy', 'focus'] as Array<keyof Pick<MoodPresetFormState, 'joy' | 'calm' | 'energy' | 'focus'>>).map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="capitalize">
                      {field === 'joy' ? 'Joie' : field === 'calm' ? 'Calme' : field === 'energy' ? 'Énergie' : 'Focus'}
                    </Label>
                    <Input
                      id={field}
                      type="number"
                      min={0}
                      max={100}
                      value={formState[field]}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, [field]: Number(event.target.value) }))
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sauvegarde…
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingId ? 'Mettre à jour' : 'Créer'}
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={isSubmitting}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Presets existants</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement des presets…
            </div>
          ) : presets.length === 0 ? (
            <div className="text-muted-foreground text-sm">Aucun preset enregistré pour le moment.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {presets.map((preset) => (
                <Card key={preset.id} className="border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">{preset.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">Slug : {preset.slug}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(preset)}
                          disabled={isSubmitting}
                        >
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(preset)}
                          disabled={isSubmitting}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <p>{preset.description ?? 'Aucune description fournie.'}</p>
                    <div className="flex flex-wrap gap-2">
                      {preset.tags.map((tag) => (
                        <Badge key={`${preset.id}-${tag}`} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                      {preset.tags.length === 0 && (
                        <span className="text-xs text-muted-foreground">Aucun tag</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span>Joie</span>
                        <span>{toPercent(preset.blend.joy)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Calme</span>
                        <span>{toPercent(preset.blend.calm)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Énergie</span>
                        <span>{toPercent(preset.blend.energy)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Focus</span>
                        <span>{toPercent(preset.blend.focus)}%</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Mis à jour le {new Date(preset.updatedAt).toLocaleString('fr-FR')}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MoodPresetsAdminPage;
