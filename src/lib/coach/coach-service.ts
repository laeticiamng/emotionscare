
import { CoachEvent, CoachRoutine } from './types';
import { coachRoutines } from './routines';
import { notificationService } from './notification-service';
import { emotionalDataService } from './emotional-data';
import { actionExecutor } from './action-executor';
import { supabase } from '@/integrations/supabase/client';

/**
 * Main service for orchestrating coach routines and actions
 */
export class CoachService {
  private routines: CoachRoutine[] = coachRoutines;

  /**
   * Processes an event and triggers the corresponding routine
   */
  async processEvent(event: CoachEvent): Promise<void> {
    console.log(`Coach IA: Processing event ${event.type} for user ${event.user_id}`, event);
    
    // Find all routines matching the event type, sorted by priority
    const matchingRoutines = this.routines
      .filter(routine => routine.trigger === event.type)
      .sort((a, b) => b.priority - a.priority);
      
    if (matchingRoutines.length === 0) {
      console.warn(`No routine found for event type: ${event.type}`);
      return;
    }

    // Execute the highest priority routine first
    const primaryRoutine = matchingRoutines[0];
    console.log(`Coach IA: Starting primary routine "${primaryRoutine.name}"`);
    await this.executeRoutine(primaryRoutine, event);
    
    // Execute secondary routines in parallel if they exist
    if (matchingRoutines.length > 1) {
      console.log(`Coach IA: Starting ${matchingRoutines.length - 1} secondary routines`);
      await Promise.all(matchingRoutines.slice(1).map(routine => 
        this.executeRoutine(routine, event)
      ));
    }
  }

  /**
   * Executes a complete routine
   */
  private async executeRoutine(routine: CoachRoutine, event: CoachEvent): Promise<void> {
    for (const action of routine.actions) {
      try {
        await actionExecutor.executeAction(action, event);
      } catch (error) {
        console.error(`Failed to execute action ${action.type}:`, error);
      }
    }
    console.log(`Coach IA: Routine "${routine.name}" completed`);
  }

  /**
   * Gets notifications for a user
   */
  getNotifications(userId: string) {
    return notificationService.getNotifications(userId);
  }
  
  /**
   * Gets emotional data for a user
   */
  getUserEmotionalData(userId: string) {
    return emotionalDataService.getUserEmotionalData(userId);
  }
  
  /**
   * Sends a query to the OpenAI API through the Edge Function
   */
  async askCoachQuestion(userId: string, question: string): Promise<string> {
    try {
      // Récupérer le contexte émotionnel pour enrichir la requête
      const userEmotionalData = await this.getUserEmotionalData(userId);
      
      const { data, error } = await supabase.functions.invoke('chat-with-ai', {
        body: {
          message: question,
          userContext: {
            recentEmotions: userEmotionalData?.lastEmotions?.map(e => e.emotion).join(', ') || '',
            currentScore: userEmotionalData?.averageScore || 50
          }
        }
      });
      
      if (error) throw error;
      
      return data.response;
    } catch (error) {
      console.error('Error asking coach question:', error);
      return "Je suis désolé, mais je rencontre des difficultés techniques pour répondre à votre question. Veuillez réessayer plus tard.";
    }
  }
}

// Export singleton service instance
export const coachService = new CoachService();

// Helper for manually triggering a coach event (for demo and testing)
export const triggerCoachEvent = (eventType: 'scan_completed' | 'predictive_alert' | 'daily_reminder', userId: string, data?: any) => {
  return coachService.processEvent({
    type: eventType,
    user_id: userId,
    data
  });
};
