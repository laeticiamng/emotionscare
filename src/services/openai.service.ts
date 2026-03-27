// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import type { ApiResponse } from './types';
import { logger } from '@/lib/logger';

class OpenAIService {
  private async callEdgeFunction(functionName: string, payload: any): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });

      if (error) {
        logger.error(`OpenAI ${functionName} error`, error as Error, 'API');
        return {
          success: false,
          error: error.message,
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data,
        timestamp: new Date()
      };
    } catch (error: any) {
      logger.error(`OpenAI ${functionName} error`, error as Error, 'API');
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  async generateCoachingResponse(
    messages: Array<{ role: string; content: string }>,
    context?: {
      emotionalState?: string;
      userGoals?: string[];
      sessionHistory?: any[];
    }
  ): Promise<ApiResponse<{ response: string; suggestions?: string[] }>> {
    const systemPrompt = `Vous êtes un coach en intelligence émotionnelle bienveillant et professionnel. 
    Votre rôle est d'aider les utilisateurs à comprendre et gérer leurs émotions de manière constructive.
    
    Contexte émotionnel: ${context?.emotionalState || 'Non spécifié'}
    Objectifs utilisateur: ${context?.userGoals?.join(', ') || 'Non spécifiés'}
    
    Répondez avec empathie, donnez des conseils pratiques et encouragez l'utilisateur.`;

    return this.callEdgeFunction('openai-chat', {
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ]
    });
  }

  async analyzeJournalEntry(
    entry: string,
    previousAnalyses?: any[]
  ): Promise<ApiResponse<{ 
    emotions: string[]; 
    themes: string[]; 
    insights: string;
    recommendations: string[];
  }>> {
    const prompt = `Analysez cette entrée de journal émotionnel et extrayez:
1. Les émotions principales
2. Les thèmes récurrents
3. Des insights psychologiques
4. Des recommandations personnalisées

Entrée: "${entry}"

Répondez au format JSON avec les clés: emotions, themes, insights, recommendations`;

    return this.callEdgeFunction('openai-chat', {
      messages: [
        { role: 'system', content: 'Vous êtes un psychologue spécialisé en analyse émotionnelle.' },
        { role: 'user', content: prompt }
      ]
    });
  }

  async generatePersonalizedContent(
    type: 'affirmation' | 'meditation' | 'exercise',
    userProfile: {
      name?: string;
      preferences?: string[];
      currentMood?: string;
      goals?: string[];
    }
  ): Promise<ApiResponse<{ content: string; duration?: number }>> {
    const prompts = {
      affirmation: `Générez une affirmation personnalisée inspirante pour ${userProfile.name || 'l\'utilisateur'}, 
      en tenant compte de leur humeur (${userProfile.currentMood}) et de leurs objectifs (${userProfile.goals?.join(', ')}).`,
      
      meditation: `Créez un script de méditation guidée de 5-10 minutes pour ${userProfile.name || 'l\'utilisateur'}, 
      adapté à leur état émotionnel actuel (${userProfile.currentMood}) et leurs préférences (${userProfile.preferences?.join(', ')}).`,
      
      exercise: `Proposez un exercice pratique de gestion émotionnelle pour ${userProfile.name || 'l\'utilisateur'}, 
      basé sur leur humeur (${userProfile.currentMood}) et leurs objectifs (${userProfile.goals?.join(', ')}).`
    };

    return this.callEdgeFunction('openai-chat', {
      messages: [
        { 
          role: 'system', 
          content: 'Vous êtes un thérapeute spécialisé en bien-être émotionnel et personnalisation de contenu thérapeutique.' 
        },
        { role: 'user', content: prompts[type] }
      ]
    });
  }

  async moderateContent(content: string): Promise<ApiResponse<{ 
    flagged: boolean; 
    categories: Record<string, boolean>;
    confidence: number;
  }>> {
    return this.callEdgeFunction('openai-moderate', {
      input: content
    });
  }

  async transcribeAudio(audioFile: File): Promise<ApiResponse<{ 
    text: string; 
    language: string;
    confidence: number;
  }>> {
    const formData = new FormData();
    formData.append('audio', audioFile);

    try {
      const { data, error } = await supabase.functions.invoke('openai-transcribe', {
        body: formData
      });

      if (error) {
        return {
          success: false,
          error: error.message,
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data,
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
}

export default new OpenAIService();