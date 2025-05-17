
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AudioTrack, AudioPlaylist, EmotionMusicParams } from '@/types/audio';

interface MusicContextType {
  // État
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  playlist: AudioPlaylist | null;
  volume: number;
  currentTime: number;
  duration: number;
  loading: boolean;
  openDrawer: boolean;
  
  // Contrôles
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  
  // Playlist
  loadPlaylist: (playlist: AudioPlaylist) => void;
  loadPlaylistForEmotion: (params: EmotionMusicParams) => Promise<AudioPlaylist | null>;
  
  // UI
  setOpenDrawer: (open: boolean) => void;
  setEmotion: (emotion: string) => void;
}

const initialContext: MusicContextType = {
  isPlaying: false,
  currentTrack: null,
  playlist: null,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  loading: false,
  openDrawer: false,
  playTrack: () => {},
  pauseTrack: () => {},
  togglePlay: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  setVolume: () => {},
  seekTo: () => {},
  loadPlaylist: () => {},
  loadPlaylistForEmotion: async () => null,
  setOpenDrawer: () => {},
  setEmotion: () => {}
};

export const MusicContext = createContext<MusicContextType>(initialContext);

export const useMusic = () => useContext(MusicContext);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [audio] = useState<HTMLAudioElement | null>(() => 
    typeof window !== 'undefined' ? new Audio() : null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [playlist, setPlaylist] = useState<AudioPlaylist | null>(null);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  
  // Initialisation de l'audio
  useEffect(() => {
    if (!audio) return;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();
    const handleCanPlay = () => setLoading(false);
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('canplay', handleCanPlay);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audio]);
  
  // Gestion du volume
  useEffect(() => {
    if (audio) {
      audio.volume = volume;
    }
  }, [audio, volume]);
  
  // Fonction pour jouer une piste
  const playTrack = (track: AudioTrack) => {
    if (!audio) return;
    
    setLoading(true);
    setCurrentTrack(track);
    
    // Utiliser l'URL audio principale ou l'URL de backup
    const audioUrl = track.audioUrl || track.url;
    
    // Si la piste est déjà chargée mais pas en lecture
    if (audio.src === audioUrl && audio.paused) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erreur lors de la lecture audio:', error);
          setLoading(false);
        });
      return;
    }
    
    // Charger et jouer la nouvelle piste
    audio.src = audioUrl;
    audio.load();
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch(error => {
        console.error('Erreur lors de la lecture audio:', error);
        setLoading(false);
      });
  };
  
  // Fonction pour mettre en pause
  const pauseTrack = () => {
    if (audio && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };
  
  // Fonction pour basculer lecture/pause
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };
  
  // Fonction pour passer à la piste suivante
  const nextTrack = () => {
    if (!playlist || !currentTrack || playlist.tracks.length === 0) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    const nextIndex = (currentIndex + 1) % playlist.tracks.length;
    playTrack(playlist.tracks[nextIndex]);
  };
  
  // Fonction pour revenir à la piste précédente
  const prevTrack = () => {
    if (!playlist || !currentTrack || playlist.tracks.length === 0) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    const prevIndex = (currentIndex - 1 + playlist.tracks.length) % playlist.tracks.length;
    playTrack(playlist.tracks[prevIndex]);
  };
  
  // Fonction pour définir le volume
  const handleSetVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  };
  
  // Fonction pour se déplacer dans la piste
  const seekTo = (time: number) => {
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  // Fonction pour charger une playlist
  const loadPlaylist = (newPlaylist: AudioPlaylist) => {
    setPlaylist(newPlaylist);
    if (newPlaylist.tracks && newPlaylist.tracks.length > 0) {
      playTrack(newPlaylist.tracks[0]);
    }
  };
  
  // Fonction pour charger une playlist basée sur une émotion
  const loadPlaylistForEmotion = async (params: EmotionMusicParams): Promise<AudioPlaylist | null> => {
    try {
      setCurrentEmotion(params.emotion);
      setLoading(true);
      
      // Simuler un chargement de playlist (à remplacer par un vrai appel API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Créer une playlist simulée basée sur l'émotion
      const emotionPlaylist: AudioPlaylist = {
        id: `emotion-${params.emotion}-${Date.now()}`,
        name: `${params.emotion.charAt(0).toUpperCase() + params.emotion.slice(1)} Music`,
        description: `Music tailored to your ${params.emotion} mood`,
        emotion: params.emotion,
        coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D',
        tracks: Array(5).fill(0).map((_, i) => ({
          id: `${params.emotion}-track-${i}`,
          title: `${params.emotion.charAt(0).toUpperCase() + params.emotion.slice(1)} Track ${i+1}`,
          artist: 'AI Music Generator',
          duration: 180 + Math.floor(Math.random() * 120),
          url: `/audio/${params.emotion}-${i+1}.mp3`,
          coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8fDA%3D',
          category: 'emotion-based',
          mood: params.emotion,
          tags: [params.emotion, 'generated', 'mood-music']
        }))
      };
      
      setLoading(false);
      setPlaylist(emotionPlaylist);
      
      return emotionPlaylist;
    } catch (error) {
      console.error('Error loading playlist for emotion:', error);
      setLoading(false);
      return null;
    }
  };
  
  // Nettoyage à la destruction du composant
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audio]);
  
  const value = {
    isPlaying,
    currentTrack,
    playlist,
    volume,
    currentTime,
    duration,
    loading,
    openDrawer,
    playTrack,
    pauseTrack,
    togglePlay,
    nextTrack,
    prevTrack,
    setVolume: handleSetVolume,
    seekTo,
    loadPlaylist,
    loadPlaylistForEmotion,
    setOpenDrawer,
    setEmotion: setCurrentEmotion
  };
  
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
