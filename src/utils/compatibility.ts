
/**
 * Compatibility utilities to support both old and new property names
 * across component interfaces.
 */

import { MusicTrack, MusicPlaylist } from '@/types/music';
import { VRSessionTemplate } from '@/types/vr';

/**
 * Gets coverUrl from a MusicTrack using either naming convention
 */
export function getTrackCoverUrl(track?: MusicTrack | null): string | undefined {
  if (!track) return undefined;
  return track.coverUrl || track.cover_url || track.cover;
}

/**
 * Gets audioUrl from a MusicTrack using either naming convention
 */
export function getTrackAudioUrl(track?: MusicTrack | null): string | undefined {
  if (!track) return undefined;
  return track.audioUrl || track.url || track.track_url;
}

/**
 * Gets coverUrl from a MusicPlaylist using either naming convention
 */
export function getPlaylistCoverUrl(playlist?: MusicPlaylist | null): string | undefined {
  if (!playlist) return undefined;
  return playlist.coverUrl;
}

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
  return template.thumbnailUrl || template.imageUrl || template.coverUrl || template.preview_url;
}

/**
 * Gets the audioUrl of a VRSessionTemplate using either naming convention
 */
export function getVRTemplateAudioUrl(template?: VRSessionTemplate | null): string | undefined {
  if (!template) return undefined;
  return template.audioUrl || template.audio_url;
}

/**
 * Gets the completion rate of a VRSessionTemplate using either naming convention
 */
export function getVRTemplateCompletionRate(template?: VRSessionTemplate | null): number {
  if (!template) return 0;
  return template.completionRate || template.completion_rate || 0;
}

/**
 * Gets the emotion target of a VRSessionTemplate using either naming convention
 */
export function getVRTemplateEmotionTarget(template?: VRSessionTemplate | null): string | undefined {
  if (!template) return undefined;
  return template.emotionTarget || template.emotion_target || template.emotion;
}

/**
 * Gets the recommended mood of a VRSessionTemplate using either naming convention
 */
export function getVRTemplateRecommendedMood(template?: VRSessionTemplate | null): string {
  if (!template) return '';
  return template.recommendedMood || template.recommended_mood || '';
}
