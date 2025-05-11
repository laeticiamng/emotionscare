
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { EmotionPrediction, Recommendation } from '@/types';

interface PredictiveAnalyticsContextType {
  isLoading: boolean;
  error: string;
  currentPredictions: EmotionPrediction;
  recommendations: Recommendation[];
  availableFeatures: string[];
  predictionEnabled: boolean;
  setPredictionEnabled: (enabled: boolean) => void;
  generatePrediction: (userData?: any) => Promise<EmotionPrediction>;
  resetPredictions: () => void;
  addRecommendation: (recommendation: Recommendation) => void;
}

const initialState: EmotionPrediction = {
  predictedEmotion: '',
  probability: 0,
  confidence: 0,
  triggers: [],
  recommendations: []
};

const PredictiveAnalyticsContext = createContext<PredictiveAnalyticsContextType>({
  isLoading: false,
  error: '',
  currentPredictions: initialState,
  recommendations: [],
  availableFeatures: [],
  predictionEnabled: false,
  setPredictionEnabled: () => {},
  generatePrediction: async () => initialState,
  resetPredictions: () => {},
  addRecommendation: () => {}
});

export const PredictiveAnalyticsProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPredictions, setCurrentPredictions] = useState<EmotionPrediction>(initialState);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [predictionEnabled, setPredictionEnabled] = useState(true);
  
  // Available predictive features (e.g., "mood", "stress", "sleep")
  const [availableFeatures] = useState<string[]>([
    'mood_prediction', 
    'burnout_risk', 
    'stress_levels',
    'team_dynamics',
    'well_being_optimization'
  ]);

  // Generate a prediction based on user data
  const generatePrediction = async (userData?: any): Promise<EmotionPrediction> => {
    if (!predictionEnabled) {
      return currentPredictions;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // This is a mock implementation that would be replaced with an actual API call
      // In a real app, this would call a backend endpoint with the user data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response
      const mockPrediction: EmotionPrediction = {
        predictedEmotion: 'contentment',
        probability: 0.85,
        confidence: 0.78,
        triggers: ['work pressure', 'sleep quality', 'recent accomplishments'],
        recommendations: [
          'Take short 5-minute breaks every hour',
          'Consider a short meditation session',
          'Engage in social interactions during lunch'
        ]
      };
      
      setCurrentPredictions(mockPrediction);
      
      // Generate recommendations based on prediction
      const newRecommendations: Recommendation[] = [
        {
          id: '1',
          title: 'Schedule small breaks',
          description: 'Taking regular short breaks can help maintain your current positive emotional state.',
          category: 'work',
          priority: 2,
          confidence: 0.85
        },
        {
          id: '2',
          title: 'Sleep optimization',
          description: 'Maintaining your current sleep schedule appears beneficial for your emotional balance.',
          category: 'health',
          priority: 1,
          confidence: 0.78
        },
        {
          id: '3',
          title: 'Social engagement',
          description: 'Your recent social interactions are contributing positively to your emotional state.',
          category: 'social',
          priority: 3,
          confidence: 0.9
        }
      ];
      
      setRecommendations(newRecommendations);
      
      return mockPrediction;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate prediction';
      setError(errorMsg);
      return initialState;
    } finally {
      setIsLoading(false);
    }
  };

  // Reset predictions to initial state
  const resetPredictions = () => {
    setCurrentPredictions(initialState);
    setRecommendations([]);
    setError('');
  };
  
  // Add a new recommendation
  const addRecommendation = (recommendation: Recommendation) => {
    setRecommendations(prev => [...prev, recommendation]);
  };

  return (
    <PredictiveAnalyticsContext.Provider 
      value={{
        isLoading,
        error,
        currentPredictions,
        recommendations,
        availableFeatures,
        predictionEnabled,
        setPredictionEnabled,
        generatePrediction,
        resetPredictions,
        addRecommendation
      }}
    >
      {children}
    </PredictiveAnalyticsContext.Provider>
  );
};

export const usePredictiveAnalytics = () => useContext(PredictiveAnalyticsContext);
