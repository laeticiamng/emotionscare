
import { supabase } from '@/integrations/supabase/client';

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
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: { message, emotion }
      });

      if (error) throw error;

      const botMessage: CoachMessage = {
        id: Date.now().toString(),
        content: data.response,
        isBot: true,
        timestamp: new Date(),
        suggestions: data.suggestions
      };

      // Sauvegarder la conversation
      await this.saveConversation(message, botMessage.content, emotion);

      return botMessage;
    } catch (error) {
      console.error('Erreur coach IA:', error);
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
      console.error('Erreur historique conversation:', error);
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
      console.error('Erreur sauvegarde conversation:', error);
    }
  }

  static async getPersonalizedRecommendations(emotion?: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.functions.invoke('get-coach-recommendations', {
        body: { emotion }
      });

      if (error) throw error;

      return data.recommendations || [];
    } catch (error) {
      console.error('Erreur recommandations:', error);
      return [
        'Prenez quelques minutes pour respirer profondément',
        'Essayez une courte méditation de 5 minutes',
        'Écoutez de la musique relaxante',
        'Prenez une pause et sortez prendre l\'air'
      ];
    }
  }
}
