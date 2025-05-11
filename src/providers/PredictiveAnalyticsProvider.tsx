
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Recommendation {
  id: string;
  title: string;
  description: string;
  confidence: number;
  route?: string;
  icon?: string;
}

interface PredictiveAnalyticsContextType {
  recommendations: Recommendation[];
  setRecommendations: (recs: Recommendation[]) => void;
  generatePredictions: () => Promise<void>;
}

const PredictiveAnalyticsContext = createContext<PredictiveAnalyticsContextType>({
  recommendations: [],
  setRecommendations: () => {},
  generatePredictions: async () => {}
});

interface PredictiveAnalyticsProviderProps {
  children: ReactNode;
}

export const PredictiveAnalyticsProvider: React.FC<PredictiveAnalyticsProviderProps> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

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
  };

  return (
    <PredictiveAnalyticsContext.Provider
      value={{
        recommendations,
        setRecommendations,
        generatePredictions
      }}
    >
      {children}
    </PredictiveAnalyticsContext.Provider>
  );
};

export const usePredictiveAnalytics = () => useContext(PredictiveAnalyticsContext);
