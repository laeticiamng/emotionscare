// @ts-nocheck
/**
 * EmotionsCare API service
 * Unified service for AI integrations (Suno, Hume, OpenAI) and backend endpoints
 */

import { supabase } from '@/integrations/supabase/client';
import { EmotionResult, MusicPlaylist, EmotionMusicParams } from '@/types';
import { apiService } from '@/services/api/endpoints';
import { logger } from '@/lib/logger';

// === API Interfaces ===
export interface SunoGenerationParams {
  emotion: string;
  intensity: number;
  duration?: number;
  style?: string;
  prompt?: string;
}

export interface HumeAnalysisParams {
  data: Blob | string;
  type: 'facial' | 'voice' | 'text';
  options?: {
    returnFacePredictions?: boolean;
    returnVoicePredictions?: boolean;
    returnTextPredictions?: boolean;
  };
}

export interface OpenAIAnalysisParams {
  text: string;
  type: 'sentiment' | 'emotion' | 'recommendation';
  context?: Record<string, any>;
}

// === Main Service ===
export class EmotionsCareApi {
  private static instance: EmotionsCareApi;

  static getInstance(): EmotionsCareApi {
    if (!EmotionsCareApi.instance) {
      EmotionsCareApi.instance = new EmotionsCareApi();
    }
    return EmotionsCareApi.instance;
  }

