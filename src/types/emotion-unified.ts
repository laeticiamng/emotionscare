/**
 * Unified Emotion Types for EmotionsCare
 * 
 * Ce fichier centralise tous les types liés aux émotions et analyses
 * pour garantir la cohérence à travers l'application.
 */

// ============= Core Types =============

/**
 * Sources d'analyse émotionnelle supportées
 */
export type EmotionSource = 
  | 'facial'        // Analyse faciale via caméra
  | 'voice'         // Analyse vocale/prosody
  | 'text'          // Analyse textuelle
  | 'sliders'       // Saisie manuelle (curseurs SAM)
  | 'emoji'         // Sélection emoji
  | 'manual';       // Saisie manuelle complète

/**
 * Niveau de confiance de l'analyse
 */
export interface ConfidenceLevel {
  overall: number;      // Score global 0-100
  emotion?: number;     // Confiance sur l'émotion détectée (optionnel)
}

/**
 * Vecteur émotionnel (modèle circumplex)
 */
export interface EmotionVector {
  valence: number;      // Valence: 0-100 (négatif à positif)
  arousal: number;      // Activation: 0-100 (calme à excité)
  dominance?: number;   // Contrôle: 0-100 (optionnel)
}

/**
 * Résultat d'analyse émotionnelle unifié
 * 
 * Type principal utilisé dans toute l'application pour représenter
 * le résultat d'une analyse émotionnelle, quelle que soit la source.
 */
export interface EmotionResult {
  // Identifiants
  id: string;
  userId?: string;

  // Émotion principale
  emotion: string;                    // Ex: "joie", "tristesse", "calme"
  
  // Scores normalisés
  valence: number;                    // 0-100
  arousal: number;                    // 0-100
  
  // Confiance
  confidence: number | ConfidenceLevel; // 0-100 ou objet détaillé
  
  // Source et temporalité
  source: EmotionSource;
  timestamp: string | Date;           // ISO string préféré
  
  // Données optionnelles
  intensity?: number;                 // 0-100 (intensité perçue)
  summary?: string;                   // Résumé textuel de l'état
  
  // Détails étendus
  emotions?: Record<string, number>;  // Scores de toutes les émotions détectées
  vector?: EmotionVector;             // Vecteur complet si disponible
  
  // Feedback et recommandations
  feedback?: string;                  // Feedback textuel
  ai_feedback?: string;               // Feedback généré par IA
  recommendations?: string[] | EmotionRecommendation[];
  
  // Métadonnées
  metadata?: {
    raw_data?: any;                   // Données brutes de l'API
    processing_time_ms?: number;
    model_version?: string;
    [key: string]: any;
  };
}

/**
 * Recommandation basée sur l'émotion
 */
export interface EmotionRecommendation {
  id: string;
  emotion: string;
  type: 'activity' | 'music' | 'breathing' | 'content' | 'exercise';
  title: string;
  description: string;
  category: string;
  priority?: number;
  duration?: number;                  // Durée en minutes
  url?: string;                       // Lien vers l'activité
}

// ============= Scan History =============

/**
 * Item d'historique de scan (format simplifié pour l'affichage)
 */
export interface ScanHistoryItem {
  id: string;
  valence: number;
  arousal: number;
  source: string;
  created_at: string;
  summary?: string;
  emotion?: string;
}

// ============= API Responses =============

/**
 * Réponse de l'edge function Hume (facial)
 */
export interface HumeAnalysisResponse {
  bucket: 'positif' | 'calme' | 'neutre' | 'tendu';
  label: string;
  advice?: string;
  confidence: number;
  emotions?: Record<string, number>;
}

/**
 * Réponse de l'edge function voice
 */
export interface VoiceAnalysisResponse {
  emotion: string;
  valence: number;
  arousal: number;
  confidence: number;
  emotions: Record<string, number>;
  latency_ms?: number;
}

/**
 * Réponse de l'edge function text
 */
export interface TextAnalysisResponse {
  emotion: string;
  valence: number;
  arousal: number;
  confidence: number;
  summary?: string;
  emotions: Record<string, number>;
  latency_ms?: number;
}

// ============= Component Props =============

/**
 * Props pour les composants de scanner vocal
 */
export interface LiveVoiceScannerProps {
  onScanComplete?: (result: EmotionResult) => void;
  onResult?: (result: EmotionResult) => void;
  isProcessing?: boolean;
  setIsProcessing?: (processing: boolean) => void;
  autoStart?: boolean;
  scanDuration?: number;
}

// ============= Helper Functions Types =============

/**
 * Fonction de conversion d'une réponse API vers EmotionResult
 */
export type ApiToEmotionResultConverter<T> = (
  response: T,
  source: EmotionSource,
  additionalData?: Partial<EmotionResult>
) => EmotionResult;

// ============= Exports for Backward Compatibility =============

/**
 * Ré-export pour compatibilité avec l'ancien code
 * @deprecated Utiliser EmotionResult directement
 */
export type { EmotionResult as Emotion };

/**
 * Type guard pour vérifier si une valeur est un EmotionResult valide
 */
export function isEmotionResult(value: any): value is EmotionResult {
  return (
    value &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.emotion === 'string' &&
    typeof value.valence === 'number' &&
    typeof value.arousal === 'number' &&
    typeof value.source === 'string' &&
    (typeof value.timestamp === 'string' || value.timestamp instanceof Date)
  );
}

/**
 * Normalise un EmotionResult pour garantir la cohérence des valeurs
 */
export function normalizeEmotionResult(result: Partial<EmotionResult>): EmotionResult {
  // Normalize confidence
  let confidence: number | ConfidenceLevel = 0;
  if (typeof result.confidence === 'number') {
    confidence = Math.max(0, Math.min(100, result.confidence));
  } else if (result.confidence && typeof result.confidence === 'object') {
    confidence = {
      overall: Math.max(0, Math.min(100, result.confidence.overall || 0)),
      emotion: result.confidence.emotion ? Math.max(0, Math.min(100, result.confidence.emotion)) : undefined
    };
  }

  return {
    id: result.id || crypto.randomUUID(),
    userId: result.userId,
    emotion: result.emotion || 'neutre',
    valence: Math.max(0, Math.min(100, result.valence || 50)),
    arousal: Math.max(0, Math.min(100, result.arousal || 50)),
    confidence,
    source: result.source || 'manual',
    timestamp: result.timestamp || new Date().toISOString(),
    intensity: result.intensity !== undefined ? Math.max(0, Math.min(100, result.intensity)) : undefined,
    summary: result.summary,
    emotions: result.emotions,
    vector: result.vector,
    feedback: result.feedback,
    ai_feedback: result.ai_feedback,
    recommendations: result.recommendations,
    metadata: result.metadata
  };
}
