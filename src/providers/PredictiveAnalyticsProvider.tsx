
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Prediction {
  emotion: string;
  confidence: number;
  timestamp: Date;
  context?: string;
}

interface PredictiveAnalyticsContextType {
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  currentPredictions: Prediction | null;
  historicalPredictions: Prediction[];
  refreshPredictions: () => Promise<void>;
}

const PredictiveAnalyticsContext = createContext<PredictiveAnalyticsContextType>({
  isEnabled: true,
  setEnabled: () => {},
  currentPredictions: null,
  historicalPredictions: [],
  refreshPredictions: async () => {}
});

interface PredictiveAnalyticsProviderProps {
  children: ReactNode;
}

export const PredictiveAnalyticsProvider: React.FC<PredictiveAnalyticsProviderProps> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [currentPredictions, setCurrentPredictions] = useState<Prediction | null>(null);
  const [historicalPredictions, setHistoricalPredictions] = useState<Prediction[]>([]);

  // Fonction pour simuler les prédictions (dans une implémentation réelle, 
  // cela ferait appel à OpenAI ou à une autre API)
  const generatePrediction = async (): Promise<Prediction> => {
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Émotions possibles avec leur probabilité
    const emotions = [
      { name: 'focused', probability: 0.3 },
      { name: 'calm', probability: 0.25 },
      { name: 'energetic', probability: 0.2 },
      { name: 'creative', probability: 0.15 },
      { name: 'stressed', probability: 0.07 },
      { name: 'tired', probability: 0.03 }
    ];
    
    // Sélectionner une émotion aléatoirement en fonction des probabilités
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedEmotion = emotions[0].name;
    
    for (const emotion of emotions) {
      cumulativeProbability += emotion.probability;
      if (random <= cumulativeProbability) {
        selectedEmotion = emotion.name;
        break;
      }
    }
    
    // Générer une confiance légèrement variable
    const confidence = 0.7 + Math.random() * 0.25;
    
    return {
      emotion: selectedEmotion,
      confidence,
      timestamp: new Date(),
      context: 'Basé sur l\'analyse des habitudes utilisateur'
    };
  };

  const refreshPredictions = async () => {
    if (!isEnabled) return;
    
    try {
      const prediction = await generatePrediction();
      setCurrentPredictions(prediction);
      setHistoricalPredictions(prev => [prediction, ...prev].slice(0, 10)); // Garder les 10 dernières prédictions
    } catch (error) {
      console.error('Erreur lors de la génération des prédictions:', error);
    }
  };

  // Générer une prédiction initiale au chargement
  useEffect(() => {
    refreshPredictions();
    
    // Actualiser les prédictions périodiquement
    const interval = setInterval(() => {
      if (isEnabled) {
        refreshPredictions();
      }
    }, 30 * 60 * 1000); // Toutes les 30 minutes
    
    return () => clearInterval(interval);
  }, [isEnabled]);

  return (
    <PredictiveAnalyticsContext.Provider
      value={{
        isEnabled,
        setEnabled: setIsEnabled,
        currentPredictions,
        historicalPredictions,
        refreshPredictions
      }}
    >
      {children}
    </PredictiveAnalyticsContext.Provider>
  );
};

export const usePredictiveAnalytics = () => useContext(PredictiveAnalyticsContext);
