
import { useState } from 'react';
import { MusicTrack } from '@/types/music';

export const useMusicGen = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTrack, setGeneratedTrack] = useState<MusicTrack | null>(null);

  const generateMusic = async (emotion: string, duration = 120): Promise<MusicTrack> => {
    setIsGenerating(true);
    
    // Simulation de génération IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const track: MusicTrack = {
      id: Date.now().toString(),
      title: `Musique ${emotion} générée`,
      artist: 'IA Music Generator',
      url: '/audio/generated-music.mp3',
      duration,
      emotion: emotion.toLowerCase(),
      coverUrl: '/images/ai-generated-cover.jpg'
    };
    
    setGeneratedTrack(track);
    setIsGenerating(false);
    return track;
  };

  return {
    isGenerating,
    generatedTrack,
    generateMusic
  };
};
