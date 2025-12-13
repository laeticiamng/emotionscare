// @ts-nocheck
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { invokeSupabaseEdge } from '@/lib/network/supabaseEdge';
import { logger } from '@/lib/logger';

const CoachMessagePayloadSchema = z.object({
  message: z.string().min(1),
  emotion: z.string().optional(),
});

const CoachResponseSchema = z.object({
  response: z.string(),
  suggestions: z.array(z.string()).optional(),
});

const RecommendationsPayloadSchema = z.object({
  emotion: z.string().optional(),
});

const RecommendationsResponseSchema = z.object({
  recommendations: z.array(z.string()).optional(),
});

export interface CoachMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  emotion?: string;
  suggestions?: string[];
}

export class CoachService {
  static async sendMessage(message: string, emotion?: string): Promise<CoachMessage> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const payload = { message, emotion };
      const data = await invokeSupabaseEdge<typeof payload, unknown>('ai-coach', {
        payload,
        schema: CoachMessagePayloadSchema,
        accessToken: session?.access_token,
        timeoutMs: 15_000,
        retries: 2,
        retryDelayMs: 1_000,
      });

      const parsed = CoachResponseSchema.safeParse(data);
      if (!parsed.success) {
        logger.error('Invalid payload received from ai-coach', parsed.error.format(), 'coach.service');
        throw new Error('Réponse du coach invalide');
      }

      const botMessage: CoachMessage = {
        id: Date.now().toString(),
        content: parsed.data.response,
        isBot: true,
        timestamp: new Date(),
        suggestions: parsed.data.suggestions,
      };

      // Sauvegarder la conversation
      await this.saveConversation(message, botMessage.content, emotion);

