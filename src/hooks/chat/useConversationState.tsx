
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatConversation, ChatMessage } from '@/types/chat';

export const useConversationState = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Crée une nouvelle conversation
  const createConversation = (title: string = 'Nouvelle conversation') => {
    const newConversation: ChatConversation = {
      id: uuidv4(),
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_message: "",
      user_id: "user-123", // legacy field
      messages: [] // Add empty messages array
    };

    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversationId(newConversation.id);
    setMessages([]);

    return newConversation;
  };

  // Met à jour le titre d'une conversation
  const updateConversationTitle = (id: string, title: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === id 
          ? { 
              ...conv, 
              title, 
              updatedAt: new Date().toISOString(),
              updated_at: new Date().toISOString() // legacy field
            }
          : conv
      )
    );
  };

  // Supprime une conversation
  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== id));
    
    if (currentConversationId === id) {
      const remainingConversations = conversations.filter(conv => conv.id !== id);
      if (remainingConversations.length > 0) {
        setCurrentConversationId(remainingConversations[0].id);
        // Charger les messages de la première conversation restante
      } else {
        setCurrentConversationId(null);
        setMessages([]);
      }
    }
  };

  // Ajoute un message à la conversation courante
  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
    
    // Met à jour le dernier message de la conversation
    if (currentConversationId) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === currentConversationId 
            ? { 
                ...conv, 
                lastMessage: message.content || message.text || "",
                last_message: message.content || message.text || "",
                updatedAt: new Date().toISOString(),
                updated_at: new Date().toISOString()
              } 
            : conv
        )
      );
    }
  };

  // Sélectionne une conversation et charge ses messages
  const selectConversation = async (id: string) => {
    setIsLoading(true);
    setCurrentConversationId(id);
    
    try {
      // Simuler le chargement des messages
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Dans une vraie application, les messages seraient chargés depuis une API
      // Pour ce mock, on utilise un tableau vide
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Au montage, crée une conversation par défaut si aucune n'existe
  useEffect(() => {
    if (conversations.length === 0) {
      createConversation();
    }
  }, []);

  return {
    conversations,
    currentConversationId,
    messages,
    isLoading,
    createConversation,
    updateConversationTitle,
    deleteConversation,
    addMessage,
    selectConversation,
    setCurrentConversationId,
    setMessages
  };
};

export default useConversationState;
