/**
 * aiAnalysisService - Service pour l'analyse AI (transcription, sentiment, emotion)
 * Intègre OpenAI Whisper pour la transcription et Hume AI pour l'analyse émotionnelle
 */

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
  private openaiApiKey: string | undefined;
  private humeApiKey: string | undefined;

  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.humeApiKey = import.meta.env.VITE_HUME_API_KEY;
  }

  /**
   * Transcrit un audio avec OpenAI Whisper
   */
  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    try {
      // Si pas de clé API, utiliser un fallback basique
      if (!this.openaiApiKey || this.openaiApiKey === '') {
        logger.warn('OpenAI API key not configured, using fallback transcription', undefined, 'AI_ANALYSIS');
        return this.fallbackTranscription(audioBlob);
      }

      // Préparer le fichier audio pour Whisper
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'fr'); // Français par défaut, peut être configuré
      formData.append('response_format', 'json');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error('Whisper transcription failed', new Error(error), 'AI_ANALYSIS');
        return this.fallbackTranscription(audioBlob);
      }

      const data = await response.json();

      return {
        text: data.text || '',
        language: data.language,
        duration: data.duration,
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
      text: `[Enregistrement vocal de ${Math.round(duration)}s - Transcription automatique non disponible. Configurez VITE_OPENAI_API_KEY pour activer la transcription.]`,
      language: 'fr',
      duration,
    };
  }

  /**
   * Analyse le sentiment d'un texte avec OpenAI GPT-4
   */
  async analyzeSentiment(text: string): Promise<SentimentAnalysisResult> {
    try {
      // Si pas de clé API, utiliser un fallback heuristique
      if (!this.openaiApiKey || this.openaiApiKey === '') {
        logger.warn('OpenAI API key not configured, using fallback sentiment analysis', undefined, 'AI_ANALYSIS');
        return this.fallbackSentimentAnalysis(text);
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert en analyse de sentiment. Analyse le texte et réponds UNIQUEMENT avec un JSON au format: {"tone": "positive|neutral|negative", "score": <number between -1 and 1>, "confidence": <number between 0 and 1>}',
            },
            {
              role: 'user',
              content: `Analyse le sentiment de ce texte: "${text}"`,
            },
          ],
          temperature: 0.3,
          max_tokens: 100,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        logger.error('Sentiment analysis failed', new Error(error), 'AI_ANALYSIS');
        return this.fallbackSentimentAnalysis(text);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '{}';

      try {
        const result = JSON.parse(content);
        return {
          tone: result.tone || 'neutral',
          score: result.score || 0,
          confidence: result.confidence || 0.5,
        };
      } catch {
        return this.fallbackSentimentAnalysis(text);
      }
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
    const confidence = Math.min(totalEmotionalWords / 10, 0.8); // Max 80% confidence for heuristic

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
   * Analyse les émotions avec Hume AI
   */
  async analyzeEmotions(text: string): Promise<EmotionAnalysisResult> {
    try {
      // Si pas de clé Hume AI, utiliser l'analyse de sentiment comme fallback
      if (!this.humeApiKey || this.humeApiKey === '') {
        logger.warn('Hume AI API key not configured, using sentiment analysis fallback', undefined, 'AI_ANALYSIS');
        const sentiment = await this.analyzeSentiment(text);
        return this.sentimentToEmotion(sentiment);
      }

      // TODO: Implémenter l'intégration Hume AI ici
      // Pour l'instant, utiliser le fallback
      logger.info('Hume AI integration not yet implemented, using fallback', undefined, 'AI_ANALYSIS');
      const sentiment = await this.analyzeSentiment(text);
      return this.sentimentToEmotion(sentiment);
    } catch (error) {
      logger.error('Error analyzing emotions', error as Error, 'AI_ANALYSIS');
      const sentiment = await this.analyzeSentiment(text);
      return this.sentimentToEmotion(sentiment);
    }
  }

  /**
   * Convertit un sentiment en émotions
   */
  private sentimentToEmotion(sentiment: SentimentAnalysisResult): EmotionAnalysisResult {
    const emotions: any = {};

    if (sentiment.tone === 'positive') {
      emotions.joy = 0.7 + (sentiment.score * 0.3);
      emotions.surprise = 0.3;
      return {
        tone: 'positive',
        emotions,
        dominantEmotion: 'joy',
      };
    } else if (sentiment.tone === 'negative') {
      emotions.sadness = 0.7 + (Math.abs(sentiment.score) * 0.3);
      emotions.fear = 0.2;
      emotions.anger = 0.1;
      return {
        tone: 'negative',
        emotions,
        dominantEmotion: 'sadness',
      };
    } else {
      return {
        tone: 'neutral',
        emotions: {},
        dominantEmotion: undefined,
      };
    }
  }

  /**
   * Génère un résumé du texte
   */
  async generateSummary(text: string, maxLength: number = 100): Promise<string> {
    try {
      // Si le texte est déjà court, le retourner tel quel
      if (text.length <= maxLength) {
        return text;
      }

      // Si pas de clé API, utiliser un fallback simple
      if (!this.openaiApiKey || this.openaiApiKey === '') {
        return text.substring(0, maxLength - 3) + '...';
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Tu es un expert en résumé de texte. Résume le texte en maximum ${maxLength} caractères tout en préservant les informations clés.`,
            },
            {
              role: 'user',
              content: text,
            },
          ],
          temperature: 0.3,
          max_tokens: 50,
        }),
      });

      if (!response.ok) {
        return text.substring(0, maxLength - 3) + '...';
      }

      const data = await response.json();
      const summary = data.choices[0]?.message?.content || '';

      return summary.substring(0, maxLength);
    } catch (error) {
      logger.error('Error generating summary', error as Error, 'AI_ANALYSIS');
      return text.substring(0, maxLength - 3) + '...';
    }
  }
}

export const aiAnalysisService = new AIAnalysisService();
