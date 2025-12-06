import OpenAI from 'openai';
import { ChatCompletion, ChatCompletionChunk } from 'openai/resources/chat/completions';
import { Stream } from 'openai/streaming';
import { logger } from '@/lib/logger';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Vérifier si la clé API est disponible
const isApiKeyAvailable = () => {
  return !!OPENAI_API_KEY;
};

// Créer une instance OpenAI avec la clé API
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Allowing browser usage with the understanding of security implications
});

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
  if (!isApiKeyAvailable()) {
    logger.error('OpenAI API key not available', new Error('API key missing'), 'API');
    return null;
  }

  try {
    const validMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const completion = await openai.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages: validMessages as any,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
    });

    const responseMessage = completion.choices[0].message;

    return {
      message: {
        role: 'assistant',
        content: responseMessage.content || ''
      },
      usage: completion.usage ? {
        promptTokens: completion.usage.prompt_tokens,
        completionTokens: completion.usage.completion_tokens,
        totalTokens: completion.usage.total_tokens
      } : undefined
    };
  } catch (error) {
    logger.error('Error generating chat response', error as Error, 'API');
    return null;
  }
}

/**
 * Fonction pour générer une réponse en streaming
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
  if (!isApiKeyAvailable()) {
    logger.error('OpenAI API key not available', new Error('API key missing'), 'API');
    return false;
  }

  try {
    const validMessages = messages.map(msg => ({
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content
    }));

    const stream = await openai.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages: validMessages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
      stream: true
    });

    let accumulatedContent = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        accumulatedContent += content;
        onChunk(content);
      }
    }

    return true;
  } catch (error) {
    logger.error('Error generating streaming chat response', error as Error, 'API');
    return false;
  }
}

export default {
  generateChatResponse,
  generateStreamingChatResponse
};
