
import { NotificationService } from '@/lib/notifications';
import { CoachNotification } from '../types';

/**
 * Add a notification to remind the user about something
 */
export async function reminderNotification(
  title: string,
  message: string,
  userId?: string
): Promise<boolean> {
  try {
    await NotificationService.addNotification({
      title,
      message,
      type: 'reminder', // This is now a valid type since we updated the Notification types
      userId
    });
    return true;
  } catch (error) {
    console.error('Error creating reminder notification:', error);
    return false;
  }
}

/**
 * Add a notification about an important event
 */
export async function eventNotification(
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
    console.error('Error creating event notification:', error);
    return false;
  }
}
