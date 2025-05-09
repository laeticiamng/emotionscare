
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  generateLyrics, 
  submitMusicGenerationTask,
  checkGenerationStatus,
  saveUserMusicCreation 
} from '@/services/music/music-generator-service';
import { useAuth } from '@/contexts/AuthContext';
import { useMusic } from '@/contexts/MusicContext';

interface MusicCreationParams {
  title: string;
  prompt: string;
  lyrics?: string;
  instrumental: boolean;
  mood?: string;
}

export function useMusicalCreation() {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const { user } = useAuth();
  const { loadPlaylistForEmotion } = useMusic();
  
  // Generate lyrics based on a prompt
  const handleGenerateLyrics = async (prompt: string): Promise<string> => {
    setIsLoading(true);
    try {
      const text = await generateLyrics(prompt);
      toast({
        title: "Paroles générées",
        description: "Vos paroles ont été créées avec succès"
      });
      return text;
    } catch (error) {
      console.error('Error generating lyrics:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les paroles",
        variant: "destructive"
      });
      return "";
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a new music track
  const createMusicTrack = async (params: MusicCreationParams) => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour créer de la musique",
        variant: "destructive"
      });
      return null;
    }
    
    setIsLoading(true);
    try {
      // Start the music generation process
      const { song_id, task_id } = await submitMusicGenerationTask({
        is_auto: 1,
        prompt: params.prompt,
        lyrics: params.lyrics,
        title: params.title,
        instrumental: params.instrumental ? 1 : 0,
        mood: params.mood
      });
      
      // Poll for status
      setIsLoading(false);
      setIsProcessing(true);
      
      const trackResult = await pollGenerationStatus(song_id);
      
      if (trackResult) {
        // Save the creation to the user's library
        const savedCreation = await saveUserMusicCreation({
          id: song_id,
          userId: user.id,
          title: params.title,
          prompt: params.prompt,
          lyrics: params.lyrics,
          audioUrl: trackResult.url,
          status: 'completed',
          instrumental: params.instrumental,
          mood: params.mood
        });
        
        toast({
          title: "Musique créée",
          description: "Votre création musicale a été sauvegardée"
        });
        
        // Load a corresponding playlist if appropriate
        if (params.mood) {
          loadPlaylistForEmotion(params.mood);
        }
        
        return savedCreation;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating music track:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la piste musicale",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
      setProgress(0);
    }
  };
  
  // Poll for music generation status
  const pollGenerationStatus = async (songId: string) => {
    let status = 'pending';
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes with 5-second intervals
    
    while (status !== 'completed' && status !== 'failed' && attempts < maxAttempts) {
      attempts++;
      
      try {
        const result = await checkGenerationStatus(songId);
        status = result.status;
        
        // Update progress
        if (result.progress) {
          setProgress(result.progress);
        } else {
          setProgress(Math.min(99, attempts * 5)); // Simulate progress if not provided
        }
        
        if (status === 'completed') {
          return result;
        }
        
        if (status === 'failed') {
          throw new Error(result.error || "La génération a échoué");
        }
        
        // Wait before polling again
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.error('Error polling generation status:', error);
        throw error;
      }
    }
    
    if (attempts >= maxAttempts) {
      throw new Error("Le temps de génération a expiré");
    }
    
    return null;
  };
  
  return {
    isLoading,
    isProcessing,
    progress,
    handleGenerateLyrics,
    createMusicTrack
  };
}
