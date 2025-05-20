
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '../types/music';
import { emotionPlaylists } from '@/data/emotionPlaylists';
import { mockPlaylists } from './music/mockMusicData';

// Create default context
const defaultContext: MusicContextType = {
  currentTrack: null,
  currentPlaylist: null,
  playlists: [],
  isPlaying: false,
  volume: 0.5,
  duration: 0,
  currentTime: 0,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  setVolume: () => {},
  setCurrentTime: () => {},
  togglePlayPause: () => {},
  seekTo: () => {},
  playPlaylist: () => {},
  shuffle: () => {},
  repeat: () => {},
  muted: false,
  toggleMute: () => {},
  togglePlay: () => {},
  previous: () => {},
  next: () => {},
  setOpenDrawer: () => {},
  isInitialized: false,
  setCurrentTrack: () => {},
};

// Create context
export const MusicContext = createContext<MusicContextType>(defaultContext);

// Hook for using music context
export const useMusic = () => useContext(MusicContext);

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [muted, setMuted] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
      setIsLoading(false);
    });
    
    audio.addEventListener('ended', () => {
      nextTrack();
    });
    
    audio.addEventListener('error', (e) => {
      setError('Error loading audio: ' + e);
      setIsLoading(false);
    });
    
    setAudioElement(audio);
    
    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('ended', () => {});
      audio.removeEventListener('error', () => {});
    };
  }, []);

  // Initialize playlists
  useEffect(() => {
    // Simulate loading playlists
    setPlaylists([...mockPlaylists, ...emotionPlaylists]);
    setIsInitialized(true);
  }, []);

  // Update volume when it changes
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = muted ? 0 : volume;
    }
  }, [volume, muted, audioElement]);

  // Play track function
  const playTrack = (track: MusicTrack) => {
    if (!audioElement) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the appropriate URL property
      const trackUrl = track.url || track.audioUrl || '';
      
      if (!trackUrl) {
        setError('Track URL is missing');
        setIsLoading(false);
        return;
      }
      
      audioElement.src = trackUrl;
      audioElement.load();
      audioElement.play()
        .then(() => {
          setIsPlaying(true);
          setCurrentTrack(track);
        })
        .catch(err => {
          setError(`Error playing track: ${err.message}`);
          setIsPlaying(false);
        });
    } catch (err) {
      if (err instanceof Error) {
        setError(`Error setting track: ${err.message}`);
      } else {
        setError('Unknown error setting track');
      }
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  // Load playlist for emotion
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    
    try {
      // Convert string parameter to EmotionMusicParams
      const emotionParam = typeof params === 'string' ? { emotion: params } : params;
      const emotion = emotionParam.emotion.toLowerCase();
      
      // Find playlist that matches the emotion
      let matchedPlaylists = playlists.filter(playlist => 
        playlist.emotion?.toLowerCase() === emotion || 
        playlist.mood?.toLowerCase() === emotion
      );
      
      if (matchedPlaylists.length === 0) {
        // Fall back to any category that might match
        matchedPlaylists = playlists.filter(playlist => {
          const playlistCategory = playlist.category;
          if (typeof playlistCategory === 'string') {
            return playlistCategory.toLowerCase() === emotion;
          } else if (Array.isArray(playlistCategory)) {
            return playlistCategory.some(cat => cat.toLowerCase() === emotion);
          }
          return false;
        });
      }
      
      if (matchedPlaylists.length === 0) {
        // Create a virtual playlist with tracks that match emotion
        const emotionTracks = playlists.flatMap(playlist => 
          playlist.tracks.filter(track => {
            const trackCategory = track.category;
            const trackMood = track.mood;
            
            if (trackMood?.toLowerCase() === emotion) return true;
            
            if (typeof trackCategory === 'string') {
              return trackCategory.toLowerCase() === emotion;
            } else if (Array.isArray(trackCategory)) {
              return trackCategory.some(cat => cat.toLowerCase() === emotion);
            }
            
            return false;
          })
        );
        
        if (emotionTracks.length > 0) {
          const virtualPlaylist: MusicPlaylist = {
            id: `virtual-${emotion}-${Date.now()}`,
            name: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Playlist`,
            title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Playlist`,
            tracks: emotionTracks,
            emotion: emotion,
            description: `Music for ${emotion} mood`,
            category: emotion,
          };
          
          setCurrentPlaylist(virtualPlaylist);
          setEmotion(emotion);
          setIsLoading(false);
          
          return virtualPlaylist;
        }
      } else {
        // Use the first matched playlist
        const matchedPlaylist = matchedPlaylists[0];
        setCurrentPlaylist(matchedPlaylist);
        
        // If there's a track in the playlist, prepare to play it
        if (matchedPlaylist.tracks.length > 0 && !currentTrack) {
          setCurrentTrack(matchedPlaylist.tracks[0]);
        }
        
        setEmotion(emotion);
        setIsLoading(false);
        
        return matchedPlaylist;
      }
      
      setIsLoading(false);
      return null;
    } catch (error) {
      console.error('Error loading playlist for emotion:', error);
      setIsLoading(false);
      setError('Failed to load playlist for this emotion');
      return null;
    }
  };

  // Get recommendation by emotion
  const getRecommendationByEmotion = async (emotion: string): Promise<MusicPlaylist | null> => {
    try {
      // Check for exact emotion match
      const exactMatch = playlists.find(p => 
        p.emotion?.toLowerCase() === emotion.toLowerCase() || 
        p.mood?.toLowerCase() === emotion.toLowerCase()
      );
      
      if (exactMatch) return exactMatch;
      
      // Check for tracks with matching emotion
      const matchingTracks = playlists.flatMap(playlist => 
        playlist.tracks.filter(track => {
          const trackCategory = track.category;
          const trackMood = track.mood;
          
          if (trackMood?.toLowerCase() === emotion.toLowerCase()) return true;
          
          if (typeof trackCategory === 'string') {
            return trackCategory.toLowerCase() === emotion.toLowerCase();
          } else if (Array.isArray(trackCategory)) {
            return trackCategory.some(cat => cat.toLowerCase() === emotion.toLowerCase());
          }
          
          return false;
        })
      );
      
      if (matchingTracks.length > 0) {
        const recommendedPlaylist: MusicPlaylist = {
          id: `recommended-${emotion}-${Date.now()}`,
          name: `${emotion} Recommendation`,
          title: `${emotion} Recommendation`,
          tracks: matchingTracks,
          description: `Recommended tracks for ${emotion}`,
          emotion: emotion,
        };
        
        return recommendedPlaylist;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting recommendation by emotion:', error);
      return null;
    }
  };

  // Play emotion
  const playEmotion = (emotionName: string) => {
    loadPlaylistForEmotion(emotionName).then(playlist => {
      if (playlist && playlist.tracks.length > 0) {
        setCurrentPlaylist(playlist);
        playTrack(playlist.tracks[0]);
      }
    });
  };

  // Pause track
  const pauseTrack = () => {
    if (audioElement && isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  // Resume track
  const resumeTrack = () => {
    if (audioElement && !isPlaying && currentTrack) {
      audioElement.play()
        .then(() => setIsPlaying(true))
        .catch(err => setError(`Error resuming: ${err.message}`));
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  // Seek to position
  const seekTo = (time: number) => {
    if (audioElement) {
      audioElement.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Next track
  const nextTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < currentPlaylist.tracks.length - 1) {
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    } else {
      // Loop back to the first track
      playTrack(currentPlaylist.tracks[0]);
    }
  };

  // Previous track
  const prevTrack = () => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    } else {
      // Loop to the last track
      playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
    }
  };

  // Play playlist
  const playPlaylist = (playlist: MusicPlaylist) => {
    if (playlist.tracks.length > 0) {
      setCurrentPlaylist(playlist);
      playTrack(playlist.tracks[0]);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
    if (audioElement) {
      audioElement.muted = !muted;
    }
  };

  // Create alias functions for backwards compatibility
  const togglePlay = togglePlayPause;
  const previous = prevTrack;
  const next = nextTrack;
  const pause = pauseTrack;
  const resume = resumeTrack;
  
  // Get current track
  const getCurrentTrack = (): MusicTrack | null => currentTrack;
  
  // Shuffle playlist - placeholder implementation
  const shuffle = () => {
    if (!currentPlaylist) return;
    
    const shuffledTracks = [...currentPlaylist.tracks].sort(() => Math.random() - 0.5);
    const newPlaylist: MusicPlaylist = {
      ...currentPlaylist,
      id: `${currentPlaylist.id}-shuffled`,
      name: `${currentPlaylist.name} (Shuffled)`,
      tracks: shuffledTracks,
    };
    
    setCurrentPlaylist(newPlaylist);
  };
  
  // Repeat - placeholder implementation
  const repeat = () => {
    // Implementation would go here
  };

  // Provider value
  const value: MusicContextType = {
    currentTrack,
    currentPlaylist,
    playlists,
    isPlaying,
    volume,
    duration,
    currentTime,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    prevTrack,
    previousTrack: prevTrack, // Alias for compatibility
    setVolume,
    setCurrentTime,
    togglePlayPause,
    seekTo,
    playPlaylist,
    shuffle,
    repeat,
    isLoading,
    getCurrentTrack,
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    playEmotion,
    pause,
    resume,
    muted,
    toggleMute,
    togglePlay,
    previous,
    next,
    playlist: currentPlaylist,
    setOpenDrawer,
    isInitialized,
    error,
    setEmotion,
    setCurrentTrack,
    openDrawer,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
