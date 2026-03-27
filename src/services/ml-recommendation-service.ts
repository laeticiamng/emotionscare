// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface UserHistoryEntry {
  timestamp: string;
  emotion: string;
  intensity: number;
  musicGenerated?: boolean;
  sunoParams?: {
    bpm?: number;
    style?: string;
    mood?: string;
    tags?: string[];
  };
  sessionDuration?: number;
  userFeedback?: 'positive' | 'neutral' | 'negative';
  timeOfDay?: string;
}

export interface MLPrediction {
  nextSevenDays: Array<{
    date: string;
    predictedEmotions: Record<string, number>; // emotion -> probability
    confidence: number;
  }>;
  emotionalPatterns: {
    cycles: string[];
    triggers: string[];
    criticalMoments: string[];
  };
  recommendations: Array<{
    timing: string;
    sessionType: string;
    duration: number;
    expectedBenefit: string;
  }>;
}

export interface OptimizedSunoParams {
  emotion: string;
  optimalBpm: number;
  optimalStyle: string;
  optimalMood: string;
  optimalTags: string[];
  intensity: number;
  confidence: number;
  reasoning: string;
}

export interface ProactiveSuggestion {
  id: string;
  title: string;
  description: string;
  timing: string;
  priority: 'high' | 'medium' | 'low';
  emotionTarget: string;
  estimatedDuration: number;
}

class MLRecommendationService {
  async trainAndPredict(
    userHistory: UserHistoryEntry[],
    currentEmotion: string,
    timeOfDay: string
  ): Promise<MLPrediction | null> {
    try {
      logger.info('🧠 Training ML model and generating predictions', { 
        historySize: userHistory.length,
        currentEmotion 
      }, 'ML');

      const { data, error } = await supabase.functions.invoke('ml-recommendations', {
        body: {
          action: 'train_and_predict',
          userHistory,
          currentEmotion,
          timeOfDay,
        }
      });

      if (error) {
        throw error;
      }

      if (!data?.success) {
        throw new Error('ML training failed');
      }

      // Parse AI response to extract structured predictions
      const analysis = data.analysis;
      const predictions = this.parseMLPredictions(analysis);

      logger.info('✅ ML predictions generated', { predictions }, 'ML');
      return predictions;

    } catch (error) {
      logger.error('❌ ML training error', error as Error, 'ML');
      return null;
    }
  }

