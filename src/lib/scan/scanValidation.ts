import type { EmotionResult, EmotionAnalysisConfig, ScanMode, EmotionResultExtended } from '@/types/emotion';

/**
 * Service de validation pour les scans émotionnels
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Helper to extract confidence as number from various formats
const getConfidenceValue = (result: EmotionResult): number => {
  const confidence = result.confidence;
  if (typeof confidence === 'number') {
    return confidence;
  }
  // Handle object format with 'overall' property (from extended types)
  if (confidence && typeof confidence === 'object' && 'overall' in (confidence as Record<string, unknown>)) {
    return (confidence as { overall: number }).overall;
  }
  return 0;
};

/**
 * Valide une configuration de scan
 */
export function validateScanConfig(config: EmotionAnalysisConfig): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation de la durée
  if (config.duration < 5) {
    errors.push('La durée du scan doit être d\'au moins 5 secondes');
  } else if (config.duration > 300) {
    errors.push('La durée du scan ne peut pas dépasser 5 minutes (300 secondes)');
  } else if (config.duration < 10) {
    warnings.push('Une durée de scan de moins de 10 secondes peut réduire la précision');
  }

  // Validation de la sensibilité
  if (config.sensitivity < 0 || config.sensitivity > 100) {
    errors.push('La sensibilité doit être comprise entre 0 et 100');
  }

  // Validation des sources
  if (!config.sources || config.sources.length === 0) {
    errors.push('Au moins une source d\'analyse doit être sélectionnée');
  }

  // Validation du seuil de confiance
  if (config.confidenceThreshold !== undefined) {
    if (config.confidenceThreshold < 0 || config.confidenceThreshold > 100) {
      errors.push('Le seuil de confiance doit être compris entre 0 et 100');
    } else if (config.confidenceThreshold < 50) {
      warnings.push('Un seuil de confiance inférieur à 50% peut générer des faux positifs');
    }
  }

  // Validation du facteur de lissage
  if (config.smoothingFactor !== undefined) {
    if (config.smoothingFactor < 0 || config.smoothingFactor > 1) {
      errors.push('Le facteur de lissage doit être compris entre 0 et 1');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Valide un résultat de scan émotionnel
 */
export function validateEmotionResult(result: EmotionResult): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validation de l'émotion
  if (!result.emotion || result.emotion.trim() === '') {
    errors.push('L\'émotion détectée ne peut pas être vide');
  }

  // Validation de la confiance
  const confidence = getConfidenceValue(result);

  if (confidence < 0 || confidence > 100) {
    errors.push('La confiance doit être comprise entre 0 et 100');
  } else if (confidence < 50) {
    warnings.push('Confiance faible: les résultats peuvent ne pas être fiables');
  }

  // Validation de la valence
  if (result.valence !== undefined) {
    if (result.valence < -1 || result.valence > 1) {
      errors.push('La valence doit être comprise entre -1 et 1');
    }
  }

  // Validation de l'arousal
  if (result.arousal !== undefined) {
    if (result.arousal < 0 || result.arousal > 1) {
      errors.push('L\'arousal doit être compris entre 0 et 1');
    }
  }

  // Validation du timestamp
  if (!result.timestamp) {
    errors.push('Le timestamp est requis');
  } else {
    const ts = result.timestamp instanceof Date ? result.timestamp : new Date(result.timestamp);
    if (ts > new Date()) {
      errors.push('Le timestamp ne peut pas être dans le futur');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Vérifie si un mode de scan est supporté
 */
export function isScanModeSupported(mode: string): mode is ScanMode {
  const supportedModes: ScanMode[] = ['text', 'voice', 'facial', 'combined', 'realtime'];
  return supportedModes.includes(mode as ScanMode);
}

/**
 * Calcule un score de qualité pour un scan
 */
export function calculateScanQuality(result: EmotionResult, config: EmotionAnalysisConfig): number {
  let quality = 0;

  // Facteur de confiance (40% du score)
  const confidence = getConfidenceValue(result);
  quality += (confidence / 100) * 40;

  // Durée appropriée (20% du score)
  const durationScore = Math.min(config.duration / 30, 1); // Optimal à 30s
  quality += durationScore * 20;

  // Multi-source (20% du score)
  const sourceCount = config.sources.length;
  quality += Math.min(sourceCount / 3, 1) * 20;

  // Données biométriques (10% du score) - check for extended result
  const extendedResult = result as EmotionResultExtended;
  if (config.biometricTracking && extendedResult.biometrics) {
    quality += 10;
  }

  // Mode prédictif (10% du score) - check for extended result
  if (config.predictiveMode && extendedResult.predictions) {
    quality += 10;
  }

  return Math.round(quality);
}

/**
 * Nettoie et normalise les données de scan
 */
export function sanitizeScanData(result: EmotionResult): EmotionResult {
  return {
    ...result,
    emotion: result.emotion.trim().toLowerCase(),
    timestamp: new Date(result.timestamp),
    valence: result.valence ? Math.max(-1, Math.min(1, result.valence)) : result.valence,
    arousal: result.arousal ? Math.max(0, Math.min(1, result.arousal)) : result.arousal,
  };
}

/**
 * Compare deux résultats de scan pour détecter des variations significatives
 */
export function compareEmotionResults(
  previous: EmotionResult,
  current: EmotionResult
): {
  emotionChanged: boolean;
  confidenceDelta: number;
  valenceDelta: number;
  arousalDelta: number;
  isSignificantChange: boolean;
} {
  const prevConfidence = getConfidenceValue(previous);
  const currConfidence = getConfidenceValue(current);

  const confidenceDelta = currConfidence - prevConfidence;
  const valenceDelta = (current.valence || 0) - (previous.valence || 0);
  const arousalDelta = (current.arousal || 0) - (previous.arousal || 0);

  const emotionChanged = previous.emotion !== current.emotion;

  // Changement significatif si:
  // - L'émotion a changé ET la confiance est > 60%
  // - OU delta de valence > 0.3
  // - OU delta d'arousal > 0.3
  const isSignificantChange =
    (emotionChanged && currConfidence > 60) ||
    Math.abs(valenceDelta) > 0.3 ||
    Math.abs(arousalDelta) > 0.3;

  return {
    emotionChanged,
    confidenceDelta,
    valenceDelta,
    arousalDelta,
    isSignificantChange
  };
}
