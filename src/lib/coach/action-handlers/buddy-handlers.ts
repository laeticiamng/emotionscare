
import { notificationService } from '../notification-service';

/**
 * Handler for finding buddies
 */
export function handleFindBuddy(userId: string): void {
  console.log(`Finding buddy for user ${userId}`);
  notificationService.addNotification(userId, {
    id: `find-buddy-${Date.now()}`,
    message: "Recherche d'un buddy compatible en cours...",
    type: 'info',
    timestamp: new Date()
  });
}

/**
 * Handler for sending buddy messages
 */
export function handleSendBuddyMessage(userId: string): void {
  notificationService.addNotification(userId, {
    id: `buddy-message-${Date.now()}`,
    message: "Votre buddy du jour est prêt à vous écouter anonymement !",
    type: 'success',
    timestamp: new Date()
  });
}
