import { supabase } from '@/integrations/supabase/client';
import { EmotionResult } from '@/types/emotion';
import { logger } from '@/lib/logger';

export class EmotionService {
  static async analyzeText(text: string): Promise<EmotionResult> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-emotion', {
        body: { text, type: 'text' }
      });

      if (error) throw error;

      return {
        emotion: data.emotion,
        confidence: data.confidence,
        valence: data.valence || 0,
        arousal: data.arousal || 0,
        source: 'text',
        timestamp: new Date(),
        transcription: text,
        sentiment: data.sentiment,
        details: data.details
      };
    } catch (error) {
      logger.error('Erreur analyse texte', error as Error, 'SCAN');
      throw new Error('Erreur lors de l\'analyse du texte');
    }
  }

  static async analyzeAudio(audioBlob: Blob): Promise<EmotionResult> {
    try {
      const audioData = await this.blobToBase64(audioBlob);
      
      const { data, error } = await supabase.functions.invoke('analyze-emotion', {
        body: { audioData, type: 'audio' }
      });

      if (error) throw error;

      return {
        emotion: data.emotion,
        confidence: data.confidence,
        valence: data.valence || 0,
        arousal: data.arousal || 0,
        source: 'voice',
        timestamp: new Date(),
        transcription: data.transcription,
        sentiment: data.sentiment,
        details: data.details
      };
    } catch (error) {
      logger.error('Erreur analyse audio', error as Error, 'SCAN');
      throw new Error('Erreur lors de l\'analyse audio');
    }
  }

  static async analyzeFacial(imageData: string): Promise<EmotionResult> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-emotion', {
        body: { imageData, type: 'facial' }
      });

      if (error) throw error;

      return {
        emotion: data.emotion,
        confidence: data.confidence,
        valence: data.valence || 0,
        arousal: data.arousal || 0,
        source: 'facial',
        timestamp: new Date(),
        details: data.details
      };
    } catch (error) {
      logger.error('Erreur analyse faciale', error as Error, 'SCAN');
      throw new Error('Erreur lors de l\'analyse faciale');
    }
  }

  static async saveEmotionResult(result: EmotionResult): Promise<void> {
    try {
      const { error } = await supabase
        .from('emotion_analyses')
        .insert({
          emotion: result.emotion,
          confidence: result.confidence,
          source: result.source,
          transcription: result.transcription,
          sentiment: result.sentiment,
          details: result.details,
          user_id: (await supabase.auth.getUser()).data.user?.id
        });

      if (error) throw error;
    } catch (error) {
      logger.error('Erreur sauvegarde', error as Error, 'SCAN');
      throw new Error('Erreur lors de la sauvegarde');
    }
  }

  private static blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data:audio/wav;base64, prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
