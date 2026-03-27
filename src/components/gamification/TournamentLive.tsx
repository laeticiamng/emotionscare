// @ts-nocheck
/**
 * TournamentLive - Streaming de tournois en direct
 * Affiche les tournois en cours avec classement temps réel
 */

import React, { useState, useEffect, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Trophy, Users, Clock, Flame, Star, Medal,
  Play, Eye, Bell, ChevronUp, ChevronDown, Minus, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  previousRank: number;
  currentRank: number;
  streak: number;
  isOnline: boolean;
}

interface Tournament {
  id: string;
  name: string;
  type: 'meditation' | 'breathing' | 'wellness' | 'mixed';
  status: 'live' | 'upcoming' | 'finished';
  startTime: Date;
  endTime: Date;
  participants: Participant[];
  viewers: number;
  prizePool: {
    first: string;
    second: string;
    third: string;
  };
}

const TournamentLive = memo(() => {
  const [isNotifying, setIsNotifying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  // Fetch live tournament from Supabase
  const {
    data: tournament,
    isLoading,
    error,
  } = useQuery<Tournament | null>({
    queryKey: ['tournament_live'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('status', 'live')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      // Fetch participants
      const { data: participantsData } = await supabase
        .from('tournament_participants')
        .select('*')
        .eq('tournament_id', data.id)
        .order('score', { ascending: false });

      const participants: Participant[] = (participantsData ?? []).map((p: any, index: number) => ({
        id: p.id ?? p.user_id,
        name: p.display_name ?? p.username ?? `Joueur ${index + 1}`,
        avatar: p.avatar_url,
        score: p.score ?? 0,
        previousRank: p.previous_rank ?? index + 1,
        currentRank: index + 1,
        streak: p.streak ?? 0,
        isOnline: p.is_online ?? true,
      }));

      return {
        id: data.id,
        name: data.name ?? data.title ?? 'Tournoi en cours',
        type: data.type ?? 'mixed',
        status: 'live' as const,
        startTime: new Date(data.start_time ?? data.started_at ?? data.created_at),
        endTime: new Date(data.end_time ?? data.ends_at ?? Date.now() + 7200000),
        participants,
        viewers: data.viewers_count ?? data.viewers ?? 0,
        prizePool: {
          first: data.prize_first ?? '1000 XP + Badge Or',
          second: data.prize_second ?? '500 XP + Badge Argent',
          third: data.prize_third ?? '250 XP + Badge Bronze',
        },
      };
    },
    refetchInterval: 30000, // Refresh every 30s for live data
  });

  useEffect(() => {
    if (!tournament) return;
    const updateTime = () => {
      const diff = tournament.endTime.getTime() - Date.now();
      if (diff <= 0) {
        setTimeRemaining('Terminé');
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeRemaining(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [tournament?.endTime]);

  const getRankChange = (participant: Participant) => {
    const change = participant.previousRank - participant.currentRank;
    if (change > 0) return { icon: ChevronUp, color: 'text-green-500', text: `+${change}` };
    if (change < 0) return { icon: ChevronDown, color: 'text-red-500', text: `${change}` };
    return { icon: Minus, color: 'text-muted-foreground', text: '=' };
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return <Medal className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const toggleNotifications = () => {
    setIsNotifying(!isNotifying);
  };

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 pb-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="flex items-end justify-center gap-2 h-24 mb-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 w-12" />)}
          </div>
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center" role="alert">
          <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-2" />
          <p className="text-sm text-red-500">Erreur lors du chargement du tournoi</p>
        </CardContent>
      </Card>
    );
  }

  if (!tournament) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">Aucun tournoi en cours</p>
          <p className="text-sm text-muted-foreground mt-1">Revenez bientôt pour participer !</p>
        </CardContent>
      </Card>
    );
  }

  const leaderScore = tournament.participants[0]?.score || 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="destructive" className="animate-pulse">
                <div className="h-2 w-2 rounded-full bg-white mr-1 animate-ping" />
                LIVE
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {tournament.viewers}
              </Badge>
            </div>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {tournament.name}
            </CardTitle>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Temps restant</div>
            <div className="text-xl font-bold font-mono">{timeRemaining}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Podium animé */}
        {tournament.participants.length >= 3 && (
          <div className="flex items-end justify-center gap-2 h-24 mb-4">
            {tournament.participants.slice(0, 3).map((p, i) => {
              const heights = ['h-20', 'h-24', 'h-16'];
              const order = [1, 0, 2];
              const participant = tournament.participants[order[i]];
              return (
                <motion.div
                  key={participant.id}
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  className={`flex flex-col items-center ${heights[i]} justify-end`}
                  style={{ order: i }}
                >
                  <Avatar className={`${i === 1 ? 'h-12 w-12' : 'h-10 w-10'} border-2 ${
                    i === 0 ? 'border-yellow-500' : i === 1 ? 'border-gray-400' : 'border-amber-600'
                  }`}>
                    <AvatarImage src={participant.avatar} />
                    <AvatarFallback>{participant.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-xs font-medium truncate max-w-[60px] mt-1">
                    {participant.name}
                  </div>
                  <div className={`w-12 ${heights[i]} rounded-t flex items-center justify-center ${
                    order[i] === 0 ? 'bg-yellow-500' : order[i] === 1 ? 'bg-gray-400' : 'bg-amber-600'
                  }`}>
                    <span className="text-white font-bold">{order[i] + 1}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Classement complet */}
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          <AnimatePresence>
            {tournament.participants.map((participant, index) => {
              const rankChange = getRankChange(participant);
              const RankIcon = rankChange.icon;
              return (
                <motion.div
                  key={participant.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index < 3 ? 'bg-primary/10' : 'bg-muted/30'
                  } ${participant.isOnline ? '' : 'opacity-60'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex justify-center">
                      {getRankBadge(participant.currentRank)}
                    </div>

                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name[0]}</AvatarFallback>
                      </Avatar>
                      {participant.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                      )}
                    </div>

                    <div>
                      <div className="font-medium text-sm flex items-center gap-1">
                        {participant.name}
                        {participant.streak >= 10 && (
                          <Flame className="h-3 w-3 text-orange-500" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        {participant.streak} jours
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <RankIcon className={`h-4 w-4 ${rankChange.color}`} />
                      <span className={`text-xs ${rankChange.color}`}>{rankChange.text}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{participant.score.toLocaleString()}</div>
                      <Progress
                        value={leaderScore > 0 ? (participant.score / leaderScore) * 100 : 0}
                        className="h-1 w-16"
                        aria-label={`Score de ${participant.name}`}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Récompenses */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-600" />
            Prix à gagner
          </h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <Medal className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
              <div className="font-medium">1er</div>
              <div className="text-xs text-muted-foreground">{tournament.prizePool.first}</div>
            </div>
            <div className="text-center">
              <Medal className="h-5 w-5 text-gray-400 mx-auto mb-1" />
              <div className="font-medium">2ème</div>
              <div className="text-xs text-muted-foreground">{tournament.prizePool.second}</div>
            </div>
            <div className="text-center">
              <Medal className="h-5 w-5 text-amber-600 mx-auto mb-1" />
              <div className="font-medium">3ème</div>
              <div className="text-xs text-muted-foreground">{tournament.prizePool.third}</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            Participer
          </Button>
          <Button
            variant={isNotifying ? 'default' : 'outline'}
            onClick={toggleNotifications}
          >
            <Bell className={`h-4 w-4 ${isNotifying ? 'animate-bounce' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

TournamentLive.displayName = 'TournamentLive';

export default TournamentLive;
