
import React, { useState, useEffect, createContext, ReactNode } from 'react';
import MusicContext from '@/contexts/MusicContext';
import { MusicTrack, MusicPlaylist, EmotionMusicParams, MusicContextType } from '@/types/music';
import { mockMusicPlaylists, mockMusicTracks } from '@/data/mockMusic';

interface MusicProviderProps {
  children: ReactNode;
}

const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<MusicTrack[]>([]);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  
  // Initialiser l'élément audio
  useEffect(() => {
    const audio = new Audio();
    setAudioElement(audio);
    
    // Configurer les événements audio
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener('ended', () => {
      nextTrack();
    });
    
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, []);
  
  // Mettre à jour l'état lorsque la piste actuelle change
  useEffect(() => {
    if (!currentTrack || !audioElement) return;
    
    audioElement.src = currentTrack.url || '';
    
    if (isPlaying) {
      audioElement.play().catch(err => {
        console.error('Error playing audio:', err);
        setError(new Error('Impossible de lire la piste audio'));
      });
    }
  }, [currentTrack, audioElement]);
  
  // Mettre à jour l'état lorsque isPlaying change
  useEffect(() => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.play().catch(err => {
        console.error('Error playing audio:', err);
      });
    } else {
      audioElement.pause();
    }
  }, [isPlaying, audioElement]);
  
  // Mettre à jour le volume
  useEffect(() => {
    if (!audioElement) return;
    audioElement.volume = isMuted ? 0 : volume;
  }, [volume, isMuted, audioElement]);
  
  // Initialiser le système musical
  useEffect(() => {
    setIsInitialized(true);
    
    // Précharger des recommandations musicales
    setRecommendations(
      mockMusicTracks.filter(track => track.emotion === 'calm').slice(0, 5)
    );
    
  }, []);
  
  // Fonction pour jouer une piste
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  // Fonction pour mettre en pause
  const pauseTrack = () => {
    setIsPlaying(false);
  };
  
  // Fonction pour reprendre la lecture
  const resumeTrack = () => {
    setIsPlaying(true);
  };
  
  // Fonction pour basculer entre lecture et pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Fonction pour passer à la piste suivante
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    
    if (currentIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentIndex + 1]);
    } else if (playlist.tracks.length > 0) {
      // Revenir au début de la playlist
      playTrack(playlist.tracks[0]);
    }
  };
  
  // Fonction pour passer à la piste précédente
  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    
    if (currentIndex > 0) {
      playTrack(playlist.tracks[currentIndex - 1]);
    } else if (playlist.tracks.length > 0) {
      // Aller à la dernière piste de la playlist
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    }
  };
  
  // Fonction pour régler le volume
  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };
  
  // Fonction pour couper/activer le son
  const toggleMute = () => {
    setIsMuted(!isMuted);
    setMuted(!muted);
  };
  
  // Fonction pour chercher une position dans la piste
  const seekTo = (time: number) => {
    if (!audioElement) return;
    
    audioElement.currentTime = time;
    setCurrentTime(time);
  };
  
  // Fonction pour définir l'émotion actuelle
  const setEmotion = (emotion: string) => {
    setCurrentEmotion(emotion);
  };
  
  // Fonction pour charger une playlist basée sur une émotion
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const emotion = typeof params === 'string' ? params : params.emotion;
      const intensity = typeof params === 'object' ? params.intensity : 0.5;
      
      // Recherche de playlists correspondant à l'émotion
      const matchingPlaylists = mockMusicPlaylists.filter(p => 
        p.emotion === emotion || p.mood === emotion
      );
      
      if (matchingPlaylists.length > 0) {
        // Sélectionner la première playlist correspondante
        const selectedPlaylist = matchingPlaylists[0];
        setPlaylist(selectedPlaylist);
        
        // Si des pistes existent, jouer la première
        if (selectedPlaylist.tracks.length > 0) {
          playTrack(selectedPlaylist.tracks[0]);
        }
        
        return selectedPlaylist;
      } else {
        // Créer une playlist dynamique à partir des pistes disponibles
        const matchingTracks = mockMusicTracks.filter(t => 
          t.emotion === emotion || t.mood === emotion || t.emotionalTone === emotion
        );
        
        if (matchingTracks.length > 0) {
          const dynamicPlaylist: MusicPlaylist = {
            id: `dynamic-${emotion}-${Date.now()}`,
            name: `Playlist ${emotion}`,
            title: `Musique pour ${emotion}`,
            tracks: matchingTracks,
            emotion: emotion
          };
          
          setPlaylist(dynamicPlaylist);
          playTrack(matchingTracks[0]);
          
          return dynamicPlaylist;
        } else {
          console.log(`Aucune musique trouvée pour l'émotion: ${emotion}`);
          setError(new Error(`Aucune musique trouvée pour l'émotion: ${emotion}`));
          return null;
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement de la playlist:', err);
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Initialisation du système musical
  const initializeMusicSystem = () => {
    setIsInitialized(true);
  };
  
  // Valeur du contexte
  const value: MusicContextType = {
    currentTrack,
    playlist,
    isPlaying,
    volume,
    isMuted,
    muted,
    currentTime,
    duration,
    currentEmotion,
    emotion: currentEmotion,
    recommendations,
    isLoading,
    error,
    isInitialized,
    openDrawer,
    playTrack,
    pauseTrack,
    resumeTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume,
    toggleMute,
    seekTo,
    loadPlaylistForEmotion,
    setEmotion,
    setOpenDrawer,
    initializeMusicSystem
  };
  
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
