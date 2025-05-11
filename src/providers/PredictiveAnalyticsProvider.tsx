
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  route?: string;
  icon?: string;
}

export interface PredictionResult {
  confidence: number;
  emotion: string;
  trends: {
    engagement: number;
    wellbeing: number;
  };
}

interface PredictiveAnalyticsContextType {
  recommendations: Recommendation[];
  setRecommendations: (recs: Recommendation[]) => void;
  generatePredictions: () => Promise<void>;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  currentPredictions: PredictionResult | null;
}

const PredictiveAnalyticsContext = createContext<PredictiveAnalyticsContextType>({
  recommendations: [],
  setRecommendations: () => {},
  generatePredictions: async () => {},
  isEnabled: false,
  setEnabled: () => {},
  currentPredictions: null
});

interface PredictiveAnalyticsProviderProps {
  children: ReactNode;
}

export const PredictiveAnalyticsProvider: React.FC<PredictiveAnalyticsProviderProps> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isEnabled, setEnabled] = useState<boolean>(true);
  const [currentPredictions, setCurrentPredictions] = useState<PredictionResult | null>(null);

  const generatePredictions = async () => {
    // Mock function to generate predictions
    const mockRecommendations: Recommendation[] = [
      {
        id: '1',
        title: 'Séance de méditation recommandée',
        description: 'Basé sur vos tendances de stress, une séance de méditation pourrait être bénéfique.',
        confidence: 0.92,
        route: '/meditation',
        icon: 'brain'
      },
      {
        id: '2',
        title: 'Pause cognitive suggérée',
        description: 'Votre concentration diminue, prenez une courte pause de 5 minutes.',
        confidence: 0.87,
        route: '/break',
        icon: 'coffee'
      }
    ];
    
    setRecommendations(mockRecommendations);
    
    // Set mock current predictions
    setCurrentPredictions({
      confidence: 0.89,
      emotion: 'calme',
      trends: {
        engagement: 0.76,
        wellbeing: 0.82
      }
    });
  };

  return (
    <PredictiveAnalyticsContext.Provider
      value={{
        recommendations,
        setRecommendations,
        generatePredictions,
        isEnabled,
        setEnabled,
        currentPredictions
      }}
    >
      {children}
    </PredictiveAnalyticsContext.Provider>
  );
};

export const usePredictiveAnalytics = () => useContext(PredictiveAnalyticsContext);
