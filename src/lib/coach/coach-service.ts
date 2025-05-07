import { CoachAction, CoachEvent, AI_MODEL_CONFIG, CoachModule } from './types';
import { supabase } from '@/integrations/supabase/client';
import { actionExecutor } from './action-executor';
import { determineActions } from './emotional-data';
import { routines } from './routines';
import { budgetMonitor } from '@/lib/ai/budgetMonitor';
import { UserContext } from '@/types/chat';

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
  async selectModel(module: CoachModule, context?: any): Promise<string> {
    // Budget control logic
    const monthlyUsage = await this.getMonthlyUsage();
    const threshold = 100; // Example threshold in USD
    
    // Fallback to cheaper model if budget exceeded
    if (await budgetMonitor.hasExceededBudget() && module !== 'scan') {
      return "gpt-4o-mini-2024-07-18";
    }
    
    // Use the configured model for the module
    return AI_MODEL_CONFIG[module].model;
  }
  
  /**
   * Get estimated monthly usage
   */
  private async getMonthlyUsage(): Promise<number> {
    try {
      const { data, error } = await supabase.functions.invoke('monitor-api-usage', {
        body: {}
      });
      
      if (error || !data) {
        console.error('Error getting monthly usage:', error);
        return 0;
      }
      
      return data.usage?.total || 0;
    } catch (error) {
      console.error('Error getting monthly usage:', error);
      return 0;
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
      
      let userContext: UserContext = {
        recentEmotions: null,
        currentScore: null
      };
      
      if (emotions && emotions.length > 0) {
        // Use emojis field instead of emotion, or derive the emotion from other fields
        const recentEmotions = emotions.map(e => e.emojis || '').join(', ');
        const avgScore = emotions.reduce((acc, e) => acc + (e.score || 50), 0) / emotions.length;
        
        userContext = {
          recentEmotions,
          currentScore: Math.round(avgScore),
          lastEmotionDate: emotions[0].date
        };
      }
      
      // Check budget constraints before selecting model
      const budgetExceeded = await budgetMonitor.hasExceededBudget("gpt-4.1-2025-04-14");
      
      // Determine model based on question length and complexity
      const model = budgetExceeded ? "gpt-4o-mini-2024-07-18" : 
                   question.length > 100 ? "gpt-4.1-2025-04-14" : "gpt-4o-mini-2024-07-18";
      
      // Send question to OpenAI
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: question,
          userContext,
          model,
          module: 'coach',
          temperature: 0.4,
          max_tokens: 512
        }
      });
      
      if (error) throw error;
      
      return data?.response || "Je suis désolé, je n'ai pas pu traiter votre demande.";
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
