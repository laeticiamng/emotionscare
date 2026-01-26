/**
 * MUSIC PAGE EXAMPLE - EmotionsCare
 *
 * Exemple d'intégration complète des nouveaux composants:
 * - QuotaIndicator (affichage quota)
 * - useUserQuota (hook quotas)
 * - UnifiedMusicPlayer (avec accessibilité)
 * - Validation Zod
 *
 * @example
 * // Dans votre page B2CMusicEnhanced.tsx ou autre:
 * import { MusicPageExample } from '@/components/music/examples/MusicPageExample';
 *
 * export function B2CMusicEnhanced() {
 *   return <MusicPageExample />;
 * }
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  QuotaIndicator,
  QuotaBadge,
  QuotaWarning
} from '@/components/music/QuotaIndicator';
import { useUserQuota } from '@/hooks/music/useUserQuota';
import { UnifiedMusicPlayer } from '@/components/music/UnifiedMusicPlayer';
import { enhancedMusicService } from '@/services/music/enhanced-music-service';
import { validateInput, MusicGenerationInputSchema } from '@/validators/music';
import { Music, Sparkles, Info } from '@/components/music/icons';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function MusicPageExample() {
  const {
    canGenerate,
    remaining,
    limit,
    isLoading: quotaLoading,
    refetch: refetchQuota
  } = useUserQuota();

  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    style: '',
    prompt: '',
    instrumental: true,
    duration: 180
  });

  /**
   * Handler de génération avec validation et quotas
   */
  const handleGenerate = async () => {
    // 1. Validation des inputs avec Zod
    const validation = validateInput(MusicGenerationInputSchema, {
      ...formData,
      model: 'V4'
    });

    if (!validation.success) {
      toast.error(`Erreur de validation: ${validation.errors[0]}`);
      return;
    }

    // 2. Vérifier le quota (déjà fait par le hook mais double check)
    if (!canGenerate) {
      toast.error(`Quota épuisé. Plus que ${remaining}/${limit} générations disponibles.`);
      return;
    }

    // 3. Générer
    setIsGenerating(true);
    try {
      await enhancedMusicService.generateMusicWithTracking({
        ...validation.data,
        instrumental: validation.data.instrumental ?? true,
        negativeTags: validation.data.negativeTags?.join(','),
        customMode: true,
        model: 'V4'
      });

      toast.success('Génération lancée avec succès !');

      // 4. Rafraîchir le quota
      await refetchQuota();

      // 5. Reset form
      setFormData({
        title: '',
        style: '',
        prompt: '',
        instrumental: true,
        duration: 180
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';

      // Afficher message d'erreur approprié
      if (errorMessage.includes('Quota')) {
        toast.error('Quota épuisé. Passez à Premium pour plus de générations.');
      } else if (errorMessage.includes('Durée trop longue')) {
        toast.error('Durée trop longue pour votre tier. Réduisez la durée ou passez à Premium.');
      } else if (errorMessage.includes('Trop de générations en cours')) {
        toast.error('Trop de générations en cours. Attendez la fin des générations actuelles.');
      } else {
        toast.error(`Erreur: ${errorMessage}`);
      }

      // Rafraîchir quota au cas où
      await refetchQuota();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Header avec Badge Quota */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Music className="h-8 w-8" />
            Génération Musicale IA
          </h1>
          <p className="text-muted-foreground mt-1">
            Créez des musiques thérapeutiques personnalisées
          </p>
        </div>
        <QuotaBadge className="text-sm" />
      </div>

      {/* Grille 2 colonnes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - Formulaire */}
        <div className="lg:col-span-2 space-y-6">
          {/* Alerte quota warning */}
          {!quotaLoading && !canGenerate && <QuotaWarning />}

          {/* Alerte info keyboard shortcuts */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              💡 <strong>Astuce</strong>: Utilisez les raccourcis clavier pour contrôler le
              lecteur (Espace, ↑/↓, ←/→, M)
            </AlertDescription>
          </Alert>

          {/* Formulaire de génération */}
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de Génération</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  placeholder="Ex: Méditation Matinale"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  maxLength={100}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.title.length}/100 caractères
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Style *</Label>
                <Input
                  id="style"
                  placeholder="Ex: ambient, calming, meditative"
                  value={formData.style}
                  onChange={(e) =>
                    setFormData({ ...formData, style: e.target.value })
                  }
                  maxLength={200}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {formData.style.length}/200 caractères
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Prompt (optionnel)</Label>
                <Textarea
                  id="prompt"
                  placeholder="Décrivez l'ambiance souhaitée..."
                  value={formData.prompt}
                  onChange={(e) =>
                    setFormData({ ...formData, prompt: e.target.value })
                  }
                  maxLength={500}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.prompt?.length || 0}/500 caractères
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Durée (secondes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={30}
                  max={600}
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: parseInt(e.target.value) || 180
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  {formData.duration}s (min: 30s, max: 600s pour Premium)
                </p>
              </div>

              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={
                  !canGenerate ||
                  isGenerating ||
                  !formData.title ||
                  !formData.style
                }
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Générer ({remaining}/{limit} restants)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Player Audio avec accessibilité */}
          <UnifiedMusicPlayer />
        </div>

        {/* Colonne droite - Quota */}
        <div className="space-y-6">
          <QuotaIndicator variant="default" showUpgrade={true} />

          {/* Exemples de presets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Styles Populaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { title: 'Méditation Profonde', style: 'ambient, calm, meditative' },
                { title: 'Concentration Focus', style: 'focus, productivity, lo-fi' },
                { title: 'Énergie Matinale', style: 'uplifting, energetic, positive' },
                { title: 'Détente Soirée', style: 'relaxing, soft, peaceful' }
              ].map((preset, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      title: preset.title,
                      style: preset.style
                    })
                  }
                >
                  <Music className="h-3 w-3 mr-2" />
                  {preset.title}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MusicPageExample;
