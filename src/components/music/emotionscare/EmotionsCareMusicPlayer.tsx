// @ts-nocheck
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Shuffle, Heart, Download, Share2, Music
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

interface EmotionsCareMusicPlayerProps {
  className?: string;
  compact?: boolean;
  showPlaylist?: boolean;
}

const EmotionsCareMusicPlayer: React.FC<EmotionsCareMusicPlayerProps> = ({
  className,
  compact = false,
  showPlaylist = true,
}) => {
  const {
    state,
    playTrack,
    pause,
    resume,
    stop,
    selectTrack,
    setVolume,
    toggleMute,
    setRepeat,
    toggleShuffle,
    formatTime,
    getProgressPercentage
  } = useEmotionsCareMusicContext();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isUserSeeking, setIsUserSeeking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Audio control effects
  useEffect(() => {
    if (audioRef.current && state.currentTrack) {
      if (state.isPlaying) {
        audioRef.current.play().catch(error => logger.error('Audio play error:', error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [state.isPlaying, state.currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? 0 : state.volume;
    }
  }, [state.volume, state.isMuted]);

  const handlePlayPause = () => {
    if (state.isPlaying) {
      pause();
    } else {
      resume();
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current && state.duration > 0) {
      const newTime = (value[0] / 100) * state.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  if (!state.currentTrack && !state.currentPlaylist) {
    return (
      <Card className={cn("border-2", className)}>
        <CardContent className="p-8 text-center">
          <Music className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="font-medium mb-2">Aucune musique</h3>
          <p className="text-sm text-muted-foreground">
            Effectuez une analyse émotionnelle pour générer votre playlist personnalisée
          </p>
        </CardContent>
      </Card>
    );
  }

  const CompactPlayer = () => (
    <div className={cn("flex items-center gap-4 p-4 bg-card rounded-lg border", className)}>
      {state.currentTrack && (
        <>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Music className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{state.currentTrack.title}</h4>
            <p className="text-sm text-muted-foreground truncate">{state.currentTrack.artist}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => selectTrack('prev')}>
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handlePlayPause}>
              {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => selectTrack('next')}>
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );

  if (compact) {
    return <CompactPlayer />;
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Hidden Audio Element */}
      {state.currentTrack && (
        <audio
          ref={audioRef}
          src={state.currentTrack.url}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              // Update duration in state would go here
            }
          }}
          onTimeUpdate={() => {
            if (audioRef.current && !isUserSeeking) {
              // Update current time in state would go here
            }
          }}
          onEnded={() => {
            // Handle track end based on repeat/shuffle settings
            if (state.repeat === 'one') {
              audioRef.current?.play();
            } else {
              selectTrack('next');
            }
          }}
        />
      )}

      {/* Main Player */}
      <Card className="border-2 bg-gradient-to-br from-card to-card/95">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Music className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {state.currentTrack?.title || 'Aucun titre'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {state.currentTrack?.artist || 'Artiste inconnu'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {state.currentTrack?.emotion || 'Neutre'}
                  </Badge>
                  {state.currentTrack?.isGenerated && (
                    <Badge variant="outline" className="text-xs">
                      IA Générée
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={cn("w-4 h-4", isFavorite && "fill-red-500 text-red-500")} />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[getProgressPercentage()]}
              onValueChange={handleProgressChange}
              max={100}
              step={0.1}
              className="w-full"
              onValueCommit={() => setIsUserSeeking(false)}
              onPointerDown={() => setIsUserSeeking(true)}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(state.currentTime)}</span>
              <span>{formatTime(state.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleShuffle}
              className={cn(state.shuffle && "text-primary")}
            >
              <Shuffle className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => selectTrack('prev')}>
              <SkipBack className="w-5 h-5" />
            </Button>
            
            <Button
              size="lg"
              onClick={handlePlayPause}
              disabled={state.isLoading}
              className="w-14 h-14 rounded-full"
            >
              {state.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => selectTrack('next')}>
              <SkipForward className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRepeat(state.repeat === 'none' ? 'all' : state.repeat === 'all' ? 'one' : 'none')}
              className={cn(state.repeat !== 'none' && "text-primary")}
            >
              <Repeat className="w-4 h-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleMute}>
              {state.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            <Slider
              value={[state.isMuted ? 0 : state.volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Playlist */}
      {showPlaylist && state.currentPlaylist && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              {state.currentPlaylist.name}
              <Badge variant="outline" className="ml-auto">
                {state.currentPlaylist.tracks.length} titres
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.currentPlaylist.tracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => selectTrack(track.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
                    state.currentTrack?.id === track.id && "bg-primary/10 border border-primary/20"
                  )}
                >
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-sm font-medium">
                    {state.currentTrack?.id === track.id && state.isPlaying ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(track.duration)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmotionsCareMusicPlayer;