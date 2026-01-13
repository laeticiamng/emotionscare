/**
 * TournamentBracketView - Visualisation des brackets de tournoi
 * TOP 20 #1 - Composant UI pour useTournamentBrackets
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Clock, Swords } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { BracketData, TournamentMatch, TournamentParticipant } from '@/hooks/useTournamentBrackets';

interface TournamentBracketViewProps {
  bracketData: BracketData | null;
  participants: TournamentParticipant[];
  getParticipant: (id: string | null) => TournamentParticipant | null;
  currentUserId?: string;
}

const MatchCard = memo(({ 
  match, 
  getParticipant,
  currentUserId 
}: { 
  match: TournamentMatch; 
  getParticipant: (id: string | null) => TournamentParticipant | null;
  currentUserId?: string;
}) => {
  const p1 = getParticipant(match.participant_1_id);
  const p2 = getParticipant(match.participant_2_id);
  const isUserMatch = p1?.user_id === currentUserId || p2?.user_id === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "bg-card border rounded-lg p-3 min-w-[200px]",
        isUserMatch && "ring-2 ring-primary",
        match.status === 'completed' && "opacity-75"
      )}
    >
      {/* Participant 1 */}
      <div className={cn(
        "flex items-center justify-between py-2 border-b",
        match.winner_id === match.participant_1_id && "text-primary font-bold"
      )}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{p1?.avatar_emoji || '❓'}</span>
          <span className="text-sm truncate max-w-[100px]">
            {p1?.display_name || 'En attente...'}
          </span>
        </div>
        <Badge variant={match.winner_id === match.participant_1_id ? "default" : "secondary"}>
          {match.participant_1_score}
        </Badge>
      </div>

      {/* VS indicator */}
      <div className="flex items-center justify-center py-1 text-muted-foreground text-xs">
        <Swords className="w-3 h-3 mr-1" />
        VS
      </div>

      {/* Participant 2 */}
      <div className={cn(
        "flex items-center justify-between py-2",
        match.winner_id === match.participant_2_id && "text-primary font-bold"
      )}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{p2?.avatar_emoji || '❓'}</span>
          <span className="text-sm truncate max-w-[100px]">
            {p2?.display_name || 'En attente...'}
          </span>
        </div>
        <Badge variant={match.winner_id === match.participant_2_id ? "default" : "secondary"}>
          {match.participant_2_score}
        </Badge>
      </div>

      {/* Status */}
      <div className="flex items-center justify-center mt-2 pt-2 border-t">
        <Badge variant={
          match.status === 'completed' ? 'default' :
          match.status === 'in_progress' ? 'destructive' : 'secondary'
        }>
          {match.status === 'completed' ? '✅ Terminé' :
           match.status === 'in_progress' ? '🔴 En cours' : 
           match.status === 'bye' ? '🎫 Bye' : '⏳ En attente'}
        </Badge>
      </div>
    </motion.div>
  );
});

MatchCard.displayName = 'MatchCard';

export const TournamentBracketView = memo(({
  bracketData,
  participants,
  getParticipant,
  currentUserId
}: TournamentBracketViewProps) => {
  if (!bracketData || bracketData.rounds.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Trophy className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Le bracket sera généré au début du tournoi</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{participants.length} participants inscrits</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          Bracket du Tournoi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-8 min-w-max">
            {bracketData.rounds.map((round, roundIndex) => (
              <div key={round.round} className="flex flex-col gap-4">
                {/* Round header */}
                <div className="text-center pb-2 border-b">
                  <Badge 
                    variant={round.round === bracketData.currentRound ? "default" : "secondary"}
                    className="font-semibold"
                  >
                    {round.name}
                  </Badge>
                </div>

                {/* Matches */}
                <div 
                  className="flex flex-col justify-around gap-4"
                  style={{ 
                    minHeight: `${Math.pow(2, bracketData.totalRounds - roundIndex) * 80}px` 
                  }}
                >
                  {round.matches.map((match) => (
                    <MatchCard
                      key={match.id}
                      match={match}
                      getParticipant={getParticipant}
                      currentUserId={currentUserId}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Winner column */}
            <div className="flex flex-col gap-4">
              <div className="text-center pb-2 border-b">
                <Badge variant="default" className="font-semibold bg-yellow-500">
                  🏆 Champion
                </Badge>
              </div>
              <div className="flex items-center justify-center h-full">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-2 border-yellow-500 rounded-lg p-6 text-center"
                >
                  <Trophy className="w-12 h-12 mx-auto text-yellow-500 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    En attente du vainqueur
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

TournamentBracketView.displayName = 'TournamentBracketView';

export default TournamentBracketView;
