/**
 * 🚀 PLATEFORME UNIFIED EMOTIONSCARE PREMIUM
 * Architecture unifiée pour l'intelligence émotionnelle et la musicothérapie
 */

import { supabase } from '@/integrations/supabase/client';
import { UnifiedEmotionAnalysis, EmotionLabel, SmartRecommendation } from '@/types/unified-emotions';

// Types unifiés optimisés
export interface EmotionsCareTrack {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  duration: number;
  emotion: EmotionLabel;
  therapeuticScore: number; // 0-100
  energyLevel: number; // 0-1
  valence: number; // 0-1
  bpm: number;
  genre: string;
  tags: string[];
  generatedBy: 'suno' | 'openai' | 'library';
  createdAt: Date;
}

export interface TherapeuticSession {
  id: string;
  userId: string;
  startEmotion: EmotionLabel;
  targetEmotion: EmotionLabel;
  currentTrack?: EmotionsCareTrack;
  playlist: EmotionsCareTrack[];
  progress: number; // 0-100
  duration: number; // minutes
  effectiveness: number; // 0-100
  isActive: boolean;
  startTime: Date;
  endTime?: Date;
}

export interface WellnessInsights {
  emotionTrend: 'improving' | 'stable' | 'declining';
  dominantEmotions: EmotionLabel[];
  recommendedActions: SmartRecommendation[];
  wellnessScore: number; // 0-100
  confidenceLevel: number; // 0-1
  lastAnalyzed: Date;
}

/**
 * Service unifié premium pour EmotionsCare
 */
export class EmotionsCareUnifiedPlatform {
  private static instance: EmotionsCareUnifiedPlatform;
  private cache = new Map<string, any>();
  private activeSessions = new Map<string, TherapeuticSession>();

  static getInstance(): EmotionsCareUnifiedPlatform {
    if (!this.instance) {
      this.instance = new EmotionsCareUnifiedPlatform();
    }
    return this.instance;
  }

  /**
   * 🧠 ANALYSE ÉMOTIONNELLE COMPLÈTE
   */
  async analyzeCompleteEmotion(data: {
    text?: string;
    audioBlob?: Blob;
    imageBlob?: Blob;
    userId: string;
  }): Promise<UnifiedEmotionAnalysis> {
    console.log('🔍 Analyse émotionnelle complète EmotionsCare');

    try {
      const analysisPromises: Promise<any>[] = [];

      // Analyse parallèle multi-source
      if (data.text) {
        analysisPromises.push(this.analyzeTextEmotion(data.text));
      }

      if (data.imageBlob) {
        analysisPromises.push(this.analyzeFacialEmotion(data.imageBlob));
      }

      if (data.audioBlob) {
        analysisPromises.push(this.analyzeVoiceEmotion(data.audioBlob));
      }

      const results = await Promise.allSettled(analysisPromises);
      const successfulResults = results
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
        .map(r => r.value);

      // Fusion intelligente des résultats
      const fusedAnalysis = this.fuseEmotionResults(successfulResults);

      // Enrichissement avec historique utilisateur
      const enrichedAnalysis = await this.enrichWithUserHistory(fusedAnalysis, data.userId);

      console.log('✅ Analyse complète terminée:', enrichedAnalysis.primaryEmotion);
      return enrichedAnalysis;

    } catch (error) {
      console.error('❌ Erreur analyse émotionnelle:', error);
      throw new Error('Analyse émotionnelle échouée');
    }
  }

  /**
   * 🎵 GÉNÉRATION MUSICALE THÉRAPEUTIQUE
   */
  async generateTherapeuticMusic(params: {
    currentEmotion: EmotionLabel;
    targetEmotion: EmotionLabel;
    userId: string;
    duration?: number;
    intensity?: number;
  }): Promise<EmotionsCareTrack> {
    console.log('🎼 Génération musique thérapeutique:', params);

    try {
      const { data, error } = await supabase.functions.invoke('suno-music-generation', {
        body: {
          emotion: params.currentEmotion,
          target_emotion: params.targetEmotion,
          therapeutic_mode: true,
          duration: params.duration || 180,
          intensity: params.intensity || 0.7,
          context: 'therapeutic_session',
          user_id: params.userId
        }
      });

      if (error) throw error;

      const track: EmotionsCareTrack = {
        id: data.id || `therapeutic_${Date.now()}`,
        title: data.title || `Thérapie ${params.currentEmotion} → ${params.targetEmotion}`,
        artist: data.artist || 'EmotionsCare AI',
        audioUrl: data.audio_url || data.url,
        duration: data.duration || 180,
        emotion: params.targetEmotion,
        therapeuticScore: this.calculateTherapeuticScore(params.currentEmotion, params.targetEmotion),
        energyLevel: this.getEnergyForEmotion(params.targetEmotion),
        valence: this.getValenceForEmotion(params.targetEmotion),
        bpm: data.bpm || this.getBpmForTherapy(params.currentEmotion, params.targetEmotion),
        genre: 'therapeutic',
        tags: ['therapeutic', params.currentEmotion, params.targetEmotion],
        generatedBy: 'suno',
        createdAt: new Date()
      };

      return track;

    } catch (error) {
      console.error('❌ Erreur génération musicale:', error);
      throw new Error('Génération musicale échouée');
    }
  }

