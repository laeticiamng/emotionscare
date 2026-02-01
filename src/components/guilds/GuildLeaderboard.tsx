/**
 * GuildLeaderboard - Classement des guildes
 * Affiche le top guildes avec leurs stats
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Users, Medal, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Guild } from './GuildCard';

interface GuildLeaderboardProps {
  guilds: Guild[];
  userGuildId?: string;
  period?: 'weekly' | 'monthly' | 'alltime';
  isLoading?: boolean;
}

const RankBadge = ({ rank }: { rank: number }) => {
  if (rank === 1) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
        <Crown className="w-5 h-5 text-white" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-md">
        <Medal className="w-5 h-5 text-white" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-md">
        <Medal className="w-5 h-5 text-white" />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
      <span className="font-bold text-muted-foreground">{rank}</span>
    </div>
  );
};

const GuildRow = memo(({ 
  guild, 
  rank, 
  isUserGuild,
  maxXp 
}: { 
  guild: Guild;
  rank: number;
  isUserGuild: boolean;
  maxXp: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: rank * 0.05 }}
    className={cn(
      "flex items-center gap-4 p-3 rounded-lg transition-colors",
      isUserGuild && "bg-primary/10 border border-primary/30",
      !isUserGuild && "hover:bg-muted/50"
    )}
  >
    <RankBadge rank={rank} />
    
    <div className="text-3xl">{guild.emblem}</div>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold truncate">{guild.name}</h4>
        {isUserGuild && (
          <Badge variant="secondary" className="text-xs">Votre guilde</Badge>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {guild.member_count}
        </span>
        <span>Niv. {guild.level}</span>
      </div>
    </div>

    <div className="text-right min-w-[120px]">
      <div className="flex items-center gap-1 justify-end text-sm font-semibold">
        <TrendingUp className="w-4 h-4 text-green-500" />
        <span>{guild.weekly_xp.toLocaleString()} XP</span>
      </div>
      <Progress 
        value={(guild.weekly_xp / maxXp) * 100} 
        className="h-1.5 mt-1"
      />
    </div>
  </motion.div>
));

GuildRow.displayName = 'GuildRow';

export const GuildLeaderboard = memo(({
  guilds,
  userGuildId,
  period = 'weekly',
  isLoading = false
}: GuildLeaderboardProps) => {
  const sortedGuilds = [...guilds].sort((a, b) => b.weekly_xp - a.weekly_xp);
  const maxXp = sortedGuilds[0]?.weekly_xp || 1;

  const periodLabels = {
    weekly: 'Cette semaine',
    monthly: 'Ce mois',
    alltime: 'Tous temps'
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-pulse text-muted-foreground">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Classement des Guildes
          </CardTitle>
          <Badge variant="outline">{periodLabels[period]}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-2">
            {sortedGuilds.map((guild, index) => (
              <GuildRow
                key={guild.id}
                guild={guild}
                rank={index + 1}
                isUserGuild={guild.id === userGuildId}
                maxXp={maxXp}
              />
            ))}
            
            {sortedGuilds.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Aucune guilde pour le moment</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

GuildLeaderboard.displayName = 'GuildLeaderboard';

export default GuildLeaderboard;
