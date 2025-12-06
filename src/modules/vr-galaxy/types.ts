/**
 * Types pour le module VR Galaxy
 * Exploration spatiale thérapeutique en réalité virtuelle
 */

/**
 * Session VR Nebula basique
 */
export interface VRNebulaSession {
  id: string;
  user_id: string;
  session_id: string;
  hrv_pre?: number;
  hrv_post?: number;
  rmssd_delta?: number;
  resp_rate_avg?: number;
  coherence_score?: number;
  duration_seconds: number;
  created_at: string;
  completed_at?: string;
}

/**
 * Session VR Galaxy enrichie avec exploration
 */
export interface VRGalaxySession {
  id: string;
  user_id: string;
  session_id: string;
  galaxy_explored?: string;
  planets_visited?: string[];
  discoveries?: Discovery[];
  hrv_pre?: number;
  hrv_post?: number;
  rmssd_delta?: number;
  resp_rate_avg?: number;
  coherence_score?: number;
  duration_seconds: number;
  created_at: string;
  completed_at?: string;
  achievements_unlocked?: string[];
  exploration_depth?: number;
}

/**
 * Découverte cosmique pendant l'exploration
 */
export interface Discovery {
  type: 'planet' | 'nebula' | 'constellation' | 'phenomenon';
  name: string;
  coordinates: { x: number; y: number; z: number };
  description: string;
  therapeutic_value: number;
  timestamp: number;
}

/**
 * Environnement de galaxie personnalisable
 */
export interface GalaxyEnvironment {
  name: string;
  theme: string;
  stars_density: number;
  color_palette: string[];
  ambient_sounds: string[];
  therapeutic_elements: string[];
  difficulty_level: number;
}

/**
 * Insight biométrique avec recommandations
 */
export interface BiometricInsight {
  metric: string;
  value: number;
  trend: 'improving' | 'stable' | 'needs_attention';
  recommendation: string;
  confidence: number;
}

/**
 * Métriques biométriques pour mise à jour
 */
export interface BiometricMetrics {
  hrv_pre?: number;
  hrv_post?: number;
  resp_rate_avg?: number;
  current_stress_level?: number;
}

/**
 * Préférences d'exploration
 */
export interface ExplorationPreferences {
  galaxyType?: string;
  difficultyLevel?: number;
  therapeuticGoal?: string;
}

/**
 * État actuel de la session pour recommandations
 */
export interface SessionCurrentState {
  timeElapsed: number;
  hrvCurrent: number;
  stressLevel: number;
  explorationsCount: number;
}

/**
 * Recommandation adaptative
 */
export interface AdaptiveRecommendation {
  action: string;
  reason: string;
  urgency: number;
}

/**
 * Données de complétion de session
 */
export interface SessionCompletion {
  durationSeconds: number;
  finalBiometrics?: BiometricMetrics;
  userFeedback?: string;
}

/**
 * Résultat de complétion avec rapport
 */
export interface SessionCompletionResult {
  report: SessionReport;
  achievements: string[];
  nextSteps: string[];
}

/**
 * Rapport de session VR
 */
export interface SessionReport {
  sessionId: string;
  duration: number;
  discoveries: Discovery[];
  biometricProgress: {
    hrvImprovement: number;
    coherenceScore: number;
    stressReduction: number;
  };
  explorationStats: {
    planetsVisited: number;
    totalDiscoveries: number;
    explorationDepth: number;
  };
  therapeuticImpact: {
    overallScore: number;
    emotionalBenefit: string;
    physicalBenefit: string;
  };
}

/**
 * Résultat d'enregistrement de découverte
 */
export interface DiscoveryResult {
  achievements: string[];
  xpGained: number;
}

/**
 * Statistiques de progression cosmique
 */
export interface CosmicProgressionStats {
  totalExplorations: number;
  galaxiesVisited: Set<string>;
  totalDiscoveries: number;
  averageCoherenceScore: number;
  hrvImprovement: number;
  unlockedAchievements: string[];
}
