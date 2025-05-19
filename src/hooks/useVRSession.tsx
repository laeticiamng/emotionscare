
import { useState, useEffect } from 'react';
import { VRSessionTemplate, VRSession } from '@/types/vr';

export const useVRSession = (userId: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTemplates, setActiveTemplates] = useState<VRSessionTemplate[]>([]);
  
  // Mock data for VR sessions
  const mockTemplates: VRSessionTemplate[] = [
    {
      id: 'template-1',
      title: 'Méditation matinale',
      description: 'Commencez votre journée avec une méditation guidée pour un esprit clair',
      duration: 15,
      thumbnailUrl: '/images/meditation-morning.jpg',
      environmentId: 'env-1',
      category: 'méditation',
      intensity: 1,
      difficulty: 'beginner', // Corrigé
      immersionLevel: 'Medium',
      goalType: 'Focus',
      interactive: false,
      tags: ['morning', 'calm', 'focus']
    },
    {
      id: 'template-2',
      title: 'Relaxation profonde',
      description: 'Une session immersive pour libérer le stress et retrouver l\'équilibre',
      duration: 25,
      thumbnailUrl: '/images/deep-relaxation.jpg',
      environmentId: 'env-2',
      category: 'relaxation',
      intensity: 2,
      difficulty: 'intermediate', // Corrigé
      immersionLevel: 'Deep',
      goalType: 'Relaxation',
      interactive: false,
      tags: ['stress-relief', 'evening', 'sleep']
    }
  ];

  useEffect(() => {
    // Simuler un chargement
    const timer = setTimeout(() => {
      setActiveTemplates(mockTemplates);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const startSession = (templateId: string): Promise<VRSession> => {
    return new Promise((resolve) => {
      // Simuler une interaction avec l'API
      setTimeout(() => {
        const session: VRSession = {
          id: `session-${Date.now()}`,
          templateId,
          userId,
          progress: 0,
          completed: false,
          duration: 0,
          startTime: new Date().toISOString()
        };
        
        resolve(session);
      }, 500);
    });
  };

  const completeSession = (sessionId: string) => {
    // Logique de finalisation de session
    console.log(`Session ${sessionId} completed`);
  };

  return {
    isLoading,
    templates: activeTemplates,
    startSession,
    completeSession
  };
};

export default useVRSession;
