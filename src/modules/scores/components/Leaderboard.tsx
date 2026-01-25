/**
 * Leaderboard - Classement communautaire
 */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, User, Flame, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { LeaderboardEntry, LeaderboardPeriod } from '../types';

const PERIOD_LABELS: Record<LeaderboardPeriod, string> = {
  daily: 'Aujourd\'hui',
  weekly: 'Cette semaine',
  monthly: 'Ce mois',
  all_time: 'Tous temps'
};

export default function Leaderboard() {
  const { user } = useAuth();
  const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ['leaderboard', period],
    queryFn: async () => {
      // Simuler un leaderboard à partir des données existantes
      const { data, error } = await supabase
        .from('user_scores')
        .select(`
          user_id,
          emotional_score,
          wellbeing_score,
          engagement_score
        `)
        .order('emotional_score', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Agréger par utilisateur et calculer le score total
      const userScores: Record<string, { total: number; count: number }> = {};
      (data || []).forEach((s: any) => {
        if (!userScores[s.user_id]) {
          userScores[s.user_id] = { total: 0, count: 0 };
        }
        userScores[s.user_id].total += (s.emotional_score + s.wellbeing_score + s.engagement_score) / 3;
        userScores[s.user_id].count += 1;
      });

      // Convertir en leaderboard
      const entries: LeaderboardEntry[] = Object.entries(userScores)
        .map(([userId, data], index) => ({
          user_id: userId,
          username: `Utilisateur ${index + 1}`,
          avatar_url: undefined,
          total_score: Math.round(data.total / data.count),
          rank: 0,
          badge_count: Math.floor(Math.random() * 10),
          achievement_count: Math.floor(Math.random() * 20),
          streak_days: Math.floor(Math.random() * 30)
        }))
        .sort((a, b) => b.total_score - a.total_score)
        .map((entry, idx) => ({ ...entry, rank: idx + 1 }))
        .slice(0, 10);

      return entries;
    },
    staleTime: 60000
  });

  const currentUserRank = leaderboard.findIndex(e => e.user_id === user?.id) + 1;
  const _currentUserEntry = leaderboard.find(e => e.user_id === user?.id);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-amber-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
    return <span className="text-muted-foreground font-mono">#{rank}</span>;
  };

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/50";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-slate-400/20 border-gray-400/50";
    if (rank === 3) return "bg-gradient-to-r from-amber-700/20 to-orange-600/20 border-amber-700/50";
    return "bg-muted/30 border-transparent";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Classement
        </CardTitle>
        <CardDescription>Comparez-vous à la communauté</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as LeaderboardPeriod)}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            {(['daily', 'weekly', 'monthly', 'all_time'] as LeaderboardPeriod[]).map(p => (
              <TabsTrigger key={p} value={p} className="text-xs">
                {PERIOD_LABELS[p]}
              </TabsTrigger>
            ))}
          </TabsList>

          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, idx) => {
                const isCurrentUser = entry.user_id === user?.id;
                
                return (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                      getRankStyle(entry.rank),
                      isCurrentUser && "ring-2 ring-primary"
                    )}
                  >
                    {/* Rank */}
                    <div className="w-8 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    {/* Avatar */}
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={entry.avatar_url} />
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium truncate",
                        isCurrentUser && "text-primary"
                      )}>
                        {isCurrentUser ? 'Vous' : entry.username}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3 text-orange-500" />
                          {entry.streak_days}j
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-amber-500" />
                          {entry.badge_count}
                        </span>
                      </div>
                    </div>
                    
                    {/* Score */}
                    <div className="text-right">
                      <p className="text-xl font-bold">{entry.total_score}</p>
                      <p className="text-xs text-muted-foreground">pts</p>
                    </div>
                  </motion.div>
                );
              })}

              {/* Current user position if not in top 10 */}
              {user && currentUserRank === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 pt-4 border-t"
                >
                  <p className="text-sm text-muted-foreground text-center mb-2">
                    Votre position
                  </p>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border-2 border-primary/30">
                    <div className="w-8 flex justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-primary">Vous</p>
                      <p className="text-xs text-muted-foreground">
                        Continuez pour entrer dans le top 10 !
                      </p>
                    </div>
                    <Badge variant="outline">
                      Bientôt classé
                    </Badge>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
