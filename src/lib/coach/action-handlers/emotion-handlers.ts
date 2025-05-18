
import { EmotionalData } from '@/types/emotional-data';
import { emotionalDataService } from '../emotional-data-service';

/**
 * Handles storing a new emotional data entry
 */
export async function handleEmotionDetected(
  userId: string,
  emotion: string,
  intensity: number = 0.5,
  source: string = 'scan'
): Promise<boolean> {
  try {
    // Create emotional data entry with the detected emotion
    const emotionalData: EmotionalData = {
      id: `emotion-${Date.now()}`,
      user_id: userId, // Using snake_case as the official property
      emotion: emotion,
      intensity: intensity,
      timestamp: new Date().toISOString(),
      source: source
    };
    
    // Store the data
    await emotionalDataService.saveEmotionalData(emotionalData);
    return true;
  } catch (error) {
    console.error('Failed to handle emotion detection:', error);
    return false;
  }
}

/**
 * Updates an existing emotional data entry
 */
export async function handleEmotionFeedback(
  userId: string,
  emotionId: string,
  feedback: string
): Promise<boolean> {
  try {
    // Update emotional data with user feedback
    const update: Partial<EmotionalData> = {
      user_id: userId, // Using snake_case as the official property
      id: emotionId,
      metadata: {
        userFeedback: feedback,
        feedbackTimestamp: new Date().toISOString()
      }
    };
    
    await emotionalDataService.updateEmotionalData(emotionId, update);
    return true;
  } catch (error) {
    console.error('Failed to update emotion with feedback:', error);
    return false;
  }
}

/**
 * Records a manual emotion entry from the user
 */
export async function handleManualEmotionEntry(
  userId: string,
  emotion: string,
  intensity: number,
  notes?: string,
  context?: string
): Promise<boolean> {
  try {
    // Create emotional data entry with the user's manual input
    const emotionalData: Partial<EmotionalData> = {
      id: `emotion-manual-${Date.now()}`,
      user_id: userId, // Using snake_case as the official property
      emotion,
      intensity,
      timestamp: new Date().toISOString(),
      source: 'manual',
      context,
      text: notes
    };
    
    await emotionalDataService.saveEmotionalData(emotionalData as EmotionalData);
    return true;
  } catch (error) {
    console.error('Failed to save manual emotion entry:', error);
    return false;
  }
}
