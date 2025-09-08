/**
 * 🎯 GESTIONNAIRE DE SERVICES UNIFIÉ PREMIUM
 * Orchestrateur central pour tous les services EmotionsCare
 * Supprime la fragmentation et optimise les performances
 */

import { unifiedEmotionService, UnifiedEmotionService } from './UnifiedEmotionService';
import { unifiedMusicService, UnifiedMusicService } from './UnifiedMusicService';
import { supabase } from '@/integrations/supabase/client';

export class UnifiedServiceManager {
  private static instance: UnifiedServiceManager;
  private cache = new Map<string, any>();
  private isInitialized = false;

  // Services unifiés
  public readonly emotion: UnifiedEmotionService;
  public readonly music: UnifiedMusicService;

  private constructor() {
    this.emotion = unifiedEmotionService;
    this.music = unifiedMusicService;
  }

  static getInstance(): UnifiedServiceManager {
    if (!UnifiedServiceManager.instance) {
      UnifiedServiceManager.instance = new UnifiedServiceManager();
    }
    return UnifiedServiceManager.instance;
  }

  /**
   * Initialisation complète des services
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    console.log('🚀 Initialisation du gestionnaire de services unifié...');

    try {
      // Vérification de la connectivité Supabase
      const { data: healthCheck } = await supabase.functions.invoke('health-check');
      console.log('✅ Supabase connecté:', healthCheck?.status);

      // Préchargement des données critiques
      await this.preloadCriticalData();

      // Initialisation des services
      await Promise.all([
        this.initializeEmotionService(),
        this.initializeMusicService()
      ]);

      this.isInitialized = true;
      console.log('✅ Gestionnaire de services initialisé');

    } catch (error) {
      console.error('❌ Erreur initialisation services:', error);
      throw new Error('Impossible d\'initialiser les services');
    }
  }

  /**
   * Analyse émotionnelle unifiée (remplace tous les anciens services)
   */
  async analyzeEmotion(params: {
    text?: string;
    audioBlob?: Blob;
    imageBlob?: Blob;
    sources?: ('hume_face' | 'hume_voice' | 'openai_text')[];
    mode?: 'quick' | 'detailed' | 'realtime';
  }) {
    console.log('🧠 Analyse émotionnelle via service unifié');
    
    return await this.emotion.analyzeEmotion({
      data: {
        text: params.text,
        audioBlob: params.audioBlob,
        imageBlob: params.imageBlob
      },
      sources: params.sources || ['openai_text'],
      scanMode: params.mode || 'quick',
      config: {
        sensitivityMode: 'adaptive',
        learningEnabled: true,
        maxProcessingTime: 30000,
        qualityThreshold: 0.6,
        confidenceThreshold: 0.5,
        noiseReduction: true,
        smoothingFactor: 0.3,
        outlierDetection: true,
        historicalWeighting: 0.2,
        adaptiveThresholds: true
      }
    });
  }

  /**
   * Génération musicale unifiée (remplace tous les anciens services)
   */
  async generateMusic(params: {
    emotion: string;
    style?: string;
    duration?: number;
    intensity?: number;
    therapeutic?: boolean;
  }) {
    console.log('🎵 Génération musicale via service unifié');
    
    return await this.music.generateMusic({
      emotion: params.emotion as any,
      style: params.style,
      duration: params.duration || 180,
      intensity: params.intensity || 0.7,
      context: params.therapeutic ? 'therapeutic' : 'general'
    });
  }

  /**
   * Création de playlist thérapeutique
   */
  async createTherapeuticPlaylist(params: {
    currentEmotion: string;
    targetEmotion?: string;
    duration: number;
  }) {
    console.log('🎼 Création playlist thérapeutique');
    
    return await this.music.createTherapeuticPlaylist({
      currentEmotion: params.currentEmotion as any,
      targetEmotion: (params.targetEmotion as any) || 'contentment',
      duration: params.duration
    });
  }

  /**
   * Session complète d'analyse + musique thérapeutique
   */
  async startWellnessSession(params: {
    userId: string;
    analysisData: {
      text?: string;
      audioBlob?: Blob;
      imageBlob?: Blob;
    };
    sessionDuration: number;
    goal: 'relax' | 'energize' | 'focus' | 'mood_boost' | 'sleep' | 'anxiety_relief';
  }) {
    console.log('🌟 Démarrage session bien-être complète');

    try {
      // 1. Analyse émotionnelle
      const emotionAnalysis = await this.analyzeEmotion({
        ...params.analysisData,
        sources: ['openai_text', 'hume_face', 'hume_voice'].filter(source => {
          if (source === 'openai_text') return !!params.analysisData.text;
          if (source === 'hume_face') return !!params.analysisData.imageBlob;
          if (source === 'hume_voice') return !!params.analysisData.audioBlob;
          return false;
        }) as any,
        mode: 'detailed'
      });

      // 2. Génération de recommandations
      const recommendations = await this.emotion.generateSmartRecommendations(emotionAnalysis);

      // 3. Création playlist adaptée
      const playlist = await this.createTherapeuticPlaylist({
        currentEmotion: emotionAnalysis.primaryEmotion,
        targetEmotion: this.getTargetEmotionForGoal(params.goal),
        duration: params.sessionDuration
      });

      // 4. Démarrage session musicale
      const musicSession = await this.music.startTherapySession({
        userId: params.userId,
        goal: params.goal,
        currentEmotion: emotionAnalysis.primaryEmotion,
        targetEmotion: this.getTargetEmotionForGoal(params.goal) as any,
        duration: params.sessionDuration
      });

      return {
        emotionAnalysis,
        recommendations: recommendations.slice(0, 5),
        playlist,
        musicSession,
        sessionId: musicSession.id
      };

    } catch (error) {
      console.error('❌ Erreur session bien-être:', error);
      throw error;
    }
  }

  /**
   * Cache intelligent pour optimiser les performances
   */
  async getCached<T>(key: string, fetcher: () => Promise<T>, ttl: number = 300000): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < ttl) {
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  /**
   * Nettoyage du cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Cache nettoyé');
  }

  /**
   * Statistiques des services
   */
  getServiceStats() {
    return {
      cacheSize: this.cache.size,
      isInitialized: this.isInitialized,
      services: {
        emotion: !!this.emotion,
        music: !!this.music
      }
    };
  }

  // === MÉTHODES PRIVÉES ===

  private async preloadCriticalData(): Promise<void> {
    // Préchargement des données critiques pour optimiser les performances
    console.log('📦 Préchargement des données critiques...');
  }

  private async initializeEmotionService(): Promise<void> {
    // Configuration spécifique du service émotionnel
    console.log('🧠 Initialisation service émotionnel');
  }

  private async initializeMusicService(): Promise<void> {
    // Configuration spécifique du service musical
    console.log('🎵 Initialisation service musical');
  }

  private getTargetEmotionForGoal(goal: string): string {
    const goalToEmotionMap: Record<string, string> = {
      'relax': 'serenity',
      'energize': 'excitement',
      'focus': 'concentration',
      'mood_boost': 'joy',
      'sleep': 'serenity',
      'anxiety_relief': 'contentment'
    };
    return goalToEmotionMap[goal] || 'contentment';
  }
}

// Export singleton
export const serviceManager = UnifiedServiceManager.getInstance();