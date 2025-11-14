/**
 * Panneau social - Amis et comparaisons
 */

import React, { useState, useEffect } from 'react';
import { LazyMotionWrapper, m } from '@/utils/lazy-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  TrendingUp,
  TrendingDown,
  Music,
  Trophy,
  Share2,
  UserPlus
} from '@/components/music/icons';
import { 
  getFriends, 
  compareFriendStats, 
  type MusicFriend, 
  type FriendComparison 
} from '@/services/music/social-service';
import { useToast } from '@/hooks/use-toast';

interface SocialFriendsPanelProps {
  userId: string;
}

export const SocialFriendsPanel: React.FC<SocialFriendsPanelProps> = ({ userId }) => {
  const [friends, setFriends] = useState<MusicFriend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<FriendComparison | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFriends();
  }, [userId]);

  const loadFriends = async () => {
    setIsLoading(true);
    try {
      const data = await getFriends(userId);
      setFriends(data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les amis',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareFriend = async (friendId: string) => {
    try {
      const comparison = await compareFriendStats(userId, friendId);
      setSelectedFriend(comparison);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de comparer les statistiques',
        variant: 'destructive'
      });
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'En ligne';
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-3 bg-muted rounded w-1/3" />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (selectedFriend) {
    const { friend, yourStats, theirStats, comparison } = selectedFriend;
    
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedFriend(null)}
        >
          ← Retour aux amis
        </Button>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={friend.avatarUrl} alt={friend.displayName} />
                <AvatarFallback>{friend.displayName[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-foreground">{friend.displayName}</h3>
                <p className="text-sm text-muted-foreground">Niveau {friend.level}</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Défier
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Votre colonne */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                Vous
              </h4>
              
              <div className="space-y-3">
                <StatComparison
                  label="Niveau"
                  yourValue={yourStats.level}
                  theirValue={theirStats.level}
                  icon="🎯"
                />
                <StatComparison
                  label="XP Total"
                  yourValue={yourStats.xp}
                  theirValue={theirStats.xp}
                  icon="⭐"
                />
                <StatComparison
                  label="Temps d'écoute"
                  yourValue={`${yourStats.totalListeningTime}min`}
                  theirValue={`${theirStats.totalListeningTime}min`}
                  icon="⏱️"
                />
                <StatComparison
                  label="Pistes écoutées"
                  yourValue={yourStats.totalTracks}
                  theirValue={theirStats.totalTracks}
                  icon="🎵"
                />
                <StatComparison
                  label="Genres explorés"
                  yourValue={yourStats.uniqueGenres}
                  theirValue={theirStats.uniqueGenres}
                  icon="🌍"
                />
              </div>
            </div>

            {/* Leur colonne */}
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary" />
                {friend.displayName}
              </h4>
              
              <div className="space-y-3 text-right">
                <div className="text-sm text-muted-foreground">Niveau {theirStats.level}</div>
                <div className="text-sm text-muted-foreground">{theirStats.xp} XP</div>
                <div className="text-sm text-muted-foreground">{theirStats.totalListeningTime}min</div>
                <div className="text-sm text-muted-foreground">{theirStats.totalTracks} pistes</div>
                <div className="text-sm text-muted-foreground">{theirStats.uniqueGenres} genres</div>
              </div>
            </div>
          </div>

          {comparison.genresInCommon.length > 0 && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <h5 className="text-sm font-semibold text-foreground mb-2">
                🎶 Genres en commun
              </h5>
              <div className="flex flex-wrap gap-2">
                {comparison.genresInCommon.map(genre => (
                  <Badge key={genre} variant="secondary">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <LazyMotionWrapper>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">Vos Amis</h3>
          <p className="text-sm text-muted-foreground">
            {friends.length} ami{friends.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-3">
        {friends.map((friend, index) => (
          <m.div
            key={friend.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={friend.avatarUrl} alt={friend.displayName} />
                    <AvatarFallback>{friend.displayName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h4 className="font-semibold text-foreground">{friend.displayName}</h4>
                    <p className="text-sm text-muted-foreground">
                      Niveau {friend.level} • {friend.badgesCount} badges
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getRelativeTime(friend.lastActive)}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCompareFriend(friend.userId)}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Comparer
                </Button>
              </div>
            </Card>
          </m.div>
        ))}
      </div>
    </div>
    </LazyMotionWrapper>
  );
};

interface StatComparisonProps {
  label: string;
  yourValue: string | number;
  theirValue: string | number;
  icon: string;
}

const StatComparison: React.FC<StatComparisonProps> = ({ label, yourValue, theirValue, icon }) => {
  const yourNum = typeof yourValue === 'string' ? parseInt(yourValue) : yourValue;
  const theirNum = typeof theirValue === 'string' ? parseInt(theirValue) : theirValue;
  const isHigher = yourNum > theirNum;
  const isEqual = yourNum === theirNum;
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-foreground">{yourValue}</span>
        {!isEqual && (
          isHigher ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )
        )}
      </div>
    </div>
  );
};
