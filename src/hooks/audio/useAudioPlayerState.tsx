import { useState, useEffect } from 'react';
import { MusicTrack } from '@/types/music';

interface UseAudioPlayerStateReturn {
  track: MusicTrack | null;
  setTrack: (track: MusicTrack) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

export function useAudioPlayerState(): UseAudioPlayerStateReturn {
  const [trackState, setTrackState] = useState<MusicTrack | null>(null);
  const [isPlayingState, setIsPlayingState] = useState(false);

  useEffect(() => {
    console.log('Current track:', trackState);
  }, [trackState]);

  useEffect(() => {
    console.log('Is playing:', isPlayingState);
  }, [isPlayingState]);

  // Fix the type mismatch between MusicTrack types
  // Change the setCurrentTrack to handle track properly
  const setCurrentTrack = (track: MusicTrack) => {
    // Ensure the track has all required fields
    const completeTrack: MusicTrack = {
      ...track,
      duration: track.duration || 0, // Ensure duration is present
      url: track.url || track.audioUrl || '', // Ensure url is present
    };
    setTrackState(completeTrack);
  };

  return {
    track: trackState,
    setTrack: setCurrentTrack,
    isPlaying: isPlayingState,
    setIsPlaying: setIsPlayingState,
  };
}
