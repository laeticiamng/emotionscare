/**
 * Feature: Wearables
 * Intégrations avec montres connectées et trackers d'activité
 */

// Re-export depuis health-integrations
export {
  healthIntegrationsService,
  HEALTH_PROVIDERS,
  type HealthProvider,
  type HealthConnection,
  type HealthPermission,
  type HealthDataPoint,
  type HealthMetricType,
  type HealthSummary,
  type WearableDevice
} from '../health-integrations';

// Helpers spécifiques wearables
export const wearablesUtils = {
  /**
   * Vérifie si un provider est supporté
   */
  isSupported(provider: string): boolean {
    const supported = ['apple_health', 'google_fit', 'fitbit', 'garmin', 'whoop', 'oura'];
    return supported.includes(provider);
  },

  /**
   * Retourne l'icône pour un provider
   */
  getProviderIcon(provider: string): string {
    const icons: Record<string, string> = {
      apple_health: '❤️',
      google_fit: '💚',
      fitbit: '🏃',
      garmin: '⌚',
      whoop: '💪',
      oura: '💍'
    };
    return icons[provider] || '📱';
  },

  /**
   * Retourne la couleur pour un provider
   */
  getProviderColor(provider: string): string {
    const colors: Record<string, string> = {
      apple_health: '#FF3B30',
      google_fit: '#4285F4',
      fitbit: '#00B0B9',
      garmin: '#007CC3',
      whoop: '#00A9FF',
      oura: '#232323'
    };
    return colors[provider] || '#6B7280';
  },

  /**
   * Formate une durée en minutes vers un texte lisible
   */
  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}min`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}min`;
  },

  /**
   * Calcule le score de santé global
   */
  calculateHealthScore(metrics: {
    restingHeartRate?: number;
    hrv?: number;
    sleepMinutes?: number;
    steps?: number;
  }): number {
    let score = 50;
    let factors = 0;

    if (metrics.restingHeartRate) {
      // RHR optimal: 50-70
      const rhrScore = metrics.restingHeartRate < 50 ? 90 :
                       metrics.restingHeartRate < 70 ? 100 :
                       metrics.restingHeartRate < 80 ? 70 :
                       metrics.restingHeartRate < 90 ? 50 : 30;
      score += rhrScore;
      factors++;
    }

    if (metrics.hrv) {
      // HRV optimal: > 50ms
      const hrvScore = metrics.hrv > 80 ? 100 :
                       metrics.hrv > 50 ? 80 :
                       metrics.hrv > 30 ? 60 : 40;
      score += hrvScore;
      factors++;
    }

    if (metrics.sleepMinutes) {
      // Sleep optimal: 7-9h (420-540 min)
      const sleepScore = metrics.sleepMinutes >= 420 && metrics.sleepMinutes <= 540 ? 100 :
                         metrics.sleepMinutes >= 360 ? 70 :
                         metrics.sleepMinutes >= 300 ? 50 : 30;
      score += sleepScore;
      factors++;
    }

    if (metrics.steps) {
      // Steps optimal: > 8000
      const stepsScore = metrics.steps >= 10000 ? 100 :
                         metrics.steps >= 8000 ? 80 :
                         metrics.steps >= 5000 ? 60 : 40;
      score += stepsScore;
      factors++;
    }

    return factors > 0 ? Math.round(score / (factors + 1)) : 50;
  }
};

// ============================================================================
// HOOKS
// ============================================================================

export { useWearables } from './hooks/useWearables';
export type { UseWearablesReturn, HealthMetrics } from './hooks/useWearables';

// ============================================================================
// COMPONENTS
// ============================================================================

export { WearableCard } from './components/WearableCard';
export { WearableHealthDashboard } from './components/WearableHealthDashboard';
