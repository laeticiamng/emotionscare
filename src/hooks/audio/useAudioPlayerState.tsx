
import { useState, useEffect, useCallback } from 'react';
import { MusicTrack } from '@/types/music';

interface UseAudioPlayerStateReturn {
  track: MusicTrack | null;
  setTrack: (track: MusicTrack) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: string;
  muted: boolean;
  currentTrack: MusicTrack | null;
  seekTo: (time: number) => void;
  toggleMute: () => void;
  playTrack: (track: MusicTrack) => void;
  setVolume: (value: number) => void;
}

export function useAudioPlayerState(): UseAudioPlayerStateReturn {
  const [trackState, setTrackState] = useState<MusicTrack | null>(null);
  const [isPlayingState, setIsPlayingState] = useState(false);
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [durationState, setDurationState] = useState(0);
  const [volumeState, setVolumeState] = useState(0.7);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [errorState, setErrorState] = useState('');
  const [mutedState, setMutedState] = useState(false);

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
      audioUrl: track.audioUrl || track.url || '',
      artist: track.artist || 'Unknown Artist',
    };
    setTrackState(completeTrack);
  };

  const seek = useCallback((time: number) => {
    setCurrentTimeState(time);
  }, []);

  const toggleMuteFunc = useCallback(() => {
    setMutedState(!mutedState);
  }, [mutedState]);

  const playTrackFunc = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlayingState(true);
  }, []);

  const setVolumeFunc = useCallback((value: number) => {
    setVolumeState(value);
    if (value > 0 && mutedState) {
      setMutedState(false);
    }
  }, [mutedState]);

  return {
    track: trackState,
    setTrack: setCurrentTrack,
    isPlaying: isPlayingState,
    setIsPlaying: setIsPlayingState,
    currentTime: currentTimeState,
    duration: durationState,
    volume: volumeState,
    isLoading: isLoadingState,
    error: errorState,
    muted: mutedState,
    currentTrack: trackState,
    seekTo: seek,
    toggleMute: toggleMuteFunc,
    playTrack: playTrackFunc,
    setVolume: setVolumeFunc
  };
}

export default useAudioPlayerState;
