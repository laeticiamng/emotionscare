
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Recommendation } from '@/types';

interface EmotionPrediction {
  emotion: string;
  probability: number;
  confidence?: number;
  triggers?: string[];
  recommendations?: string[];
}

interface PredictiveAnalyticsContextType {
  isLoading: boolean;
  error: string;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  currentPredictions: EmotionPrediction;
  recommendations: Recommendation[];
  availableFeatures: string[];
  predictionEnabled: boolean;
  setPredictionEnabled: (enabled: boolean) => void;
  generatePredictions: (userData?: any) => Promise<void>;
  generatePrediction: (userData?: any) => Promise<EmotionPrediction>;
  resetPredictions: () => void;
}

const PredictiveAnalyticsContext = createContext<PredictiveAnalyticsContextType>({
  isLoading: false,
  error: '',
  isEnabled: false,
  setEnabled: () => {},
  currentPredictions: { emotion: '', probability: 0, confidence: 0 },
  recommendations: [],
  availableFeatures: [],
  predictionEnabled: false,
  setPredictionEnabled: () => {},
  generatePredictions: async () => {},
  generatePrediction: async () => ({ emotion: '', probability: 0 }),
  resetPredictions: () => {}
});

interface PredictiveAnalyticsProviderProps {
  children: ReactNode;
}

export const PredictiveAnalyticsProvider: React.FC<PredictiveAnalyticsProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [predictionEnabled, setPredictionEnabled] = useState(false);
  const [currentPredictions, setCurrentPredictions] = useState<EmotionPrediction>({ 
    emotion: '', 
    probability: 0,
    confidence: 0
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  
  const availableFeatures = [
    'predictive-mood',
    'preventive-alerts',
    'personalized-recommendations'
  ];

  const generatePredictions = async (userData?: any) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Mock prediction generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const emotions = ['calm', 'happy', 'anxious', 'sad', 'energetic'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomProbability = Math.round((Math.random() * 40 + 60) * 100) / 100; // 60-100%
      const randomConfidence = Math.round((Math.random() * 30 + 70) * 100) / 100; // 70-100%
      
      const prediction: EmotionPrediction = {
        emotion: randomEmotion,
        probability: randomProbability,
        confidence: randomConfidence,
        triggers: ['work stress', 'lack of sleep', 'physical activity'],
        recommendations: [
          'Take a short break',
          'Practice deep breathing',
          'Listen to calming music'
        ]
      };
      
      setCurrentPredictions(prediction);
      
      // Create mock Recommendation objects
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          title: 'Take a short break',
          description: 'Step away from your work for 5-10 minutes',
          category: 'wellness',
          priority: 1
        },
        {
          id: '2',
          title: 'Practice deep breathing',
          description: 'Try 4-7-8 breathing technique for relaxation',
          category: 'wellness',
          priority: 2
        }
      ];
      
      setRecommendations(mockRecommendations);
      
    } catch (err) {
      console.error('Error generating predictions:', err);
      setError('Failed to generate predictions');
    } finally {
      setIsLoading(false);
    }
  };

  const generatePrediction = async (userData?: any): Promise<EmotionPrediction> => {
    try {
      // Mock prediction generation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const emotions = ['calm', 'happy', 'anxious', 'sad', 'energetic'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomProbability = Math.round((Math.random() * 40 + 60) * 100) / 100; // 60-100%
      const randomConfidence = Math.round((Math.random() * 30 + 70) * 100) / 100; // 70-100%
      
      return {
        emotion: randomEmotion,
        probability: randomProbability,
        confidence: randomConfidence,
        triggers: ['work stress', 'lack of sleep', 'physical activity'],
        recommendations: [
          'Take a short break',
          'Practice deep breathing',
          'Listen to calming music'
        ]
      };
      
    } catch (error) {
      console.error('Error in generatePrediction:', error);
      return { emotion: 'neutral', probability: 50, confidence: 50 };
    }
  };

  const resetPredictions = () => {
    setCurrentPredictions({ emotion: '', probability: 0, confidence: 0 });
    setRecommendations([]);
  };

  return (
    <PredictiveAnalyticsContext.Provider
      value={{
        isLoading,
        error,
        isEnabled,
        setEnabled: setIsEnabled,
        currentPredictions,
        recommendations,
        availableFeatures,
        predictionEnabled,
        setPredictionEnabled,
        generatePredictions,
        generatePrediction,
        resetPredictions
      }}
    >
      {children}
    </PredictiveAnalyticsContext.Provider>
  );
};

export const usePredictiveAnalytics = () => useContext(PredictiveAnalyticsContext);
