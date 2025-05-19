
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Import from types instead of redeclaring
import { 
  EmotionResult,
  EmotionalData
} from '@/types/emotion';

import {
  MoodEvent,
  Prediction,
  PredictionRecommendation,
  EmotionalLocation,
  SanctuaryWidget,
  EmotionalSynthesis,
  OrchestrationEvent as OrcEvent,
  OrchestrationContextType as OrcContextType
} from '@/types/orchestration';

// Create types for context state
interface OrchestrationState {
  currentEmotionResult: EmotionResult | null;
  emotionHistory: EmotionResult[];
  moodEvents: MoodEvent[];
  predictions: Prediction[];
  recommendations: PredictionRecommendation[];
  sanctuaryWidgets: SanctuaryWidget[];
  emotionalLocations: EmotionalLocation[];
  synthesis: EmotionalSynthesis | null;
  events: OrcEvent[];
}

// Create the context with a default value
const OrchestrationContext = createContext<OrcContextType | undefined>(undefined);

// Provider component
export const OrchestrationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State initialization
  const [state, setState] = useState<OrchestrationState>({
    currentEmotionResult: null,
    emotionHistory: [],
    moodEvents: [],
    predictions: [],
    recommendations: [],
    sanctuaryWidgets: [],
    emotionalLocations: [],
    synthesis: null,
    events: []
  });

  // Function to set current emotion result
  const setCurrentEmotionResult = (result: EmotionResult) => {
    setState(prev => ({ ...prev, currentEmotionResult: result }));
  };

  // Function to add emotion result to history
  const addEmotionResult = (result: EmotionResult) => {
    setState(prev => ({
      ...prev,
      emotionHistory: [...prev.emotionHistory, result]
    }));
  };

  // Function to add event
  const addEvent = (type: string, data: any) => {
    const event: OrcEvent = {
      id: uuidv4(),
      type,
      timestamp: new Date(),
      data,
      processed: false
    };
    setState(prev => ({
      ...prev,
      events: [...prev.events, event]
    }));
  };

  // Function to process emotion result
  const processEmotionResult = (result: EmotionResult) => {
    // Add to history
    addEmotionResult(result);
    
    // Set as current
    setCurrentEmotionResult(result);
    
    // Create event
    addEvent('emotion_detected', result);
    
    // Process for predictions (in a real app, this would be more complex)
    generatePredictions();
  };

  // Function to generate predictions
  const generatePredictions = () => {
    // In a real app, this would use complex logic
    // For now, just create a simple prediction
    if (state.currentEmotionResult) {
      const prediction: Prediction = {
        id: uuidv4(),
        timestamp: new Date(),
        emotion: state.currentEmotionResult.emotion,
        confidence: state.currentEmotionResult.score,
        prediction: 'Your emotion may continue for the next hour',
        recommendations: []
      };
      
      setState(prev => ({
        ...prev,
        predictions: [...prev.predictions, prediction]
      }));
    }
  };

  // Function to get recommendations
  const getRecommendations = (): PredictionRecommendation[] => {
    return state.recommendations;
  };

  // Function to clear history
  const clearHistory = () => {
    setState(prev => ({
      ...prev,
      emotionHistory: [],
      moodEvents: [],
      predictions: [],
      events: []
    }));
  };

  // Function to refresh synthesis
  const refreshSynthesis = () => {
    if (state.emotionHistory.length > 0) {
      const dominantEmotion = state.emotionHistory
        .sort((a, b) => b.score - a.score)[0].emotion;
      
      const synthesis: EmotionalSynthesis = {
        id: uuidv4(),
        timestamp: new Date(),
        dominantEmotion,
        emotionHistory: state.emotionHistory.map(e => e.emotion),
        summary: `Your dominant emotion has been ${dominantEmotion}`,
        recommendations: []
      };
      
      setState(prev => ({ ...prev, synthesis }));
    }
  };

  // Context value
  const contextValue: OrcContextType = {
    ...state,
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

// Hook for using the context
export const useOrchestration = (): OrcContextType => {
  const context = useContext(OrchestrationContext);
  if (context === undefined) {
    throw new Error('useOrchestration must be used within an OrchestrationProvider');
  }
  return context;
};
