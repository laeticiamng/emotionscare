/**
 * DALL-E Service
 * Utilise les Edge Functions Supabase pour la génération d'images sécurisée
 */
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface DALLEOptions {
  size?: '256x256' | '512x512' | '1024x1024';
  n?: number;
  responseFormat?: 'url' | 'b64_json';
}

// NOTE: Fallback images removed. API failures must surface real errors to the user.

/**
 * Génère une image via l'Edge Function analyze-image/generate
 */
const generateImage = async (prompt: string, options: DALLEOptions = {}): Promise<string> => {
  try {
    // Utiliser l'Edge Function pour la génération d'images
    const { data, error } = await supabase.functions.invoke('analyze-image', {
      body: {
        action: 'generate',
        prompt,
        size: options.size || '512x512',
        n: options.n || 1,
      },
    });

    if (error) {
      logger.error('Image generation via Edge Function failed', { error: error.message }, 'DALLE');
      throw new Error(`Image generation failed: ${error.message}`);
    }

    if (!data?.imageUrl) {
      throw new Error('Image generation returned no image URL');
    }

    return data.imageUrl;
  } catch (error) {
    logger.error('DALL-E generation error', error instanceof Error ? error : new Error(String(error)), 'DALLE');
    throw error instanceof Error ? error : new Error(String(error));
  }
};


/**
 * Génère des variations d'une image
 */
const generateVariations = async (imageUrl: string, _options: DALLEOptions = {}): Promise<string[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-image', {
      body: {
        action: 'variations',
        imageUrl,
      },
    });

    if (error) {
      throw new Error(`Image variations failed: ${error.message}`);
    }

    return data?.imageUrls || [imageUrl];
  } catch (error) {
    logger.error('DALL-E variations error', error instanceof Error ? error : new Error(String(error)), 'DALLE');
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Vérifie la connexion à l'API
 */
const checkApiConnection = async (): Promise<{ status: boolean; message: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('health-check', {
      body: { service: 'image-generation' },
    });
    
    if (error) {
      return { 
        status: false, 
        message: `Image API connection failed: ${error.message}` 
      };
    }
    
    return { status: true, message: 'Image API connection successful' };
  } catch (error) {
    return { 
      status: false, 
      message: `Image API connection failed: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};

/**
 * Génère une image basée sur une émotion
 */
export const generateEmotionImage = async (emotion: string, options: DALLEOptions = {}): Promise<string> => {
  const prompt = `Create an abstract image representing the emotion "${emotion}". The image should convey the feeling without showing faces or people.`;
  return generateImage(prompt, options);
};

/**
 * Génère une image personnalisée
 */
export const generatePersonalizedImage = async (userContext: string, emotion: string, options: DALLEOptions = {}): Promise<string> => {
  const prompt = `Create a personalized abstract image representing "${emotion}" for ${userContext}. The image should be appropriate and convey the feeling without showing identifiable people.`;
  return generateImage(prompt, options);
};

export default {
  generateImage,
  generateVariations,
  checkApiConnection,
  generateEmotionImage,
  generatePersonalizedImage
};
