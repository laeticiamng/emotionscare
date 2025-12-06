/**
 * screen-silkService - Service pour les micro-pauses Screen Silk
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface ScreenSilkMetrics {
  duration_s: number;
  label?: 'gain' | 'léger' | 'incertain';
}

export interface ScreenSilkSession {
  id: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  interrupted: boolean;
  blinkCount: number;
}

class ScreenSilkService {
  private currentSession: ScreenSilkSession | null = null;

  /**
   * Démarrer une session Screen Silk
   */
  async startSession(duration: number = 180): Promise<ScreenSilkSession> {
    const session: ScreenSilkSession = {
      id: Date.now().toString(),
      duration,
      startTime: new Date(),
      interrupted: false,
      blinkCount: 0
    };

    this.currentSession = session;
    
    // Analytics
    if (window.gtag) {
      window.gtag('event', 'silk_start', {
        event_category: 'module',
        event_label: 'screen-silk',
        value: duration
      });
    }

    return session;
  }

  /**
   * Terminer une session Screen Silk
   */
  async endSession(label: 'gain' | 'léger' | 'incertain' = 'gain'): Promise<void> {
    if (!this.currentSession) return;

    const endTime = new Date();
    const actualDuration = Math.floor((endTime.getTime() - this.currentSession.startTime.getTime()) / 1000);

    this.currentSession.endTime = endTime;

    // Envoyer les métriques
    try {
      const response = await supabase.functions.invoke('micro-breaks-metrics', {
        body: {
          module: 'screen-silk',
          action: 'end',
          duration_s: actualDuration,
          label,
          blink_count: this.currentSession.blinkCount
        }
      });

      if (response.error) {
        logger.error('Erreur envoi métriques Screen Silk', response.error, 'SYSTEM');
      }
    } catch (error) {
      logger.error('Erreur service Screen Silk', error as Error, 'SYSTEM');
    }

    // Analytics
    if (window.gtag) {
      window.gtag('event', 'silk_finish', {
        event_category: 'module',
        event_label: label,
        value: actualDuration
      });
    }

    this.currentSession = null;
  }

  /**
   * Interrompre une session
   */
  async interruptSession(): Promise<void> {
    if (!this.currentSession) return;

    this.currentSession.interrupted = true;
    await this.endSession('incertain');
  }

  /**
   * Incrémenter le compteur de clignements
   */
  incrementBlink(): void {
    if (this.currentSession) {
      this.currentSession.blinkCount++;
    }
  }

  /**
   * Obtenir la session actuelle
   */
  getCurrentSession(): ScreenSilkSession | null {
    return this.currentSession;
  }

  /**
   * Vérifier si une session est active
   */
  isSessionActive(): boolean {
    return this.currentSession !== null;
  }
}

export const screenSilkService = new ScreenSilkService();