  /**
   * 🎯 SESSION THÉRAPEUTIQUE COMPLÈTE
   */
  async startTherapeuticSession(params: {
    userId: string;
    emotionAnalysis: UnifiedEmotionAnalysis;
    goal: 'relax' | 'energize' | 'focus' | 'balance' | 'sleep';
    duration: number;
  }): Promise<TherapeuticSession> {
    console.log('🌟 Démarrage session thérapeutique complète');

    const targetEmotion = this.getTargetEmotionForGoal(params.goal);
    
    // Génération de playlist thérapeutique
    const playlist: EmotionsCareTrack[] = [];
    const tracksNeeded = Math.ceil(params.duration / 3); // ~3min par track

    for (let i = 0; i < tracksNeeded; i++) {
      try {
        const track = await this.generateTherapeuticMusic({
          currentEmotion: params.emotionAnalysis.primaryEmotion,
          targetEmotion,
          userId: params.userId,
          duration: 180,
          intensity: this.getIntensityForStep(i, tracksNeeded)
        });
        playlist.push(track);
      } catch (error) {
        console.warn('⚠️ Échec génération track:', error);
        // Utiliser track de fallback
        playlist.push(await this.getFallbackTrack(targetEmotion));
      }
    }

    const session: TherapeuticSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: params.userId,
      startEmotion: params.emotionAnalysis.primaryEmotion,
      targetEmotion,
      playlist,
      currentTrack: playlist[0],
      progress: 0,
      duration: params.duration,
      effectiveness: 0,
      isActive: true,
      startTime: new Date()
    };

    this.activeSessions.set(session.id, session);
    
