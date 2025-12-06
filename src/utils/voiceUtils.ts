
import { ApiErrorHandler } from '@/utils/errorHandlers';

/**
 * Utilitaires pour les fonctions vocales avec gestion d'erreur et timeout
 */
export class VoiceUtils {
  
  /**
   * Appel sécurisé pour la transcription vocale
   */
  static async transcribeAudio(audioData: string): Promise<string | null> {
    try {
      const response = await Promise.race([
        fetch('/api/voice-to-text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audio: audioData }),
        }),
        ApiErrorHandler.createVoiceTimeout(15000)
      ]);

      if (!response.ok) {
        throw new Error(`Voice API returned ${response.status}`);
      }

      const result = await response.json();
      return result.text || null;
    } catch (error: any) {
      ApiErrorHandler.handleVoiceError(error, 'transcribeAudio');
      return null;
    }
  }

  /**
   * Appel sécurisé pour la synthèse vocale
   */
  static async synthesizeText(text: string, voice?: string): Promise<string | null> {
    try {
      const response = await Promise.race([
        fetch('/api/text-to-voice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text, voice }),
        }),
        ApiErrorHandler.createVoiceTimeout(15000)
      ]);

      if (!response.ok) {
        throw new Error(`Voice API returned ${response.status}`);
      }

      const result = await response.json();
      return result.audioContent || null;
    } catch (error: any) {
      ApiErrorHandler.handleVoiceError(error, 'synthesizeText');
      return null;
    }
  }
}
