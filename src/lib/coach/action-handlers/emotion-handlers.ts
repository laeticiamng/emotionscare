
import { EmotionalDataService } from '../emotional-data-service';
import { EmotionalData } from '../types';
import { NotificationService } from '@/lib/notifications';

// Initialize services
const emotionalDataService = new EmotionalDataService();

/**
 * Add a notification based on an emotional result
 */
export async function emotionNotification(
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
    console.error('Error creating emotion notification:', error);
    return false;
  }
}

/**
 * Save emotional data from a scan
 */
export async function saveEmotionalData(
  emotion: string,
  intensity: number,
  userId?: string
): Promise<boolean> {
  try {
    const emotionalData: EmotionalData = {
      userId: userId || 'anonymous',
      emotion,
      intensity,
      timestamp: new Date().toISOString(),
      source: 'scan'
    };
    
    await emotionalDataService.saveEmotionalData(emotionalData);
    return true;
  } catch (error) {
    console.error('Error saving emotional data:', error);
    return false;
  }
}

/**
 * Process emotion scan results and generate appropriate feedback
 */
export async function processEmotionScanResults(
  emotion: string,
  intensity: number,
  userId?: string
): Promise<boolean> {
  try {
    // Save the emotional data
    const emotionalData: Partial<EmotionalData> = {
      userId: userId || 'anonymous',
      emotion,
      intensity,
      timestamp: new Date().toISOString(),
      source: 'scan'
    };
    
    await emotionalDataService.saveEmotionalData(emotionalData as EmotionalData);
    
    // Update user emotional trends
    await emotionalDataService.updateEmotionTrend(userId || 'anonymous');
    
    // If negative trend is detected, create notification
    if (await emotionalDataService.checkNegativeTrend(userId || 'anonymous')) {
      await NotificationService.addNotification({
        title: 'Emotional Wellness Check-in',
        message: 'We noticed your emotional well-being might need some attention. Would you like to talk to your coach?',
        type: 'warning',
        userId
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error processing emotion scan results:', error);
    return false;
  }
}

/**
 * Save AI feedback for an emotional scan
 */
export async function saveEmotionalFeedback(
  emotion: string,
  feedback: string,
  userId?: string
): Promise<boolean> {
  try {
    // Update emotional data with feedback
    const emotionalData: Partial<EmotionalData> = {
      userId: userId || 'anonymous',
      emotion,
      feedback,
      timestamp: new Date().toISOString(),
      source: 'feedback'
    };
    
    await emotionalDataService.saveEmotionalData(emotionalData as EmotionalData);
    await emotionalDataService.updateEmotionTrend(userId || 'anonymous');
    
    return true;
  } catch (error) {
    console.error('Error saving emotional feedback:', error);
    return false;
  }
}
