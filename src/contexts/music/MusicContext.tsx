
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { getMockMusicData } from './mockMusicData';

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylistState] = useState<MusicPlaylist | null>(null);
  const [emotion, setEmotionState] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);

  const { tracks, playlists } = getMockMusicData();

  useEffect(() => {
    // Initialize with mock data
    setIsInitialized(true);
  }, []);

  const toggleMute = () => setMuted(!muted);
  
  const seekTo = (time: number) => {
    setCurrentTime(time);
    // In a real implementation, we would also seek the audio element
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(track.duration);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === playlist.tracks.length - 1) return;
    
    const nextTrack = playlist.tracks[currentIndex + 1];
    playTrack(nextTrack);
  };

  const prevTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex <= 0) return;
    
    const prevTrack = playlist.tracks[currentIndex - 1];
    playTrack(prevTrack);
  };

  // Alias for prevTrack to handle naming inconsistencies
  const previousTrack = prevTrack;

  const setPlaylist = (input: MusicPlaylist | MusicTrack[]) => {
    if (Array.isArray(input)) {
      setPlaylistState({
        id: 'custom-playlist',
        name: 'Custom Playlist',
        tracks: input,
      });
    } else {
      setPlaylistState(input);
    }
  };

  const loadPlaylistForEmotion = async (emotion: string | EmotionMusicParams): Promise<void> => {
    // Convert to string if it's an object
    const emotionString = typeof emotion === 'string' ? emotion : emotion.emotion;
    
    setEmotionState(emotionString);
    
    // In a mock implementation, find a playlist that matches the emotion
    const matchingPlaylist = playlists.find(p => 
      p.emotion?.toLowerCase() === emotionString.toLowerCase()
    );
    
    if (matchingPlaylist) {
      setPlaylistState(matchingPlaylist);
      // Optionally start playing the first track
      if (matchingPlaylist.tracks.length > 0) {
        playTrack(matchingPlaylist.tracks[0]);
      }
    } else {
      // If no matching playlist, create one with tracks that match the emotion
      const matchingTracks = tracks.filter(t => 
        t.emotion?.toLowerCase() === emotionString.toLowerCase() ||
        t.mood?.toLowerCase() === emotionString.toLowerCase()
      );
      
      if (matchingTracks.length > 0) {
        setPlaylistState({
          id: `${emotionString}-playlist`,
          name: `${emotionString} Playlist`,
          tracks: matchingTracks,
          emotion: emotionString,
        });
        playTrack(matchingTracks[0]);
      }
    }
  };

  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const closeDrawer = () => setOpenDrawer(false);

  // Mock implementation of AI music generation
  const generateMusic = async (prompt: string): Promise<MusicTrack> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create a mock generated track
    const generatedTrack: MusicTrack = {
      id: `generated-${Date.now()}`,
      title: `Generated from: ${prompt.slice(0, 20)}...`,
      artist: "AI Composer",
      duration: 180,
      audioUrl: "/audio/generated-track.mp3",
      coverUrl: "/images/ai-generated.jpg",
      album: "AI Generated Music",
      year: new Date().getFullYear(),
      tags: ["ai", "generated", prompt.split(" ")[0]],
      genre: "Electronic",
      category: "ai-generated"
    };
    
    return generatedTrack;
  };

  const value: MusicContextType = {
    isInitialized,
    isPlaying,
    currentTrack,
    volume,
    setVolume,
    duration,
    currentTime,
    muted,
    setMute: setMuted,
    toggleMute,
    seekTo,
    togglePlayPause,
    playlist,
    emotion,
    openDrawer,
    toggleDrawer,
    closeDrawer,
    setOpenDrawer,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    prevTrack,
    previousTrack,
    setEmotion: setEmotionState,
    loadPlaylistForEmotion,
    setPlaylist,
    generateMusic,
    togglePlay: togglePlayPause, // Alias for compatibility
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicProvider;
