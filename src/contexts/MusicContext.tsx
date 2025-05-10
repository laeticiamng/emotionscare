
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTracks, mockMusicPlaylists } from '@/data/mockMusic';
import { MusicTrack, MusicPlaylist, MusicContextType } from '@/types/music';
import { mapEmotionToMusicType } from '@/services/music/emotion-music-mapping';

const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  isPlaying: false,
  volume: 0.5,
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  setCurrentTrack: () => {},
  openDrawer: false,
  setOpenDrawer: () => {},
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('neutral');

  // Initialize the music system
  useEffect(() => {
    const initializeMusicSystem = async () => {
      try {
        // In a real app, this would load from an API
        setPlaylists(mockMusicPlaylists);
        
        // Create audio element
        const audio = new Audio();
        audio.volume = volume;
        setAudioElement(audio);
        
        setIsInitialized(true);
      } catch (err) {
        console.error('Error initializing music system:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize music system'));
      }
    };

    if (!isInitialized) {
      initializeMusicSystem();
    }
  }, [isInitialized, volume]);

  // Play a track
  const playTrack = (track: MusicTrack) => {
    if (audioElement) {
      setCurrentTrack(track);
      
      // In a real app we would load the actual audio file
      audioElement.src = track.audioUrl || track.url || '';
      audioElement.play().catch(err => {
        console.error('Error playing track:', err);
      });
      
      setIsPlaying(true);
    }
  };

  // Pause playback
  const pauseTrack = () => {
    if (audioElement && isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  // Resume playback
  const resumeTrack = () => {
    if (audioElement && !isPlaying && currentTrack) {
      audioElement.play().catch(err => console.error('Error resuming track:', err));
      setIsPlaying(true);
    }
  };

  // Play next track in playlist
  const nextTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === currentPlaylist.tracks.length - 1) return;
    
    playTrack(currentPlaylist.tracks[currentIndex + 1]);
  };

  // Play previous track in playlist
  const previousTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex <= 0) return;
    
    playTrack(currentPlaylist.tracks[currentIndex - 1]);
  };

  // Load a playlist by its ID
  const loadPlaylistById = (id: string) => {
    const playlist = playlists.find(p => p.id === id);
    if (playlist && playlist.tracks.length > 0) {
      setCurrentPlaylist(playlist);
      playTrack(playlist.tracks[0]);
      return playlist;
    }
    return null;
  };

  // Load playlist based on emotion
  const loadPlaylistForEmotion = async (emotion: string) => {
    const musicType = mapEmotionToMusicType(emotion);
    
    // In a real app, this would load from an API
    const emotionPlaylist = playlists.find(p => p.emotion?.toLowerCase() === musicType);
    
    if (emotionPlaylist) {
      setCurrentPlaylist(emotionPlaylist);
      setCurrentEmotion(emotion);
      if (emotionPlaylist.tracks.length > 0) {
        playTrack(emotionPlaylist.tracks[0]);
      }
      return emotionPlaylist;
    } else {
      // Fallback to first playlist
      if (playlists.length > 0) {
        setCurrentPlaylist(playlists[0]);
        setCurrentEmotion(emotion);
        if (playlists[0].tracks.length > 0) {
          playTrack(playlists[0].tracks[0]);
        }
        return playlists[0];
      }
    }
    
    return null;
  };

  // Get tracks for a specific emotion
  const getTracksForEmotion = (emotion: string): MusicTrack[] => {
    const musicType = mapEmotionToMusicType(emotion);
    const emotionPlaylist = playlists.find(p => p.emotion?.toLowerCase() === musicType);
    
    if (emotionPlaylist) {
      return emotionPlaylist.tracks;
    }
    
    return [];
  };

  return (
    <MusicContext.Provider
      value={{
        currentTrack,
        isPlaying,
        volume,
        playTrack,
        pauseTrack,
        nextTrack,
        previousTrack,
        setVolume,
        setCurrentTrack,
        currentPlaylist,
        loadPlaylistForEmotion,
        loadPlaylistById,
        playlists,
        openDrawer,
        setOpenDrawer,
        getTracksForEmotion,
        currentEmotion,
        initializeMusicSystem: async () => {
          try {
            // In a real app, this would initialize the system
            setIsInitialized(true);
          } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to initialize music system'));
            throw err;
          }
        },
        error
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
