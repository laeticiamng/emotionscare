
import { useState, useEffect } from 'react';
import { EmotionResult } from '@/types/emotion';

// Mock emotion data
const mockEmotions: EmotionResult[] = [
  {
    id: '1',
    emotion: 'joy',
    confidence: 0.85,
    intensity: 0.75,
    source: 'voice',
    timestamp: new Date().toISOString(),
    recommendations: [
      { title: 'Maintain this mood', description: 'Continue your current activities' },
      { title: 'Share your joy', description: 'Connect with a friend or family member' }
    ]
  },
  {
    id: '2',
    emotion: 'neutral',
    confidence: 0.92,
    intensity: 0.40,
    source: 'text',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    recommendations: [
      { title: 'Boost your mood', description: 'Try a quick walk outside' },
      { title: 'Practice mindfulness', description: '5-minute meditation' }
    ]
  },
  {
    id: '3',
    emotion: 'stressed',
    confidence: 0.78,
    intensity: 0.65,
    source: 'emoji',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    recommendations: [
      { title: 'Relax your mind', description: 'Deep breathing exercise' },
      { title: 'Take a break', description: '10 minutes away from screens' }
    ]
  }
];

export const useScanPage = (userId?: string) => {
  const [isScanning, setIsScanning] = useState(false);
  const [emotions, setEmotions] = useState<EmotionResult[]>(mockEmotions);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulate loading emotions for a user
  useEffect(() => {
    if (userId) {
      // In a real app, we would fetch emotions from an API
      // For now, we just use the mock data
      // setEmotions(mockEmotions);
    }
  }, [userId]);

  const startScan = () => {
    setIsScanning(true);
    setIsModalOpen(true);
  };

  const cancelScan = () => {
    setIsScanning(false);
    setIsModalOpen(false);
  };

  const completeScan = (result: EmotionResult) => {
    setIsScanning(false);
    setIsModalOpen(false);
    
    // Add the new emotion to the list
    const newEmotion: EmotionResult = {
      ...result,
      id: `emotion-${Date.now()}`,
      timestamp: new Date().toISOString() // Ensure we have a timestamp
    };
    
    setCurrentEmotion(newEmotion);
    setEmotions(prev => [newEmotion, ...prev]);

    // In a real app, we would save this to a database
    console.log('New emotion recorded:', newEmotion);
    
    return newEmotion;
  };

  return {
    emotions,
    currentEmotion,
    isScanning,
    isModalOpen,
    startScan,
    cancelScan,
    completeScan,
    setIsModalOpen
  };
};

export default useScanPage;
