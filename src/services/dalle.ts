
/**
 * Service DALL-E
 * 
 * Ce service gère l'intégration avec l'API DALL-E d'OpenAI pour la génération d'images.
 */
import { env } from '@/env.mjs';

// Types pour les options de génération d'images
export interface DalleOptions {
  model?: string; // Modèle DALL-E à utiliser
  n?: number; // Nombre d'images à générer
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792'; // Taille de l'image
  quality?: 'standard' | 'hd'; // Qualité de l'image
  style?: 'vivid' | 'natural'; // Style visuel
  responseFormat?: 'url' | 'b64_json'; // Format de la réponse
}

// Types pour les résultats
export interface DalleImageResult {
  url?: string;
  b64_json?: string;
  revisedPrompt?: string;
}

/**
 * Récupère la clé API OpenAI depuis les variables d'environnement
 * @returns La clé API ou lance une erreur
 */
function getApiKey(): string {
  const key = env.NEXT_PUBLIC_OPENAI_API_KEY;
  if (!key) {
    throw new Error('OpenAI API key is not set in environment variables');
  }
  return key;
}

/**
 * Génère une image avec DALL-E
 * @param prompt Description de l'image à générer
 * @param options Options de génération
 * @returns Informations sur l'image générée
 */
export async function generateImage(
  prompt: string,
  options: DalleOptions = {}
): Promise<DalleImageResult> {
  try {
    // Options par défaut
    const defaultOptions = {
      model: 'dall-e-3',
      n: 1,
      size: '1024x1024' as const,
      quality: 'standard' as const,
      style: 'vivid' as const,
      responseFormat: 'url' as const
    };
    
    // Fusion des options
    const mergedOptions = { ...defaultOptions, ...options };
    
    // Préparation de la requête
    const body = {
      prompt,
      model: mergedOptions.model,
      n: mergedOptions.n,
      size: mergedOptions.size,
      quality: mergedOptions.quality,
      style: mergedOptions.style,
      response_format: mergedOptions.responseFormat
    };
    
    // Appel à l'API
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getApiKey()}`
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error?.error?.message || 'Failed to generate image');
    }
    
    const data = await response.json();
    
    // Renvoie le premier résultat (n=1 par défaut)
    return {
      url: data.data[0]?.url,
      b64_json: data.data[0]?.b64_json,
      revisedPrompt: data.data[0]?.revised_prompt
    };
  } catch (error) {
    console.error('Error generating image with DALL-E:', error);
    throw error;
  }
}

/**
 * Génère une image adaptée à une émotion spécifique
 * @param emotion L'émotion à représenter
 * @param options Options additionnelles
 * @returns URL de l'image générée
 */
export async function generateEmotionImage(
  emotion: string,
  options: Partial<DalleOptions> = {}
): Promise<string> {
  const emotionPrompts: Record<string, string> = {
    happy: "A bright, colorful scene that evokes happiness and joy, with soft warm colors",
    sad: "A gentle, reflective scene with muted blue tones that conveys a sense of melancholy",
    calm: "A tranquil nature scene with peaceful elements like still water or gentle clouds",
    anxious: "A soothing abstract representation of anxiety being transformed into calm",
    angry: "A therapeutic visual representation of anger diffusing into serenity",
    confident: "An empowering abstract scene with bold colors representing strength and confidence",
    neutral: "A balanced, harmonious landscape with soft natural elements"
  };
  
  const prompt = emotionPrompts[emotion.toLowerCase()] || 
    `A therapeutic visual representation of the emotion: ${emotion}`;
  
  const result = await generateImage(prompt, {
    style: 'natural',
    ...options
  });
  
  if (!result.url) {
    throw new Error('Failed to generate emotion image');
  }
  
  return result.url;
}

/**
 * Génère une image basée sur le profil d'un utilisateur
 * @param interests Centres d'intérêt de l'utilisateur
 * @param mood Humeur actuelle
 * @param options Options additionnelles
 * @returns URL de l'image générée
 */
export async function generatePersonalizedImage(
  interests: string[],
  mood: string,
  options: Partial<DalleOptions> = {}
): Promise<string> {
  // Construction du prompt
  const interestsText = interests.join(', ');
  const prompt = `A beautiful, inspiring scene related to ${interestsText} that evokes a feeling of ${mood}. The image should be therapeutic and uplifting.`;
  
  const result = await generateImage(prompt, {
    style: 'vivid',
    ...options
  });
  
  if (!result.url) {
    throw new Error('Failed to generate personalized image');
  }
  
  return result.url;
}

export default {
  generateImage,
  generateEmotionImage,
  generatePersonalizedImage
};
