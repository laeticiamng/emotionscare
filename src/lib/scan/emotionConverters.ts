/**
 * Utilitaires de conversion entre différents formats d'API
 * et le type EmotionResult unifié
 */

import {
  EmotionResult,
  HumeAnalysisResponse,
  VoiceAnalysisResponse,
  TextAnalysisResponse,
  EmotionSource,
  normalizeEmotionResult,
} from '@/types/emotion-unified';

/**
 * Convertit une réponse Hume AI (facial) vers EmotionResult
 */
export function humeToEmotionResult(
  response: HumeAnalysisResponse,
  additionalData?: Partial<EmotionResult>
): EmotionResult {
  // Mapper les buckets Hume vers valence/arousal
  const bucketMapping: Record<string, { valence: number; arousal: number }> = {
    positif: { valence: 75, arousal: 65 },
    calme: { valence: 60, arousal: 30 },
    neutre: { valence: 50, arousal: 50 },
    tendu: { valence: 35, arousal: 75 },
  };

  const { valence, arousal } = bucketMapping[response.bucket] || {
    valence: 50,
    arousal: 50,
  };

  return normalizeEmotionResult({
    id: crypto.randomUUID(),
    emotion: response.label,
    valence,
    arousal,
    confidence: response.confidence * 100,
    source: 'facial',
    timestamp: new Date().toISOString(),
    feedback: response.advice,
    emotions: response.emotions,
    metadata: {
      bucket: response.bucket,
      raw_data: response,
    },
    ...additionalData,
  });
}

/**
 * Convertit une réponse d'analyse vocale vers EmotionResult
 */
export function voiceToEmotionResult(
  response: VoiceAnalysisResponse,
  additionalData?: Partial<EmotionResult>
): EmotionResult {
  return normalizeEmotionResult({
    id: crypto.randomUUID(),
    emotion: response.emotion,
    valence: response.valence,
    arousal: response.arousal,
    confidence: response.confidence,
    source: 'voice',
    timestamp: new Date().toISOString(),
    emotions: response.emotions,
    metadata: {
      latency_ms: response.latency_ms,
      raw_data: response,
    },
    ...additionalData,
  });
}

/**
 * Convertit une réponse d'analyse textuelle vers EmotionResult
 */
export function textToEmotionResult(
  response: TextAnalysisResponse,
  additionalData?: Partial<EmotionResult>
): EmotionResult {
  return normalizeEmotionResult({
    id: crypto.randomUUID(),
    emotion: response.emotion,
    valence: response.valence,
    arousal: response.arousal,
    confidence: response.confidence,
    source: 'text',
    timestamp: new Date().toISOString(),
    summary: response.summary,
    emotions: response.emotions,
    metadata: {
      latency_ms: response.latency_ms,
      raw_data: response,
    },
    ...additionalData,
  });
}

/**
 * Convertit des valeurs SAM (sliders) vers EmotionResult
 */
export function samToEmotionResult(
  valence: number,
  arousal: number,
  additionalData?: Partial<EmotionResult>
): EmotionResult {
  // Déterminer l'émotion basée sur valence/arousal
  const emotion = valenceArousalToEmotion(valence, arousal);

  return normalizeEmotionResult({
    id: crypto.randomUUID(),
    emotion,
    valence,
    arousal,
    confidence: 100, // L'utilisateur est sûr de son choix
    source: 'sliders',
    timestamp: new Date().toISOString(),
    ...additionalData,
  });
}

/**
 * Convertit une sélection d'emoji vers EmotionResult
 */
