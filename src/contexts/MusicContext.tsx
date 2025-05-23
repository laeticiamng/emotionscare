
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, EmotionMusicParams, MusicContextType } from '@/types/music';
import { supabase } from '@/integrations/supabase/client';

const MusicContext = createContext<MusicContextType | undefined>(undefined);

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isOpenDrawer, setOpenDrawer] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    
    const audio = audioRef.current;
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      nextTrack();
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  // Load playlists on mount
  useEffect(() => {
    loadDefaultPlaylists();
  }, []);

  const loadDefaultPlaylists = async () => {
    const defaultPlaylists: MusicPlaylist[] = [
      {
        id: 'calm-playlist',
        name: 'Relaxation',
        title: 'Musique Apaisante',
        description: 'Sons relaxants pour la méditation',
        emotion: 'calm',
        tracks: [
          {
            id: 'calm-1',
            title: 'Océan Tranquille',
            artist: 'Nature Sounds',
            url: '/audio/ocean-calm.mp3',
            duration: 300,
            emotion: 'calm'
          },
          {
            id: 'calm-2',
            title: 'Forêt Paisible',
            artist: 'Ambient Collective',
            url: '/audio/forest-peace.mp3',
            duration: 240,
            emotion: 'calm'
          }
        ]
      },
      {
        id: 'energetic-playlist',
        name: 'Motivation',
        title: 'Musique Énergisante',
        description: 'Rythmes pour booster votre énergie',
        emotion: 'energetic',
        tracks: [
          {
            id: 'energy-1',
            title: 'Power Beat',
            artist: 'Motivation Music',
            url: '/audio/power-beat.mp3',
            duration: 180,
            emotion: 'energetic'
          }
        ]
      }
    ];
    
    setPlaylists(defaultPlaylists);
  };

  const playTrack = (track: MusicTrack) => {
    if (!audioRef.current) return;
    
    setCurrentTrack(track);
    audioRef.current.src = track.url || track.audioUrl || '';
    audioRef.current.load();
    
    audioRef.current.play().then(() => {
      setIsPlaying(true);
    }).catch((error) => {
      console.error('Error playing track:', error);
      // Fallback to mock audio URL for demo
      audioRef.current!.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+L3wm';
      audioRef.current!.play().catch(() => {
        console.log('Demo mode: audio playback simulated');
        setIsPlaying(true);
      });
    });
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error('Error resuming track:', error);
        setIsPlaying(true); // Demo mode
      });
    }
  };

  const stopTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.tracks.length;
    playTrack(playlist.tracks[nextIndex]);
  };

  const prevTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? playlist.tracks.length - 1 : currentIndex - 1;
    playTrack(playlist.tracks[prevIndex]);
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolumeLevel = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  const loadPlaylist = async (id: string): Promise<MusicPlaylist | null> => {
    const foundPlaylist = playlists.find(p => p.id === id);
    if (foundPlaylist) {
      setPlaylist(foundPlaylist);
      return foundPlaylist;
    }
    return null;
  };

  const loadPlaylistForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      // Try to generate music with AI first
      const { data, error } = await supabase.functions.invoke('music-generation', {
        body: {
          emotion: params.emotion,
          intensity: params.intensity || 0.5,
          genre: params.genre,
          duration: params.duration || 120
        }
      });

      if (data && !error) {
        const generatedPlaylist: MusicPlaylist = {
          id: `generated-${Date.now()}`,
          name: `Musique ${params.emotion}`,
          title: `Playlist ${params.emotion}`,
          description: `Musique générée pour l'émotion ${params.emotion}`,
          emotion: params.emotion,
          tracks: [{
            id: data.id,
            title: `Musique ${params.emotion}`,
            artist: 'AI Generated',
            url: data.url,
            duration: data.duration,
            emotion: params.emotion
          }]
        };
        
        setPlaylist(generatedPlaylist);
        return generatedPlaylist;
      }
    } catch (error) {
      console.error('Error generating music:', error);
    }

    // Fallback to existing playlists
    const emotionPlaylist = playlists.find(p => p.emotion === params.emotion);
    if (emotionPlaylist) {
      setPlaylist(emotionPlaylist);
      return emotionPlaylist;
    }

    // Create a basic playlist if none found
    const basicPlaylist: MusicPlaylist = {
      id: `basic-${params.emotion}`,
      name: `Musique ${params.emotion}`,
      title: `Playlist ${params.emotion}`,
      description: `Musique adaptée à l'émotion ${params.emotion}`,
      emotion: params.emotion,
      tracks: [{
        id: `track-${params.emotion}`,
        title: `Piste ${params.emotion}`,
        artist: 'Collection Émotionnelle',
        url: '/audio/demo-track.mp3',
        duration: 180,
        emotion: params.emotion
      }]
    };
    
    setPlaylist(basicPlaylist);
    return basicPlaylist;
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const contextValue: MusicContextType = {
    currentTrack,
    isPlaying,
    playlist,
    playlists,
    volume,
    duration,
    currentTime,
    progress,
    isOpenDrawer,
    playTrack,
    pauseTrack,
    resumeTrack,
    stopTrack,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume: setVolumeLevel,
    loadPlaylist,
    loadPlaylistForEmotion,
    setOpenDrawer,
    play: resumeTrack,
    pause: pauseTrack,
    resume: resumeTrack,
    togglePlay
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
