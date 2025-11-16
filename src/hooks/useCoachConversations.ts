import { useState, useCallback, useEffect } from 'react';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  emotion?: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
  emoji?: string;
  emotion?: string;
}

export interface UseCoachConversationsReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  error: Error | null;
  createConversation: (title: string) => Promise<string>;
  updateConversationTitle: (id: string, title: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  loadConversation: (id: string) => Promise<void>;
  addMessage: (conversationId: string, message: ConversationMessage) => Promise<void>;
  loadConversations: () => Promise<void>;
  clearCurrentConversation: () => void;
}

const STORAGE_KEY = 'coach:conversations:v1';

/**
 * Hook pour gérer les conversations du coach
 */
export const useCoachConversations = (): UseCoachConversationsReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load conversations from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setConversations(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load conversations from storage:', err);
      }
    };

    loadFromStorage();
  }, []);

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (err) {
      console.error('Failed to save conversations to storage:', err);
    }
  }, [conversations]);

  const createConversation = useCallback(
    async (title: string): Promise<string> => {
      setIsLoading(true);
      setError(null);

      try {
        const newConversation: Conversation = {
          id: `conv_${Date.now()}`,
          title,
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setConversations((prev) => [newConversation, ...prev]);
        return newConversation.id;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create conversation');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateConversationTitle = useCallback(
    async (id: string, title: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === id ? { ...conv, title, updatedAt: new Date().toISOString() } : conv
          )
        );

        if (currentConversation?.id === id) {
          setCurrentConversation((prev) =>
            prev ? { ...prev, title } : null
          );
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to update conversation');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [currentConversation?.id]
  );

  const deleteConversation = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        setConversations((prev) => prev.filter((conv) => conv.id !== id));

        if (currentConversation?.id === id) {
          setCurrentConversation(null);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to delete conversation');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [currentConversation?.id]
  );

  const loadConversation = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const conversation = conversations.find((c) => c.id === id);

        if (!conversation) {
          throw new Error('Conversation not found');
        }

        setCurrentConversation(conversation);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load conversation');
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [conversations]
  );

  const addMessage = useCallback(
    async (conversationId: string, message: ConversationMessage): Promise<void> => {
      setError(null);

      try {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: new Date().toISOString(),
                }
              : conv
          )
        );

        if (currentConversation?.id === conversationId) {
          setCurrentConversation((prev) =>
            prev
              ? {
                  ...prev,
                  messages: [...prev.messages, message],
                  updatedAt: new Date().toISOString(),
                }
              : null
          );
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to add message');
        setError(error);
        throw error;
      }
    },
    [currentConversation?.id]
  );

  const loadConversations = useCallback(async (): Promise<void> => {
    // Conversations are already loaded from localStorage on mount
    // This is a placeholder for future API integration
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Fetch conversations from API
      // const response = await fetchConversations();
      // setConversations(response);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load conversations');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCurrentConversation = useCallback(() => {
    setCurrentConversation(null);
  }, []);

  return {
    conversations,
    currentConversation,
    isLoading,
    error,
    createConversation,
    updateConversationTitle,
    deleteConversation,
    loadConversation,
    addMessage,
    loadConversations,
    clearCurrentConversation,
  };
};
