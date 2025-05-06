
import { notificationService } from '../notification-service';
import { ActionHandler } from './action-handler.interface';
import { actionHandlerRegistry } from './action-handler-registry';

/**
 * Handler for playing music presets
 */
export class PlayMusicPresetHandler implements ActionHandler {
  actionType = 'play_music_preset';

  execute(userId: string, payload: any): void {
    console.log(`Playing music preset "${payload.preset}" for user ${userId}`);
    notificationService.addNotification(userId, {
      id: `music-preset-${Date.now()}`,
      title: "Playlist activée",
      message: `Playlist "${payload.preset}" activée pour accompagner votre moment.`,
      type: 'info',
      timestamp: new Date()
    });
  }
}

// Register all music handlers
actionHandlerRegistry.register(new PlayMusicPresetHandler());

// Legacy function handler for backward compatibility
export function handlePlayMusicPreset(userId: string, payload: any): void {
  const handler = actionHandlerRegistry.getHandler('play_music_preset');
  if (handler) handler.execute(userId, payload);
}
