// @ts-nocheck
/**
 * UserReputationSystem - Système de réputation utilisateur
 * Points, badges, niveaux et confiance communautaire
 */

import { memo, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
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
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
  reputation?: UserReputation;
  userId?: string;
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

function getRankFromXP(totalXP: number): UserReputation['rank'] {
  if (totalXP >= 50000) return 'legend';
  if (totalXP >= 20000) return 'guardian';
  if (totalXP >= 10000) return 'expert';
  if (totalXP >= 3000) return 'contributor';
  if (totalXP >= 500) return 'member';
  return 'newcomer';
}

function getLevelFromXP(totalXP: number): { level: number; currentXP: number; nextLevelXP: number } {
  const level = Math.floor(totalXP / 500) + 1;
  const currentXP = totalXP % 500;
  const nextLevelXP = 500;
  return { level, currentXP, nextLevelXP };
}

export const UserReputationSystem = memo(function UserReputationSystem({
  reputation: propReputation,
  userId: propUserId,
  showDetails = true,
  compact = false,
  className = '',
}: UserReputationSystemProps) {
  const { user } = useAuth();
  const targetUserId = propUserId ?? user?.id;

  // Fetch reputation data from Supabase when no prop is provided
  const {
    data: fetchedReputation,
    isLoading,
    error,
  } = useQuery<UserReputation | null>({
    queryKey: ['user_reputation', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return null;

      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', targetUserId)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      const totalXP = data.total_points ?? data.points ?? 0;
      const { level, currentXP, nextLevelXP } = getLevelFromXP(totalXP);

      // Fetch badges
      const { data: badgesData } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', targetUserId)
        .order('earned_at', { ascending: false });

      const badges: ReputationBadge[] = (badgesData ?? []).map((b: any) => ({
        id: b.id,
        name: b.name ?? b.badge_name ?? '',
        description: b.description ?? '',
        icon: b.icon ?? 'default',
        rarity: b.rarity ?? 'common',
        earnedAt: new Date(b.earned_at ?? b.created_at),
      }));

      return {
        userId: targetUserId,
        displayName: data.display_name ?? user?.user_metadata?.full_name ?? '',
        avatarUrl: data.avatar_url,
        level,
        currentXP,
        nextLevelXP,
        totalXP,
        trustScore: data.trust_score ?? 50,
        rank: getRankFromXP(totalXP),
        badges,
        stats: {
          postsCount: data.posts_count ?? 0,
          commentsCount: data.comments_count ?? 0,
          likesReceived: data.likes_received ?? 0,
          likesGiven: data.likes_given ?? 0,
          helpfulAnswers: data.helpful_answers ?? 0,
          daysActive: data.days_active ?? 0,
          currentStreak: data.current_streak ?? 0,
        },
      };
    },
    enabled: !propReputation && !!targetUserId,
  });

  const reputation = propReputation ?? fetchedReputation;

  // Loading state
  if (!propReputation && isLoading) {
    if (compact) {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      );
    }
    return (
      <Card className={className} aria-label="Chargement de la réputation">
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (!propReputation && error) {
    return (
      <Card className={className} role="alert" aria-label="Erreur de chargement de la réputation">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-2" aria-hidden="true" />
          <p className="text-sm text-red-500">Erreur lors du chargement de la réputation</p>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!reputation) {
    if (compact) {
      return (
        <div className={`flex items-center gap-2 ${className}`}>
          <Badge className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Star className="h-4 w-4" />
            <span className="ml-1">Niv. 1</span>
          </Badge>
          <span className="text-xs text-muted-foreground">0 XP</span>
        </div>
      );
    }
    return (
      <Card className={className} aria-label="Aucune donnée de réputation">
        <CardContent className="p-6 text-center">
          <Star className="h-8 w-8 mx-auto text-muted-foreground mb-2" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Aucune donnée de réputation disponible</p>
        </CardContent>
      </Card>
    );
  }

  const progressPercent = Math.round((reputation.currentXP / reputation.nextLevelXP) * 100);
  const rankConfig = RANK_CONFIG[reputation.rank || 'newcomer'];
  const trustColor = reputation.trustScore >= 80 ? 'text-green-600' :
    reputation.trustScore >= 60 ? 'text-blue-600' :
    reputation.trustScore >= 40 ? 'text-amber-600' : 'text-red-600';

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`} aria-label={`Réputation : Niveau ${reputation.level}`}>
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
    <Card className={className} aria-label="Système de réputation utilisateur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" aria-hidden="true" />
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
          <Progress value={progressPercent} className="h-2" aria-label={`Progression : ${progressPercent}%`} />
          <p className="text-xs text-muted-foreground text-right">
            {reputation.nextLevelXP - reputation.currentXP} XP pour le niveau suivant
          </p>
        </div>

        {/* Score de confiance */}
        <div className="rounded-lg bg-muted/50 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium flex items-center gap-1">
              <Shield className="h-4 w-4" aria-hidden="true" />
              Score de confiance
            </span>
            <span className={`font-bold ${trustColor}`}>
              {reputation.trustScore}%
            </span>
          </div>
          <Progress
            value={reputation.trustScore}
            className="h-1.5"
            aria-label={`Score de confiance : ${reputation.trustScore}%`}
          />
        </div>

        {showDetails && (
          <>
            {/* Statistiques */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-3 text-center">
                <MessageCircle className="h-5 w-5 mx-auto text-blue-500 mb-1" aria-hidden="true" />
                <p className="text-lg font-bold">{reputation.stats.postsCount}</p>
                <p className="text-xs text-muted-foreground">Publications</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <ThumbsUp className="h-5 w-5 mx-auto text-green-500 mb-1" aria-hidden="true" />
                <p className="text-lg font-bold">{reputation.stats.likesReceived}</p>
                <p className="text-xs text-muted-foreground">Likes reçus</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <Heart className="h-5 w-5 mx-auto text-rose-500 mb-1" aria-hidden="true" />
                <p className="text-lg font-bold">{reputation.stats.helpfulAnswers}</p>
                <p className="text-xs text-muted-foreground">Réponses utiles</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <Zap className="h-5 w-5 mx-auto text-amber-500 mb-1" aria-hidden="true" />
                <p className="text-lg font-bold">{reputation.stats.currentStreak}j</p>
                <p className="text-xs text-muted-foreground">Série actuelle</p>
              </div>
            </div>

            {/* Badges */}
            {reputation.badges.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Badges obtenus</h4>
                <div className="flex flex-wrap gap-2" aria-label="Badges obtenus">
                  {reputation.badges.slice(0, 6).map((badge) => (
                    <div
                      key={badge.id}
                      className={`rounded-lg border-2 p-2 ${RARITY_STYLES[badge.rarity]}`}
                      title={badge.description}
                      aria-label={`Badge : ${badge.name}`}
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

export default UserReputationSystem;
