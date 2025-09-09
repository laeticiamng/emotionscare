
import { useState } from 'react';
import { ChatMessage, ChatConversation } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';

export const useCoachChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const sendMessage = async (content: string, sender: ChatMessage['sender'] = 'user') => {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);

    if (sender === 'user') {
      setIsTyping(true);
      setIsProcessing(true);
      
      try {
        // Call the production coach AI Edge Function
        const { data, error } = await supabase.functions.invoke('coach-ai', {
          body: { 
            message: content,
            conversationHistory: messages.slice(-10) // Send last 10 messages for context
          }
        });

        if (error) throw error;

        const response: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: data.response || 'Je suis là pour vous accompagner. Pouvez-vous me dire ce qui vous préoccupe ?',
          sender: 'coach',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, response]);
        
        // Save conversation to database if currentConversation exists
        if (currentConversation) {
          await supabase
            .from('chat_conversations')
            .update({
              messages: [...messages, message, response],
              updated_at: new Date().toISOString()
            })
            .eq('id', currentConversation.id);
        }
        
      } catch (error) {
        console.error('Error sending message to coach:', error);
        const errorResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: 'Je rencontre une difficulté technique. Pouvez-vous reformuler votre question ?',
          sender: 'coach',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errorResponse]);
      } finally {
        setIsTyping(false);
        setIsProcessing(false);
      }
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const startNewConversation = (title = 'Nouvelle conversation') => {
    const conversation: ChatConversation = {
      id: Date.now().toString(),
      title,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConversations(prev => [...prev, conversation]);
    setCurrentConversation(conversation);
    return conversation.id;
  };

  const setActiveConversation = (id: string) => {
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentConversation(conversation);
      setMessages(conversation.messages);
    }
  };

  return {
    messages,
    conversations,
    currentConversation,
    isTyping,
    isProcessing,
    sendMessage,
    clearMessages,
    startNewConversation,
    setActiveConversation
  };
};
