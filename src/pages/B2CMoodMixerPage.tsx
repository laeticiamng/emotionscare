import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Volume2, Save, Play, Pause, RotateCcw, Trash2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import { FadeIn, SeoHead } from '@/COMPONENTS.reg';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { toast } from 'sonner';
import { useMusicControls } from '@/hooks/useMusicControls';
import { adaptiveMusicService } from '@/services/adaptiveMusicService';
import type { MusicTrack } from '@/types/music';

interface MoodVibe {
  id: string;
  name: string;
  softness: number;
  clarity: number;
  description: string;
}

type MoodPresetRow = Database['public']['Tables']['mood_presets']['Row'];

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const buildDescription = (soft: number, clear: number) =>
  `Mix personnel ${soft}% doux, ${clear}% clair`;

const buildBlend = (soft: number, clear: number) => ({
  joy: clamp01(soft / 100),
  calm: clamp01(1 - soft / 100),
  energy: clamp01(clear / 100),
  focus: clamp01(1 - clear / 100),
});

const mapPresetToVibe = (preset: MoodPresetRow): MoodVibe => ({
  id: preset.id,
  name: preset.name,
  softness: preset.softness,
  clarity: preset.clarity,
  description: preset.description ?? buildDescription(preset.softness, preset.clarity),
});

