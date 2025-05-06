
import { notificationService } from '../notification-service';
import { ActionHandler } from './action-handler.interface';
import { actionHandlerRegistry } from './action-handler-registry';

/**
 * Handler for starting VR sessions
 */
export class StartVRSessionHandler implements ActionHandler {
  actionType = 'start_vr_session';

  execute(userId: string, payload: any): void {
    console.log(`Starting VR session "${payload.template}" for user ${userId}`);
    notificationService.addNotification(userId, {
      id: `vr-session-${Date.now()}`,
      title: "Session VR recommandée",
      message: `Session VR "${payload.template}" recommandée pour votre bien-être actuel.`,
      type: 'info',
      timestamp: new Date()
    });
  }
}

// Register all VR handlers
actionHandlerRegistry.register(new StartVRSessionHandler());

// Legacy function handler for backward compatibility
export function handleStartVRSession(userId: string, payload: any): void {
  const handler = actionHandlerRegistry.getHandler('start_vr_session');
  if (handler) handler.execute(userId, payload);
}
