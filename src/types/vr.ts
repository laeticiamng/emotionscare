
// Re-export all VR types from the central types file
export type {
  VRSession,
  VRSessionTemplate,
  VRHistoryListProps,
  VRSessionWithMusicProps,
  VRTemplateGridProps
} from './types';

// Define additional interface for VRSessionTemplate with emotionTarget
export interface VRSessionWithTarget extends VRSessionTemplate {
  emotionTarget?: string;
  emotion_target?: string;
}
