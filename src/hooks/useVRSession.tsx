
import { useState, useEffect } from 'react';
import { VRSessionTemplate, VRSession } from '@/types/vr';

export const useVRSession = () => {
  const [availableSessions, setAvailableSessions] = useState<VRSessionTemplate[]>([
    {
      id: '1',
      title: 'Morning Meditation',
      name: 'Morning Meditation',
      description: 'Start your day with a calm and focused mind',
      thumbnailUrl: '/images/vr-meditation.jpg',
      duration: 15,
      difficulty: 'Beginner',
      category: 'Meditation',
      tags: ['morning', 'focus', 'calm'],
      immersionLevel: 'Medium', // Required property
      goalType: 'Focus', // Required property
      interactive: false // Required property
    },
    {
      id: '2',
      title: 'Stress Relief',
      name: 'Stress Relief',
      description: 'Release tension and find your center',
      thumbnailUrl: '/images/vr-stress-relief.jpg',
      duration: 20,
      difficulty: 'Intermediate',
      category: 'Relaxation',
      tags: ['stress', 'relaxation', 'evening'],
      immersionLevel: 'Deep', // Required property
      goalType: 'Relaxation', // Required property
      interactive: false // Required property
    }
  ]);

  const [currentSession, setCurrentSession] = useState<VRSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Simulate loading available sessions
  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true);
      try {
        // In a real app, fetch from API
        await new Promise(res => setTimeout(res, 500)); // Simulate network delay
        // Sessions already set in initial state
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load VR sessions'));
      } finally {
        setLoading(false);
      }
    };
    
    loadSessions();
  }, []);

  // Start a new VR session
  const startSession = (templateId: string) => {
    const template = availableSessions.find(s => s.id === templateId);
    
    if (!template) {
      const err = new Error(`VR session template with id ${templateId} not found`);
      setError(err);
      throw err;
    }
    
    const newSession: VRSession = {
      id: `session-${Date.now()}`,
      templateId: template.id,
      userId: 'current-user', // Would be dynamic in a real app
      startTime: new Date().toISOString(),
      metrics: {}
    };
    
    setCurrentSession(newSession);
    return newSession;
  };

  // End the current session
  const endSession = () => {
    if (!currentSession) return null;
    
    const endedSession: VRSession = {
      ...currentSession,
      endTime: new Date().toISOString(),
      completed: true
    };
    
    setCurrentSession(null);
    return endedSession;
  };

  return {
    availableSessions,
    currentSession,
    loading,
    error,
    startSession,
    endSession
  };
};

export default useVRSession;