export function emojiToEmotionResult(
  emoji: string,
  additionalData?: Partial<EmotionResult>
): EmotionResult {
  // Mapper les emojis courants vers valence/arousal et émotions
  const emojiMapping: Record<
    string,
    { emotion: string; valence: number; arousal: number }
  > = {
    '😊': { emotion: 'joie', valence: 75, arousal: 60 },
    '😃': { emotion: 'excitation', valence: 85, arousal: 80 },
    '😄': { emotion: 'bonheur', valence: 80, arousal: 70 },
    '😌': { emotion: 'calme', valence: 65, arousal: 30 },
    '😐': { emotion: 'neutre', valence: 50, arousal: 50 },
    '😟': { emotion: 'inquiétude', valence: 35, arousal: 65 },
    '😢': { emotion: 'tristesse', valence: 25, arousal: 40 },
    '😠': { emotion: 'colère', valence: 20, arousal: 85 },
    '😤': { emotion: 'frustration', valence: 30, arousal: 70 },
    '😴': { emotion: 'fatigue', valence: 40, arousal: 20 },
    '🙏': { emotion: 'gratitude', valence: 80, arousal: 50 },
  };

  const mapping = emojiMapping[emoji] || {
    emotion: 'neutre',
    valence: 50,
    arousal: 50,
  };

  return normalizeEmotionResult({
    id: crypto.randomUUID(),
    emotion: mapping.emotion,
    valence: mapping.valence,
    arousal: mapping.arousal,
    confidence: 100,
    source: 'emoji',
    timestamp: new Date().toISOString(),
    ...additionalData,
  });
}

/**
 * Convertit un format legacy/DB vers EmotionResult normalisé
 * Utile pour la migration de données anciennes
 */
export function legacyToEmotionResult(
  legacy: any
): EmotionResult {
  // Normaliser les champs timestamp/date
  const timestamp =
    legacy.timestamp ||
    legacy.date ||
    legacy.created_at ||
    new Date().toISOString();

  // Normaliser user_id
  const userId = legacy.userId || legacy.user_id;

  // Normaliser confidence (peut être un objet ou un nombre)
  let confidence: number;
  if (typeof legacy.confidence === 'object' && legacy.confidence?.overall) {
    confidence = legacy.confidence.overall;
  } else if (typeof legacy.confidence === 'number') {
    confidence = legacy.confidence;
  } else if (legacy.score) {
    confidence = legacy.score * 100;
  } else {
    confidence = 50;
  }

  // Normaliser source
  const source: EmotionSource =
    legacy.source ||
    legacy.scanMode ||
    (legacy.audio_url ? 'voice' : 'manual');

  return normalizeEmotionResult({
    id: legacy.id || crypto.randomUUID(),
    userId,
    emotion: legacy.emotion || 'neutre',
    valence: legacy.valence || legacy.vector?.valence || 50,
    arousal: legacy.arousal || legacy.vector?.arousal || 50,
    confidence,
    source,
    timestamp,
    intensity: legacy.intensity,
    summary: legacy.text || legacy.summary,
    feedback: legacy.feedback || legacy.ai_feedback,
    recommendations: legacy.recommendations || legacy.predictions?.recommendedActions,
    emotions: legacy.emotions || legacy.details,
    metadata: {
      migrated: true,
      original_format: Object.keys(legacy),
    },
  });
}

/**
 * Détermine l'émotion basée sur les coordonnées valence/arousal
 * Utilise le modèle circumplex des émotions
 */
export function valenceArousalToEmotion(
  valence: number,
  arousal: number
): string {
  // Normaliser à 0-100 si nécessaire
  const v = Math.max(0, Math.min(100, valence));
  const a = Math.max(0, Math.min(100, arousal));

  // Quadrants du circumplex
  if (v >= 60) {
    // Valence positive
    if (a >= 60) return 'excitation'; // Haute activation
    if (a >= 40) return 'joie'; // Activation moyenne
    return 'contentement'; // Basse activation
  } else if (v >= 40) {
    // Valence neutre
    if (a >= 60) return 'alerte'; // Haute activation
    if (a >= 40) return 'neutre'; // Activation moyenne
    return 'calme'; // Basse activation
  } else {
    // Valence négative
    if (a >= 60) return 'colère'; // Haute activation
    if (a >= 40) return 'frustration'; // Activation moyenne
    return 'tristesse'; // Basse activation
  }
}

