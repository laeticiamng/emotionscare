
import { CoachAction, CoachEvent } from './types';
import { supabase } from '@/integrations/supabase/client';
import { actionExecutor } from './action-executor';
import { determineActions } from './emotional-data';
import { routines } from './routines';

/**
 * Service pour le coach IA
 */
class CoachService {
  /**
   * Traiter un événement coach
   */
  async processEvent(event: CoachEvent): Promise<void> {
    console.log(`Coach IA: Processing event ${event.type}`);

    // Obtient les actions à effectuer basées sur l'évènement
    const actions = await this.getActions(event);

    // Exécute chaque action
    for (const action of actions) {
      await actionExecutor.executeAction(action, event);
    }
  }
  
  /**
   * Vérifier la connexion à l'API OpenAI
   */
  async checkAPIConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: "Simple connection test, please respond with 'API connection successful'",
          userContext: null
        }
      });
      
      if (error) throw error;
      return data && data.response && data.response.includes('connection');
    } catch (error) {
      console.error('API connection check failed:', error);
      return false;
    }
  }

  /**
   * Déterminer les actions à effectuer en fonction de l'événement
   */
  private async getActions(event: CoachEvent): Promise<CoachAction[]> {
    switch (event.type) {
      case 'api_check':
        return [{ type: 'check_api_connection', payload: {} }];
        
      case 'scan_completed':
        return determineActions(event);
        
      case 'predictive_alert':
        return [
          { type: 'check_trend_alert', payload: event.data || {} },
          { type: 'suggest_wellness_activity', payload: {} }
        ];
        
      case 'daily_reminder':
        return routines.getDailyReminder();
        
      default:
        console.warn(`Unknown event type: ${event.type}`);
        return [];
    }
  }

  /**
   * Envoyer une question directement au coach
   */
  async askCoachQuestion(userId: string, question: string): Promise<string> {
    try {
      // Get user emotional context
      const { data: emotions } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(3);
      
      let userContext = null;
      
      if (emotions && emotions.length > 0) {
        const recentEmotions = emotions.map(e => e.emojis || e.emotion).join(', ');
        const avgScore = emotions.reduce((acc, e) => acc + (e.score || 50), 0) / emotions.length;
        
        userContext = {
          recentEmotions,
          currentScore: Math.round(avgScore),
          lastEmotionDate: emotions[0].date
        };
      }
      
      // Send question to OpenAI
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: question,
          userContext
        }
      });
      
      if (error) throw error;
      
      return data.response;
    } catch (error) {
      console.error('Error asking coach question:', error);
      return "Je suis désolé, mais je rencontre des difficultés techniques pour répondre à votre question.";
    }
  }
}

export const coachService = new CoachService();

/**
 * Trigger an event for the coach
 */
export function triggerCoachEvent(
  eventType: 'scan_completed' | 'predictive_alert' | 'daily_reminder' | 'api_check',
  userId: string,
  data?: any
): Promise<void> {
  const event: CoachEvent = {
    type: eventType,
    user_id: userId,
    data
  };
  
  return coachService.processEvent(event);
}

export * from './types';
