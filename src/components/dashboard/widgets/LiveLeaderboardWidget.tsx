/**
 * Widget Leaderboard live connecté à Supabase
 * Affiche le classement en temps réel avec données persistées
 */

import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Crown, TrendingUp, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGlobalLeaderboard, type LeaderboardEntry } from '@/hooks/useGlobalLeaderboard';
import { cn } from '@/lib/utils';

interface LiveLeaderboardWidgetProps {
  className?: string;
  maxEntries?: number;
  showSeeAll?: boolean;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Trophy className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="text-sm font-bold text-muted-foreground">{rank}</span>;
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border-yellow-500/20';
    case 2:
      return 'bg-gradient-to-r from-gray-300/10 to-gray-400/10 border-gray-400/20';
    case 3:
      return 'bg-gradient-to-r from-amber-600/10 to-orange-500/10 border-amber-600/20';
    default:
      return 'bg-muted/30 border-border';
  }
};

export const LiveLeaderboardWidget: React.FC<LiveLeaderboardWidgetProps> = ({
  className,
  maxEntries = 5,
  showSeeAll = true
}) => {
  const navigate = useNavigate();
  const { leaderboard, isLoading, fetchLeaderboard } = useGlobalLeaderboard();

  useEffect(() => {
    fetchLeaderboard(maxEntries);
  }, [fetchLeaderboard, maxEntries]);

  if (isLoading) {
    return (
      <Card className={cn("h-full", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Classement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: maxEntries }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-5 w-12" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const { topPlayers, userRank, userPosition, totalPlayers } = leaderboard;

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="w-5 h-5 text-primary" />
            Classement
          </CardTitle>
          <Badge variant="secondary" className="gap-1">
            <Users className="w-3 h-3" />
            {totalPlayers}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2">
        <AnimatePresence mode="popLayout">
          {topPlayers.slice(0, maxEntries).map((entry, index) => {
            const isCurrentUser = userRank?.user_id === entry.user_id;
            const rank = index + 1;
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border transition-all",
                  getRankBg(rank),
                  isCurrentUser && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  {getRankIcon(rank)}
                </div>
                
                <Avatar className="w-9 h-9 border-2 border-background">
                  <AvatarFallback className="text-lg">
                    {entry.avatar_emoji || '✨'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium truncate",
                      isCurrentUser && "text-primary"
                    )}>
                      {entry.display_name}
                    </span>
                    {isCurrentUser && (
                      <Badge variant="outline" className="text-xs shrink-0">
                        Vous
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Niv. {entry.level}</span>
                    {entry.streak_days > 0 && (
                      <span className="text-orange-500">🔥 {entry.streak_days}j</span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="font-bold text-foreground">
                    {entry.total_score.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">pts</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Show user position if not in top */}
        {userRank && userPosition > maxEntries && (
          <>
            <div className="flex items-center gap-2 py-1">
              <div className="flex-1 border-t border-dashed border-border" />
              <span className="text-xs text-muted-foreground">...</span>
              <div className="flex-1 border-t border-dashed border-border" />
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg border",
                "bg-primary/5 border-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background"
              )}
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{userPosition}</span>
              </div>
              
              <Avatar className="w-9 h-9 border-2 border-primary/30">
                <AvatarFallback className="text-lg">
                  {userRank.avatar_emoji || '✨'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate text-primary">
                    {userRank.display_name}
                  </span>
                  <Badge variant="outline" className="text-xs shrink-0">
                    Vous
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Niv. {userRank.level}</span>
                  {userRank.streak_days > 0 && (
                    <span className="text-orange-500">🔥 {userRank.streak_days}j</span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <span className="font-bold text-primary">
                  {userRank.total_score.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground ml-1">pts</span>
              </div>
            </motion.div>
          </>
        )}

        {topPlayers.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Trophy className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p>Pas encore de classement</p>
            <p className="text-xs mt-1">Commencez une activité pour apparaître ici !</p>
          </div>
        )}
      </CardContent>
      
      {showSeeAll && topPlayers.length > 0 && (
        <CardFooter className="pt-0">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-primary gap-2"
            onClick={() => navigate('/leaderboard')}
          >
            <TrendingUp className="w-4 h-4" />
            Voir le classement complet
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default LiveLeaderboardWidget;
