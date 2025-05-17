
/**
 * Service DALL-E
 * 
 * Ce service gère l'intégration avec l'API DALL-E d'OpenAI pour la génération d'images.
 */
import { env } from '@/env.mjs';

// Types pour les options de génération d'images
export interface DALLEOptions {
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
  n?: number;
  style?: 'vivid' | 'natural';
  user?: string;
}

/**
 * Vérifie la connectivité avec l'API DALL-E
 */
export async function checkApiConnection(): Promise<boolean> {
  try {
    // DALL-E utilise la même API que OpenAI, donc la vérification est similaire
    const apiKey = env.NEXT_PUBLIC_OPENAI_API_KEY;
    return !!apiKey;
  } catch (error) {
    console.error('DALL-E API connection check failed:', error);
    return false;
  }
}

/**
 * Génère une image avec DALL-E
 * @param prompt Description textuelle de l'image souhaitée
 * @param options Options de génération
 * @returns URL de l'image générée
 */
export async function generateImage(prompt: string, options: DALLEOptions = {}): Promise<string> {
  const apiKey = env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key is not set in environment variables');
  }
  
  const defaultOptions: DALLEOptions = {
    size: '1024x1024',
    quality: 'standard',
    n: 1,
    style: 'vivid'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    // Appel à l'API DALL-E via OpenAI
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        n: mergedOptions.n,
        size: mergedOptions.size,
        quality: mergedOptions.quality,
        style: mergedOptions.style,
        user: mergedOptions.user
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate image with DALL-E');
    }
    
    const data = await response.json();
    return data.data[0].url || '';
  } catch (error) {
    console.error('Error generating image with DALL-E:', error);
    throw error;
  }
}

/**
 * Génère plusieurs variations d'une image
 * @param imageUrl URL de l'image source
 * @param options Options de génération
 * @returns Liste des URLs des images générées
 */
export async function generateVariations(imageUrl: string, options: DALLEOptions = {}): Promise<string[]> {
  // Cette fonctionnalité n'est pas encore implémentée
  // En production, il faudrait convertir l'URL en File ou Blob
  throw new Error('Image variations are not yet implemented');
}

export default {
  generateImage,
  generateVariations,
  checkApiConnection
};
