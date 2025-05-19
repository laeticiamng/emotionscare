
import { VRSessionTemplate, VRSession } from '@/types/vr';

/**
 * Obtenir l'URL de la miniature d'un template VR
 */
export const getVRTemplateThumbnail = (template?: VRSessionTemplate | null): string | undefined => {
  if (!template) return undefined;
  return template.thumbnailUrl || template.imageUrl || template.coverUrl || 
         template.cover_url || template.preview_url;
};

/**
 * Obtenir le titre d'un template VR
 */
export const getVRTemplateTitle = (template?: VRSessionTemplate | null): string => {
  if (!template) return '';
  return template.title || template.name || '';
};

/**
 * Obtenir l'URL audio d'un template VR
 */
export const getVRTemplateAudioUrl = (template?: VRSessionTemplate | null): string | undefined => {
  if (!template) return undefined;
  return template.audioUrl || template.audio_url || template.audioTrack;
};

/**
 * Déterminer si une session VR est terminée
 */
export const isVRSessionCompleted = (session?: VRSession | null): boolean => {
  if (!session) return false;
  return session.completed === true;
};

/**
 * Obtenir les dates de début et de fin d'une session VR
 */
export const getVRSessionDates = (session?: VRSession | null): { 
  start: Date | null; 
  end: Date | null;
} => {
  if (!session) return { start: null, end: null };
  
  const startDate = session.startedAt || session.startTime || session.createdAt;
  const endDate = session.endedAt || session.endTime;
  
  return {
    start: startDate ? new Date(startDate) : null,
    end: endDate ? new Date(endDate) : null
  };
};
