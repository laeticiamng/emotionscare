
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/hooks/useMusic';
import { EmotionResult } from '@/types/emotion';
import { MoodEvent, Prediction, PredictionRecommendation, EmotionalLocation, SanctuaryWidget, EmotionalSynthesis } from '@/types/orchestration';

// Define an event type for the orchestration system
export type OrchestrationEvent = {
  id: string;
  type: string;
  timestamp: Date;
  data: any;
  processed: boolean;
};

// Define the context type
export interface OrchestrationContextType {
  currentEmotionResult: EmotionResult | null;
  emotionHistory: EmotionResult[];
  moodEvents: MoodEvent[];
  predictions: Prediction[];
  recommendations: PredictionRecommendation[];
  sanctuaryWidgets: SanctuaryWidget[];
  emotionalLocations: EmotionalLocation[];
  synthesis: EmotionalSynthesis | null;
  events: OrchestrationEvent[];
  setCurrentEmotionResult: (result: EmotionResult) => void;
  addEmotionResult: (result: EmotionResult) => void;
  addEvent: (type: string, data: any) => void;
  processEmotionResult: (result: EmotionResult) => void;
  generatePredictions: () => void;
  getRecommendations: () => PredictionRecommendation[];
  clearHistory: () => void;
  refreshSynthesis: () => void;
}

// Create the context with default values
const OrchestrationContext = createContext<OrchestrationContextType>({
  currentEmotionResult: null,
  emotionHistory: [],
  moodEvents: [],
  predictions: [],
  recommendations: [],
  sanctuaryWidgets: [],
  emotionalLocations: [],
  synthesis: null,
  events: [],
  setCurrentEmotionResult: () => {},
  addEmotionResult: () => {},
  addEvent: () => {},
  processEmotionResult: () => {},
  generatePredictions: () => {},
  getRecommendations: () => [],
  clearHistory: () => {},
  refreshSynthesis: () => {}
});

