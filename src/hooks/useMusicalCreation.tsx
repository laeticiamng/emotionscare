
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  generateLyrics, 
  generateMusic,
  submitMusicGenerationTask, 
  checkGenerationStatus, 
  saveUserMusicCreation,
  getUserMusicCreations,
  MusicCreation
} from '@/services/music/music-generator-service';

export function useMusicalCreation() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [creations, setCreations] = useState<MusicCreation[]>([]);
  const [currentCreation, setCurrentCreation] = useState<MusicCreation | null>(null);
  const [generatedLyrics, setGeneratedLyrics] = useState<string>('');
  const { toast } = useToast();

  // Generate lyrics based on a theme/prompt
  const handleGenerateLyrics = useCallback(async (prompt: string) => {
    setIsLoading(true);
    try {
      const lyrics = await generateLyrics(prompt);
      setGeneratedLyrics(lyrics);
      toast({
        title: "Paroles générées",
        description: "Les paroles ont été créées avec succès",
      });
      return lyrics;
    } catch (error) {
      console.error('Error generating lyrics:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les paroles",
        variant: "destructive"
      });
      return '';
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create a new music creation
  const createMusicTrack = useCallback(async (params: {
    title: string;
    prompt: string;
    lyrics?: string;
    instrumental: boolean;
  }) => {
    setIsLoading(true);
    setIsProcessing(true);
    
    try {
      // Start the music generation process
      const { song_id } = await submitMusicGenerationTask({
        is_auto: params.lyrics ? 0 : 1,
        prompt: params.prompt,
        lyrics: params.lyrics,
        title: params.title,
        instrumental: params.instrumental ? 1 : 0,
        model_version: 'v3.5' // Using latest model
      });
      
      // Create a representation of our music creation
      const newCreation: Omit<MusicCreation, 'createdAt'> = {
        id: song_id,
        userId: 'current-user', // Would come from auth context in real app
        title: params.title,
        prompt: params.prompt,
        lyrics: params.lyrics,
        status: 'processing',
        instrumental: params.instrumental
      };
      
      // Save the creation to user's library
      const savedCreation = await saveUserMusicCreation(newCreation);
      setCurrentCreation(savedCreation);
      
      toast({
        title: "Création musicale démarrée",
        description: "Votre morceau est en cours de génération",
      });
      
      // Start polling for status
      let completed = false;
      const checkStatusInterval = setInterval(async () => {
        if (completed) {
          clearInterval(checkStatusInterval);
          return;
        }
        
        try {
          const status = await checkGenerationStatus(song_id);
          setProgress(status.progress || 0);
          
          if (status.status === 'completed' && status.url) {
            completed = true;
            clearInterval(checkStatusInterval);
            
            // Update the creation with completed status and URL
            const updatedCreation: MusicCreation = {
              ...savedCreation,
              status: 'completed',
              audioUrl: status.url
            };
            
            setCurrentCreation(updatedCreation);
            // Update creations list
            setCreations(prev => [...prev.filter(c => c.id !== updatedCreation.id), updatedCreation]);
            
            toast({
              title: "Création terminée",
              description: "Votre morceau est prêt à être écouté",
            });
            
            setIsProcessing(false);
          } else if (status.status === 'failed') {
            completed = true;
            clearInterval(checkStatusInterval);
            
            const updatedCreation: MusicCreation = {
              ...savedCreation,
              status: 'failed'
            };
            
            setCurrentCreation(updatedCreation);
            // Update creations list
            setCreations(prev => [...prev.filter(c => c.id !== updatedCreation.id), updatedCreation]);
            
            toast({
              title: "Erreur de génération",
              description: status.error || "Une erreur est survenue lors de la génération",
              variant: "destructive"
            });
            
            setIsProcessing(false);
          }
        } catch (checkError) {
          console.error('Error checking status:', checkError);
        }
      }, 5000); // Check every 5 seconds
      
      return song_id;
    } catch (error) {
      console.error('Error creating music track:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le morceau musical",
        variant: "destructive"
      });
      setIsProcessing(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Load user's music creations
  const loadUserCreations = useCallback(async () => {
    setIsLoading(true);
    try {
      const userCreations = await getUserMusicCreations('current-user');
      setCreations(userCreations);
      return userCreations;
    } catch (error) {
      console.error('Error loading user creations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos créations musicales",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    isProcessing,
    progress,
    creations,
    currentCreation,
    generatedLyrics,
    handleGenerateLyrics,
    createMusicTrack,
    loadUserCreations,
    setCurrentCreation
  };
}
