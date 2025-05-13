
import { notificationService } from '../notification-service';
import { ActionHandler } from './action-handler.interface';
import { actionHandlerRegistry } from './action-handler-registry';

/**
 * Handler for recommending VR sessions
 */
export class RecommendVRSessionHandler implements ActionHandler {
  actionType = 'recommend_vr_session';

  execute(userId: string, payload: any): void {
    console.log(`Recommending VR session "${payload.sessionType}" for user ${userId}`);
    notificationService.addNotification(userId, {
      title: "Séance de VR recommandée",
      message: `Une séance de VR "${payload.sessionName || payload.sessionType}" pourrait vous aider en ce moment.`,
      type: 'info',
    });
  }
}

// Register all VR handlers
actionHandlerRegistry.register(new RecommendVRSessionHandler());
