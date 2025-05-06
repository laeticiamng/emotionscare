
import { CoachAction, CoachEvent, EmotionalData } from './types';

/**
 * Service for handling emotional data
 */
export class EmotionalDataService {
  private userEmotionalData: Map<string, EmotionalData[]> = new Map();

  /**
   * Update user emotional data with new entry
   */
  updateUserEmotionalData(userId: string, data: EmotionalData): void {
    if (!this.userEmotionalData.has(userId)) {
      this.userEmotionalData.set(userId, []);
    }
    
    const userData = this.userEmotionalData.get(userId);
    if (userData) {
      userData.push({
        ...data,
        date: data.date || new Date().toISOString()
      });
    }
  }

  /**
   * Get user emotional data
   */
  getUserEmotionalData(userId: string): EmotionalData[] {
    return this.userEmotionalData.get(userId) || [];
  }

  /**
   * Check if user has a negative emotional trend
   */
  hasNegativeTrend(userId: string): boolean {
    const userData = this.userEmotionalData.get(userId) || [];
    if (userData.length < 3) return false;
    
    // Get last 3 entries
    const recent = userData.slice(-3);
    const scores = recent.map(entry => entry.score || 50);
    
    // Check if scores are consistently decreasing
    return scores[0] > scores[1] && scores[1] > scores[2];
  }

  /**
   * Determine actions based on emotional data
   */
  determineActions(event: CoachEvent): CoachAction[] {
    const actions: CoachAction[] = [];
    const data = event.data || {};
    
    // Record emotional data
    actions.push({ type: 'record_emotion_data', payload: data });
    
    // Check if emotions require an alert
    if (data.emotion && (data.intensity > 7 || data.score < 30)) {
      actions.push({ type: 'check_emotion_alert', payload: data });
    }
    
    // Suggest an adapted VR session
    if (data.emotion && ['tristesse', 'stress', 'anxiété'].includes(data.emotion.toLowerCase())) {
      actions.push({ type: 'suggest_vr_session', payload: { emotion: data.emotion } });
    }
    
    // Update music playlist
    if (data.emotion) {
      actions.push({
        type: 'update_music_playlist',
        payload: { emotion: data.emotion, intensity: data.intensity || 5 }
      });
    }
    
    return actions;
  }
}

// Create a singleton instance
export const emotionalDataService = new EmotionalDataService();

/**
 * Determine actions based on emotional data (legacy function)
 */
export function determineActions(event: CoachEvent): CoachAction[] {
  return emotionalDataService.determineActions(event);
}
