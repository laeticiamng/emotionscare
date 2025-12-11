/**
 * Exchange Leaderboard - Rankings enriched with search, profiles, sharing
 */
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  TrendingUp, 
  Shield, 
  Clock, 
  Heart,
  Crown,
  Medal,
  Award,
  Search,
  Share2,
  UserPlus,
  Eye,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLeaderboard } from '../hooks/useExchangeData';
import { useToast } from '@/hooks/use-toast';

interface LeaderboardEntry {
  rank: number;
  name: string;
  level: number;
  score: number;
  badges: string[];
  avatar?: string;
  isFollowing?: boolean;
  totalTrades?: number;
  winRate?: number;
  joinDate?: string;
}

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
  const { toast } = useToast();
  const [selectedMarket, setSelectedMarket] = useState('global');
  const [period, setPeriod] = useState('weekly');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<LeaderboardEntry | null>(null);
  const [following, setFollowing] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('exchangeFollowing');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const { data: leaderboard, isLoading } = useLeaderboard(selectedMarket, period);

  // Mock data for demonstration
  const mockLeaderboard: LeaderboardEntry[] = [
    { rank: 1, name: 'EmotionMaster', level: 42, score: 12450, badges: ['🏆', '⭐', '💎'], totalTrades: 245, winRate: 78, joinDate: '2023-06-15' },
    { rank: 2, name: 'TrustBuilder', level: 38, score: 11200, badges: ['🥈', '🔥'], totalTrades: 198, winRate: 72, joinDate: '2023-07-20' },
    { rank: 3, name: 'TimeTrader', level: 35, score: 10800, badges: ['🥉', '⚡'], totalTrades: 167, winRate: 68, joinDate: '2023-08-10' },
    { rank: 4, name: 'CalmSeeker', level: 32, score: 9500, badges: ['🎯'], totalTrades: 134, winRate: 65, joinDate: '2023-09-01' },
    { rank: 5, name: 'FocusHero', level: 30, score: 8900, badges: ['🌟'], totalTrades: 112, winRate: 62, joinDate: '2023-09-15' },
    { rank: 6, name: 'EnergyBoost', level: 28, score: 8200, badges: [], totalTrades: 98, winRate: 60, joinDate: '2023-10-01' },
    { rank: 7, name: 'JoyBringer', level: 26, score: 7600, badges: [], totalTrades: 87, winRate: 58, joinDate: '2023-10-15' },
    { rank: 8, name: 'CreativeFlow', level: 24, score: 7100, badges: [], totalTrades: 76, winRate: 55, joinDate: '2023-11-01' },
    { rank: 9, name: 'ConfidentOne', level: 22, score: 6500, badges: [], totalTrades: 65, winRate: 52, joinDate: '2023-11-15' },
    { rank: 10, name: 'PeaceKeeper', level: 20, score: 6000, badges: [], totalTrades: 54, winRate: 50, joinDate: '2023-12-01' },
  ];

  // Filter leaderboard
  const filteredLeaderboard = useMemo(() => {
    if (!searchQuery) return mockLeaderboard;
    return mockLeaderboard.filter(entry => 
      entry.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleFollow = (playerName: string) => {
    setFollowing(prev => {
      const newSet = new Set(prev);
      if (newSet.has(playerName)) {
        newSet.delete(playerName);
        toast({ title: 'Ne suit plus', description: `Vous ne suivez plus ${playerName}` });
      } else {
        newSet.add(playerName);
        toast({ title: 'Suivi !', description: `Vous suivez maintenant ${playerName}` });
      }
      localStorage.setItem('exchangeFollowing', JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const shareRanking = async (entry?: LeaderboardEntry) => {
    const text = entry 
      ? `🏆 ${entry.name} est #${entry.rank} sur EmotionsCare Exchange avec ${entry.score.toLocaleString()} points !`
      : `📊 Découvrez le classement EmotionsCare Exchange !`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Classement Exchange', text });
      } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', description: 'Lien copié dans le presse-papier' });
    }
  };

  const exportLeaderboard = () => {
    const csv = [
      ['Rang', 'Nom', 'Niveau', 'Score', 'Badges'].join(','),
      ...mockLeaderboard.map(e => [e.rank, e.name, e.level, e.score, e.badges.join(' ')].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leaderboard_${selectedMarket}_${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Export réussi' });
  };

  const Icon = marketIcons[selectedMarket as keyof typeof marketIcons];
  const color = marketColors[selectedMarket as keyof typeof marketColors];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" aria-hidden="true" />
            Classement
          </h2>
          
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un joueur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-48"
              />
            </div>
            
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
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={() => shareRanking()}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Partager</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={exportLeaderboard}>
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Exporter CSV</TooltipContent>
            </Tooltip>
          </div>
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
                <Card 
                  className={`text-center ${getRankBg(2)} border cursor-pointer hover:shadow-lg transition-shadow`}
                  onClick={() => setSelectedPlayer(filteredLeaderboard[1])}
                >
                  <CardContent className="pt-6 pb-4">
                    <div className="relative inline-block">
                      <Avatar className="w-16 h-16 mx-auto border-4 border-gray-400">
                        <AvatarFallback className="bg-gradient-to-br from-gray-400 to-gray-500 text-white">
                          2
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2">{getRankIcon(2)}</div>
                    </div>
                    <p className="font-bold mt-3">{filteredLeaderboard[1]?.name}</p>
                    <p className="text-sm text-muted-foreground">Niveau {filteredLeaderboard[1]?.level}</p>
                    <p className="text-xl font-bold mt-2">{filteredLeaderboard[1]?.score.toLocaleString()}</p>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(filteredLeaderboard[1]?.name);
                      }}
                    >
                      <UserPlus className={`h-4 w-4 mr-1 ${following.has(filteredLeaderboard[1]?.name) ? 'text-primary' : ''}`} />
                      {following.has(filteredLeaderboard[1]?.name) ? 'Suivi' : 'Suivre'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* 1st Place */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
              >
                <Card 
                  className={`text-center ${getRankBg(1)} border relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow`}
                  onClick={() => setSelectedPlayer(filteredLeaderboard[0])}
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`} />
                  <CardContent className="pt-6 pb-4">
                    <div className="relative inline-block">
                      <Avatar className="w-20 h-20 mx-auto border-4 border-amber-500">
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white text-xl">
                          1
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-3 -right-3">{getRankIcon(1)}</div>
                    </div>
                    <p className="font-bold mt-3 text-lg">{filteredLeaderboard[0]?.name}</p>
                    <p className="text-sm text-muted-foreground">Niveau {filteredLeaderboard[0]?.level}</p>
                    <div className="flex justify-center gap-1 mt-2">
                      {filteredLeaderboard[0]?.badges.map((badge, i) => (
                        <span key={i} className="text-lg">{badge}</span>
                      ))}
                    </div>
                    <p className="text-2xl font-bold mt-2 bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
                      {filteredLeaderboard[0]?.score.toLocaleString()}
                    </p>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(filteredLeaderboard[0]?.name);
                      }}
                    >
                      <UserPlus className={`h-4 w-4 mr-1 ${following.has(filteredLeaderboard[0]?.name) ? 'text-primary' : ''}`} />
                      {following.has(filteredLeaderboard[0]?.name) ? 'Suivi' : 'Suivre'}
                    </Button>
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
                <Card 
                  className={`text-center ${getRankBg(3)} border cursor-pointer hover:shadow-lg transition-shadow`}
                  onClick={() => setSelectedPlayer(filteredLeaderboard[2])}
                >
                  <CardContent className="pt-6 pb-4">
                    <div className="relative inline-block">
                      <Avatar className="w-14 h-14 mx-auto border-4 border-amber-700">
                        <AvatarFallback className="bg-gradient-to-br from-amber-700 to-amber-800 text-white">
                          3
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2">{getRankIcon(3)}</div>
                    </div>
                    <p className="font-bold mt-3">{filteredLeaderboard[2]?.name}</p>
                    <p className="text-sm text-muted-foreground">Niveau {filteredLeaderboard[2]?.level}</p>
                    <p className="text-xl font-bold mt-2">{filteredLeaderboard[2]?.score.toLocaleString()}</p>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFollow(filteredLeaderboard[2]?.name);
                      }}
                    >
                      <UserPlus className={`h-4 w-4 mr-1 ${following.has(filteredLeaderboard[2]?.name) ? 'text-primary' : ''}`} />
                      {following.has(filteredLeaderboard[2]?.name) ? 'Suivi' : 'Suivre'}
                    </Button>
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
                  {searchQuery && (
                    <Badge variant="secondary" className="ml-2">
                      {filteredLeaderboard.length} résultats
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {filteredLeaderboard.slice(3).map((entry, index) => (
                      <motion.div
                        key={entry.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: 0.05 * index }}
                        className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                        onClick={() => setSelectedPlayer(entry)}
                      >
                        <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                          {entry.rank}
                        </span>
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{entry.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{entry.name}</p>
                            {following.has(entry.name) && (
                              <Badge variant="outline" className="text-xs">Suivi</Badge>
                            )}
                          </div>
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
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFollow(entry.name);
                                }}
                              >
                                <UserPlus className={`h-4 w-4 ${following.has(entry.name) ? 'text-primary' : ''}`} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>{following.has(entry.name) ? 'Ne plus suivre' : 'Suivre'}</TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  shareRanking(entry);
                                }}
                              >
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Partager</TooltipContent>
                          </Tooltip>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                
                {filteredLeaderboard.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-10 w-10 mx-auto mb-3 opacity-50" />
                    <p>Aucun joueur trouvé</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Player Profile Dialog */}
        <Dialog open={!!selectedPlayer} onOpenChange={() => setSelectedPlayer(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Profil du joueur</DialogTitle>
            </DialogHeader>
            {selectedPlayer && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-xl">{selectedPlayer.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedPlayer.name}</h3>
                    <p className="text-muted-foreground">Rang #{selectedPlayer.rank}</p>
                    <div className="flex gap-1 mt-1">
                      {selectedPlayer.badges.map((badge, i) => (
                        <span key={i} className="text-lg">{badge}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-primary">{selectedPlayer.level}</p>
                    <p className="text-xs text-muted-foreground">Niveau</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-amber-500">{selectedPlayer.score.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold">{selectedPlayer.totalTrades || 0}</p>
                    <p className="text-xs text-muted-foreground">Transactions</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-emerald-500">{selectedPlayer.winRate || 0}%</p>
                    <p className="text-xs text-muted-foreground">Taux de réussite</p>
                  </div>
                </div>

                {selectedPlayer.joinDate && (
                  <p className="text-sm text-muted-foreground text-center">
                    Membre depuis {new Date(selectedPlayer.joinDate).toLocaleDateString('fr-FR')}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => toggleFollow(selectedPlayer.name)}
                  >
                    <UserPlus className={`h-4 w-4 mr-2 ${following.has(selectedPlayer.name) ? 'text-primary' : ''}`} />
                    {following.has(selectedPlayer.name) ? 'Ne plus suivre' : 'Suivre'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => shareRanking(selectedPlayer)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default ExchangeLeaderboard;
