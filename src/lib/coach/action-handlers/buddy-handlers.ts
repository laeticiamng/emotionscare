
import { notificationService } from '../notification-service';
import { ActionHandler } from './action-handler.interface';
import { actionHandlerRegistry } from './action-handler-registry';

/**
 * Handler for finding buddies
 */
export class FindBuddyHandler implements ActionHandler {
  actionType = 'find_buddy';

  execute(userId: string): void {
    console.log(`Finding buddy for user ${userId}`);
    notificationService.addNotification(userId, {
      id: `find-buddy-${Date.now()}`,
      message: "Recherche d'un buddy compatible en cours...",
      type: 'info',
      timestamp: new Date()
    });
  }
}

/**
 * Handler for sending buddy messages
 */
export class SendBuddyMessageHandler implements ActionHandler {
  actionType = 'send_buddy_message';

  execute(userId: string): void {
    notificationService.addNotification(userId, {
      id: `buddy-message-${Date.now()}`,
      message: "Votre buddy du jour est prêt à vous écouter anonymement !",
      type: 'success',
      timestamp: new Date()
    });
  }
}

// Register all buddy handlers
actionHandlerRegistry.register(new FindBuddyHandler());
actionHandlerRegistry.register(new SendBuddyMessageHandler());

// Legacy function handlers for backward compatibility
export function handleFindBuddy(userId: string): void {
  const handler = actionHandlerRegistry.getHandler('find_buddy');
  if (handler) handler.execute(userId, {});
}

export function handleSendBuddyMessage(userId: string): void {
  const handler = actionHandlerRegistry.getHandler('send_buddy_message');
  if (handler) handler.execute(userId, {});
}
