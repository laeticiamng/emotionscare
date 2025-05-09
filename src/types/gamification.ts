
/** Challenge or daily ritual */
export interface Challenge {
  id: string;
  title?: string;
  name?: string;
  description: string;
  points: number;
  completed: boolean;
  difficulty: string;
  image_url?: string;
  target?: number;
  progress?: number;
  maxProgress?: number;
}

/** User's progress on a challenge */
export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  date: string;
  completed: boolean;
}

// Import Badge from index.ts for compatibility
import { Badge } from './index';
export type { Badge };

/** The attribution of a badge to a user */
export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_on: string;
}
