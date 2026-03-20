/**
 * Constantes pour le module de scan émotionnel
 */

import { ScanMode } from '@/types/emotion';

// Durées recommandées pour les scans (en secondes)
export const SCAN_DURATIONS = {
  QUICK: 5,
  STANDARD: 15,
  DEEP: 30,
  COMPREHENSIVE: 60,
  MINIMUM: 5,
  MAXIMUM: 300,
} as const;

// Seuils de confiance
export const CONFIDENCE_THRESHOLDS = {
  LOW: 50,
  MEDIUM: 70,
  HIGH: 85,
  VERY_HIGH: 95,
} as const;

// Précision des différents modes de scan (%)
export const SCAN_MODE_ACCURACY = {
  text: 91,
  voice: 94,
  facial: 96,
  combined: 98,
  realtime: 95,
} as const satisfies Record<ScanMode, number>;

// Émotions de base reconnues
export const BASE_EMOTIONS = [
  'happy',
  'sad',
  'angry',
  'fearful',
  'disgusted',
  'surprised',
  'neutral',
  'calm',
  'excited',
  'anxious',
  'stressed',
  'content',
  'frustrated',
  'confused',
  'bored',
] as const;

export type BaseEmotion = typeof BASE_EMOTIONS[number];

// Catégories d'émotions
export const EMOTION_CATEGORIES = {
  POSITIVE: ['happy', 'joy', 'content', 'excited', 'pleased', 'calm', 'serene', 'satisfied'],
  NEGATIVE: ['sad', 'angry', 'fearful', 'disgusted', 'anxious', 'stressed', 'frustrated', 'depressed'],
  NEUTRAL: ['neutral', 'surprised', 'confused', 'bored', 'indifferent'],
  HIGH_ENERGY: ['excited', 'angry', 'anxious', 'surprised', 'stressed'],
  LOW_ENERGY: ['calm', 'sad', 'bored', 'content', 'serene'],
} as const;

// Couleurs pour les émotions (Tailwind CSS)
export const EMOTION_COLORS = {
  happy: 'bg-green-500',
  sad: 'bg-blue-500',
  angry: 'bg-red-500',
  fearful: 'bg-purple-500',
  disgusted: 'bg-yellow-500',
  surprised: 'bg-pink-500',
  neutral: 'bg-gray-500',
  calm: 'bg-blue-400',
  excited: 'bg-orange-500',
  anxious: 'bg-amber-500',
  stressed: 'bg-red-400',
  content: 'bg-green-400',
  frustrated: 'bg-red-600',
  confused: 'bg-purple-400',
  bored: 'bg-gray-400',
} as const;

// Emojis pour les émotions
export const EMOTION_EMOJIS = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  fearful: '😨',
  disgusted: '🤢',
  surprised: '😮',
  neutral: '😐',
  calm: '😌',
  excited: '😃',
  anxious: '😰',
  stressed: '😫',
  content: '😌',
  frustrated: '😤',
  confused: '😕',
  bored: '😑',
  joy: '😄',
} as const;

// Configuration par défaut pour les scans
export const DEFAULT_SCAN_CONFIG = {
  duration: SCAN_DURATIONS.STANDARD,
  sensitivity: 75,
  sources: ['facial'] as ScanMode[],
  realTimeUpdates: true,
  biometricTracking: true,
  confidenceThreshold: CONFIDENCE_THRESHOLDS.MEDIUM,
  noiseReduction: true,
  smoothingFactor: 0.3,
  predictiveMode: true,
} as const;

// Intervalles de mise à jour (en millisecondes)
export const UPDATE_INTERVALS = {
  REALTIME: 100,
  FAST: 500,
  NORMAL: 1000,
  SLOW: 2000,
} as const;

// Tailles de buffer pour l'historique
export const HISTORY_BUFFER_SIZES = {
  RECENT: 20,
  SESSION: 50,
  EXTENDED: 100,
  FULL: 500,
} as const;

