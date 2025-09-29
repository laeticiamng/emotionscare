
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatConversation, ChatMessage } from '@/types/chat';

// Mock data for conversations
const mockConversations: ChatConversation[] = [
  {
    id: uuidv4(),
    title: "Première conversation",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastMessage: "Bonjour, comment puis-je vous aider ?",
    user_id: "user-123", // legacy field
    created_at: new Date().toISOString(), // legacy field
    updated_at: new Date().toISOString(), // legacy field
    last_message: "Bonjour, comment puis-je vous aider ?", // legacy field
    messages: [] // legacy field
  },
  {
    id: uuidv4(),
    title: "Deuxième conversation",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    lastMessage: "Merci pour votre aide !",
    user_id: "user-123", // legacy field
    created_at: new Date(Date.now() - 86400000).toISOString(), // legacy field
    updated_at: new Date(Date.now() - 86400000).toISOString(), // legacy field
    last_message: "Merci pour votre aide !", // legacy field
    messages: [] // legacy field
  }
];

// Store messages for each conversation
const mockConversationMessages: Record<string, ChatMessage[]> = {};

export const useConversations = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load conversations (would typically fetch from an API)
  const loadConversations = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setConversations(mockConversations);
      if (mockConversations.length > 0 && !currentConversation) {
        await selectConversation(mockConversations[0].id);
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to load conversations');
      setError(err);
    } finally {
      setLoading(false);
    }
    return conversations;
  };

  // Select a conversation and load its messages
  const selectConversation = async (conversationId: string) => {
    setLoading(true);
    try {
      const conversation = conversations.find(c => c.id === conversationId) || null;
      setCurrentConversation(conversation);
      
      if (conversation) {
        // Simulate loading messages for this conversation
        await new Promise(resolve => setTimeout(resolve, 300));
        const conversationMessages = mockConversationMessages[conversationId] || [];
        setMessages(conversationMessages);
      } else {
        setMessages([]);
      }
    } catch (e) {
      const err = e instanceof Error ? e : new Error('Failed to select conversation');
      setError(err);
    } finally {
      setLoading(false);
    }
    return messages;
  };

  // Create a new conversation
  const createConversation = async (title: string = "Nouvelle conversation") => {
    const newConversation: ChatConversation = {
      id: uuidv4(),
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessage: "",
      user_id: "user-123", // legacy field
      created_at: new Date().toISOString(), // legacy field
      updated_at: new Date().toISOString(), // legacy field
      last_message: "", // legacy field
      messages: [] // legacy field
    };
    
    mockConversations.unshift(newConversation);
    setConversations([...mockConversations]);
    
    await selectConversation(newConversation.id);
    return newConversation;
  };

  // Initialize on first render
  useEffect(() => {
    loadConversations();
  }, []);

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    loadConversations,
    selectConversation,
    createConversation,
    setMessages
  };
};

export default useConversations;
