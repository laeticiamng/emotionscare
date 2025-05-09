
/** Un défi ou rituel quotidien */
export interface Challenge {
  id: string;
  title?: string;
  name?: string;
  description: string;
  points: number;        // points gagnés à la réussite
  completed: boolean;
  difficulty: string;    // Added this property - now properly defined
  image_url?: string;
  target?: number;
  progress?: number;
  maxProgress?: number;
}

/** La progression d'un utilisateur sur un challenge */
export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  date: string;          // ISO date du jour
  completed: boolean;
}

// Import Badge from index.ts for compatibility
import { Badge } from './index';
export type { Badge };

/** L'attribution d'un badge à un utilisateur */
export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_on: string;    // date d'attribution
}
