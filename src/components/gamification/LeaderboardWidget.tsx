// @ts-nocheck

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, Medal, Award, TrendingUp, TrendingDown, Minus, 
  Users, Calendar, Flame, RefreshCw 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  points: number;
  level: number;
  isCurrentUser: boolean;
  trend?: 'up' | 'down' | 'same';
  trendValue?: number;
  streak?: number;
  avatarUrl?: string;
}

interface LeaderboardWidgetProps {
  entries?: LeaderboardEntry[];
  title?: string;
  showCurrentUser?: boolean;
  maxEntries?: number;
}

type Period = 'day' | 'week' | 'month' | 'all';

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  entries = [],
  title = "Classement",
  showCurrentUser = true,
  maxEntries = 5
}) => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('week');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Mock data with trends
  const defaultEntries: LeaderboardEntry[] = [
    { rank: 1, userId: '1', name: user?.email || 'Vous', points: 1250, level: 8, isCurrentUser: true, trend: 'up', trendValue: 2, streak: 7 },
    { rank: 2, userId: '2', name: 'Sophie M.', points: 1180, level: 7, isCurrentUser: false, trend: 'same', trendValue: 0, streak: 12 },
    { rank: 3, userId: '3', name: 'Thomas L.', points: 1050, level: 6, isCurrentUser: false, trend: 'down', trendValue: 1, streak: 3 },
    { rank: 4, userId: '4', name: 'Marie D.', points: 980, level: 6, isCurrentUser: false, trend: 'up', trendValue: 3, streak: 5 },
    { rank: 5, userId: '5', name: 'Pierre K.', points: 920, level: 5, isCurrentUser: false, trend: 'down', trendValue: 2, streak: 0 }
  ];

  const displayEntries = entries.length > 0 ? entries : defaultEntries;
  const limitedEntries = displayEntries.slice(0, maxEntries);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-orange-600" />;
      default: return null;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-yellow-500/30 shadow-lg';
      case 2: return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-gray-400/30 shadow-lg';
      case 3: return 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-orange-500/30 shadow-lg';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getTrendLabel = (trend?: string, value?: number) => {
    if (!trend || trend === 'same') return 'Stable';
    return trend === 'up' ? `+${value} place${value && value > 1 ? 's' : ''}` : `-${value} place${value && value > 1 ? 's' : ''}`;
  };

  const getDisplayTitle = () => {
    if (userMode === 'b2b_admin' || userMode === 'b2b_user') {
      return `${title} Équipe`;
    }
    return `${title} Global`;
  };

  const periods: { value: Period; label: string; icon: React.ReactNode }[] = [
    { value: 'day', label: 'Jour', icon: <Calendar className="h-3 w-3" /> },
    { value: 'week', label: 'Semaine', icon: <Calendar className="h-3 w-3" /> },
    { value: 'month', label: 'Mois', icon: <Calendar className="h-3 w-3" /> },
    { value: 'all', label: 'Total', icon: <Users className="h-3 w-3" /> },
  ];

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {getDisplayTitle()}
            </CardTitle>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          {/* Period Selector */}
          <div className="flex gap-1 mt-2">
            {periods.map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? 'secondary' : 'ghost'}
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => setSelectedPeriod(period.value)}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-2">
          <AnimatePresence mode="popLayout">
            {limitedEntries.map((entry, index) => (
              <motion.div 
                key={entry.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                  entry.isCurrentUser 
                    ? 'bg-primary/10 border border-primary/20 shadow-sm' 
                    : 'bg-muted/50 hover:bg-muted/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankBadge(entry.rank)}`}>
                      {entry.rank}
                    </div>
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* User Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${entry.isCurrentUser ? 'text-primary' : ''}`}>
                        {entry.name}
                      </span>
                      {entry.isCurrentUser && (
                        <Badge variant="outline" className="text-xs">
                          Vous
                        </Badge>
                      )}
                      {entry.streak && entry.streak >= 7 && (
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center gap-0.5 text-orange-500">
                              <Flame className="h-3 w-3" />
                              <span className="text-xs font-medium">{entry.streak}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Série de {entry.streak} jours 🔥</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        Niveau {entry.level}
                      </p>
                      
                      {/* Trend Indicator */}
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center gap-0.5">
                            {getTrendIcon(entry.trend)}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">{getTrendLabel(entry.trend, entry.trendValue)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Trophy className="h-4 w-4" />
                    <span className="font-semibold tabular-nums">{entry.points.toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Current User Position (if not in top) */}
          {showCurrentUser && !limitedEntries.some(entry => entry.isCurrentUser) && (
            <div className="border-t pt-3 mt-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-muted text-muted-foreground">
                    ?
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-primary">
                        {user?.email || 'Vous'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Vous
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Votre position
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-600">
                    <Trophy className="h-4 w-4" />
                    <span className="font-semibold">???</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t mt-3">
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{limitedEntries.length}</p>
              <p className="text-xs text-muted-foreground">Participants</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-yellow-600">
                {Math.round(limitedEntries.reduce((sum, e) => sum + e.points, 0) / limitedEntries.length)}
              </p>
              <p className="text-xs text-muted-foreground">Moyenne XP</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-orange-500">
                {Math.max(...limitedEntries.map(e => e.streak || 0))}
              </p>
              <p className="text-xs text-muted-foreground">Meilleure série</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default LeaderboardWidget;
