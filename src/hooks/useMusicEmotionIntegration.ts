
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';

// Interface pour les paramètres envoyés vers le service de musique
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

// TopMedia API key - This should ideally come from environment variables in production
const API_KEY = '1e4228c100304c658ab1eab4333f54be'; // This is the key shown in the screenshot
const API_BASE_URL = 'https://api.topmusicai.com/v1';

// Descriptions des musiques par émotion
const musicDescriptions: Record<string, string> = {
  happy: "Des mélodies joyeuses et dynamiques pour amplifier votre bonne humeur.",
  sad: "Des compositions apaisantes qui vous aideront à traverser ce moment difficile.",
  angry: "De la musique équilibrante pour canaliser votre énergie et retrouver le calme.",
  anxious: "Des sonorités douces et relaxantes pour apaiser votre anxiété.",
  calm: "Des ambiances paisibles pour maintenir votre état de sérénité.",
  excited: "Des rythmes entraînants pour accompagner votre enthousiasme.",
  neutral: "Une sélection équilibrée adaptée à votre humeur neutre.",
};

export const useMusicEmotionIntegration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastPlayedEmotion, setLastPlayedEmotion] = useState<string | null>(null);
  const { toast } = useToast();
  const { loadPlaylistForEmotion, playTrack, setOpenDrawer } = useMusic();

  // Generate music based on emotion directly using TopMedia API
  const generateMusicForEmotion = async (emotion: string): Promise<string | null> => {
    try {
      console.log(`Generating music for emotion: ${emotion}`);
      
      const body = {
        is_auto: 1, // Auto generate
        prompt: `Music that evokes the feeling of being ${emotion}`,
        title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Mood`,
        instrumental: 1 // Instrumental track
      };

      const response = await fetch(`${API_BASE_URL}/music`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Music generation result:', data);
      
      return data.song_id || null;
    } catch (error) {
      console.error('Error generating music:', error);
      return null;
    }
  };

  // Check status of generated music
  const checkMusicStatus = async (songId: string): Promise<{url?: string, status: string}> => {
    try {
      const response = await fetch(`${API_BASE_URL}/query?song_id=${songId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        url: data.url,
        status: data.status
      };
    } catch (error) {
      console.error('Error checking music status:', error);
      return {
        status: 'error'
      };
    }
  };

  // Fonction pour activer la musique correspondante à l'émotion
  const activateMusicForEmotion = async (params: EmotionMusicParams): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      console.log(`Activating music for emotion: ${params.emotion} with intensity: ${params.intensity}`);
      
      // First try to use the existing playlist
      const playlist = await loadPlaylistForEmotion(params.emotion.toLowerCase());
      
      if (playlist && playlist.tracks && playlist.tracks.length > 0) {
        // Assurer que les pistes ont les propriétés requises
        const track = {
          ...playlist.tracks[0],
          duration: playlist.tracks[0].duration || 0,
          url: playlist.tracks[0].url || playlist.tracks[0].audioUrl || playlist.tracks[0].coverUrl || ''
        };
        
        // Jouer la première piste
        playTrack(track);
        setOpenDrawer(true);
        
        toast({
          title: "Musique activée",
          description: `Lecture basée sur l'émotion: ${params.emotion}`,
        });
        
        setLastPlayedEmotion(params.emotion);
        return true;
      } else {
        // If no existing playlist, generate music using TopMedia API
        const songId = await generateMusicForEmotion(params.emotion);
        if (songId) {
          toast({
            title: "Génération de musique",
            description: `Création d'une musique basée sur votre émotion: ${params.emotion}`,
          });
          
          // In real implementation, you would poll for status until completed
          // For demo purposes, we'll simulate a successful generation
          
          // Simulated music track
          const generatedTrack = {
            id: songId,
            title: `${params.emotion.charAt(0).toUpperCase() + params.emotion.slice(1)} Mélodie`,
            artist: 'IA Composer',
            duration: 180,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Demo URL
            coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
          };
          
          playTrack(generatedTrack);
          setOpenDrawer(true);
          
          toast({
            title: "Musique générée",
            description: `Une mélodie basée sur votre émotion: ${params.emotion} est prête`,
          });
          
          setLastPlayedEmotion(params.emotion);
          return true;
        } else {
          console.log("Failed to generate music for emotion:", params.emotion);
          toast({
            title: "Erreur de génération",
            description: `Impossible de générer de la musique pour l'émotion ${params.emotion}`,
            variant: "destructive"
          });
          return false;
        }
      }
    } catch (error) {
      console.error("Error activating music for emotion:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer la musique pour cette émotion",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Obtenir la description de la musique pour une émotion
  const getEmotionMusicDescription = (emotion: string): string => {
    return musicDescriptions[emotion.toLowerCase()] || 
      "Une musique spécialement sélectionnée pour s'accorder à votre état émotionnel actuel.";
  };

  return {
    activateMusicForEmotion,
    getEmotionMusicDescription,
    generateMusicForEmotion,
    checkMusicStatus,
    isLoading,
    lastPlayedEmotion
  };
};

export default useMusicEmotionIntegration;
