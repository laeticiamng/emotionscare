/**
 * Flash Glow Service - Gestion des sessions de luminothérapie
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface FlashGlowSession {
  duration_s: number;
  label: 'gain' | 'léger' | 'incertain';
  glow_type?: string;
  intensity?: number;
  result?: 'completed' | 'interrupted';
  metadata?: Record<string, any>;
}

export interface FlashGlowResponse {
  success: boolean;
  message: string;
  next_session_in?: string;
  session_id?: string | null;
  activity_session_id?: string | null;
  mood_delta?: number | null;
  satisfaction_score?: number | null;
}

export interface FlashGlowStats {
  total_sessions: number;
  avg_duration: number;
  recent_sessions: any[];
}

class FlashGlowService {
  /**
   * Démarrer une session Flash Glow
   */
  async startSession(config: {
    glowType: string;
    intensity: number;
    duration: number;
  }): Promise<{ sessionId: string }> {
    logger.info('Flash Glow session started', config, 'MUSIC');
    
    // Simuler une session avec ID unique
    const sessionId = `fg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return { sessionId };
  }

  /**
   * Terminer une session et envoyer les métriques
   */
  async endSession(sessionData: FlashGlowSession): Promise<FlashGlowResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('flash-glow-metrics', {
        body: sessionData
      });

      if (error) {
        const message = error.message || 'Erreur lors de l\'envoi des métriques';
        if (typeof error.status === 'number' && error.status === 401) {
          throw new Error('Authentification requise pour enregistrer la session Flash Glow');
        }

        throw new Error(message);
      }

      return data as FlashGlowResponse;
    } catch (error) {
      logger.error('Flash Glow Service Error', error as Error, 'MUSIC');
      throw error;
    }
  }

  /**
   * Récupérer les statistiques utilisateur
   */
  async getStats(): Promise<FlashGlowStats> {
    try {
      const { data, error } = await supabase.functions.invoke('flash-glow-metrics', {
        method: 'GET'
      });

      if (error) {
        throw new Error(error.message || 'Erreur lors de la récupération des stats');
      }

      return data;
    } catch (error) {
      logger.error('Flash Glow Stats Error', error as Error, 'MUSIC');
      // Retourner des stats par défaut en cas d'erreur
      return {
        total_sessions: 0,
        avg_duration: 0,
        recent_sessions: []
      };
    }
  }

  /**
   * Trigger vibration si supporté
   */
  triggerHapticFeedback(pattern: number[] = [100, 50, 100]) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }

  /**
   * Calculer le score basé sur la performance
   */
  calculateScore(duration: number, intensity: number, completed: boolean): number {
    let score = Math.floor(duration * 2); // Points de base
    
    if (intensity > 80) score += 20; // Bonus haute intensité
    if (completed) score += 50; // Bonus completion
    if (duration >= 90) score += 30; // Bonus longue session
    
    return Math.min(score, 300); // Cap à 300 points
  }

  /**
   * Obtenir une recommandation basée sur la performance
   */
  getRecommendation(label: FlashGlowSession['label'], streak: number): string {
    const recommendations = {
      'gain': [
        'Excellent ! Votre énergie rayonne ✨',
        'Incroyable performance ! Vous brillez 🌟',
        'Votre aura est éclatante aujourd\'hui 💫'
      ],
      'léger': [
        'Progrès en douceur, continuez 🌱',
        'Chaque petit pas compte 🌟',
        'Votre lumière grandit doucement ✨'
      ],
      'incertain': [
        'Chaque glow compte, félicitations 💫',
        'Votre persévérance paiera 🌟',
        'La magie opère même en douceur ✨'
      ]
    };

    const messages = recommendations[label];
    const baseMessage = messages[Math.floor(Math.random() * messages.length)];
    
    if (streak > 3) {
      return `${baseMessage}\n🔥 Streak de ${streak} jours !`;
    }
    
    return baseMessage;
  }
}

export const flashGlowService = new FlashGlowService();