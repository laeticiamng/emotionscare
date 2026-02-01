/**
 * GuildCard - Carte d'affichage d'une guilde
 * Affiche les informations principales et permet de rejoindre
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Shield, Star, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface Guild {
  id: string;
  name: string;
  description: string;
  emblem: string;
  level: number;
  xp: number;
  xp_to_next_level: number;
  member_count: number;
  max_members: number;
  weekly_xp: number;
  rank?: number;
  is_recruiting: boolean;
  created_at: string;
}

interface GuildCardProps {
  guild: Guild;
  isMember?: boolean;
  isPending?: boolean;
  onJoin?: (guildId: string) => void;
  onView?: (guildId: string) => void;
  isLoading?: boolean;
}

export const GuildCard = memo(({
  guild,
  isMember = false,
  isPending = false,
  onJoin,
  onView,
  isLoading = false
}: GuildCardProps) => {
  const xpProgress = guild.xp_to_next_level > 0 
    ? (guild.xp / guild.xp_to_next_level) * 100 
    : 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Header avec emblème */}
        <div className="relative h-24 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <span className="text-5xl">{guild.emblem}</span>
          
          {guild.rank && guild.rank <= 3 && (
            <Badge 
              className={cn(
                "absolute top-2 right-2",
                guild.rank === 1 && "bg-yellow-500",
                guild.rank === 2 && "bg-gray-400",
                guild.rank === 3 && "bg-amber-600"
              )}
            >
              <Trophy className="w-3 h-3 mr-1" />
              #{guild.rank}
            </Badge>
          )}

          {isMember && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              <Shield className="w-3 h-3 mr-1" />
              Membre
            </Badge>
          )}
        </div>

        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg truncate">{guild.name}</h3>
            <Badge variant="outline" className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              Niv. {guild.level}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {guild.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">Membres</span>
              </div>
              <p className="font-bold">{guild.member_count}/{guild.max_members}</p>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-muted-foreground">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">XP/sem</span>
              </div>
              <p className="font-bold">{guild.weekly_xp.toLocaleString()}</p>
            </div>
          </div>

          {/* Progression niveau */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progression</span>
              <span>{guild.xp}/{guild.xp_to_next_level} XP</span>
            </div>
            <Progress value={xpProgress} className="h-2" />
          </div>
        </CardContent>

        <CardFooter className="pt-0 gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onView?.(guild.id)}
          >
            Voir
          </Button>
          
          {!isMember && guild.is_recruiting && (
            <Button 
              className="flex-1"
              onClick={() => onJoin?.(guild.id)}
              disabled={isLoading || isPending || guild.member_count >= guild.max_members}
            >
              {isPending ? 'En attente...' : 
               guild.member_count >= guild.max_members ? 'Complet' : 'Rejoindre'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
});

GuildCard.displayName = 'GuildCard';

export default GuildCard;
