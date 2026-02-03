/**
 * TournamentMatchCard - Carte de match pour les tournois
 * Affiche les détails d'un match avec les participants
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Swords, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Participant {
  id: string;
  display_name: string;
  avatar_url?: string;
  score?: number;
}

interface TournamentMatchCardProps {
  matchId: string;
  round: number;
  matchNumber: number;
  participant1?: Participant;
  participant2?: Participant;
  winnerId?: string;
  status: 'pending' | 'in_progress' | 'completed';
  scheduledAt?: string;
  onMatchClick?: (matchId: string) => void;
}

export const TournamentMatchCard: React.FC<TournamentMatchCardProps> = ({
  matchId,
  round,
  matchNumber,
  participant1,
  participant2,
  winnerId,
  status,
  scheduledAt,
  onMatchClick,
}) => {
  const isWinner = (participantId: string) => winnerId === participantId;
  
  const getStatusBadge = () => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />En attente</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="gap-1 animate-pulse"><Swords className="h-3 w-3" />En cours</Badge>;
      case 'completed':
        return <Badge variant="outline" className="gap-1 border-success/50 text-success"><CheckCircle className="h-3 w-3" />Terminé</Badge>;
    }
  };

  const renderParticipant = (participant?: Participant, isTop = true) => {
    if (!participant) {
      return (
        <div className={cn(
          'flex items-center gap-3 p-3 rounded-lg bg-muted/30',
          isTop ? 'rounded-b-none' : 'rounded-t-none'
        )}>
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">?</span>
          </div>
          <span className="text-muted-foreground italic">En attente...</span>
        </div>
      );
    }

    const isMatchWinner = isWinner(participant.id);
    
    return (
      <div className={cn(
        'flex items-center justify-between p-3 rounded-lg transition-colors',
        isTop ? 'rounded-b-none' : 'rounded-t-none',
        isMatchWinner && status === 'completed' 
          ? 'bg-success/10 border border-success/20' 
          : 'bg-muted/30 hover:bg-muted/50'
      )}>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={participant.avatar_url} alt={participant.display_name} />
            <AvatarFallback>
              {participant.display_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className={cn(
              'font-medium',
              isMatchWinner && 'text-success'
            )}>
              {participant.display_name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {participant.score !== undefined && (
            <span className={cn(
              'text-xl font-bold tabular-nums',
              isMatchWinner ? 'text-success' : 'text-muted-foreground'
            )}>
              {participant.score}
            </span>
          )}
          {isMatchWinner && status === 'completed' && (
            <Trophy className="h-5 w-5 text-yellow-500" />
          )}
        </div>
      </div>
    );
  };

  return (
    <Card 
      className={cn(
        'overflow-hidden cursor-pointer transition-shadow hover:shadow-md',
        status === 'in_progress' && 'ring-2 ring-primary/50'
      )}
      onClick={() => onMatchClick?.(matchId)}
    >
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Round {round}</span>
          <span className="text-muted-foreground">• Match {matchNumber}</span>
        </div>
        {getStatusBadge()}
      </div>
      
      <CardContent className="p-0">
        {renderParticipant(participant1, true)}
        
        <div className="relative flex items-center justify-center py-1 bg-background">
          <div className="absolute left-4 right-4 h-px bg-border" />
          <div className="relative bg-background px-2">
            <Swords className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        {renderParticipant(participant2, false)}
      </CardContent>
      
      {scheduledAt && status === 'pending' && (
        <div className="px-4 py-2 text-xs text-muted-foreground text-center bg-muted/30 border-t">
          Prévu le {format(new Date(scheduledAt), 'dd MMMM à HH:mm', { locale: fr })}
        </div>
      )}
    </Card>
  );
};

export default TournamentMatchCard;