/**
 * Convertit un nom d'émotion vers des coordonnées valence/arousal estimées
 */
export function emotionToValenceArousal(emotion: string): {
  valence: number;
  arousal: number;
} {
  const emotionMap: Record<string, { valence: number; arousal: number }> = {
    // Émotions positives
    joie: { valence: 75, arousal: 60 },
    bonheur: { valence: 80, arousal: 55 },
    excitation: { valence: 85, arousal: 80 },
    contentement: { valence: 70, arousal: 35 },
    gratitude: { valence: 75, arousal: 45 },
    amour: { valence: 85, arousal: 50 },
    fierté: { valence: 70, arousal: 55 },
    sérénité: { valence: 65, arousal: 25 },
    calme: { valence: 60, arousal: 25 },

    // Émotions neutres
    neutre: { valence: 50, arousal: 50 },
    surprise: { valence: 50, arousal: 75 },
    curiosité: { valence: 55, arousal: 60 },
    alerte: { valence: 50, arousal: 70 },

    // Émotions négatives
    tristesse: { valence: 25, arousal: 35 },
    colère: { valence: 20, arousal: 80 },
    peur: { valence: 20, arousal: 75 },
    anxiété: { valence: 30, arousal: 70 },
    inquiétude: { valence: 35, arousal: 65 },
    frustration: { valence: 30, arousal: 65 },
    déception: { valence: 30, arousal: 40 },
    ennui: { valence: 40, arousal: 20 },
    fatigue: { valence: 40, arousal: 15 },
    stress: { valence: 30, arousal: 75 },
  };

  return (
    emotionMap[emotion.toLowerCase()] || { valence: 50, arousal: 50 }
  );
}

/**
 * Fusionne plusieurs EmotionResult en un seul (moyenne pondérée)
 * Utile pour les scans multimodaux
 */
export function mergeEmotionResults(
  results: EmotionResult[],
  weights?: number[]
): EmotionResult {
  if (results.length === 0) {
    throw new Error('Cannot merge empty results array');
  }

  if (results.length === 1) {
    return results[0];
  }

  // Utiliser des poids égaux par défaut
  const w = weights || results.map(() => 1 / results.length);

  // Vérifier que les poids correspondent
  if (w.length !== results.length) {
    throw new Error('Weights array must match results array length');
  }

  // Normaliser les poids pour qu'ils somment à 1
  const totalWeight = w.reduce((sum, weight) => sum + weight, 0);
  const normalizedWeights = w.map((weight) => weight / totalWeight);

  // Calculer les moyennes pondérées
  const valence = results.reduce(
    (sum, result, i) => sum + result.valence * normalizedWeights[i],
    0
  );

  const arousal = results.reduce(
    (sum, result, i) => sum + result.arousal * normalizedWeights[i],
    0
  );

  const confidence = results.reduce((sum, result, i) => {
    const conf =
      typeof result.confidence === 'number'
        ? result.confidence
        : result.confidence.overall;
    return sum + conf * normalizedWeights[i];
  }, 0);

  // Déterminer l'émotion dominante
  const emotion = valenceArousalToEmotion(valence, arousal);

  // Fusionner les métadonnées
  const sources = results.map((r) => r.source);
  const allEmotions = results
    .filter((r) => r.emotions)
    .reduce((acc, r) => ({ ...acc, ...r.emotions }), {});

  return normalizeEmotionResult({
    id: crypto.randomUUID(),
    emotion,
    valence,
    arousal,
    confidence,
    source: 'facial', // Source principale (peut être adapté)
    timestamp: new Date().toISOString(),
    emotions: allEmotions,
    metadata: {
      merged: true,
      sources,
      source_count: results.length,
      weights: normalizedWeights,
    },
  });
}
