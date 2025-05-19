import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { 
  MoodEvent, 
  Prediction, 
  PredictionRecommendation, 
  EmotionalLocation,
  SanctuaryWidget,
  EmotionalSynthesis,
  OrchestrationEvent
} from '@/types/global';
import { EmotionResult } from '@/types/emotion';

// Données initiales pour le sanctuaire
const initialSanctuaryWidgets: SanctuaryWidget[] = [
  {
    id: 'meditation-basic',
    type: 'meditation',
    title: 'Méditation guidée',
    description: 'Une méditation douce de 5 minutes pour se recentrer',
    duration: 300,
    completions: 0,
    thumbnail: '/assets/images/meditation.jpg',
    color: '#8A9EFF'
  },
  {
    id: 'breathing-relax',
    type: 'breathing',
    title: 'Respiration cohérente',
    description: "Exercice de respiration pour calmer l'anxiété",
    duration: 180,
    completions: 0,
    thumbnail: '/assets/images/breathing.jpg',
    color: '#7EB8DA'
  },
  {
    id: 'ambient-forest',
    type: 'ambient',
    title: 'Sons de la forêt',
    description: 'Ambiance relaxante de nature',
    duration: 1200,
    completions: 0,
    thumbnail: '/assets/images/forest.jpg',
    color: '#6ECC94'
  }
];

// État initial pour l'orchestration
interface OrchestrationState {
  events: MoodEvent[];
  predictions: Prediction[];
  recommendations: PredictionRecommendation[];
  locations: EmotionalLocation[];
  sanctuaryWidgets: SanctuaryWidget[];
  synthesis: EmotionalSynthesis | null;
  activeLocation: string | null;
  activeEvent: string | null;
  loading: boolean;
}

const initialState: OrchestrationState = {
  events: [],
  predictions: [],
  recommendations: [],
  locations: [],
  sanctuaryWidgets: initialSanctuaryWidgets,
  synthesis: null,
  activeLocation: null,
  activeEvent: null,
  loading: false
};

// Reducer pour gérer les actions d'orchestration
function orchestrationReducer(state: OrchestrationState, action: OrchestrationEvent): OrchestrationState {
  switch (action.type) {
    case 'EMOTION_DETECTED':
      const newEvent: MoodEvent = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        mood: action.payload.emotion,
        source: action.payload.source || 'system',
        intensity: action.payload.intensity || 0.5,
        emotion: action.payload,
        category: 'regular'
      };
      
      // Créer aussi une nouvelle localisation pour la carte du monde
      const newLocation: EmotionalLocation = {
        id: uuidv4(),
        name: action.payload.emotion,
        coordinates: [Math.random() * 360 - 180, Math.random() * 180 - 90], // Coordonnées aléatoires pour démo
        emotion: action.payload.emotion,
        intensity: action.payload.intensity || 0.5,
        timestamp: new Date().toISOString(),
        color: getEmotionColor(action.payload.emotion)
      };
      
      return {
        ...state,
        events: [newEvent, ...state.events],
        locations: [newLocation, ...state.locations]
      };
      
    case 'RECOMMENDATION_ADDED':
      return {
        ...state,
        recommendations: [action.payload, ...state.recommendations]
      };
      
    case 'RECOMMENDATION_COMPLETED':
      return {
        ...state,
        recommendations: state.recommendations.map(rec => 
          rec.id === action.payload ? { ...rec, completed: true } : rec
        )
      };
      
    case 'MILESTONE_REACHED':
      // Mettre à jour l'événement existant ou en ajouter un nouveau avec catégorie "milestone"
      const milestoneEvent = {
        ...action.payload,
        category: 'milestone' as const
      };
      
      const eventExists = state.events.some(e => e.id === milestoneEvent.id);
      
      return {
        ...state,
        events: eventExists
          ? state.events.map(e => e.id === milestoneEvent.id ? milestoneEvent : e)
          : [milestoneEvent, ...state.events]
      };
      
    case 'INSIGHT_GENERATED':
      return {
        ...state,
        predictions: [action.payload, ...state.predictions]
      };
      
    case 'SYNTHESIS_UPDATED':
      return {
        ...state,
        synthesis: action.payload
      };
      
    default:
      return state;
  }
}

// Fonction utilitaire pour obtenir une couleur basée sur l'émotion
function getEmotionColor(emotion: string): string {
  const emotionColors: Record<string, string> = {
    'joy': '#FFD700',
    'happy': '#FFCC00',
    'excited': '#FF9933',
    'calm': '#66CCFF',
    'relaxed': '#99CCFF',
    'sad': '#6666CC',
    'angry': '#CC3333',
    'fear': '#993366',
    'neutral': '#CCCCCC',
    'anxious': '#CC9966'
  };
  
  return emotionColors[emotion.toLowerCase()] || '#CCCCCC';
}