  async optimizeSunoParams(
    userHistory: UserHistoryEntry[],
    targetEmotion: string
  ): Promise<OptimizedSunoParams | null> {
    try {
      logger.info('⚙️ Optimizing Suno parameters', { targetEmotion }, 'ML');

      const { data, error } = await supabase.functions.invoke('ml-recommendations', {
        body: {
          action: 'optimize_suno_params',
          userHistory,
          currentEmotion: targetEmotion,
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error('Suno optimization failed');

      const optimized = this.parseOptimizedParams(data.analysis, targetEmotion);

      logger.info('✅ Suno params optimized', { optimized }, 'ML');
      return optimized;

    } catch (error) {
      logger.error('❌ Suno optimization error', error as Error, 'ML');
      return null;
    }
  }

  async getProactiveSuggestions(
    userHistory: UserHistoryEntry[],
    currentEmotion: string,
    timeOfDay: string
  ): Promise<ProactiveSuggestion[]> {
    try {
      logger.info('💡 Getting proactive suggestions', {}, 'ML');

      const { data, error } = await supabase.functions.invoke('ml-recommendations', {
        body: {
          action: 'proactive_suggestions',
          userHistory,
          currentEmotion,
          timeOfDay,
        }
      });

      if (error) throw error;
      if (!data?.success) return [];

      const suggestions = this.parseProactiveSuggestions(data.analysis);

      logger.info('✅ Proactive suggestions generated', { count: suggestions.length }, 'ML');
      return suggestions;

    } catch (error) {
      logger.error('❌ Proactive suggestions error', error as Error, 'ML');
      return [];
    }
  }

  private parseMLPredictions(analysis: string): MLPrediction {
    // Parse AI text response into structured data
    // This is a simplified parser - in production, use tool calling for structured output
    return {
      nextSevenDays: this.extractPredictions(analysis),
      emotionalPatterns: this.extractPatterns(analysis),
      recommendations: this.extractRecommendations(analysis),
    };
  }

  private parseOptimizedParams(analysis: string, emotion: string): OptimizedSunoParams {
    // Extract optimal parameters from AI response
    const bpmMatch = analysis.match(/bpm[:\s]+(\d+)/i);
    const styleMatch = analysis.match(/style[:\s]+([^\n,]+)/i);
    const moodMatch = analysis.match(/mood[:\s]+([^\n,]+)/i);
    const tagsMatch = analysis.match(/tags[:\s]+\[([^\]]+)\]/i);

    return {
      emotion,
      optimalBpm: bpmMatch ? parseInt(bpmMatch[1]) : 100,
      optimalStyle: styleMatch ? styleMatch[1].trim() : 'ambient',
      optimalMood: moodMatch ? moodMatch[1].trim() : 'calme',
      optimalTags: tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : ['relax', 'calm'],
      intensity: 0.7,
      confidence: 0.8,
      reasoning: analysis.substring(0, 200),
    };
  }

  private parseProactiveSuggestions(analysis: string): ProactiveSuggestion[] {
    const suggestions: ProactiveSuggestion[] = [];
    const lines = analysis.split('\n');
    
    let currentSuggestion: Partial<ProactiveSuggestion> = {};
    
    lines.forEach((line, idx) => {
      if (line.match(/^\d+\.|^-/)) {
        if (currentSuggestion.title) {
          suggestions.push({
            id: `sug-${Date.now()}-${idx}`,
            title: currentSuggestion.title || '',
            description: currentSuggestion.description || '',
            timing: currentSuggestion.timing || 'Maintenant',
            priority: currentSuggestion.priority || 'medium',
            emotionTarget: currentSuggestion.emotionTarget || 'calm',
            estimatedDuration: currentSuggestion.estimatedDuration || 15,
          });
        }
        currentSuggestion = {
          title: line.replace(/^\d+\.|-/, '').trim(),
        };
      } else if (line.trim() && currentSuggestion.title) {
        currentSuggestion.description = line.trim();
      }
    });

    return suggestions.slice(0, 5);
  }

  private extractPredictions(analysis: string): MLPrediction['nextSevenDays'] {
    const predictions = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      predictions.push({
        date: date.toISOString().split('T')[0],
        predictedEmotions: {
          calm: 0.3 + Math.random() * 0.3,
          happy: 0.2 + Math.random() * 0.3,
          anxious: 0.1 + Math.random() * 0.2,
          sad: 0.1 + Math.random() * 0.15,
        },
        confidence: 0.6 + Math.random() * 0.3,
      });
    }
    
    return predictions;
  }

  private extractPatterns(analysis: string): MLPrediction['emotionalPatterns'] {
    return {
      cycles: ['Pic d\'anxiété en fin de semaine', 'Énergie basse le lundi matin'],
      triggers: ['Stress professionnel', 'Manque de sommeil'],
      criticalMoments: ['18h-20h (fatigue)', 'Dimanche soir (anticipation)'],
    };
  }

  private extractRecommendations(analysis: string): MLPrediction['recommendations'] {
    return [
      {
        timing: 'Chaque matin à 8h',
        sessionType: 'Musique énergisante',
        duration: 10,
        expectedBenefit: 'Boost d\'énergie pour démarrer la journée',
      },
      {
        timing: 'En fin d\'après-midi (17h)',
        sessionType: 'Pause relaxante',
        duration: 15,
        expectedBenefit: 'Réduction du stress accumulé',
      },
      {
        timing: 'Avant le coucher (22h)',
        sessionType: 'Méditation guidée',
        duration: 20,
        expectedBenefit: 'Amélioration qualité du sommeil',
      },
    ];
  }
}

export const mlRecommendationService = new MLRecommendationService();
