/**
 * Types pour le module Music Therapy
 * Musicothérapie intelligente et adaptive
 */

/**
 * Patterns d'écoute de musique thérapeutique
 */
export interface ListeningPatterns {
  preferredDurations: number[];
  moodResponses: Record<string, number>;
  therapeuticEffectiveness: Record<string, number>;
  timePreferences: Record<string, number>;
}

/**
 * Résumé de l'historique musical
 */
export interface HistorySummary {
  totalSessions: number;
  avgImprovement: number;
  totalListeningTime: number;
  adaptationRate: number;
}

/**
 * Recommandation musicale
 */
export interface MusicRecommendation {
  trackId: string;
  trackName: string;
  artist: string;
  genre: string;
  therapeuticValue: number;
  reason: string;
}

/**
 * Statistiques de musicothérapie
 */
export interface MusicTherapyStats {
  totalSessions: number;
  totalListeningTime: number;
  averageMoodImprovement: number;
  favoriteGenres: string[];
  effectivenessByTime: Record<string, number>;
}
