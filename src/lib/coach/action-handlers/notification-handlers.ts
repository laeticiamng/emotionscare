
import { notificationService } from '../notification-service';

/**
 * Handler for sending dashboard alerts
 */
export function handleSendDashboardAlert(userId: string, payload: any): void {
  notificationService.addNotification(userId, {
    id: `dashboard-alert-${Date.now()}`,
    message: payload.message,
    type: 'warning',
    timestamp: new Date()
  });
}

/**
 * Handler for sending dashboard notifications
 */
export function handleSendDashboardNotification(userId: string, payload: any): void {
  notificationService.addNotification(userId, {
    id: `dashboard-notif-${Date.now()}`,
    message: payload.message,
    type: 'info',
    timestamp: new Date()
  });
}
