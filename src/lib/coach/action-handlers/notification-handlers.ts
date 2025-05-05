
import { notificationService } from '../notification-service';
import { ActionHandler } from './action-handler.interface';
import { actionHandlerRegistry } from './action-handler-registry';

/**
 * Handler for sending dashboard alerts
 */
export class SendDashboardAlertHandler implements ActionHandler {
  actionType = 'send_dashboard_alert';

  execute(userId: string, payload: any): void {
    notificationService.addNotification(userId, {
      id: `dashboard-alert-${Date.now()}`,
      message: payload.message,
      type: 'warning',
      timestamp: new Date()
    });
  }
}

/**
 * Handler for sending dashboard notifications
 */
export class SendDashboardNotificationHandler implements ActionHandler {
  actionType = 'send_dashboard_notification';

  execute(userId: string, payload: any): void {
    notificationService.addNotification(userId, {
      id: `dashboard-notif-${Date.now()}`,
      message: payload.message,
      type: 'info',
      timestamp: new Date()
    });
  }
}

// Register all notification handlers
actionHandlerRegistry.register(new SendDashboardAlertHandler());
actionHandlerRegistry.register(new SendDashboardNotificationHandler());

// Legacy function handlers for backward compatibility
export function handleSendDashboardAlert(userId: string, payload: any): void {
  const handler = actionHandlerRegistry.getHandler('send_dashboard_alert');
  if (handler) handler.execute(userId, payload);
}

export function handleSendDashboardNotification(userId: string, payload: any): void {
  const handler = actionHandlerRegistry.getHandler('send_dashboard_notification');
  if (handler) handler.execute(userId, payload);
}
