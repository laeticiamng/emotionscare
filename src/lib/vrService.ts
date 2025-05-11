
import { supabase } from '@/integrations/supabase/client';
import { VRSession, VRSessionTemplate } from '@/types/vr';

// Mock data and implementations to avoid supabase table errors
const mockTemplates: VRSessionTemplate[] = [
  {
    id: "template-1",
    name: "Deep Relaxation",
    title: "Deep Relaxation Session",
    description: "A calming session to reduce stress and anxiety",
    duration: 10,
    theme: "nature",
    is_audio_only: false,
    preview_url: "/images/relaxation-preview.jpg",
    audio_url: "/audio/relaxation.mp3",
    category: "relaxation",
    difficulty: "easy",
    tags: ["stress", "anxiety", "mindfulness"],
    benefits: ["Reduces stress", "Improves focus", "Enhances wellbeing"],
    emotions: ["calm", "relaxed", "peaceful"],
    popularity: 95
  },
  {
    id: "template-2",
    name: "Energy Boost",
    title: "Energy Boost Session",
    description: "A short session to increase energy and motivation",
    duration: 5,
    theme: "energy",
    is_audio_only: false,
    preview_url: "/images/energy-preview.jpg",
    audio_url: "/audio/energy.mp3",
    category: "energy",
    difficulty: "easy",
    tags: ["energy", "motivation", "morning"],
    benefits: ["Increases energy", "Enhances mood", "Improves motivation"],
    emotions: ["energized", "motivated", "focused"],
    popularity: 88
  }
];

const mockSessions: VRSession[] = [];

export const getVRTemplates = async () => {
  try {
    // Return mock data instead of using supabase directly
    return mockTemplates;
  } catch (error) {
    console.error('Error fetching VR session templates:', error);
    throw error;
  }
};

export const getVRTemplate = async (id: string) => {
  try {
    // Find template in mock data
    const template = mockTemplates.find(t => t.id === id);
    return template || null;
  } catch (error) {
    console.error('Error fetching VR session template:', error);
    throw error;
  }
};

export const getUserVRSessions = async (userId: string) => {
  try {
    // Filter mock sessions by userId
    return mockSessions.filter(session => session.user_id === userId);
  } catch (error) {
    console.error('Error fetching user VR sessions:', error);
    throw error;
  }
};

export const getVRSession = async (id: string) => {
  try {
    // Find session in mock data
    const session = mockSessions.find(s => s.id === id);
    return session || null;
  } catch (error) {
    console.error('Error fetching VR session:', error);
    throw error;
  }
};

export const createVRSession = async (sessionData: Partial<VRSession>) => {
  try {
    // Create new session with mock data
    const newSession: VRSession = {
      id: `session-${Date.now()}`,
      user_id: sessionData.user_id || 'anonymous',
      template_id: sessionData.template_id || '',
      start_time: sessionData.start_time || new Date().toISOString(),
      end_time: sessionData.end_time,
      duration_seconds: sessionData.duration_seconds || 0,
      completed: sessionData.completed || false,
      template: sessionData.template,
      date: sessionData.date,
      duration: sessionData.duration,
      is_audio_only: sessionData.is_audio_only,
      heart_rate_before: sessionData.heart_rate_before,
      heart_rate_after: sessionData.heart_rate_after,
      started_at: sessionData.started_at,
      completed_at: sessionData.completed_at,
      emotion_before: sessionData.emotion_before,
      emotion_after: sessionData.emotion_after,
      mood_before: sessionData.mood_before,
      mood_after: sessionData.mood_after
    };
    
    // Add to mock sessions
    mockSessions.push(newSession);
    return newSession;
  } catch (error) {
    console.error('Error creating VR session:', error);
    throw error;
  }
};

export const updateVRSession = async (id: string, sessionData: Partial<VRSession>) => {
  try {
    // Find and update session
    const sessionIndex = mockSessions.findIndex(s => s.id === id);
    if (sessionIndex >= 0) {
      mockSessions[sessionIndex] = {
        ...mockSessions[sessionIndex],
        ...sessionData
      };
      return mockSessions[sessionIndex];
    }
    throw new Error('Session not found');
  } catch (error) {
    console.error('Error updating VR session:', error);
    throw error;
  }
};

export const deleteVRSession = async (id: string) => {
  try {
    // Remove session from mock data
    const sessionIndex = mockSessions.findIndex(s => s.id === id);
    if (sessionIndex >= 0) {
      const removed = mockSessions.splice(sessionIndex, 1);
      return removed[0];
    }
    return null;
  } catch (error) {
    console.error('Error deleting VR session:', error);
    throw error;
  }
};

export const saveRelaxationSession = async (sessionData: Partial<VRSession>): Promise<boolean> => {
  try {
    // Mock implementation for relaxation sessions
    console.log('Saving relaxation session:', sessionData);
    
    // Create a new session with the data
    await createVRSession({
      ...sessionData,
      template_id: sessionData.template_id || 'template-1',
      completed: true,
      end_time: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Error saving relaxation session:', error);
    return false;
  }
};
