
import { useState, useEffect } from 'react';
import { Track } from '@/services/music/types';

/**
 * Hook to manage audio playback functionality
 */
export function useAudioPlayer() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7); // 0 to 1
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [audio] = useState<HTMLAudioElement | null>(
    typeof window !== 'undefined' ? new Audio() : null
  );

  // Handle audio playback
  useEffect(() => {
    if (!audio) return;

    // Set volume
    audio.volume = volume;

    // Set up audio event listeners
    const handleEnded = () => {
      // When track ends, we'll let the parent component handle what happens next
      if (repeat) {
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.error('Error playing audio on repeat:', error);
        });
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [audio, volume, repeat]);

  // Update audio source when current track changes
  useEffect(() => {
    if (!audio || !currentTrack) return;

    audio.src = currentTrack.url;
    
    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    }
  }, [audio, currentTrack]);

  // Toggle play/pause when isPlaying changes
  useEffect(() => {
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [audio, isPlaying]);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const toggleRepeat = () => {
    setRepeat(prev => !prev);
  };

  const toggleShuffle = () => {
    setShuffle(prev => !prev);
  };

  return {
    currentTrack,
    isPlaying,
    volume,
    repeat,
    shuffle,
    playTrack,
    pauseTrack,
    setVolume,
    toggleRepeat,
    toggleShuffle,
    setCurrentTrack
  };
}
