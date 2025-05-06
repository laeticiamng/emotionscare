
import { notificationService } from '../notification-service';
import { emotionalDataService } from '../emotional-data';
import { getPlaylist } from '@/services/music/playlist-service';
import { ActionHandler } from './action-handler.interface';
import { actionHandlerRegistry } from './action-handler-registry';

/**
 * Handler for checking emotion alerts
 */
export class CheckEmotionAlertHandler implements ActionHandler {
  actionType = 'check_emotion_alert';

  execute(userId: string, data: any): void {
    if (data?.emotion) {
      const { emotion, confidence } = data;
      if (['tristesse', 'colère', 'anxiété'].includes(emotion.toLowerCase()) && confidence > 0.7) {
        notificationService.addNotification(userId, {
          id: `emotion-alert-${Date.now()}`,
          title: "Alerte émotion",
          message: "On dirait que ça n'a pas été facile aujourd'hui. Un petit moment VR pourrait aider ?",
          type: 'info',
          timestamp: new Date()
        });
      }
    }
  }
}

/**
 * Handler for suggesting VR sessions based on emotion
 */
export class SuggestVRSessionHandler implements ActionHandler {
  actionType = 'suggest_vr_session';

  execute(userId: string, data: any): void {
    if (data?.emotion) {
      const emotion = data.emotion.toLowerCase();
      let templateName = '';
      
      if (['tristesse', 'anxiété'].includes(emotion)) {
        templateName = 'Méditation guidée';
      } else if (['colère', 'stress'].includes(emotion)) {
        templateName = 'Relaxation profonde';
      } else if (['joie', 'contentement'].includes(emotion)) {
        templateName = 'Amplification positive';
      } else {
        templateName = 'Équilibre mental';
      }
      
      notificationService.addNotification(userId, {
        id: `vr-suggest-${Date.now()}`,
        title: "Suggestion VR",
        message: `Une session VR "${templateName}" pourrait être bénéfique pour vous en ce moment.`,
        type: 'info',
        timestamp: new Date()
      });
    }
  }
}

/**
 * Handler for updating music playlist based on emotion
 */
export class UpdateMusicPlaylistHandler implements ActionHandler {
  actionType = 'update_music_playlist';

  async execute(userId: string, data: any): Promise<void> {
    if (data?.emotion) {
      try {
        const emotion = data.emotion.toLowerCase();
        const playlist = await getPlaylist(emotion);
        console.log(`Updated playlist for ${userId} based on emotion: ${emotion}`);
      } catch (error) {
        console.error('Failed to update music playlist:', error);
      }
    }
  }
}

/**
 * Handler for checking trend alerts
 */
export class CheckTrendAlertHandler implements ActionHandler {
  actionType = 'check_trend_alert';

  execute(userId: string, data: any): void {
    emotionalDataService.updateUserEmotionalData(userId, data);
    
    if (emotionalDataService.hasNegativeTrend(userId)) {
      notificationService.addNotification(userId, {
        id: `trend-alert-${Date.now()}`,
        title: "Tendance émotionnelle",
        message: "J'ai remarqué une tendance émotionnelle qui pourrait mériter attention. Des exercices de bien-être sont disponibles.",
        type: 'warning',
        timestamp: new Date()
      });
    }
  }
}

/**
 * Handler for recording emotion data
 */
export class RecordEmotionDataHandler implements ActionHandler {
  actionType = 'record_emotion_data';

  execute(userId: string, data: any): void {
    if (data?.emotion) {
      emotionalDataService.updateUserEmotionalData(userId, data);
    }
  }
}

// Register all emotion handlers
actionHandlerRegistry.register(new CheckEmotionAlertHandler());
actionHandlerRegistry.register(new SuggestVRSessionHandler());
actionHandlerRegistry.register(new UpdateMusicPlaylistHandler());
actionHandlerRegistry.register(new CheckTrendAlertHandler());
actionHandlerRegistry.register(new RecordEmotionDataHandler());

// Legacy function handlers for backward compatibility
export function handleCheckEmotionAlert(userId: string, data: any): void {
  const handler = actionHandlerRegistry.getHandler('check_emotion_alert');
  if (handler) handler.execute(userId, data);
}

export function handleSuggestVRSession(userId: string, data: any): void {
  const handler = actionHandlerRegistry.getHandler('suggest_vr_session');
  if (handler) handler.execute(userId, data);
}

export async function handleUpdateMusicPlaylist(userId: string, data: any): Promise<void> {
  const handler = actionHandlerRegistry.getHandler('update_music_playlist');
  if (handler) await handler.execute(userId, data);
}

export function handleCheckTrendAlert(userId: string, data: any): void {
  const handler = actionHandlerRegistry.getHandler('check_trend_alert');
  if (handler) handler.execute(userId, data);
}

export function handleRecordEmotionData(userId: string, data: any): void {
  const handler = actionHandlerRegistry.getHandler('record_emotion_data');
  if (handler) handler.execute(userId, data);
}
