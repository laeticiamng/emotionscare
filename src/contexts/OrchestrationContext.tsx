
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import {
  MoodEvent,
  Prediction,
  PredictionRecommendation,
  EmotionalLocation,
  SanctuaryWidget,
  EmotionalSynthesis,
  OrchestrationEvent,
  OrchestrationContextType
} from '@/types/orchestration';
import { EmotionResult } from '@/types/emotion';

// Fix the import for types - import from local types folder rather than @types
import { EmotionSource } from '@/types/orchestration';
import { EmotionResult } from '@/types/emotion';

// Définir les types nécessaires si les imports ne fonctionnent pas
interface OrchestrationEventBase {
  id: string;
  type: string;
  timestamp: string;
  source: string;
  userId?: string;
}

interface EmotionEvent extends OrchestrationEventBase {
  type: 'emotion_detected';
  data: {
    emotion: string;
    intensity: number;
    source: EmotionSource;
    context?: string;
  };
}

interface ActivityEvent extends OrchestrationEventBase {
  type: 'activity_completed';
  data: {
    activityType: string;
    duration: number;
    emotion?: string;
    feedback?: string;
  };
}

interface GoalEvent extends OrchestrationEventBase {
  type: 'goal_progress';
  data: {
    goalId: string;
    progress: number;
    isCompleted: boolean;
  };
}

type OrchestrationEvent = EmotionEvent | ActivityEvent | GoalEvent;

interface OrchestrationState {
  events: OrchestrationEvent[];
  isProcessing: boolean;
  lastEvent: OrchestrationEvent | null;
}

interface OrchestrationContextType extends OrchestrationState {
  recordEmotionEvent: (emotion: string, intensity: number, source: EmotionSource, context?: string) => void;
  recordActivityEvent: (activityType: string, duration: number, emotion?: string, feedback?: string) => void;
  recordGoalProgress: (goalId: string, progress: number, isCompleted: boolean) => void;
  processEmotionResult: (result: EmotionResult) => void;
  getRecentEvents: (count?: number) => OrchestrationEvent[];
  getEventsByType: (type: string, count?: number) => OrchestrationEvent[];
  clearEvents: () => void;
}

const OrchestrationContext = createContext<OrchestrationContextType | undefined>(undefined);

export const OrchestrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<OrchestrationState>({
    events: [],
    isProcessing: false,
    lastEvent: null
  });

  // Fonction pour ajouter un événement d'humeur
  const recordEmotionEvent = (emotion: string, intensity: number, source: EmotionSource, context?: string) => {
    const newEvent: OrchestrationEvent = {
      id: uuidv4(),
      type: 'emotion_detected',
      timestamp: new Date().toISOString(),
      source: source || 'system',
      userId: user?.id,
      data: {
        emotion,
        intensity,
        source,
        context
      }
    };
    
    setState(prevState => ({
      ...prevState,
      events: [newEvent, ...prevState.events],
      lastEvent: newEvent
    }));
  };

  // Fonction pour ajouter un événement d'activité
  const recordActivityEvent = (activityType: string, duration: number, emotion?: string, feedback?: string) => {
    const newEvent: OrchestrationEvent = {
      id: uuidv4(),
      type: 'activity_completed',
      timestamp: new Date().toISOString(),
      source: 'system',
      userId: user?.id,
      data: {
        activityType,
        duration,
        emotion,
        feedback
      }
    };
    
    setState(prevState => ({
      ...prevState,
      events: [newEvent, ...prevState.events],
      lastEvent: newEvent
    }));
  };

  // Fonction pour ajouter un événement de progression de but
  const recordGoalProgress = (goalId: string, progress: number, isCompleted: boolean) => {
    const newEvent: OrchestrationEvent = {
      id: uuidv4(),
      type: 'goal_progress',
      timestamp: new Date().toISOString(),
      source: 'system',
      userId: user?.id,
      data: {
        goalId,
        progress,
        isCompleted
      }
    };
    
    setState(prevState => ({
      ...prevState,
      events: [newEvent, ...prevState.events],
      lastEvent: newEvent
    }));
  };

  // Fonction pour traiter un résultat d'analyse d'émotion
  const processEmotionResult = useCallback((result: EmotionResult) => {
    if (!result || !result.emotion) return;
    
    // Cast the source to ensure compatibility with the EmotionSource type
    const source = (result.source || 'text') as EmotionSource;
    
    recordEmotionEvent(
      result.emotion,
      result.score || 5,
      source,
      result.text
    );
  }, [user]);

  // Fonction pour obtenir les derniers événements
  const getRecentEvents = (count?: number) => {
    return state.events.slice(0, count || 10);
  };

  // Fonction pour obtenir les événements par type
  const getEventsByType = (type: string, count?: number) => {
    return state.events.filter(event => event.type === type).slice(0, count || 10);
  };

  // Fonction pour effacer tous les événements
  const clearEvents = () => {
    setState(prevState => ({
      ...prevState,
      events: []
    }));
  };

  // Valeur du contexte
  const value = {
    ...state,
    recordEmotionEvent,
    recordActivityEvent,
    recordGoalProgress,
    processEmotionResult,
    getRecentEvents,
    getEventsByType,
    clearEvents
  };

  return (
    <OrchestrationContext.Provider
      value={value}
    >
      {children}
    </OrchestrationContext.Provider>
  );
};

export const useOrchestration = (): OrchestrationContextType => {
  const context = useContext(OrchestrationContext);
  if (context === undefined) {
    throw new Error('useOrchestration must be used within an OrchestrationProvider');
  }
  return context;
};
