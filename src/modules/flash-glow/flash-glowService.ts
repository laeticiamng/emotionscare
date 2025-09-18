/**
 * Flash Glow Service - Gestion des sessions de luminothérapie
 */

import { supabase } from '@/integrations/supabase/client';
import { sessionsService, SessionsAuthError } from '@/services/sessions.service';

export interface FlashGlowSession {
  duration_s: number;
  label: 'gain' | 'léger' | 'incertain';
  glow_type?: string;
  intensity?: number;
  result?: 'completed' | 'interrupted';
  mood_before?: number | null;
  mood_after?: number | null;
  mood_delta?: number | null;
  metadata?: Record<string, any>;
}

export interface FlashGlowResponse {
  success: boolean;
  message: string;
  next_session_in?: string;
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
    console.log('🌟 Flash Glow session started:', config);
    
    // Simuler une session avec ID unique
    const sessionId = `fg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return { sessionId };
  }

  /**
   * Terminer une session et envoyer les métriques
   */
  async endSession(sessionData: FlashGlowSession): Promise<FlashGlowResponse> {
    try {
      await sessionsService.logSession({
        type: 'flash_glow',
        durationSec: sessionData.duration_s,
        moodBefore: sessionData.mood_before ?? sessionData.metadata?.moodBefore ?? null,
        moodAfter: sessionData.mood_after ?? sessionData.metadata?.moodAfter ?? null,
        moodDelta: sessionData.mood_delta ?? sessionData.metadata?.moodDelta ?? null,
        meta: {
          label: sessionData.label,
          glowType: sessionData.glow_type ?? 'energy',
          intensity: sessionData.intensity ?? 0,
          ...(sessionData.metadata ?? {}),
        },
      });

      let metricsResponse: FlashGlowResponse | null = null;

      try {
        const { data, error } = await supabase.functions.invoke('flash-glow-metrics', {
          body: sessionData
        });

        if (error) {
          throw new Error(error.message || 'Erreur lors de l\'envoi des métriques');
        }

        metricsResponse = data;
      } catch (metricsError) {
        console.warn('⚠️ Flash Glow metrics tracking failed:', metricsError);
      }

      return metricsResponse ?? {
        success: true,
        message: 'Session enregistrée',
        next_session_in: undefined
      };
    } catch (error) {
      if (error instanceof SessionsAuthError) {
        console.warn('Flash Glow session logging skipped: user not authenticated');
      } else {
        console.error('❌ Flash Glow Service Error:', error);
      }
      throw error;
    }
  }

  /**
   * Récupérer les statistiques utilisateur
   */
  async getStats(): Promise<FlashGlowStats> {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        throw new Error(userError?.message || 'Utilisateur non authentifié');
      }

      const { data, error } = await supabase
        .from('sessions')
        .select('id, created_at, duration_sec, mood_delta, meta')
        .eq('user_id', userData.user.id)
        .eq('type', 'flash_glow')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        throw new Error(error.message || 'Erreur lors de la récupération des sessions Flash Glow');
      }

      const totalSessions = data?.length ?? 0;
      const avgDuration = totalSessions
        ? Math.round(
          data!.reduce((acc, item) => acc + (item.duration_sec ?? 0), 0) / totalSessions
        )
        : 0;

      return {
        total_sessions: totalSessions,
        avg_duration: avgDuration,
        recent_sessions: data ?? []
      };
    } catch (error) {
      console.error('❌ Flash Glow Stats Error:', error);
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