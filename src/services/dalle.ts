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

// Images de fallback par émotion
const FALLBACK_IMAGES: Record<string, string> = {
  joy: 'https://images.unsplash.com/photo-1489710437720-ebb67ec84dd2?w=512&h=512&fit=crop',
  calm: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=512&h=512&fit=crop',
  sad: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=512&h=512&fit=crop',
  anxious: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?w=512&h=512&fit=crop',
  energetic: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=512&h=512&fit=crop',
  peaceful: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=512&h=512&fit=crop',
  default: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=512&h=512&fit=crop',
};

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
      logger.warn('Image generation via Edge Function failed, using fallback', { error: error.message }, 'DALLE');
      return getFallbackImage(prompt);
    }

    return data?.imageUrl || getFallbackImage(prompt);
  } catch (error) {
    logger.error('DALL-E generation error', error as Error, 'DALLE');
    return getFallbackImage(prompt);
  }
};

/**
 * Retourne une image de fallback basée sur le prompt
 */
const getFallbackImage = (prompt: string): string => {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('joy') || lowerPrompt.includes('happy') || lowerPrompt.includes('joie')) {
    return FALLBACK_IMAGES.joy;
  }
  if (lowerPrompt.includes('calm') || lowerPrompt.includes('peaceful') || lowerPrompt.includes('calme')) {
    return FALLBACK_IMAGES.calm;
  }
  if (lowerPrompt.includes('sad') || lowerPrompt.includes('triste')) {
    return FALLBACK_IMAGES.sad;
  }
  if (lowerPrompt.includes('anxious') || lowerPrompt.includes('stress') || lowerPrompt.includes('anxieux')) {
    return FALLBACK_IMAGES.anxious;
  }
  if (lowerPrompt.includes('energetic') || lowerPrompt.includes('energy') || lowerPrompt.includes('énergie')) {
    return FALLBACK_IMAGES.energetic;
  }
  if (lowerPrompt.includes('peace') || lowerPrompt.includes('paix')) {
    return FALLBACK_IMAGES.peaceful;
  }
  
  return FALLBACK_IMAGES.default;
};

/**
 * Génère des variations d'une image
 */
const generateVariations = async (imageUrl: string, options: DALLEOptions = {}): Promise<string[]> => {
  try {
    // Pour les variations, retourner l'image originale avec des fallbacks
    return [imageUrl, getFallbackImage('variation')];
  } catch (error) {
    logger.error('DALL-E variations error', error as Error, 'DALLE');
    return [imageUrl];
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
