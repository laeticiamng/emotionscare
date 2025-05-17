
import React, { useState, useEffect, useRef } from 'react';
import { MusicContext, MusicContextType } from '@/contexts/MusicContext';
import { MusicTrack, MusicPlaylist } from '@/types/music';
import { mockTracks, mockPlaylists } from '@/data/mockMusic';

const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const initializeMusicSystem = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
    }
    
    setIsInitialized(true);
  };
  
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const togglePlay = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };
  
  const playTrack = (track: MusicTrack) => {
    if (!audioRef.current) {
      initializeMusicSystem();
    }
    
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play().then(() => {
        setCurrentTrack(track);
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing track:', error);
      });
    }
  };
  
  const pauseTrack = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const resumeTrack = () => {
    if (audioRef.current && !isPlaying && currentTrack) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error('Error resuming track:', error));
    }
  };
  
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > -1 && currentIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentIndex + 1]);
    } else if (playlist.tracks.length > 0) {
      // Loop back to the first track
      playTrack(playlist.tracks[0]);
    }
  };
  
  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(playlist.tracks[currentIndex - 1]);
    } else if (playlist.tracks.length > 0) {
      // Loop to the last track
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    }
  };
  
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !muted;
      setMuted(!muted);
    }
  };
  
  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };
  
  const loadPlaylistForEmotion = (emotion: string) => {
    const emotionPlaylist = mockPlaylists.find(p => p.emotion === emotion) || mockPlaylists[0];
    setPlaylist(emotionPlaylist);
    
    if (emotionPlaylist.tracks.length > 0 && !currentTrack) {
      playTrack(emotionPlaylist.tracks[0]);
    }
  };
  
  const musicContextValue: MusicContextType = {
    isInitialized,
    currentTrack,
    isPlaying,
    volume,
    muted,
    isMuted: muted,
    currentTime,
    duration,
    playlist,
    togglePlay,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume: handleVolumeChange,
    toggleMute,
    loadPlaylistForEmotion,
    initializeMusicSystem
  };
  
  return (
    <MusicContext.Provider value={musicContextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicProvider;
