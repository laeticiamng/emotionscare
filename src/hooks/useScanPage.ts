
import { useState, useEffect } from 'react';
import { EmotionResult } from '@/types/emotion';
import { Emotion } from '@/types/emotion';

export function useScanPage() {
  const [currentTab, setCurrentTab] = useState('voice');
  const [scanHistory, setScanHistory] = useState<EmotionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Convert EmotionResult to Emotion for compatibility
  const convertToEmotion = (result: EmotionResult): Emotion => {
    return {
      id: result.id,
      name: result.emotion,
      label: result.emotion,
      color: getColorForEmotion(result.emotion),
      intensity: result.intensity || 0,
      confidence: result.confidence,
      date: result.date || result.timestamp,
      source: result.source,
      user_id: result.user_id || result.userId,
      score: result.score,
      text: result.text,
      feedback: result.feedback,
      transcript: result.transcript,
      audioUrl: result.audioUrl || result.audio_url
    };
  };
  
  // Helper function to determine color based on emotion
  const getColorForEmotion = (emotion: string): string => {
    const emotionColors: Record<string, string> = {
      joy: '#FFD700',
      happiness: '#FFD700',
      sadness: '#6495ED',
      anger: '#FF4500',
      fear: '#800080',
      surprise: '#FF69B4',
      disgust: '#32CD32',
      neutral: '#A9A9A9',
      calm: '#87CEEB',
      anxiety: '#FFA07A'
    };
    
    return emotionColors[emotion.toLowerCase()] || '#A9A9A9';
  };
  
  // Load scan history
  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockHistory: EmotionResult[] = [
          {
            id: 'scan-1',
            date: new Date(Date.now() - 86400000).toISOString(),
            emotion: 'joy',
            confidence: 0.87,
            intensity: 75,
            source: 'voice'
          },
          {
            id: 'scan-2',
            date: new Date(Date.now() - 172800000).toISOString(),
            emotion: 'calm',
            confidence: 0.91,
            intensity: 65,
            source: 'text'
          }
        ];
        
        setScanHistory(mockHistory);
      } catch (error) {
        console.error('Error loading scan history:', error);
        setErrorMessage('Impossible de charger l\'historique des scans.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, []);
  
  // Handle new emotion scan result
  const handleScanResult = (result: EmotionResult) => {
    setScanHistory(prev => [result, ...prev]);
  };
  
  return {
    currentTab,
    setCurrentTab,
    scanHistory,
    isLoading,
    errorMessage,
    handleScanResult,
    convertToEmotion
  };
}

export default useScanPage;
