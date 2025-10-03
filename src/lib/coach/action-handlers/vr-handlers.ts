
import { NotificationService } from '@/lib/notifications';
import { CoachNotification } from '../types';

/**
 * Add a notification for VR session recommendation
 */
export async function recommendVRSession(
  title: string,
  message: string,
  userId?: string
): Promise<boolean> {
  try {
    await NotificationService.addNotification({
      title,
      message,
      type: 'info', // Changed from 'recommendation' to 'info'
      userId
    });
    return true;
  } catch (error) {
    console.error('Error creating VR recommendation notification:', error);
    return false;
  }
}
