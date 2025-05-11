
import { useState, useCallback, useEffect } from 'react';
import { VRSession, VRSessionTemplate } from '@/types/vr';
import { saveVRSession, getRecommendedSessions } from '@/lib/vrService';
import { mockVRTemplates } from '@/data/mockVRTemplates';

export function useVRSession(userId: string) {
  const [currentSession, setCurrentSession] = useState<VRSession | null>(null);
  const [sessionHistory, setSessionHistory] = useState<VRSession[]>([]);
  const [templates, setTemplates] = useState<VRSessionTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Load templates when hook is initialized
  useEffect(() => {
    setIsLoading(true);
    // Use mockVRTemplates as our data source
    setTemplates(mockVRTemplates);
    setIsLoading(false);
  }, []);

  // Check if there's an active session
  const isActive = !!currentSession && !currentSession.completed;

  /**
   * Start a new VR session with the specified template
   */
  const startSession = useCallback((template: VRSessionTemplate, emotionBefore?: string) => {
    // Create a new session
    const newSession: VRSession = {
      id: `session-${Date.now()}`,
      user_id: userId,
      template_id: template.id,
      start_time: new Date().toISOString(),
      duration_seconds: template.duration * 60,
      completed: false,
      template: template,
      emotion_before: emotionBefore
    };
    
    setCurrentSession(newSession);
    // Add to history as well
    setSessionHistory(prev => [newSession, ...prev]);
    
    return newSession;
  }, [userId]);
  
  /**
   * Complete the current session
   */
  const completeSession = useCallback(async (emotionAfter?: string) => {
    if (!currentSession) return null;
    
    setIsLoading(true);
    try {
      const completedSession: VRSession = {
        ...currentSession,
        end_time: new Date().toISOString(),
        completed: true,
        emotion_after: emotionAfter
      };
      
      // Save to backend
      const savedSession = await saveVRSession(completedSession);
      
      setCurrentSession(savedSession);
      
      // Update in history
      setSessionHistory(prev => 
        prev.map(s => s.id === savedSession.id ? savedSession : s)
      );
      
      return savedSession;
    } catch (error) {
      console.error('Error completing VR session:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [currentSession]);
  
  /**
   * Load session history for current user
   */
  const loadSessionHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      // In real app, this would be fetched from API
      const mockHistory: VRSession[] = [];
      setSessionHistory(mockHistory);
      return mockHistory;
    } catch (error) {
      console.error('Error loading session history:', error);
      return [];
    } finally {
      setHistoryLoading(false);
    }
  }, []);
  
  return {
    currentSession,
    sessionHistory,
    templates,
    isLoading,
    historyLoading,
    isActive,
    startSession,
    completeSession,
    loadSessionHistory
  };
}

export default useVRSession;
