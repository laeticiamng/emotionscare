
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { MoodEvent, Prediction, PredictionRecommendation, EmotionalLocation, SanctuaryWidget } from '@/types/orchestration';
import { EmotionResult } from '@/types/emotion';
import { MoodData } from '@/types/audio';

// Define the type for OrchestrationEvent
interface OrchestrationEventData {
  id: string;
  type: string;
  timestamp: string;
  mood: string;
  source: string;
  data?: any;
}

// Define the context type
interface OrchestrationContextData {
  events: OrchestrationEventData[];
  predictions: Prediction[];
  recommendations: PredictionRecommendation[];
  addEvent: (event: Omit<OrchestrationEventData, 'id' | 'timestamp'>) => void;
  getLastMoodEvent: () => MoodEvent | null;
  generatePredictions: () => Prediction[];
  getRecommendations: () => PredictionRecommendation[];
  sanctuaryWidgets: SanctuaryWidget[];
  emotionalLocations: EmotionalLocation[];
}

// Create the context
const OrchestrationContext = createContext<OrchestrationContextData | undefined>(undefined);

interface OrchestrationProviderProps {
  children: ReactNode;
}

export const OrchestrationProvider: React.FC<OrchestrationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<OrchestrationEventData[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [recommendations, setRecommendations] = useState<PredictionRecommendation[]>([]);
  const [sanctuaryWidgets, setSanctuaryWidgets] = useState<SanctuaryWidget[]>([]);
  const [emotionalLocations, setEmotionalLocations] = useState<EmotionalLocation[]>([]);

  // Add a new event
  const addEvent = (event: Omit<OrchestrationEventData, 'id' | 'timestamp'>) => {
    const newEvent = {
      ...event,
      id: `event-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  // Get the last mood event
  const getLastMoodEvent = (): MoodEvent | null => {
    const lastEvent = events.find(event => event.type === 'mood');
    if (!lastEvent) return null;
    
    return {
      id: lastEvent.id,
      mood: lastEvent.mood,
      timestamp: lastEvent.timestamp,
      source: lastEvent.source,
      userId: user?.id || 'anonymous',
      intensity: lastEvent.data?.intensity || 0.5,
    };
  };

  // Generate mood predictions based on past events
  const generatePredictions = (): Prediction[] => {
    // Implementation would use actual algorithms, this is a placeholder
    const mockPredictions: Prediction[] = [
      {
        id: 'pred-1',
        predictedMood: 'calm',
        confidence: 0.85,
        timeframe: 'morning',
        date: new Date().toISOString(),
        userId: user?.id || 'anonymous',
      },
      {
        id: 'pred-2',
        predictedMood: 'focused',
        confidence: 0.75,
        timeframe: 'afternoon',
        date: new Date().toISOString(),
        userId: user?.id || 'anonymous',
      }
    ];
    
    setPredictions(mockPredictions);
    return mockPredictions;
  };

  // Get recommendations based on current state
  const getRecommendations = (): PredictionRecommendation[] => {
    // Implementation would use actual algorithms, this is a placeholder
    const mockRecommendations: PredictionRecommendation[] = [
      {
        id: 'rec-1',
        type: 'activity',
        title: 'Morning Meditation',
        description: 'Start your day with a 10-minute meditation session',
        mood: 'calm',
        effectiveness: 0.9,
      },
      {
        id: 'rec-2',
        type: 'music',
        title: 'Focus Playlist',
        description: 'Listen to concentration-enhancing music',
        mood: 'focused',
        effectiveness: 0.85,
      }
    ];
    
    setRecommendations(mockRecommendations);
    return mockRecommendations;
  };

  // Initialize data on mount
  useEffect(() => {
    // This would fetch from API in a real app
    if (user) {
      // Load historical events from API or storage
      // For now, use mock data
      setEvents([
        {
          id: 'event-1',
          type: 'mood',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          mood: 'happy',
          source: 'text-analysis',
          data: { intensity: 0.7 }
        },
        {
          id: 'event-2',
          type: 'mood',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          mood: 'focused',
          source: 'voice-analysis',
          data: { intensity: 0.8 }
        }
      ]);
      
      // Initialize other data
      generatePredictions();
      getRecommendations();
      
      // Set up sanctuary widgets
      setSanctuaryWidgets([
        {
          id: 'widget-1',
          title: 'Breathe',
          type: 'breathing',
          description: 'Guided breathing exercise',
          emotion: 'stress',
          priority: 1
        },
        {
          id: 'widget-2',
          title: 'Meditate',
          type: 'meditation',
          description: '5-minute meditation',
          emotion: 'calm',
          priority: 2
        }
      ]);
      
      // Set up emotional locations
      setEmotionalLocations([
        {
          id: 'loc-1',
          name: 'Home Office',
          moodData: {
            primary: 'focused',
            secondary: 'calm',
            intensity: 0.7
          },
          coordinates: { lat: 48.8584, lng: 2.2945 },
          userId: user.id
        }
      ]);
    }
  }, [user]);

  const value = {
    events,
    predictions,
    recommendations,
    addEvent,
    getLastMoodEvent,
    generatePredictions,
    getRecommendations,
    sanctuaryWidgets,
    emotionalLocations
  };

  return (
    <OrchestrationContext.Provider value={value}>
      {children}
    </OrchestrationContext.Provider>
  );
};

export const useOrchestration = () => {
  const context = useContext(OrchestrationContext);
  if (context === undefined) {
    throw new Error('useOrchestration must be used within an OrchestrationProvider');
  }
  return context;
};
