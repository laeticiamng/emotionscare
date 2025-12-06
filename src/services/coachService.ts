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
}

const DEFAULT_RECOMMENDATIONS = [
  'Prenez quelques minutes pour respirer profondément',
  'Essayez une courte méditation de 5 minutes',
  'Écoutez de la musique relaxante',
  'Prenez une pause et sortez prendre l\'air',
];
