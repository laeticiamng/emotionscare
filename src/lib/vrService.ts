
import { v4 as uuidv4 } from 'uuid';
import { VRSession, VRSessionTemplate } from '@/types';

// Mock VR session templates
const vrSessionTemplates: VRSessionTemplate[] = [
  {
    id: 'template-1',
    template_id: 'template-1',
    theme: 'Plage paisible',
    title: 'Une plage paisible avec le son des vagues',
    description: 'Une plage paisible avec le son des vagues',
    category: 'relaxation',
    duration: 5,
    is_audio_only: false,
    preview_url: '/images/vr/beach-preview.jpg',
    benefits: ['Réduction du stress', 'Amélioration du sommeil'],
    emotions: ['calm', 'peaceful'],
    popularity: 85,
    tags: [],
    difficulty: 'easy',
    name: 'Plage paisible'
  },
  {
    id: 'template-2',
    template_id: 'template-2',
    theme: 'Forêt tranquille',
    title: 'Une promenade dans une forêt tranquille',
    description: 'Une promenade dans une forêt tranquille',
    category: 'focus',
    duration: 10,
    is_audio_only: false,
    preview_url: '/images/vr/forest-preview.jpg',
    benefits: ['Concentration améliorée', 'Clarté mentale'],
    emotions: ['focused', 'inspired'],
    popularity: 78,
    tags: [],
    difficulty: 'easy',
    name: 'Forêt tranquille'
  }
];

// Mock VR sessions
let vrSessions: VRSession[] = [];

/**
 * Get all VR session templates
 */
export const getVRTemplates = async (): Promise<VRSessionTemplate[]> => {
  return vrSessionTemplates;
};

/**
 * Get a VR template by ID
 */
export const getVRTemplateById = async (templateId: string): Promise<VRSessionTemplate | undefined> => {
  return vrSessionTemplates.find(template => template.id === templateId);
};

/**
 * Create a new VR session
 */
export const createVRSession = async (sessionData: Partial<VRSession>): Promise<VRSession> => {
  const newSession: VRSession = {
    id: uuidv4(),
    user_id: sessionData.user_id || '',
    template_id: sessionData.template_id || '',
    date: sessionData.date || new Date().toISOString(),
    duration: sessionData.duration || 300,
    completed: sessionData.completed || true,
    mood_before: sessionData.mood_before || 'neutral',
    mood_after: sessionData.mood_after,
    is_audio_only: sessionData.is_audio_only || false,
    start_time: sessionData.start_time || new Date().toISOString(),
  };
  
  vrSessions.push(newSession);
  return newSession;
};

/**
 * Get VR sessions for a user
 */
export const getUserVRSessions = async (userId: string): Promise<VRSession[]> => {
  return vrSessions.filter(session => session.user_id === userId);
};

/**
 * Save a relaxation session
 */
export const saveRelaxationSession = async (data: {
  userId: string;
  templateId: string;
  duration?: number;
  moodBefore?: string;
  moodAfter?: string;
  isAudioOnly?: boolean;
}): Promise<void> => {
  await createVRSession({
    user_id: data.userId,
    template_id: data.templateId,
    duration: data.duration || 300,
    mood_before: data.moodBefore || 'neutral',
    mood_after: data.moodAfter || 'relaxed',
    is_audio_only: data.isAudioOnly || false,
    start_time: new Date().toISOString()
  });
};
