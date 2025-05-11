
import React, { createContext, useContext, useState } from 'react';
import { EmotionPrediction, Recommendation } from '@/types';

interface PredictiveAnalyticsContextType {
  isLoading: boolean;
  error: string;
  currentPredictions: EmotionPrediction;
  generatePrediction: (userData?: any) => Promise<EmotionPrediction>;
  resetPredictions: () => void;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  availableFeatures: Array<{
    name: string;
    description: string;
    enabled: boolean;
    toggleFeature: (enabled: boolean) => void;
    priority: number;
  }>;
  predictionEnabled: boolean;
  setPredictionEnabled: (enabled: boolean) => void;
  generatePredictions: () => void;
  recommendations: Recommendation[];
}

const defaultPrediction: EmotionPrediction = {
  predictedEmotion: '',
  emotion: '',
  probability: 0,
  confidence: 0,
  triggers: [],
  recommendations: []
};

const PredictiveAnalyticsContext = createContext<PredictiveAnalyticsContextType>({
  isLoading: false,
  error: '',
  currentPredictions: defaultPrediction,
  generatePrediction: async () => defaultPrediction,
  resetPredictions: () => {},
  isEnabled: false,
  setEnabled: () => {},
  availableFeatures: [],
  predictionEnabled: false,
  setPredictionEnabled: () => {},
  generatePredictions: () => {},
  recommendations: []
});

export const PredictiveAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPredictions, setCurrentPredictions] = useState<EmotionPrediction>(defaultPrediction);
  const [isEnabled, setIsEnabled] = useState(true);
  const [predictionEnabled, setPredictionEnabled] = useState(true);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  
  const availableFeatures = [
    {
      name: "Prédiction émotionnelle",
      description: "Prédire vos émotions futures basées sur les données historiques",
      enabled: true,
      toggleFeature: (enabled: boolean) => {},
      priority: 9
    },
    {
      name: "Détection de stress",
      description: "Alertes préventives pour les niveaux de stress élevés",
      enabled: true,
      toggleFeature: (enabled: boolean) => {},
      priority: 8
    },
    {
      name: "Recommandations proactives",
      description: "Suggestions d'activités basées sur vos habitudes",
      enabled: false,
      toggleFeature: (enabled: boolean) => {},
      priority: 7
    }
  ];

  const generatePrediction = async (userData?: any): Promise<EmotionPrediction> => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPrediction: EmotionPrediction = {
        predictedEmotion: 'calm',
        emotion: 'calm',
        probability: 0.85,
        confidence: 0.82,
        triggers: ['work deadline', 'lack of sleep'],
        recommendations: ['Take a short break', 'Practice deep breathing']
      };
      
      setCurrentPredictions(mockPrediction);
      return mockPrediction;
    } catch (err) {
      setError('Failed to generate prediction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetPredictions = () => {
    setCurrentPredictions(defaultPrediction);
  };

  const generatePredictions = () => {
    generatePrediction().then(() => {
      // Generate some mock recommendations
      setRecommendations([
        {
          id: '1',
          title: 'Prendre une pause méditative',
          description: 'Prenez 5 minutes pour vous recentrer et respirer profondément',
          category: 'wellbeing',
          priority: 9,
          confidence: 0.92
        },
        {
          id: '2',
          title: 'Écouter un podcast inspirant',
          description: 'Découvrez notre sélection de contenus audio pour vous motiver',
          category: 'content',
          priority: 8,
          confidence: 0.85
        }
      ]);
    });
  };

  return (
    <PredictiveAnalyticsContext.Provider 
      value={{ 
        isLoading, 
        error, 
        currentPredictions, 
        generatePrediction, 
        resetPredictions,
        isEnabled,
        setEnabled: setIsEnabled,
        availableFeatures,
        predictionEnabled,
        setPredictionEnabled,
        generatePredictions,
        recommendations
      }}
    >
      {children}
    </PredictiveAnalyticsContext.Provider>
  );
};

export const usePredictiveAnalytics = () => useContext(PredictiveAnalyticsContext);
