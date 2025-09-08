/**
 * 🎵 MUSICOTHÉRAPIE UNIFIÉE PREMIUM
 * Génération Suno AI + Recommandations intelligentes + Thérapie adaptative
 * Architecture premium avec sessions personnalisées
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX,
  Heart,
  Brain,
  Sparkles,
  RefreshCw,
  Download,
  Share,
  Headphones,
  Radio,
  ListMusic,
  Timer,
  Activity,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { unifiedMusicService, UnifiedMusicTrack, MusicPlaylist, MusicTherapySession } from '@/services/UnifiedMusicService';
import { UnifiedEmotionAnalysis, EmotionLabel } from '@/types/unified-emotions';

interface UnifiedMusicTherapyProps {
  currentEmotion?: EmotionLabel;
  targetEmotion?: EmotionLabel;
  emotionAnalysis?: UnifiedEmotionAnalysis;
  onTrackChange?: (track: UnifiedMusicTrack) => void;
  onSessionComplete?: (session: MusicTherapySession) => void;
  className?: string;
  mode?: 'therapy' | 'relaxation' | 'focus' | 'creative';
}

export const UnifiedMusicTherapy: React.FC<UnifiedMusicTherapyProps> = ({
  currentEmotion = 'contentment',
  targetEmotion,
  emotionAnalysis,
  onTrackChange,
  onSessionComplete,
  className = '',
  mode = 'therapy'
}) => {
  // États principaux
  const [currentTrack, setCurrentTrack] = useState<UnifiedMusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession, setCurrentSession] = useState<MusicTherapySession | null>(null);
  const [error, setError] = useState<string | null>(null);

  // États audio
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trackIndex, setTrackIndex] = useState(0);

  // États génération
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationQueue, setGenerationQueue] = useState<string[]>([]);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const sessionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Configuration des modes thérapeutiques
  const therapyModes = {
    therapy: {
      title: 'Thérapie Émotionnelle',
      description: 'Musique adaptée pour régulation émotionnelle',
      icon: Heart,
      color: 'from-pink-500 to-rose-500'
    },
    relaxation: {
      title: 'Relaxation Profonde',
      description: 'Sons apaisants pour détente complète',
      icon: Brain,
      color: 'from-blue-500 to-indigo-500'
    },
    focus: {
      title: 'Concentration',
      description: 'Ambiances pour productivité optimale',
      icon: Zap,
      color: 'from-purple-500 to-violet-500'
    },
    creative: {
      title: 'Créativité',
      description: 'Stimulation pour inspiration artistique',
      icon: Sparkles,
      color: 'from-orange-500 to-yellow-500'
    }
  };

  // Initialisation audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => playNextTrack();
    const handleError = () => setError('Erreur de lecture audio');

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Gestion du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  // Génération de playlist personnalisée
  const generatePersonalizedPlaylist = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const config = {
        currentEmotion,
        targetEmotion: targetEmotion || 'contentment',
        mode,
        duration: 15, // 15 minutes par défaut
        intensity: emotionAnalysis?.emotionVector.arousal || 0.5,
        complexity: 'medium' as const,
        includeBinaural: mode === 'relaxation' || mode === 'focus',
        includeNatureSounds: mode === 'relaxation'
      };

      const generatedPlaylist = await unifiedMusicService.generateAdaptivePlaylist(config);
      setPlaylist(generatedPlaylist);
      
      if (generatedPlaylist.tracks.length > 0) {
        setCurrentTrack(generatedPlaylist.tracks[0]);
        setTrackIndex(0);
      }

    } catch (error) {
      setError('Erreur lors de la génération de la playlist');
      console.error('Playlist generation error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentEmotion, targetEmotion, mode, emotionAnalysis]);

  // Génération de piste unique Suno
  const generateSunoTrack = useCallback(async () => {
    try {
      setIsGenerating(true);
      setGenerationProgress(0);
      setError(null);

      // Simulation de progression
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const prompt = `Create a ${mode} music track for ${currentEmotion} to ${targetEmotion || 'balanced'} emotional transition. Style: ambient, therapeutic, calming.`;
      
      const track = await unifiedMusicService.generateSunoTrack({
        prompt,
        emotion: currentEmotion,
        duration: 180, // 3 minutes
        style: mode === 'relaxation' ? 'ambient' : mode === 'focus' ? 'minimal' : 'therapeutic',
        includeVocals: false
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (track) {
        setCurrentTrack(track);
        // Ajouter à la playlist existante ou créer nouvelle
        if (playlist) {
          const updatedPlaylist = {
            ...playlist,
            tracks: [...playlist.tracks, track]
          };
          setPlaylist(updatedPlaylist);
        }
      }

    } catch (error) {
      setError('Erreur lors de la génération Suno');
      console.error('Suno generation error:', error);
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  }, [currentEmotion, targetEmotion, mode, playlist]);

  // Démarrage de session thérapeutique
  const startTherapySession = useCallback(async () => {
    try {
      if (!currentTrack && !playlist) {
        await generatePersonalizedPlaylist();
        return;
      }

      const session = await unifiedMusicService.startTherapySession({
        userId: 'current_user', // À remplacer par l'ID utilisateur réel
        currentEmotion,
        targetEmotion: targetEmotion || 'contentment',
        playlist: playlist!,
        sessionDuration: 900000, // 15 minutes
        therapyGoals: [`Transition from ${currentEmotion} to ${targetEmotion || 'balanced state'}`]
      });

      setCurrentSession(session);
      setIsPlaying(true);
      
      if (audioRef.current && currentTrack?.url) {
        audioRef.current.play();
      }

      // Timer de session
      sessionTimerRef.current = setInterval(() => {
        if (currentSession) {
          const elapsed = Date.now() - new Date(currentSession.startTime).getTime();
          const progress = Math.min(elapsed / currentSession.sessionDuration, 1);
          
          // Mise à jour des checkpoints émotionnels
          // Logic pour évaluer l'état émotionnel périodiquement
        }
      }, 30000); // Toutes les 30 secondes

    } catch (error) {
      setError('Erreur lors du démarrage de la session');
      console.error('Session start error:', error);
    }
  }, [currentTrack, playlist, currentEmotion, targetEmotion, generatePersonalizedPlaylist]);

  // Contrôles de lecture
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const playNextTrack = useCallback(() => {
    if (!playlist || trackIndex >= playlist.tracks.length - 1) return;

    const nextIndex = trackIndex + 1;
    setTrackIndex(nextIndex);
    setCurrentTrack(playlist.tracks[nextIndex]);
    onTrackChange?.(playlist.tracks[nextIndex]);
  }, [playlist, trackIndex, onTrackChange]);

  const playPreviousTrack = useCallback(() => {
    if (!playlist || trackIndex <= 0) return;

    const prevIndex = trackIndex - 1;
    setTrackIndex(prevIndex);
    setCurrentTrack(playlist.tracks[prevIndex]);
    onTrackChange?.(playlist.tracks[prevIndex]);
  }, [playlist, trackIndex, onTrackChange]);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
      }
    };
  }, []);

  // Interface de contrôle audio
  const renderAudioControls = () => (
    <Card>
      <CardContent className="p-6">
        {/* Informations piste actuelle */}
        {currentTrack && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${therapyModes[mode].color}`}>
                <Music className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{currentTrack.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentTrack.genre} • {Math.round(currentTrack.duration / 60)}min
                </p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {currentTrack.emotion}
              </Badge>
            </div>

            {/* Barre de progression */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}</span>
                <span>{Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}</span>
              </div>
              <Progress value={(currentTime / duration) * 100} className="h-2" />
            </div>

            {/* Contrôles principaux */}
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={playPreviousTrack}
                disabled={!playlist || trackIndex <= 0}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                size="lg"
                onClick={togglePlayPause}
                disabled={!currentTrack}
                className="h-12 w-12 rounded-full"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={playNextTrack}
                disabled={!playlist || trackIndex >= playlist.tracks.length - 1}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Contrôles volume */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[volume]}
                onValueChange={(value) => setVolume(value[0])}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground w-8">{volume}%</span>
            </div>
          </div>
        )}

        {/* État sans piste */}
        {!currentTrack && (
          <div className="text-center py-8">
            <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Aucune piste sélectionnée</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Générez une playlist personnalisée pour commencer
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Interface de génération
  const renderGenerationControls = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>Génération IA</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            onClick={generatePersonalizedPlaylist}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <ListMusic className="h-4 w-4" />}
            <span>Playlist Adaptive</span>
          </Button>

          <Button
            onClick={generateSunoTrack}
            disabled={isGenerating}
            variant="outline"
            className="flex items-center space-x-2"
          >
            {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Music className="h-4 w-4" />}
            <span>Piste Suno</span>
          </Button>
        </div>

        {/* Progression génération */}
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Génération Suno en cours...</span>
              <span>{generationProgress}%</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
          </div>
        )}

        {/* Configuration rapide */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(therapyModes).map(([key, config]) => (
            <Button
              key={key}
              variant={mode === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => {/* Changer mode */}}
              className="flex items-center space-x-2"
            >
              <config.icon className="h-3 w-3" />
              <span className="text-xs">{config.title}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Session en cours
  const renderCurrentSession = () => {
    if (!currentSession) return null;

    const elapsed = Date.now() - new Date(currentSession.startTime).getTime();
    const progress = Math.min(elapsed / currentSession.sessionDuration, 1);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Timer className="h-5 w-5 text-primary" />
            <span>Session Thérapeutique</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Objectif</div>
              <div className="font-medium capitalize">
                {currentSession.currentEmotion} → {currentSession.targetEmotion}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Progression</div>
              <div className="font-medium">{Math.round(progress * 100)}%</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Temps écoulé</span>
              <span>{Math.floor(elapsed / 60000)}min</span>
            </div>
            <Progress value={progress * 100} className="h-2" />
          </div>

          {currentSession.therapyGoals.length > 0 && (
            <div>
              <div className="text-sm text-muted-foreground mb-2">Objectifs</div>
              <ul className="space-y-1">
                {currentSession.therapyGoals.map((goal, i) => (
                  <li key={i} className="text-sm flex items-center space-x-2">
                    <Activity className="h-3 w-3 text-primary" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        preload="metadata"
        className="hidden"
      />

      {/* Interface principale */}
      <Tabs defaultValue="player" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="player">Lecteur</TabsTrigger>
          <TabsTrigger value="generate">Générer</TabsTrigger>
          <TabsTrigger value="playlist">Playlist</TabsTrigger>
          <TabsTrigger value="session">Session</TabsTrigger>
        </TabsList>

        <TabsContent value="player" className="space-y-4">
          {renderAudioControls()}
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          {renderGenerationControls()}
        </TabsContent>

        <TabsContent value="playlist" className="space-y-4">
          {playlist && (
            <Card>
              <CardHeader>
                <CardTitle>{playlist.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{playlist.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {playlist.tracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                        index === trackIndex ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
                      }`}
                      onClick={() => {
                        setTrackIndex(index);
                        setCurrentTrack(track);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{track.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {Math.round(track.duration / 60)}min • {track.genre}
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {track.emotion}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="session" className="space-y-4">
          {!currentSession ? (
            <Card>
              <CardContent className="text-center py-8">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Démarrer une Session</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Créez une session thérapeutique personnalisée
                </p>
                <Button onClick={startTherapySession}>
                  Commencer la Thérapie
                </Button>
              </CardContent>
            </Card>
          ) : (
            renderCurrentSession()
          )}
        </TabsContent>
      </Tabs>

      {/* Erreurs */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default UnifiedMusicTherapy;