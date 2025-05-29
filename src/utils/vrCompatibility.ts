
import { VRSession, VRSessionTemplate } from '@/types/vr';

export const getVRSessionStartTime = (session: VRSession): string | Date => {
  return session.startTime;
};

export const getVRSessionEndTime = (session: VRSession): string | Date | undefined => {
  return session.endTime;
};

export const getVRTemplateAudioUrl = (template: VRSessionTemplate): string | undefined => {
  // For now, return undefined as we don't have audio URLs in the template
  // This can be extended when audio URLs are added to the template structure
  return undefined;
};
