// @ts-nocheck

import { toast } from '@/hooks/use-toast';
import { GlobalInterceptor } from './globalInterceptor';
import { logger } from '@/lib/logger';

/**
 * Utilitaires vocaux ultra-robustes avec gestion d'erreur complète
 * Timeout strict et désactivation temporaire en cas d'erreur
 */
export class RobustVoiceUtils {
  private static disabledUntil: { [key: string]: number } = {};
  private static readonly TIMEOUT_MS = 15000; // 15s timeout strict
  private static readonly DISABLE_DURATION_MS = 30000; // 30s désactivation
  
  /**
   * Vérifie si une fonction vocale est temporairement désactivée
   */
  private static isDisabled(functionName: string): boolean {
    const disabledUntil = this.disabledUntil[functionName];
    if (disabledUntil && Date.now() < disabledUntil) {
      const remainingSeconds = Math.ceil((disabledUntil - Date.now()) / 1000);
      toast({
        title: "Fonction vocale indisponible",
        description: `Réessayez dans ${remainingSeconds} secondes`,
        variant: "destructive",
      });
      return true;
    }
    return false;
  }

  /**
   * Désactive temporairement une fonction vocale
   */
  private static disableTemporarily(functionName: string): void {
    this.disabledUntil[functionName] = Date.now() + this.DISABLE_DURATION_MS;
    toast({
      title: "Fonction vocale temporairement indisponible",
      description: "Service en maintenance, réessayez dans 30 secondes",
      variant: "destructive",
    });
  }

  /**
   * Appel sécurisé pour la transcription vocale
   */
  static async transcribeAudio(audioData: string): Promise<string | null> {
    const functionName = 'transcribeAudio';
    
    if (this.isDisabled(functionName)) {
      return null;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      const response = await GlobalInterceptor.secureFetch('/api/voice-to-text', {
        method: 'POST',
        body: JSON.stringify({ audio: audioData }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response) {
        // GlobalInterceptor a géré l'erreur
        this.disableTemporarily(functionName);
        return null;
      }

      if (response.status >= 500) {
        throw new Error(`Voice service error: ${response.status}`);
      }

      const result = await response.json();
      return result.text || null;

    } catch (error: any) {
      if (error.name === 'AbortError') {
        logger.error(`[Voice] ${functionName} timeout exceeded`, error as Error, 'VR');
        toast({
          title: "Timeout vocal",
          description: "La transcription a pris trop de temps",
          variant: "destructive",
        });
      } else {
        logger.error(`[Voice] ${functionName} error`, error as Error, 'VR');
      }
      
      this.disableTemporarily(functionName);
      return null;
    }
  }

  /**
   * Appel sécurisé pour la synthèse vocale
   */
  static async synthesizeText(text: string, voice?: string): Promise<string | null> {
    const functionName = 'synthesizeText';
    
    if (this.isDisabled(functionName)) {
      return null;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      const response = await GlobalInterceptor.secureFetch('/api/text-to-voice', {
        method: 'POST',
        body: JSON.stringify({ text, voice }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response) {
        // GlobalInterceptor a géré l'erreur
        this.disableTemporarily(functionName);
        return null;
      }

      if (response.status >= 500) {
        throw new Error(`Voice service error: ${response.status}`);
      }

      const result = await response.json();
      return result.audioContent || null;

    } catch (error: any) {
      if (error.name === 'AbortError') {
        logger.error(`[Voice] ${functionName} timeout exceeded`, error as Error, 'VR');
        toast({
          title: "Timeout vocal",
          description: "La synthèse vocale a pris trop de temps",
          variant: "destructive",
        });
      } else {
        logger.error(`[Voice] ${functionName} error`, error as Error, 'VR');
      }
      
      this.disableTemporarily(functionName);
      return null;
    }
  }

  /**
   * Obtient le temps restant avant réactivation
   */
  static getDisabledTimeRemaining(functionName: string): number {
    const disabledUntil = this.disabledUntil[functionName];
    if (disabledUntil && Date.now() < disabledUntil) {
      return Math.ceil((disabledUntil - Date.now()) / 1000);
    }
    return 0;
  }

  /**
   * Force la réactivation d'une fonction (pour debug)
   */
  static forceEnable(functionName: string): void {
    delete this.disabledUntil[functionName];
    logger.info(`[Voice] ${functionName} forcefully enabled`, {}, 'VR');
  }

  /**
   * Status de toutes les fonctions vocales
   */
  static getStatus(): { [key: string]: { disabled: boolean; timeRemaining: number } } {
    return {
      transcribeAudio: {
        disabled: this.isDisabled('transcribeAudio'),
        timeRemaining: this.getDisabledTimeRemaining('transcribeAudio')
      },
      synthesizeText: {
        disabled: this.isDisabled('synthesizeText'),
        timeRemaining: this.getDisabledTimeRemaining('synthesizeText')
      }
    };
  }
}
