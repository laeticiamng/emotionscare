/**
 * UserReputationSystem - Système de réputation utilisateur
 * Points, badges, niveaux et confiance communautaire
 */

import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, 
  Award, 
  TrendingUp, 
  Shield, 
  Heart,
  MessageCircle,
  ThumbsUp,
  Users,
  Crown,
  Zap,
} from 'lucide-react';

interface UserReputation {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  level: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
  trustScore: number; // 0-100
  badges: ReputationBadge[];
  stats: ReputationStats;
  rank?: 'newcomer' | 'member' | 'contributor' | 'expert' | 'guardian' | 'legend';
}

interface ReputationBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt: Date;
}

interface ReputationStats {
  postsCount: number;
  commentsCount: number;
  likesReceived: number;
  likesGiven: number;
  helpfulAnswers: number;
  daysActive: number;
  currentStreak: number;
}

interface UserReputationSystemProps {
  reputation: UserReputation;
  showDetails?: boolean;
  compact?: boolean;
  className?: string;
}

const RANK_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  newcomer: { 
    label: 'Nouveau', 
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    icon: <Star className="h-4 w-4" />,
  },
  member: { 
    label: 'Membre', 
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    icon: <Users className="h-4 w-4" />,
  },
  contributor: { 
    label: 'Contributeur', 
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    icon: <MessageCircle className="h-4 w-4" />,
  },
  expert: { 
    label: 'Expert', 
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    icon: <Award className="h-4 w-4" />,
  },
  guardian: { 
    label: 'Gardien', 
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    icon: <Shield className="h-4 w-4" />,
  },
  legend: { 
    label: 'Légende', 
    color: 'bg-gradient-to-r from-amber-200 to-yellow-300 text-amber-900',
    icon: <Crown className="h-4 w-4" />,
  },
};

const RARITY_STYLES: Record<string, string> = {
  common: 'border-slate-300 bg-slate-50 dark:bg-slate-900',
  rare: 'border-blue-400 bg-blue-50 dark:bg-blue-950',
  epic: 'border-purple-400 bg-purple-50 dark:bg-purple-950',
  legendary: 'border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950',
};

const BADGE_ICONS: Record<string, React.ReactNode> = {
  first_post: <MessageCircle className="h-5 w-5 text-blue-500" />,
  helper: <Heart className="h-5 w-5 text-rose-500" />,
  popular: <ThumbsUp className="h-5 w-5 text-green-500" />,
  streak: <Zap className="h-5 w-5 text-amber-500" />,
  guardian: <Shield className="h-5 w-5 text-purple-500" />,
  default: <Award className="h-5 w-5 text-primary" />,
};

export const UserReputationSystem = memo(function UserReputationSystem({
  reputation,
  showDetails = true,
  compact = false,
  className = '',
}: UserReputationSystemProps) {
  const progressPercent = useMemo(() => 
    Math.round((reputation.currentXP / reputation.nextLevelXP) * 100),
    [reputation.currentXP, reputation.nextLevelXP]
  );

  const rankConfig = RANK_CONFIG[reputation.rank || 'newcomer'];

  const trustColor = useMemo(() => {
    if (reputation.trustScore >= 80) return 'text-green-600';
    if (reputation.trustScore >= 60) return 'text-blue-600';
    if (reputation.trustScore >= 40) return 'text-amber-600';
    return 'text-red-600';
  }, [reputation.trustScore]);

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge className={rankConfig.color}>
          {rankConfig.icon}
          <span className="ml-1">Niv. {reputation.level}</span>
        </Badge>
        <span className="text-xs text-muted-foreground">
          {reputation.totalXP.toLocaleString()} XP
        </span>
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Réputation
          </div>
          <Badge className={rankConfig.color}>
            {rankConfig.icon}
            <span className="ml-1">{rankConfig.label}</span>
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Niveau et XP */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Niveau {reputation.level}</span>
            <span className="text-muted-foreground">
              {reputation.currentXP.toLocaleString()} / {reputation.nextLevelXP.toLocaleString()} XP
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">
            {reputation.nextLevelXP - reputation.currentXP} XP pour le niveau suivant
          </p>
        </div>

        {/* Score de confiance */}
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Score de confiance
            </span>
            <span className={`font-bold ${trustColor}`}>
              {reputation.trustScore}%
            </span>
          </div>
          <Progress 
            value={reputation.trustScore} 
            className="h-1.5"
          />
        </div>

        {showDetails && (
          <>
            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3 text-center">
                <MessageCircle className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                <p className="text-lg font-bold">{reputation.stats.postsCount}</p>
                <p className="text-xs text-muted-foreground">Publications</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <ThumbsUp className="h-5 w-5 mx-auto text-green-500 mb-1" />
                <p className="text-lg font-bold">{reputation.stats.likesReceived}</p>
                <p className="text-xs text-muted-foreground">Likes reçus</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <Heart className="h-5 w-5 mx-auto text-rose-500 mb-1" />
                <p className="text-lg font-bold">{reputation.stats.helpfulAnswers}</p>
                <p className="text-xs text-muted-foreground">Réponses utiles</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <Zap className="h-5 w-5 mx-auto text-amber-500 mb-1" />
                <p className="text-lg font-bold">{reputation.stats.currentStreak}j</p>
                <p className="text-xs text-muted-foreground">Série actuelle</p>
              </div>
            </div>

            {/* Badges */}
            {reputation.badges.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Badges obtenus</h4>
                <div className="flex flex-wrap gap-2">
                  {reputation.badges.slice(0, 6).map((badge) => (
                    <div
                      key={badge.id}
                      className={`rounded-lg border-2 p-2 ${RARITY_STYLES[badge.rarity]}`}
                      title={badge.description}
                    >
                      {BADGE_ICONS[badge.icon] || BADGE_ICONS.default}
                    </div>
                  ))}
                  {reputation.badges.length > 6 && (
                    <div className="rounded-lg border-2 border-dashed p-2 flex items-center justify-center text-xs text-muted-foreground">
                      +{reputation.badges.length - 6}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
});

// Données mock pour démo
export const MOCK_REPUTATION: UserReputation = {
  userId: 'user-123',
  displayName: 'Marie L.',
  level: 12,
  currentXP: 2450,
  nextLevelXP: 3000,
  totalXP: 14500,
  trustScore: 87,
  rank: 'contributor',
  badges: [
    { id: 'b1', name: 'Premier post', description: 'A publié son premier message', icon: 'first_post', rarity: 'common', earnedAt: new Date() },
    { id: 'b2', name: 'Aidant', description: 'A aidé 10 personnes', icon: 'helper', rarity: 'rare', earnedAt: new Date() },
    { id: 'b3', name: 'Populaire', description: '100 likes reçus', icon: 'popular', rarity: 'epic', earnedAt: new Date() },
    { id: 'b4', name: 'Série de 30j', description: 'Actif 30 jours consécutifs', icon: 'streak', rarity: 'legendary', earnedAt: new Date() },
  ],
  stats: {
    postsCount: 47,
    commentsCount: 156,
    likesReceived: 234,
    likesGiven: 189,
    helpfulAnswers: 28,
    daysActive: 89,
    currentStreak: 12,
  },
};

export default UserReputationSystem;
