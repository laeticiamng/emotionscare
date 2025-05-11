
import { useState, useCallback } from 'react';
import { VRSession, VRSessionTemplate } from '@/types/vr';
import { saveVRSession, getVRSessionHistory } from '@/lib/vrService';

export const useVRSession = (userId: string) => {
  const [currentSession, setCurrentSession] = useState<VRSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<VRSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // Commencer une nouvelle session VR
  const startSession = useCallback((template: VRSessionTemplate, emotionBefore?: string) => {
    const newSession: VRSession = {
      id: `session-${Date.now()}`,
      user_id: userId,
      template_id: template.id,
      start_time: new Date().toISOString(),
      duration_seconds: 0,
      completed: false,
      template: template,
      emotion_before: emotionBefore,
      emotions: template.emotions || [],
    };
    
    setCurrentSession(newSession);
    return newSession;
  }, [userId]);
  
  // Terminer une session VR en cours
  const completeSession = useCallback(async (emotionAfter?: string) => {
    setIsLoading(true);
    
    try {
      if (currentSession) {
        const endTime = new Date();
        const startTime = new Date(currentSession.start_time);
        const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
        
        const completedSession: VRSession = {
          ...currentSession,
          end_time: endTime.toISOString(),
          duration_seconds: durationSeconds,
          completed: true,
          emotion_after: emotionAfter,
        };
        
        // Enregistrer la session dans l'API
        const savedSession = await saveVRSession(completedSession);
        
        // Mettre à jour l'historique local avec la nouvelle session
        setSessionHistory(prev => [savedSession, ...prev]);
        setCurrentSession(null);
        
        return savedSession;
      }
      return null;
    } catch (error) {
      console.error('Erreur lors de la finalisation de la session:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentSession]);
  
  // Charger l'historique des sessions
  const loadSessionHistory = useCallback(async () => {
    setHistoryLoading(true);
    
    try {
      const history = await getVRSessionHistory(userId);
      setSessionHistory(history);
      return history;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique des sessions:', error);
      return [];
    } finally {
      setHistoryLoading(false);
    }
  }, [userId]);
  
  return {
    currentSession,
    sessionHistory,
    isLoading,
    historyLoading,
    startSession,
    completeSession,
    loadSessionHistory,
  };
};

export default useVRSession;
