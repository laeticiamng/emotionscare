/**
 * Service API pour le coach EmotionsCare
 * Gère toutes les requêtes vers l'API du coach
 */

import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface CoachMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  emotion?: string;
  timestamp: string;
}

export interface CoachConversation {
  id: string;
  userId: string;
  title: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface UserEmotionalData {
  userId: string;
  timestamp: string;
  emotions: {
    joy: number;
    sadness: number;
    anxiety: number;
    anger: number;
    calm: number;
    neutral: number;
  };
  overallScore: number;
  dominantEmotion: string;
}

export interface CoachAnalytics {
  totalConversations: number;
  totalMessages: number;
  averageMessageLength: number;
  averageEmotionalScore: number;
  dominantEmotions: { emotion: string; count: number }[];
  lastInteraction: string;
}

/**
 * Récupère les conversations de l'utilisateur
 */
export const fetchUserConversations = async (
  userId: string
): Promise<CoachConversation[]> => {
  try {
    const { data, error } = await supabase
      .from('coach_conversations')
      .select('*')
      .eq('userId', userId)
      .order('updatedAt', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error fetching conversations:', error, 'SERVICE');
    throw error;
  }
};

/**
 * Récupère une conversation spécifique avec tous les messages
 */
export const fetchConversation = async (
  conversationId: string
): Promise<CoachConversation & { messages: CoachMessage[] }> => {
  try {
    const { data: conversation, error: convError } = await supabase
      .from('coach_conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convError) throw convError;

    const { data: messages, error: msgsError } = await supabase
      .from('coach_messages')
      .select('*')
      .eq('conversationId', conversationId)
      .order('timestamp', { ascending: true });

    if (msgsError) throw msgsError;

    return {
      ...conversation,
      messages: messages || [],
    };
  } catch (error) {
    logger.error('Error fetching conversation:', error, 'SERVICE');
    throw error;
  }
};

/**
 * Crée une nouvelle conversation
 */
export const createConversation = async (
  userId: string,
  title: string,
  mode: 'b2c' | 'b2b' = 'b2c'
): Promise<CoachConversation> => {
  try {
    const { data, error } = await supabase
      .from('coach_conversations')
      .insert([
        {
          userId,
          title,
          mode,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messageCount: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error creating conversation:', error, 'SERVICE');
    throw error;
  }
};

/**
 * Ajoute un message à une conversation
 */
export const addMessageToConversation = async (
  conversationId: string,
  role: 'user' | 'assistant',
  content: string,
  emotion?: string
): Promise<CoachMessage> => {
  try {
    const message: CoachMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      role,
      content,
      emotion,
      timestamp: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('coach_messages')
      .insert([message])
      .select()
      .single();

    if (error) throw error;

    // Update conversation's updatedAt
    await supabase
      .from('coach_conversations')
      .update({
        updatedAt: new Date().toISOString(),
      })
      .eq('id', conversationId);

    return data;
  } catch (error) {
    logger.error('Error adding message:', error, 'SERVICE');
    throw error;
  }
};

/**
 * Met à jour le titre d'une conversation
 */
export const updateConversationTitle = async (
  conversationId: string,
  newTitle: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('coach_conversations')
      .update({
        title: newTitle,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', conversationId);

    if (error) throw error;
  } catch (error) {
    logger.error('Error updating conversation title:', error, 'SERVICE');
    throw error;
  }
};

/**
 * Supprime une conversation
 */
export const deleteConversation = async (conversationId: string): Promise<void> => {
  try {
    // Delete messages first
    await supabase.from('coach_messages').delete().eq('conversationId', conversationId);

    // Then delete conversation
    const { error } = await supabase
      .from('coach_conversations')
      .delete()
      .eq('id', conversationId);

    if (error) throw error;
  } catch (error) {
    logger.error('Error deleting conversation:', error, 'SERVICE');
    throw error;
  }
};

/**
 * Enregistre les données émotionnelles de l'utilisateur
 */
export const logEmotionalData = async (
  userId: string,
  emotionalData: Omit<UserEmotionalData, 'userId' | 'timestamp'>
): Promise<UserEmotionalData> => {
  try {
    const data: UserEmotionalData = {
      userId,
      timestamp: new Date().toISOString(),
      ...emotionalData,
    };

    const { data: saved, error } = await supabase
      .from('coach_emotional_data')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return saved;
  } catch (error) {
    logger.error('Error logging emotional data:', error, 'SERVICE');
    throw error;
  }
};

/**
 * Récupère les données émotionnelles de l'utilisateur
 */
export const fetchEmotionalData = async (
  userId: string,
  daysBack: number = 7
): Promise<UserEmotionalData[]> => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysBack);

    const { data, error } = await supabase
      .from('coach_emotional_data')
      .select('*')
      .eq('userId', userId)
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error fetching emotional data:', error, 'SERVICE');
    throw error;
  }
};

/**
 * Récupère les analytics de l'utilisateur
 */
export const fetchUserAnalytics = async (userId: string): Promise<CoachAnalytics> => {
  try {
    const conversations = await fetchUserConversations(userId);

    // Calculate stats
    const totalConversations = conversations.length;
    const totalMessages = conversations.reduce((sum, c) => sum + (c.messageCount || 0), 0);
    const averageMessageLength =
      totalMessages > 0
        ? conversations.reduce((sum, c) => sum + (c.messageCount || 0), 0) / totalMessages
        : 0;

    const emotionalData = await fetchEmotionalData(userId, 30);
    const averageEmotionalScore =
      emotionalData.length > 0
        ? emotionalData.reduce((sum, d) => sum + d.overallScore, 0) / emotionalData.length
        : 0;

    // Get dominant emotions
    const emotionCounts = new Map<string, number>();
    emotionalData.forEach((d) => {
      const emotion = d.dominantEmotion;
      emotionCounts.set(emotion, (emotionCounts.get(emotion) || 0) + 1);
    });

    const dominantEmotions = Array.from(emotionCounts.entries())
      .map(([emotion, count]) => ({ emotion, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const lastInteraction = conversations[0]?.updatedAt || new Date().toISOString();

    return {
      totalConversations,
      totalMessages,
      averageMessageLength: Math.round(averageMessageLength),
      averageEmotionalScore: parseFloat(averageEmotionalScore.toFixed(1)),
      dominantEmotions,
      lastInteraction,
    };
  } catch (error) {
    logger.error('Error fetching user analytics:', error, 'SERVICE');
    throw error;
  }
};

/**
 * Exporte une conversation
 */
export const exportConversation = async (
  conversationId: string,
  format: 'json' | 'csv' = 'json'
): Promise<Blob> => {
  try {
    const conversation = await fetchConversation(conversationId);

    if (format === 'json') {
      const json = JSON.stringify(conversation, null, 2);
      return new Blob([json], { type: 'application/json' });
    } else if (format === 'csv') {
      const csv = [
        ['Timestamp', 'Role', 'Message'],
        ...conversation.messages.map((m) => [m.timestamp, m.role, m.content]),
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(','))
        .join('\n');

      return new Blob([csv], { type: 'text/csv' });
    }

    throw new Error('Unsupported export format');
  } catch (error) {
    logger.error('Error exporting conversation:', error, 'SERVICE');
    throw error;
  }
};

/**
 * Récupère les programmes du coach
 */
export const fetchCoachPrograms = async (userId?: string) => {
  try {
    let query = supabase.from('coach_programs').select('*');

    if (userId) {
      query = query.eq('userId', userId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error fetching coach programs:', error, 'SERVICE');
    throw error;
  }
};

/**
 * Met à jour la progression d'un programme
 */
export const updateProgramProgress = async (
  programId: string,
  progress: number
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('coach_programs')
      .update({
        progress: Math.min(100, Math.max(0, progress)),
        updatedAt: new Date().toISOString(),
      })
      .eq('id', programId);

    if (error) throw error;
  } catch (error) {
    logger.error('Error updating program progress:', error, 'SERVICE');
    throw error;
  }
};
