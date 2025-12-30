/**
 * Leaderboard - Classement des meilleurs scores
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: number;
  avatarUrl?: string;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserRank?: number;
  isLoading?: boolean;
}

const RANK_STYLES = {
  1: { icon: Crown, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  2: { icon: Medal, color: 'text-slate-400', bg: 'bg-slate-500/10' },
  3: { icon: Medal, color: 'text-orange-600', bg: 'bg-orange-500/10' }
};

export const Leaderboard = memo(function Leaderboard({
  entries,
  currentUserRank,
  isLoading
}: LeaderboardProps) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-14 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Classement
        </CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucun score enregistré</p>
            <p className="text-sm mt-1">Soyez le premier !</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => {
              const rankStyle = RANK_STYLES[entry.rank as keyof typeof RANK_STYLES];
              const RankIcon = rankStyle?.icon || User;

              return (
                <motion.div
                  key={entry.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg',
                    entry.isCurrentUser 
                      ? 'bg-primary/10 border border-primary/30' 
                      : 'bg-muted/30 hover:bg-muted/50',
                    'transition-colors'
                  )}
                >
                  {/* Rang */}
                  <div className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                    rankStyle?.bg || 'bg-muted',
                    rankStyle?.color || 'text-muted-foreground'
                  )}>
                    {entry.rank <= 3 ? (
                      <RankIcon className="w-4 h-4" />
                    ) : (
                      entry.rank
                    )}
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {entry.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Nom */}
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      'font-medium truncate',
                      entry.isCurrentUser && 'text-primary'
                    )}>
                      {entry.username}
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-xs text-muted-foreground">(vous)</span>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className="font-bold text-foreground">
                      {entry.score.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">points</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Position de l'utilisateur si pas dans le top */}
        {currentUserRank && currentUserRank > entries.length && (
          <div className="mt-4 pt-4 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              Votre classement : <span className="font-bold text-foreground">#{currentUserRank}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

export default Leaderboard;
