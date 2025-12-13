/**
 * Journal AI Processor - Traitement AI réel pour le journal
 * Utilise Lovable AI Gateway pour transcription et analyse de sentiment
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface JournalProcessingResult {
  content: string;
  summary: string;
  tone: 'positive' | 'neutral' | 'negative';
  emotions?: string[];
  keywords?: string[];
  suggestedTags?: string[];
  confidence: number;
}

export interface VoiceProcessingResult extends JournalProcessingResult {
  transcription: string;
  language: string;
  duration: number;
}

/**
 * Service de traitement AI pour les entrées de journal
 */
export const journalAIProcessor = {
  /**
   * Traite une entrée vocale avec transcription et analyse
   */
  async processVoiceEntry(audioBlob: Blob): Promise<VoiceProcessingResult> {
    try {
      logger.info('Processing voice entry with AI', { size: audioBlob.size }, 'JOURNAL_AI');

      // Convertir blob en base64 pour l'envoi
      const base64Audio = await blobToBase64(audioBlob);

      // Appeler l'edge function pour traitement
      const { data, error } = await supabase.functions.invoke('journal-ai-process', {
        body: {
          action: 'voice',
          audio: base64Audio,
          mimeType: audioBlob.type || 'audio/webm'
        }
      });

      if (error) {
        logger.error('Voice processing edge function error', error, 'JOURNAL_AI');
        return fallbackVoiceResult(audioBlob);
      }

      if (!data?.success) {
        logger.warn('Voice processing returned unsuccessful', data, 'JOURNAL_AI');
        return fallbackVoiceResult(audioBlob);
      }

      return {
        content: data.transcription || '',
        transcription: data.transcription || '',
        summary: data.summary || 'Note vocale',
        tone: data.tone || 'neutral',
        emotions: data.emotions || [],
        keywords: data.keywords || [],
        suggestedTags: data.suggestedTags || [],
        confidence: data.confidence || 0.8,
        language: data.language || 'fr',
        duration: data.duration || estimateDuration(audioBlob)
      };
    } catch (error) {
      logger.error('Error processing voice entry', error as Error, 'JOURNAL_AI');
      return fallbackVoiceResult(audioBlob);
    }
  },

  /**
   * Traite une entrée texte avec analyse de sentiment et extraction
   */
  async processTextEntry(text: string): Promise<JournalProcessingResult> {
    try {
      if (!text || text.trim().length === 0) {
        return {
          content: text,
          summary: '',
          tone: 'neutral',
          confidence: 1
        };
      }

      logger.info('Processing text entry with AI', { length: text.length }, 'JOURNAL_AI');

      // Appeler l'edge function pour traitement
      const { data, error } = await supabase.functions.invoke('journal-ai-process', {
        body: {
          action: 'text',
          text
        }
      });

      if (error) {
        logger.error('Text processing edge function error', error, 'JOURNAL_AI');
        return fallbackTextResult(text);
      }

      if (!data?.success) {
        logger.warn('Text processing returned unsuccessful', data, 'JOURNAL_AI');
        return fallbackTextResult(text);
      }

      return {
        content: text,
        summary: data.summary || generateSimpleSummary(text),
        tone: data.tone || 'neutral',
        emotions: data.emotions || [],
        keywords: data.keywords || [],
        suggestedTags: data.suggestedTags || [],
        confidence: data.confidence || 0.85
      };
    } catch (error) {
      logger.error('Error processing text entry', error as Error, 'JOURNAL_AI');
      return fallbackTextResult(text);
    }
  },

  /**
   * Génère des suggestions de tags basées sur le contenu
   */
  async generateTagSuggestions(content: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.functions.invoke('journal-ai-process', {
        body: {
          action: 'tags',
          text: content
        }
      });

      if (error || !data?.success) {
        return extractKeywords(content);
      }

      return data.tags || [];
    } catch {
      return extractKeywords(content);
    }
  },

  /**
   * Analyse les tendances émotionnelles sur une période
   */
  async analyzeEmotionalTrends(entries: Array<{ content: string; created_at: string }>): Promise<{
    dominantTone: 'positive' | 'neutral' | 'negative';
    trendDirection: 'improving' | 'stable' | 'declining';
    insights: string[];
  }> {
    try {
      const { data, error } = await supabase.functions.invoke('journal-ai-process', {
        body: {
          action: 'trends',
          entries: entries.slice(0, 20) // Limiter à 20 entrées
        }
      });

      if (error || !data?.success) {
        return {
          dominantTone: 'neutral',
          trendDirection: 'stable',
          insights: ['Pas assez de données pour une analyse détaillée.']
        };
      }

      return {
        dominantTone: data.dominantTone || 'neutral',
        trendDirection: data.trendDirection || 'stable',
        insights: data.insights || []
      };
    } catch {
      return {
        dominantTone: 'neutral',
        trendDirection: 'stable',
        insights: ['Analyse indisponible.']
      };
    }
  }
};

// Helpers

async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1] || base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function estimateDuration(blob: Blob): number {
  // Estimation approximative basée sur la taille
  return Math.max(1, Math.round(blob.size / 16000));
}

function fallbackVoiceResult(blob: Blob): VoiceProcessingResult {
  return {
    content: '[Transcription non disponible - service AI temporairement indisponible]',
    transcription: '',
    summary: 'Note vocale',
    tone: 'neutral',
    emotions: [],
    keywords: [],
    suggestedTags: [],
    confidence: 0,
    language: 'fr',
    duration: estimateDuration(blob)
  };
}

function fallbackTextResult(text: string): JournalProcessingResult {
  return {
    content: text,
    summary: generateSimpleSummary(text),
    tone: analyzeToneHeuristic(text),
    emotions: [],
    keywords: extractKeywords(text),
    suggestedTags: extractKeywords(text).slice(0, 3),
    confidence: 0.5
  };
}

function generateSimpleSummary(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3).trim() + '...';
}

function analyzeToneHeuristic(text: string): 'positive' | 'neutral' | 'negative' {
  const lower = text.toLowerCase();
  
  const positive = ['heureux', 'content', 'joie', 'super', 'bien', 'merci', 'génial', 'excellent', 'parfait', 'amour'];
  const negative = ['triste', 'mal', 'stress', 'anxieux', 'peur', 'colère', 'frustré', 'déprimé', 'inquiet', 'horrible'];
  
  let posCount = 0, negCount = 0;
  positive.forEach(w => { if (lower.includes(w)) posCount++; });
  negative.forEach(w => { if (lower.includes(w)) negCount++; });
  
  if (posCount > negCount) return 'positive';
  if (negCount > posCount) return 'negative';
  return 'neutral';
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'mais', 'donc', 'car', 'ni', 'que', 'qui', 'quoi', 'dont', 'où', 'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'ce', 'cette', 'ces', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'notre', 'nos', 'votre', 'vos', 'leur', 'leurs', 'ai', 'as', 'a', 'avons', 'avez', 'ont', 'suis', 'es', 'est', 'sommes', 'êtes', 'sont', 'été', 'être', 'avoir', 'fait', 'faire', 'pour', 'dans', 'sur', 'avec', 'sans', 'par', 'chez', 'vers', 'entre', 'sous', 'après', 'avant', 'depuis', 'pendant', 'plus', 'moins', 'très', 'aussi', 'bien', 'mal', 'peu', 'tout', 'tous', 'toute', 'toutes']);
  
  const words = text.toLowerCase()
    .replace(/[^\wàâäéèêëïîôùûüç\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));
  
  const freq: Record<string, number> = {};
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

export default journalAIProcessor;
