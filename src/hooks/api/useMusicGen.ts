
import { useState } from 'react';
import { MusicTrack } from '@/types/music';
import { useMusic } from '@/hooks/useMusic';

export function useMusicGen() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<MusicTrack | null>(null);
  const { playTrack } = useMusic();

  const generateMusic = async (prompt: string): Promise<MusicTrack | null> => {
    setIsGenerating(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated track
      const newTrack: MusicTrack = {
        id: `gen-${Date.now()}`,
        title: `Generated from: ${prompt.slice(0, 20)}...`,
        artist: 'AI Composer',
        duration: 180,
        audioUrl: '/audio/generated-audio.mp3',
        url: '/audio/generated-audio.mp3',
        coverUrl: '/images/ai-generated-music.jpg',
        // Additional required properties
        album: 'AI Generated',
        year: new Date().getFullYear(),
        genre: 'Electronic',
      };
      
      setGeneratedTrack(newTrack);
      return newTrack;
    } catch (error) {
      console.error('Error generating music:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const playGeneratedMusic = (track?: MusicTrack | null) => {
    const trackToPlay = track || generatedTrack;
    if (trackToPlay && playTrack) {
      playTrack(trackToPlay);
    }
  };

  return {
    generateMusic,
    playGeneratedMusic,
    generatedTrack,
    isGenerating
  };
}

export default useMusicGen;
