
import { NotificationService } from '@/lib/notifications';
import { CoachNotification } from '../types';

/**
 * Add a wellness notification to the user
 */
export async function wellnessNotification(
  title: string,
  message: string,
  userId?: string
): Promise<boolean> {
  try {
    await NotificationService.addNotification({
      title,
      message,
      type: 'info', // Changed from 'wellness' to 'info'
      userId
    });
    return true;
  } catch (error) {
    console.error('Error creating wellness notification:', error);
    return false;
  }
}

/**
 * Add a reminder notification for wellness activities
 */
export async function wellnessReminder(
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
    console.error('Error creating wellness reminder:', error);
    return false;
  }
}

/**
 * Add a notification with wellness tips
 */
export async function wellnessTip(
  title: string,
  message: string,
  userId?: string
): Promise<boolean> {
  try {
    await NotificationService.addNotification({
      title,
      message,
      type: 'info', // Changed from 'tip' to 'info'
      userId
    });
    return true;
  } catch (error) {
    console.error('Error creating wellness tip notification:', error);
    return false;
  }
}
