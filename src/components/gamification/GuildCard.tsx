/**
 * GuildCard - Carte de présentation d'une guilde
 */

import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Users, 
  Trophy, 
  Star, 
  Lock, 
  Globe,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Guild } from '@/features/guilds';

interface GuildCardProps {
  guild: Guild;
  isMember?: boolean;
  onJoin?: () => void;
  onView?: () => void;
  className?: string;
}

const GuildCard: React.FC<GuildCardProps> = memo(({
  guild,
  isMember = false,
  onJoin,
  onView,
  className
}) => {
  const privacyIcon = {
    public: <Globe className="h-3 w-3" aria-hidden="true" />,
    private: <Lock className="h-3 w-3" aria-hidden="true" />,
    invite_only: <Star className="h-3 w-3" aria-hidden="true" />
  };

  const xpToNextLevel = guild.level * 1000;
  const currentXpInLevel = guild.total_xp % 1000;
  const levelProgress = (currentXpInLevel / 1000) * 100;

  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
      isMember && "border-primary/50",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 text-2xl">
            <AvatarFallback className="bg-primary/10">
              {guild.icon_emoji}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg truncate">{guild.name}</CardTitle>
              {isMember && (
                <Badge variant="secondary" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" aria-hidden="true" />
                  Membre
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {guild.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-lg font-bold">
              <Users className="h-4 w-4 text-primary" aria-hidden="true" />
              {guild.current_members}
            </div>
            <p className="text-xs text-muted-foreground">/{guild.max_members}</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-lg font-bold">
              <Trophy className="h-4 w-4 text-yellow-500" aria-hidden="true" />
              {guild.level}
            </div>
            <p className="text-xs text-muted-foreground">Niveau</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-lg font-bold">
              <Star className="h-4 w-4 text-orange-500" aria-hidden="true" />
              {guild.total_xp.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">XP Total</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Niveau {guild.level}</span>
            <span>Niveau {guild.level + 1}</span>
          </div>
          <Progress value={levelProgress} className="h-2" aria-label={`Progression niveau ${Math.round(levelProgress)}%`} />
          <p className="text-xs text-center text-muted-foreground">
            {currentXpInLevel}/{1000} XP
          </p>
        </div>

        {/* Tags */}
        {guild.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {guild.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {guild.tags.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{guild.tags.length - 4}
              </Badge>
            )}
          </div>
        )}

        {/* Privacy & Actions */}
        <div className="flex items-center justify-between pt-2">
          <Badge variant="secondary" className="gap-1">
            {privacyIcon[guild.privacy]}
            {guild.privacy === 'public' ? 'Public' : guild.privacy === 'private' ? 'Privé' : 'Invitation'}
          </Badge>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onView}>
              Voir
            </Button>
            {!isMember && guild.privacy !== 'private' && (
              <Button 
                size="sm" 
                onClick={onJoin}
                disabled={guild.current_members >= guild.max_members}
              >
                Rejoindre
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

GuildCard.displayName = 'GuildCard';

export default GuildCard;
