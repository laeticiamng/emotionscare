/**
 * Carte d'affichage d'une session de groupe
 */

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  UserPlus,
  UserMinus,
  Sparkles,
  Lock,
  Video
} from 'lucide-react';
import { format, formatDistanceToNow, isAfter, isBefore, addMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { GroupSession } from '../types';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GroupSessionCardProps {
  session: GroupSession;
  isRegistered?: boolean;
  onRegister?: () => void;
  onUnregister?: () => void;
  onJoin?: () => void;
  onSelect?: () => void;
  compact?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  wellbeing: 'bg-pink-500/10 text-pink-500 border-pink-500/20',
  meditation: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  breathing: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  discussion: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  creative: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  movement: 'bg-green-500/10 text-green-500 border-green-500/20',
  support: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
  workshop: 'bg-red-500/10 text-red-500 border-red-500/20'
};

const CATEGORY_LABELS: Record<string, string> = {
  wellbeing: 'Bien-être',
  meditation: 'Méditation',
  breathing: 'Respiration',
  discussion: 'Discussion',
  creative: 'Créatif',
  movement: 'Mouvement',
  support: 'Soutien',
  workshop: 'Atelier'
};

export const GroupSessionCard: React.FC<GroupSessionCardProps> = ({
  session,
  isRegistered = false,
  onRegister,
  onUnregister,
  onJoin,
  onSelect,
  compact = false
}) => {
  const scheduledDate = new Date(session.scheduled_at);
  const endDate = addMinutes(scheduledDate, session.duration_minutes);
  const now = new Date();
  
  const isLive = session.status === 'live' || 
    (isAfter(now, scheduledDate) && isBefore(now, endDate));
  const isPast = session.status === 'completed' || isAfter(now, endDate);
  const isUpcoming = !isLive && !isPast;

  const participantCount = session.participant_count || 0;
  const isFull = participantCount >= session.max_participants;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all hover:shadow-lg",
          isLive && "ring-2 ring-green-500 ring-offset-2 ring-offset-background",
          isPast && "opacity-70"
        )}
        onClick={onSelect}
      >
        {/* Status Indicator */}
        {isLive && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
            <span className="h-2 w-2 bg-white rounded-full" />
            EN DIRECT
          </div>
        )}

        {session.session_type === 'private' && (
          <div className="absolute top-3 right-3">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
        )}

        <CardHeader className={cn("pb-2", compact && "p-4")}>
          <div className="flex items-start gap-3">
            {/* Category Badge */}
            <Badge 
              variant="outline" 
              className={cn("shrink-0", CATEGORY_COLORS[session.category])}
            >
              {CATEGORY_LABELS[session.category] || session.category}
            </Badge>

            {/* XP Reward */}
            <Badge variant="secondary" className="ml-auto gap-1">
              <Sparkles className="h-3 w-3" />
              +{session.xp_reward} XP
            </Badge>
          </div>

          <h3 className="font-semibold text-lg mt-2 line-clamp-2">
            {session.title}
          </h3>

          {!compact && session.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {session.description}
            </p>
          )}
        </CardHeader>

        <CardContent className={cn("space-y-4", compact && "p-4 pt-0")}>
          {/* Date & Time */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {isUpcoming 
                  ? formatDistanceToNow(scheduledDate, { addSuffix: true, locale: fr })
                  : format(scheduledDate, 'dd MMM yyyy', { locale: fr })
                }
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{format(scheduledDate, 'HH:mm', { locale: fr })}</span>
              <span>·</span>
              <span>{session.duration_minutes} min</span>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(Math.min(participantCount, 4))].map((_, i) => (
                  <Avatar key={i} className="h-7 w-7 border-2 border-background">
                    <AvatarFallback className="text-xs bg-primary/10">
                      {String.fromCharCode(65 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {participantCount > 4 && (
                  <div className="h-7 w-7 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium">
                    +{participantCount - 4}
                  </div>
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {participantCount}/{session.max_participants}
              </span>
            </div>

            {/* Actions */}
            {!isPast && (
              <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                {isLive ? (
                  <Button 
                    size="sm" 
                    onClick={onJoin}
                    className="gap-1.5 bg-green-500 hover:bg-green-600"
                  >
                    <Video className="h-4 w-4" />
                    Rejoindre
                  </Button>
                ) : isRegistered ? (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={onUnregister}
                    className="gap-1.5"
                  >
                    <UserMinus className="h-4 w-4" />
                    Annuler
                  </Button>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={onRegister}
                    disabled={isFull}
                    className="gap-1.5"
                  >
                    <UserPlus className="h-4 w-4" />
                    {isFull ? 'Complet' : "S'inscrire"}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          {!compact && session.tags && session.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {session.tags.slice(0, 3).map((tag, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default GroupSessionCard;
