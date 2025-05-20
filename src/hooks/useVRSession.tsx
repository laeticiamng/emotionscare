
import { useState, useEffect } from 'react';
import { VRSession, VRSessionTemplate } from '@/types/vr';

// Mock templates
const defaultTemplates: VRSessionTemplate[] = [
  {
    id: 'vr-template-1',
    name: 'Relaxation forestière',
    title: 'Relaxation forestière',
    description: 'Une immersion dans une forêt paisible pour la relaxation profonde',
    duration: 600,
    thumbnailUrl: '/images/vr/forest.jpg',
    environmentId: 'env-forest',
    category: 'relaxation',
    intensity: 3,
    difficulty: 'easy',
    immersionLevel: 'deep',
    goalType: 'relaxation',
    interactive: false,
    tags: ['nature', 'calm', 'forest', 'relaxation']
  },
  {
    id: 'vr-template-2',
    name: 'Méditation plage',
    title: 'Méditation plage',
    description: 'Méditation guidée sur une plage au coucher du soleil',
    duration: 900,
    thumbnailUrl: '/images/vr/beach.jpg',
    environmentId: 'env-beach',
    category: 'meditation',
    intensity: 2,
    difficulty: 'easy',
    immersionLevel: 'medium',
    goalType: 'meditation',
    interactive: false,
    tags: ['beach', 'sunset', 'meditation', 'ocean']
  }
];

/**
 * Hook for managing VR sessions
 */
export function useVRSession() {
  const [sessions, setSessions] = useState<VRSession[]>([]);
  const [templates, setTemplates] = useState<VRSessionTemplate[]>(defaultTemplates);
  const [activeSession, setActiveSession] = useState<VRSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load user sessions
  useEffect(() => {
    // Here you would normally fetch from API
    // This is just a mock implementation
    const mockSessions: VRSession[] = [
      {
        id: 'session-1',
        templateId: 'vr-template-1',
        userId: 'user-1',
        startTime: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        duration: 600,
        completed: true,
        progress: 100,
        feedback: {
          id: 'feedback-1',
          sessionId: 'session-1',
          userId: 'user-1',
          timestamp: new Date().toISOString(),
          rating: 4,
          emotionBefore: 'stressed',
          emotionAfter: 'calm',
          comment: 'Très relaxant'
        }
      }
    ];

    setSessions(mockSessions);
  }, []);

  // Start a new VR session
  const startSession = async (templateId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const template = templates.find(t => t.id === templateId);
      
      if (!template) {
        throw new Error('Template not found');
      }
      
      const newSession: VRSession = {
        id: `session-${Date.now()}`,
        templateId,
        userId: 'user-1',  // In a real app, get from auth context
        startTime: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        duration: template.duration,
        completed: false,
        progress: 0
      };
      
      // In a real app, you'd save to API here
      setSessions(prev => [...prev, newSession]);
      setActiveSession(newSession);
      return newSession;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to start session');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // End an active VR session
  const endSession = async (sessionId: string, feedback?: {
    rating: number;
    emotionBefore: string;
    emotionAfter: string;
    comment: string;
  }) => {
    if (!activeSession || activeSession.id !== sessionId) {
      throw new Error('No active session found');
    }
    
    const updatedSession: VRSession = {
      ...activeSession,
      endedAt: new Date().toISOString(),
      completed: true,
      progress: 100,
      feedback: {
        id: `feedback-${Date.now()}`,
        sessionId: sessionId,
        userId: activeSession.userId,
        timestamp: new Date().toISOString(),
        ...feedback
      } as any // Type casting to avoid feedback property type issues
    };
    
    // In a real app, you'd update via API
    setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));
    setActiveSession(null);
    return updatedSession;
  };

  return {
    sessions,
    templates,
    activeSession,
    isLoading,
    error,
    startSession,
    endSession
  };
}

export default useVRSession;
