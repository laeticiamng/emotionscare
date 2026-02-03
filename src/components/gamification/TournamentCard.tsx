/**
 * TournamentCard - Carte de présentation d'un tournoi
 */

import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Clock, 
  Coins,
  Swords,
  Crown,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format, isPast, isFuture } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { Tournament, TournamentStatus } from '@/features/tournaments';

interface TournamentCardProps {
  tournament: Tournament;
  isRegistered?: boolean;
  onRegister?: () => void;
  onView?: () => void;
  className?: string;
}

const statusConfig: Record<TournamentStatus, { label: string; color: string; icon: React.ReactNode }> = {
  upcoming: { label: 'À venir', color: 'bg-blue-500/10 text-blue-500', icon: <Calendar className="h-3 w-3" /> },
  registering: { label: 'Inscriptions', color: 'bg-green-500/10 text-green-500', icon: <Users className="h-3 w-3" /> },
  in_progress: { label: 'En cours', color: 'bg-orange-500/10 text-orange-500', icon: <Swords className="h-3 w-3" /> },
  completed: { label: 'Terminé', color: 'bg-muted text-muted-foreground', icon: <Trophy className="h-3 w-3" /> },
  cancelled: { label: 'Annulé', color: 'bg-destructive/10 text-destructive', icon: <Clock className="h-3 w-3" /> }
};

const typeLabels: Record<string, string> = {
  single_elimination: 'Élimination simple',
  double_elimination: 'Double élimination',
  round_robin: 'Round-robin',
  swiss: 'Système suisse'
};

const TournamentCard: React.FC<TournamentCardProps> = memo(({
  tournament,
  isRegistered = false,
  onRegister,
  onView,
  className
}) => {
  const status = statusConfig[tournament.status];
  const participationRate = (tournament.current_participants / tournament.max_participants) * 100;

  const timeInfo = useMemo(() => {
    const startDate = new Date(tournament.starts_at);
    const regDeadline = new Date(tournament.registration_deadline);
    
    if (tournament.status === 'registering' && isFuture(regDeadline)) {
      return {
        label: 'Inscription jusqu\'au',
        value: format(regDeadline, 'dd MMM à HH:mm', { locale: fr }),
        countdown: formatDistanceToNow(regDeadline, { locale: fr, addSuffix: true })
      };
    }
    
    if (isFuture(startDate)) {
      return {
        label: 'Début',
        value: format(startDate, 'dd MMM à HH:mm', { locale: fr }),
        countdown: formatDistanceToNow(startDate, { locale: fr, addSuffix: true })
      };
    }
    
    return {
      label: 'Commencé',
      value: format(startDate, 'dd MMM', { locale: fr }),
      countdown: null
    };
  }, [tournament]);

  return (
    <Card className={cn(
      "hover:shadow-lg transition-all duration-300 hover:-translate-y-1",
      isRegistered && "border-primary/50 bg-primary/5",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn("gap-1", status.color)}>
                {status.icon}
                {status.label}
              </Badge>
              {isRegistered && (
                <Badge variant="secondary" className="gap-1">
                  <Crown className="h-3 w-3" aria-hidden="true" />
                  Inscrit
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg mt-2 truncate">{tournament.name}</CardTitle>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-lg font-bold text-yellow-500">
              <Coins className="h-5 w-5" aria-hidden="true" />
              {tournament.prize_pool}
            </div>
            <p className="text-xs text-muted-foreground">Prix</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {tournament.description}
        </p>

        {/* Type & Date */}
        <div className="flex items-center justify-between text-sm">
          <Badge variant="outline">{typeLabels[tournament.type] || tournament.type}</Badge>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Timer className="h-4 w-4" aria-hidden="true" />
            {timeInfo.countdown || timeInfo.value}
          </div>
        </div>

        {/* Participants Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" aria-hidden="true" />
              Participants
            </span>
            <span className="font-medium">
              {tournament.current_participants}/{tournament.max_participants}
            </span>
          </div>
          <Progress 
            value={participationRate} 
            className="h-2" 
            aria-label={`${tournament.current_participants} participants sur ${tournament.max_participants}`}
          />
        </div>

        {/* Entry Fee */}
        {tournament.entry_fee_points > 0 && (
          <div className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded-lg">
            <span className="text-muted-foreground">Frais d'inscription</span>
            <span className="font-medium flex items-center gap-1">
              <Coins className="h-4 w-4 text-yellow-500" aria-hidden="true" />
              {tournament.entry_fee_points} points
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={onView}>
            Voir détails
          </Button>
          {tournament.status === 'registering' && !isRegistered && (
            <Button 
              className="flex-1"
              onClick={onRegister}
              disabled={tournament.current_participants >= tournament.max_participants}
            >
              S'inscrire
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

TournamentCard.displayName = 'TournamentCard';

export default TournamentCard;
