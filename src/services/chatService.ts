
import { ChatResponse } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AI_MODEL_CONFIG } from '@/lib/ai/openai-config';

/**
 * Récupère une réponse de chat IA en utilisant l'Edge Function Supabase
 * @param message Le message de l'utilisateur
 * @returns Promesse avec la réponse du chat
 */
export const getChatResponse = async (message: string): Promise<ChatResponse> => {
  try {
    // Appel à l'Edge Function chat-with-ai
    const { data, error } = await supabase.functions.invoke('chat-with-ai', {
      body: {
        message,
        model: AI_MODEL_CONFIG.chat.model,
        temperature: AI_MODEL_CONFIG.chat.temperature,
        max_tokens: AI_MODEL_CONFIG.chat.max_tokens,
        top_p: AI_MODEL_CONFIG.chat.top_p,
        module: 'chat'
      }
    });

    if (error) {
      console.error('Erreur API de chat:', error);
      toast({
        title: "Erreur de communication",
        description: "Impossible de contacter le service de chat IA",
        variant: "destructive"
      });
      
      throw new Error(error.message);
    }
    
    // Formatage de la réponse
    return {
      content: data.response,
      emotion: detectEmotion(data.response),
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erreur dans getChatResponse:', error);
    return {
      content: "Je suis désolé, une erreur s'est produite. Veuillez réessayer plus tard.",
      emotion: 'error',
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Récupère une réponse de support premium via l'Edge Function
 * @param message Question de l'utilisateur
 */
export const getSupportResponse = async (message: string): Promise<ChatResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('chat-with-ai', {
      body: {
        message,
        model: AI_MODEL_CONFIG['premium-support'].model,
        temperature: AI_MODEL_CONFIG['premium-support'].temperature,
        max_tokens: AI_MODEL_CONFIG['premium-support'].max_tokens,
        top_p: AI_MODEL_CONFIG['premium-support'].top_p,
        module: 'premium-support'
      }
    });

    if (error) {
      throw error;
    }

    return {
      content: data.response,
      emotion: detectEmotion(data.response),
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erreur dans getSupportResponse:', error);
    return {
      content: "Je suis désolé, le service de support est momentanément indisponible.",
      emotion: 'error',
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Fonction simple pour détecter l'émotion à partir du texte
 * Note: Cette fonction est basique et pourrait être améliorée avec une analyse plus sophistiquée
 */
function detectEmotion(text: string): string {
  const lowercaseText = text.toLowerCase();
  
  if (lowercaseText.includes('désolé') || lowercaseText.includes('triste') || 
      lowercaseText.includes('malheureusement')) {
    return 'sad';
  } else if (lowercaseText.includes('super') || lowercaseText.includes('génial') || 
             lowercaseText.includes('excellent') || lowercaseText.includes('heureux')) {
    return 'happy';
  } else if (lowercaseText.includes('inquiet') || lowercaseText.includes('stress') || 
             lowercaseText.includes('anxieux')) {
    return 'worried';
  } else {
    return 'neutral';
  }
}
