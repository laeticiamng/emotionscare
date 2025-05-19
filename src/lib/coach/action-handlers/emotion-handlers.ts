
import { v4 as uuidv4 } from 'uuid';
import emotionalDataService from '../emotional-data-service';

export const emotionActionHandlers = {
  /**
   * Handle recording a new emotion
   */
  recordEmotion: async (payload: any) => {
    const { emotion, intensity, context } = payload;
    
    if (!emotion) {
      throw new Error('Emotion is required');
    }
    
    // Add the emotion to the emotional data service
    const result = emotionalDataService.addEmotionalData({
      emotion,
      intensity: intensity || 0.5,
      timestamp: new Date().toISOString(),
      context,
      user_id: 'default-user', // Adding required user_id field
    });
    
    return {
      success: true,
      result
    };
  },
  
  /**
   * Handle updating an existing emotion
   */
  updateEmotion: async (payload: any) => {
    const { id, emotion, intensity, context } = payload;
    
    if (!id) {
      throw new Error('Emotion ID is required');
    }
    
    // Update the emotion in the emotional data service
    const result = emotionalDataService.addEmotionalData({
      emotion,
      intensity: intensity || 0.5,
      timestamp: new Date().toISOString(),
      context,
      user_id: 'default-user', // Adding required user_id field
    });
    
    return {
      success: true,
      result
    };
  },
  
  /**
   * Handle tracking emotion over time
   */
  trackEmotionTrend: async (payload: any) => {
    const { period } = payload;
    
    // Get all emotional data
    const allData = emotionalDataService.getAllEmotionalData();
    
    // Filter based on period if specified
    let filteredData = allData;
    if (period) {
      const now = new Date();
      const periodStart = new Date();
      
      switch (period) {
        case 'day':
          periodStart.setDate(now.getDate() - 1);
          break;
        case 'week':
          periodStart.setDate(now.getDate() - 7);
          break;
        case 'month':
          periodStart.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filteredData = allData.filter(item => {
        const itemDate = new Date(item.timestamp);
        return itemDate >= periodStart && itemDate <= now;
      });
    }
    
    // Calculate trends
    const trends: Record<string, { count: number, totalIntensity: number }> = {};
    
    filteredData.forEach(item => {
      if (!trends[item.emotion]) {
        trends[item.emotion] = { count: 0, totalIntensity: 0 };
      }
      
      trends[item.emotion].count++;
      trends[item.emotion].totalIntensity += item.intensity;
    });
    
    // Format results
    const results = Object.entries(trends).map(([emotion, data]) => ({
      emotion,
      count: data.count,
      avgIntensity: data.totalIntensity / data.count
    }));
    
    // Save the tracking result
    emotionalDataService.addEmotionalData({
      emotion: 'tracking',
      intensity: 0,
      timestamp: new Date().toISOString(),
      context: JSON.stringify(results),
      user_id: 'default-user', // Adding required user_id field
    });
    
    return {
      success: true,
      results
    };
  }
};
