
import { useCallback, useState } from 'react';
import { MusicTrack } from '@/types/music';
import { useAudioPlayer } from '@/hooks/useAudioPlayer'; 

export function useMusicPlayer() {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioPlayer = useAudioPlayer();
  
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    console.log('Playing track:', track.title);
  }, []);
  
  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
    console.log('Paused track');
  }, []);
  
  return {
    currentTrack,
    isPlaying,
    playTrack,
    pauseTrack,
    // Forward other methods from audioPlayer
    ...audioPlayer
  };
}

export default useMusicPlayer;
