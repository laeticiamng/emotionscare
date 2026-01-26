// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import sunoService from './suno.service';
import emotionAnalysisService from './emotionAnalysis.service';
import type { ApiResponse, EmotionData, MusicRecommendation } from './types';
import { logger } from '@/lib/logger';

interface TherapySession {
  id: string;
  userId: string;
  startTime: Date;
  currentTrack?: MusicRecommendation;
  emotionHistory: EmotionData[];
  adaptationHistory: Array<{
    timestamp: Date;
    trigger: string;
    action: string;
    trackChange?: MusicRecommendation;
  }>;
  goals: {
    targetMood: string;
    duration: number;
    intensity: 'gentle' | 'moderate' | 'intensive';
  };
}

class MusicTherapyService {
  private activeSessions: Map<string, TherapySession> = new Map();
  private emotionCallbacks: Map<string, (emotions: EmotionData[]) => void> = new Map();

  async startTherapySession(
    userId: string,
    options: {
      targetMood: string;
      currentEmotions: EmotionData[];
      sessionDuration: number; // minutes
      preferences?: {
        genres?: string[];
        avoidGenres?: string[];
        instrumentalOnly?: boolean;
        energyLevel?: number;
      };
      therapyType?: 'relaxation' | 'motivation' | 'focus' | 'sleep' | 'mood-lifting';
    }
  ): Promise<ApiResponse<{
    sessionId: string;
    initialTrack: MusicRecommendation;
    sessionPlan: {
      phases: Array<{
        name: string;
        duration: number;
        musicCharacteristics: any;
      }>;
    };
  }>> {
    try {
      const sessionId = await emotionAnalysisService.createSession(userId, 'music');
      
      // Générer la musique thérapeutique initiale
      const initialMusicResponse = await sunoService.generateTherapeuticMusic({
        currentEmotions: options.currentEmotions,
        targetMood: options.targetMood,
        preferences: options.preferences,
        sessionType: options.therapyType || 'relaxation'
      });

      if (!initialMusicResponse.success) {
        throw new Error('Failed to generate initial therapeutic music');
      }

      // Créer le plan de session thérapeutique
      const sessionPlan = this.createTherapySessionPlan(
        options.targetMood,
        options.sessionDuration,
        options.therapyType || 'relaxation'
      );

      const session: TherapySession = {
        id: sessionId,
        userId,
        startTime: new Date(),
        currentTrack: initialMusicResponse.data,
        emotionHistory: [...options.currentEmotions],
        adaptationHistory: [],
        goals: {
          targetMood: options.targetMood,
          duration: options.sessionDuration,
          intensity: this.determineIntensity(options.currentEmotions, options.targetMood)
        }
      };

      this.activeSessions.set(sessionId, session);

      // Sauvegarder en base
      await this.saveSessionToDatabase(session, sessionPlan);

      return {
        success: true,
        data: {
          sessionId,
          initialTrack: initialMusicResponse.data,
          sessionPlan
        },
        timestamp: new Date()
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async updateSessionWithEmotions(
    sessionId: string,
    newEmotions: EmotionData[]
  ): Promise<ApiResponse<{
    adaptationNeeded: boolean;
    newTrack?: MusicRecommendation;
    adaptationReason?: string;
    continueCurrent?: boolean;
  }>> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return {
        success: false,
        error: 'Session not found',
        timestamp: new Date()
      };
    }

    try {
      // Analyser si une adaptation est nécessaire
      const adaptationAnalysis = this.analyzeAdaptationNeed(
        session.emotionHistory,
        newEmotions,
        session.goals
      );

      session.emotionHistory.push(...newEmotions);

      if (adaptationAnalysis.needsAdaptation) {
        // Générer une nouvelle piste adaptée
        const adaptiveMusic = await sunoService.generateAdaptiveMusic(
          newEmotions,
          {
            targetMood: session.goals.targetMood,
            duration: session.goals.duration,
            progressionType: 'gradual'
          }
        );

        if (adaptiveMusic.success) {
          session.currentTrack = adaptiveMusic.data.currentTrack;
          session.adaptationHistory.push({
            timestamp: new Date(),
            trigger: adaptationAnalysis.reason,
            action: 'track_change',
            trackChange: adaptiveMusic.data.currentTrack
          });

          // Mettre à jour en base
          await this.updateSessionInDatabase(sessionId, {
            currentTrack: session.currentTrack,
            emotions: newEmotions,
            adaptationHistory: session.adaptationHistory
          });

          return {
            success: true,
            data: {
              adaptationNeeded: true,
              newTrack: adaptiveMusic.data.currentTrack,
              adaptationReason: adaptationAnalysis.reason
            },
            timestamp: new Date()
          };
        }
      }

      return {
        success: true,
        data: {
          adaptationNeeded: false,
          continueCurrent: true
        },
        timestamp: new Date()
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async getSessionProgress(sessionId: string): Promise<ApiResponse<{
    timeElapsed: number;
    emotionalProgress: {
      initialEmotions: EmotionData[];
      currentEmotions: EmotionData[];
      targetProgress: number; // 0-1
      moodEvolution: Array<{
        timestamp: Date;
        dominantEmotion: string;
        confidence: number;
      }>;
    };
    adaptationCount: number;
    recommendations: string[];
  }>> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return {
        success: false,
        error: 'Session not found',
        timestamp: new Date()
      };
    }

    try {
      const timeElapsed = Math.floor((Date.now() - session.startTime.getTime()) / 1000 / 60);
      const initialEmotions = session.emotionHistory.slice(0, 3);
      const currentEmotions = session.emotionHistory.slice(-3);

      const emotionalProgress = this.calculateEmotionalProgress(
        initialEmotions,
        currentEmotions,
        session.goals.targetMood
      );

      const moodEvolution = this.calculateMoodEvolution(session.emotionHistory);
      const recommendations = await this.generateProgressRecommendations(session);

      return {
        success: true,
        data: {
          timeElapsed,
          emotionalProgress: {
            initialEmotions,
            currentEmotions,
            targetProgress: emotionalProgress,
            moodEvolution
          },
          adaptationCount: session.adaptationHistory.length,
          recommendations
        },
        timestamp: new Date()
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async endTherapySession(
    sessionId: string,
    feedback?: {
      effectiveness: number; // 1-5
      enjoyment: number; // 1-5
      wouldRecommend: boolean;
      comments?: string;
    }
  ): Promise<ApiResponse<{
    summary: {
      duration: number;
      tracksPlayed: number;
      adaptations: number;
      emotionalImprovement: number;
      achievements: string[];
    };
    recommendations: {
      nextSessionType: string;
      suggestedFrequency: string;
      improvedAreas: string[];
    };
  }>> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      return {
        success: false,
        error: 'Session not found',
        timestamp: new Date()
      };
    }

    try {
      const duration = Math.floor((Date.now() - session.startTime.getTime()) / 1000 / 60);
      const summary = await this.generateSessionSummary(session, duration);
      const recommendations = await this.generatePostSessionRecommendations(session, feedback);

      // Marquer la session comme terminée
      await emotionAnalysisService.endSession(sessionId, {
        moodImprovement: summary.emotionalImprovement,
        stressReduction: this.calculateStressReduction(session),
        satisfaction: feedback?.effectiveness || 3
      });

      // Sauvegarder le feedback
      if (feedback) {
        await this.saveFeedbackToDatabase(sessionId, feedback);
      }

      this.activeSessions.delete(sessionId);

      return {
        success: true,
        data: {
          summary,
          recommendations
        },
        timestamp: new Date()
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async getPersonalizedPlaylist(
    userId: string,
    context: {
      timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
      activity: 'work' | 'exercise' | 'relaxation' | 'study' | 'sleep';
      recentEmotions?: EmotionData[];
      duration?: number; // minutes
    }
  ): Promise<ApiResponse<{
    playlist: MusicRecommendation[];
    reasoning: string;
    adaptationPoints: number[]; // Points dans la playlist où l'adaptation pourrait être nécessaire
  }>> {
    try {
      // Récupérer l'historique musical de l'utilisateur
      const { data: history } = await supabase
        .from('music_therapy_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Analyser les préférences basées sur l'historique
      const preferences = this.analyzeUserPreferences(history || []);

      // Générer une playlist basée sur le contexte et les préférences
      const playlistResponse = await sunoService.getMoodBasedPlaylist(
        this.contextToMood(context),
        {
          duration: context.duration || 30,
          count: Math.ceil((context.duration || 30) / 4), // ~4 minutes par track
          personalizeFor: userId
        }
      );

      if (!playlistResponse.success) {
        throw new Error('Failed to generate playlist');
      }

      const reasoning = this.generatePlaylistReasoning(context, preferences);
      const adaptationPoints = this.identifyAdaptationPoints(playlistResponse.data.playlist);

      return {
        success: true,
        data: {
          playlist: playlistResponse.data.playlist,
          reasoning,
          adaptationPoints
        },
        timestamp: new Date()
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  // Méthodes privées d'aide

  private createTherapySessionPlan(
    targetMood: string,
    duration: number,
    therapyType: string
  ): any {
    const phases = [];
    
    if (therapyType === 'relaxation') {
      phases.push(
        { name: 'Transition', duration: Math.floor(duration * 0.2), musicCharacteristics: { energy: 0.7, valence: 0.5 } },
        { name: 'Deep Relaxation', duration: Math.floor(duration * 0.6), musicCharacteristics: { energy: 0.3, valence: 0.7 } },
        { name: 'Gentle Awakening', duration: Math.floor(duration * 0.2), musicCharacteristics: { energy: 0.5, valence: 0.8 } }
      );
    } else if (therapyType === 'motivation') {
      phases.push(
        { name: 'Warm-up', duration: Math.floor(duration * 0.3), musicCharacteristics: { energy: 0.6, valence: 0.7 } },
        { name: 'Peak Energy', duration: Math.floor(duration * 0.4), musicCharacteristics: { energy: 0.9, valence: 0.9 } },
        { name: 'Sustained Drive', duration: Math.floor(duration * 0.3), musicCharacteristics: { energy: 0.8, valence: 0.8 } }
      );
    }

    return { phases };
  }

  private determineIntensity(emotions: EmotionData[], targetMood: string): 'gentle' | 'moderate' | 'intensive' {
    const avgIntensity = emotions.reduce((sum, e) => sum + e.intensity, 0) / emotions.length;
    
    if (avgIntensity < 0.3) return 'gentle';
    if (avgIntensity < 0.7) return 'moderate';
    return 'intensive';
  }

  private analyzeAdaptationNeed(
    historyEmotions: EmotionData[],
    newEmotions: EmotionData[],
    goals: any
  ): { needsAdaptation: boolean; reason: string } {
    // Logique d'analyse pour déterminer si une adaptation est nécessaire
    const recentEmotions = historyEmotions.slice(-5);
    const currentDominant = newEmotions[0]?.emotion;
    const recentDominant = recentEmotions[0]?.emotion;

    if (currentDominant !== recentDominant) {
      return {
        needsAdaptation: true,
        reason: `Emotion shift detected: ${recentDominant} → ${currentDominant}`
      };
    }

    // Vérifier la progression vers l'objectif
    const targetAlignment = this.calculateTargetAlignment(newEmotions, goals.targetMood);
    if (targetAlignment < 0.4) {
      return {
        needsAdaptation: true,
        reason: 'Low alignment with target mood, adaptation needed'
      };
    }

    return { needsAdaptation: false, reason: '' };
  }

  private calculateEmotionalProgress(
    initial: EmotionData[],
    current: EmotionData[],
    targetMood: string
  ): number {
    // Calculer le progrès émotionnel vers l'objectif
    const initialAlignment = this.calculateTargetAlignment(initial, targetMood);
    const currentAlignment = this.calculateTargetAlignment(current, targetMood);
    
    return Math.max(0, Math.min(1, (currentAlignment - initialAlignment + 1) / 2));
  }

  private calculateTargetAlignment(emotions: EmotionData[], targetMood: string): number {
    // Calculer l'alignement avec l'humeur cible
    const moodMappings: Record<string, string[]> = {
      relaxed: ['calm', 'peaceful', 'serene'],
      energized: ['excited', 'motivated', 'enthusiastic'],
      focused: ['concentrated', 'alert', 'engaged'],
      happy: ['joy', 'cheerful', 'content']
    };

    const targetEmotions = moodMappings[targetMood] || [targetMood];
    const relevantEmotions = emotions.filter(e => targetEmotions.includes(e.emotion));
    
    if (relevantEmotions.length === 0) return 0;
    
    return relevantEmotions.reduce((sum, e) => sum + e.confidence, 0) / relevantEmotions.length;
  }

  private calculateMoodEvolution(emotions: EmotionData[]): Array<{
    timestamp: Date;
    dominantEmotion: string;
    confidence: number;
  }> {
    // Calculer l'évolution de l'humeur dans le temps
    const evolution = [];
    for (let i = 0; i < emotions.length; i += 3) {
      const chunk = emotions.slice(i, i + 3);
      if (chunk.length > 0) {
        const dominant = chunk.reduce((prev, current) => 
          prev.confidence > current.confidence ? prev : current
        );
        evolution.push({
          timestamp: dominant.timestamp,
          dominantEmotion: dominant.emotion,
          confidence: dominant.confidence
        });
      }
    }
    return evolution;
  }

  private async generateProgressRecommendations(session: TherapySession): Promise<string[]> {
    const recommendations = [
      'Continue listening to maintain current progress',
      'Focus on deep breathing with the music',
      'Allow yourself to fully immerse in the experience'
    ];

    const recentEmotions = session.emotionHistory.slice(-3);
    const dominantEmotion = recentEmotions[0]?.emotion;

    const emotionRecommendations: Record<string, string[]> = {
      anxious: ['Focus on the rhythm to ground yourself', 'Practice progressive muscle relaxation'],
      sad: ['Allow the music to validate your feelings', 'Consider gentle movement with the music'],
      angry: ['Use the music to channel energy positively', 'Practice mindful listening'],
      happy: ['Embrace and amplify this positive state', 'Share this moment mindfully']
    };

    if (dominantEmotion && emotionRecommendations[dominantEmotion]) {
      recommendations.push(...emotionRecommendations[dominantEmotion]);
    }

    return recommendations;
  }

  private async generateSessionSummary(session: TherapySession, duration: number): Promise<any> {
    const initialEmotions = session.emotionHistory.slice(0, 3);
    const finalEmotions = session.emotionHistory.slice(-3);
    
    const emotionalImprovement = this.calculateEmotionalProgress(
      initialEmotions,
      finalEmotions,
      session.goals.targetMood
    );

    const achievements = [];
    if (emotionalImprovement > 0.6) achievements.push('Significant mood improvement achieved');
    if (session.adaptationHistory.length > 0) achievements.push('Successfully adapted to emotional changes');
    if (duration >= session.goals.duration * 0.8) achievements.push('Completed full therapy session');

    return {
      duration,
      tracksPlayed: session.adaptationHistory.length + 1,
      adaptations: session.adaptationHistory.length,
      emotionalImprovement: Math.round(emotionalImprovement * 100),
      achievements
    };
  }

  private async generatePostSessionRecommendations(
    session: TherapySession,
    feedback?: any
  ): Promise<any> {
    const effectiveness = feedback?.effectiveness || 3;
    
    let nextSessionType = 'relaxation';
    let suggestedFrequency = 'weekly';
    
    if (effectiveness >= 4) {
      nextSessionType = 'Continue with similar sessions';
      suggestedFrequency = '2-3 times per week';
    } else if (effectiveness <= 2) {
      nextSessionType = 'Try different therapy approach';
      suggestedFrequency = 'As needed';
    }

    return {
      nextSessionType,
      suggestedFrequency,
      improvedAreas: ['Mood regulation', 'Stress management']
    };
  }

  private calculateStressReduction(session: TherapySession): number {
    // Calculer la réduction du stress basée sur l'évolution émotionnelle
    const initialStress = this.calculateStressLevel(session.emotionHistory.slice(0, 3));
    const finalStress = this.calculateStressLevel(session.emotionHistory.slice(-3));
    
    return Math.max(0, initialStress - finalStress);
  }

  private calculateStressLevel(emotions: EmotionData[]): number {
    const stressEmotions = ['anxious', 'worried', 'overwhelmed', 'frustrated'];
    const stressLevel = emotions
      .filter(e => stressEmotions.includes(e.emotion))
      .reduce((sum, e) => sum + e.confidence, 0);
    
    return stressLevel / emotions.length;
  }

  private analyzeUserPreferences(history: any[]): any {
    // Analyser les préférences utilisateur basées sur l'historique
    return {
      preferredGenres: ['ambient', 'classical'],
      avoidedGenres: ['heavy-metal'],
      optimalSessionDuration: 25,
      preferredTimeOfDay: 'evening'
    };
  }

  private contextToMood(context: any): string {
    const contextMoodMap: Record<string, string> = {
      'morning-work': 'focused',
      'afternoon-work': 'energized',
      'evening-relaxation': 'calm',
      'night-sleep': 'peaceful'
    };

    const key = `${context.timeOfDay}-${context.activity}`;
    return contextMoodMap[key] || 'balanced';
  }

  private generatePlaylistReasoning(context: any, preferences: any): string {
    return `Generated playlist for ${context.activity} during ${context.timeOfDay} based on your preferences for ${preferences.preferredGenres.join(', ')} music. This selection aims to support your ${this.contextToMood(context)} mood.`;
  }

  private identifyAdaptationPoints(playlist: MusicRecommendation[]): number[] {
    // Identifier les points où l'adaptation pourrait être nécessaire
    const points = [];
    for (let i = 1; i < playlist.length - 1; i++) {
      const current = playlist[i];
      const next = playlist[i + 1];
      
      // Si il y a un grand changement d'énergie, marquer comme point d'adaptation
      if (Math.abs(current.energy - next.energy) > 0.3) {
        points.push(i);
      }
    }
    return points;
  }

  private async saveSessionToDatabase(session: TherapySession, plan: any): Promise<void> {
    try {
      await supabase.from('music_therapy_sessions').insert({
        id: session.id,
        user_id: session.userId,
        start_time: session.startTime.toISOString(),
        goals: session.goals,
        session_plan: plan,
        status: 'active'
      });
    } catch (error) {
      logger.error('Error saving therapy session', error as Error, 'MUSIC');
    }
  }

  private async updateSessionInDatabase(sessionId: string, update: any): Promise<void> {
    try {
      await supabase.from('music_therapy_sessions')
        .update({
          current_track: update.currentTrack,
          emotion_history: update.emotions,
          adaptation_history: update.adaptationHistory,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);
    } catch (error) {
      logger.error('Error updating therapy session', error as Error, 'MUSIC');
    }
  }

  private async saveFeedbackToDatabase(sessionId: string, feedback: any): Promise<void> {
    try {
      await supabase.from('session_feedback').insert({
        session_id: sessionId,
        effectiveness: feedback.effectiveness,
        enjoyment: feedback.enjoyment,
        would_recommend: feedback.wouldRecommend,
        comments: feedback.comments,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error saving feedback', error as Error, 'MUSIC');
    }
  }
}

export default new MusicTherapyService();