
import { v4 as uuidv4 } from 'uuid';

interface VRSession {
  id: string;
  title: string;
  description: string;
  duration: number;  // in seconds
  date: string;
  type: string;      // e.g., "relaxation", "focus", "energy"
  user_id: string;
  completed: boolean;
  score?: number;
  emotion_before?: string;
  emotion_after?: string;
}

// Mock VR sessions data
let mockVRSessions: VRSession[] = [
  {
    id: '1',
    title: 'Session pleine conscience',
    description: 'Méditation guidée pour la conscience de soi',
    duration: 600,
    date: '2023-05-10T14:30:00Z',
    type: 'relaxation',
    user_id: 'user-1',
    completed: true,
    score: 85,
    emotion_before: 'stressed',
    emotion_after: 'calm'
  },
  {
    id: '2',
    title: 'Forêt apaisante',
    description: 'Immersion dans un environnement naturel relaxant',
    duration: 900,
    date: '2023-05-15T10:00:00Z',
    type: 'relaxation',
    user_id: 'user-1',
    completed: true,
    score: 92,
    emotion_before: 'anxious',
    emotion_after: 'peaceful'
  },
  {
    id: '3',
    title: 'Focus productivity',
    description: 'Environnement de travail virtuel optimisé',
    duration: 1800,
    date: '2023-05-20T09:15:00Z',
    type: 'focus',
    user_id: 'user-1',
    completed: false
  }
];

// Fetch all VR sessions for a user
export const fetchVRSessions = async (userId: string): Promise<VRSession[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockVRSessions.filter(session => session.user_id === userId);
};

// Fetch a specific VR session
export const fetchVRSession = async (id: string): Promise<VRSession | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockVRSessions.find(session => session.id === id);
};

// Create a new VR session
export const createVRSession = async (sessionData: Partial<VRSession>): Promise<VRSession> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));

  const newSession: VRSession = {
    id: uuidv4(),
    title: sessionData.title || 'Session sans titre',
    description: sessionData.description || '',
    duration: sessionData.duration || 600,
    date: sessionData.date || new Date().toISOString(),
    type: sessionData.type || 'relaxation',
    user_id: sessionData.user_id || 'user-1',
    completed: sessionData.completed || false,
    score: sessionData.score,
    emotion_before: sessionData.emotion_before,
    emotion_after: sessionData.emotion_after
  };

  mockVRSessions.push(newSession);
  return newSession;
};

// Complete a VR session
export const completeVRSession = async (id: string, data: { score?: number, emotion_after?: string }): Promise<VRSession | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const sessionIndex = mockVRSessions.findIndex(session => session.id === id);
  if (sessionIndex === -1) return undefined;

  mockVRSessions[sessionIndex] = {
    ...mockVRSessions[sessionIndex],
    completed: true,
    score: data.score || mockVRSessions[sessionIndex].score,
    emotion_after: data.emotion_after || mockVRSessions[sessionIndex].emotion_after
  };

  return mockVRSessions[sessionIndex];
};

// Save a relaxation session (for backward compatibility)
export const saveRelaxationSession = async (sessionId: string): Promise<{ success: boolean; sessionId: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const sessionIndex = mockVRSessions.findIndex(session => session.id === sessionId);
  
  if (sessionIndex !== -1) {
    mockVRSessions[sessionIndex].completed = true;
    return { success: true, sessionId };
  }
  
  return { success: false, sessionId };
};
