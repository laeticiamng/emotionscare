
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/contexts/MusicContext';
import { topMediaMusicService } from '@/services/music/topMediaService';

// Interface pour les paramètres envoyés vers le service de musique
export interface EmotionMusicParams {
  emotion: string;
  intensity?: number;
}

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
  const [generatedSongId, setGeneratedSongId] = useState<string | null>(null);
  const { toast } = useToast();
  const { loadPlaylistForEmotion, playTrack, setOpenDrawer } = useMusic();

  // Generate music based on emotion directly using TopMedia API
  const generateMusicForEmotion = async (emotion: string): Promise<string | null> => {
    try {
      console.log(`Generating music for emotion: ${emotion}`);
      
      // Get suggestion for this emotion
      const suggestion = topMediaMusicService.getMoodSuggestions(emotion.toLowerCase());
      
      const params = {
        is_auto: 1, // Auto generate
        prompt: suggestion.prompt || `Music that evokes the feeling of being ${emotion}`,
        title: suggestion.title || `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Mood`,
        instrumental: suggestion.instrumental ? 1 : 0,
        lyrics: suggestion.lyrics
      };

      const { song_id } = await topMediaMusicService.generateMusic(params);
      setGeneratedSongId(song_id);
      
      console.log('Music generation result:', song_id);
      return song_id;
    } catch (error) {
      console.error('Error generating music:', error);
      return null;
    }
  };

  // Check status of generated music
  const checkMusicStatus = async (songId: string): Promise<{url?: string, status: string}> => {
    try {
      const result = await topMediaMusicService.checkGenerationStatus(songId);
      return {
        url: result.url,
        status: result.status
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
          const statusCheckInterval = setInterval(async () => {
            const status = await checkMusicStatus(songId);
            
            if (status.status === 'completed' && status.url) {
              clearInterval(statusCheckInterval);
              
              // Create a track from the generated music
              const generatedTrack = {
                id: songId,
                title: `${params.emotion.charAt(0).toUpperCase() + params.emotion.slice(1)} Mélodie`,
                artist: 'TopMedia AI',
                duration: 180,
                url: status.url,
                coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
              };
              
              playTrack(generatedTrack);
              setOpenDrawer(true);
              
              toast({
                title: "Musique générée",
                description: `Une mélodie basée sur votre émotion: ${params.emotion} est prête`,
              });
              
              setLastPlayedEmotion(params.emotion);
            } else if (status.status === 'failed') {
              clearInterval(statusCheckInterval);
              
              toast({
                title: "Échec de la génération",
                description: "Impossible de générer la musique. Veuillez réessayer.",
                variant: "destructive"
              });
            }
          }, 5000); // Check every 5 seconds
          
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
    lastPlayedEmotion,
    generatedSongId
  };
};

export default useMusicEmotionIntegration;
