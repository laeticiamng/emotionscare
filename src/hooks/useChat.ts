// @ts-nocheck
import { useState, useCallback, useEffect } from 'react';
import { logger } from '@/lib/logger';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export const useChat = (conversationId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId || null);

  // Load existing messages from Supabase
  useEffect(() => {
    const loadMessages = async () => {
      if (!currentConversationId) return;

      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: messagesData } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('conversation_id', currentConversationId)
          .order('created_at', { ascending: true });

        if (messagesData && messagesData.length > 0) {
          setMessages(messagesData.map(m => ({
            id: m.id,
            content: m.content,
            role: m.role as 'user' | 'assistant',
            timestamp: new Date(m.created_at)
          })));
        }
      } catch (error) {
        logger.error('Error loading chat messages', error as Error, 'CHAT');
      }
    };

    loadMessages();
  }, [currentConversationId]);

  const sendMessage = useCallback(async (content: string) => {
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { user } } = await supabase.auth.getUser();

    // Create conversation if it doesn't exist
    let convId = currentConversationId;
    if (!convId && user) {
      const { data: newConv } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: content.substring(0, 50),
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (newConv) {
        convId = newConv.id;
        setCurrentConversationId(newConv.id);
      }
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Save user message to Supabase
      if (convId) {
        await supabase.from('chat_messages').insert({
          conversation_id: convId,
          content,
          role: 'user',
          created_at: new Date().toISOString()
        });
      }

      // Call AI chat function
      const { data: aiResponse, error } = await supabase.functions.invoke('chat-ai', {
        body: { message: content, conversationId: convId }
      });

      const assistantContent = aiResponse?.response || 'Merci pour votre message. Comment puis-je vous aider ?';

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        content: assistantContent,
        role: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message to Supabase
      if (convId) {
        await supabase.from('chat_messages').insert({
          conversation_id: convId,
          content: assistantContent,
          role: 'assistant',
          created_at: new Date().toISOString()
        });
      }
    } catch (error) {
      logger.error('Error in chat', error as Error, 'CHAT');
      // Fallback response
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}-fallback`,
        content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
        role: 'assistant',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
  }, []);

  return {
    messages,
    sendMessage,
    clearMessages,
    isLoading,
    conversationId: currentConversationId
  };
};
