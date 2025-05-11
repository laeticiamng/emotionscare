
import { v4 as uuidv4 } from 'uuid';
import { VRSessionTemplate, VRSession } from '@/types/vr';

// Static VR templates
const vrTemplates: VRSessionTemplate[] = [
  {
    id: "vr-1",
    template_id: "vr-template-1",
    theme: "Ocean Meditation",
    title: "Ocean Relaxation",
    description: "Experience the calming waves of the ocean and reduce stress levels.",
    category: "relaxation",
    duration: 5,
    is_audio_only: false,
    preview_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    audio_url: "https://example.com/audio/ocean.mp3",
    benefits: ["Stress reduction", "Improved focus"],
    emotions: ["calm", "peaceful"],
    popularity: 95,
    tags: [],
    difficulty: "easy",
    name: "Ocean Meditation"
  },
  {
    id: "vr-2",
    template_id: "vr-template-2",
    theme: "Forest Walk",
    title: "Nature Immersion",
    description: "Take a walk through a peaceful forest and connect with nature.",
    category: "nature",
    duration: 10,
    is_audio_only: false,
    preview_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    audio_url: "https://example.com/audio/forest.mp3",
    benefits: ["Reduced anxiety", "Increased mindfulness"],
    emotions: ["peaceful", "grounded"],
    popularity: 88,
    tags: [],
    difficulty: "easy",
    name: "Forest Walk"
  }
];

// Mock active VR sessions
const activeSessions: VRSession[] = [];

// Get all VR templates
export const getVRTemplates = async (): Promise<VRSessionTemplate[]> => {
  // In a real app, this would make an API call
  return [...vrTemplates];
};

// Get a specific VR template by ID
export const getVRTemplate = async (templateId: string): Promise<VRSessionTemplate | null> => {
  const template = vrTemplates.find(t => t.id === templateId || t.template_id === templateId);
  return template || null;
};

// Start a new VR session
export const startVRSession = async (
  userId: string, 
  templateId: string,
  emotionBefore?: string,
  moodBefore?: string
): Promise<VRSession> => {
  const template = await getVRTemplate(templateId);
  
  if (!template) {
    throw new Error(`Template with ID ${templateId} not found`);
  }
  
  const now = new Date().toISOString();
  
  const session: VRSession = {
    id: uuidv4(),
    user_id: userId,
    template_id: templateId,
    start_time: now,
    duration_seconds: template.duration * 60,
    completed: false,
    template,
    started_at: now,
    is_audio_only: template.is_audio_only,
    emotion_before: emotionBefore,
    mood_before: moodBefore
  };
  
  activeSessions.push(session);
  return session;
};

// Complete a VR session
export const completeVRSession = async (
  sessionId: string,
  data?: {
    emotion_after?: string;
    mood_after?: string;
    heart_rate_after?: number;
  }
): Promise<VRSession> => {
  const sessionIndex = activeSessions.findIndex(s => s.id === sessionId);
  
  if (sessionIndex === -1) {
    throw new Error(`Session with ID ${sessionId} not found`);
  }
  
  const now = new Date().toISOString();
  const session = activeSessions[sessionIndex];
  
  const updatedSession: VRSession = {
    ...session,
    end_time: now,
    completed: true,
    ...(data || {})
  };
  
  activeSessions[sessionIndex] = updatedSession;
  return updatedSession;
};

// Get all sessions for a user
export const getVRSessionsForUser = async (userId: string): Promise<VRSession[]> => {
  return activeSessions.filter(session => session.user_id === userId);
};

// Get a specific session by ID
export const getVRSession = async (sessionId: string): Promise<VRSession | null> => {
  const session = activeSessions.find(s => s.id === sessionId);
  return session || null;
};

// Recommend a VR session based on emotion
export const recommendVRSessionForEmotion = async (emotion: string): Promise<VRSessionTemplate | null> => {
  // Simple recommendation logic - find a template that targets the opposite emotion
  const emotionMap: Record<string, string[]> = {
    'stress': ['calm', 'peaceful'],
    'anxiety': ['calm', 'relaxed'],
    'sad': ['happy', 'energetic'],
    'angry': ['calm', 'peaceful'],
    'tired': ['energized', 'focused'],
    'distracted': ['focused', 'mindful'],
  };

  const targetEmotions = emotionMap[emotion.toLowerCase()] || ['calm'];
  
  // Find a template that has one of the target emotions
  for (const template of vrTemplates) {
    if (template.emotions.some(e => targetEmotions.includes(e.toLowerCase()))) {
      return template;
    }
  }
  
  // If no specific match is found, return a calming template by default
  return vrTemplates.find(t => t.emotions.includes('calm')) || vrTemplates[0];
};
