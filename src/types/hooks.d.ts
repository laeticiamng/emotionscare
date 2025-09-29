
import { Badge, Challenge, GamificationStats } from './gamification';

export interface UseGamificationReturn {
  badges: Badge[];
  challenges: Challenge[];
  stats: GamificationStats;
  completeChallenge: (challengeId: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  refresh?: () => void;
}
