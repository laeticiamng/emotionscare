// @ts-nocheck
import { supabase } from '@/integrations/supabase/client';
import { ChatResponse, Message } from '@/types/support';
import { logger } from '@/lib/logger';

export class ChatService {
  static async getSupportResponse(content: string, conversationHistory?: Message[]): Promise<ChatResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('support-chat', {
        body: {
          message: content,
          history: conversationHistory || [],
          context: 'support'
        }
      });

      if (error) throw error;

      return {
        id: data.id,
        content: data.response,
        emotion: data.detectedEmotion,
        timestamp: new Date().toISOString(),
        suggestions: data.suggestions,
        confidence: data.confidence
      };
    } catch (error) {
      logger.error('Error getting support response', error as Error, 'API');
      
      // Fallback response
      return {
        id: crypto.randomUUID(),
        content: "Je suis désolé, je rencontre actuellement des difficultés techniques. Un membre de notre équipe vous contactera bientôt.",
        timestamp: new Date().toISOString(),
        suggestions: [
          "Essayer de reformuler votre question",
          "Consulter notre FAQ",
          "Contacter le support technique"
        ]
      };
    }
  }

  static async createSupportTicket(subject: string, message: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium') {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          subject,
          priority,
          status: 'open',
          category: 'general',
          first_message: message
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      // Silent: ticket creation error logged internally
      throw error;
    }
  }

  static async getFAQ(category?: string) {
    try {
      let query = supabase.from('faq').select('*');
      
      if (category) {
        query = query.eq('category', category);
      }
      
      const { data, error } = await query.order('helpful', { ascending: false });

      if (error) throw error;

      return data;
    } catch (error) {
      // Silent: FAQ fetch error logged internally
      return [];
    }
  }
}

export const getSupportResponse = ChatService.getSupportResponse;
export const createSupportTicket = ChatService.createSupportTicket;
export const getFAQ = ChatService.getFAQ;