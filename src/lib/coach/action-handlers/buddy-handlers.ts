
import { NotificationService } from '@/lib/notifications';
import { CoachNotification } from '../types';

/**
 * Send a notification about buddy matching
 */
export async function buddyMatchNotification(
  title: string,
  message: string,
  userId?: string
): Promise<boolean> {
  try {
    await NotificationService.addNotification({
      title,
      message,
      type: 'success',
      userId
    });
    return true;
  } catch (error) {
    console.error('Error creating buddy match notification:', error);
    return false;
  }
}

/**
 * Create a reminder notification for buddy system
 */
export async function buddyReminderNotification(
  title: string,
  message: string,
  userId?: string
): Promise<boolean> {
  try {
    await NotificationService.addNotification({
      title,
      message,
      type: 'info', // Changed from 'reminder' to 'info'
      userId
    });
    return true;
  } catch (error) {
    console.error('Error creating buddy reminder notification:', error);
    return false;
  }
}
