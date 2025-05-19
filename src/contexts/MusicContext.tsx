import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import { useToast } from '@/hooks/use-toast';
import { ensureTrack, ensurePlaylist } from '@/utils/musicCompatibility';

export const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  playlist: null,
  playlists: [],
  isPlaying: false,
  volume: 0.7,
  duration: 0,
  muted: false,
  currentTime: 0,
  togglePlay: () => {},
  toggleMute: () => {},
  setVolume: () => {},
  playTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylistState] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [muted, setMuted] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update audio element when track changes
  useEffect(() => {
    if (!audioElement || !currentTrack) return;

    const handleCanPlay = () => {
      if (isPlaying) {
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    const handleEnded = () => {
      if (isRepeating) {
        audioElement.currentTime = 0;
        audioElement.play().catch(console.error);
      } else {
        nextTrack();
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
    };

    audioElement.src = currentTrack.url || currentTrack.audioUrl || '';
    audioElement.addEventListener('canplay', handleCanPlay);
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audioElement.removeEventListener('canplay', handleCanPlay);
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentTrack, audioElement, isPlaying, isRepeating]);

  // Handle volume changes
  useEffect(() => {
    if (!audioElement) return;
    audioElement.volume = muted ? 0 : volume;
  }, [volume, muted, audioElement]);

  const togglePlay = useCallback(() => {
    if (!audioElement || !currentTrack) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }

    setIsPlaying(!isPlaying);
  }, [audioElement, currentTrack, isPlaying]);

  const toggleMute = useCallback(() => {
    if (!audioElement) return;
    setMuted(!muted);
  }, [audioElement, muted]);

  const toggleRepeat = useCallback(() => {
    setIsRepeating(!isRepeating);
  }, [isRepeating]);

  const toggleShuffle = useCallback(() => {
    setIsShuffling(!isShuffling);
  }, [isShuffling]);

  const setVolume = useCallback((value: number) => {
    setVolumeState(value);
    if (value > 0 && muted) {
      setMuted(false);
    }
  }, [muted]);

  const playTrack = useCallback((track: MusicTrack) => {
    const normalizedTrack = ensureTrack(track);
    setCurrentTrack(normalizedTrack);
    setIsPlaying(true);
  }, []);

  const pauseTrack = useCallback(() => {
    if (!audioElement) return;
    audioElement.pause();
    setIsPlaying(false);
  }, [audioElement]);

  const resumeTrack = useCallback(() => {
    if (!audioElement || !currentTrack) return;
    audioElement.play().catch(console.error);
    setIsPlaying(true);
  }, [audioElement, currentTrack]);

  const nextTrack = useCallback(() => {
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) return;

    const currentIndex = currentTrack
      ? playlist.tracks.findIndex(track => track.id === currentTrack.id)
      : -1;

    let nextIndex;
    if (isShuffling) {
      // Random track excluding current
      const availableIndices = Array.from(
        { length: playlist.tracks.length },
        (_, i) => i
      ).filter(i => i !== currentIndex);
      
      if (availableIndices.length === 0) return;
      nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      // Next track in sequence
      nextIndex = currentIndex + 1;
      if (nextIndex >= playlist.tracks.length) {
        nextIndex = 0;
      }
    }

    playTrack(playlist.tracks[nextIndex]);
  }, [playlist, currentTrack, isShuffling, playTrack]);

  const prevTrack = useCallback(() => {
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) return;

    const currentIndex = currentTrack
      ? playlist.tracks.findIndex(track => track.id === currentTrack.id)
      : -1;

    if (currentIndex === -1) return;

    let prevIndex;
    if (isShuffling) {
      // Random track excluding current
      const availableIndices = Array.from(
        { length: playlist.tracks.length },
        (_, i) => i
      ).filter(i => i !== currentIndex);
      
      if (availableIndices.length === 0) return;
      prevIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      // Previous track in sequence
      prevIndex = currentIndex - 1;
      if (prevIndex < 0) {
        prevIndex = playlist.tracks.length - 1;
      }
    }

    playTrack(playlist.tracks[prevIndex]);
  }, [playlist, currentTrack, isShuffling, playTrack]);

  const addTrack = useCallback((track: MusicTrack) => {
    if (!playlist) {
      setPlaylistState({
        id: 'custom-playlist',
        title: 'Custom Playlist',
        tracks: [track]
      });
      return;
    }

    setPlaylistState({
      ...playlist,
      tracks: [...playlist.tracks, track]
    });
  }, [playlist]);

  const setPlaylist = (newPlaylist: MusicPlaylist) => {
    // Ensure the playlist has a title property
    const updatedPlaylist = {
      ...newPlaylist,
      title: newPlaylist.title || newPlaylist.name || 'Playlist'
    };
    
    setPlaylistState(updatedPlaylist);
  };

  const seekTo = useCallback((time: number) => {
    if (!audioElement) return;
    audioElement.currentTime = time;
    setCurrentTime(time);
  }, [audioElement]);

  // Load playlist based on emotion
  const loadPlaylistForEmotion = useCallback(async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      // This would typically be an API call to get music recommendations
      // For now, we'll simulate with a mock playlist
      const emotionType = typeof params === 'string' ? params : params.emotion;
      const intensity = typeof params === 'object' ? params.intensity || 0.5 : 0.5;
      
      console.log(`Loading playlist for emotion: ${emotionType}, intensity: ${intensity}`);
      
      // Mock data - in a real app, this would come from an API
      const mockPlaylist: MusicPlaylist = {
        id: `${emotionType}-playlist`,
        title: `${emotionType.charAt(0).toUpperCase() + emotionType.slice(1)} Music`,
        tracks: [
          {
            id: `${emotionType}-1`,
            title: `${emotionType.charAt(0).toUpperCase() + emotionType.slice(1)} Track 1`,
            artist: 'EmotionsCare Music',
            duration: 180,
            url: '/audio/sample.mp3',
            emotion: emotionType
          },
          {
            id: `${emotionType}-2`,
            title: `${emotionType.charAt(0).toUpperCase() + emotionType.slice(1)} Track 2`,
            artist: 'EmotionsCare Music',
            duration: 210,
            url: '/audio/sample2.mp3',
            emotion: emotionType
          }
        ],
        emotion: emotionType
      };
      
      setPlaylist(mockPlaylist);
      
      toast({
        title: 'Playlist chargée',
        description: `Playlist "${mockPlaylist.title}" prête à être jouée.`
      });
      
      return mockPlaylist;
    } catch (error) {
      console.error('Error loading playlist for emotion:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger la playlist pour cette émotion.',
        variant: 'destructive'
      });
      return null;
    }
  }, [toast]);

  const contextValue: MusicContextType = {
    currentTrack,
    playlist,
    isPlaying,
    volume,
    duration,
    muted,
    currentTime,
    togglePlay,
    toggleMute,
    toggleRepeat,
    toggleShuffle,
    setVolume,
    playTrack,
    nextTrack,
    prevTrack,
    previousTrack: prevTrack,
    addTrack,
    setPlaylist,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    pauseTrack,
    resumeTrack,
    setOpenDrawer,
    setEmotion,
    openDrawer,
    isRepeating,
    isShuffling,
    loadPlaylistForEmotion,
    seekTo
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

export default MusicContext;
