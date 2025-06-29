
import { useState, useRef, useEffect } from 'react';
import { MusicTrack } from '@/types/music';
import { useToast } from '@/components/ui/use-toast';

export const useMusicControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialiser l'audio
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'metadata';
      
      // Configuration pour les URLs externes (Suno)
      audioRef.current.crossOrigin = 'anonymous';
      
      // Event listeners
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
        setIsLoading(false);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('❌ Audio error:', e);
        setIsLoading(false);
        setIsPlaying(false);
        toast({
          title: "Erreur de lecture",
          description: "Impossible de lire ce fichier audio",
          variant: "destructive"
        });
      });

      audioRef.current.addEventListener('canplay', () => {
        console.log('✅ Audio ready to play');
        setIsLoading(false);
      });

      audioRef.current.addEventListener('loadstart', () => {
        console.log('🔄 Audio loading started');
        setIsLoading(true);
      });
    }
  }, []);

  // Mettre à jour le volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const playTrack = async (track: MusicTrack) => {
    if (!audioRef.current) return;
    
    console.log('🎵 Playing track:', track);
    setIsLoading(true);
    
    try {
      // Si c'est une nouvelle piste
      if (!currentTrack || currentTrack.id !== track.id) {
        audioRef.current.src = track.url;
        setCurrentTrack(track);
        setCurrentTime(0);
        
        toast({
          title: "Chargement...",
          description: `Préparation de "${track.title}"`,
          duration: 2000
        });
      }
      
      await audioRef.current.play();
      setIsPlaying(true);
      
    } catch (error) {
      console.error('❌ Play error:', error);
      setIsLoading(false);
      setIsPlaying(false);
      
      toast({
        title: "Erreur de lecture",
        description: "Impossible de jouer cette piste",
        variant: "destructive"
      });
    }
  };

  const play = async () => {
    if (!audioRef.current || !currentTrack) return;
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('❌ Play error:', error);
      toast({
        title: "Erreur de lecture",
        description: "Impossible de reprendre la lecture",
        variant: "destructive"
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    currentTrack,
    isLoading,
    playTrack,
    play,
    pause,
    seek,
    setVolume,
    toggleMute
  };
};
