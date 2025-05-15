
import { VRSession, VRSessionTemplate } from '@/types';

// Mock VR templates
const vrTemplates: VRSessionTemplate[] = [
  {
    id: '1',
    title: 'Méditation en forêt',
    description: 'Une méditation immersive au cœur d\'une forêt paisible',
    duration: 600, // 10 minutes
    type: 'meditation',
    thumbnail: '/images/vr/forest-meditation.jpg',
    videoUrl: '/videos/forest-meditation.mp4',
    emotion: 'calm',
    emotionTarget: 'calm',
    benefits: ['Réduction du stress', 'Amélioration du sommeil', 'Clarté mentale'],
    difficulty: 'débutant'
  },
  {
    id: '2',
    title: 'Plage tropicale',
    description: 'Échappez-vous sur une plage tropicale idyllique',
    duration: 900, // 15 minutes
    type: 'relaxation',
    thumbnail: '/images/vr/tropical-beach.jpg',
    videoUrl: '/videos/tropical-beach.mp4',
    emotion: 'happy',
    emotionTarget: 'joy',
    benefits: ['Réduction de l\'anxiété', 'Élévation de l\'humeur', 'Détente profonde'],
    difficulty: 'intermédiaire'
  }
];

// Mock VR sessions
const vrSessions: VRSession[] = [
  {
    id: '101',
    templateId: '1',
    userId: 'user123',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 10 * 60000).toISOString(),
    duration: 600,
    completed: true,
    emotionBefore: 'stressed',
    emotionAfter: 'calm',
    emotionTarget: 'calm',
    rating: 4
  },
  {
    id: '102',
    templateId: '2',
    userId: 'user123',
    startTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    endTime: new Date(Date.now() - 86400000 + 15 * 60000).toISOString(),
    duration: 900,
    completed: true,
    emotionBefore: 'anxious',
    emotionAfter: 'relaxed',
    emotionTarget: 'joy',
    rating: 5
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
        startTime: new Date().toISOString(),
        duration: sessionData.duration || 0,
        completed: false,
        emotionBefore: sessionData.emotionBefore,
        emotionTarget: sessionData.emotionTarget,
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
        endTime: new Date().toISOString(),
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
      // Filter templates that match or counter the current emotion
      const recommended = vrTemplates.filter(t => 
        t.emotionTarget === emotion || 
        (emotion === 'stressed' && t.emotionTarget === 'calm') ||
        (emotion === 'sad' && t.emotionTarget === 'joy')
      );
      resolve(recommended.length ? recommended : vrTemplates);
    }, 500);
  });
};
