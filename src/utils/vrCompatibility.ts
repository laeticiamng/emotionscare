
import { VRSessionTemplate, VRSession } from '@/types/vr';

/**
 * Gets the title of a VRSessionTemplate using either naming convention
 */
export function getVRTemplateTitle(template?: VRSessionTemplate | null): string {
  if (!template) return '';
  return template.title || template.name || '';
}

/**
 * Gets the thumbnail URL of a VRSessionTemplate using either naming convention
 */
export function getVRTemplateThumbnail(template?: VRSessionTemplate | null): string | undefined {
  if (!template) return undefined;
  return template.thumbnailUrl || template.imageUrl || template.coverUrl || template.cover_url || template.preview_url;
}

/**
 * Gets the audioUrl of a VRSessionTemplate using either naming convention
 */
export function getVRTemplateAudioUrl(template?: VRSessionTemplate | null): string | undefined {
  if (!template) return undefined;
  return template.audioUrl || template.audio_url || template.audioTrack;
}

/**
 * Gets session start time from different possible properties
 */
export function getVRSessionStartTime(session?: VRSession | null): Date | string | undefined {
  if (!session) return undefined;
  return session.startedAt || session.startTime || session.createdAt;
}

/**
 * Gets session end time from different possible properties
 */
export function getVRSessionEndTime(session?: VRSession | null): Date | string | undefined {
  if (!session) return undefined;
  return session.endedAt || session.endTime;
}

/**
 * Gets heart rate before session
 */
export function getVRSessionHeartRateBefore(session?: VRSession | null): number | undefined {
  if (!session) return undefined;
  return session.heartRateBefore || (session.metrics?.heartRateBefore as number);
}

/**
 * Gets heart rate after session
 */
export function getVRSessionHeartRateAfter(session?: VRSession | null): number | undefined {
  if (!session) return undefined;
  return session.heartRateAfter || (session.metrics?.heartRateAfter as number);
}

/**
 * Gets metrics from session
 */
export function getVRSessionMetrics(session?: VRSession | null): Record<string, any> | undefined {
  if (!session) return undefined;
  return session.metrics || {};
}

/**
 * Gets cover URL from a VRSessionTemplate using any naming convention
 */
export function getVRTemplateCoverUrl(template?: VRSessionTemplate | null): string | undefined {
  if (!template) return undefined;
  return template.coverUrl || template.cover_url || template.imageUrl || template.thumbnailUrl || template.preview_url;
}
