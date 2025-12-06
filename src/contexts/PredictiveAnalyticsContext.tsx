// @ts-nocheck

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

// Types for predictions
export interface PredictiveFeature {
  name: string;
  description: string;
  enabled: boolean;
  priority: number; // 1-10, 10 being highest priority
  toggleFeature: (enabled: boolean) => void;
}

export interface Prediction {
  emotion: string;
  confidence: number;
  timestamp: string;
  source: string;
  context?: string;
}

export interface PredictionRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'activity' | 'content' | 'insight';
  priority: number;
  actionUrl?: string;
  actionLabel?: string;
}

interface PredictiveAnalyticsContextType {
  isLoading: boolean;
  error: string | null;
  currentPredictions: Prediction | null;
  generatePrediction: () => Promise<void>;
  resetPredictions: () => void;
  isEnabled: boolean;
  setEnabled: (enabled: boolean) => void;
  predictionEnabled: boolean;
  setPredictionEnabled: (enabled: boolean) => void;
  availableFeatures: PredictiveFeature[];
  recommendations: PredictionRecommendation[];
  generatePredictions: () => Promise<void>;
}

const PredictiveAnalyticsContext = createContext<PredictiveAnalyticsContextType | undefined>(undefined);

export const PredictiveAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPredictions, setCurrentPredictions] = useState<Prediction | null>(null);
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [predictionEnabled, setPredictionEnabled] = useState<boolean>(true);
  const [recommendations, setRecommendations] = useState<PredictionRecommendation[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Define available features
  const [availableFeatures, setAvailableFeatures] = useState<PredictiveFeature[]>([
    {
      name: 'Prédiction émotionnelle',
      description: 'Anticiper vos états émotionnels pour adapter l\'expérience',
      enabled: predictionEnabled,
      priority: 10,
      toggleFeature: (enabled) => setPredictionEnabled(enabled)
    },
    {
      name: 'Recommandations musicales prédictives',
      description: 'Suggérer automatiquement des musiques adaptées à votre état prédit',
      enabled: true,
      priority: 8,
      toggleFeature: () => {}
    },
    {
      name: 'Adaptation visuelle anticipative',
      description: 'Ajuster l\'interface selon vos préférences anticipées',
      enabled: true,
      priority: 7,
      toggleFeature: () => {}
    },
    {
      name: 'Storytelling prédictif',
      description: 'Présenter des récits pertinents selon les prédictions',
      enabled: true,
      priority: 6,
      toggleFeature: () => {}
    },
    {
      name: 'Détection de désengagement',
      description: 'Identifier les signes précoces de désengagement pour une intervention préventive',
      enabled: true,
      priority: 9,
      toggleFeature: () => {}
    }
  ]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedIsEnabled = window.localStorage.getItem('predictiveAnalyticsEnabled');
    if (storedIsEnabled !== null) {
      try {
        setIsEnabled(JSON.parse(storedIsEnabled));
      } catch (e) {
        // If parsing fails, fallback to default and clear corrupted value
        setIsEnabled(true);
        window.localStorage.removeItem('predictiveAnalyticsEnabled');
      }
    }

    const storedPredictionEnabled = window.localStorage.getItem('predictionEnabled');
    if (storedPredictionEnabled !== null) {
      try {
        setPredictionEnabled(JSON.parse(storedPredictionEnabled));
      } catch (e) {
        setPredictionEnabled(true);
        window.localStorage.removeItem('predictionEnabled');
      }
    }
  }, []);

  // Store settings in localStorage
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem('predictiveAnalyticsEnabled', JSON.stringify(isEnabled));
  }, [isEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem('predictionEnabled', JSON.stringify(predictionEnabled));
  }, [predictionEnabled]);
  
  // Update feature enabled status when predictionEnabled changes
  useEffect(() => {
    setAvailableFeatures(prev => prev.map(feature => 
      feature.name === 'Prédiction émotionnelle' 
        ? { ...feature, enabled: predictionEnabled } 
        : feature
    ));
  }, [predictionEnabled]);

  // Generate a new prediction based on user data
  const generatePrediction = async () => {
    if (!user || !isEnabled) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // This would typically call an API/backend service
      // For now, we're simulating predictions
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Sample emotional states
      const emotions = ['calm', 'focused', 'stressed', 'tired', 'energetic', 'creative'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomConfidence = Math.random() * 0.5 + 0.5; // 0.5-1.0
      
      const prediction: Prediction = {
        emotion: randomEmotion,
        confidence: parseFloat(randomConfidence.toFixed(2)),
        timestamp: new Date().toISOString(),
        source: 'pattern-analysis',
        context: 'user-activity'
      };
      
      setCurrentPredictions(prediction);
      
      // Generate recommendations based on prediction
      generateRecommendationsForPrediction(prediction);
      
      toast({
        title: "Nouvelle prédiction",
        description: `État émotionnel prédit : ${randomEmotion} (${(randomConfidence * 100).toFixed(0)}% de confiance)`,
      });
      
    } catch (err) {
      logger.error('Error generating prediction', err as Error, 'ANALYTICS');
      setError('Erreur lors de la génération des prédictions');
      toast({
        title: "Erreur",
        description: "Impossible de générer une prédiction pour le moment",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate recommendations based on predicted emotion
  const generateRecommendationsForPrediction = (prediction: Prediction) => {
    const recommendationsByEmotion: Record<string, PredictionRecommendation[]> = {
      'calm': [
        {
          id: 'calm-1',
          title: 'Maintenir votre sérénité',
          description: 'Profitez de votre état de calme pour une séance de méditation profonde',
          type: 'activity',
          priority: 10,
          actionUrl: '/meditation',
          actionLabel: 'Méditer maintenant'
        },
        {
          id: 'calm-2',
          title: 'Journal de gratitude',
          description: 'Votre état calme est idéal pour réfléchir à ce dont vous êtes reconnaissant',
          type: 'insight',
          priority: 8,
          actionUrl: '/journal',
          actionLabel: 'Écrire une entrée'
        }
      ],
      'focused': [
        {
          id: 'focused-1',
          title: 'Maximiser votre concentration',
          description: 'Vous êtes dans un état de concentration idéal pour des tâches importantes',
          type: 'insight',
          priority: 10
        },
        {
          id: 'focused-2',
          title: 'Musique pour rester concentré',
          description: 'Une playlist spécialement conçue pour maintenir votre concentration',
          type: 'content',
          priority: 8,
          actionUrl: '/music',
          actionLabel: 'Écouter la playlist'
        }
      ],
      'stressed': [
        {
          id: 'stressed-1',
          title: 'Réduire votre stress',
          description: 'Une courte séance de respiration pour diminuer rapidement votre niveau de stress',
          type: 'activity',
          priority: 10,
          actionUrl: '/meditation',
          actionLabel: 'Commencer maintenant'
        },
        {
          id: 'stressed-2',
          title: 'Parler à votre coach',
          description: 'Discuter avec le coach IA peut vous aider à identifier les sources de stress',
          type: 'activity',
          priority: 9,
          actionUrl: '/coach-chat',
          actionLabel: 'Consulter le coach'
        }
      ],
      'tired': [
        {
          id: 'tired-1',
          title: 'Regain d\'énergie',
          description: 'Une courte séance d\'étirements pour retrouver votre vitalité',
          type: 'activity',
          priority: 10
        },
        {
          id: 'tired-2',
          title: 'Musique énergisante',
          description: 'Une playlist dynamique pour vous revitaliser',
          type: 'content',
          priority: 8,
          actionUrl: '/music',
          actionLabel: 'Écouter la playlist'
        }
      ],
      'energetic': [
        {
          id: 'energetic-1',
          title: 'Canalisez votre énergie',
          description: 'Profitez de votre énergie pour compléter des tâches importantes',
          type: 'insight',
          priority: 9
        },
        {
          id: 'energetic-2',
          title: 'Activité créative',
          description: 'Votre niveau d\'énergie est parfait pour explorer votre créativité',
          type: 'activity',
          priority: 8
        }
      ],
      'creative': [
        {
          id: 'creative-1',
          title: 'Explorez votre créativité',
          description: 'Une session de brainstorming pour tirer parti de votre état créatif',
          type: 'activity',
          priority: 10
        },
        {
          id: 'creative-2',
          title: 'Journal créatif',
          description: 'Notez vos idées créatives pendant que vous êtes inspiré',
          type: 'content',
          priority: 9,
          actionUrl: '/journal',
          actionLabel: 'Prendre des notes'
        }
      ]
    };
    
    // Get recommendations for predicted emotion or default to empty array
    const emotionalRecommendations = recommendationsByEmotion[prediction.emotion] || [];
    
    // Add generic recommendations that apply to all emotions
    const genericRecommendations: PredictionRecommendation[] = [
      {
        id: 'generic-1',
        title: 'Vérifiez votre progression',
        description: 'Consultez vos statistiques et votre évolution émotionnelle',
        type: 'insight',
        priority: 7,
        actionUrl: '/dashboard',
        actionLabel: 'Voir le tableau de bord'
      }
    ];
    
    // Combine and sort by priority
    const allRecommendations = [...emotionalRecommendations, ...genericRecommendations]
      .sort((a, b) => b.priority - a.priority);
      
    setRecommendations(allRecommendations);
  };

  // Reset all predictions
  const resetPredictions = () => {
    setCurrentPredictions(null);
    setRecommendations([]);
  };

  // Generate multiple predictions (useful for admin dashboard)
  const generatePredictions = async () => {
    if (!user || !isEnabled) return;
    
    // For simplicity, we'll just call the single prediction generator
    await generatePrediction();
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
        predictionEnabled,
        setPredictionEnabled,
        availableFeatures,
        recommendations,
        generatePredictions
      }}
    >
      {children}
    </PredictiveAnalyticsContext.Provider>
  );
};

export const usePredictiveAnalytics = () => {
  const context = useContext(PredictiveAnalyticsContext);
  if (context === undefined) {
    throw new Error('usePredictiveAnalytics must be used within a PredictiveAnalyticsProvider');
  }
  return context;
};
