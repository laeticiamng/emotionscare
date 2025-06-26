
import { useState, useEffect, useRef } from 'react';
import { MusicTrack } from '@/types/music';

export const useMusicControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Créer l'élément audio uniquement côté client
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      
      const audio = audioRef.current;
      
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleLoadedMetadata = () => setDuration(audio.duration);
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, []);

  const play = (track?: MusicTrack) => {
    if (!audioRef.current) return;
    
    if (track && track !== currentTrack) {
      setCurrentTrack(track);
      audioRef.current.src = track.url || track.audioUrl || '';
      audioRef.current.load();
    }
    
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(error => {
        console.error('Erreur lecture audio:', error);
        // Créer un fichier audio de démonstration
        if (currentTrack) {
          console.log(`Lecture simulée: ${currentTrack.title}`);
          setIsPlaying(true);
        }
      });
  };

  const pause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const seek = (time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const setVolumeLevel = (newVolume: number) => {
    const vol = Math.max(0, Math.min(1, newVolume));
    setVolume(vol);
    setIsMuted(vol === 0);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolumeLevel(0.7);
    } else {
      setVolumeLevel(0);
    }
  };

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    currentTrack,
    play,
    pause,
    seek,
    setVolume: setVolumeLevel,
    toggleMute
  };
};
