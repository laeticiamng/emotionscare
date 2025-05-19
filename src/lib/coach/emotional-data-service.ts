
import { v4 as uuidv4 } from 'uuid';
import { EmotionalData } from '@/hooks/coach/types';
import { EmotionResult } from '@/types/emotion';

// In-memory storage for emotional data
let emotionalData: EmotionalData[] = [];

class EmotionalDataService {
  // Get all emotional data
  getAllEmotionalData(): EmotionalData[] {
    return [...emotionalData];
  }
  
  // Get emotional data by ID
  getEmotionalDataById(id: string): EmotionalData | undefined {
    return emotionalData.find(data => data.id === id);
  }
  
  // Add new emotional data
  addEmotionalData(data: Omit<EmotionalData, 'id'>): EmotionalData {
    const newData = {
      id: uuidv4(),
      ...data,
      timestamp: data.timestamp || new Date().toISOString()
    };
    
    emotionalData.push(newData);
    return newData;
  }
  
  // Update emotional data
  updateEmotionalData(id: string, data: Partial<EmotionalData>): EmotionalData | null {
    const index = emotionalData.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    emotionalData[index] = {
      ...emotionalData[index],
      ...data
    };
    
    return emotionalData[index];
  }
  
  // Delete emotional data
  deleteEmotionalData(id: string): boolean {
    const initialLength = emotionalData.length;
    emotionalData = emotionalData.filter(item => item.id !== id);
    
    return emotionalData.length < initialLength;
  }
  
  // Clear all emotional data
  clearEmotionalData(): void {
    emotionalData = [];
  }
  
  // Convert from EmotionResult to EmotionalData
  convertFromEmotionResult(result: EmotionResult): EmotionalData {
    return {
      id: result.id || uuidv4(),
      user_id: result.userId || 'unknown',
      emotion: result.emotion,
      intensity: result.intensity || result.score || 5,
      timestamp: result.timestamp || new Date().toISOString(),
      context: result.text || undefined,
      source: result.source || 'system',
      tags: result.tags || []
    };
  }
  
  // For compatibility with existing code
  saveEmotionalData = this.addEmotionalData;
}

const emotionalDataService = new EmotionalDataService();
export default emotionalDataService;