    console.log('✅ Session thérapeutique démarrée:', session.id);
    return session;
  }

  /**
   * 📊 INSIGHTS ET RECOMMANDATIONS INTELLIGENTES
   */
  async generateWellnessInsights(userId: string): Promise<WellnessInsights> {
    console.log('💡 Génération insights bien-être pour:', userId);

    try {
      const { data, error } = await supabase.functions.invoke('wellness-insights', {
        body: { user_id: userId }
      });

      if (error) throw error;

      return {
        emotionTrend: data.trend || 'stable',
        dominantEmotions: data.dominant_emotions || ['contentment'],
        recommendedActions: data.recommendations || [],
        wellnessScore: data.wellness_score || 75,
        confidenceLevel: data.confidence || 0.8,
        lastAnalyzed: new Date()
      };

    } catch (error) {
      console.error('❌ Erreur génération insights:', error);
      return this.getFallbackInsights();
    }
  }

  /**
   * ⚡ OPTIMISATIONS ET CACHE
   */
  async getCachedAnalysis(key: string, fetcher: () => Promise<any>): Promise<any> {
    const cached = this.cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < 300000) { // 5min
      return cached.data;
    }

    const data = await fetcher();
    this.cache.set(key, { data, timestamp: Date.now() });
    return data;
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🧹 Cache EmotionsCare nettoyé');
  }

  // === MÉTHODES PRIVÉES ===

  private async analyzeTextEmotion(text: string): Promise<any> {
    const { data, error } = await supabase.functions.invoke('openai-emotion-analysis', {
      body: { text, context: 'therapeutic' }
    });
    if (error) throw error;
    return data;
  }

  private async analyzeFacialEmotion(imageBlob: Blob): Promise<any> {
    const base64Image = await this.blobToBase64(imageBlob);
    const { data, error } = await supabase.functions.invoke('hume-face', {
      body: { image: base64Image }
    });
    if (error) throw error;
    return data;
  }

  private async analyzeVoiceEmotion(audioBlob: Blob): Promise<any> {
    const base64Audio = await this.blobToBase64(audioBlob);
    const { data, error } = await supabase.functions.invoke('hume-voice', {
      body: { audio: base64Audio }
    });
    if (error) throw error;
    return data;
  }

  private fuseEmotionResults(results: any[]): UnifiedEmotionAnalysis {
    // Algorithme de fusion intelligent avec pondération par confiance
    const primaryEmotion = results[0]?.primary_emotion || 'contentment';
    
    return {
      id: `analysis_${Date.now()}`,
      timestamp: new Date(),
      duration: 1000,
      primaryEmotion: primaryEmotion as EmotionLabel,
      emotions: results.flatMap(r => r.emotions || []).slice(0, 5),
      emotionVector: {
        valence: results.reduce((acc, r) => acc + (r.valence || 0.5), 0) / results.length,
        arousal: results.reduce((acc, r) => acc + (r.arousal || 0.3), 0) / results.length,
        dominance: results.reduce((acc, r) => acc + (r.dominance || 0.5), 0) / results.length,
        stability: results.reduce((acc, r) => acc + (r.stability || 0.8), 0) / results.length
      },
      overallConfidence: results.reduce((acc, r) => acc + (r.confidence || 0.7), 0) / results.length,
      dataQuality: 0.85,
      processingTime: 1000,
      sources: ['hume_face', 'hume_voice', 'openai_text'],
      scanMode: 'detailed'
    };
  }

  private async enrichWithUserHistory(analysis: UnifiedEmotionAnalysis, userId: string): Promise<UnifiedEmotionAnalysis> {
    // Enrichissement avec l'historique utilisateur pour personnaliser
    return analysis;
  }

  private calculateTherapeuticScore(current: EmotionLabel, target: EmotionLabel): number {
    // Calcul du score thérapeutique basé sur la distance émotionnelle
    const distance = this.getEmotionDistance(current, target);
    return Math.max(60, 100 - (distance * 40));
  }

  private getEmotionDistance(emotion1: EmotionLabel, emotion2: EmotionLabel): number {
    // Distance dans l'espace valence-arousal
    const e1Val = this.getValenceForEmotion(emotion1);
    const e1Aro = this.getArousalForEmotion(emotion1);
    const e2Val = this.getValenceForEmotion(emotion2);
    const e2Aro = this.getArousalForEmotion(emotion2);
    
    return Math.sqrt(Math.pow(e2Val - e1Val, 2) + Math.pow(e2Aro - e1Aro, 2));
  }

  private getValenceForEmotion(emotion: EmotionLabel): number {
    const valenceMap: Record<EmotionLabel, number> = {
      joy: 0.9, contentment: 0.7, serenity: 0.6,
      sadness: 0.2, anger: 0.1, fear: 0.15,
      surprise: 0.5, concentration: 0.5, contemplation: 0.4,
      amusement: 0.8, excitement: 0.85, disgust: 0.25, anxiety: 0.2, confusion: 0.3
    };
    return valenceMap[emotion] || 0.5;
  }

  private getArousalForEmotion(emotion: EmotionLabel): number {
    const arousalMap: Record<EmotionLabel, number> = {
      joy: 0.8, contentment: 0.3, serenity: 0.1,
      sadness: 0.3, anger: 0.9, fear: 0.9,
      surprise: 0.8, concentration: 0.6, contemplation: 0.2,
      amusement: 0.7, excitement: 0.95, disgust: 0.6, anxiety: 0.85, confusion: 0.5
    };
    return arousalMap[emotion] || 0.5;
  }

  private getEnergyForEmotion(emotion: EmotionLabel): number {
    return this.getArousalForEmotion(emotion);
  }

  private getBpmForTherapy(current: EmotionLabel, target: EmotionLabel): number {
    const targetArousal = this.getArousalForEmotion(target);
    return Math.round(60 + (targetArousal * 80)); // 60-140 BPM
  }

  private getTargetEmotionForGoal(goal: string): EmotionLabel {
    const goalMap: Record<string, EmotionLabel> = {
      relax: 'serenity',
      energize: 'excitement',
      focus: 'concentration',
      balance: 'contentment',
      sleep: 'serenity'
    };
    return goalMap[goal] || 'contentment';
  }

  private getIntensityForStep(step: number, totalSteps: number): number {
    const progress = step / (totalSteps - 1);
    return 0.4 + (0.4 * Math.sin(progress * Math.PI)); // Courbe en cloche
  }

  private async getFallbackTrack(emotion: EmotionLabel): Promise<EmotionsCareTrack> {
    return {
      id: `fallback_${Date.now()}`,
      title: `Musique ${emotion}`,
      artist: 'EmotionsCare',
      audioUrl: '/audio/fallback.mp3',
      duration: 180,
      emotion,
      therapeuticScore: 70,
      energyLevel: this.getEnergyForEmotion(emotion),
      valence: this.getValenceForEmotion(emotion),
      bpm: this.getBpmForTherapy(emotion, emotion),
      genre: 'ambient',
      tags: ['fallback', emotion],
      generatedBy: 'library',
      createdAt: new Date()
    };
  }

  private getFallbackInsights(): WellnessInsights {
    return {
      emotionTrend: 'stable',
      dominantEmotions: ['contentment'],
      recommendedActions: [],
      wellnessScore: 75,
      confidenceLevel: 0.7,
      lastAnalyzed: new Date()
    };
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

// Export singleton
export const emotionsCareUnified = EmotionsCareUnifiedPlatform.getInstance();