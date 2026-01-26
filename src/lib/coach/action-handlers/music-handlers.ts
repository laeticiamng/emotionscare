// @ts-nocheck

import { logger } from '@/lib/logger';
import { NotificationService } from '@/lib/notifications';

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
    logger.error('Error creating music recommendation notification', error as Error, 'API');
    return false;
  }
}
