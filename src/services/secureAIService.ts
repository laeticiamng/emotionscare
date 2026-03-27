// @ts-nocheck
/**
 * Service AI sécurisé - Toutes les requêtes passent par Edge Functions
 * Remplace les appels directs à OpenAI côté client
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
}

export interface SentimentResult {
  tone: 'positive' | 'neutral' | 'negative';
  score: number;
  confidence: number;
}

export interface EmotionResult {
  tone: 'positive' | 'neutral' | 'negative';
  emotions: Record<string, number>;
  dominantEmotion?: string;
}

class SecureAIService {
  /**
   * Transcrit un audio via Edge Function
   */
  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    try {
      const base64 = await this.blobToBase64(audioBlob);
      
      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: { action: 'transcribe', audioBase64: base64 }
      });

      if (error) {
        logger.error('Transcription failed', error, 'SECURE_AI');
        return { text: '[Transcription non disponible]', language: 'fr' };
      }

      return data;
    } catch (error) {
      logger.error('Transcription error', error as Error, 'SECURE_AI');
      return { text: '[Erreur de transcription]', language: 'fr' };
    }
  }

  /**
   * Analyse le sentiment d'un texte via Edge Function
   */
  async analyzeSentiment(text: string): Promise<SentimentResult> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: { action: 'sentiment', text }
      });

      if (error) {
        logger.error('Sentiment analysis failed', error, 'SECURE_AI');
        return { tone: 'neutral', score: 0, confidence: 0.5 };
      }

      return data;
    } catch (error) {
      logger.error('Sentiment error', error as Error, 'SECURE_AI');
      return { tone: 'neutral', score: 0, confidence: 0.5 };
    }
  }

  /**
   * Analyse les émotions d'un texte via Edge Function
   */
  async analyzeEmotions(text: string): Promise<EmotionResult> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: { action: 'emotions', text }
      });

      if (error) {
        logger.error('Emotion analysis failed', error, 'SECURE_AI');
        return { tone: 'neutral', emotions: {}, dominantEmotion: undefined };
      }

      return data;
    } catch (error) {
      logger.error('Emotion error', error as Error, 'SECURE_AI');
      return { tone: 'neutral', emotions: {}, dominantEmotion: undefined };
    }
  }

  /**
   * Génère un résumé via Edge Function
   */
  async generateSummary(text: string): Promise<string> {
    try {
      if (text.length <= 100) return text;

      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: { action: 'summary', text }
      });

      if (error) {
        return text.substring(0, 97) + '...';
      }

      return data.summary;
    } catch (error) {
      return text.substring(0, 97) + '...';
    }
  }

  /**
   * Génère une image via Edge Function
   */
  async generateImage(prompt: string): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('ai-analysis', {
        body: { action: 'generateImage', prompt }
      });

      if (error) {
        logger.error('Image generation failed', error, 'SECURE_AI');
        return null;
      }

      return data.imageUrl;
    } catch (error) {
      logger.error('Image generation error', error as Error, 'SECURE_AI');
      return null;
    }
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const secureAIService = new SecureAIService();
