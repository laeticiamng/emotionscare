
/**
 * Hook useDalle
 * 
 * Ce hook fournit une interface React pour utiliser les services de génération d'images DALL-E
 * avec gestion d'état, chargement, et affichage.
 */
import { useState, useCallback } from 'react';
import { dalle } from '@/services';
import { DalleOptions } from '@/services/dalle';
import { useToast } from '@/hooks/use-toast';

interface UseDalleOptions {
  onImageGenerated?: (imageUrl: string) => void;
  onError?: (error: Error) => void;
}

export function useDalle(options: UseDalleOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const { toast } = useToast();
  
  const { 
    onImageGenerated,
    onError 
  } = options;
  
  /**
   * Génère une image avec les options spécifiées
   */
  const generateImage = useCallback(async (prompt: string, options?: DalleOptions) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Génère l'image
      const result = await dalle.generateImage(prompt, options);
      
      if (!result.url) {
        throw new Error('No image URL returned from DALL-E');
      }
      
      // Stocke l'URL de l'image
      setImageUrl(result.url);
      
      // Notification
      toast({
        title: "Image générée",
        description: "Votre image a été générée avec succès.",
      });
      
      // Callback utilisateur
      if (onImageGenerated) {
        onImageGenerated(result.url);
      }
      
      return result.url;
    } catch (err) {
      console.error('Error generating image:', err);
      setError(err as Error);
      
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer l'image. Veuillez réessayer.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [onImageGenerated, onError, toast]);
  
  /**
   * Génère une image représentant une émotion
   */
  const generateEmotionImage = useCallback(async (emotion: string, options?: Partial<DalleOptions>) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Génère l'image basée sur l'émotion
      const url = await dalle.generateEmotionImage(emotion, options);
      setImageUrl(url);
      
      // Notification
      toast({
        title: "Image générée",
        description: `Image représentant l'émotion "${emotion}" générée avec succès.`,
      });
      
      // Callback utilisateur
      if (onImageGenerated) {
        onImageGenerated(url);
      }
      
      return url;
    } catch (err) {
      console.error('Error generating emotion image:', err);
      setError(err as Error);
      
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer l'image émotionnelle. Veuillez réessayer.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [onImageGenerated, onError, toast]);
  
  /**
   * Génère une image personnalisée pour un utilisateur
   */
  const generatePersonalizedImage = useCallback(async (
    interests: string[],
    mood: string,
    options?: Partial<DalleOptions>
  ) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      // Génère l'image personnalisée
      const url = await dalle.generatePersonalizedImage(interests, mood, options);
      setImageUrl(url);
      
      // Notification
      toast({
        title: "Image personnalisée",
        description: "Votre image personnalisée a été générée avec succès.",
      });
      
      // Callback utilisateur
      if (onImageGenerated) {
        onImageGenerated(url);
      }
      
      return url;
    } catch (err) {
      console.error('Error generating personalized image:', err);
      setError(err as Error);
      
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer l'image personnalisée. Veuillez réessayer.",
        variant: "destructive",
      });
      
      if (onError) onError(err as Error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [onImageGenerated, onError, toast]);
  
  /**
   * Réinitialise l'état du hook
   */
  const reset = useCallback(() => {
    setImageUrl(null);
    setError(null);
  }, []);
  
  return {
    isGenerating,
    imageUrl,
    error,
    generateImage,
    generateEmotionImage,
    generatePersonalizedImage,
    reset
  };
}

export default useDalle;
