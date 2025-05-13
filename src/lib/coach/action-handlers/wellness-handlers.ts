import { notificationService } from '../notification-service';
import { ActionHandler } from './action-handler.interface';
import { actionHandlerRegistry } from './action-handler-registry';

/**
 * Handler for breathing exercise recommendations
 */
export class BreathingExerciseHandler implements ActionHandler {
  actionType = 'start_breathing_exercise';

  execute(userId: string, payload: any): void {
    console.log(`Starting breathing exercise for user ${userId}`);
    
    notificationService.addNotification(userId, {
      title: "Exercice de respiration",
      message: payload.message || "Prenez un moment pour faire cet exercice de respiration.",
      type: 'wellness',
    });
  }
}

/**
 * Handler for hydration reminders
 */
export class HydrationReminderHandler implements ActionHandler {
  actionType = 'hydration_reminder';

  execute(userId: string, payload: any): void {
    notificationService.addNotification(userId, {
      title: "Rappel d'hydratation",
      message: payload.message || "N'oubliez pas de boire de l'eau régulièrement.",
      type: 'reminder',
    });
  }
}

/**
 * Handler for wellness tips
 */
export class WellnessTipHandler implements ActionHandler {
  actionType = 'wellness_tip';

  execute(userId: string, payload: any): void {
    notificationService.addNotification(userId, {
      title: "Conseil bien-être",
      message: payload.message || "Voici un conseil pour améliorer votre bien-être.",
      type: 'tip',
    });
  }
}

// Register all wellness handlers
actionHandlerRegistry.register(new BreathingExerciseHandler());
actionHandlerRegistry.register(new HydrationReminderHandler());
actionHandlerRegistry.register(new WellnessTipHandler());
