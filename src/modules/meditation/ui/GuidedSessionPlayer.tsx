/**
 * Lecteur de session guidée avec audio
 */
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, 
  VolumeX, RotateCcw, X, Maximize2, Minimize2 
} from 'lucide-react';
import { techniqueLables, type MeditationTechnique } from '../types';

interface GuidedSession {
  id: string;
  title: string;
  technique: MeditationTechnique;
  duration: number; // seconds
  audioUrl?: string;
  instructor?: string;
  description?: string;
}

interface GuidedSessionPlayerProps {
  session: GuidedSession;
  onComplete: (completedDuration: number) => void;
  onClose: () => void;
}

const SAMPLE_AUDIO_URLS: Record<MeditationTechnique, string> = {
  'mindfulness': 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
  'body-scan': 'https://cdn.pixabay.com/audio/2021/04/06/audio_63aa86e805.mp3',
  'loving-kindness': 'https://cdn.pixabay.com/audio/2022/08/31/audio_419263eb88.mp3',
  'breath-focus': 'https://cdn.pixabay.com/audio/2021/08/04/audio_d4a93f5d68.mp3',
  'visualization': 'https://cdn.pixabay.com/audio/2022/01/20/audio_d8d0eff93e.mp3',
  'mantra': 'https://cdn.pixabay.com/audio/2021/11/25/audio_91b32e02f9.mp3',
};

export const GuidedSessionPlayer: React.FC<GuidedSessionPlayerProps> = ({
  session,
  onComplete,
  onClose,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const audioUrl = session.audioUrl || SAMPLE_AUDIO_URLS[session.technique];
  const progress = (currentTime / session.duration) * 100;

  // Initialize audio
  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.addEventListener('loadeddata', () => setIsLoading(false));
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      onComplete(audio.duration);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl, onComplete]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (value[0] / 100) * session.duration;
    }
  };

  const skipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 15);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(
        session.duration,
        audioRef.current.currentTime + 15
      );
    }
  };

  const reset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className={`fixed z-50 ${
        isExpanded 
          ? 'inset-0 p-4' 
          : 'bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96'
      }`}
    >
      <Card className={`shadow-2xl border-primary/20 ${
        isExpanded ? 'h-full' : ''
      }`}>
        <CardContent className={`p-4 ${isExpanded ? 'h-full flex flex-col' : ''}`}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{session.title}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline" className="text-xs">
                  {techniqueLables[session.technique]}
                </Badge>
                {session.instructor && (
                  <span className="truncate">{session.instructor}</span>
                )}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsExpanded(!isExpanded)}
                aria-label={isExpanded ? 'Réduire' : 'Agrandir'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  if (audioRef.current) audioRef.current.pause();
                  onClose();
                }}
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Expanded content */}
          {isExpanded && session.description && (
            <div className="flex-1 overflow-auto mb-4">
              <p className="text-sm text-muted-foreground">{session.description}</p>
            </div>
          )}

          {/* Progress bar */}
          <div className="space-y-2 mb-4">
            <Slider
              value={[progress]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="cursor-pointer"
              aria-label="Progression"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(session.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={reset}
              aria-label="Recommencer"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={skipBack}
              aria-label="Reculer 15 secondes"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              size="lg"
              className="h-14 w-14 rounded-full"
              onClick={togglePlay}
              disabled={isLoading}
              aria-label={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={skipForward}
              aria-label="Avancer 15 secondes"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>

          {/* Volume slider */}
          <div className="flex items-center gap-3">
            <VolumeX className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              onValueChange={([v]) => setVolume(v)}
              max={100}
              className="flex-1"
              aria-label="Volume"
            />
            <Volume2 className="w-4 h-4 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GuidedSessionPlayer;
