
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AudioTrack, AudioPlaylist, AudioContextType } from '@/types/audio';
import { useToast } from './use-toast';

const AudioContext = createContext<AudioContextType>({
  tracks: [],
  currentTrack: null,
  isPlaying: false,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  prevTrack: () => {},
  nextTrack: () => {},
  togglePlay: () => {},
  volume: 0.7,
  setVolume: () => {},
  isMuted: false,
  toggleMute: () => {},
  progress: 0,
  duration: 0,
  seekTo: () => {},
  formatTime: () => '',
  loading: false,
});

export const AudioProvider = ({ children }: { children: React.ReactNode }) => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [emotion, setEmotion] = useState<string | undefined>(undefined);
  const [openDrawer, setOpenDrawer] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.addEventListener('timeupdate', () => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
        }
      });
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
          setLoading(false);
        }
      });
      
      audioRef.current.addEventListener('ended', () => {
        nextTrack();
      });
      
      audioRef.current.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setLoading(false);
        toast({
          title: "Erreur de lecture",
          description: "Impossible de charger l'audio. Veuillez réessayer.",
          variant: "destructive"
        });
      });
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  const playTrack = (track: AudioTrack) => {
    try {
      setLoading(true);
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.volume = volume;
        audioRef.current.play()
          .then(() => {
            setCurrentTrack(track);
            setIsPlaying(true);
          })
          .catch(error => {
            console.error('Error playing track:', error);
            setLoading(false);
            toast({
              title: "Erreur de lecture",
              description: "Impossible de lire cet audio. Veuillez réessayer.",
              variant: "destructive"
            });
          });
      }
    } catch (error) {
      console.error('Error setting up track:', error);
      setLoading(false);
    }
  };
  
  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const resumeTrack = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error resuming track:', error);
        });
    }
  };
  
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };
  
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const prevTrack = () => {
    // Implement previous track functionality
    console.log('Previous track');
  };

  const nextTrack = () => {
    // Implement next track functionality
    console.log('Next track');
  };
  
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const loadPlaylist = (playlist: AudioPlaylist) => {
    setTracks(playlist.tracks);
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };

  const loadPlaylistForEmotion = async (params: { emotion: string, intensity?: number }): Promise<AudioPlaylist | null> => {
    // Simulate API call to get playlist for emotion
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPlaylist: AudioPlaylist = {
        id: `playlist-${params.emotion}`,
        name: `${params.emotion} Playlist`,
        tracks: [
          {
            id: '1',
            title: `${params.emotion} Track 1`,
            artist: 'Various Artists',
            duration: 180,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
            coverUrl: 'https://picsum.photos/200/200'
          },
          {
            id: '2',
            title: `${params.emotion} Track 2`,
            artist: 'Various Artists',
            duration: 210,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            coverUrl: 'https://picsum.photos/200/200'
          }
        ],
        emotion: params.emotion
      };
      
      loadPlaylist(mockPlaylist);
      setEmotion(params.emotion);
      return mockPlaylist;
    } catch (error) {
      console.error('Error loading playlist:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger une playlist pour cette émotion.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AudioContext.Provider value={{
      tracks,
      currentTrack,
      isPlaying,
      playTrack,
      pauseTrack,
      resumeTrack,
      prevTrack,
      nextTrack,
      togglePlay,
      volume,
      setVolume,
      isMuted,
      toggleMute,
      progress,
      duration,
      seekTo,
      formatTime,
      loading,
      openDrawer,
      setOpenDrawer,
      loadPlaylist,
      loadPlaylistForEmotion,
      setEmotion,
      emotion,
      isInitialized: true
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
