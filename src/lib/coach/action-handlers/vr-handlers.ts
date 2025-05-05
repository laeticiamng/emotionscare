
import { notificationService } from '../notification-service';

/**
 * Handler for starting VR sessions
 */
export function handleStartVRSession(userId: string, payload: any): void {
  console.log(`Starting VR session "${payload.template}" for user ${userId}`);
  notificationService.addNotification(userId, {
    id: `vr-session-${Date.now()}`,
    message: `Session VR "${payload.template}" recommandée pour votre bien-être actuel.`,
    type: 'info',
    timestamp: new Date()
  });
}
