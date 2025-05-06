
import { CoachAction, CoachEvent, AI_MODEL_CONFIG, CoachModule } from './types';
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
      const { data, error } = await supabase.functions.invoke('check-api-connection', {
        body: {}
      });
      
      if (error) {
        console.error('API connection check failed:', error);
        return false;
      }
      
      return data && data.connected === true;
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
   * Sélectionner le modèle approprié en fonction du module et du contexte
   */
  selectModel(module: CoachModule, context?: any): string {
    // Budget control logic
    const monthlyUsage = this.getMonthlyUsage();
    const threshold = 100; // Example threshold in USD
    
    // Fallback to cheaper model if budget exceeded
    if (monthlyUsage > threshold && module !== 'scan') {
      return "gpt-4o-mini-2024-07-18";
    }
    
    // Use the configured model for the module
    return AI_MODEL_CONFIG[module].model;
  }
  
  /**
   * Get estimated monthly usage (placeholder implementation)
   */
  private getMonthlyUsage(): number {
    // In a real implementation, this would query usage metrics from a database
    // For now, return a mock value
    return 50; // Example: $50 spent this month
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
        // Fix: Use emojis field instead of emotion, or derive the emotion from other fields
        const recentEmotions = emotions.map(e => e.emojis || '').join(', ');
        const avgScore = emotions.reduce((acc, e) => acc + (e.score || 50), 0) / emotions.length;
        
        userContext = {
          recentEmotions,
          currentScore: Math.round(avgScore),
          lastEmotionDate: emotions[0].date
        };
      }
      
      // Determine model based on question length and complexity
      const model = question.length > 100 ? "gpt-4.1-2025-04-14" : "gpt-4o-mini-2024-07-18";
      
      // Send question to OpenAI
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: question,
          userContext,
          model
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
