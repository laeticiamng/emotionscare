/**
 * OpenAI Client pour EmotionsCare
 * Corrigé: Utilise Edge Function openai-chat au lieu d'appels API directs
 * Supprime dangerouslyAllowBrowser et l'exposition de clé API
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Types
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  message: ChatMessage;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Fonction pour générer une réponse à partir d'une liste de messages
 * Utilise Edge Function sécurisée au lieu de l'API directe
 * @param messages Liste des messages de la conversation
 * @param options Options supplémentaires pour l'API
 * @returns La réponse générée par l'API
 */
export async function generateChatResponse(
  messages: ChatMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<ChatResponse | null> {
  try {
    const { data, error } = await supabase.functions.invoke('openai-chat', {
      body: {
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content,
        })),
        model: options.model || 'gpt-3.5-turbo',
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 1000,
      },
    });

    if (error) throw error;

    const content = data?.content || data?.message?.content || '';
    
    return {
      message: {
        role: 'assistant',
        content,
      },
      usage: data?.usage ? {
        promptTokens: data.usage.prompt_tokens || 0,
        completionTokens: data.usage.completion_tokens || 0,
        totalTokens: data.usage.total_tokens || 0,
      } : undefined,
    };
  } catch (error) {
    logger.error('Error generating chat response via Edge Function', error as Error, 'API');
    // Fallback: réponse locale générique
    return generateLocalResponse(messages);
  }
}

/**
 * Fonction pour générer une réponse en streaming
 * Note: Le streaming via Edge Function nécessite une implémentation SSE
 * Pour l'instant, on simule le streaming avec des chunks
 * @param messages Liste des messages de la conversation
 * @param onChunk Fonction callback appelée à chaque chunk de la réponse
 * @param options Options supplémentaires pour l'API
 */
export async function generateStreamingChatResponse(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<boolean> {
  try {
    // Appel non-streaming via Edge Function
    const response = await generateChatResponse(messages, options);
    
    if (!response) return false;

    // Simuler le streaming en envoyant le texte par morceaux
    const content = response.message.content;
    const words = content.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      onChunk(chunk);
      // Petit délai pour simuler le streaming
      await new Promise(resolve => setTimeout(resolve, 30));
    }

    return true;
  } catch (error) {
    logger.error('Error generating streaming chat response', error as Error, 'API');
    return false;
  }
}

/**
 * Génère une réponse locale de fallback
 */
function generateLocalResponse(messages: ChatMessage[]): ChatResponse {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  const userContent = lastUserMessage?.content.toLowerCase() || '';

  // Réponses contextuelles simples
  let responseContent = "Je suis là pour vous aider. Comment puis-je vous accompagner?";

  if (userContent.includes('bonjour') || userContent.includes('salut')) {
    responseContent = "Bonjour! Je suis votre assistant EmotionsCare. Comment vous sentez-vous aujourd'hui?";
  } else if (userContent.includes('merci')) {
    responseContent = "Je vous en prie! N'hésitez pas si vous avez d'autres questions.";
  } else if (userContent.includes('aide') || userContent.includes('help')) {
    responseContent = "Je suis là pour vous aider. Vous pouvez me poser des questions sur votre bien-être, demander des conseils de méditation, ou simplement discuter.";
  } else if (userContent.includes('triste') || userContent.includes('mal')) {
    responseContent = "Je suis désolé d'entendre ça. Parler de ce que vous ressentez est un premier pas important. Voulez-vous essayer une activité de bien-être?";
  } else if (userContent.includes('stress') || userContent.includes('anxie')) {
    responseContent = "Le stress peut être difficile à gérer. Je vous suggère d'essayer une séance de respiration guidée. Souhaitez-vous en commencer une?";
  }

  return {
    message: {
      role: 'assistant',
      content: responseContent,
    },
  };
}

/**
 * Analyse de texte pour détecter l'intention
 */
export async function analyzeIntent(text: string): Promise<{
  intent: string;
  confidence: number;
  entities: string[];
}> {
  try {
    const { data, error } = await supabase.functions.invoke('analyze-text', {
      body: { text, analysisType: 'intent' },
    });

    if (error) throw error;

    return {
      intent: data?.intent || 'general',
      confidence: data?.confidence || 0.5,
      entities: data?.entities || [],
    };
  } catch (error) {
    logger.warn('Intent analysis failed, using default', error as Error, 'API');
    return { intent: 'general', confidence: 0.5, entities: [] };
  }
}

/**
 * Génération d'embeddings pour la recherche sémantique
 */
export async function generateEmbeddings(text: string): Promise<number[] | null> {
  try {
    const { data, error } = await supabase.functions.invoke('openai-embeddings', {
      body: { text },
    });

    if (error) throw error;

    return data?.embedding || null;
  } catch (error) {
    logger.error('Embeddings generation failed', error as Error, 'API');
    return null;
  }
}

export default {
  generateChatResponse,
  generateStreamingChatResponse,
  analyzeIntent,
  generateEmbeddings,
};
