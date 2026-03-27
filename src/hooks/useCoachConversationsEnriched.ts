// @ts-nocheck
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  emotion?: string;
  sentiment?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
  emoji?: string;
  emotion?: string;
  userId?: string;
  summary?: string;
  messageCount?: number;
}

export interface UseCoachConversationsReturn {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isLoading: boolean;
  isSyncing: boolean;
  error: Error | null;
  createConversation: (title: string) => Promise<string>;
  updateConversationTitle: (id: string, title: string) => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  loadConversation: (id: string) => Promise<void>;
  addMessage: (conversationId: string, message: ConversationMessage) => Promise<void>;
  loadConversations: () => Promise<void>;
  clearCurrentConversation: () => void;
  syncWithServer: () => Promise<void>;
  exportConversation: (id: string) => Promise<string>;
}

const STORAGE_KEY = 'coach:conversations:v2';
const SYNC_INTERVAL = 60000; // 1 minute

export const useCoachConversationsEnriched = (): UseCoachConversationsReturn => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  // Load from localStorage as fallback
  const loadFromStorage = useCallback((): Conversation[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      logger.error('Failed to load from storage', err, 'COACH');
      return [];
    }
  }, []);

  // Save to localStorage
  const saveToStorage = useCallback((convs: Conversation[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
    } catch (err) {
      logger.error('Failed to save to storage', err, 'COACH');
    }
  }, []);

  // Load conversations from Supabase
  const loadConversations = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      if (!userId) {
        // Fallback to localStorage if not authenticated
        const localConvs = loadFromStorage();
        setConversations(localConvs);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const convs: Conversation[] = data.map(row => ({
          id: row.id,
          title: row.title || 'Conversation',
          messages: row.messages || [],
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          emoji: row.emoji,
          emotion: row.emotion,
          userId: row.user_id,
          summary: row.summary,
          messageCount: row.messages?.length || 0
        }));
        
        setConversations(convs);
        saveToStorage(convs);
        logger.info('Conversations loaded from Supabase', { count: convs.length }, 'COACH');
      } else {
        // No server data, use localStorage
        const localConvs = loadFromStorage();
        setConversations(localConvs);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load conversations');
      setError(error);
      logger.error('Load conversations failed', err, 'COACH');
      
      // Fallback to localStorage
      const localConvs = loadFromStorage();
      setConversations(localConvs);
    } finally {
      setIsLoading(false);
    }
  }, [userId, loadFromStorage, saveToStorage]);

  // Sync with server
  const syncWithServer = useCallback(async (): Promise<void> => {
    if (!userId || isSyncing) return;

    setIsSyncing(true);
    try {
      // Get local conversations
      const localConvs = loadFromStorage();
      
      for (const conv of localConvs) {
        const { error: upsertError } = await supabase
          .from('chat_conversations')
          .upsert({
            id: conv.id,
            user_id: userId,
            title: conv.title,
            messages: conv.messages,
            emoji: conv.emoji,
            emotion: conv.emotion,
            summary: conv.summary,
            updated_at: conv.updatedAt
          });

        if (upsertError) {
          logger.warn('Failed to sync conversation', { id: conv.id, error: upsertError }, 'COACH');
        }
      }

      logger.info('Conversations synced with server', { count: localConvs.length }, 'COACH');
    } catch (err) {
      logger.error('Sync failed', err, 'COACH');
    } finally {
      setIsSyncing(false);
    }
  }, [userId, isSyncing, loadFromStorage]);

  // Auto-sync periodically
  useEffect(() => {
    if (userId) {
      loadConversations();
      const interval = setInterval(syncWithServer, SYNC_INTERVAL);
      return () => clearInterval(interval);
    }
  }, [userId, loadConversations, syncWithServer]);

  const createConversation = useCallback(async (title: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        title,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: userId || undefined,
        messageCount: 0
      };

      // Save to Supabase if authenticated
      if (userId) {
        const { data, error: insertError } = await supabase
          .from('chat_conversations')
          .insert({
            id: newConversation.id,
            user_id: userId,
            title: newConversation.title,
            messages: [],
            created_at: newConversation.createdAt,
            updated_at: newConversation.updatedAt
          })
          .select()
          .single();

        if (insertError) {
          logger.warn('Failed to save to server, using local storage', { error: insertError }, 'COACH');
        } else if (data) {
          newConversation.id = data.id;
        }
      }

      const newConvs = [newConversation, ...conversations];
      setConversations(newConvs);
      saveToStorage(newConvs);
      setCurrentConversation(newConversation);

      logger.info('Conversation created', { id: newConversation.id }, 'COACH');
      return newConversation.id;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create conversation');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [userId, conversations, saveToStorage]);

  const addMessage = useCallback(async (conversationId: string, message: ConversationMessage): Promise<void> => {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) {
      throw new Error('Conversation not found');
    }

    const updatedMessages = [...conv.messages, message];
    const updatedConv: Conversation = {
      ...conv,
      messages: updatedMessages,
      updatedAt: new Date().toISOString(),
      messageCount: updatedMessages.length,
      emotion: message.emotion || conv.emotion
    };

    // Update state
    const newConvs = conversations.map(c => c.id === conversationId ? updatedConv : c);
    setConversations(newConvs);
    saveToStorage(newConvs);
    
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(updatedConv);
    }

    // Sync to server
    if (userId) {
      try {
        await supabase
          .from('chat_conversations')
          .update({
            messages: updatedMessages,
            updated_at: updatedConv.updatedAt,
            emotion: updatedConv.emotion
          })
          .eq('id', conversationId);
      } catch (err) {
        logger.warn('Failed to sync message to server', { error: err }, 'COACH');
      }
    }
  }, [conversations, currentConversation, userId, saveToStorage]);

  const updateConversationTitle = useCallback(async (id: string, title: string): Promise<void> => {
    const newConvs = conversations.map(c => 
      c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c
    );
    setConversations(newConvs);
    saveToStorage(newConvs);

    if (userId) {
      try {
        await supabase
          .from('chat_conversations')
          .update({ title, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (err) {
        logger.warn('Failed to update title on server', { error: err }, 'COACH');
      }
    }
  }, [conversations, userId, saveToStorage]);

  const deleteConversation = useCallback(async (id: string): Promise<void> => {
    const newConvs = conversations.filter(c => c.id !== id);
    setConversations(newConvs);
    saveToStorage(newConvs);

    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }

    if (userId) {
      try {
        await supabase
          .from('chat_conversations')
          .delete()
          .eq('id', id);
      } catch (err) {
        logger.warn('Failed to delete from server', { error: err }, 'COACH');
      }
    }

    logger.info('Conversation deleted', { id }, 'COACH');
  }, [conversations, currentConversation, userId, saveToStorage]);

  const loadConversation = useCallback(async (id: string): Promise<void> => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setCurrentConversation(conv);
    }
  }, [conversations]);

  const clearCurrentConversation = useCallback(() => {
    setCurrentConversation(null);
  }, []);

  const exportConversation = useCallback(async (id: string): Promise<string> => {
    const conv = conversations.find(c => c.id === id);
    if (!conv) throw new Error('Conversation not found');

    const exportData = {
      title: conv.title,
      createdAt: conv.createdAt,
      messages: conv.messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp
      }))
    };

    return JSON.stringify(exportData, null, 2);
  }, [conversations]);

  return {
    conversations,
    currentConversation,
    isLoading,
    isSyncing,
    error,
    createConversation,
    updateConversationTitle,
    deleteConversation,
    loadConversation,
    addMessage,
    loadConversations,
    clearCurrentConversation,
    syncWithServer,
    exportConversation
  };
};

export default useCoachConversationsEnriched;
