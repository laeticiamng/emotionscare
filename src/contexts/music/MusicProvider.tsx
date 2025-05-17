
import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  MusicContextType,
  MusicTrack,
  MusicPlaylist,
} from "@/types/music";
import { v4 as uuidv4 } from 'uuid';

interface MusicProviderProps {
  children: React.ReactNode;
}

const MusicContext = createContext<MusicContextType | null>(null);

const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const storedPlaylists = localStorage.getItem('musicPlaylists');
    if (storedPlaylists) {
      setPlaylists(JSON.parse(storedPlaylists));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('musicPlaylists', JSON.stringify(playlists));
  }, [playlists]);

  const setPlaylistState = (newPlaylist: MusicPlaylist | ((prev: MusicPlaylist) => MusicPlaylist)) => {
    if (typeof newPlaylist === 'function') {
      setPlaylist(newPlaylist);
    } else {
      if (!newPlaylist.title) {
        newPlaylist.title = "Generated Playlist";
      }
      setPlaylist(newPlaylist);
    }
  };

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const loadPlaylistAndPlay = (playlist: MusicPlaylist) => {
    setPlaylistState(playlist);
    setCurrentTrack(playlist.tracks[0] || null);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const playNext = () => {
    if (!playlist || !currentTrack) return;
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.tracks.length;
    setCurrentTrack(playlist.tracks[nextIndex]);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (!playlist || !currentTrack) return;
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    const previousIndex = (currentIndex - 1 + playlist.tracks.length) % playlist.tracks.length;
    setCurrentTrack(playlist.tracks[previousIndex]);
    setIsPlaying(true);
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const playSimilar = (mood?: string) => {
    if (!mood) return;

    const similarTracks = playlists.reduce((acc: MusicTrack[], playlist) => {
      const tracks = playlist.tracks.filter(track => track.mood === mood);
      return [...acc, ...tracks];
    }, []);

    if (similarTracks.length > 0) {
      const newPlaylist: MusicPlaylist = {
        id: uuidv4(),
        title: `Similar to ${mood}`,
        tracks: similarTracks,
        mood: mood
      };
      setPlaylistState(newPlaylist);
      setCurrentTrack(similarTracks[0]);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const trackUrl = currentTrack.audioUrl || currentTrack.url;
      if (trackUrl) {
        audioRef.current.src = trackUrl;
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play();
        }
      }
    }
  }, [currentTrack, isPlaying]);

  const recommendByEmotion = (emotion: string, intensity: number = 0.5): MusicPlaylist => {
    const allTracks = playlists.reduce((acc: MusicTrack[], playlist) => {
      return [...acc, ...playlist.tracks];
    }, []);

    const filteredTracks = allTracks.filter(track => {
      if (!track.mood) return false;
      const trackMood = track.mood.toLowerCase();
      const targetEmotion = emotion.toLowerCase();

      const moodMatch = trackMood.includes(targetEmotion);
      return moodMatch;
    });

    return {
      id: `${emotion}-${Date.now()}`,
      title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Playlist`,
      tracks: filteredTracks,
      mood: emotion
    };
  };

  const getRecommendedPlaylists = (limit: number = 3): MusicPlaylist[] => {
    return playlists.slice(0, limit);
  };

  const contextValue: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    duration,
    currentTime,
    playlist,
    playlists,
    openDrawer,
    setOpenDrawer,
    playTrack,
    playSimilar,
    playNext,
    playPrevious,
    togglePlay,
    setVolume: handleVolumeChange,
    seekTo,
    recommendByEmotion,
    getRecommendedPlaylists,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleDurationChange}
        onEnded={playNext}
      />
      {children}
    </MusicContext.Provider>
  );
};

const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};

export { MusicProvider, useMusic };
