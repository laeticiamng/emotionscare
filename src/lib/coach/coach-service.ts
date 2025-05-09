
import { supabase } from '@/integrations/supabase/client';
import { AI_MODEL_CONFIG } from './types';
import { UserContext } from '@/types/chat';

/**
 * Gets coach recommendations for a specific user
 * @param userId The user's ID
 * @returns Array of recommendation strings
 */
export async function getCoachRecommendations(userId: string): Promise<string[]> {
  try {
    // Try to fetch recent emotional data for context
    const { data: emotions } = await supabase
      .from('emotions')
      .select('emotion, score, date')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(5);
    
    const recentEmotions = emotions?.map(e => e.emotion).join(', ') || '';
    const avgScore = emotions?.length ? 
      Math.round(emotions.reduce((acc, e) => acc + (e.score || 50), 0) / emotions.length) : 
      50;
      
    // Create user context object
    const userContext: UserContext = {
      recentEmotions,
      currentScore: avgScore,
      lastEmotionDate: emotions?.[0]?.date
    };
    
    // Using the AI model parameters from the config
    const modelConfig = AI_MODEL_CONFIG.coach;
    
    // Call the AI function with the coach prompt
    const { data, error } = await supabase.functions.invoke('chat-with-ai', {
      body: {
        message: "En tenant compte de mon état émotionnel récent, propose-moi 4 recommandations courtes et pratiques pour améliorer mon bien-être aujourd'hui. Format: liste à puces simple.",
        userContext,
        model: modelConfig.model,
        temperature: modelConfig.temperature,
        max_tokens: modelConfig.max_tokens,
        top_p: modelConfig.top_p,
        stream: modelConfig.stream
      }
    });
    
    if (error) throw error;
    
    // Parse the response to extract recommendations as an array
    const response = data.response;
    const recommendations = response
      .split('\n')
      .filter((line: string) => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .map((line: string) => line.trim().replace(/^[•-]\s*/, ''));
    
    // Return the parsed recommendations or fallback to default
    return recommendations.length > 0 ? recommendations : [
      "Prendre une pause de 5 minutes toutes les heures pour vous étirer",
      "Pratiquer la respiration profonde pendant 2 minutes en cas de stress",
      "Boire suffisamment d'eau tout au long de la journée",
      "Faire une courte promenade de 10 minutes après le déjeuner"
    ];
    
  } catch (error) {
    console.error('Error getting coach recommendations:', error);
    return [
      "Prendre une pause de 5 minutes toutes les heures pour vous étirer",
      "Pratiquer la respiration profonde pendant 2 minutes en cas de stress",
      "Boire suffisamment d'eau tout au long de la journée",
      "Faire une courte promenade de 10 minutes après le déjeuner"
    ];
  }
}

export * from './types';
