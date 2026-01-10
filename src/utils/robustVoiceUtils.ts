// @ts-nocheck

import { toast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

/**
 * Utilitaires vocaux ultra-robustes utilisant Web Speech API
 * Pas d'appels API backend - utilise les APIs navigateur natives
 */
export class RobustVoiceUtils {
  private static disabledUntil: { [key: string]: number } = {};
  private static readonly TIMEOUT_MS = 15000;
  private static readonly DISABLE_DURATION_MS = 30000;
  private static recognition: SpeechRecognition | null = null;
  private static synthesis: SpeechSynthesis | null = null;
  
  /**
   * Initialise les APIs vocales du navigateur
   */
  private static initSpeechAPIs(): void {
    if (typeof window === 'undefined') return;
    
    // Speech Recognition
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                                  (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI && !this.recognition) {
      this.recognition = new SpeechRecognitionAPI();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'fr-FR';
    }
    
    // Speech Synthesis
    if (window.speechSynthesis && !this.synthesis) {
      this.synthesis = window.speechSynthesis;
    }
  }
  
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
   * Transcription vocale via Web Speech API
   */
  static async transcribeAudio(_audioData?: string): Promise<string | null> {
    const functionName = 'transcribeAudio';
    
    if (this.isDisabled(functionName)) {
      return null;
    }

    this.initSpeechAPIs();
    
    if (!this.recognition) {
      logger.warn('Speech Recognition not available in this browser', {}, 'VR');
      toast({
        title: "Reconnaissance vocale non disponible",
        description: "Votre navigateur ne supporte pas cette fonctionnalité",
        variant: "destructive",
      });
      return null;
    }

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        this.recognition?.stop();
        logger.warn('Speech recognition timeout', {}, 'VR');
        resolve(null);
      }, this.TIMEOUT_MS);

      this.recognition!.onresult = (event) => {
        clearTimeout(timeoutId);
        const transcript = event.results[0]?.[0]?.transcript || null;
        logger.info('Speech transcribed', { length: transcript?.length }, 'VR');
        resolve(transcript);
      };

      this.recognition!.onerror = (event) => {
        clearTimeout(timeoutId);
        logger.error(`Speech recognition error: ${event.error}`, new Error(event.error), 'VR');
        if (event.error === 'not-allowed' || event.error === 'network') {
          this.disableTemporarily(functionName);
        }
        resolve(null);
      };

      this.recognition!.onend = () => {
        clearTimeout(timeoutId);
      };

      try {
        this.recognition!.start();
      } catch (error) {
        clearTimeout(timeoutId);
        logger.error('Failed to start speech recognition', error as Error, 'VR');
        resolve(null);
      }
    });
  }

  /**
   * Synthèse vocale via Web Speech Synthesis API
   */
  static async synthesizeText(text: string, voice?: string): Promise<string | null> {
    const functionName = 'synthesizeText';
    
    if (this.isDisabled(functionName)) {
      return null;
    }

    this.initSpeechAPIs();

    if (!this.synthesis) {
      logger.warn('Speech Synthesis not available in this browser', {}, 'VR');
      toast({
        title: "Synthèse vocale non disponible",
        description: "Votre navigateur ne supporte pas cette fonctionnalité",
        variant: "destructive",
      });
      return null;
    }

    return new Promise((resolve) => {
      try {
        // Cancel any ongoing speech
        this.synthesis!.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 0.9;
        utterance.pitch = 1;

        // Select voice if specified
        if (voice) {
          const voices = this.synthesis!.getVoices();
          const selectedVoice = voices.find(v => 
            v.name.toLowerCase().includes(voice.toLowerCase()) ||
            v.lang.includes('fr')
          );
          if (selectedVoice) {
            utterance.voice = selectedVoice;
          }
        }

        const timeoutId = setTimeout(() => {
          this.synthesis!.cancel();
          logger.warn('Speech synthesis timeout', {}, 'VR');
          resolve(null);
        }, this.TIMEOUT_MS);

        utterance.onend = () => {
          clearTimeout(timeoutId);
          logger.info('Speech synthesis completed', { textLength: text.length }, 'VR');
          resolve('completed');
        };

        utterance.onerror = (event) => {
          clearTimeout(timeoutId);
          logger.error(`Speech synthesis error: ${event.error}`, new Error(event.error), 'VR');
          this.disableTemporarily(functionName);
          resolve(null);
        };

        this.synthesis!.speak(utterance);
      } catch (error) {
        logger.error('Failed to synthesize speech', error as Error, 'VR');
        resolve(null);
      }
    });
  }

  /**
   * Arrête la synthèse vocale en cours
   */
  static stopSynthesis(): void {
    this.initSpeechAPIs();
    this.synthesis?.cancel();
  }

  /**
   * Arrête la reconnaissance vocale en cours
   */
  static stopRecognition(): void {
    this.recognition?.stop();
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
   * Vérifie la disponibilité des APIs vocales
   */
  static checkAvailability(): { recognition: boolean; synthesis: boolean } {
    this.initSpeechAPIs();
    return {
      recognition: !!this.recognition,
      synthesis: !!this.synthesis,
    };
  }

  /**
   * Status de toutes les fonctions vocales
   */
  static getStatus(): { [key: string]: { disabled: boolean; timeRemaining: number; available: boolean } } {
    const availability = this.checkAvailability();
    return {
      transcribeAudio: {
        disabled: this.isDisabled('transcribeAudio'),
        timeRemaining: this.getDisabledTimeRemaining('transcribeAudio'),
        available: availability.recognition,
      },
      synthesizeText: {
        disabled: this.isDisabled('synthesizeText'),
        timeRemaining: this.getDisabledTimeRemaining('synthesizeText'),
        available: availability.synthesis,
      }
    };
  }
}
