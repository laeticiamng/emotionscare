import { logger } from '@/lib/logger';
import { supabase } from '@/integrations/supabase/client';

/**
 * Utilitaires pour les fonctions vocales avec gestion d'erreur et timeout
 * Utilise les edge functions Supabase et l'API Web Speech
 */
export class VoiceUtils {
  
  /**
   * Crée une promesse de timeout
   */
  private static createTimeout<T>(ms: number): Promise<T> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Voice request timeout')), ms)
    );
  }

  /**
   * Transcription vocale avec Web Speech API (fallback) ou Supabase edge function
   */
  static async transcribeAudio(audioData: string): Promise<string | null> {
    try {
      // Essayer l'edge function Supabase
      const { data, error } = await Promise.race([
        supabase.functions.invoke('voice-to-text', {
          body: { audio: audioData }
        }),
        this.createTimeout<{ data: { text: string } | null; error: Error | null }>(15000)
      ]);

      if (error) {
        throw error;
      }

      return data?.text || null;
    } catch (error) {
      logger.warn('Edge function transcription failed, using Web Speech API fallback', {}, 'API');
      
      // Fallback: utiliser Web Speech API si disponible
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        return this.useWebSpeechRecognition();
      }
      
      logger.error('Voice transcription failed - no fallback available', error as Error, 'API');
      return null;
    }
  }

  /**
   * Web Speech Recognition fallback
   */
  private static useWebSpeechRecognition(): Promise<string | null> {
    return new Promise((resolve) => {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        resolve(null);
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = 'fr-FR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        resolve(transcript);
      };

      recognition.onerror = () => {
        resolve(null);
      };

      recognition.start();
    });
  }

  /**
   * Synthèse vocale avec l'edge function Supabase ou Web Speech API
   */
  static async synthesizeText(text: string, voice?: string): Promise<string | null> {
    try {
      // Essayer l'edge function Supabase text-to-voice
      const { data, error } = await Promise.race([
        supabase.functions.invoke('text-to-voice', {
          body: { text, voice: voice || 'alloy' }
        }),
        this.createTimeout<{ data: { audioContent: string } | null; error: Error | null }>(15000)
      ]);

      if (error) {
        throw error;
      }

      return data?.audioContent || null;
    } catch (error) {
      logger.warn('Edge function synthesis failed, using Web Speech API fallback', {}, 'API');
      
      // Fallback: utiliser Web Speech Synthesis API
      if ('speechSynthesis' in window) {
        this.useWebSpeechSynthesis(text, voice);
        return 'web-speech-synthesis'; // Indicateur qu'on utilise le fallback
      }
      
      logger.error('Voice synthesis failed - no fallback available', error as Error, 'API');
      return null;
    }
  }

  /**
   * Web Speech Synthesis fallback
   */
  private static useWebSpeechSynthesis(text: string, _voiceName?: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Chercher une voix française si disponible
    const voices = speechSynthesis.getVoices();
    const frenchVoice = voices.find(v => v.lang.startsWith('fr'));
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    speechSynthesis.speak(utterance);
  }

  /**
   * Vérifier si la synthèse vocale est disponible
   */
  static isSpeechSynthesisAvailable(): boolean {
    return 'speechSynthesis' in window;
  }

  /**
   * Vérifier si la reconnaissance vocale est disponible
   */
  static isSpeechRecognitionAvailable(): boolean {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }
}
