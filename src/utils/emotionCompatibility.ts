
import { EmotionIntensity, EmotionResult } from '@/types/emotion';

/**
 * Normalise l'intensité émotionnelle en une valeur numérique entre 0 et 1
 * @param intensity L'intensité émotionnelle (string ou number)
 * @returns Une valeur normalisée entre 0 et 1
 */
export function normalizeEmotionIntensity(intensity: EmotionIntensity): number {
  if (typeof intensity === 'number') {
    // Si c'est déjà un nombre, nous nous assurons qu'il est entre 0 et 1
    return Math.max(0, Math.min(1, intensity));
  }
  
  // Si c'est une chaîne, convertir en nombre
  switch (intensity) {
    case 'low':
      return 0.25;
    case 'medium':
      return 0.5;
    case 'high':
      return 0.85;
    default:
      return 0.5; // Valeur par défaut
  }
}

/**
 * Convertit une intensité numérique en catégorie textuelle
 * @param intensity Valeur numérique entre 0 et 1
 * @returns Catégorie d'intensité (low, medium, high)
 */
export function getIntensityCategory(intensity: number): 'low' | 'medium' | 'high' {
  if (intensity < 0.33) {
    return 'low';
  } else if (intensity < 0.66) {
    return 'medium';
  } else {
    return 'high';
  }
}

/**
 * Normalise un résultat d'émotion pour assurer la compatibilité avec l'interface EmotionResult
 * @param result Résultat d'émotion à normaliser
 * @returns Résultat d'émotion normalisé conforme à l'interface
 */
export function normalizeEmotionResult(result: Partial<EmotionResult>): EmotionResult {
  // S'assurer que tous les champs requis sont présents
  return {
    id: result.id || `emotion-${Date.now()}`,
    emotion: result.emotion || 'neutral',
    confidence: result.confidence || 0.5,
    intensity: typeof result.intensity === 'undefined' ? 0.5 : normalizeEmotionIntensity(result.intensity),
    emojis: result.emojis || [],
    timestamp: result.timestamp || new Date().toISOString(),
    // Champs optionnels
    ...(result.text && { text: result.text }),
    ...(result.feedback && { feedback: result.feedback }),
    ...(result.score !== undefined && { score: result.score }),
    ...(result.source && { source: result.source }),
    ...(result.userId && { userId: result.userId }),
    ...(result.user_id && { user_id: result.user_id }),
    ...(result.date && { date: result.date })
  };
}
