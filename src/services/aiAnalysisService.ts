/**
 * aiAnalysisService - Service pour l'analyse AI (transcription, sentiment, emotion)
 * Utilise les Edge Functions Supabase pour l'analyse sécurisée
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface TranscriptionResult {
  text: string;
  language?: string;
  duration?: number;
}

export interface EmotionAnalysisResult {
  tone: 'positive' | 'neutral' | 'negative';
  emotions: {
    joy?: number;
    sadness?: number;
    anger?: number;
    fear?: number;
    surprise?: number;
    [key: string]: number | undefined;
  };
  dominantEmotion?: string;
}

export interface SentimentAnalysisResult {
  tone: 'positive' | 'neutral' | 'negative';
  score: number; // -1 to 1
  confidence: number; // 0 to 1
}

class AIAnalysisService {
  /**
   * Transcrit un audio via Edge Function
   */
  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    try {
      // Convertir le blob en base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );

      const { data, error } = await supabase.functions.invoke('openai-transcribe', {
        body: {
          audio: base64Audio,
          language: 'fr',
        },
      });

      if (error) {
        logger.warn('Transcription via Edge Function failed, using fallback', { error: error.message }, 'AI_ANALYSIS');
        return this.fallbackTranscription(audioBlob);
      }

      return {
        text: data?.text || '',
        language: data?.language || 'fr',
        duration: data?.duration,
      };
    } catch (error) {
      logger.error('Error transcribing audio', error as Error, 'AI_ANALYSIS');
      return this.fallbackTranscription(audioBlob);
    }
  }

  /**
   * Fallback pour la transcription si l'API n'est pas disponible
   */
  private fallbackTranscription(audioBlob: Blob): TranscriptionResult {
    const duration = audioBlob.size / 16000; // Estimation approximative
    return {
      text: `[Enregistrement vocal de ${Math.round(duration)}s - Transcription automatique temporairement indisponible]`,
      language: 'fr',
      duration,
    };
  }

  /**
   * Analyse le sentiment d'un texte via Edge Function
   */
  async analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: { text, analysis_type: 'sentiment' },
      });

      if (error) {
        logger.warn('Sentiment analysis via Edge Function failed, using fallback', { error: error.message }, 'AI_ANALYSIS');
        return this.fallbackSentimentAnalysis(text);
      }

      return {
        tone: data?.tone || 'neutral',
        score: data?.score || 0,
        confidence: data?.confidence || 0.5,
      };
    } catch (error) {
      logger.error('Error analyzing sentiment', error as Error, 'AI_ANALYSIS');
      return this.fallbackSentimentAnalysis(text);
    }
  }

  /**
   * Analyse heuristique du sentiment (fallback)
   */
  private fallbackSentimentAnalysis(text: string): SentimentAnalysisResult {
    const lowerText = text.toLowerCase();

    // Mots positifs et négatifs en français
    const positiveWords = [
      'heureux', 'heureuse', 'joie', 'content', 'contente', 'super', 'génial',
      'excellent', 'merveilleux', 'magnifique', 'parfait', 'bien', 'mieux',
      'amour', 'aimer', 'adore', 'plaisir', 'sourire', 'rire', 'optimiste',
      'confiant', 'enthousiaste', 'gratitude', 'reconnaissant', 'chanceux'
    ];

    const negativeWords = [
      'triste', 'tristesse', 'malheureux', 'malheureuse', 'déprimé', 'déprimée',
      'anxieux', 'anxieuse', 'peur', 'inquiet', 'inquiète', 'stress', 'stressé',
      'colère', 'en colère', 'fâché', 'fâchée', 'frustré', 'frustrée', 'mal',
      'horrible', 'terrible', 'détester', 'haine', 'souffrir', 'souffrance',
      'pleurer', 'pleurs', 'désespoir', 'désespéré', 'découragé', 'découragée'
    ];

    let positiveCount = 0;
    let negativeCount = 0;

    for (const word of positiveWords) {
      if (lowerText.includes(word)) positiveCount++;
    }

    for (const word of negativeWords) {
      if (lowerText.includes(word)) negativeCount++;
    }

    const totalEmotionalWords = positiveCount + negativeCount;

    if (totalEmotionalWords === 0) {
      return { tone: 'neutral', score: 0, confidence: 0.5 };
    }

    const score = (positiveCount - negativeCount) / totalEmotionalWords;
    const confidence = Math.min(totalEmotionalWords / 10, 0.8);

    let tone: 'positive' | 'neutral' | 'negative';
    if (score > 0.2) {
      tone = 'positive';
    } else if (score < -0.2) {
      tone = 'negative';
    } else {
      tone = 'neutral';
    }

    return { tone, score, confidence };
  }

  /**
   * Analyse les émotions via Edge Function (Hume AI ou fallback)
   */
  async analyzeEmotions(text: string): Promise<EmotionAnalysisResult> {
    try {
      const { data, error } = await supabase.functions.invoke('hume-analysis', {
        body: { text, type: 'text' },
      });

      if (error) {
        logger.warn('Emotion analysis via Edge Function failed, using fallback', { error: error.message }, 'AI_ANALYSIS');
        return this.advancedEmotionAnalysis(text);
      }

      return {
        tone: data?.tone || 'neutral',
        emotions: data?.emotions || {},
        dominantEmotion: data?.dominantEmotion,
      };
    } catch (error) {
      logger.error('Error analyzing emotions', error as Error, 'AI_ANALYSIS');
      return this.advancedEmotionAnalysis(text);
    }
  }

  /**
   * Analyse émotionnelle avancée multi-modèle (fallback)
   */
  private advancedEmotionAnalysis(text: string): EmotionAnalysisResult {
    const emotionPatterns: Record<string, { keywords: string[]; weight: number }> = {
      joy: {
        keywords: ['heureux', 'heureuse', 'content', 'contente', 'joie', 'ravi', 'ravie', 'super', 'génial', 'fantastique', 'merveilleux', 'excité', 'enthousiaste', 'sourire', 'rire', '😊', '😄', '🎉'],
        weight: 1.0
      },
      sadness: {
        keywords: ['triste', 'tristesse', 'malheureux', 'malheureuse', 'déprimé', 'déprimée', 'mélancolie', 'pleurer', 'pleurs', 'larmes', 'désespoir', 'chagrin', '😢', '😭'],
        weight: 1.0
      },
      anger: {
        keywords: ['colère', 'en colère', 'fâché', 'fâchée', 'énervé', 'énervée', 'furieux', 'furieuse', 'agacé', 'agacée', 'irrité', 'irritée', 'frustré', 'frustrée', '😠', '😡'],
        weight: 1.0
      },
      fear: {
        keywords: ['peur', 'effrayé', 'effrayée', 'anxieux', 'anxieuse', 'inquiet', 'inquiète', 'terrifié', 'terrifiée', 'paniqué', 'paniquée', 'nerveux', 'nerveuse', 'stress', 'stressé', '😰', '😨'],
        weight: 1.0
      },
      surprise: {
        keywords: ['surpris', 'surprise', 'étonné', 'étonnée', 'choqué', 'choquée', 'stupéfait', 'stupéfaite', 'incroyable', 'wow', 'oh', '😮', '😲'],
        weight: 0.8
      },
      love: {
        keywords: ['amour', 'aimer', 'adore', 'adoré', 'adorée', 'affection', 'tendresse', 'chéri', 'chérie', 'passion', '❤️', '💕', '🥰'],
        weight: 1.0
      },
      gratitude: {
        keywords: ['merci', 'reconnaissant', 'reconnaissante', 'gratitude', 'chanceux', 'chanceuse', 'béni', 'bénie', 'apprécier', '🙏'],
        weight: 0.9
      }
    };

    const lowerText = text.toLowerCase();
    const emotions: Record<string, number> = {};
    let totalMatches = 0;

    for (const [emotion, { keywords, weight }] of Object.entries(emotionPatterns)) {
      let matchCount = 0;
      for (const keyword of keywords) {
        if (lowerText.includes(keyword)) {
          matchCount++;
        }
      }
      if (matchCount > 0) {
        emotions[emotion] = Math.min(1, (matchCount / keywords.length) * weight * 2);
        totalMatches += matchCount;
      }
    }

    // Trouver l'émotion dominante
    let dominantEmotion: string | undefined;
    let maxScore = 0;
    for (const [emotion, score] of Object.entries(emotions)) {
      if (score > maxScore) {
        maxScore = score;
        dominantEmotion = emotion;
      }
    }

    // Déterminer le tone
    const positiveEmotions = ['joy', 'love', 'gratitude', 'surprise'];
    const negativeEmotions = ['sadness', 'anger', 'fear'];
    
    let positiveScore = 0;
    let negativeScore = 0;
    
    for (const [emotion, score] of Object.entries(emotions)) {
      if (positiveEmotions.includes(emotion)) positiveScore += score;
      if (negativeEmotions.includes(emotion)) negativeScore += score;
    }

    let tone: 'positive' | 'neutral' | 'negative';
    if (positiveScore > negativeScore + 0.1) tone = 'positive';
    else if (negativeScore > positiveScore + 0.1) tone = 'negative';
    else tone = 'neutral';

    if (totalMatches === 0) {
      return {
        tone: 'neutral',
        emotions: {},
        dominantEmotion: undefined,
      };
    }

    return {
      tone,
      emotions,
      dominantEmotion,
    };
  }

  /**
   * Génère un résumé du texte via Edge Function
   */
  async generateSummary(text: string, maxLength: number = 100): Promise<string> {
    try {
      if (text.length <= maxLength) {
        return text;
      }

      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          messages: [
            {
              role: 'system',
              content: `Tu es un expert en résumé de texte. Résume le texte en maximum ${maxLength} caractères tout en préservant les informations clés. Réponds uniquement avec le résumé.`,
            },
            {
              role: 'user',
              content: text,
            },
          ],
        },
      });

      if (error) {
        return text.substring(0, maxLength - 3) + '...';
      }

      return data?.response || text.substring(0, maxLength - 3) + '...';
    } catch (error) {
      logger.error('Error generating summary', error as Error, 'AI_ANALYSIS');
      return text.substring(0, maxLength - 3) + '...';
    }
  }

  /**
   * Génère des insights émotionnels via Edge Function
   */
  async generateEmotionalInsights(emotionData: EmotionAnalysisResult): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          messages: [
            {
              role: 'system',
              content: 'Tu es un coach en bien-être émotionnel. Génère un insight bienveillant et encourageant basé sur les émotions détectées. Réponds en 2-3 phrases maximum en français.',
            },
            {
              role: 'user',
              content: `Émotions détectées: ${JSON.stringify(emotionData.emotions)}. Émotion dominante: ${emotionData.dominantEmotion || 'aucune'}. Ton général: ${emotionData.tone}.`,
            },
          ],
        },
      });

      if (error) {
        return this.getFallbackInsight(emotionData);
      }

      return data?.response || this.getFallbackInsight(emotionData);
    } catch (error) {
      logger.error('Error generating insights', error as Error, 'AI_ANALYSIS');
      return this.getFallbackInsight(emotionData);
    }
  }

  /**
   * Insight de fallback
   */
  private getFallbackInsight(emotionData: EmotionAnalysisResult): string {
    const insights: Record<string, string> = {
      joy: "Votre joie rayonne ! Profitez de ce moment de bien-être et partagez cette énergie positive.",
      sadness: "Il est normal de ressentir de la tristesse parfois. Prenez soin de vous et n'hésitez pas à vous entourer.",
      anger: "Votre colère est une émotion valide. Prenez un moment pour respirer et identifier ce qui vous affecte.",
      fear: "L'anxiété peut être difficile. Essayez une technique de respiration pour vous recentrer.",
      love: "L'amour et l'affection que vous ressentez sont précieux. Cultivez ces connections.",
      gratitude: "La gratitude est une force puissante. Continuez à apprécier les petites choses.",
      neutral: "Vous semblez dans un état équilibré. C'est le moment idéal pour vous ressourcer.",
    };

    return insights[emotionData.dominantEmotion || 'neutral'] || insights.neutral;
  }
}

// Export singleton
export const aiAnalysisService = new AIAnalysisService();
export default aiAnalysisService;
