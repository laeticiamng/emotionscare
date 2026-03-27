// @ts-nocheck
/**
 * GuildChallenges - Challenges communautaires pour les guildes
 * Défis collaboratifs entre membres d'une guilde
 */

import React, { useState, useEffect, memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Users, Trophy, Target, Clock, Flame, Star,
  Medal, Swords, ChevronRight, Gift, AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface GuildMember {
  id: string;
  name: string;
  avatar?: string;
  contribution: number;
  rank: number;
}

interface GuildChallenge {
  id: string;
  title: string;
  description: string;
  type: 'collective' | 'competitive' | 'streak';
  goal: number;
  progress: number;
  startDate: Date;
  endDate: Date;
  reward: {
    xp: number;
    badge?: string;
    special?: string;
  };
  participants: GuildMember[];
  status: 'active' | 'upcoming' | 'completed';
}

const GuildChallenges = memo(() => {
  const { user } = useAuth();
  const [selectedChallenge, setSelectedChallenge] = useState<GuildChallenge | null>(null);

  // Fetch guild challenges from Supabase
  const {
    data: challenges = [],
    isLoading,
    error,
  } = useQuery<GuildChallenge[]>({
    queryKey: ['guild_challenges', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guild_challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const results: GuildChallenge[] = [];
      for (const row of data ?? []) {
        // Fetch participants for each challenge
        const { data: participantsData } = await supabase
          .from('guild_challenge_participants')
          .select('*')
          .eq('challenge_id', row.id)
          .order('contribution', { ascending: false })
          .limit(5);

        const participants: GuildMember[] = (participantsData ?? []).map((p: any, idx: number) => ({
          id: p.id ?? p.user_id,
          name: p.display_name ?? p.username ?? `Membre ${idx + 1}`,
          avatar: p.avatar_url,
          contribution: p.contribution ?? 0,
          rank: idx + 1,
        }));

        results.push({
          id: row.id,
          title: row.title ?? row.name ?? 'Défi',
          description: row.description ?? '',
          type: row.type ?? 'collective',
          goal: row.goal ?? 100,
          progress: row.progress ?? 0,
          startDate: new Date(row.start_date ?? row.created_at),
          endDate: new Date(row.end_date ?? Date.now() + 86400000),
          reward: {
            xp: row.reward_xp ?? 0,
            badge: row.reward_badge,
            special: row.reward_special,
          },
          participants,
          status: row.status ?? 'active',
        });
      }

      return results;
    },
    enabled: !!user?.id,
  });

  // Auto-select first challenge
  useEffect(() => {
    if (challenges.length > 0 && !selectedChallenge) {
      setSelectedChallenge(challenges[0]);
    }
  }, [challenges, selectedChallenge]);

  const getTimeRemaining = (endDate: Date) => {
    const diff = endDate.getTime() - Date.now();
    if (diff <= 0) return 'Terminé';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}j ${hours}h`;
    return `${hours}h`;
  };

  const getTypeBadge = (type: GuildChallenge['type']) => {
    const config = {
      collective: { label: 'Collectif', color: 'bg-blue-500', icon: Users },
      competitive: { label: 'Compétitif', color: 'bg-red-500', icon: Swords },
      streak: { label: 'Streak', color: 'bg-orange-500', icon: Flame }
    };
    const { label, color, icon: Icon } = config[type];
    return (
      <Badge className={`${color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {label}
      </Badge>
    );
  };

  const getStatusBadge = (status: GuildChallenge['status']) => {
    switch (status) {
      case 'active': return <Badge variant="default">En cours</Badge>;
      case 'upcoming': return <Badge variant="secondary">À venir</Badge>;
      case 'completed': return <Badge className="bg-green-500">Terminé</Badge>;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Medal className="h-4 w-4 text-yellow-500" />;
      case 2: return <Medal className="h-4 w-4 text-gray-400" />;
      case 3: return <Medal className="h-4 w-4 text-amber-600" />;
      default: return <span className="text-xs text-muted-foreground">#{rank}</span>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center" role="alert">
          <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-2" />
          <p className="text-sm text-red-500">Erreur lors du chargement des défis</p>
        </CardContent>
      </Card>
    );
  }

  if (challenges.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="font-medium">Aucun défi disponible</p>
          <p className="text-sm text-muted-foreground mt-1">Rejoignez une guilde pour participer aux défis !</p>
        </CardContent>
      </Card>
    );
  }

  const activeChallenges = challenges.filter(c => c.status === 'active');
  const completedChallenges = challenges.filter(c => c.status === 'completed');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Défis de Guilde
        </CardTitle>
        <CardDescription>
          Relevez des défis ensemble et gagnez des récompenses exclusives
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Défi principal sélectionné */}
        {selectedChallenge && (
          <motion.div
            key={selectedChallenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {getTypeBadge(selectedChallenge.type)}
                  {getStatusBadge(selectedChallenge.status)}
                </div>
                <h3 className="text-lg font-bold">{selectedChallenge.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedChallenge.description}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{getTimeRemaining(selectedChallenge.endDate)}</span>
                </div>
              </div>
            </div>

            {/* Progression */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Progression</span>
                <span className="font-medium">
                  {selectedChallenge.progress} / {selectedChallenge.goal}
                </span>
              </div>
              <Progress
                value={(selectedChallenge.progress / selectedChallenge.goal) * 100}
                className="h-3"
                aria-label="Progression du défi"
              />
            </div>

            {/* Top contributeurs */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Top contributeurs</h4>
              <div className="space-y-2">
                {selectedChallenge.participants.slice(0, 3).map(member => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getRankIcon(member.rank)}
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{member.name}</span>
                    </div>
                    <span className="text-sm font-medium">{member.contribution}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Récompenses */}
            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-sm">Récompenses</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  <Star className="h-3 w-3 mr-1" />
                  {selectedChallenge.reward.xp} XP
                </Badge>
                {selectedChallenge.reward.badge && (
                  <Badge variant="outline">
                    <Medal className="h-3 w-3 mr-1" />
                    {selectedChallenge.reward.badge}
                  </Badge>
                )}
                {selectedChallenge.reward.special && (
                  <Badge variant="outline" className="bg-purple-500/10 text-purple-600">
                    {selectedChallenge.reward.special}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Liste des autres défis */}
        {activeChallenges.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">
              DÉFIS ACTIFS ({activeChallenges.length})
            </h4>
            <div className="space-y-2">
              {activeChallenges.map(challenge => (
                <button
                  key={challenge.id}
                  onClick={() => setSelectedChallenge(challenge)}
                  className={`w-full p-3 rounded-lg border text-left transition-all hover:bg-muted/50 ${
                    selectedChallenge?.id === challenge.id ? 'border-primary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{challenge.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round((challenge.progress / challenge.goal) * 100)}% complété
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Défis terminés */}
        {completedChallenges.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">
              TERMINÉS ({completedChallenges.length})
            </h4>
            <div className="space-y-2">
              {completedChallenges.map(challenge => (
                <div
                  key={challenge.id}
                  className="p-3 rounded-lg bg-muted/30 opacity-70"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-green-500" />
                      <span className="font-medium text-sm">{challenge.title}</span>
                    </div>
                    <Badge variant="outline" className="bg-green-500/10 text-green-600">
                      +{challenge.reward.xp} XP
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Call to action */}
        <Button className="w-full">
          <Users className="h-4 w-4 mr-2" />
          Participer au défi actif
        </Button>
      </CardContent>
    </Card>
  );
});

GuildChallenges.displayName = 'GuildChallenges';

export default GuildChallenges;
