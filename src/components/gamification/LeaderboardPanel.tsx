// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, TrendingUp, Calendar, Crown, Search, Filter, Medal, Flame, Star } from 'lucide-react';
import { leaderboardService, LeaderboardEntry } from '@/services/leaderboardService';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export const LeaderboardPanel: React.FC = () => {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<{ global?: number; weekly?: number; monthly?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'streak' | 'achievements'>('score');
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
    if (rank === 1) return <Crown className="w-6 h-6 text-yellow-500 drop-shadow-lg" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-orange-500" />;
    if (rank <= 10) return <Star className="w-4 h-4 text-primary" />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const filterEntries = (entries: LeaderboardEntry[]) => {
    return entries.filter(entry => 
      entry.display_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderLeaderboard = (entries: LeaderboardEntry[], scoreKey: 'total_score' | 'weekly_score' | 'monthly_score') => {
    const filtered = filterEntries(entries);
    return (
      <div className="space-y-2">
        <AnimatePresence>
          {filtered.map((entry, index) => {
            const isCurrentUser = user?.id === entry.user_id;
            const isTopThree = index < 3;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                  isCurrentUser 
                    ? 'bg-primary/10 border-2 border-primary shadow-md' 
                    : isTopThree
                    ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20'
                    : 'bg-secondary/20 hover:bg-secondary/30'
                }`}
              >
                <div className="flex items-center justify-center w-12">
                  {getRankBadge(index + 1)}
                </div>
                
                <Avatar className={`w-10 h-10 ${isTopThree ? 'ring-2 ring-yellow-500/50' : ''}`}>
                  <AvatarImage src={entry.avatar_url} alt={entry.display_name} />
                  <AvatarFallback className="bg-primary/20">{entry.display_name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{entry.display_name}</span>
                    {isCurrentUser && (
                      <Badge variant="default" className="text-xs bg-primary">Vous</Badge>
                    )}
                    {isTopThree && (
                      <Badge variant="outline" className="text-xs">
                        <Flame className="w-3 h-3 mr-1 text-orange-500" />
                        Top {index + 1}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">{entry[scoreKey].toLocaleString()}</span> points
                  </p>
                </div>
                
                {isTopThree && (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Trophy className={`w-6 h-6 ${
                      index === 0 ? 'text-yellow-500' : 
                      index === 1 ? 'text-gray-400' : 
                      'text-orange-500'
                    }`} />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Aucun résultat trouvé</p>
        )}
      </div>
    );
  };

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
          <div className="flex flex-wrap gap-4 mt-4 p-4 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
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
        
        {/* Search Filter */}
        <div className="flex gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un joueur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as typeof sortBy)}>
            <SelectTrigger className="w-36">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Score</SelectItem>
              <SelectItem value="streak">Streak</SelectItem>
              <SelectItem value="achievements">Succès</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
