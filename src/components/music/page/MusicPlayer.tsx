import React, { useState, useRef, useEffect } from 'react';
import { MusicTrack } from '@/types/music';
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
  const [muted, setIsMuted] = useState(false);
  
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
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);
  
  const getCurrentTrackUrl = () => {
    if (!currentTrack) return '';
    return currentTrack.url;
  };
  
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  const playTrack = () => {
    if (!audioRef.current) return;
    audioRef.current.play().catch(err => console.error('Error playing audio:', err));
  };
  
  const pauseTrack = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  };
  
  const previousTrack = () => {
    if (!currentTrack || tracks.length <= 1) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex <= 0 ? tracks.length - 1 : currentIndex - 1;
    const prevTrack = tracks[prevIndex];
    
    setCurrentTrack(prevTrack);
    onTrackChange && onTrackChange(prevTrack);
  };
  
  const nextTrack = () => {
    if (!currentTrack || tracks.length <= 1) return;
    
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = currentIndex >= tracks.length - 1 ? 0 : currentIndex + 1;
    const nextTrack = tracks[nextIndex];
    
    setCurrentTrack(nextTrack);
    onTrackChange && onTrackChange(nextTrack);
  };
  
  const seekTo = (value: number) => {
    if (!audioRef.current) return;
    
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };
  
  const setVolume = (value: number) => {
    setVolume(value);
    setIsMuted(value === 0);
  };
  
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  if (tracks.length === 0 || !currentTrack) {
    return <div className="text-center text-muted-foreground p-4">No tracks available</div>;
  }
  
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
        onPlayPause={togglePlay}
        onPlay={playTrack}
        onPause={pauseTrack}
        onTogglePlay={togglePlay}
        onPrevious={previousTrack}
        onNext={nextTrack}
        currentTime={currentTime}
        duration={duration}
        onSeek={seekTo}
        volume={volume}
        isMuted={muted}
        onToggleMute={toggleMute}
        onVolumeChange={setVolume}
        track={currentTrack}
      />
    </>
  );
};

export default MusicPlayer;