// Interface pour le contexte d'orchestration
interface OrchestrationContextType {
  events: MoodEvent[];
  predictions: Prediction[];
  recommendations: PredictionRecommendation[];
  locations: EmotionalLocation[];
  sanctuaryWidgets: SanctuaryWidget[];
  synthesis: EmotionalSynthesis | null;
  activeLocation: string | null;
  activeEvent: string | null;
  loading: boolean;
  
  // Actions
  addEvent: (event: MoodEvent) => void;
  addEmotionResult: (result: EmotionResult) => void;
  addRecommendation: (recommendation: PredictionRecommendation) => void;
  completeRecommendation: (id: string) => void;
  addPrediction: (prediction: Prediction) => void;
  setActiveLocation: (id: string | null) => void;
  setActiveEvent: (id: string | null) => void;
  updateSynthesis: (synthesis: EmotionalSynthesis) => void;
}

// Création du contexte
const OrchestrationContext = createContext<OrchestrationContextType | undefined>(undefined);

// Provider du contexte
export const OrchestrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(orchestrationReducer, initialState);
  const { toast } = useToast();
  
  // Fonction pour ajouter un événement d'humeur
  const addEvent = (event: MoodEvent) => {
    if (!event.id) {
      event.id = uuidv4();
    }
    
    if (!event.timestamp) {
      event.timestamp = new Date().toISOString();
    }
    
    dispatch({
      type: 'MILESTONE_REACHED',
      payload: event
    });
    
    // Notification pour les événements importants
    if (event.category === 'milestone' || event.category === 'highlight') {
      toast({
        title: "Événement important",
        description: `Un moment clé a été enregistré : ${event.mood}`,
      });
    }
  };
  
  // Fonction pour ajouter un résultat d'analyse d'émotion
  const addEmotionResult = (result: EmotionResult) => {
    dispatch({
      type: 'EMOTION_DETECTED',
      payload: result
    });
  };
  
  // Fonction pour ajouter une recommandation
  const addRecommendation = (recommendation: PredictionRecommendation) => {
    dispatch({
      type: 'RECOMMENDATION_ADDED',
      payload: recommendation
    });
    
    // Notification pour les recommandations prioritaires
    if (recommendation.priority === 'high') {
      toast({
        title: "Nouvelle recommandation",
        description: recommendation.title,
        variant: "default"
      });
    }
  };
  
  // Fonction pour marquer une recommandation comme complétée
  const completeRecommendation = (id: string) => {
    dispatch({
      type: 'RECOMMENDATION_COMPLETED',
      payload: id
    });
  };
  
  // Fonction pour ajouter une prédiction
  const addPrediction = (prediction: Prediction) => {
    dispatch({
      type: 'INSIGHT_GENERATED',
      payload: prediction
    });
  };
  
  // Fonction pour définir l'emplacement actif sur la carte
  const setActiveLocation = (id: string | null) => {
    // setActiveLocation est une simple mise à jour d'état - pas besoin de dispatch
    // une action pour cela car c'est uniquement pour l'UI
    // eslint-disable-next-line react/no-direct-mutation-state
    state.activeLocation = id;
  };
  
  // Fonction pour définir l'événement actif sur la timeline
  const setActiveEvent = (id: string | null) => {
    // Comme pour setActiveLocation, c'est uniquement pour l'UI
    // eslint-disable-next-line react/no-direct-mutation-state
    state.activeEvent = id;
  };
  
  // Fonction pour mettre à jour la synthèse
  const updateSynthesis = (synthesis: EmotionalSynthesis) => {
    dispatch({
      type: 'SYNTHESIS_UPDATED',
      payload: synthesis
    });
  };
  
  // Valeur du contexte
  const value = {
    ...state,
    addEvent,
    addEmotionResult,
    addRecommendation,
    completeRecommendation,
    addPrediction,
    setActiveLocation,
    setActiveEvent,
    updateSynthesis
  };
  
  return (
    <OrchestrationContext.Provider value={value}>
      {children}
    </OrchestrationContext.Provider>
  );
};

// Hook pour utiliser le contexte d'orchestration
export const useOrchestration = () => {
  const context = useContext(OrchestrationContext);
  if (!context) {
    throw new Error('useOrchestration must be used within an OrchestrationProvider');
  }
  return context;
};
