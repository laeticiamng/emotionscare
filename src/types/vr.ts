
// Types for VR-related components
export * from './index';

export interface VRSessionStats {
  total: number;
  completed: number;
  averageRating: number;
  totalDuration: number;
  byCategory: Record<string, number>;
  byEmotion?: Record<string, number>;
}
