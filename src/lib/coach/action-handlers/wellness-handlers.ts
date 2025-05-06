
import { notificationService } from '../notification-service';
import { ActionHandler } from './action-handler.interface';
import { actionHandlerRegistry } from './action-handler-registry';

/**
 * Handler for checking scan status
 */
export class CheckScanStatusHandler implements ActionHandler {
  actionType = 'check_scan_status';

  execute(userId: string): void {
    // Vérifier si un scan a été fait aujourd'hui
    const hasScannedToday = Math.random() > 0.5; // Simulation
    if (!hasScannedToday) {
      notificationService.addNotification(userId, {
        id: `scan-reminder-${Date.now()}`,
        title: "Rappel de scan",
        message: "Vous n'avez pas encore fait votre scan émotionnel aujourd'hui. Prenez un moment pour vous !",
        type: 'info',
        timestamp: new Date()
      });
    }
  }
}

/**
 * Handler for suggesting journal entries
 */
export class SuggestJournalEntryHandler implements ActionHandler {
  actionType = 'suggest_journal_entry';

  execute(userId: string): void {
    notificationService.addNotification(userId, {
      id: `journal-suggest-${Date.now()}`,
      title: "Suggestion journal",
      message: "Exprimer vos pensées dans votre journal pourrait vous aider à mieux comprendre vos émotions actuelles.",
      type: 'info',
      timestamp: new Date()
    });
  }
}

/**
 * Handler for suggesting wellness activities
 */
export class SuggestWellnessActivityHandler implements ActionHandler {
  actionType = 'suggest_wellness_activity';

  execute(userId: string): void {
    const activities = [
      "Prenez 5 minutes pour faire des exercices de respiration profonde.",
      "Une courte marche de 10 minutes peut vous aider à vous recentrer.",
      "Hydratez-vous régulièrement pour maintenir votre bien-être.",
      "Avez-vous pris un moment pour vous aujourd'hui ? Un peu de méditation peut aider."
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    
    notificationService.addNotification(userId, {
      id: `wellness-suggest-${Date.now()}`,
      title: "Activité bien-être",
      message: randomActivity,
      type: 'info',
      timestamp: new Date()
    });
  }
}

// Register all wellness handlers
actionHandlerRegistry.register(new CheckScanStatusHandler());
actionHandlerRegistry.register(new SuggestJournalEntryHandler());
actionHandlerRegistry.register(new SuggestWellnessActivityHandler());

// Legacy function handlers for backward compatibility
export function handleCheckScanStatus(userId: string): void {
  const handler = actionHandlerRegistry.getHandler('check_scan_status');
  if (handler) handler.execute(userId, {});
}

export function handleSuggestJournalEntry(userId: string): void {
  const handler = actionHandlerRegistry.getHandler('suggest_journal_entry');
  if (handler) handler.execute(userId, {});
}

export function handleSuggestWellnessActivity(userId: string): void {
  const handler = actionHandlerRegistry.getHandler('suggest_wellness_activity');
  if (handler) handler.execute(userId, {});
}
