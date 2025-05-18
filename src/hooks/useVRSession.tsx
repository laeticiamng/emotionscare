
import { useState, useEffect } from 'react';
import { VRSession, VRSessionTemplate } from '@/types/vr';

interface UseVRSessionReturn {
  sessions: VRSession[];
  templates: VRSessionTemplate[];
  activeSession: VRSession | null;
  startSession: (templateId: string) => Promise<VRSession>;
  endSession: (sessionId: string, feedback?: string, rating?: number) => Promise<void>;
  loading: boolean;
  error: Error | null;
}

export function useVRSession(userId: string): UseVRSessionReturn {
  const [sessions, setSessions] = useState<VRSession[]>([]);
  const [templates, setTemplates] = useState<VRSessionTemplate[]>([]);
  const [activeSession, setActiveSession] = useState<VRSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simuler un chargement des données depuis une API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Templates fictifs
        const mockTemplates: VRSessionTemplate[] = [
          {
            id: 'vrt-1',
            name: 'Méditation en forêt',
            description: 'Une séance de méditation dans une forêt calme',
            duration: 600, // 10 minutes
            environment: 'forest',
            intensity: 2,
            tags: ['meditation', 'nature', 'calm'],
            objective: 'Détente et relaxation'
          },
          {
            id: 'vrt-2',
            name: 'Plage paradisiaque',
            description: 'Relaxation sur une plage tropicale',
            duration: 900, // 15 minutes
            environment: 'beach',
            intensity: 1,
            tags: ['relaxation', 'beach', 'water'],
            objective: 'Réduire l\'anxiété'
          }
        ];
        
        // Sessions fictives
        const mockSessions: VRSession[] = [
          {
            id: 'vrs-1',
            userId,
            templateId: 'vrt-1',
            startTime: new Date(Date.now() - 86400000), // Hier
            endTime: new Date(Date.now() - 86400000 + 600000),
            completed: true,
            feedback: 'Très relaxant',
            rating: 5
          }
        ];
        
        setTemplates(mockTemplates);
        setSessions(mockSessions);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Erreur lors du chargement des données VR'));
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);
  
  const startSession = async (templateId: string): Promise<VRSession> => {
    try {
      const template = templates.find(t => t.id === templateId);
      
      if (!template) {
        throw new Error('Template non trouvé');
      }
      
      const newSession: VRSession = {
        id: `vrs-${Date.now()}`,
        userId,
        templateId,
        startTime: new Date(),
        completed: false
      };
      
      setActiveSession(newSession);
      setSessions(prev => [...prev, newSession]);
      
      return newSession;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur lors du démarrage de la session');
      setError(error);
      throw error;
    }
  };
  
  const endSession = async (sessionId: string, feedback?: string, rating?: number): Promise<void> => {
    try {
      setSessions(prev => 
        prev.map(session => 
          session.id === sessionId 
            ? {
                ...session,
                endTime: new Date(),
                completed: true,
                feedback,
                rating
              }
            : session
        )
      );
      
      setActiveSession(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur lors de la fin de la session');
      setError(error);
      throw error;
    }
  };
  
  return {
    sessions,
    templates,
    activeSession,
    startSession,
    endSession,
    loading,
    error
  };
}

export default useVRSession;
