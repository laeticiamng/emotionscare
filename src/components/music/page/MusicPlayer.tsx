
import React, { useEffect, useRef, useState } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { getTrackUrl, getTrackCover, getTrackTitle, getTrackArtist } from '@/utils/musicCompatibility';
import { formatTime } from '@/utils/formatTime';

const MusicPlayer: React.FC = () => {
  const music = useMusic();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [loading, setLoading] = useState(false);

  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    volume = 0.8,
    setVolume,
    currentTime = 0,
    setCurrentTime,
    duration = 0,
    setDuration,
    muted = false,
    seekTo,
    toggleMute
  } = music;

  // Gérer le chargement audio
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      setLoading(true);
      
      const audioElement = audioRef.current;
      const trackUrl = getTrackUrl(currentTrack);
      
      audioElement.src = trackUrl;
      audioElement.volume = volume;
      audioElement.muted = muted;
      
      if (isPlaying) {
        const playPromise = audioElement.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setLoading(false);
            })
            .catch(error => {
              console.error('Playback error:', error);
              setLoading(false);
              setIsPlaying(false);
            });
        }
      } else {
        audioElement.pause();
        setLoading(false);
      }
    }
  }, [currentTrack, isPlaying, setIsPlaying, volume, muted]);

  // Mettre à jour les contrôles audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = muted;
    }
  }, [volume, muted]);

  // Handlers
  const handlePlayPause = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.error('Playback failed', e));
    }
    
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && setCurrentTime) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current && setDuration) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current && seekTo) {
      const time = value[0];
      audioRef.current.currentTime = time;
      seekTo(time);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current && setVolume) {
      const vol = value[0];
      audioRef.current.volume = vol;
      setVolume(vol);
    }
  };

  const handleToggleMute = () => {
    if (audioRef.current && toggleMute) {
      audioRef.current.muted = !muted;
      toggleMute();
    }
  };

  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center p-4 text-muted-foreground">
        Aucune piste sélectionnée
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onEnded={() => music.nextTrack && music.nextTrack()}
      />
      
      <div className="flex items-center mb-4 space-x-4">
        <div className="w-16 h-16 rounded-md overflow-hidden">
          <img 
            src={getTrackCover(currentTrack) || '/images/covers/placeholder.jpg'} 
            alt={getTrackTitle(currentTrack)}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium">{getTrackTitle(currentTrack)}</h3>
          <p className="text-sm text-muted-foreground">{getTrackArtist(currentTrack)}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center mb-1 text-xs justify-between">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleSeek}
          className="cursor-pointer"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => music.previousTrack && music.previousTrack()}
            disabled={!music.previousTrack}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="default" 
            size="icon"
            onClick={handlePlayPause}
            disabled={loading}
          >
            {loading ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => music.nextTrack && music.nextTrack()}
            disabled={!music.nextTrack}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2 w-32">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleToggleMute}
            disabled={!toggleMute}
          >
            {muted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <Slider 
            value={[volume]} 
            max={1} 
            step={0.01} 
            onValueChange={handleVolumeChange}
            disabled={!setVolume}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
