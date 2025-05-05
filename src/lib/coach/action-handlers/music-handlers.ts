
import { notificationService } from '../notification-service';

/**
 * Handler for playing music presets
 */
export function handlePlayMusicPreset(userId: string, payload: any): void {
  console.log(`Playing music preset "${payload.preset}" for user ${userId}`);
  notificationService.addNotification(userId, {
    id: `music-preset-${Date.now()}`,
    message: `Playlist "${payload.preset}" activée pour accompagner votre moment.`,
    type: 'info',
    timestamp: new Date()
  });
}
