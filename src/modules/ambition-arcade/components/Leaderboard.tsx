/**
 * Leaderboard Ambition Arcade
 * Classement anonymisé des utilisateurs par XP
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Trophy, Medal, Crown, Star, TrendingUp, 
  Users, Flame, ChevronUp, ChevronDown, Minus 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type Period = 'week' | 'month' | 'all';

interface LeaderboardEntry {
  rank: number;
  displayName: string;
  xp: number;
  level: number;
  streak: number;
  isCurrentUser: boolean;
  change: 'up' | 'down' | 'same';
}

const RANK_ICONS: Record<number, React.ReactNode> = {
  1: <Crown className="w-5 h-5 text-yellow-500" />,
  2: <Medal className="w-5 h-5 text-gray-400" />,
  3: <Medal className="w-5 h-5 text-amber-600" />,
};

const RANK_COLORS: Record<number, string> = {
  1: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
  2: 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30',
  3: 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30',
};

function generateAnonName(index: number): string {
  const adjectives = ['Swift', 'Brave', 'Calm', 'Zen', 'Bold', 'Wise', 'Kind', 'Cool'];
  const nouns = ['Phoenix', 'Tiger', 'Eagle', 'Wolf', 'Bear', 'Fox', 'Owl', 'Hawk'];
  return `${adjectives[index % adjectives.length]}${nouns[Math.floor(index / adjectives.length) % nouns.length]}`;
}

function calculateLevel(xp: number): number {
  const levels = [0, 100, 350, 850, 1850, 3350, 5850, 9350, 14350, 21350, 30350];
  for (let i = levels.length - 1; i >= 0; i--) {
    if (xp >= levels[i]) return i + 1;
  }
  return 1;
}

export const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState<Period>('week');

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['ambition-leaderboard', period],
    queryFn: async (): Promise<LeaderboardEntry[]> => {
      // Get all users with their XP
      const { data: runs, error } = await supabase
        .from('ambition_runs')
        .select('user_id');

      if (error) throw error;

      // Get unique user IDs
      const userIds = [...new Set(runs?.map(r => r.user_id).filter(Boolean) || [])];
      if (userIds.length === 0) return [];

      // Calculate XP for each user
      const userStats = await Promise.all(
        userIds.map(async (userId, index) => {
          const { data: userRuns } = await supabase
            .from('ambition_runs')
            .select('id')
            .eq('user_id', userId as string);

          const runIds = userRuns?.map(r => r.id) || [];
          if (runIds.length === 0) return null;

          const { data: quests } = await supabase
            .from('ambition_quests')
            .select('xp_reward, completed_at')
            .in('run_id', runIds)
            .eq('status', 'completed');

          // Filter by period
          const now = new Date();
          const filteredQuests = quests?.filter(q => {
            if (!q.completed_at) return false;
            const completedAt = new Date(q.completed_at);
            if (period === 'week') {
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              return completedAt >= weekAgo;
            }
            if (period === 'month') {
              const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              return completedAt >= monthAgo;
            }
            return true;
          }) || [];

          const xp = filteredQuests.reduce((sum, q) => sum + (q.xp_reward || 0), 0);

          return {
            userId,
            xp,
            level: calculateLevel(xp),
            displayName: generateAnonName(index),
            isCurrentUser: userId === user?.id,
          };
        })
      );

      // Filter, sort, and add ranks
      return userStats
        .filter((s): s is NonNullable<typeof s> => s !== null && s.xp > 0)
        .sort((a, b) => b.xp - a.xp)
        .slice(0, 20)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
          streak: Math.floor(Math.random() * 14) + 1, // Placeholder
          change: ['up', 'down', 'same'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'same',
        }));
    },
    staleTime: 1000 * 60 * 5, // 5 min cache
  });

  // Find current user's rank
  const currentUserEntry = leaderboard?.find(e => e.isCurrentUser);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-16" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          Classement
        </CardTitle>
        <CardDescription>
          Comparez vos progrès avec la communauté
        </CardDescription>

        {/* Period filter */}
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)} className="mt-2">
          <TabsList className="grid grid-cols-3 h-8">
            <TabsTrigger value="week" className="text-xs h-7">Semaine</TabsTrigger>
            <TabsTrigger value="month" className="text-xs h-7">Mois</TabsTrigger>
            <TabsTrigger value="all" className="text-xs h-7">Tout</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* Current user rank (if not in top) */}
        {currentUserEntry && currentUserEntry.rank > 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold">#{currentUserEntry.rank}</span>
                <Avatar className="h-8 w-8 bg-primary/20">
                  <AvatarFallback className="text-xs">Vous</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">Vous</p>
                  <p className="text-xs text-muted-foreground">Niveau {currentUserEntry.level}</p>
                </div>
              </div>
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3" />
                {currentUserEntry.xp.toLocaleString()} XP
              </Badge>
            </div>
          </motion.div>
        )}

        {/* Leaderboard list */}
        {!leaderboard || leaderboard.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Aucune donnée pour cette période</p>
          </div>
        ) : (
          <div className="space-y-2">
            {leaderboard.slice(0, 10).map((entry, index) => {
              const isTop3 = entry.rank <= 3;
              return (
                <motion.div
                  key={`${entry.displayName}-${entry.rank}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                    entry.isCurrentUser 
                      ? 'bg-primary/10 border-primary/30' 
                      : isTop3 
                        ? RANK_COLORS[entry.rank] 
                        : 'bg-muted/30 border-transparent hover:border-muted'
                  }`}
                >
                  {/* Rank */}
                  <div className="w-8 flex justify-center">
                    {RANK_ICONS[entry.rank] || (
                      <span className="text-sm font-medium text-muted-foreground">
                        #{entry.rank}
                      </span>
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`text-xs ${
                      entry.isCurrentUser ? 'bg-primary text-primary-foreground' : ''
                    }`}>
                      {entry.isCurrentUser ? 'Vous' : entry.displayName.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">
                        {entry.isCurrentUser ? 'Vous' : entry.displayName}
                      </p>
                      {entry.streak >= 7 && (
                        <Badge variant="outline" className="gap-1 text-xs px-1">
                          <Flame className="w-3 h-3 text-orange-500" />
                          {entry.streak}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Niveau {entry.level}
                    </p>
                  </div>

                  {/* Change indicator */}
                  <div className="w-6 flex justify-center">
                    {entry.change === 'up' && <ChevronUp className="w-4 h-4 text-success" />}
                    {entry.change === 'down' && <ChevronDown className="w-4 h-4 text-destructive" />}
                    {entry.change === 'same' && <Minus className="w-4 h-4 text-muted-foreground" />}
                  </div>

                  {/* XP */}
                  <Badge 
                    variant={isTop3 ? 'default' : 'secondary'} 
                    className="gap-1 min-w-[80px] justify-center"
                  >
                    <TrendingUp className="w-3 h-3" />
                    {entry.xp.toLocaleString()}
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
