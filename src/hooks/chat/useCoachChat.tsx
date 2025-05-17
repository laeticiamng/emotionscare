
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from '@/types/chat';
import { useOpenAI } from '@/hooks/api';
import { useToast } from '@/hooks/use-toast';

// Hook pour gérer les conversations avec le coach
export function useCoachChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { generateText, chatCompletion } = useOpenAI();
  const { toast } = useToast();

  // Ajouter un message utilisateur
  const addUserMessage = useCallback((text: string, conversationId: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text,
      content: text,
      sender: 'user',
      role: 'user',
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  // Ajouter un message assistant
  const addAssistantMessage = useCallback((text: string, conversationId: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text,
      content: text,
      sender: 'assistant',
      role: 'assistant',
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  // Ajouter un message système
  const addSystemMessage = useCallback((text: string, conversationId: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text,
      content: text,
      sender: 'system',
      role: 'system',
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    };
    
    setMessages((prev) => [...prev, newMessage]);
    return newMessage;
  }, []);

  // Envoyer un message et obtenir une réponse du coach
  const sendMessage = useCallback(async (text: string, conversationId: string) => {
    if (!text.trim()) return null;
    
    const userMessage = addUserMessage(text, conversationId);
    setIsLoading(true);
    
    try {
      // Ajouter un délai de "frappe" pour plus de naturel
      const response = await chatCompletion(
        [...messages, userMessage]
      );
      
      if (response) {
        const assistantMessage = addAssistantMessage(response, conversationId);
        return assistantMessage;
      } else {
        toast({
          title: "Erreur de communication",
          description: "Le coach n'a pas pu répondre. Veuillez réessayer.",
          variant: "destructive"
        });
        return null;
      }
    } catch (error) {
      console.error("Error getting coach response:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la communication avec le coach.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [messages, addUserMessage, addAssistantMessage, chatCompletion, toast]);

  // Effacer tous les messages
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  // Supprimer un message spécifique
  const removeMessage = useCallback((messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  }, []);

  return {
    messages,
    isLoading,
    setIsLoading,
    addUserMessage,
    addAssistantMessage,
    addSystemMessage,
    sendMessage,
    clearMessages,
    removeMessage
  };
}

export default useCoachChat;
