/**
 * 🎵 PLAYER MUSICAL EMOTIONSCARE PREMIUM
 * Composant de lecture musical unifié avec thérapie intelligente
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Heart, Brain, Loader2, Download, Share2, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useEmotionsCarePlatform } from '@/hooks/useEmotionsCarePlatform';
import { EmotionsCareTrack, TherapeuticSession } from '@/services/EmotionsCareUnifiedPlatform';
import { EmotionLabel, EMOTION_LABELS } from '@/types/unified-emotions';

interface EmotionsCareMusicPlayerProps {
  userId: string;
  currentTrack?: EmotionsCareTrack | null;
  session?: TherapeuticSession | null;
  onTrackEnd?: () => void;
  onSessionUpdate?: (session: TherapeuticSession) => void;
  className?: string;
}

export const EmotionsCareMusicPlayer: React.FC<EmotionsCareMusicPlayerProps> = ({
  userId,
  currentTrack: propTrack,
  session: propSession,
  onTrackEnd,
  onSessionUpdate,
  className = ""
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationRef = useRef<number>();
  
  const { 
    currentSession, 
    updateSessionProgress, 
    isLoading: platformLoading 
  } = useEmotionsCarePlatform(userId);

  const activeTrack = propTrack || currentSession?.currentTrack;
  const activeSession = propSession || currentSession;

  // Initialisation de l'audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      audioRef.current.preload = 'metadata';
    }

    const audio = audioRef.current;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
      
      // Mise à jour du progrès de session
      if (activeSession && audio.duration) {
        const trackProgress = (audio.currentTime / audio.duration) * 100;
        const sessionProgress = calculateSessionProgress(trackProgress);
        updateSessionProgress(sessionProgress);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onTrackEnd?.();
      handleNextTrack();
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      console.error('Erreur de lecture audio');
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', () => setIsLoading(false));
    audio.addEventListener('waiting', () => setIsLoading(true));

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', () => setIsLoading(false));
      audio.removeEventListener('waiting', () => setIsLoading(true));
    };
  }, [activeSession, updateSessionProgress, onTrackEnd]);

  // Chargement d'une nouvelle piste
  useEffect(() => {
    if (activeTrack && audioRef.current) {
      const audio = audioRef.current;
      
      if (audio.src !== activeTrack.audioUrl) {
        setIsLoading(true);
        audio.src = activeTrack.audioUrl;
        audio.load();
      }
    }
  }, [activeTrack]);

  // Calcul du progrès de session
  const calculateSessionProgress = useCallback((trackProgress: number): number => {
    if (!activeSession) return 0;
    
    const currentTrackIndex = activeSession.playlist.findIndex(
      t => t.id === activeTrack?.id
    );
    
    if (currentTrackIndex === -1) return 0;
    
    const baseProgress = (currentTrackIndex / activeSession.playlist.length) * 100;
    const trackContribution = (trackProgress / activeSession.playlist.length);
    
    return Math.min(100, baseProgress + trackContribution);
  }, [activeSession, activeTrack]);

  // Contrôles de lecture
  const togglePlayPause = useCallback(async () => {
    if (!audioRef.current || !activeTrack) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Erreur lecture:', error);
      setIsLoading(false);
    }
  }, [isPlaying, activeTrack]);

  const handleSeek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  const handleNextTrack = useCallback(() => {
    if (!activeSession) return;
    
    const currentIndex = activeSession.playlist.findIndex(t => t.id === activeTrack?.id);
    if (currentIndex < activeSession.playlist.length - 1) {
      const nextTrack = activeSession.playlist[currentIndex + 1];
      // Logique pour charger la piste suivante
      console.log('Piste suivante:', nextTrack.title);
    }
  }, [activeSession, activeTrack]);

  const handlePreviousTrack = useCallback(() => {
    if (!activeSession) return;
    
    const currentIndex = activeSession.playlist.findIndex(t => t.id === activeTrack?.id);
    if (currentIndex > 0) {
      const prevTrack = activeSession.playlist[currentIndex - 1];
      // Logique pour charger la piste précédente
      console.log('Piste précédente:', prevTrack.title);
    }
  }, [activeSession, activeTrack]);

  // Format du temps
  const formatTime = useCallback((seconds: number): string => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Calcul du progrès
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!activeTrack) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="text-center text-muted-foreground">
          <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucune piste sélectionnée</p>
          <p className="text-sm">Démarrez une session thérapeutique pour commencer</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`overflow-hidden ${className}`}>
      {/* Visualisation thérapeutique */}
      <AnimatePresence>
        {showVisualization && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 120, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4 border-b"
          >
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-primary rounded-full"
                    animate={{
                      height: isPlaying ? [10, 40, 20, 35, 15] : 10
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="p-6 space-y-6">
        {/* Informations de la piste */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Brain className="h-8 w-8 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{activeTrack.title}</h3>
            <p className="text-muted-foreground truncate">{activeTrack.artist}</p>
            
            <div className="flex items-center gap-2 mt-2">
              <Badge 
                variant="secondary"
                style={{ 
                  backgroundColor: `${EMOTION_LABELS[activeTrack.emotion]?.color}20`,
                  borderColor: EMOTION_LABELS[activeTrack.emotion]?.color 
                }}
              >
                {activeTrack.emotion}
              </Badge>
              <Badge variant="outline">
                Score thérapeutique: {activeTrack.therapeuticScore}/100
              </Badge>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVisualization(!showVisualization)}
              aria-label="Afficher/masquer la visualisation"
            >
              <Brain className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Partager la piste"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Paramètres"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progrès de lecture */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Contrôles principaux */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePreviousTrack}
            disabled={!activeSession || activeSession.playlist.findIndex(t => t.id === activeTrack?.id) === 0}
            aria-label="Piste précédente"
          >
            <SkipBack className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            onClick={togglePlayPause}
            disabled={isLoading || platformLoading}
            className="h-12 w-12"
            aria-label={isPlaying ? "Pause" : "Lecture"}
          >
            {isLoading || platformLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextTrack}
            disabled={!activeSession || activeSession.playlist.findIndex(t => t.id === activeTrack?.id) === activeSession.playlist.length - 1}
            aria-label="Piste suivante"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        {/* Volume et session */}
        <div className="flex items-center justify-between">
          {/* Contrôle volume */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              aria-label={isMuted ? "Activer le son" : "Couper le son"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              onValueChange={([value]) => handleVolumeChange(value)}
              max={1}
              step={0.1}
              className="w-24"
              aria-label="Contrôle du volume"
            />
          </div>

          {/* Informations session */}
          {activeSession && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4" />
              <span>Session: {Math.round(activeSession.progress)}%</span>
            </div>
          )}
        </div>

        {/* Progrès de session thérapeutique */}
        {activeSession && (
          <div className="space-y-2 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progrès thérapeutique</span>
              <span className="text-muted-foreground">
                {activeSession.startEmotion} → {activeSession.targetEmotion}
              </span>
            </div>
            <Progress value={activeSession.progress} className="h-2 bg-gradient-to-r from-primary/20 to-secondary/20" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Piste {(activeSession.playlist.findIndex(t => t.id === activeTrack?.id) + 1) || 1} sur {activeSession.playlist.length}</span>
              <span>{Math.round(activeSession.duration - (activeSession.progress * activeSession.duration / 100))} min restantes</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};