
import { NotificationService } from '@/lib/notifications';
import { CoachNotification } from '../types';

/**
 * Add a notification about music recommendation
 */
export async function musicRecommendationNotification(
  title: string,
  message: string,
  userId?: string
): Promise<boolean> {
  try {
    await NotificationService.addNotification({
      title,
      message,
      type: 'info',
      userId
    });
    return true;
  } catch (error) {
    console.error('Error creating music recommendation notification:', error);
    return false;
  }
}
