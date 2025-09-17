import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Save, Play, Pause, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';
import { FadeIn, SeoHead } from '@/COMPONENTS.reg';
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

type RawTrack = Partial<MusicTrack> & { [key: string]: any };

const B2CMoodMixerPage: React.FC = () => {
  const navigate = useNavigate();
  const { shouldAnimate, getDuration } = useMotionPrefs();
  const [softness, setSoftness] = useState([50]);
  const [clarity, setClarity] = useState([50]);
  const [currentVibe, setCurrentVibe] = useState<string>('');
  const [savedVibes, setSavedVibes] = useState<MoodVibe[]>([
    { id: '1', name: 'brise lagon', softness: 70, clarity: 30, description: 'Douceur marine' },
    { id: '2', name: 'verre poli', softness: 40, clarity: 80, description: 'Netteté cristalline' }
  ]);
  const [dustParticles, setDustParticles] = useState<Array<{ x: number; y: number; opacity: number }>>([]);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [previewSource, setPreviewSource] = useState<'api' | 'mock'>('mock');
  const [previewError, setPreviewError] = useState<string | null>(null);
  const { playTrack, pause, isPlaying: isPreviewPlaying, isLoading: isAudioLoading, currentTrack } = useMusicControls();

  // Générateur de nom de vibe basé sur les sliders
  const generateVibeName = (soft: number, clear: number) => {
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
  };

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
  }, [softness, clarity]);

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

  const saveCurrentVibe = () => {
    const newVibe: MoodVibe = {
      id: Date.now().toString(),
      name: currentVibe,
      softness: softness[0],
      clarity: clarity[0],
      description: `Mix personnel ${softness[0]}% doux, ${clarity[0]}% clair`
    };
    
    setSavedVibes(prev => [newVibe, ...prev].slice(0, 6)); // Garder max 6 vibes
    
    // Animation de sauvegarde
    if (shouldAnimate) {
      const duration = getDuration(600);
      // Effet visuel de sauvegarde
    }
  };

  const loadVibe = (vibe: MoodVibe) => {
    setSoftness([vibe.softness]);
    setClarity([vibe.clarity]);
    setCurrentVibe(vibe.name);
  };

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
              disabled={(!isPreviewPlaying && (isFetchingPreview || isAudioLoading))}
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
            >
              <Save className="h-4 w-4" />
            </Button>
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
          <div className="space-y-2">
            {savedVibes.map((vibe) => (
              <Card 
                key={vibe.id}
                className="p-3 bg-card/40 backdrop-blur-sm border-border/30 hover:bg-card/60 transition-all cursor-pointer group"
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
                    <div className="w-3 h-3 rounded-full border border-border/50" 
                         style={{ 
                           backgroundColor: `hsl(${(vibe.softness + vibe.clarity) / 2 * 3.6}, 50%, 60%)`
                         }} 
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
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