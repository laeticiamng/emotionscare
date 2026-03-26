// @ts-nocheck
import { useState, useEffect } from 'react';
import { EmotionResult } from '@/types/emotion';
import { logger } from '@/lib/logger';

interface EmotionChartData {
  name: string;
  value: number;
  color: string;
}

export function useEmotionVisualizer(emotions: EmotionResult[], timeframe: string = 'week') {
  const [chartData, setChartData] = useState<EmotionChartData[]>([]);
  const [dominantEmotion, setDominantEmotion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!emotions || emotions.length === 0) {
      setLoading(false);
      return;
    }

    // Process emotions data for visualization
    const processData = () => {
      setLoading(true);
      
      try {
        // Count occurrences of each emotion
        const emotionCounts: Record<string, number> = {};
        emotions.forEach(entry => {
          const emotionName = entry.primaryEmotion || entry.emotion || 'neutral';
          emotionCounts[emotionName] = (emotionCounts[emotionName] || 0) + 1;
        });
        
        // Convert to chart format with colors
        const data = Object.keys(emotionCounts).map(emotion => {
          return {
            name: emotion,
            value: emotionCounts[emotion],
            color: getEmotionColor(emotion)
          };
        }).sort((a, b) => b.value - a.value);
        
        setChartData(data);
        setDominantEmotion(data[0]?.name || 'neutral');
      } catch (error) {
        logger.error('Error processing emotion data', error as Error, 'UI');
      } finally {
        setLoading(false);
      }
    };
    
    processData();
  }, [emotions, timeframe]);
  
  // Helper function to get color for an emotion
  const getEmotionColor = (emotion: string) => {
    const colorMap: Record<string, string> = {
      'joy': '#FFCC33',
      'happy': '#FFCC33',
      'sad': '#3366CC',
      'sadness': '#3366CC',
      'angry': '#FF3333',
      'anger': '#FF3333',
      'fear': '#9966CC',
      'surprise': '#FF9900',
      'disgust': '#669900',
      'neutral': '#999999',
      'calm': '#66CCCC',
      'anxious': '#CC6699',
      'stressed': '#CC3366',
      'relaxed': '#66CC99'
    };
    
    return colorMap[emotion.toLowerCase()] || '#999999';
  };

  return {
    chartData,
    dominantEmotion,
    loading
  };
}

export default useEmotionVisualizer;
