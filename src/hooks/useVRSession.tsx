import { useState, useEffect, useCallback } from 'react';
import { VRSession, VRSessionTemplate } from '@/types/types';
import { mockVRTemplates } from '@/data/mockVRTemplates';

export const useVRSession = (userId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState<VRSession[]>([]);
  const [currentSession, setCurrentSession] = useState<VRSession | null>(null);
  const [templates, setTemplates] = useState<VRSessionTemplate[]>([]);

  // Load VR templates
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        // In a real application, this would fetch from an API
        // Set default title to name if needed
        const processedTemplates = mockVRTemplates.map(template => ({
          ...template,
          title: template.title || template.name || '',
        }));
        setTemplates(processedTemplates);
      } catch (error) {
        console.error("Error loading VR templates:", error);
      }
    };

    const loadUserSessions = async () => {
      try {
        // Mock data - in a real app, this would fetch from an API
        const mockSessions: VRSession[] = [
          {
            id: 'session-1',
            userId: userId,
            templateId: '1',
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString(),
            duration_seconds: 300,
            completed: true,
            heart_rate_before: 75,
            heart_rate_after: 68
          },
          {
            id: 'session-2',
            userId: userId,
            templateId: '3',
            startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString(),
            duration_seconds: 900,
            completed: true,
            heart_rate_before: 82,
            heart_rate_after: 70
          }
        ];

        setSessions(mockSessions);
      } catch (error) {
        console.error("Error loading user sessions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
    loadUserSessions();
  }, [userId]);

  // Start a new VR session
  const startSession = useCallback((templateId: string): VRSession => {
    const template = templates.find(t => t.id === templateId);
    if (!template) {
      throw new Error("Template not found");
    }

    const newSession: VRSession = {
      id: `session-${Date.now()}`,
      userId: userId,
      templateId: templateId,
      startDate: new Date().toISOString(),
      duration_seconds: template.duration * 60,
      completed: false
    };

    setCurrentSession(newSession);
    return newSession;
  }, [templates, userId]);

  // Complete a VR session
  const completeSession = useCallback((sessionId: string, emotionAfter?: string) => {
    setSessions(prevSessions => {
      const updatedSessions = prevSessions.map(session => {
        if (session.id === sessionId) {
          return {
            ...session,
            endTime: new Date().toISOString(),
            completed: true,
            emotion_after: emotionAfter || session.emotion_after
          };
        }
        return session;
      });
      return updatedSessions;
    });

    setCurrentSession(null);
  }, []);

  // Get stats for a user
  const getUserStats = useCallback(() => {
    const completedCount = sessions.filter(s => s.completed).length;
    const totalDuration = sessions.reduce((acc, session) => {
      return acc + (session.duration_seconds || 0);
    }, 0);
    
    return {
      sessionsCount: sessions.length,
      completedCount,
      totalDurationMinutes: Math.floor(totalDuration / 60),
      lastSessionDate: sessions.length > 0 ? new Date(sessions[0].startDate) : null
    };
  }, [sessions]);

  return {
    isLoading,
    sessions,
    templates,
    currentSession,
    startSession,
    completeSession,
    getUserStats
  };
};

export default useVRSession;
