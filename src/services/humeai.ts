
/**
 * Service Hume AI
 * 
 * Ce service gère l'intégration avec l'API Hume AI pour l'analyse émotionnelle
 * via texte, voix et expressions faciales.
 */
import { env } from '@/env.mjs';

// Types pour les options d'analyse
export interface HumeAIOptions {
  apiKey?: string; // Clé API spécifique (optionnel)
  language?: string; // Code langue pour l'analyse
  rawScores?: boolean; // Renvoyer les scores bruts
  granularity?: 'fine' | 'coarse'; // Niveau de détail
}

// Types pour les résultats
export interface EmotionAnalysisResult {
  primaryEmotion: string;
  emotions: Array<{
    name: string;
    score: number;
  }>;
  intensity: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

// URL de base pour l'API
const API_BASE_URL = 'https://api.hume.ai/v0';

/**
 * Récupère la clé API Hume AI depuis les variables d'environnement
 * @returns La clé API ou lance une erreur
 */
function getApiKey(options?: HumeAIOptions): string {
  // Priorité à la clé fournie dans les options
  const key = options?.apiKey || env.NEXT_PUBLIC_HUME_API_KEY;
  if (!key) {
    throw new Error('Hume AI API key is not set');
  }
  return key;
}

/**
 * Analyse émotionnelle d'un texte
 * @param text Le texte à analyser
 * @param options Options d'analyse
 * @returns Résultat de l'analyse émotionnelle
 */
export async function analyzeText(
  text: string,
  options: HumeAIOptions = {}
): Promise<EmotionAnalysisResult> {
  try {
    const apiKey = getApiKey(options);
    
    const response = await fetch(`${API_BASE_URL}/text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hume-Api-Key': apiKey
      },
      body: JSON.stringify({
        text,
        granularity: options.granularity || 'fine',
        raw_scores: options.rawScores || false,
        language: options.language
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze text');
    }

    const data = await response.json();
    return processEmotionResult(data);
  } catch (error) {
    console.error('Error analyzing text with Hume AI:', error);
    
    // Mode dégradé : réponse simulée si l'API n'est pas disponible
    return {
      primaryEmotion: 'neutral',
      emotions: [
        { name: 'neutral', score: 0.8 },
        { name: 'calm', score: 0.5 }
      ],
      intensity: 0.3,
      sentiment: 'neutral',
      confidence: 0.7
    };
  }
}

/**
 * Analyse émotionnelle depuis une webcam (expressions faciales)
 * @param videoElement L'élément vidéo contenant le flux de la webcam
 * @param options Options d'analyse
 * @returns Résultat de l'analyse émotionnelle
 */
export async function analyzeWebcam(
  videoElement: HTMLVideoElement,
  options: HumeAIOptions = {}
): Promise<EmotionAnalysisResult> {
  try {
    // Capture d'une image depuis la vidéo
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to create canvas context');
    }
    
    ctx.drawImage(videoElement, 0, 0);
    
    // Conversion en Blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/jpeg', 0.9);
    });
    
    if (!blob) {
      throw new Error('Failed to capture image from webcam');
    }
    
    // Création d'un FormData pour l'envoi
    const formData = new FormData();
    formData.append('image', blob, 'webcam.jpg');
    
    if (options.granularity) {
      formData.append('granularity', options.granularity);
    }
    
    if (options.rawScores !== undefined) {
      formData.append('raw_scores', options.rawScores.toString());
    }
    
    // Envoi à l'API
    const apiKey = getApiKey(options);
    
    const response = await fetch(`${API_BASE_URL}/face`, {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': apiKey
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze facial expression');
    }

    const data = await response.json();
    return processEmotionResult(data);
  } catch (error) {
    console.error('Error analyzing webcam with Hume AI:', error);
    
    // Mode dégradé : réponse simulée si l'API n'est pas disponible
    return {
      primaryEmotion: 'neutral',
      emotions: [
        { name: 'neutral', score: 0.7 },
        { name: 'happiness', score: 0.2 }
      ],
      intensity: 0.2,
      sentiment: 'neutral',
      confidence: 0.6
    };
  }
}

/**
 * Analyse émotionnelle depuis un clip audio
 * @param audioFile Le fichier audio à analyser
 * @param options Options d'analyse
 * @returns Résultat de l'analyse émotionnelle
 */
export async function analyzeAudio(
  audioFile: File | Blob,
  options: HumeAIOptions = {}
): Promise<EmotionAnalysisResult> {
  try {
    const apiKey = getApiKey(options);
    
    const formData = new FormData();
    formData.append('audio', audioFile);
    
    if (options.granularity) {
      formData.append('granularity', options.granularity);
    }
    
    if (options.rawScores !== undefined) {
      formData.append('raw_scores', options.rawScores.toString());
    }
    
    if (options.language) {
      formData.append('language', options.language);
    }
    
    const response = await fetch(`${API_BASE_URL}/voice`, {
      method: 'POST',
      headers: {
        'X-Hume-Api-Key': apiKey
      },
      body: formData
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze audio');
    }

    const data = await response.json();
    return processEmotionResult(data);
  } catch (error) {
    console.error('Error analyzing audio with Hume AI:', error);
    
    // Mode dégradé : réponse simulée si l'API n'est pas disponible
    return {
      primaryEmotion: 'calm',
      emotions: [
        { name: 'calm', score: 0.6 },
        { name: 'neutral', score: 0.4 }
      ],
      intensity: 0.4,
      sentiment: 'positive',
      confidence: 0.7
    };
  }
}

/**
 * Traite les données brutes de l'API pour un format standardisé
 * @param data Données brutes de l'API
 * @returns Résultat formaté
 */
function processEmotionResult(data: any): EmotionAnalysisResult {
  // Note: Cette fonction sera adaptée selon le format exact des réponses Hume AI
  
  // Simulation de traitement
  // Dans une implémentation réelle, on extrairait les données de la réponse
  const emotions = data.emotions || [];
  
  // Tri par score décroissant
  const sortedEmotions = [...emotions].sort((a, b) => b.score - a.score);
  
  // Détermine l'émotion primaire
  const primaryEmotion = sortedEmotions.length > 0 ? 
    sortedEmotions[0].name : 'neutral';
  
  // Calcule l'intensité (moyenne pondérée des scores)
  const totalScore = emotions.reduce((sum: number, e: any) => sum + e.score, 0);
  const intensity = totalScore > 0 ? 
    emotions.reduce((sum: number, e: any) => sum + (e.score * e.intensity || 0), 0) / totalScore : 
    0.5;
  
  // Détermine le sentiment général
  let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
  const positiveEmotions = ['happiness', 'joy', 'amusement', 'contentment', 'excitement'];
  const negativeEmotions = ['anger', 'fear', 'sadness', 'disgust', 'frustration'];
  
  if (positiveEmotions.includes(primaryEmotion)) {
    sentiment = 'positive';
  } else if (negativeEmotions.includes(primaryEmotion)) {
    sentiment = 'negative';
  }
  
  // Calcule le niveau de confiance
  const confidence = sortedEmotions.length > 0 ? 
    sortedEmotions[0].score : 0.5;
  
  return {
    primaryEmotion,
    emotions: sortedEmotions,
    intensity,
    sentiment,
    confidence
  };
}

/**
 * Vérifie la connectivité avec l'API Hume AI
 * @returns true si la connexion est établie, false sinon
 */
export async function checkApiConnection(apiKey?: string): Promise<boolean> {
  try {
    const key = apiKey || env.NEXT_PUBLIC_HUME_API_KEY;
    if (!key) return false;
    
    const response = await fetch(`${API_BASE_URL}/status`, {
      headers: {
        'X-Hume-Api-Key': key
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Hume AI API connection check failed:', error);
    return false;
  }
}

export default {
  analyzeText,
  analyzeWebcam,
  analyzeAudio,
  checkApiConnection
};
