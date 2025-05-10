
import { v4 as uuidv4 } from 'uuid';
import { VRSession, VRSessionTemplate } from '@/types';

// Templates de session VR simulés
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

// Sessions VR simulées
let vrSessions: VRSession[] = [];

/**
 * Récupérer tous les templates de session VR
 */
export const getVRTemplates = async (): Promise<VRSessionTemplate[]> => {
  return vrSessionTemplates;
};

/**
 * Récupérer un template VR par ID
 */
export const getVRTemplateById = async (templateId: string): Promise<VRSessionTemplate | undefined> => {
  return vrSessionTemplates.find(template => template.id === templateId);
};

/**
 * Créer une nouvelle session VR
 */
export const createVRSession = async (sessionData: Partial<VRSession>): Promise<VRSession> => {
  const newSession: VRSession = {
    id: uuidv4(),
    user_id: sessionData.user_id || '',
    template_id: sessionData.template_id || '',
    date: sessionData.date ? sessionData.date : new Date().toISOString(),
    start_time: sessionData.start_time ? sessionData.start_time : new Date().toISOString(),
    duration: typeof sessionData.duration === 'string' ? parseInt(sessionData.duration, 10) : (sessionData.duration || 300),
    completed: sessionData.completed || false,
    completed_at: sessionData.completed_at,
    mood_before: sessionData.mood_before || sessionData.emotion_before || 'neutral',
    mood_after: sessionData.mood_after || sessionData.emotion_after,
    emotion_before: sessionData.emotion_before || sessionData.mood_before || 'neutral',
    emotion_after: sessionData.emotion_after || sessionData.mood_after,
    is_audio_only: sessionData.is_audio_only || false
  };
  
  vrSessions.push(newSession);
  return newSession;
};

/**
 * Récupérer les sessions VR d'un utilisateur
 */
export const getUserVRSessions = async (userId: string): Promise<VRSession[]> => {
  return vrSessions.filter(session => session.user_id === userId);
};

/**
 * Sauvegarder une session de relaxation
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
    emotion_before: data.moodBefore,
    emotion_after: data.moodAfter,
    mood_before: data.moodBefore,
    mood_after: data.moodAfter,
    is_audio_only: data.isAudioOnly || false,
    start_time: new Date().toISOString()
  });
};
