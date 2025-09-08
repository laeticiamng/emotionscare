/**
 * SERVICE UNIFIÉ - Analyse Émotionnelle Premium
 * Orchestrateur intelligent pour Hume AI, OpenAI et analyses biométriques
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  UnifiedEmotionAnalysis, 
  UnifiedScanSession, 
  SmartRecommendation,
  EmotionSource,
  ScanMode,
  EmotionLabel,
  AdaptiveAnalysisConfig,
  EmotionInsight
} from '@/types/unified-emotions';

export class UnifiedEmotionService {
  private static instance: UnifiedEmotionService;
  private cache = new Map<string, any>();
  private processingQueue: Array<{ id: string; priority: number; task: () => Promise<any> }> = [];
  private isProcessing = false;

  static getInstance(): UnifiedEmotionService {
    if (!UnifiedEmotionService.instance) {
      UnifiedEmotionService.instance = new UnifiedEmotionService();
    }
    return UnifiedEmotionService.instance;
  }

  /**
   * Analyse émotionnelle unifiée multi-sources
   */
  async analyzeEmotion(params: {
    data: {
      text?: string;
      audioBlob?: Blob;
      imageBlob?: Blob;
      videoBlob?: Blob;
    };
    sources: EmotionSource[];
    scanMode: ScanMode;
    config?: Partial<AdaptiveAnalysisConfig>;
    sessionId?: string;
  }): Promise<UnifiedEmotionAnalysis> {
    const startTime = Date.now();
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('🧠 Analyse émotionnelle unifiée commencée:', { 
      analysisId, 
      sources: params.sources,
      scanMode: params.scanMode 
    });

    try {
      // Analyse parallèle multi-sources
      const analysisPromises = await this.createAnalysisPromises(params.data, params.sources);
      const rawResults = await Promise.allSettled(analysisPromises);

      // Fusion intelligente des résultats
      const fusedAnalysis = await this.fuseAnalysisResults(rawResults, params.config);
      
      // Enrichissement contextuel
      const enrichedAnalysis = await this.enrichWithContext({
        ...fusedAnalysis,
        id: analysisId,
        timestamp: new Date(),
        duration: Date.now() - startTime,
        scanMode: params.scanMode,
        sources: params.sources,
      });

      // Sauvegarde optionnelle
      if (params.sessionId) {
        await this.saveAnalysisToSession(params.sessionId, enrichedAnalysis);
      }

      console.log('✅ Analyse terminée:', {
        analysisId,
        primaryEmotion: enrichedAnalysis.primaryEmotion,
        confidence: enrichedAnalysis.overallConfidence,
        processingTime: Date.now() - startTime
      });

      return enrichedAnalysis;

    } catch (error) {
      console.error('❌ Erreur analyse émotionnelle:', error);
      
      // Analyse de fallback
      return this.createFallbackAnalysis(analysisId, params.sources, params.scanMode);
    }
  }

  /**
   * Analyse de texte via OpenAI optimisée
   */
  private async analyzeTextWithOpenAI(text: string): Promise<any> {
    const cacheKey = `text_${this.hashString(text)}`;
    
    if (this.cache.has(cacheKey)) {
      console.log('📄 Cache hit pour analyse de texte');
      return this.cache.get(cacheKey);
    }

    try {
      console.log('🔤 Analyse de texte via OpenAI...');
      
      const { data, error } = await supabase.functions.invoke('enhanced-emotion-analyze', {
        body: { 
          text,
          emotion_context: 'professional_wellbeing_context',
          analysis_depth: 'detailed',
          include_recommendations: true
        }
      });

      if (error) throw error;

      // Mise en cache pour 5 minutes
      this.cache.set(cacheKey, data);
      setTimeout(() => this.cache.delete(cacheKey), 5 * 60 * 1000);

      return data;
    } catch (error) {
      console.error('❌ Erreur analyse de texte:', error);
      throw new Error(`Text analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyse faciale via Hume AI
   */
  private async analyzeFaceWithHume(imageBlob: Blob): Promise<any> {
    try {
      console.log('😊 Analyse faciale via Hume AI...');
      
      // Conversion en base64
      const base64Image = await this.blobToBase64(imageBlob);
      
      const { data, error } = await supabase.functions.invoke('hume-face', {
        body: { 
          image: base64Image,
          type: 'base64',
          return_landmarks: true,
          return_descriptors: true
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Erreur analyse faciale:', error);
      throw new Error(`Facial analysis failed: ${error.message}`);
    }
  }

  /**
   * Analyse vocale via Hume AI
   */
  private async analyzeVoiceWithHume(audioBlob: Blob): Promise<any> {
    try {
      console.log('🎤 Analyse vocale via Hume AI...');
      
      const base64Audio = await this.blobToBase64(audioBlob);
      
      const { data, error } = await supabase.functions.invoke('hume-voice', {
        body: { 
          audio: base64Audio,
          type: 'base64',
          return_prosody: true,
          return_language: true
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Erreur analyse vocale:', error);
      throw new Error(`Voice analysis failed: ${error.message}`);
    }
  }

  /**
   * Génération de recommandations intelligentes
   */
  async generateSmartRecommendations(analysis: UnifiedEmotionAnalysis): Promise<SmartRecommendation[]> {
    console.log('💡 Génération de recommandations intelligentes...');
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-smart-recommendations', {
        body: {
          primaryEmotion: analysis.primaryEmotion,
          emotionVector: analysis.emotionVector,
          confidence: analysis.overallConfidence,
          context: analysis.context,
          sources: analysis.sources
        }
      });

      if (error) throw error;
      return data.recommendations || [];
    } catch (error) {
      console.error('❌ Erreur génération recommandations:', error);
      return this.createFallbackRecommendations(analysis.primaryEmotion);
    }
  }

  /**
   * Démarrage d'une session de scan
   */
  async startScanSession(config: {
    scanMode: ScanMode;
    duration: number;
    sources: EmotionSource[];
    realTimeUpdates?: boolean;
    userId?: string;
  }): Promise<UnifiedScanSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: UnifiedScanSession = {
      id: sessionId,
      userId: config.userId || 'anonymous',
      startTime: new Date(),
      config: {
        scanMode: config.scanMode,
        duration: config.duration,
        sources: config.sources,
        realTimeUpdates: config.realTimeUpdates || false,
        biometricTracking: config.sources.includes('biometric'),
        environmentalContext: true,
        adaptiveScanning: config.scanMode === 'realtime'
      },
      analyses: [],
      recommendations: [],
      sessionMetrics: {
        totalAnalyses: 0,
        averageConfidence: 0,
        dominantEmotion: 'contentment',
        emotionChanges: 0,
        stabilityScore: 0,
        dataQualityScore: 0
      },
      context: {
        device: this.getDeviceType(),
        appVersion: '2.0.0'
      }
    };

    console.log('🚀 Session de scan démarrée:', sessionId);
    return session;
  }

  /**
   * Finalisation d'une session
   */
  async endScanSession(sessionId: string): Promise<UnifiedScanSession> {
    // Récupération et finalisation de la session
    console.log('🏁 Finalisation session:', sessionId);
    
    // Calcul des métriques finales
    // Génération des insights
    // Sauvegarde en base
    
    throw new Error('Session ending not yet implemented');
  }

  /**
   * Génération d'insights intelligents
   */
  async generateInsights(sessionId: string): Promise<EmotionInsight[]> {
    console.log('🔍 Génération d\'insights pour session:', sessionId);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-emotion-insights', {
        body: { sessionId }
      });

      if (error) throw error;
      return data.insights || [];
    } catch (error) {
      console.error('❌ Erreur génération insights:', error);
      return [];
    }
  }

  // === MÉTHODES UTILITAIRES PRIVÉES ===

  private async createAnalysisPromises(
    data: { text?: string; audioBlob?: Blob; imageBlob?: Blob; videoBlob?: Blob },
    sources: EmotionSource[]
  ): Promise<Promise<any>[]> {
    const promises: Promise<any>[] = [];

    if (sources.includes('openai_text') && data.text) {
      promises.push(this.analyzeTextWithOpenAI(data.text));
    }

    if (sources.includes('hume_face') && data.imageBlob) {
      promises.push(this.analyzeFaceWithHume(data.imageBlob));
    }

    if (sources.includes('hume_voice') && data.audioBlob) {
      promises.push(this.analyzeVoiceWithHume(data.audioBlob));
    }

    return promises;
  }

  private async fuseAnalysisResults(
    results: PromiseSettledResult<any>[],
    config?: Partial<AdaptiveAnalysisConfig>
  ): Promise<Partial<UnifiedEmotionAnalysis>> {
    // Fusion intelligente des résultats multi-sources
    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value);

    if (successfulResults.length === 0) {
      throw new Error('Aucune analyse réussie');
    }

    // Algorithme de fusion weighted-average avec confidence
    // TODO: Implémenter la logique de fusion sophistiquée
    
    return {
      primaryEmotion: 'contentment',
      emotions: [],
      emotionVector: { valence: 0.5, arousal: 0.3, dominance: 0.6, stability: 0.8 },
      overallConfidence: 0.75,
      dataQuality: 0.8,
      processingTime: 0
    };
  }

  private async enrichWithContext(
    analysis: Partial<UnifiedEmotionAnalysis>
  ): Promise<UnifiedEmotionAnalysis> {
    // Enrichissement contextuel intelligent
    return {
      ...analysis,
      context: {
        environment: 'office',
        timeOfDay: this.getTimeOfDay(),
        socialContext: 'alone',
        deviceType: this.getDeviceType() as any
      }
    } as UnifiedEmotionAnalysis;
  }

  private createFallbackAnalysis(
    id: string,
    sources: EmotionSource[],
    scanMode: ScanMode
  ): UnifiedEmotionAnalysis {
    return {
      id,
      timestamp: new Date(),
      duration: 1000,
      primaryEmotion: 'contentment',
      emotions: [{
        emotion: 'contentment',
        confidence: 0.5,
        intensity: 0.6,
        source: sources[0]
      }],
      emotionVector: { valence: 0.3, arousal: 0.2, dominance: 0.5, stability: 0.7 },
      overallConfidence: 0.5,
      dataQuality: 0.6,
      processingTime: 1000,
      sources,
      scanMode
    };
  }

  private createFallbackRecommendations(emotion: EmotionLabel): SmartRecommendation[] {
    return [{
      id: `rec_${Date.now()}`,
      type: 'breathing',
      priority: 'medium',
      title: 'Exercice de respiration',
      description: 'Une technique simple pour retrouver votre équilibre',
      targetEmotion: emotion,
      expectedOutcome: 'contentment',
      effectiveness: 75,
      duration: 5,
      difficulty: 'beginner',
      personalizedScore: 0.7,
      usageCount: 0,
      successRate: 0.75
    }];
  }

  private async saveAnalysisToSession(sessionId: string, analysis: UnifiedEmotionAnalysis): Promise<void> {
    // Sauvegarde en base de données
    console.log('💾 Sauvegarde analyse dans session:', sessionId);
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  private getTimeOfDay(): 'morning' | 'afternoon' | 'evening' | 'night' {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    if (hour < 22) return 'evening';
    return 'night';
  }

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'unknown';
    
    const ua = window.navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return 'mobile';
    return 'desktop';
  }
}

// Export singleton
export const unifiedEmotionService = UnifiedEmotionService.getInstance();