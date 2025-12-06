// @ts-nocheck

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface HelpBotResponse {
  message: string;
  confidence: number;
  relatedArticles?: Array<{
    title: string;
    url: string;
    excerpt: string;
  }>;
}

export const useHelpBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (userMessage: string): Promise<HelpBotResponse | null> => {
    if (!userMessage.trim()) return null;

    try {
      setIsLoading(true);
      setError(null);

      // Add user message immediately
      const userChatMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userChatMessage]);

      // Call help bot edge function
      const { data, error } = await supabase.functions.invoke('help-bot-assistant', {
        body: { 
          message: userMessage,
          context: messages.slice(-5) // Send last 5 messages for context
        }
      });

      if (error) throw error;

      const response: HelpBotResponse = {
        message: data.message || 'Désolé, je n\'ai pas pu traiter votre demande.',
        confidence: data.confidence || 0.5,
        relatedArticles: data.relatedArticles || []
      };

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      return response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'envoi du message';
      setError(errorMessage);
      logger.error('Error sending message to help bot', err as Error, 'SYSTEM');
      
      // Fallback response for development
      const fallbackResponse: HelpBotResponse = {
        message: `Je comprends votre question sur "${userMessage}". En mode développement, je simule une réponse utile. Voulez-vous que je vous redirige vers une section spécifique de l'aide ?`,
        confidence: 0.8,
        relatedArticles: [
          {
            title: 'Guide de démarrage',
            url: '/help-center/getting-started',
            excerpt: 'Apprenez les bases de l\'utilisation de la plateforme'
          },
          {
            title: 'Scan d\'émotions',
            url: '/help-center/emotion-scan',
            excerpt: 'Comment utiliser le scanner d\'émotions efficacement'
          }
        ]
      };

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse.message,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      toast.error('Mode développement : réponse simulée');
      return fallbackResponse;

    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearConversation = useCallback(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date()
      }
    ]);
    setError(null);
  }, []);

  const searchFAQ = useCallback(async (query: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('search-faq', {
        body: { query }
      });

      if (error) throw error;

      return data.results || [];
    } catch (err) {
      logger.error('Error searching FAQ', err as Error, 'SYSTEM');
      return [];
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearConversation,
    searchFAQ
  };
};
