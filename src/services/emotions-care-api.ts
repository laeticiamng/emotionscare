/**
 * EmotionsCare API service
 * Unified service for AI integrations (Suno, Hume, OpenAI) and backend endpoints
 */

import { supabase } from '@/integrations/supabase/client';
import { EmotionResult, MusicPlaylist, EmotionMusicParams } from '@/types';
import { apiService } from '@/services/api/endpoints';

// === INTERFACES D'API ===
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

// === SERVICE PRINCIPAL ===
export class EmotionsCareApi {
  private static instance: EmotionsCareApi;

  static getInstance(): EmotionsCareApi {
    if (!EmotionsCareApi.instance) {
      EmotionsCareApi.instance = new EmotionsCareApi();
    }
    return EmotionsCareApi.instance;
  }

  // === SUNO MUSIC GENERATION ===
  async generateMusic(params: SunoGenerationParams): Promise<MusicPlaylist> {
    try {
      console.log('🎵 Génération Suno avec params:', params);

      const { data, error } = await supabase.functions.invoke('suno-music-generation', {
        body: {
          emotion: params.emotion,
          intensity: params.intensity,
          duration_minutes: params.duration || 3,
          style: params.style || 'ambient',
          prompt: params.prompt || `Musique thérapeutique pour ${params.emotion}`
        }
      });

      if (error) {
        console.error('❌ Erreur Suno:', error);
        throw new Error(`Erreur Suno: ${error.message}`);
      }

      console.log('✅ Réponse Suno:', data);

      // Transformer la réponse Suno en MusicPlaylist
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
      console.error('❌ Erreur génération musique:', error);
      
      // Fallback avec playlist simulée
      return this.createFallbackPlaylist(params);
    }
  }

  // === HUME EMOTION ANALYSIS ===
  async analyzeEmotion(params: HumeAnalysisParams): Promise<EmotionResult> {
    try {
      console.log('🧠 Analyse Hume avec type:', params.type);

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
          throw new Error(`Type d'analyse non supporté: ${params.type}`);
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        body
      });

      if (error) {
        console.error('❌ Erreur Hume:', error);
        throw new Error(`Erreur Hume: ${error.message}`);
      }

      console.log('✅ Réponse Hume:', data);

      // Transformer la réponse Hume en EmotionResult
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
      console.error('❌ Erreur analyse émotion:', error);
      throw error;
    }
  }

  // === OPENAI TEXT ANALYSIS ===
  async analyzeText(params: OpenAIAnalysisParams): Promise<any> {
    try {
      console.log('💭 Analyse OpenAI avec type:', params.type);

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
        console.error('❌ Erreur OpenAI:', error);
        throw new Error(`Erreur OpenAI: ${error.message}`);
      }

      console.log('✅ Réponse OpenAI:', data);

      return data;
    } catch (error) {
      console.error('❌ Erreur analyse texte:', error);
      throw error;
    }
  }

  // === BACKEND API METHODS ===
  async analyzeEmotionText(text: string) {
    try {
      return await apiService.analyzeEmotion(text);
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      throw error;
    }
  }

  async analyzeVoiceEmotion(audioBlob: Blob) {
    try {
      return await apiService.analyzeVoice(audioBlob);
    } catch (error) {
      console.error('Error analyzing voice:', error);
      throw error;
    }
  }

  async chatWithCoach(message: string, conversationHistory?: any[]) {
    try {
      return await apiService.chatWithAI(message, conversationHistory);
    } catch (error) {
      console.error('Error during coach chat:', error);
      throw error;
    }
  }

  async getDashboardData() {
    try {
      return await apiService.getDashboardStats();
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  async saveJournalEntry(content: string) {
    try {
      return await apiService.saveJournalEntry(content);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      throw error;
    }
  }

  // === INTÉGRATION COMPLÈTE ===
  async generateEmotionMusicSession(params: EmotionMusicParams): Promise<{
    emotion: EmotionResult;
    playlist: MusicPlaylist;
    recommendations: string[];
  }> {
    try {
      console.log('🎭 Session complète EmotionsCare:', params);

      // 1. Analyser l'émotion avec un prompt enrichi
      const emotionAnalysis = await this.analyzeText({
        text: `Analyser cette émotion: ${params.emotion} avec une intensité de ${params.intensity || 0.5}`,
        type: 'emotion'
      });

      // 2. Générer la playlist musicale
      const playlist = await this.generateMusic({
        emotion: params.emotion,
        intensity: params.intensity || 0.5,
        style: params.preferences?.genre?.[0] || 'ambient'
      });

      // 3. Générer des recommandations
      const recommendationsAnalysis = await this.analyzeText({
        text: `Générer 3 recommandations de bien-être pour une personne qui ressent: ${params.emotion}`,
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
      console.error('❌ Erreur session complète:', error);
      throw error;
    }
  }

  // === MÉTHODES UTILITAIRES ===
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
        return 'Tu es un expert en analyse de sentiment. Analyse le texte et retourne un objet JSON avec sentiment (positive/negative/neutral) et confidence (0-1).';
      case 'emotion':
        return 'Tu es un expert en analyse émotionnelle. Analyse le texte et retourne un objet JSON avec emotion, intensity (0-1), et recommendations.';
      case 'recommendation':
        return 'Tu es un coach de bien-être. Génère des recommandations pratiques et bienveillantes sous format JSON array.';
      default:
        return 'Tu es un assistant IA spécialisé en bien-être émotionnel.';
    }
  }
}

// === Singleton instance ===
export const emotionsCareApi = EmotionsCareApi.getInstance();