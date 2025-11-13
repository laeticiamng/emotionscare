// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, TrendingUp, Calendar, Crown } from 'lucide-react';
import { leaderboardService, LeaderboardEntry } from '@/services/leaderboardService';
import { useAuth } from '@/contexts/AuthContext';

export const LeaderboardPanel: React.FC = () => {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<{ global?: number; weekly?: number; monthly?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    setLoading(true);
    const [global, weekly, monthly, rank] = await Promise.all([
      leaderboardService.getGlobalLeaderboard(50),
      leaderboardService.getWeeklyLeaderboard(50),
      leaderboardService.getMonthlyLeaderboard(50),
      leaderboardService.getUserRank()
    ]);
    setGlobalLeaderboard(global);
    setWeeklyLeaderboard(weekly);
    setMonthlyLeaderboard(monthly);
    setUserRank(rank);
    setLoading(false);
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-orange-500" />;
    return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>;
  };

  const renderLeaderboard = (entries: LeaderboardEntry[], scoreKey: 'total_score' | 'weekly_score' | 'monthly_score') => (
    <div className="space-y-2">
      {entries.map((entry, index) => {
        const isCurrentUser = user?.id === entry.user_id;
        return (
          <div
            key={entry.id}
            className={`flex items-center gap-4 p-3 rounded-lg ${
              isCurrentUser ? 'bg-primary/10 border border-primary' : 'bg-secondary/20'
            }`}
          >
            <div className="flex items-center justify-center w-10">
              {getRankBadge(index + 1)}
            </div>
            
            <Avatar className="w-10 h-10">
              <AvatarImage src={entry.avatar_url} alt={entry.display_name} />
              <AvatarFallback>{entry.display_name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{entry.display_name}</span>
                {isCurrentUser && (
                  <Badge variant="outline" className="text-xs">Vous</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {entry[scoreKey].toLocaleString()} points
              </p>
            </div>
            
            {index < 3 && (
              <Trophy className={`w-6 h-6 ${
                index === 0 ? 'text-yellow-500' : 
                index === 1 ? 'text-gray-400' : 
                'text-orange-500'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Trophy className="w-5 h-5 text-primary" />
          Classement
        </CardTitle>
        {userRank && (
          <div className="flex gap-4 mt-4 p-4 bg-secondary/20 rounded-lg">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Global:</span>
              <span className="font-bold text-foreground">#{userRank.global}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Semaine:</span>
              <span className="font-bold text-foreground">#{userRank.weekly}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Mois:</span>
              <span className="font-bold text-foreground">#{userRank.monthly}</span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="global" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="global">
              <Trophy className="w-4 h-4 mr-2" />
              Global
            </TabsTrigger>
            <TabsTrigger value="weekly">
              <TrendingUp className="w-4 h-4 mr-2" />
              Semaine
            </TabsTrigger>
            <TabsTrigger value="monthly">
              <Calendar className="w-4 h-4 mr-2" />
              Mois
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="global" className="mt-4">
            {renderLeaderboard(globalLeaderboard, 'total_score')}
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-4">
            {renderLeaderboard(weeklyLeaderboard, 'weekly_score')}
          </TabsContent>
          
          <TabsContent value="monthly" className="mt-4">
            {renderLeaderboard(monthlyLeaderboard, 'monthly_score')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
