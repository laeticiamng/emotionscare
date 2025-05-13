
import { notificationService } from '../notification-service';
import { ActionHandler } from './action-handler.interface';
import { actionHandlerRegistry } from './action-handler-registry';

/**
 * Handler for sending simple notifications
 */
export class SendNotificationHandler implements ActionHandler {
  actionType = 'send_notification';

  execute(userId: string, payload: any): void {
    notificationService.addNotification(userId, {
      title: payload.title || "Notification",
      message: payload.message,
      type: payload.type || 'info',
    });
  }
}

/**
 * Handler for sending scheduled notifications
 */
export class ScheduleNotificationHandler implements ActionHandler {
  actionType = 'schedule_notification';

  execute(userId: string, payload: any): void {
    notificationService.addNotification(userId, {
      title: payload.title || "Notification programmée",
      message: payload.message,
      type: payload.type || 'info',
    });
  }
}

// Register all notification handlers
actionHandlerRegistry.register(new SendNotificationHandler());
actionHandlerRegistry.register(new ScheduleNotificationHandler());
