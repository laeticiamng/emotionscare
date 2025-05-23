
import { useState } from 'react';
import { toast } from 'sonner';
import { AudioTrack } from '@/types/audio';

export function useMusicGen() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [generatedTrack, setGeneratedTrack] = useState<AudioTrack | null>(null);
  
  /**
   * Génère une piste musicale basée sur une description
   */
  const generateMusic = async (options: any) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // En production, appel à l'API MusicGen
      // const response = await fetch('https://api.example.com/music-gen', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${MUSIC_API_KEY}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     prompt: options.prompt,
      //     duration: options.duration || 30
      //   })
      // });
      
      // Simuler un délai pour la démo
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Création d'une piste audio fictive pour la démo
      const track: AudioTrack = {
        id: `gen-${Date.now()}`,
        title: options.title || `Généré: ${options.prompt.substring(0, 20)}...`,
        artist: 'AI Composer',
        duration: options.duration || 180,
        url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
        audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
        coverUrl: `https://source.unsplash.com/random/300x300/?music&sig=${Date.now()}`,
        album: 'IA Generated',
        year: new Date().getFullYear(),
        genre: options.prompt.toLowerCase().includes('calme') ? 'Ambient' : 'Electronic',
      };
      
      setGeneratedTrack(track);
      return track;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      setError(error);
      toast.error(`Erreur lors de la génération de musique: ${error.message}`);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };
  
  /**
   * Génère une piste musicale basée sur une émotion
   */
  const generateMusicByEmotion = async (emotion: string, options: any = {}) => {
    // Transforme l'émotion en prompt
    let prompt = '';
    switch (emotion.toLowerCase()) {
      case 'joy':
      case 'happiness':
        prompt = 'Une mélodie joyeuse et énergique avec des tonalités positives';
        break;
      case 'sadness':
        prompt = 'Une composition douce et mélancolique avec des notes apaisantes';
        break;
      case 'anger':
        prompt = 'Une musique intense avec des rythmes forts et des tonalités graves';
        break;
      case 'fear':
        prompt = 'Une ambiance tendue avec des notes mystérieuses et des sons ambients';
        break;
      case 'surprise':
        prompt = 'Une mélodie inattendue avec des changements rythmiques surprenants';
        break;
      case 'disgust':
        prompt = 'Une composition discordante avec des textures sonores inhabituelles';
        break;
      default:
        prompt = 'Une musique ambient relaxante avec des sons de la nature';
    }
    
    return generateMusic({
      ...options,
      prompt,
      title: `Musique pour l'émotion: ${emotion}`
    });
  };
  
  return {
    generateMusic,
    generateMusicByEmotion,
    generatedTrack,
    isGenerating,
    error
  };
}

export default useMusicGen;
