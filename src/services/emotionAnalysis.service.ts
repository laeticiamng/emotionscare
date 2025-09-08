import { supabase } from '@/integrations/supabase/client';
import humeService from './hume.service';
import openaiService from './openai.service';
import type { ApiResponse, EmotionData, TherapeuticSession } from './types';

class EmotionAnalysisService {
  private sessionData: Map<string, TherapeuticSession> = new Map();

  async createSession(
    userId: string,
    type: TherapeuticSession['type']
  ): Promise<string> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const session: TherapeuticSession = {
      id: sessionId,
      userId,
      type,
      startTime: new Date(),
      emotions: [],
      recommendations: [],
    };

    this.sessionData.set(sessionId, session);

    // Sauvegarder en base de données
    try {
      await supabase.from('therapeutic_sessions').insert({
        id: sessionId,
        user_id: userId,
        session_type: type,
        start_time: session.startTime.toISOString(),
        status: 'active'
      });
    } catch (error) {
      console.error('Error saving session to database:', error);
    }

    return sessionId;
  }

  async analyzeMultiModal(
    input: {
      text?: string;
      image?: string | File;
      audio?: File;
      video?: File;
    },
    sessionId?: string
  ): Promise<ApiResponse<{
    emotions: EmotionData[];
    insights: {
      primary_emotion: string;
      confidence: number;
      recommendations: string[];
      risk_indicators?: string[];
    };
    therapeutic_suggestions: string[];
  }>> {
    const results: {
      text?: any;
      face?: any;
      voice?: any;
    } = {};

    try {
      // Analyse textuelle si fournie
      if (input.text) {
        const textAnalysis = await humeService.analyzeText(input.text);
        if (textAnalysis.success) {
          results.text = textAnalysis.data;
        }
      }

      // Analyse faciale si image fournie
      if (input.image) {
        const faceAnalysis = await humeService.analyzeImage(input.image);
        if (faceAnalysis.success) {
          results.face = faceAnalysis.data;
        }
      }

      // Analyse vocale si audio fourni
      if (input.audio) {
        const voiceAnalysis = await humeService.analyzeVoice(input.audio);
        if (voiceAnalysis.success) {
          results.voice = voiceAnalysis.data;
        }
      }

      // Fusionner et analyser les résultats
      const combinedEmotions = this.combineEmotionResults(results);
      const insights = await this.generateInsights(combinedEmotions, input);
      const therapeuticSuggestions = await this.generateTherapeuticSuggestions(
        combinedEmotions,
        insights
      );

      // Mettre à jour la session si fournie
      if (sessionId && this.sessionData.has(sessionId)) {
        const session = this.sessionData.get(sessionId)!;
        session.emotions.push(...combinedEmotions);
        this.sessionData.set(sessionId, session);

        // Mise à jour base de données
        await this.updateSessionInDatabase(sessionId, {
          emotions: combinedEmotions,
          insights: insights.data
        });
      }

      return {
        success: true,
        data: {
          emotions: combinedEmotions,
          insights: insights.success ? insights.data : {
            primary_emotion: combinedEmotions[0]?.emotion || 'neutral',
            confidence: combinedEmotions[0]?.confidence || 0.5,
            recommendations: ['Continue monitoring emotional state']
          },
          therapeutic_suggestions: therapeuticSuggestions
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

  async getEmotionalTrends(
    userId: string,
    timeRange: { start: Date; end: Date }
  ): Promise<ApiResponse<{
    trends: Array<{
      date: string;
      emotions: Record<string, number>;
      dominant_emotion: string;
      stability_score: number;
    }>;
    insights: {
      most_frequent_emotions: string[];
      improvement_areas: string[];
      stability_trend: 'improving' | 'stable' | 'declining';
    };
  }>> {
    try {
      const { data: sessionData, error } = await supabase
        .from('therapeutic_sessions')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', timeRange.start.toISOString())
        .lte('start_time', timeRange.end.toISOString())
        .order('start_time', { ascending: true });

      if (error) {
        throw error;
      }

      const trends = this.calculateEmotionalTrends(sessionData || []);
      const insights = this.generateTrendInsights(trends);

      return {
        success: true,
        data: { trends, insights },
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

  async getPersonalizedRecommendations(
    userId: string,
    currentEmotions: EmotionData[],
    context?: {
      time_of_day?: string;
      location?: string;
      recent_activities?: string[];
      goals?: string[];
    }
  ): Promise<ApiResponse<{
    immediate_actions: string[];
    long_term_strategies: string[];
    resource_recommendations: Array<{
      type: 'music' | 'exercise' | 'meditation' | 'article';
      title: string;
      description: string;
      url?: string;
    }>;
  }>> {
    try {
      // Obtenir l'historique émotionnel de l'utilisateur
      const { data: history } = await supabase
        .from('therapeutic_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('start_time', { ascending: false })
        .limit(10);

      // Générer des recommandations personnalisées avec OpenAI
      const recommendationPrompt = `
        Utilisateur: ${userId}
        Émotions actuelles: ${currentEmotions.map(e => `${e.emotion} (${e.confidence})`).join(', ')}
        Contexte: ${JSON.stringify(context)}
        Historique récent: ${history?.length || 0} sessions
        
        Générez des recommandations thérapeutiques personnalisées au format JSON:
        {
          "immediate_actions": ["action1", "action2"],
          "long_term_strategies": ["strategy1", "strategy2"],
          "resource_recommendations": [
            {"type": "music", "title": "titre", "description": "desc", "url": "optional"}
          ]
        }
      `;

      const aiResponse = await openaiService.generateCoachingResponse(
        [{ role: 'user', content: recommendationPrompt }],
        {
          emotionalState: currentEmotions[0]?.emotion,
          userGoals: context?.goals
        }
      );

      if (aiResponse.success && aiResponse.data?.response) {
        try {
          const recommendations = JSON.parse(aiResponse.data.response);
          return {
            success: true,
            data: recommendations,
            timestamp: new Date()
          };
        } catch (parseError) {
          // Fallback to default recommendations
          return this.getDefaultRecommendations(currentEmotions);
        }
      }

      return this.getDefaultRecommendations(currentEmotions);

    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async endSession(sessionId: string, outcome?: {
    moodImprovement: number;
    stressReduction: number;
    satisfaction: number;
  }): Promise<ApiResponse<{ summary: any }>> {
    const session = this.sessionData.get(sessionId);
    if (!session) {
      return {
        success: false,
        error: 'Session not found',
        timestamp: new Date()
      };
    }

    session.endTime = new Date();
    session.outcome = outcome;

    try {
      // Mettre à jour en base
      await supabase
        .from('therapeutic_sessions')
        .update({
          end_time: session.endTime.toISOString(),
          status: 'completed',
          outcome: outcome
        })
        .eq('id', sessionId);

      // Générer un résumé de session
      const summary = await this.generateSessionSummary(session);

      this.sessionData.delete(sessionId);

      return {
        success: true,
        data: { summary },
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

  private combineEmotionResults(results: any): EmotionData[] {
    const combinedEmotions: EmotionData[] = [];
    const emotionMap: Map<string, number[]> = new Map();

    // Traiter les résultats de chaque modalité
    Object.entries(results).forEach(([modality, data]) => {
      if (data?.emotions) {
        data.emotions.forEach((emotion: EmotionData) => {
          const existing = emotionMap.get(emotion.emotion) || [];
          existing.push(emotion.confidence);
          emotionMap.set(emotion.emotion, existing);
        });
      }
    });

    // Calculer les moyennes pondérées
    emotionMap.forEach((confidences, emotion) => {
      const avgConfidence = confidences.reduce((a, b) => a + b, 0) / confidences.length;
      combinedEmotions.push({
        emotion,
        confidence: avgConfidence,
        intensity: avgConfidence,
        timestamp: new Date(),
        metadata: {
          modalities: Object.keys(results),
          sources: confidences.length
        }
      });
    });

    // Trier par confiance décroissante
    return combinedEmotions.sort((a, b) => b.confidence - a.confidence);
  }

  private async generateInsights(emotions: EmotionData[], input: any): Promise<ApiResponse> {
    const dominantEmotion = emotions[0];
    if (!dominantEmotion) {
      return {
        success: true,
        data: {
          primary_emotion: 'neutral',
          confidence: 0.5,
          recommendations: ['Continue regular emotional check-ins']
        },
        timestamp: new Date()
      };
    }

    // Générer des insights avec OpenAI
    const insightPrompt = `
      Analysez cette situation émotionnelle:
      Émotion principale: ${dominantEmotion.emotion} (confiance: ${dominantEmotion.confidence})
      Toutes les émotions: ${emotions.map(e => `${e.emotion}: ${e.confidence}`).join(', ')}
      
      Fournissez des insights thérapeutiques et identifiez tout indicateur de risque potentiel.
      Répondez au format JSON: {
        "primary_emotion": "...",
        "confidence": number,
        "recommendations": ["..."],
        "risk_indicators": ["..."]
      }
    `;

    const aiResponse = await openaiService.generateCoachingResponse(
      [{ role: 'user', content: insightPrompt }],
      { emotionalState: dominantEmotion.emotion }
    );

    if (aiResponse.success) {
      try {
        return {
          success: true,
          data: JSON.parse(aiResponse.data?.response || '{}'),
          timestamp: new Date()
        };
      } catch (error) {
        // Fallback
      }
    }

    return {
      success: true,
      data: {
        primary_emotion: dominantEmotion.emotion,
        confidence: dominantEmotion.confidence,
        recommendations: [`Focus on managing ${dominantEmotion.emotion} emotions`]
      },
      timestamp: new Date()
    };
  }

  private async generateTherapeuticSuggestions(
    emotions: EmotionData[],
    insights: any
  ): Promise<string[]> {
    const suggestions = [
      'Practice deep breathing exercises',
      'Take a moment to acknowledge your current emotional state',
      'Consider journaling about your feelings'
    ];

    const dominantEmotion = emotions[0]?.emotion;
    
    const emotionSpecificSuggestions: Record<string, string[]> = {
      anxious: [
        'Try progressive muscle relaxation',
        'Practice grounding techniques (5-4-3-2-1 method)',
        'Listen to calming music'
      ],
      sad: [
        'Reach out to a trusted friend or family member',
        'Engage in gentle physical activity',
        'Practice self-compassion'
      ],
      angry: [
        'Take a timeout and cool down',
        'Express feelings through physical exercise',
        'Practice assertive communication techniques'
      ],
      happy: [
        'Share your positive feelings with others',
        'Engage in activities that maintain this mood',
        'Practice gratitude'
      ]
    };

    if (dominantEmotion && emotionSpecificSuggestions[dominantEmotion]) {
      suggestions.push(...emotionSpecificSuggestions[dominantEmotion]);
    }

    return suggestions;
  }

  private async updateSessionInDatabase(sessionId: string, update: any): Promise<void> {
    try {
      await supabase
        .from('therapeutic_sessions')
        .update({
          emotions_data: update.emotions,
          insights_data: update.insights,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }

  private calculateEmotionalTrends(sessions: any[]): any[] {
    // Implémenter le calcul des tendances émotionnelles
    return sessions.map(session => ({
      date: session.start_time,
      emotions: session.emotions_data || {},
      dominant_emotion: session.insights_data?.primary_emotion || 'neutral',
      stability_score: Math.random() // Placeholder - calculer réellement
    }));
  }

  private generateTrendInsights(trends: any[]): any {
    // Implémenter l'analyse des tendances
    return {
      most_frequent_emotions: ['calm', 'happy'],
      improvement_areas: ['stress management'],
      stability_trend: 'improving' as const
    };
  }

  private getDefaultRecommendations(emotions: EmotionData[]): ApiResponse {
    return {
      success: true,
      data: {
        immediate_actions: [
          'Take three deep breaths',
          'Practice mindfulness for 2 minutes'
        ],
        long_term_strategies: [
          'Develop a regular meditation practice',
          'Keep an emotional journal'
        ],
        resource_recommendations: [
          {
            type: 'music',
            title: 'Calming Ambient Sounds',
            description: 'Relaxing music to help manage current emotions'
          }
        ]
      },
      timestamp: new Date()
    };
  }

  private async generateSessionSummary(session: TherapeuticSession): Promise<any> {
    return {
      sessionId: session.id,
      duration: session.endTime ? 
        Math.round((session.endTime.getTime() - session.startTime.getTime()) / 1000 / 60) : 0,
      emotionsAnalyzed: session.emotions.length,
      primaryEmotions: [...new Set(session.emotions.map(e => e.emotion))],
      outcome: session.outcome
    };
  }
}

export default new EmotionAnalysisService();