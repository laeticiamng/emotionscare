
import { useState, useEffect, useCallback } from 'react';
import { EmotionMusicParams } from '@/types/music';

export function useEmotionMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState(0.5); // 0 to 1
  const [isLoading, setIsLoading] = useState(false);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.volume = volume;
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Update volume when changed
  useEffect(() => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  }, [volume, audioElement]);

  // Generate and play music based on emotion
  const playEmotionMusic = useCallback(async (params: EmotionMusicParams) => {
    if (!audioElement) return;

    try {
      setIsLoading(true);
      
      // In a real implementation, this would call a Music Generation API
      // For now, we just use placeholder audio URLs based on emotion
      const audioUrls: Record<string, string> = {
        joy: 'https://example.com/audio/joy.mp3',
        sadness: 'https://example.com/audio/sadness.mp3',
        anger: 'https://example.com/audio/anger.mp3',
        fear: 'https://example.com/audio/fear.mp3',
        surprise: 'https://example.com/audio/surprise.mp3',
        calm: 'https://example.com/audio/calm.mp3',
        neutral: 'https://example.com/audio/neutral.mp3'
      };
      
      // Use neutral as fallback
      const audioUrl = audioUrls[params.emotion] || audioUrls.neutral;
      
      // For demo purposes, use a placeholder audio
      // In production, replace with the actual generated music URL
      audioElement.src = audioUrl;
      
      await audioElement.play();
      setIsPlaying(true);
      setCurrentEmotion(params.emotion);
    } catch (error) {
      console.error('Error playing emotion music:', error);
    } finally {
      setIsLoading(false);
    }
  }, [audioElement]);

  const stopMusic = useCallback(() => {
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  }, [audioElement]);

  const toggleMusic = useCallback(() => {
    if (!audioElement) return;
    
    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play().catch(error => {
        console.error('Error playing audio:', error);
      });
      setIsPlaying(true);
    }
  }, [audioElement, isPlaying]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  return {
    playEmotionMusic,
    stopMusic,
    toggleMusic,
    isPlaying,
    currentEmotion,
    volume,
    setVolume,
    isLoading
  };
}

export default useEmotionMusic;