// Provider component
export const OrchestrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentEmotionResult, setCurrentEmotionResult] = useState<EmotionResult | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionResult[]>([]);
  const [moodEvents, setMoodEvents] = useState<MoodEvent[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [recommendations, setRecommendations] = useState<PredictionRecommendation[]>([]);
  const [sanctuaryWidgets, setSanctuaryWidgets] = useState<SanctuaryWidget[]>([]);
  const [emotionalLocations, setEmotionalLocations] = useState<EmotionalLocation[]>([]);
  const [synthesis, setSynthesis] = useState<EmotionalSynthesis | null>(null);
  const [events, setEvents] = useState<OrchestrationEvent[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const music = useMusic();
  
  // Process events on mount and updates
  useEffect(() => {
    const unprocessedEvents = events.filter(event => !event.processed);
    
    if (unprocessedEvents.length > 0) {
      processEvents(unprocessedEvents);
    }
  }, [events]);
  
  const processEvents = (eventsToProcess: OrchestrationEvent[]) => {
    // Mark events as processed first
    setEvents(prevEvents => 
      prevEvents.map(event => 
        eventsToProcess.some(e => e.id === event.id) 
          ? { ...event, processed: true } 
          : event
      )
    );
    
    // Process each event
    eventsToProcess.forEach(event => {
      console.log(`Processing event: ${event.type}`, event);
      
      switch (event.type) {
        case 'emotion_detected':
          handleEmotionDetected(event.data);
          break;
        case 'recommendation_selected':
          handleRecommendationSelected(event.data);
          break;
        case 'location_changed':
          handleLocationChanged(event.data);
          break;
        default:
          console.log(`Unknown event type: ${event.type}`);
      }
    });
  };
  
  // Event handlers
  const handleEmotionDetected = (data: EmotionResult) => {
    // Add to emotion history
    addEmotionResultInternal(data);
    
    // Generate new predictions
    generatePredictionsInternal();
    
    // Update synthesis
    refreshSynthesisInternal();
    
    // Show toast notification
    toast({
      title: "Emotion detected",
      description: `Main emotion: ${data.emotion} (${Math.round(data.confidence * 100)}% confidence)`,
    });
    
    // Play music based on emotion if configured
    if (music && music.playEmotion) {
      music.playEmotion(data.emotion);
    }
  };
  
  const handleRecommendationSelected = (data: PredictionRecommendation) => {
    // Handle recommendation selection
    // For example, navigate to the relevant page
    if (data.type === 'vr_session') {
      navigate(`/vr/${data.id}`);
    } else if (data.type === 'music') {
      if (music && music.loadPlaylistForEmotion) {
        music.loadPlaylistForEmotion(data.emotion);
      }
    } else if (data.type === 'coaching') {
      navigate(`/coach/${data.id}`);
    }
    
    // Show toast notification
    toast({
      title: "Recommendation applied",
      description: data.description,
    });
  };
  
  const handleLocationChanged = (data: EmotionalLocation) => {
    // Update emotional locations
    setEmotionalLocations(prev => [...prev, data]);
    
    // Show toast notification
    toast({
      title: "Location updated",
      description: `New emotional location: ${data.name}`,
    });
  };
  
  // Add an event to the system
  const addEvent = (type: string, data: any) => {
    const newEvent: OrchestrationEvent = {
      id: `event-${Date.now()}`,
      type,
      timestamp: new Date(),
      data,
      processed: false
    };
    
    setEvents(prev => [...prev, newEvent]);
  };
  
  // Add an emotion result to the history
  const addEmotionResultInternal = (result: EmotionResult) => {
    setCurrentEmotionResult(result);
    setEmotionHistory(prev => [...prev, result]);
    
    // Add a mood event based on the emotion
    const newMoodEvent: MoodEvent = {
      id: `mood-${Date.now()}`,
      timestamp: new Date(),
      emotion: result.emotion,
      confidence: result.confidence,
      source: result.source || 'scan',
      context: result.context || {}
    };
    
    setMoodEvents(prev => [...prev, newMoodEvent]);
  };
  
  // Generate predictions based on emotion history
  const generatePredictionsInternal = () => {
    // This would typically involve some machine learning or rules-based logic
    // For now, we'll use a simple approach based on the most recent emotion
    
    if (emotionHistory.length === 0 || !currentEmotionResult) return;
    
    const latestEmotion = currentEmotionResult;
    const newPredictions: Prediction[] = [];
    const newRecommendations: PredictionRecommendation[] = [];
    
    // Generate a prediction based on the latest emotion
    const prediction: Prediction = {
      id: `prediction-${Date.now()}`,
      timestamp: new Date(),
      emotion: latestEmotion.emotion,
      confidence: latestEmotion.confidence,
      prediction: `Based on your current emotion (${latestEmotion.emotion}), we predict you might benefit from specific activities.`,
      recommendations: []
    };
    
    // Generate recommendations based on the emotion
    switch (latestEmotion.emotion.toLowerCase()) {
      case 'joy':
      case 'happy':
        newRecommendations.push({
          id: `rec-${Date.now()}-1`,
          type: 'vr_session',
          emotion: 'joy',
          title: 'Amplify your joy',
          description: 'Experience our joy-enhancing VR session.',
          priority: 'high'
        });
        break;
        
      case 'sad':
      case 'sadness':
        newRecommendations.push({
          id: `rec-${Date.now()}-1`,
          type: 'music',
          emotion: 'calm',
          title: 'Soothing music',
          description: 'Listen to calming music to improve your mood.',
          priority: 'high'
        });
        
        newRecommendations.push({
          id: `rec-${Date.now()}-2`,
          type: 'coaching',
          emotion: 'sad',
          title: 'Comfort coaching',
          description: 'Chat with our AI coach for emotional support.',
          priority: 'medium'
        });
        break;
        
      case 'angry':
      case 'anger':
        newRecommendations.push({
          id: `rec-${Date.now()}-1`,
          type: 'vr_session',
          emotion: 'calm',
          title: 'Calm down session',
          description: 'Join our VR session designed to reduce anger.',
          priority: 'high'
        });
        break;
        
      case 'anxious':
      case 'anxiety':
        newRecommendations.push({
          id: `rec-${Date.now()}-1`,
          type: 'vr_session',
          emotion: 'calm',
          title: 'Anxiety relief',
          description: 'Experience our specialized VR session for anxiety.',
          priority: 'high'
        });
        
        newRecommendations.push({
          id: `rec-${Date.now()}-2`,
          type: 'music',
          emotion: 'calm',
          title: 'Anti-anxiety music',
          description: 'Listen to calming music to reduce anxiety.',
          priority: 'medium'
        });
        break;
        
      default:
        newRecommendations.push({
          id: `rec-${Date.now()}-1`,
          type: 'vr_session',
          emotion: 'calm',
          title: 'General well-being',
          description: 'Try our VR session for general well-being.',
          priority: 'medium'
        });
    }
    
    // Add recommendations to the prediction
    prediction.recommendations = newRecommendations.map(rec => rec.id);
    
    // Update state
    setPredictions(prev => [...prev, prediction]);
    setRecommendations(prev => [...prev, ...newRecommendations]);
  };
  
  // Update the emotional synthesis
  const refreshSynthesisInternal = () => {
    if (emotionHistory.length === 0) return;
    
    // Calculate the dominant emotion from history
    const emotionCounts: Record<string, number> = {};
    emotionHistory.forEach(result => {
      const emotion = result.emotion.toLowerCase();
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
    
    const dominantEmotion = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    // Create a new synthesis
    const newSynthesis: EmotionalSynthesis = {
      id: `synthesis-${Date.now()}`,
      timestamp: new Date(),
      dominantEmotion,
      emotionHistory: emotionHistory.map(e => e.emotion),
      summary: `Your dominant emotion is ${dominantEmotion}.`,
      recommendations: recommendations.map(r => r.id).slice(0, 3)
    };
    
    setSynthesis(newSynthesis);
  };
  
  // Public methods
  const addEmotionResult = (result: EmotionResult) => {
    addEvent('emotion_detected', result);
  };
  
  const processEmotionResult = (result: EmotionResult) => {
    addEmotionResult(result);
  };
  
  const generatePredictions = () => {
    generatePredictionsInternal();
  };
  
  const getRecommendations = (): PredictionRecommendation[] => {
    return recommendations;
  };
  
  const clearHistory = () => {
    setEmotionHistory([]);
    setMoodEvents([]);
    setPredictions([]);
    setRecommendations([]);
    setSynthesis(null);
  };
  
  const refreshSynthesis = () => {
    refreshSynthesisInternal();
  };
  
  // Context value
  const contextValue: OrchestrationContextType = {
    currentEmotionResult,
    emotionHistory,
    moodEvents,
    predictions,
    recommendations,
    sanctuaryWidgets,
    emotionalLocations,
    synthesis,
    events,
    setCurrentEmotionResult,
    addEmotionResult,
    addEvent,
    processEmotionResult,
    generatePredictions,
    getRecommendations,
    clearHistory,
    refreshSynthesis
  };
  
  return (
    <OrchestrationContext.Provider value={contextValue}>
      {children}
    </OrchestrationContext.Provider>
  );
};

// Custom hook to use the orchestration context
export const useOrchestration = () => {
  const context = useContext(OrchestrationContext);
  if (!context) {
    throw new Error('useOrchestration must be used within an OrchestrationProvider');
  }
  return context;
};

export default OrchestrationContext;