const B2CMoodMixerPage: React.FC = () => {
  const navigate = useNavigate();
  const { shouldAnimate } = useMotionPrefs();
  const [softness, setSoftness] = useState([50]);
  const [clarity, setClarity] = useState([50]);
  const [currentVibe, setCurrentVibe] = useState<string>('');
  const [savedVibes, setSavedVibes] = useState<MoodVibe[]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [isLoadingPresets, setIsLoadingPresets] = useState(true);
  const [isSavingPreset, setIsSavingPreset] = useState(false);
  const [dustParticles, setDustParticles] = useState<Array<{ x: number; y: number; opacity: number }>>([]);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [previewSource, setPreviewSource] = useState<'api' | 'mock'>('mock');
  const [previewError, setPreviewError] = useState<string | null>(null);
  const { playTrack, pause, isPlaying: isPreviewPlaying, isLoading: isAudioLoading, currentTrack } = useMusicControls();

  // Générateur de nom de vibe basé sur les sliders
  const generateVibeName = useCallback((soft: number, clear: number) => {
    const softWords = ['coton', 'soie', 'velours', 'brise', 'mousse'];
    const clearWords = ['cristal', 'acier', 'diamant', 'verre', 'lumière'];
    const neutralWords = ['sable', 'terre', 'bois', 'pierre', 'eau'];

    if (soft > 60 && clear < 40) {
      return `${softWords[Math.floor(Math.random() * softWords.length)]} ${['pâle', 'doux', 'tendre'][Math.floor(Math.random() * 3)]}`;
    } else if (clear > 60 && soft < 40) {
      return `${clearWords[Math.floor(Math.random() * clearWords.length)]} ${['vif', 'net', 'pur'][Math.floor(Math.random() * 3)]}`;
    } else {
      return `${neutralWords[Math.floor(Math.random() * neutralWords.length)]} ${['équilibré', 'stable', 'calme'][Math.floor(Math.random() * 3)]}`;
    }
  }, []);

  const fetchSavedVibes = useCallback(async () => {
    setIsLoadingPresets(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        setSavedVibes([]);
        setActivePresetId(null);
        return;
      }

      const { data, error } = await supabase
        .from('mood_presets')
        .select('id, user_id, name, description, softness, clarity, blend, created_at, updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const vibes = (data ?? []).map(mapPresetToVibe).slice(0, 6);
      setSavedVibes(vibes);

      if (!vibes.some((vibe) => vibe.id === activePresetId)) {
        setActivePresetId(null);
      }
    } catch (error) {
      console.error('Error fetching mood presets:', error);
      toast.error('Impossible de charger vos vibes pour le moment');
    } finally {
      setIsLoadingPresets(false);
    }
  }, [activePresetId]);

  useEffect(() => {
    fetchSavedVibes();
  }, [fetchSavedVibes]);

  // Animation des particules de poussière
  useEffect(() => {
    if (!shouldAnimate) return;
    
    const generateParticles = () => {
      const particles = [];
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: Math.random() * 0.3
        });
      }
      setDustParticles(particles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 3000);
    return () => clearInterval(interval);
  }, [shouldAnimate]);

  // Mise à jour du nom de vibe en temps réel
  useEffect(() => {
    const vibeName = generateVibeName(softness[0], clarity[0]);
    setCurrentVibe(vibeName);
  }, [softness, clarity, generateVibeName]);

  const determineTargetEmotion = (soft: number, clear: number) => {
    if (soft >= 65 && clear <= 40) return 'calm';
    if (clear >= 65 && soft <= 40) return 'happy';
    if (soft <= 35 && clear <= 35) return 'anxious';
    if (soft >= 65 && clear >= 65) return 'happy';
    return 'calm';
  };

  const normalizeTrack = (trackData: RawTrack | null | undefined, fallbackEmotion: string): MusicTrack | null => {
    if (!trackData) return null;

    const sourceUrl = trackData.audioUrl || trackData.url;
    if (!sourceUrl) return null;

    return {
      id: trackData.id ?? `preview-${fallbackEmotion}-${Date.now()}`,
      title: trackData.title ?? trackData.name ?? 'Aperçu adaptatif',
      artist: trackData.artist ?? trackData.author ?? 'Adaptive Music',
      duration: trackData.duration ?? 180,
      emotion: trackData.emotion ?? fallbackEmotion,
      mood: trackData.mood ?? fallbackEmotion,
      coverUrl: trackData.coverUrl ?? trackData.imageUrl,
      tags: trackData.tags,
      isGenerated: trackData.isGenerated,
      generatedAt: trackData.generatedAt,
      sunoTaskId: trackData.sunoTaskId,
      bpm: trackData.bpm,
      key: trackData.key,
      energy: trackData.energy,
      url: sourceUrl,
      audioUrl: sourceUrl,
    };
  };

  const getMockTrack = (emotion: string): MusicTrack => {
    if (emotion === 'happy') {
      return {
        id: 'mock-happy-preview',
        title: 'Rayon de Soleil',
        artist: 'EmotionsCare Adaptive',
        url: '/audio/lofi-120.mp3',
        audioUrl: '/audio/lofi-120.mp3',
        duration: 120,
        emotion: 'happy',
        mood: 'happy',
      };
    }

    return {
      id: `mock-${emotion}-preview`,
      title: 'Pluie Relaxante',
      artist: 'EmotionsCare Adaptive',
      url: '/audio/rain-soft.mp3',
      audioUrl: '/audio/rain-soft.mp3',
      duration: 150,
      emotion: emotion,
      mood: emotion,
    };
  };

  const handlePreviewToggle = async () => {
    if (isPreviewPlaying) {
      pause();
      return;
    }

    if (isFetchingPreview || isAudioLoading) return;

    setPreviewError(null);
    setIsFetchingPreview(true);

    const targetEmotion = determineTargetEmotion(softness[0], clarity[0]);
    let source: 'api' | 'mock' = 'mock';
    let previewTrack: MusicTrack | null = null;

    try {
      const response = await fetch('/api/modules/adaptive-music/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vibe: currentVibe,
          emotion: targetEmotion,
          sliders: {
            softness: softness[0],
            clarity: clarity[0]
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const normalized = normalizeTrack(data?.track ?? data, targetEmotion);
        if (normalized) {
          previewTrack = normalized;
          source = 'api';
        }
      } else {
        console.warn('Adaptive music preview API returned an error:', response.status);
      }
    } catch (error) {
      console.warn('Adaptive music preview API unavailable, using mock fallback.', error);
    }

    if (!previewTrack) {
      const recommended = adaptiveMusicService.getRecommendedTrack(targetEmotion);
      previewTrack = normalizeTrack(recommended, targetEmotion) ?? getMockTrack(targetEmotion);
    }

    if (!previewTrack?.url) {
      setPreviewError('Impossible de charger une pré-écoute pour le moment.');
      setIsFetchingPreview(false);
      return;
    }

    setPreviewSource(source);

    try {
      await playTrack(previewTrack);
    } catch (error) {
      console.error('Erreur pendant la lecture de la pré-écoute.', error);
      setPreviewError('Lecture impossible. Réessayez plus tard.');
    } finally {
      setIsFetchingPreview(false);
    }
  };

  const saveCurrentVibe = useCallback(async () => {
    if (isSavingPreset) {
      return;
    }

    setIsSavingPreset(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        toast.error('Connectez-vous pour sauvegarder vos vibes');
        return;
      }

      const description = buildDescription(softness[0], clarity[0]);
      const blend = buildBlend(softness[0], clarity[0]);
      const { data, error } = await supabase
        .from('mood_presets')
        .insert({
          user_id: user.id,
          name: currentVibe || generateVibeName(softness[0], clarity[0]),
          description,
          softness: softness[0],
          clarity: clarity[0],
          blend,
        })
        .select('id, user_id, name, description, softness, clarity, blend, created_at, updated_at')
        .single();

      if (error) {
        throw error;
      }

      const newVibe = mapPresetToVibe(data as MoodPresetRow);
      setSavedVibes((prev) => [newVibe, ...prev].slice(0, 6));
      setActivePresetId(newVibe.id);
      toast.success('Ambiance sauvegardée');
    } catch (error) {
      console.error('Error saving mood preset:', error);
      toast.error('Impossible de sauvegarder la vibe');
    } finally {
      setIsSavingPreset(false);
    }
  }, [clarity, currentVibe, generateVibeName, isSavingPreset, softness]);

  const updateActiveVibe = useCallback(async () => {
    if (!activePresetId || isSavingPreset) {
      return;
    }

    setIsSavingPreset(true);
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!user) {
        toast.error('Connectez-vous pour mettre à jour vos vibes');
        return;
      }

      const description = buildDescription(softness[0], clarity[0]);
      const blend = buildBlend(softness[0], clarity[0]);
      const { data, error } = await supabase
        .from('mood_presets')
        .update({
          name: currentVibe || generateVibeName(softness[0], clarity[0]),
          description,
          softness: softness[0],
          clarity: clarity[0],
          blend,
        })
        .eq('id', activePresetId)
        .eq('user_id', user.id)
        .select('id, user_id, name, description, softness, clarity, blend, created_at, updated_at')
        .single();

      if (error) {
        throw error;
      }

      const updatedVibe = mapPresetToVibe(data as MoodPresetRow);
      setSavedVibes((prev) =>
        prev.map((vibe) => (vibe.id === updatedVibe.id ? updatedVibe : vibe))
      );
      toast.success('Ambiance mise à jour');
    } catch (error) {
      console.error('Error updating mood preset:', error);
      toast.error('Impossible de mettre à jour la vibe');
    } finally {
      setIsSavingPreset(false);
    }
  }, [activePresetId, clarity, currentVibe, generateVibeName, isSavingPreset, softness]);

  const loadVibe = (vibe: MoodVibe) => {
    setSoftness([vibe.softness]);
    setClarity([vibe.clarity]);
    setCurrentVibe(vibe.name);
    setActivePresetId(vibe.id);
  };

  const handleDeleteVibe = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>, vibeId: string) => {
      event.stopPropagation();

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error('Error retrieving auth session:', authError);
        toast.error('Session utilisateur introuvable');
        return;
      }

      if (!user) {
        toast.error('Connectez-vous pour gérer vos vibes');
        return;
      }

      if (!window.confirm('Supprimer cette vibe ?')) {
        return;
      }

      try {
        const { error } = await supabase
          .from('mood_presets')
          .delete()
          .eq('id', vibeId)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        setSavedVibes((prev) => prev.filter((vibe) => vibe.id !== vibeId));
        if (activePresetId === vibeId) {
          setActivePresetId(null);
        }
        toast.success('Ambiance supprimée');
      } catch (error) {
        console.error('Error deleting mood preset:', error);
        toast.error('Impossible de supprimer la vibe');
      }
    },
    [activePresetId]
  );

  const getVibeColor = () => {
    const soft = softness[0];
    const clear = clarity[0];
    
    // Couleur basée sur le mix des sliders
    const hue = (soft + clear) / 2 * 3.6; // 0-360
    const saturation = Math.abs(soft - clear) / 100 * 70 + 20; // 20-90%
    const lightness = 45 + (soft / 100) * 30; // 45-75%
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 p-4 relative overflow-hidden">
      <SeoHead title="Mood Mixer" description="Mix tes humeurs en musique" />
      {/* Particules de poussière */}
      {shouldAnimate && dustParticles.map((particle, index) => (
        <div
          key={index}
          className="absolute w-1 h-1 bg-foreground/10 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animationDuration: '3s',
            animationDelay: `${index * 0.5}s`
          }}
        />
      ))}

      {/* Header */}
      <FadeIn>
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Mood Mixer</h1>
            <p className="text-sm text-muted-foreground">Climat sur deux sliders</p>
          </div>
        </div>
      </FadeIn>

      <div className="max-w-md mx-auto space-y-6 relative z-10">
        {/* Zone de mix principal */}
        <Card 
          className="p-6 bg-card/80 backdrop-blur-sm border-border/50 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${getVibeColor()}15, ${getVibeColor()}05)`
          }}
        >
          {/* Nom de la vibe actuelle */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-light text-foreground mb-1" style={{ color: getVibeColor() }}>
              {currentVibe}
            </h2>
            <p className="text-xs text-muted-foreground">Votre climat sonore</p>
          </div>

          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Plus doux</label>
                <span className="text-xs text-muted-foreground">{softness[0]}%</span>
              </div>
              <Slider
                value={softness}
                onValueChange={setSoftness}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Plus clair</label>
                <span className="text-xs text-muted-foreground">{clarity[0]}%</span>
              </div>
              <Slider
                value={clarity}
                onValueChange={setClarity}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center gap-3 mt-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePreviewToggle}
              className="hover:bg-white/10"
              aria-label={isPreviewPlaying ? 'Mettre la lecture en pause' : 'Lancer la lecture du mix'}
            >
              {isPreviewPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (isFetchingPreview || isAudioLoading) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={saveCurrentVibe}
              className="hover:bg-white/10"
              disabled={isSavingPreset}
              aria-label="Sauvegarder la vibe"
              title="Sauvegarder la vibe actuelle"
            >
              <Save className="h-4 w-4" />
            </Button>
            {activePresetId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={updateActiveVibe}
                className="hover:bg-white/10"
                disabled={isSavingPreset}
                aria-label="Mettre à jour la vibe sélectionnée"
                title="Mettre à jour la vibe sélectionnée"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-1 text-center">
              <Volume2 className="h-4 w-4 text-muted-foreground mx-auto" />
            </div>
          </div>

          {currentTrack && (
            <div className="mt-4 text-center text-xs text-muted-foreground space-y-1">
              <p className="text-sm font-medium text-foreground">{currentTrack.title}</p>
              <p>{currentTrack.artist}</p>
              <p>
                {previewSource === 'api'
                  ? 'Aperçu via Adaptive Music'
                  : 'Aperçu simulé (mock adaptatif)'}
              </p>
            </div>
          )}

          {previewError && (
            <p className="mt-3 text-xs text-destructive text-center">{previewError}</p>
          )}
        </Card>

        {/* Bibliothèque de vibes */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Vos vibes sauvées</h3>
          {isLoadingPresets ? (
            <Card className="p-3 bg-card/40 backdrop-blur-sm border-border/30 text-sm text-muted-foreground">
              Chargement de vos vibes personnalisées...
            </Card>
          ) : savedVibes.length === 0 ? (
            <Card className="p-3 bg-card/40 backdrop-blur-sm border-border/30 text-sm text-muted-foreground">
              Enregistrez votre première ambiance pour la retrouver en un clic.
            </Card>
          ) : (
            <div className="space-y-2">
              {savedVibes.map((vibe) => {
                const isActive = activePresetId === vibe.id;
                return (
                  <Card
                    key={vibe.id}
                    className={`p-3 bg-card/40 backdrop-blur-sm border transition-all cursor-pointer group hover:bg-card/60 ${
                      isActive ? 'border-primary/60 ring-1 ring-primary/40' : 'border-border/30'
                    }`}
                    onClick={() => loadVibe(vibe)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                          {vibe.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">{vibe.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border border-border/50"
                          style={{
                            backgroundColor: `hsl(${(vibe.softness + vibe.clarity) / 2 * 3.6}, 50%, 60%)`
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-white/10"
                          onClick={(event) => handleDeleteVibe(event, vibe.id)}
                          aria-label={`Supprimer ${vibe.name}`}
                          title="Supprimer cette vibe"
                          disabled={isSavingPreset}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Option de défaut pour demain */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Garder comme ambiance par défaut ?</p>
              <p className="text-xs text-muted-foreground">Pour demain matin</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              Oui ✨
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default B2CMoodMixerPage;