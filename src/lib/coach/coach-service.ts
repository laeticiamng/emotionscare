
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AIRecommendation, AIMessage } from '@/types/ai';
import { ChatResponseType } from '@/types/chat';
import { AI_MODEL_CONFIG } from '@/lib/ai/openai-config';

/**
 * Service d'interaction avec le coach IA
 */
export const getCoachResponse = async (
  message: string,
  userContext?: {
    recentEmotions?: string;
    currentScore?: number;
    lastEmotionDate?: string;
  }
): Promise<ChatResponseType> => {
  try {
    // Utilise l'Edge Function Supabase pour communiquer avec OpenAI
    const { data, error } = await supabase.functions.invoke('chat-with-ai', {
      body: {
        message,
        userContext,
        model: AI_MODEL_CONFIG.coach.model,
        temperature: AI_MODEL_CONFIG.coach.temperature,
        max_tokens: AI_MODEL_CONFIG.coach.max_tokens,
        module: 'coach'
      }
    });

    if (error) {
      console.error('Erreur API Coach:', error);
      toast({
        title: "Erreur de communication",
        description: "Impossible de contacter le service de coach IA",
        variant: "destructive"
      });
      throw new Error(error.message);
    }

    return {
      content: data.response,
      emotion: 'neutral',
      model: data.model,
    };
  } catch (error) {
    console.error('Erreur Coach IA:', error);
    return {
      content: "Je suis désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.",
      emotion: 'error'
    };
  }
};

/**
 * Générer une recommandation du coach basée sur l'état émotionnel
 */
export const generateCoachRecommendation = async (
  emotionalState: string,
  context?: string
): Promise<AIRecommendation> => {
  try {
    const prompt = `En tant que coach de bien-être, propose une recommandation courte et pratique pour quelqu'un qui se sent "${emotionalState}". ${context || ''} Sois concis (max 200 caractères) et directement utile.`;
    
    const { data, error } = await supabase.functions.invoke('chat-with-ai', {
      body: {
        message: prompt,
        model: AI_MODEL_CONFIG.coach.model,
        temperature: 0.3,
        max_tokens: 120,
        module: 'coach'
      }
    });

    if (error) throw new Error(error.message);

    return {
      id: crypto.randomUUID(),
      type: 'activity',
      title: 'Recommandation personnalisée',
      description: data.response,
      confidence: 0.85,
      reasoning: `Basé sur votre état émotionnel: ${emotionalState}`,
      emotion_context: emotionalState
    };
  } catch (error) {
    console.error('Erreur génération recommandation:', error);
    
    return {
      id: crypto.randomUUID(),
      type: 'activity',
      title: 'Prenez soin de vous',
      description: 'Prenez un moment pour respirer profondément et vous recentrer.',
      confidence: 0.5,
      reasoning: 'Recommandation générique suite à une erreur technique',
      emotion_context: emotionalState
    };
  }
};

/**
 * Analyser l'état émotionnel à partir d'un message
 */
export const analyzeEmotionalState = async (message: string): Promise<{
  primaryEmotion: string;
  secondaryEmotion?: string;
  intensity: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-emotion', {
      body: { text: message }
    });

    if (error) throw new Error(error.message);
    
    return data;
  } catch (error) {
    console.error('Erreur analyse émotionnelle:', error);
    return {
      primaryEmotion: 'indéterminé',
      intensity: 0.5,
      sentiment: 'neutral'
    };
  }
};

/**
 * Générer un message de réponse optimisé pour le support
 */
export const getPremiumSupportResponse = async (
  message: string,
  userContext?: any
): Promise<AIMessage> => {
  try {
    const { data, error } = await supabase.functions.invoke('chat-with-ai', {
      body: {
        message,
        userContext,
        model: 'gpt-4o',
        temperature: 0.4,
        max_tokens: 1000,
        module: 'premium-support'
      }
    });

    if (error) throw new Error(error.message);

    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: data.response,
      timestamp: new Date().toISOString(),
      emotions_detected: userContext?.detectedEmotion ? [userContext.detectedEmotion] : undefined,
      confidence: 0.95
    };
  } catch (error) {
    console.error('Erreur support premium:', error);
    return {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: "Je vous présente mes excuses, mais je rencontre des difficultés techniques. Un membre de notre équipe d'assistance premium va vous contacter sous peu.",
      timestamp: new Date().toISOString(),
      confidence: 0.5
    };
  }
};
