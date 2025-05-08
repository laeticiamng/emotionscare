
import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';

/**
 * Hook spécialisé pour gérer les messages du chat avec le coach
 */
export function useCoachMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  // Ajouter un nouveau message à la conversation
  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  }, []);
  
  // Remplacer tous les messages (utile lors du chargement d'une conversation existante)
  const resetMessages = useCallback(() => {
    setMessages([]);
  }, []);
  
  // Ajouter un message du système (non visible par l'utilisateur)
  const addSystemMessage = useCallback((text: string) => {
    const systemMessage: ChatMessage = {
      id: `system-${Date.now()}`,
      text,
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, systemMessage]);
  }, []);
  
  // Supprimer le dernier message (utile pour annuler une action)
  const removeLastMessage = useCallback(() => {
    setMessages(prev => prev.slice(0, -1));
  }, []);
  
  return {
    messages,
    setMessages,
    addMessage,
    resetMessages,
    addSystemMessage,
    removeLastMessage
  };
}
