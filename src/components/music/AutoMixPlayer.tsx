/**
 * AutoMixPlayer - Lecteur intelligent avec contexte temps réel et crossfade audio
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  Sunrise,
  Sunset,
  Moon,
  Zap,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Share2
} from '@/components/music/icons';
import { useAutoMix } from '@/hooks/useAutoMix';
import { useMusic } from '@/hooks/useMusic';
import { PlaylistShareModal } from './PlaylistShareModal';

const TimeIcons = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
  night: Moon
};

const WeatherIcons = {
  sunny: Sun,
  rainy: CloudRain,
  cloudy: Cloud,
  snowy: CloudSnow,
  stormy: Zap,
  neutral: Cloud
};

export const AutoMixPlayer: React.FC = () => {
  const {
    context,
    activePlaylist,
    isGenerating,
    generateAutoMix,
    fetchContext,
    saveContextPreferences,
    submitFeedback
  } = useAutoMix();

  // Connexion au contexte musique global
  const musicContext = useMusic();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trackCount, setTrackCount] = useState(7);
  const [weatherSensitivity, setWeatherSensitivity] = useState(true);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [crossfadeDuration, setCrossfadeDuration] = useState(3);

  // Audio elements pour le crossfade
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const crossfadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync avec le player global
  useEffect(() => {
    if (musicContext?.state?.isPlaying !== undefined) {
      setIsPlaying(musicContext.state.isPlaying);
    }
  }, [musicContext?.state?.isPlaying]);

  useEffect(() => {
    if (activePlaylist) {
      setFeedbackGiven(false);
    }
  }, [activePlaylist?.id]);

  // Cleanup audio elements
  useEffect(() => {
    return () => {
      if (crossfadeIntervalRef.current) {
        clearInterval(crossfadeIntervalRef.current);
      }
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      if (nextAudioRef.current) {
        nextAudioRef.current.pause();
        nextAudioRef.current = null;
      }
    };
  }, []);

  // Crossfade implementation
  const performCrossfade = useCallback((fromAudio: HTMLAudioElement, toAudio: HTMLAudioElement) => {
    const steps = crossfadeDuration * 20; // 20 steps per second
    const _fadeStep = 1 / steps;
    let step = 0;

    if (crossfadeIntervalRef.current) {
      clearInterval(crossfadeIntervalRef.current);
    }

    // Start the next track
    toAudio.volume = 0;
    toAudio.play().catch(() => {});

    crossfadeIntervalRef.current = setInterval(() => {
      step++;
      const progress = step / steps;

      // Fade out current
      fromAudio.volume = Math.max(0, 1 - progress);
      // Fade in next
      toAudio.volume = Math.min(1, progress);

      if (step >= steps) {
        clearInterval(crossfadeIntervalRef.current!);
        fromAudio.pause();
        fromAudio.currentTime = 0;
      }
    }, 50);
  }, [crossfadeDuration]);

  const playTrackWithCrossfade = useCallback((trackIndex: number) => {
    const tracks = activePlaylist?.generated_tracks;
    if (!tracks || trackIndex >= tracks.length) return;

    const track = tracks[trackIndex];
    const audioUrl = track.audioUrl || track.url;
    
    if (!audioUrl) return;

    // Create new audio element for the track
    const newAudio = new Audio(audioUrl);
    newAudio.preload = 'auto';

    if (currentAudioRef.current && isPlaying) {
      // Perform crossfade from current to new
      nextAudioRef.current = newAudio;
      performCrossfade(currentAudioRef.current, newAudio);
      
      // Swap references after crossfade
      setTimeout(() => {
        currentAudioRef.current = newAudio;
        nextAudioRef.current = null;
      }, crossfadeDuration * 1000);
    } else {
      // No current track, just play
      currentAudioRef.current = newAudio;
      newAudio.volume = 1;
      newAudio.play().catch(() => {});
    }

    // Listen for track end to auto-advance
    newAudio.onended = () => {
      if (trackIndex < tracks.length - 1) {
        setCurrentIndex(trackIndex + 1);
        playTrackWithCrossfade(trackIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };

    // Trigger crossfade before track ends
    newAudio.ontimeupdate = () => {
      const timeLeft = newAudio.duration - newAudio.currentTime;
      if (timeLeft <= crossfadeDuration && trackIndex < tracks.length - 1 && !nextAudioRef.current) {
        // Preload and start crossfade to next track
        const nextTrack = tracks[trackIndex + 1];
        const nextUrl = nextTrack.audioUrl || nextTrack.url;
        if (nextUrl) {
          const nextAudio = new Audio(nextUrl);
          nextAudio.preload = 'auto';
          nextAudioRef.current = nextAudio;
          performCrossfade(newAudio, nextAudio);
          setCurrentIndex(trackIndex + 1);
          
          setTimeout(() => {
            currentAudioRef.current = nextAudio;
            nextAudioRef.current = null;
          }, crossfadeDuration * 1000);
        }
      }
    };

    setIsPlaying(true);
  }, [activePlaylist, isPlaying, crossfadeDuration, performCrossfade]);

  const handleGenerate = async () => {
    await generateAutoMix(trackCount);
    setFeedbackGiven(false);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      currentAudioRef.current?.pause();
      setIsPlaying(false);
      musicContext?.pause?.();
    } else {
      if (currentAudioRef.current) {
        currentAudioRef.current.play().catch(() => {});
      } else {
        playTrackWithCrossfade(currentIndex);
      }
      setIsPlaying(true);
      musicContext?.play?.();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      playTrackWithCrossfade(newIndex);
      musicContext?.previous?.();
    }
  };

  const handleNext = () => {
    const tracks = activePlaylist?.generated_tracks;
    if (tracks && currentIndex < tracks.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      playTrackWithCrossfade(newIndex);
      musicContext?.next?.();
    }
  };

  const TimeIcon = context ? TimeIcons[context.timeContext as keyof typeof TimeIcons] || Sun : Sun;
  const WeatherIcon = context ? WeatherIcons[context.weatherContext as keyof typeof WeatherIcons] || Cloud : Cloud;

  return (
    <LazyMotionWrapper>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Contexte en temps réel */}
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Contexte Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent>
            {context ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg">
                  <TimeIcon className="h-8 w-8 text-orange-500" />
                  <span className="text-sm font-medium capitalize">{context.timeContext}</span>
                  <span className="text-xs text-muted-foreground">{new Date().getHours()}h</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg">
                  <WeatherIcon className="h-8 w-8 text-blue-500" />
                  <span className="text-sm font-medium capitalize">{context.weatherContext}</span>
                  <span className="text-xs text-muted-foreground">{context.temperature}°C</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg">
                  <span className="text-2xl">😌</span>
                  <span className="text-sm font-medium capitalize">{context.recommendedMood}</span>
                  <span className="text-xs text-muted-foreground">Humeur suggérée</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 bg-card/50 rounded-lg">
                  <span className="text-2xl">🎵</span>
                  <span className="text-sm font-medium">{context.recommendedTempo} BPM</span>
                  <span className="text-xs text-muted-foreground">Tempo optimal</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">Analyse du contexte...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Configuration AutoMix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Nombre de tracks: {trackCount}</Label>
              <Slider
                value={[trackCount]}
                onValueChange={(v) => setTrackCount(v[0])}
                min={5}
                max={10}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label>Durée crossfade: {crossfadeDuration}s</Label>
              <Slider
                value={[crossfadeDuration]}
                onValueChange={(v) => setCrossfadeDuration(v[0])}
                min={1}
                max={8}
                step={0.5}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="weather-sensitivity">Sensibilité météo</Label>
              <Switch
                id="weather-sensitivity"
                checked={weatherSensitivity}
                onCheckedChange={(checked) => {
                  setWeatherSensitivity(checked);
                  saveContextPreferences({ weather_sensitivity: checked });
                }}
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Shuffle className="h-5 w-5 mr-2" />
                  Générer AutoMix Intelligent
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Player */}
        {activePlaylist && (
          <Card>
            <CardHeader>
              <CardTitle>{activePlaylist.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {activePlaylist.generated_tracks?.length || 0} tracks • Crossfade {crossfadeDuration}s
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Button 
                  size="icon" 
                  variant="outline" 
                  aria-label="Piste précédente"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  className="w-16 h-16 rounded-full"
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? 'Mettre en pause' : 'Lire'}
                >
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </Button>
                <Button 
                  size="icon" 
                  variant="outline" 
                  aria-label="Piste suivante"
                  onClick={handleNext}
                  disabled={!activePlaylist?.generated_tracks || currentIndex >= activePlaylist.generated_tracks.length - 1}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
                <Button 
                  size="icon" 
                  variant="outline"
                  onClick={() => setShowShareModal(true)}
                  className="ml-2"
                  aria-label="Partager la playlist"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Track {currentIndex + 1}/{activePlaylist.generated_tracks?.length || 0}</span>
                  <Badge variant="secondary">Crossfade {crossfadeDuration}s</Badge>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <m.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / (activePlaylist.generated_tracks?.length || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feedback Section */}
        {activePlaylist && !feedbackGiven && (
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="bg-card/95 backdrop-blur-lg border-primary/20 shadow-xl">
              <CardContent className="p-4">
                <p className="text-sm mb-3 font-medium">Comment trouvez-vous cette playlist ?</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={async () => {
                      await submitFeedback(activePlaylist.id, 1);
                      setFeedbackGiven(true);
                    }}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    J'adore
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={async () => {
                      await submitFeedback(activePlaylist.id, -1);
                      setFeedbackGiven(true);
                    }}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Pas mon style
                  </Button>
                </div>
              </CardContent>
            </Card>
          </m.div>
        )}

        {/* Modal de partage */}
        {activePlaylist && (
          <PlaylistShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            playlistId={activePlaylist.id}
            playlistName={activePlaylist.name}
          />
        )}
      </div>
    </LazyMotionWrapper>
  );
};
