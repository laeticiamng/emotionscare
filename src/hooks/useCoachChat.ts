// @ts-nocheck
import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { coachService, CoachingSession, CoachMessage, CoachingRecommendation } from '@/services/coach';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/lib/logger';

export interface CoachChatState {
  currentSession: CoachingSession | null;
  messages: CoachMessage[];
  isProcessing: boolean;
  recommendations: CoachingRecommendation[];
  error: string | null;
}

export const useCoachChat = () => {
  const { user } = useAuth() || { user: null };
  const [state, setState] = useState<CoachChatState>({
    currentSession: null,
    messages: [],
    isProcessing: false,
    recommendations: [],
    error: null
  });
  
  const sessionRef = useRef<CoachingSession | null>(null);

  // Démarrage d'une nouvelle session de coaching
  const startSession = useCallback(async (
    emotionalContext: {
      current_emotion: string;
      intensity: number;
      triggers?: string[];
      goals?: string[];
    },
    preferredPersonality?: string
  ) => {
    if (!user?.id) {
      setState(prev => ({ ...prev, error: 'Vous devez être connecté pour commencer une session' }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));
      
      const session = await coachService.startCoachingSession(
        user.id,
        emotionalContext,
        preferredPersonality
      );
      
      sessionRef.current = session;
      setState(prev => ({
        ...prev,
        currentSession: session,
        messages: [],
        isProcessing: false
      }));

      // Message d'accueil automatique
      const welcomeMessage = `Bonjour ! Je suis ${session.coach_personality.name}. Je suis là pour vous accompagner dans votre bien-être émotionnel. Comment vous sentez-vous aujourd'hui ?`;
      
      const welcomeMsg: CoachMessage = {
        id: uuidv4(),
        role: 'coach',
        content: welcomeMessage,
        timestamp: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        messages: [welcomeMsg]
      }));

    } catch (error) {
      logger.error('Error starting coaching session', error as Error, 'UI');
      setState(prev => ({
        ...prev, 
        error: 'Impossible de démarrer la session de coaching',
        isProcessing: false 
      }));
    }
  }, [user?.id]);

  // Envoi d'un message au coach
  const sendMessage = useCallback(async (messageContent: string): Promise<string> => {
    if (!user?.id || !sessionRef.current) {
      setState(prev => ({ ...prev, error: 'Session de coaching non initialisée' }));
      return '';
    }

    try {
      setState(prev => ({ ...prev, isProcessing: true, error: null }));

      // Ajouter le message utilisateur
      const userMessage: CoachMessage = {
        id: uuidv4(),
        role: 'user',
        content: messageContent,
        timestamp: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, userMessage]
      }));

      // Envoyer au service de coaching
      const response = await coachService.sendMessage(
        sessionRef.current.id,
        messageContent,
        user.id
      );

      // Ajouter la réponse du coach
      const coachMessage: CoachMessage = {
        id: uuidv4(),
        role: 'coach',
        content: response.coachResponse,
        timestamp: new Date().toISOString(),
        emotion_analysis: response.emotionAnalysis
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, coachMessage],
        recommendations: response.recommendations || prev.recommendations,
        isProcessing: false
      }));

      return response.coachResponse;
    } catch (error) {
      logger.error('Error sending message to coach', error as Error, 'UI');
      setState(prev => ({ 
        ...prev, 
        error: 'Impossible d\'envoyer le message',
        isProcessing: false 
      }));
      return '';
    }
  }, [user?.id]);

  // Récupération des recommandations personnalisées
  const getRecommendations = useCallback(async (
    emotion: string,
    intensity: number,
    preferences?: {
      preferred_activities?: string[];
      time_available?: number;
      difficulty_preference?: 'easy' | 'medium' | 'hard';
    }
  ) => {
    try {
      const recommendations = await coachService.getPersonalizedRecommendations(
        emotion,
        intensity,
        preferences
      );
      
      setState(prev => ({ ...prev, recommendations }));
      return recommendations;
    } catch (error) {
      logger.error('Error getting recommendations', error as Error, 'UI');
      return [];
    }
  }, []);

  // Chargement de l'historique des sessions
  const loadSessionHistory = useCallback(async (limit: number = 10) => {
    if (!user?.id) return [];
    
    try {
      return await coachService.getUserCoachingSessions(user.id, limit);
    } catch (error) {
      logger.error('Error loading session history', error as Error, 'UI');
      return [];
    }
  }, [user?.id]);

  // Analyse des progrès
  const getProgress = useCallback(async (days: number = 30) => {
    if (!user?.id) return null;
    
    try {
      return await coachService.getCoachingProgress(user.id, days);
    } catch (error) {
      logger.error('Error getting coaching progress', error as Error, 'UI');
      return null;
    }
  }, [user?.id]);

  // Reprise d'une session existante
  const resumeSession = useCallback(async (sessionId: string) => {
    if (!user?.id) return;

    try {
      setState(prev => ({ ...prev, isProcessing: true }));
      
      const sessions = await coachService.getUserCoachingSessions(user.id, 50);
      const session = sessions.find(s => s.id === sessionId);
      
      if (session) {
        sessionRef.current = session;
        setState(prev => ({
          ...prev,
          currentSession: session,
          messages: session.messages,
          isProcessing: false
        }));
      }
    } catch (error) {
      logger.error('Error resuming session', error as Error, 'UI');
      setState(prev => ({ 
        ...prev, 
        error: 'Impossible de reprendre la session',
        isProcessing: false 
      }));
    }
  }, [user?.id]);

  // Nettoyage de la session
  const clearSession = useCallback(() => {
    sessionRef.current = null;
    setState({
      currentSession: null,
      messages: [],
      isProcessing: false,
      recommendations: [],
      error: null
    });
  }, []);

  // Méthodes de compatibilité avec l'ancien hook
  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
  }, []);

  const addMessage = useCallback((content: string, role: 'user' | 'coach' | 'system') => {
    const message: CoachMessage = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date().toISOString()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, message]
    }));
  }, []);

  return {
    // État
    currentSession: state.currentSession,
    messages: state.messages,
    isProcessing: state.isProcessing,
    recommendations: state.recommendations,
    error: state.error,
    
    // Actions principales
    startSession,
    sendMessage,
    getRecommendations,
    resumeSession,
    clearSession,
    
    // Compatibilité
    clearMessages,
    addMessage,
    
    // Historique et analyse
    loadSessionHistory,
    getProgress,
    
    // Alias pour compatibilité
    loading: state.isProcessing,
    isTyping: state.isProcessing
  };
};