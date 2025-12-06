/**
 * Exchange Leaderboard - Rankings across all markets
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  TrendingUp, 
  Shield, 
  Clock, 
  Heart,
  Crown,
  Medal,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLeaderboard } from '../hooks/useExchangeData';

const marketIcons = {
  global: Trophy,
  improvement: TrendingUp,
  trust: Shield,
  time: Clock,
  emotion: Heart,
};

const marketLabels = {
  global: 'Global',
  improvement: 'Improvement',
  trust: 'Trust',
  time: 'Time',
  emotion: 'Emotion',
};

const marketColors = {
  global: 'from-amber-500 to-yellow-600',
  improvement: 'from-emerald-500 to-teal-600',
  trust: 'from-blue-500 to-indigo-600',
  time: 'from-amber-500 to-orange-600',
  emotion: 'from-pink-500 to-rose-600',
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-amber-500" aria-hidden="true" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" aria-hidden="true" />;
    case 3:
      return <Award className="w-5 h-5 text-amber-700" aria-hidden="true" />;
    default:
      return null;
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-amber-500/30';
    case 2:
      return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
    case 3:
      return 'bg-gradient-to-r from-amber-700/20 to-amber-800/20 border-amber-700/30';
    default:
      return 'bg-muted/30';
  }
};

const ExchangeLeaderboard: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState('global');
  const [period, setPeriod] = useState('weekly');
  const { data: leaderboard, isLoading } = useLeaderboard(selectedMarket, period);

  // Mock data for demonstration
  const mockLeaderboard = [
    { rank: 1, name: 'EmotionMaster', level: 42, score: 12450, badges: ['🏆', '⭐', '💎'] },
    { rank: 2, name: 'TrustBuilder', level: 38, score: 11200, badges: ['🥈', '🔥'] },
    { rank: 3, name: 'TimeTrader', level: 35, score: 10800, badges: ['🥉', '⚡'] },
    { rank: 4, name: 'CalmSeeker', level: 32, score: 9500, badges: ['🎯'] },
    { rank: 5, name: 'FocusHero', level: 30, score: 8900, badges: ['🌟'] },
    { rank: 6, name: 'EnergyBoost', level: 28, score: 8200, badges: [] },
    { rank: 7, name: 'JoyBringer', level: 26, score: 7600, badges: [] },
    { rank: 8, name: 'CreativeFlow', level: 24, score: 7100, badges: [] },
    { rank: 9, name: 'ConfidentOne', level: 22, score: 6500, badges: [] },
    { rank: 10, name: 'PeaceKeeper', level: 20, score: 6000, badges: [] },
  ];

  const Icon = marketIcons[selectedMarket as keyof typeof marketIcons];
  const color = marketColors[selectedMarket as keyof typeof marketColors];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" aria-hidden="true" />
          Classement
        </h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32" aria-label="Sélectionner la période">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Jour</SelectItem>
            <SelectItem value="weekly">Semaine</SelectItem>
            <SelectItem value="monthly">Mois</SelectItem>
            <SelectItem value="alltime">All-time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={selectedMarket} onValueChange={setSelectedMarket}>
        <TabsList className="grid grid-cols-5" aria-label="Sélection du marché">
          {Object.entries(marketLabels).map(([key, label]) => {
            const TabIcon = marketIcons[key as keyof typeof marketIcons];
            return (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                <TabIcon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden md:inline">{label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={selectedMarket} className="mt-6">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* 2nd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="pt-8"
            >
              <Card className={`text-center ${getRankBg(2)} border`}>
                <CardContent className="pt-6 pb-4">
                  <div className="relative inline-block">
                    <Avatar className="w-16 h-16 mx-auto border-4 border-gray-400">
                      <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-500 text-white">
                        2
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2">
                      {getRankIcon(2)}
                    </div>
                  </div>
                  <p className="font-bold mt-3">{mockLeaderboard[1].name}</p>
                  <p className="text-sm text-muted-foreground">Niveau {mockLeaderboard[1].level}</p>
                  <p className="text-xl font-bold mt-2">{mockLeaderboard[1].score.toLocaleString()}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
            >
              <Card className={`text-center ${getRankBg(1)} border relative overflow-hidden`}>
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
                <CardContent className="pt-6 pb-4">
                  <div className="relative inline-block">
                    <Avatar className="w-20 h-20 mx-auto border-4 border-amber-500">
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white text-xl">
                        1
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-3 -right-3">
                      {getRankIcon(1)}
                    </div>
                  </div>
                  <p className="font-bold mt-3 text-lg">{mockLeaderboard[0].name}</p>
                  <p className="text-sm text-muted-foreground">Niveau {mockLeaderboard[0].level}</p>
                  <div className="flex justify-center gap-1 mt-2">
                    {mockLeaderboard[0].badges.map((badge, i) => (
                      <span key={i} className="text-lg">{badge}</span>
                    ))}
                  </div>
                  <p className="text-2xl font-bold mt-2 bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
                    {mockLeaderboard[0].score.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-12"
            >
              <Card className={`text-center ${getRankBg(3)} border`}>
                <CardContent className="pt-6 pb-4">
                  <div className="relative inline-block">
                    <Avatar className="w-14 h-14 mx-auto border-4 border-amber-700">
                      <AvatarFallback className="bg-gradient-to-br from-amber-700 to-amber-800 text-white">
                        3
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2">
                      {getRankIcon(3)}
                    </div>
                  </div>
                  <p className="font-bold mt-3">{mockLeaderboard[2].name}</p>
                  <p className="text-sm text-muted-foreground">Niveau {mockLeaderboard[2].level}</p>
                  <p className="text-xl font-bold mt-2">{mockLeaderboard[2].score.toLocaleString()}</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Rest of Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Icon className="w-5 h-5" aria-hidden="true" />
                Top 10 - {marketLabels[selectedMarket as keyof typeof marketLabels]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {mockLeaderboard.slice(3).map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                      {entry.rank}
                    </span>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>{entry.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{entry.name}</p>
                      <p className="text-xs text-muted-foreground">Niveau {entry.level}</p>
                    </div>
                    {entry.badges.length > 0 && (
                      <div className="flex gap-1">
                        {entry.badges.map((badge, i) => (
                          <span key={i}>{badge}</span>
                        ))}
                      </div>
                    )}
                    <div className="text-right">
                      <p className="font-bold">{entry.score.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ExchangeLeaderboard;
