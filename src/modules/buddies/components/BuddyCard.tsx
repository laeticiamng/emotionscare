/**
 * Carte de profil buddy
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  MessageCircle, 
  UserPlus, 
  Heart,
  MapPin,
  Clock,
  Star,
  Sparkles,
  Check
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { BuddyProfile } from '../types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BuddyCardProps {
  profile: BuddyProfile;
  compatibilityScore?: number;
  isMatched?: boolean;
  onSendRequest?: () => void;
  onMessage?: () => void;
  onSelect?: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
  offline: 'bg-gray-400'
};

const STATUS_LABELS: Record<string, string> = {
  online: 'En ligne',
  away: 'Absent',
  busy: 'Occupé',
  offline: 'Hors ligne'
};

export const BuddyCard: React.FC<BuddyCardProps> = ({
  profile,
  compatibilityScore,
  isMatched = false,
  onSendRequest,
  onMessage,
  onSelect
}) => {
  const score = compatibilityScore || profile.support_score || 70;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
        onClick={onSelect}
      >
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-lg">
                    {profile.display_name?.charAt(0) || 'B'}
                  </AvatarFallback>
                </Avatar>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                  STATUS_COLORS[profile.availability_status]
                )} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate">
                    {profile.display_name || 'Buddy'}
                  </h3>
                  {profile.is_verified && (
                    <Check className="h-4 w-4 text-blue-500" />
                  )}
                  {profile.is_premium && (
                    <Sparkles className="h-4 w-4 text-amber-500" />
                  )}
                </div>
                
                {profile.location && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {profile.location}
                  </p>
                )}
              </div>

              {/* Badges */}
              {profile.badges.length > 0 && (
                <Badge variant="secondary" className="shrink-0">
                  {profile.badges[0]}
                </Badge>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {profile.bio}
              </p>
            )}

            {/* Compatibility Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Heart className="h-4 w-4 text-pink-500" />
                  Compatibilité
                </span>
                <span className="font-semibold">{score}%</span>
              </div>
              <Progress 
                value={score} 
                className="h-2"
              />
            </div>

            {/* Interests */}
            {profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {profile.interests.slice(0, 4).map((interest, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {interest}
                  </Badge>
                ))}
                {profile.interests.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{profile.interests.length - 4}
                  </Badge>
                )}
              </div>
            )}

            {/* Status & Last Active */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className={cn(
                  "h-2 w-2 rounded-full",
                  STATUS_COLORS[profile.availability_status]
                )} />
                {STATUS_LABELS[profile.availability_status]}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(profile.last_active_at), { addSuffix: true, locale: fr })}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2" onClick={e => e.stopPropagation()}>
              {isMatched ? (
                <Button className="flex-1 gap-2" onClick={onMessage}>
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
              ) : (
                <Button className="flex-1 gap-2" onClick={onSendRequest}>
                  <UserPlus className="h-4 w-4" />
                  Connecter
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BuddyCard;