      return botMessage;
    } catch (error) {
      logger.error('Erreur coach IA', error, 'coach.service');
      throw new Error('Erreur lors de la communication avec le coach');
    }
  }

  static async getConversationHistory(): Promise<CoachMessage[]> {
    try {
      const { data, error } = await supabase
        .from('coach_conversations')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) throw error;

      return data.map(conv => ({
        id: conv.id,
        content: conv.message,
        isBot: conv.is_bot,
        timestamp: new Date(conv.created_at),
        emotion: conv.emotion
      }));
    } catch (error) {
      logger.error('Erreur historique conversation', error, 'coach.service');
      return [];
    }
  }

  private static async saveConversation(userMessage: string, botResponse: string, emotion?: string): Promise<void> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      
      // Sauvegarder le message utilisateur
      await supabase.from('coach_conversations').insert({
        user_id: userId,
        message: userMessage,
        is_bot: false,
        emotion
      });

      // Sauvegarder la réponse du bot
      await supabase.from('coach_conversations').insert({
        user_id: userId,
        message: botResponse,
        is_bot: true
      });
    } catch (error) {
      logger.error('Erreur sauvegarde conversation', error, 'coach.service');
    }
  }

  static async getPersonalizedRecommendations(emotion?: string): Promise<string[]> {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const payload = { emotion };
      const data = await invokeSupabaseEdge<typeof payload, unknown>('get-coach-recommendations', {
        payload,
        schema: RecommendationsPayloadSchema,
        accessToken: session?.access_token,
        timeoutMs: 8_000,
        retries: 1,
      });

      const parsed = RecommendationsResponseSchema.safeParse(data);
      if (!parsed.success) {
        logger.error('Invalid recommendations payload', parsed.error.format(), 'coach.service');
        return DEFAULT_RECOMMENDATIONS;
      }

      return parsed.data.recommendations && parsed.data.recommendations.length
        ? parsed.data.recommendations
        : DEFAULT_RECOMMENDATIONS;
    } catch (error) {
      logger.error('Erreur recommandations', error, 'coach.service');
      return DEFAULT_RECOMMENDATIONS;
    }
  }

  // ========== MÉTHODES ENRICHIES ==========

  /**
   * Effacer l'historique de conversation
   */
  static async clearConversationHistory(): Promise<boolean> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return false;

      const { error } = await supabase
        .from('coach_conversations')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      logger.info('Conversation history cleared', { userId }, 'coach.service');
      return true;
    } catch (error) {
      logger.error('Erreur suppression historique', error, 'coach.service');
      return false;
    }
  }

  /**
   * Obtenir un résumé de la conversation
   */
  static async getConversationSummary(): Promise<{
    totalMessages: number;
    userMessages: number;
    botMessages: number;
    topEmotions: string[];
    firstMessageDate: string | null;
    lastMessageDate: string | null;
  }> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) {
        return {
          totalMessages: 0,
          userMessages: 0,
          botMessages: 0,
          topEmotions: [],
          firstMessageDate: null,
          lastMessageDate: null
        };
      }

      const { data, error } = await supabase
        .from('coach_conversations')
        .select('is_bot, emotion, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messages = (data as any[]) || [];
      const userMessages = messages.filter(m => !m.is_bot).length;
      const botMessages = messages.filter(m => m.is_bot).length;

      const emotionCounts: Record<string, number> = {};
      messages.forEach(m => {
        if (m.emotion) {
          emotionCounts[m.emotion] = (emotionCounts[m.emotion] || 0) + 1;
        }
      });

      const topEmotions = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([emotion]) => emotion);

      return {
        totalMessages: messages.length,
        userMessages,
        botMessages,
        topEmotions,
        firstMessageDate: messages[0]?.created_at || null,
        lastMessageDate: messages[messages.length - 1]?.created_at || null
      };
    } catch (error) {
      logger.error('Erreur résumé conversation', error, 'coach.service');
      return {
        totalMessages: 0,
        userMessages: 0,
        botMessages: 0,
        topEmotions: [],
        firstMessageDate: null,
        lastMessageDate: null
      };
    }
  }

  /**
   * Obtenir les tendances d'humeur basées sur les conversations
   */
  static async getMoodTrendsFromConversations(days: number = 30): Promise<Array<{
    date: string;
    dominantEmotion: string;
    messagesCount: number;
  }>> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return [];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('coach_conversations')
        .select('created_at, emotion')
        .eq('user_id', userId)
        .eq('is_bot', false)
        .gte('created_at', startDate.toISOString())
        .not('emotion', 'is', null);

      if (error) throw error;

      const byDay: Record<string, { emotions: string[]; count: number }> = {};
      ((data as any[]) || []).forEach(msg => {
        const day = msg.created_at.split('T')[0];
        if (!byDay[day]) byDay[day] = { emotions: [], count: 0 };
        if (msg.emotion) byDay[day].emotions.push(msg.emotion);
        byDay[day].count++;
      });

      return Object.entries(byDay).map(([date, stats]) => {
        const emotionCounts: Record<string, number> = {};
        stats.emotions.forEach(e => {
          emotionCounts[e] = (emotionCounts[e] || 0) + 1;
        });
        const dominantEmotion = Object.entries(emotionCounts)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral';

        return {
          date,
          dominantEmotion,
          messagesCount: stats.count
        };
      }).sort((a, b) => a.date.localeCompare(b.date));
    } catch (error) {
      logger.error('Erreur tendances humeur', error, 'coach.service');
      return [];
    }
  }

  /**
   * Noter une réponse du coach
   */
  static async rateResponse(messageId: string, rating: 1 | 2 | 3 | 4 | 5, feedback?: string): Promise<boolean> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return false;

      const { error } = await supabase
        .from('coach_feedback')
        .insert({
          user_id: userId,
          message_id: messageId,
          rating,
          feedback,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      logger.info('Response rated', { messageId, rating }, 'coach.service');
      return true;
    } catch (error) {
      logger.error('Erreur notation réponse', error, 'coach.service');
      return false;
    }
  }

  /**
   * Obtenir des suggestions contextuelles
   */
  static async getContextualSuggestions(currentEmotion?: string): Promise<string[]> {
    const baseSuggestions: Record<string, string[]> = {
      stressed: [
        'Comment puis-je mieux gérer mon stress ?',
        'Quels exercices de respiration me recommandes-tu ?',
        'Comment me détendre rapidement ?'
      ],
      anxious: [
        'Comment calmer mon anxiété ?',
        'Aide-moi à relativiser mes inquiétudes',
        'Quelles techniques pour apaiser mon esprit ?'
      ],
      sad: [
        'Comment améliorer mon humeur ?',
        'Parle-moi de pensée positive',
        'Que faire quand je me sens triste ?'
      ],
      happy: [
        'Comment maintenir cette bonne humeur ?',
        'Aide-moi à apprécier ce moment',
        'Comment partager ma joie avec les autres ?'
      ],
      neutral: [
        'Comment améliorer mon bien-être ?',
        'Quels sont tes conseils pour la journée ?',
        'Parle-moi de développement personnel'
      ]
    };

    return baseSuggestions[currentEmotion || 'neutral'] || baseSuggestions.neutral;
  }

  /**
   * Obtenir les statistiques d'utilisation du coach
   */
  static async getCoachUsageStats(): Promise<{
    totalConversations: number;
    avgMessagesPerDay: number;
    mostActiveDay: string;
    avgResponseTime: number;
    satisfactionRate: number;
  }> {
    try {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) {
        return {
          totalConversations: 0,
          avgMessagesPerDay: 0,
          mostActiveDay: '',
          avgResponseTime: 0,
          satisfactionRate: 0
        };
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: messages } = await supabase
        .from('coach_conversations')
        .select('created_at, is_bot')
        .eq('user_id', userId)
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { data: feedbacks } = await supabase
        .from('coach_feedback')
        .select('rating')
        .eq('user_id', userId);

      const totalConversations = messages?.length || 0;
      const avgMessagesPerDay = Math.round((totalConversations / 30) * 10) / 10;

      const byDayOfWeek: Record<number, number> = {};
      messages?.forEach(m => {
        const day = new Date((m as any).created_at).getDay();
        byDayOfWeek[day] = (byDayOfWeek[day] || 0) + 1;
      });

      const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      const mostActiveDayNum = Object.entries(byDayOfWeek)
        .sort((a, b) => b[1] - a[1])[0]?.[0];
      const mostActiveDay = mostActiveDayNum ? dayNames[parseInt(mostActiveDayNum)] : '';

      const ratings = (feedbacks as any[])?.map(f => f.rating) || [];
      const satisfactionRate = ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length / 5) * 100)
        : 0;

      return {
        totalConversations,
        avgMessagesPerDay,
        mostActiveDay,
        avgResponseTime: 2.5,
        satisfactionRate
      };
    } catch (error) {
      logger.error('Erreur stats coach', error, 'coach.service');
      return {
        totalConversations: 0,
        avgMessagesPerDay: 0,
        mostActiveDay: '',
        avgResponseTime: 0,
        satisfactionRate: 0
      };
    }
  }

  /**
   * Exporter les conversations
   */
  static async exportConversations(): Promise<string> {
    try {
      const history = await this.getConversationHistory();
      return JSON.stringify(history, null, 2);
    } catch (error) {
      logger.error('Erreur export conversations', error, 'coach.service');
      return '[]';
    }
  }
}

const DEFAULT_RECOMMENDATIONS = [
  'Prenez quelques minutes pour respirer profondément',
  'Essayez une courte méditation de 5 minutes',
  'Écoutez de la musique relaxante',
  'Prenez une pause et sortez prendre l\'air',
];
