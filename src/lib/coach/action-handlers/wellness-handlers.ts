
import { notificationService } from '../notification-service';

/**
 * Handler for checking scan status
 */
export function handleCheckScanStatus(userId: string): void {
  // Vérifier si un scan a été fait aujourd'hui
  const hasScannedToday = Math.random() > 0.5; // Simulation
  if (!hasScannedToday) {
    notificationService.addNotification(userId, {
      id: `scan-reminder-${Date.now()}`,
      message: "Vous n'avez pas encore fait votre scan émotionnel aujourd'hui. Prenez un moment pour vous !",
      type: 'info',
      timestamp: new Date()
    });
  }
}

/**
 * Handler for suggesting journal entries
 */
export function handleSuggestJournalEntry(userId: string): void {
  notificationService.addNotification(userId, {
    id: `journal-suggest-${Date.now()}`,
    message: "Exprimer vos pensées dans votre journal pourrait vous aider à mieux comprendre vos émotions actuelles.",
    type: 'info',
    timestamp: new Date()
  });
}

/**
 * Handler for suggesting wellness activities
 */
export function handleSuggestWellnessActivity(userId: string): void {
  const activities = [
    "Prenez 5 minutes pour faire des exercices de respiration profonde.",
    "Une courte marche de 10 minutes peut vous aider à vous recentrer.",
    "Hydratez-vous régulièrement pour maintenir votre bien-être.",
    "Avez-vous pris un moment pour vous aujourd'hui ? Un peu de méditation peut aider."
  ];
  
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  
  notificationService.addNotification(userId, {
    id: `wellness-suggest-${Date.now()}`,
    message: randomActivity,
    type: 'info',
    timestamp: new Date()
  });
}
