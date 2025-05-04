
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

/** Un badge débloqué */
export interface Badge {
  id: string;
  name: string;
  description: string;
  image_url?: string;    // for compatibility with the existing Badge type
  icon_url: string;
  threshold: number;     // nombre de points ou défis pour débloquer
}

/** L'attribution d'un badge à un utilisateur */
export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  awarded_on: string;    // date d'attribution
}
