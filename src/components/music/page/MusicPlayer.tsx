
import React, { useState, useRef, useEffect } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types';
import MusicControls from './MusicControls';

interface MusicPlayerProps {
  tracks: MusicTrack[];
  autoPlay?: boolean;
  initialTrack?: MusicTrack;
  onTrackChange?: (track: MusicTrack) => void;
  onPlay?: () => void;
  onPause?: () => void;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  tracks = [],
  autoPlay = false,
  initialTrack,
  onTrackChange,
  onPlay,
  onPause
}) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(initialTrack || (tracks.length > 0 ? tracks[0] : null));
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (initialTrack) {
      setCurrentTrack(initialTrack);
    }
  }, [initialTrack]);
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleEnded = () => {
      handleNext();
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);
  
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    
    const audio = audioRef.current;
    
    if (isPlaying) {
      audio.play().catch(err => console.error('Error playing audio:', err));
      onPlay && onPlay();
    } else {
      audio.pause();
      onPause && onPause();
    }
  }, [isPlaying, currentTrack, onPlay, onPause]);
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);
  
  const getCurrentTrackUrl = () => {
    if (!currentTrack) return '';
    return currentTrack.track_url || currentTrack.audioUrl || currentTrack.url || '';
  };
  
  const getCurrentTrackCover = () => {
    if (!currentTrack) return '';
    return currentTrack.cover_url || '';
  };
  
  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  const handlePrevious = () => {
    if (!currentTrack || tracks.length <= 1) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
    const prevTrack = tracks[prevIndex];
    
    setCurrentTrack(prevTrack);
    onTrackChange && onTrackChange(prevTrack);
  };
  
  const handleNext = () => {
    if (!currentTrack || tracks.length <= 1) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = currentIndex >= tracks.length - 1 ? 0 : currentIndex + 1;
    const nextTrack = tracks[nextIndex];
    
    setCurrentTrack(nextTrack);
    onTrackChange && onTrackChange(nextTrack);
  };
  
  const handleSeek = (value: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };
  
  const handleVolumeChange = (value: number) => {
    setVolume(value);
    setIsMuted(value === 0);
  };
  
  const handleToggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  return (
    <>
      <audio
        ref={audioRef}
        src={getCurrentTrackUrl()}
        preload="metadata"
        style={{ display: 'none' }}
      />
      
      <MusicControls
        isPlaying={isPlaying}
        currentTrack={currentTrack}
        onTogglePlay={handleTogglePlay}
        onPrevious={handlePrevious}
        onNext={handleNext}
        currentTime={currentTime}
        duration={duration || (currentTrack?.duration || 0)}
        onSeek={handleSeek}
        volume={volume}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onVolumeChange={handleVolumeChange}
      />
    </>
  );
};

export default MusicPlayer;
