// @ts-nocheck
/**
 * Service Unifié d'Analyse Émotionnelle
 *
 * Centralise tous les appels aux edge functions d'analyse émotionnelle
 * et standardise les formats de réponse.
 *
 * @module EmotionAnalysisService
 * @version 2.0.0
 * @created 2025-11-14
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { captureException } from '@/lib/ai-monitoring';

// ═══════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════

export interface EmotionScore {
  emotion: string;
  score: number;
  confidence?: number;
}

export interface EmotionAnalysisResult {
  dominant_emotion: string;
  emotions: EmotionScore[];
  confidence: number;
  valence?: number;
  arousal?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  summary?: string;
  recommendations?: string[];
  insights?: string[];
  metadata?: {
    duration?: number;
    source: 'text' | 'voice' | 'camera' | 'emoji' | 'audio';
    model?: string;
    timestamp: string;
  };
}

export interface TextAnalysisInput {
  text: string;
  language?: string;
  context?: string;
}

export interface VoiceAnalysisInput {
  audioBlob: Blob;
  language?: string;
}

export interface CameraAnalysisInput {
  imageData: string; // base64 or blob URL
  mode?: 'sam-camera' | 'facial';
}

export interface EmojiAnalysisInput {
  emojis: string[];
  context?: string;
}

export interface AudioAnalysisInput {
  audioData: Blob | string;
  format?: 'wav' | 'mp3' | 'webm';
}

type AnalysisInput =
  | TextAnalysisInput
  | VoiceAnalysisInput
  | CameraAnalysisInput
  | EmojiAnalysisInput
  | AudioAnalysisInput;

// ═══════════════════════════════════════════════════════════
// SERVICE PRINCIPAL
// ═══════════════════════════════════════════════════════════

class EmotionAnalysisServiceClass {
  private readonly MAX_RETRIES = 2;
  private readonly TIMEOUT_MS = 30000; // 30 secondes

  /**
   * Analyse émotionnelle à partir de texte
   * Edge function: emotion-analysis
   */
  async analyzeText(input: TextAnalysisInput): Promise<EmotionAnalysisResult> {
    logger.debug('EmotionAnalysisService: analyzeText', { textLength: input.text.length }, 'EMOTION_SERVICE');

    try {
      const { data, error } = await this.invokeWithRetry('emotion-analysis', {
        text: input.text,
        language: input.language || 'fr',
        context: input.context,
      });

      if (error) throw error;

      return this.normalizeResult(data, 'text');
    } catch (error) {
      logger.error('EmotionAnalysisService: analyzeText failed', error as Error, 'EMOTION_SERVICE');
      captureException(error as Error, { context: 'analyzeText', input });
      throw this.handleError(error, 'text');
    }
  }

  /**
   * Analyse émotionnelle à partir de la voix
   * Edge function: voice-analysis (Whisper transcription + analyse)
   */
  async analyzeVoice(input: VoiceAnalysisInput): Promise<EmotionAnalysisResult> {
    logger.debug('EmotionAnalysisService: analyzeVoice', { blobSize: input.audioBlob.size }, 'EMOTION_SERVICE');

    try {
      // Convertir le blob en base64
      const base64Audio = await this.blobToBase64(input.audioBlob);

      const { data, error } = await this.invokeWithRetry('voice-analysis', {
        audio: base64Audio,
        language: input.language || 'fr',
      });

      if (error) throw error;

      return this.normalizeResult(data, 'voice');
    } catch (error) {
      logger.error('EmotionAnalysisService: analyzeVoice failed', error as Error, 'EMOTION_SERVICE');
      captureException(error as Error, { context: 'analyzeVoice', blobSize: input.audioBlob.size });
      throw this.handleError(error, 'voice');
    }
  }

  /**
   * Analyse émotionnelle à partir de la caméra/facial
   * Edge function: ai-emotion-analysis
   */
  async analyzeCamera(input: CameraAnalysisInput): Promise<EmotionAnalysisResult> {
    logger.debug('EmotionAnalysisService: analyzeCamera', { mode: input.mode }, 'EMOTION_SERVICE');

    try {
      const { data, error } = await this.invokeWithRetry('ai-emotion-analysis', {
        imageData: input.imageData,
        mode: input.mode || 'sam-camera',
        timestamp: new Date().toISOString(),
      });

      if (error) throw error;

      return this.normalizeResult(data, 'camera');
    } catch (error) {
      logger.error('EmotionAnalysisService: analyzeCamera failed', error as Error, 'EMOTION_SERVICE');
      captureException(error as Error, { context: 'analyzeCamera', mode: input.mode });
      throw this.handleError(error, 'camera');
    }
  }

  /**
   * Analyse émotionnelle multi-modale (Hume AI)
   * Edge function: hume-analysis
   * Supporte: texte, audio, emojis
   */
  async analyzeMultiModal(input: {
    text?: string;
    audio?: Blob | string;
    emojis?: string[];
  }): Promise<EmotionAnalysisResult> {
    logger.debug('EmotionAnalysisService: analyzeMultiModal', {
      hasText: !!input.text,
      hasAudio: !!input.audio,
      hasEmojis: !!input.emojis
    }, 'EMOTION_SERVICE');

    try {
      // Préparer les données selon le format Hume
      const payload: any = {};

      if (input.text) {
        payload.text = input.text;
      }

      if (input.audio) {
        if (input.audio instanceof Blob) {
          payload.audio = await this.blobToBase64(input.audio);
        } else {
          payload.audio = input.audio;
        }
      }

      if (input.emojis && input.emojis.length > 0) {
        payload.emojis = input.emojis;
      }

      const { data, error } = await this.invokeWithRetry('hume-analysis', payload);

      if (error) throw error;

      // Déterminer la source principale
      const source = input.audio ? 'audio' : (input.text ? 'text' : 'emoji');
      return this.normalizeResult(data, source);
    } catch (error) {
      logger.error('EmotionAnalysisService: analyzeMultiModal failed', error as Error, 'EMOTION_SERVICE');
      captureException(error as Error, { context: 'analyzeMultiModal', input });
      throw this.handleError(error, 'multimodal');
    }
  }

  /**
   * Analyse émotionnelle à partir d'emojis
   * Utilise Hume AI
   */
  async analyzeEmoji(input: EmojiAnalysisInput): Promise<EmotionAnalysisResult> {
    logger.debug('EmotionAnalysisService: analyzeEmoji', { emojisCount: input.emojis.length }, 'EMOTION_SERVICE');

    return this.analyzeMultiModal({
      emojis: input.emojis,
      text: input.context,
    });
  }

  // ═══════════════════════════════════════════════════════════
  // MÉTHODES PRIVÉES - HELPERS
  // ═══════════════════════════════════════════════════════════

  /**
   * Invoque une edge function avec retry logic
   */
  private async invokeWithRetry(
    functionName: string,
    payload: any,
    attempt: number = 1
  ): Promise<{ data: any; error: any }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);

      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload,
        // @ts-ignore - signal est supporté mais pas typé
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (error && attempt < this.MAX_RETRIES) {
        logger.warn(`Retry ${attempt}/${this.MAX_RETRIES} for ${functionName}`, error, 'EMOTION_SERVICE');
        await this.delay(1000 * attempt); // Backoff exponentiel
        return this.invokeWithRetry(functionName, payload, attempt + 1);
      }

      return { data, error };
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { data: null, error: new Error(`Timeout après ${this.TIMEOUT_MS}ms`) };
      }
      return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
    }
  }

  /**
   * Normalise les résultats de différentes edge functions
   * vers un format unifié
   */
  private normalizeResult(data: any, source: EmotionAnalysisResult['metadata']['source']): EmotionAnalysisResult {
    // Si déjà au bon format
    if (this.isValidResult(data)) {
      return {
        ...data,
        metadata: {
          ...data.metadata,
          source: (data.metadata?.source || source) as EmotionAnalysisResult['metadata']['source'],
          timestamp: data.metadata?.timestamp || new Date().toISOString(),
        },
      };
    }

    // Normaliser depuis différents formats
    const emotions: EmotionScore[] = [];
    let dominant_emotion = 'neutral';
    let confidence = 0;

    // Format Hume AI
    if (data.predictions || data.prosody || data.language) {
      const predictions = data.predictions?.[0]?.models || {};
      const emotionScores = predictions.prosody?.emotions || predictions.language?.emotions || [];

      emotionScores.forEach((e: any) => {
        emotions.push({
          emotion: e.name,
          score: e.score,
          confidence: e.score,
        });
      });

      if (emotions.length > 0) {
        const top = emotions.sort((a, b) => b.score - a.score)[0];
        dominant_emotion = top.emotion;
        confidence = top.score;
      }
    }

    // Format GPT/OpenAI
    else if (data.emotion || data.emotions) {
      if (Array.isArray(data.emotions)) {
        data.emotions.forEach((e: any) => {
          emotions.push({
            emotion: typeof e === 'string' ? e : e.name || e.emotion,
            score: typeof e === 'object' ? (e.score || e.confidence || 0) : 0.5,
          });
        });
      }

      dominant_emotion = data.emotion || data.dominant_emotion || emotions[0]?.emotion || 'neutral';
      confidence = data.confidence || data.score || 0.7;
    }

    // Fallback
    else {
      emotions.push({ emotion: 'neutral', score: 0.5, confidence: 0.5 });
      dominant_emotion = 'neutral';
      confidence = 0.5;
    }

    return {
      dominant_emotion,
      emotions,
      confidence,
      valence: data.valence,
      arousal: data.arousal,
      sentiment: data.sentiment || this.inferSentiment(dominant_emotion),
      summary: data.summary || data.text || '',
      recommendations: data.recommendations || [],
      insights: data.insights || [],
      metadata: {
        source,
        model: data.model || 'unknown',
        timestamp: new Date().toISOString(),
        duration: data.duration,
      },
    };
  }

  /**
   * Vérifie si le résultat est au bon format
   */
  private isValidResult(data: any): data is EmotionAnalysisResult {
    return (
      data &&
      typeof data.dominant_emotion === 'string' &&
      Array.isArray(data.emotions) &&
      typeof data.confidence === 'number'
    );
  }

  /**
   * Infère le sentiment à partir de l'émotion dominante
   */
  private inferSentiment(emotion: string): 'positive' | 'negative' | 'neutral' {
    const positiveEmotions = ['joy', 'happiness', 'excitement', 'love', 'contentment', 'gratitude'];
    const negativeEmotions = ['sadness', 'anger', 'fear', 'disgust', 'anxiety', 'frustration'];

    const normalized = emotion.toLowerCase();

    if (positiveEmotions.some(e => normalized.includes(e))) {
      return 'positive';
    }

    if (negativeEmotions.some(e => normalized.includes(e))) {
      return 'negative';
    }

    return 'neutral';
  }

  /**
   * Gère les erreurs de manière cohérente
   */
  private handleError(error: any, context: string): Error {
    const message = error?.message || 'Unknown error';

    if (message.includes('Timeout')) {
      return new Error(`[${context}] Analyse timeout - Le service a pris trop de temps`);
    }

    if (message.includes('network') || message.includes('fetch')) {
      return new Error(`[${context}] Erreur réseau - Vérifiez votre connexion`);
    }

    if (error?.status === 429) {
      return new Error(`[${context}] Rate limit atteint - Réessayez dans quelques instants`);
    }

    if (error?.status === 500) {
      return new Error(`[${context}] Erreur serveur - Le service est temporairement indisponible`);
    }

    return new Error(`[${context}] ${message}`);
  }

  /**
   * Convertit un Blob en base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // Retirer le préfixe data:audio/...;base64,
        const base64Data = base64.split(',')[1] || base64;
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ═══════════════════════════════════════════════════════════
  // MÉTHODES UTILITAIRES PUBLIQUES
  // ═══════════════════════════════════════════════════════════

  /**
   * Formate un résultat d'analyse pour l'affichage
   */
  formatForDisplay(result: EmotionAnalysisResult): {
    title: string;
    description: string;
    emotionsList: string;
    color: string;
  } {
    const emotionColors: Record<string, string> = {
      joy: '#FFD700',
      happiness: '#FFD700',
      sadness: '#4169E1',
      anger: '#DC143C',
      fear: '#9370DB',
      disgust: '#8B4513',
      surprise: '#FF69B4',
      neutral: '#808080',
      contentment: '#90EE90',
      excitement: '#FF6347',
    };

    const color = emotionColors[result.dominant_emotion.toLowerCase()] || '#808080';

    const emotionsList = result.emotions
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(e => `${e.emotion} (${Math.round(e.score * 100)}%)`)
      .join(', ');

    return {
      title: `Émotion dominante: ${result.dominant_emotion}`,
      description: result.summary || 'Analyse complétée avec succès',
      emotionsList,
      color,
    };
  }

  /**
   * Calcule le score émotionnel global (0-100)
   */
  calculateEmotionalScore(result: EmotionAnalysisResult): number {
    // Score basé sur la valence (si disponible) ou sur le sentiment
    if (typeof result.valence === 'number') {
      return Math.round((result.valence + 1) * 50); // Normaliser de [-1, 1] à [0, 100]
    }

    // Sinon, calculer à partir du sentiment et des émotions
    const sentimentScore = {
      positive: 75,
      neutral: 50,
      negative: 25,
    }[result.sentiment || 'neutral'];

    const emotionBonus = result.emotions
      .filter(e => ['joy', 'happiness', 'contentment'].includes(e.emotion.toLowerCase()))
      .reduce((sum, e) => sum + e.score * 10, 0);

    return Math.min(100, Math.max(0, Math.round(sentimentScore + emotionBonus)));
  }
}

// ═══════════════════════════════════════════════════════════
// EXPORT SINGLETON
// ═══════════════════════════════════════════════════════════

export const EmotionAnalysisService = new EmotionAnalysisServiceClass();

// Export par défaut pour compatibilité
export default EmotionAnalysisService;