  // === Suno Music Generation ===
  async generateMusic(params: SunoGenerationParams): Promise<MusicPlaylist> {
    try {
      logger.info('Generating Suno music', { params }, 'MUSIC');

      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'generate',
          emotion: params.emotion,
          mood: params.emotion,
          intensity: params.intensity,
          style: params.style || 'therapeutic ambient',
          prompt: params.prompt || `Musique thérapeutique pour ${params.emotion}`,
          instrumental: true
        }
      });

      if (error) {
        logger.error('Suno generation failed', error, 'MUSIC');
        throw new Error(`Suno error: ${error.message}`);
      }

      logger.info('Suno response received', { data }, 'MUSIC');

      // Transform Suno response into MusicPlaylist
      const playlist: MusicPlaylist = {
        id: data.session_id || `suno-${Date.now()}`,
        name: `Playlist ${params.emotion}`,
        description: `Musique thérapeutique générée pour l'émotion: ${params.emotion}`,
        emotion: params.emotion,
        tracks: data.tracks?.map((track: any, index: number) => ({
          id: track.id || `track-${index}`,
          title: track.title || `Titre ${index + 1}`,
          artist: 'EmotionsCare AI',
          duration: track.duration || 180,
          url: track.audio_url || '/audio/placeholder.mp3',
          coverUrl: track.image_url,
          emotion: params.emotion,
          energy: params.intensity,
          valence: this.getValenceFromEmotion(params.emotion),
          tags: track.tags || [params.emotion]
        })) || [],
        createdAt: new Date()
      };

      return playlist;
    } catch (error) {
      logger.error('Music generation error', error, 'MUSIC');

      // Fallback with mocked playlist
      return this.createFallbackPlaylist(params);
    }
  }

  // === Hume Emotion Analysis ===
  async analyzeEmotion(params: HumeAnalysisParams): Promise<EmotionResult> {
    try {
      logger.info('Analyzing emotion with Hume', { type: params.type }, 'API');

      let functionName: string;
      let body: any;

      switch (params.type) {
        case 'facial':
          functionName = 'hume-face';
          body = { image: params.data };
          break;
        case 'voice':
          functionName = 'hume-voice';
          body = { audio: params.data };
          break;
        case 'text':
          functionName = 'hume-analysis';
          body = { text: params.data };
          break;
        default:
          logger.error('Unsupported analysis type', new Error(`Type: ${params.type}`), 'API');
          // Retourner un résultat par défaut au lieu de throw
          return this.createFallbackEmotionResult('neutral');
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        body
      });

      if (error) {
        logger.error('Hume analysis failed', error, 'API');
        // Retourner un résultat par défaut au lieu de throw
        return this.createFallbackEmotionResult('neutral');
      }

      logger.info('Hume response received', { data }, 'API');

      // Transform Hume response into EmotionResult
      const emotionResult: EmotionResult = {
        id: `hume-${Date.now()}`,
        timestamp: new Date().toISOString(),
        emotion: data.dominant_emotion || 'neutral',
        confidence: data.confidence || 0.5,
        intensity: this.calculateIntensity(data.emotions),
        source: this.mapHumeSourceToEmotionSource(params.type),
        details: {
          emotions: data.emotions,
          bounding_box: data.bounding_box,
          prosody: data.prosody
        },
        rawData: data
      };

      return emotionResult;
    } catch (error) {
      logger.error('Emotion analysis error', error, 'API');
      // Retourner un résultat par défaut au lieu de throw
      return this.createFallbackEmotionResult('neutral');
    }
  }

  // === OpenAI Text Analysis ===
  async analyzeText(params: OpenAIAnalysisParams): Promise<any> {
    try {
      logger.info('Analyzing text with OpenAI', { type: params.type }, 'API');

      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: {
          messages: [
            {
              role: 'system',
              content: this.getOpenAISystemPrompt(params.type)
            },
            {
              role: 'user',
              content: params.text
            }
          ],
          model: 'gpt-4o-mini',
          temperature: 0.3
        }
      });

      if (error) {
        logger.error('OpenAI analysis failed', error, 'API');
        // Retourner une réponse par défaut au lieu de throw
        return { content: 'Analyse non disponible', error: true };
      }

      logger.info('OpenAI response received', { data }, 'API');

      return data;
    } catch (error) {
      logger.error('Text analysis error', error, 'API');
      // Retourner une réponse par défaut au lieu de throw
      return { content: 'Analyse non disponible', error: true };
    }
  }

  // === BACKEND API METHODS ===
  async analyzeEmotionText(text: string) {
    try {
      return await apiService.analyzeEmotion(text);
    } catch (error) {
      logger.error('Error analyzing emotion', error, 'API');
      // Retourner un résultat par défaut au lieu de throw
      return this.createFallbackEmotionResult('neutral');
    }
  }

  async analyzeVoiceEmotion(audioBlob: Blob) {
    try {
      return await apiService.analyzeVoice(audioBlob);
    } catch (error) {
      logger.error('Error analyzing voice', error, 'API');
      // Retourner un résultat par défaut au lieu de throw
      return this.createFallbackEmotionResult('neutral');
    }
  }

  async chatWithCoach(message: string, conversationHistory?: any[]) {
    try {
      const detectedEmotion = this.detectEmotionFromHistory(conversationHistory, message);

      logger.info('Calling ai-coach function', {
        detectedEmotion,
        historySize: conversationHistory?.length || 0,
      }, 'COACH');

      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          message,
          emotion: detectedEmotion,
        },
      });

      if (error) {
        logger.error('ai-coach invocation failed', error, 'COACH');
        // Retourner une réponse par défaut au lieu de throw
        return {
          message: 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.',
          suggestions: [],
          disclaimers: ['Service temporairement indisponible'],
          type: 'text',
          detectedEmotion,
          confidence: null,
          category: 'coaching',
          meta: null,
        };
      }

      const response = {
        message: data?.response ?? '',
        suggestions: data?.suggestions ?? [],
        disclaimers: data?.disclaimers ?? [],
        type: 'text',
        detectedEmotion: data?.meta?.emotion ?? detectedEmotion,
        confidence: data?.meta?.confidence ?? null,
        category: data?.meta?.category ?? 'coaching',
        meta: data?.meta ?? null,
      };

      logger.info('ai-coach response received', response, 'COACH');

      return response;
    } catch (error) {
      logger.error('Error during coach chat', error, 'API');
      // Retourner une réponse par défaut au lieu de throw
      return {
        message: 'Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.',
        suggestions: [],
        disclaimers: ['Service temporairement indisponible'],
        type: 'text',
        detectedEmotion: 'neutre',
        confidence: null,
        category: 'coaching',
        meta: null,
      };
    }
  }

  private detectEmotionFromHistory(history: any[] = [], fallbackMessage?: string): string {
    const searchSpace = [...history].reverse();
    const target = searchSpace.find((entry) => {
      const role = entry?.role || entry?.sender;
      return role === 'user';
    }) || { content: fallbackMessage, text: fallbackMessage };

    const text = (target?.content || target?.text || fallbackMessage || '').toLowerCase();

    const emotionKeywords: Record<string, string[]> = {
      joie: ['heureu', 'content', 'joie', 'ravi', 'positif'],
      tristesse: ['trist', 'déprim', 'mal', 'chagrin', 'pleur'],
      colère: ['colère', 'énerv', 'furieux', 'frustr', 'agacé'],
      peur: ['peur', 'anxi', 'inquiet', 'angoiss', 'stress'],
      calme: ['calme', 'serein', 'apais', 'tranquill'],
    };

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return emotion;
      }
    }

    return 'neutre';
  }

  async getDashboardData() {
    try {
      return await apiService.getDashboardStats();
    } catch (error) {
      logger.error('Error fetching dashboard data', error, 'API');
      // Retourner des données par défaut au lieu de throw
      return { stats: [], error: true };
    }
  }

  async saveJournalEntry(content: string) {
    try {
      return await apiService.saveJournalEntry(content);
    } catch (error) {
      logger.error('Error saving journal entry', error, 'API');
      // Retourner un résultat d'échec au lieu de throw
      return { success: false, error: true };
    }
  }

  // === Full Integration ===
  async generateEmotionMusicSession(params: EmotionMusicParams): Promise<{
    emotion: EmotionResult;
    playlist: MusicPlaylist;
    recommendations: string[];
  }> {
    try {
      logger.info('Starting full EmotionsCare session', { params }, 'SYSTEM');

      // 1. Analyze emotion with an enriched prompt
      const emotionAnalysis = await this.analyzeText({
        text: `Analyze emotion ${params.emotion} with intensity ${params.intensity || 0.5}`,
        type: 'emotion'
      });

      // 2. Generate the music playlist
      const playlist = await this.generateMusic({
        emotion: params.emotion,
        intensity: params.intensity || 0.5,
        style: params.preferences?.genre?.[0] || 'ambient'
      });

      // 3. Generate recommendations
      const recommendationsAnalysis = await this.analyzeText({
        text: `Generate 3 wellness recommendations for a person feeling ${params.emotion}`,
        type: 'recommendation'
      });

      const emotionResult: EmotionResult = {
        id: `session-${Date.now()}`,
        timestamp: new Date().toISOString(),
        emotion: params.emotion,
        confidence: 0.8,
        intensity: params.intensity || 0.5,
        source: 'multimodal',
        recommendations: [
          'Écouter la playlist générée',
          'Pratiquer la respiration consciente',
          'Tenir un journal émotionnel'
        ]
      };

      return {
        emotion: emotionResult,
        playlist,
        recommendations: emotionResult.recommendations || []
      };
    } catch (error) {
      logger.error('Full session error', error, 'SYSTEM');
      // Retourner une session par défaut au lieu de throw
      return {
        emotion: this.createFallbackEmotionResult(params.emotion),
        playlist: this.createFallbackPlaylist({
          emotion: params.emotion,
          intensity: params.intensity || 0.5
        }),
        recommendations: [
          'Pratiquer la respiration consciente',
          'Écouter de la musique apaisante',
          'Tenir un journal émotionnel'
        ]
      };
    }
  }

  // === Utility Methods ===
  private createFallbackEmotionResult(emotion: string): EmotionResult {
    return {
      id: `fallback-${Date.now()}`,
      timestamp: new Date().toISOString(),
      emotion,
      confidence: 0.5,
      intensity: 0.5,
      source: 'fallback',
      details: {
        message: 'Analyse par défaut utilisée en raison d\'une erreur'
      }
    };
  }

  private createFallbackPlaylist(params: SunoGenerationParams): MusicPlaylist {
    return {
      id: `fallback-${Date.now()}`,
      name: `Playlist ${params.emotion} (Mode local)`,
      description: `Musique de secours pour l'émotion: ${params.emotion}`,
      emotion: params.emotion,
      tracks: [
        {
          id: 'fallback-1',
          title: `Mélodie apaisante ${params.emotion}`,
          artist: 'EmotionsCare AI',
          duration: 180,
          url: '/audio/fallback/calm.mp3',
          emotion: params.emotion,
          energy: params.intensity,
          valence: this.getValenceFromEmotion(params.emotion)
        },
        {
          id: 'fallback-2',
          title: `Harmonie thérapeutique`,
          artist: 'EmotionsCare AI',
          duration: 240,
          url: '/audio/fallback/harmony.mp3',
          emotion: params.emotion,
          energy: params.intensity * 0.8,
          valence: this.getValenceFromEmotion(params.emotion)
        }
      ],
      createdAt: new Date()
    };
  }

  private getValenceFromEmotion(emotion: string): number {
    const valenceMap: Record<string, number> = {
      happy: 0.8,
      joy: 0.9,
      excited: 0.7,
      calm: 0.6,
      relaxed: 0.5,
      neutral: 0.5,
      sad: 0.2,
      angry: 0.1,
      frustrated: 0.3,
      anxious: 0.3
    };
    return valenceMap[emotion.toLowerCase()] || 0.5;
  }

  private calculateIntensity(emotions: any[]): number {
    if (!emotions || emotions.length === 0) return 0.5;
    const maxScore = Math.max(...emotions.map(e => e.score || 0));
    return Math.min(maxScore, 1);
  }

  private mapHumeSourceToEmotionSource(humeType: string): EmotionResult['source'] {
    switch (humeType) {
      case 'facial': return 'facial_analysis';
      case 'voice': return 'voice_analysis';
      case 'text': return 'text_analysis';
      default: return 'multimodal';
    }
  }

  private getOpenAISystemPrompt(type: string): string {
    switch (type) {
      case 'sentiment':
        return 'You are a sentiment analysis expert. Analyze the text and return a JSON object with sentiment (positive/negative/neutral) and confidence (0-1).';
      case 'emotion':
        return 'You are an emotion analysis expert. Analyze the text and return a JSON object with emotion, intensity (0-1), and recommendations.';
      case 'recommendation':
        return 'You are a wellness coach. Generate practical and kind recommendations as a JSON array.';
      default:
        return 'You are an AI assistant specialized in emotional well-being.';
    }
  }
}

// === Singleton instance ===
export const emotionsCareApi = EmotionsCareApi.getInstance();