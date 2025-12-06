
import { useState } from 'react';
import { dalle } from '@/services';
import { useToast } from '@/hooks/use-toast';
import { DALLEOptions } from '@/services/dalle';

export function useDalle() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);

  /**
   * Génère une image avec DALL-E
   */
  const generateImage = async (prompt: string, options?: DALLEOptions): Promise<string> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const imageUrl = await dalle.generateImage(prompt, options);
      setGeneratedImage(imageUrl);
      
      toast({
        title: "Image générée",
        description: "Votre image a été générée avec succès."
      });
      
      return imageUrl;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Erreur de génération",
        description: error.message,
        variant: "destructive"
      });
      return '';
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Génère des variations d'une image existante
   */
  const generateVariations = async (imageUrl: string, options?: DALLEOptions): Promise<string[]> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const variations = await dalle.generateVariations(imageUrl, options);
      setGeneratedImage(variations[0] || '');
      
      toast({
        title: "Variations générées",
        description: "Les variations d'image ont été générées avec succès."
      });
      
      return variations;
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast({
        title: "Erreur de génération",
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsGenerating(false);
    }
  };
  
  return {
    generateImage,
    generateVariations,
    generatedImage,
    isGenerating,
    error
  };
}

export default useDalle;
