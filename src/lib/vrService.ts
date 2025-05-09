
import { VRSession, VRSessionTemplate } from '@/types';
import { mockVRTemplatesData } from '@/data/mockVRTemplates';

// Mock VR sessions data
const mockVRSessions: VRSession[] = [
  {
    id: '1',
    template_id: 'vr-template-1',
    user_id: 'user-1',
    start_time: '2023-05-12T14:30:00Z',
    duration: 600, // 10 minutes in seconds
    completed: true,
    mood_before: 'stressed',
    mood_after: 'relaxed',
    is_audio_only: false
  },
  {
    id: '2',
    template_id: 'vr-template-3',
    user_id: 'user-1',
    start_time: '2023-05-14T18:15:00Z',
    duration: 900, // 15 minutes in seconds
    completed: true,
    mood_before: 'anxious',
    mood_after: 'calm',
    is_audio_only: true
  },
  {
    id: '3',
    template_id: 'vr-template-2',
    user_id: 'user-1',
    start_time: '2023-05-16T09:45:00Z',
    duration: 1200, // 20 minutes in seconds
    completed: false,
    mood_before: 'tired',
    is_audio_only: false
  }
];

// Fetch all VR session templates
export const fetchVRTemplates = async (): Promise<VRSessionTemplate[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockVRTemplatesData;
};

// Fetch a specific VR template
export const fetchVRTemplate = async (id: string): Promise<VRSessionTemplate | undefined> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockVRTemplatesData.find(template => template.id === id || template.template_id === id);
};

// Fetch user's VR sessions
export const fetchUserVRSessions = async (userId: string): Promise<VRSession[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return mockVRSessions.filter(session => session.user_id === userId);
};

// Start a new VR session
export const startVRSession = async (templateId: string, userId: string, isAudioOnly: boolean): Promise<VRSession> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const newSession: VRSession = {
    id: `vr-session-${Date.now()}`,
    template_id: templateId,
    user_id: userId,
    start_time: new Date().toISOString(),
    duration: 0,
    completed: false,
    is_audio_only: isAudioOnly
  };
  
  mockVRSessions.push(newSession);
  return newSession;
};

// Complete a VR session
export const completeVRSession = async (sessionId: string, data: {
  mood_after?: string;
  duration?: number;
  feedback?: string;
}): Promise<VRSession> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const sessionIndex = mockVRSessions.findIndex(s => s.id === sessionId);
  if (sessionIndex === -1) {
    throw new Error('VR session not found');
  }
  
  mockVRSessions[sessionIndex] = {
    ...mockVRSessions[sessionIndex],
    completed: true,
    mood_after: data.mood_after || mockVRSessions[sessionIndex].mood_after,
    duration: data.duration || mockVRSessions[sessionIndex].duration,
    feedback: data.feedback
  };
  
  return mockVRSessions[sessionIndex];
};

// Function to save a relaxation session - used by coach events
export const saveRelaxationSession = async (sessionId: string): Promise<VRSession> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Find the session if it exists, or create a placeholder
  let session = mockVRSessions.find(s => s.id === sessionId);
  
  if (!session) {
    session = {
      id: sessionId,
      template_id: 'auto-generated',
      user_id: 'user-1',
      start_time: new Date().toISOString(),
      duration: 300, // Default 5 minutes
      completed: true,
      mood_before: 'unknown',
      mood_after: 'relaxed',
      is_audio_only: true
    };
    mockVRSessions.push(session);
  } else {
    // Mark existing session as completed
    const index = mockVRSessions.findIndex(s => s.id === sessionId);
    mockVRSessions[index] = {
      ...mockVRSessions[index],
      completed: true,
      mood_after: mockVRSessions[index].mood_after || 'relaxed'
    };
  }
  
  return session;
};

// Get VR session statistics
export const getVRSessionStats = async (userId: string): Promise<{
  total: number;
  completed: number;
  totalDuration: number;
  averageDuration: number;
  mostUsedTemplate?: string;
}> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const userSessions = mockVRSessions.filter(session => session.user_id === userId);
  
  const completedSessions = userSessions.filter(session => session.completed);
  const totalDuration = completedSessions.reduce((sum, session) => sum + session.duration, 0);
  
  // Find most used template
  const templateCounts: Record<string, number> = {};
  userSessions.forEach(session => {
    templateCounts[session.template_id] = (templateCounts[session.template_id] || 0) + 1;
  });
  
  let mostUsedTemplate: string | undefined;
  let maxCount = 0;
  
  Object.entries(templateCounts).forEach(([templateId, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostUsedTemplate = templateId;
    }
  });
  
  return {
    total: userSessions.length,
    completed: completedSessions.length,
    totalDuration,
    averageDuration: completedSessions.length > 0 ? totalDuration / completedSessions.length : 0,
    mostUsedTemplate
  };
};