// Messages d'erreur standardisés
export const ERROR_MESSAGES = {
  NO_CAMERA_PERMISSION: 'Permission d\'accès à la caméra refusée',
  NO_MICROPHONE_PERMISSION: 'Permission d\'accès au microphone refusée',
  CAMERA_NOT_AVAILABLE: 'Caméra non disponible',
  MICROPHONE_NOT_AVAILABLE: 'Microphone non disponible',
  INVALID_CONFIG: 'Configuration de scan invalide',
  SCAN_FAILED: 'Échec de l\'analyse émotionnelle',
  INVALID_DURATION: 'Durée de scan invalide',
  INVALID_SENSITIVITY: 'Sensibilité invalide',
  NO_SOURCES_SELECTED: 'Aucune source d\'analyse sélectionnée',
  ANALYSIS_TIMEOUT: 'Délai d\'analyse dépassé',
  NETWORK_ERROR: 'Erreur réseau lors de l\'analyse',
} as const;

// Messages de succès
export const SUCCESS_MESSAGES = {
  SCAN_COMPLETED: 'Analyse terminée avec succès',
  SCAN_SAVED: 'Résultat de scan sauvegardé',
  CONFIG_UPDATED: 'Configuration mise à jour',
  PERMISSIONS_GRANTED: 'Permissions accordées',
} as const;

// Recommendations par émotion
export const EMOTION_RECOMMENDATIONS = {
  anxious: [
    'Pratiquez la respiration profonde pendant 5 minutes',
    'Essayez une courte méditation guidée',
    'Écoutez de la musique apaisante',
    'Faites une pause et marchez un peu',
  ],
  stressed: [
    'Prenez une pause de 10 minutes',
    'Pratiquez des exercices de relaxation musculaire',
    'Discutez avec un ami ou un proche',
    'Essayez le yoga ou les étirements',
  ],
  sad: [
    'Contactez un ami ou un proche',
    'Faites une activité que vous aimez',
    'Sortez prendre l\'air',
    'Écoutez de la musique qui vous remonte le moral',
  ],
  angry: [
    'Prenez quelques respirations profondes',
    'Faites une activité physique intense',
    'Écrivez ce que vous ressentez',
    'Comptez jusqu\'à 10 avant de réagir',
  ],
  happy: [
    'Partagez votre joie avec vos proches',
    'Notez ce qui vous rend heureux',
    'Profitez pleinement du moment présent',
    'Pratiquez la gratitude',
  ],
  calm: [
    'Maintenez cet état avec de la méditation',
    'Profitez de ce moment de paix',
    'Faites une activité créative',
    'Pratiquez la pleine conscience',
  ],
  neutral: [
    'Essayez une nouvelle activité',
    'Faites de l\'exercice léger',
    'Connectez-vous avec vos proches',
    'Pratiquez un hobby qui vous plaît',
  ],
} as const;

// Niveaux de risque basés sur les émotions
export const EMOTION_RISK_LEVELS = {
  happy: 'low',
  calm: 'low',
  content: 'low',
  neutral: 'low',
  bored: 'medium',
  confused: 'medium',
  surprised: 'medium',
  anxious: 'high',
  stressed: 'high',
  sad: 'high',
  angry: 'high',
  frustrated: 'high',
  fearful: 'high',
  disgusted: 'medium',
} as const;

// Types de biométriques suivies
export const BIOMETRIC_TYPES = {
  HEART_RATE: 'heart_rate',
  BREATHING_RATE: 'breathing_rate',
  SKIN_CONDUCTANCE: 'skin_conductance',
  EYE_TRACKING: 'eye_tracking',
  FACE_METRICS: 'face_metrics',
} as const;

// Limites normales pour les biométriques
export const BIOMETRIC_NORMAL_RANGES = {
  heartRate: { min: 60, max: 100 },
  breathingRate: { min: 12, max: 20 },
  skinConductance: { min: 0, max: 100 },
  pupilDilation: { min: 2, max: 8 }, // mm
  blinkRate: { min: 10, max: 30 }, // par minute
} as const;
