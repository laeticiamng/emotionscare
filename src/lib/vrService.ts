
/**
 * MOCK DATA
 * Ce fichier respecte strictement les types officiels VRSession et VRSessionTemplate
 * Toute modification doit être propagée dans le type officiel ET dans tous les composants consommateurs.
 */

import { VRSession, VRSessionTemplate } from '@/types/vr';

// Mock VR templates
const vrTemplates: VRSessionTemplate[] = [
  {
    id: '1',
    title: 'Méditation en forêt',
    description: 'Une méditation immersive au cœur d\'une forêt paisible',
    duration: 600, // 10 minutes
    difficulty: 'débutant',
    thumbnailUrl: '/images/vr/forest-meditation.jpg',
    environment: 'forest',
    category: 'meditation',
    tags: ['nature', 'relaxation', 'méditation'],
    immersionLevel: 'medium',
    goalType: 'meditation',
    audioTrack: '/audio/forest-meditation.mp3',
    interactive: false,
    recommendedFor: ['stress', 'anxiety']
  },
  {
    id: '2',
    title: 'Plage tropicale',
    description: 'Échappez-vous sur une plage tropicale idyllique',
    duration: 900, // 15 minutes
    difficulty: 'intermédiaire',
    thumbnailUrl: '/images/vr/tropical-beach.jpg',
    environment: 'beach',
    category: 'relaxation',
    tags: ['plage', 'mer', 'soleil'],
    immersionLevel: 'high',
    goalType: 'relaxation',
    audioTrack: '/audio/tropical-beach.mp4',
    interactive: false,
    recommendedFor: ['anxiety', 'stress']
  }
];

// Mock VR sessions
const vrSessions: VRSession[] = [
  {
    id: '101',
    templateId: '1',
    userId: 'user123',
    startedAt: new Date().toISOString(),
    endedAt: new Date(Date.now() + 10 * 60000).toISOString(),
    duration: 600,
    completed: true,
    feedback: {
      rating: 4,
      emotionBefore: 'stressed',
      emotionAfter: 'calm',
      comment: 'Très relaxant, j\'ai beaucoup aimé'
    }
  },
  {
    id: '102',
    templateId: '2',
    userId: 'user123',
    startedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    endedAt: new Date(Date.now() - 86400000 + 15 * 60000).toISOString(),
    duration: 900,
    completed: true,
    feedback: {
      rating: 5,
      emotionBefore: 'anxious',
      emotionAfter: 'relaxed',
      comment: 'Parfait pour se détendre'
    }
  }
];

// VR service functions
export const fetchVRTemplates = async (): Promise<VRSessionTemplate[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(vrTemplates), 500);
  });
};

export const fetchVRTemplate = async (templateId: string): Promise<VRSessionTemplate | null> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const template = vrTemplates.find(t => t.id === templateId) || null;
      resolve(template);
    }, 300);
  });
};

export const fetchVRSessionHistory = async (userId: string): Promise<VRSession[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const userSessions = vrSessions.filter(s => s.userId === userId);
      resolve(userSessions);
    }, 500);
  });
};

export const createVRSession = async (sessionData: Partial<VRSession>): Promise<VRSession> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const newSession: VRSession = {
        id: Math.random().toString(36).substr(2, 9),
        templateId: sessionData.templateId || '',
        userId: sessionData.userId || '',
        startedAt: new Date().toISOString(),
        duration: sessionData.duration || 0,
        completed: false,
        ...sessionData
      };
      vrSessions.push(newSession);
      resolve(newSession);
    }, 300);
  });
};

export const completeVRSession = async (sessionId: string, sessionData: Partial<VRSession>): Promise<VRSession> => {
  // Simulate API call delay
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const sessionIndex = vrSessions.findIndex(s => s.id === sessionId);
      if (sessionIndex === -1) {
        reject(new Error('Session not found'));
        return;
      }
      
      const updatedSession: VRSession = {
        ...vrSessions[sessionIndex],
        ...sessionData,
        endedAt: new Date().toISOString(),
        completed: true
      };
      
      vrSessions[sessionIndex] = updatedSession;
      resolve(updatedSession);
    }, 300);
  });
};

export const fetchSessionById = async (sessionId: string): Promise<VRSession | null> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const session = vrSessions.find(s => s.id === sessionId) || null;
      resolve(session);
    }, 300);
  });
};

export const fetchTemplateById = async (templateId: string): Promise<VRSessionTemplate | null> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const template = vrTemplates.find(t => t.id === templateId) || null;
      resolve(template);
    }, 300);
  });
};

export const getRecommendedTemplates = async (emotion: string): Promise<VRSessionTemplate[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter templates that are recommended for this emotion
      const recommended = vrTemplates.filter(t => 
        t.recommendedFor?.includes(emotion) || 
        (emotion === 'stressed' && t.goalType === 'relaxation') ||
        (emotion === 'sad' && t.goalType === 'energizing')
      );
      resolve(recommended.length ? recommended : vrTemplates);
    }, 500);
  });
};
