
import { notificationService } from '../notification-service';
import { ActionHandler } from './action-handler.interface';
import { actionHandlerRegistry } from './action-handler-registry';

/**
 * Handler for buddy interactions
 */
export class ActivateBuddySessionHandler implements ActionHandler {
  actionType = 'activate_buddy_session';

  execute(userId: string, payload: any): void {
    console.log(`Activating buddy session for user ${userId}`);
    notificationService.addNotification(userId, {
      title: "Buddy Ready",
      message: "Your virtual buddy is ready to assist you.",
      type: 'info',
    });
  }
}

/**
 * Handler for buddy reminder
 */
export class BuddyReminderHandler implements ActionHandler {
  actionType = 'buddy_reminder';

  execute(userId: string, payload: any): void {
    console.log(`Sending buddy reminder for user ${userId}`);
    notificationService.addNotification(userId, {
      title: "Buddy Reminder",
      message: payload.message || "Your buddy has a reminder for you.",
      type: 'info',
    });
  }
}

// Register all buddy handlers
actionHandlerRegistry.register(new ActivateBuddySessionHandler());
actionHandlerRegistry.register(new BuddyReminderHandler());
