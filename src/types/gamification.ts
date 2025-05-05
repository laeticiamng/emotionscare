
/** Un défi ou rituel quotidien */
export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;        // points gagnés à la réussite
}

/** La progression d'un utilisateur sur un challenge */
export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  date: string;          // ISO date du jour
  completed: boolean;
}

// Note: Badge is now defined in index.ts with combined properties for compatibility

/** L'attribution d'un badge à un utilisateur */
export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_on: string;    // date d'attribution
}
