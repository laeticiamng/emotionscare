import React, { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Trophy, Medal, Award, Crown, TrendingUp, TrendingDown, 
  Minus, Download, Share2, RefreshCw, Filter, ChevronUp, ChevronDown,
  Users, Calendar, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  points: number;
  level: number;
  rank: number;
  previousRank?: number;
  streak?: number;
  badges?: number;
  joinedAt?: Date;
}

interface LeaderboardCardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
  title?: string;
  showFilters?: boolean;
  showExport?: boolean;
}

type Period = 'week' | 'month' | 'all';
type Category = 'points' | 'streak' | 'badges';

const STORAGE_KEY = 'leaderboard-card-prefs';

const LeaderboardCard: React.FC<LeaderboardCardProps> = memo(({
  entries,
  currentUserId,
  title = "Classement de la Semaine",
  showFilters = true,
  showExport = true,
}) => {
  const { toast } = useToast();
  const [period, setPeriod] = useState<Period>('week');
  const [category, setCategory] = useState<Category>('points');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);

  // Load preferences
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setPeriod(parsed.period || 'week');
      setCategory(parsed.category || 'points');
      setViewCount(parsed.viewCount || 0);
    }
    
    // Increment view count
    const newCount = viewCount + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      period, category, viewCount: newCount
    }));
    setViewCount(newCount);
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      period, category, viewCount
    }));
  }, [period, category]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20 border-yellow-300/50";
      case 2: return "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950/20 dark:to-gray-900/20 border-gray-300/50";
      case 3: return "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20 border-amber-300/50";
      default: return "bg-muted/30 border-transparent";
    }
  };

  const getRankChange = (entry: LeaderboardEntry) => {
    if (!entry.previousRank) return null;
    const change = entry.previousRank - entry.rank;
    
    if (change > 0) {
      return (
        <div className="flex items-center gap-0.5 text-green-500 text-xs">
          <ChevronUp className="h-3 w-3" />
          <span>{change}</span>
        </div>
      );
    } else if (change < 0) {
      return (
        <div className="flex items-center gap-0.5 text-red-500 text-xs">
          <ChevronDown className="h-3 w-3" />
          <span>{Math.abs(change)}</span>
        </div>
      );
    }
    return (
      <div className="text-muted-foreground text-xs">
        <Minus className="h-3 w-3" />
      </div>
    );
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({ title: 'Classement actualisé', description: 'Les données sont à jour' });
  };

  const handleExport = () => {
    const data = entries.map(e => ({
      Rang: e.rank,
      Nom: e.name,
      Points: e.points,
      Niveau: e.level,
      Série: e.streak || 0,
      Badges: e.badges || 0,
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classement-${period}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Exporté !', description: 'Le classement a été téléchargé' });
  };

  const handleShare = async () => {
    const currentUser = entries.find(e => e.id === currentUserId);
    const text = currentUser
      ? `🏆 Je suis #${currentUser.rank} sur le classement EmotionsCare avec ${currentUser.points.toLocaleString()} points ! #BienEtre`
      : `🏆 Découvrez le classement EmotionsCare - ${entries[0]?.name || 'Top joueur'} est en tête avec ${entries[0]?.points.toLocaleString() || 0} points !`;
    
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // cancelled
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié !', description: 'Texte copié dans le presse-papier' });
    }
  };

  const getPeriodLabel = (p: Period) => {
    switch (p) {
      case 'week': return 'Cette semaine';
      case 'month': return 'Ce mois';
      case 'all': return 'Tout le temps';
    }
  };

  // Sort entries based on category
  const sortedEntries = [...entries].sort((a, b) => {
    switch (category) {
      case 'streak': return (b.streak || 0) - (a.streak || 0);
      case 'badges': return (b.badges || 0) - (a.badges || 0);
      default: return b.points - a.points;
    }
  }).map((e, i) => ({ ...e, rank: i + 1 }));

  const currentUserEntry = sortedEntries.find(e => e.id === currentUserId);
  const currentUserRank = currentUserEntry?.rank || null;

  return (
    <TooltipProvider>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              {title}
            </CardTitle>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Actualiser</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Partager</TooltipContent>
              </Tooltip>
              
              {showExport && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={handleExport}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Exporter CSV</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="flex gap-2 mt-3">
              <Select value={period} onValueChange={(v: Period) => setPeriod(v)}>
                <SelectTrigger className="w-[140px] h-8 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="all">Tout le temps</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={category} onValueChange={(v: Category) => setCategory(v)}>
                <SelectTrigger className="w-[120px] h-8 text-xs">
                  <Filter className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="points">Points</SelectItem>
                  <SelectItem value="streak">Série</SelectItem>
                  <SelectItem value="badges">Badges</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Current user position */}
          {currentUserRank && currentUserRank > 3 && (
            <div className="mt-3 p-2 bg-primary/5 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm">Votre position</span>
              </div>
              <Badge variant="outline" className="bg-primary/10">
                #{currentUserRank} sur {sortedEntries.length}
              </Badge>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="pt-2">
          <div className="space-y-2">
            <AnimatePresence>
              {sortedEntries.slice(0, 10).map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <div
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer',
                      getRankStyle(entry.rank),
                      entry.id === currentUserId && 'ring-2 ring-primary ring-offset-1',
                      expandedEntry === entry.id && 'shadow-md'
                    )}
                    onClick={() => setExpandedEntry(
                      expandedEntry === entry.id ? null : entry.id
                    )}
                  >
                    <div className="flex items-center justify-center w-10">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <Avatar className="h-10 w-10 border-2 border-background">
                      <AvatarImage src={entry.avatar} />
                      <AvatarFallback className="bg-primary/10">
                        {entry.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{entry.name}</span>
                        {entry.id === currentUserId && (
                          <Badge variant="secondary" className="text-xs h-5">Vous</Badge>
                        )}
                        {entry.streak && entry.streak >= 7 && (
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center gap-0.5 text-orange-500">
                                <TrendingUp className="h-3 w-3" />
                                <span className="text-xs font-bold">{entry.streak}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Série de {entry.streak} jours</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Niveau {entry.level}</span>
                        {entry.badges && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Star className="h-3 w-3" />
                              {entry.badges}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right flex items-center gap-2">
                      {getRankChange(entry)}
                      <div>
                        <div className="font-bold text-primary">
                          {entry.points.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {expandedEntry === entry.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-3 bg-muted/30 rounded-b-lg mt-1 grid grid-cols-3 gap-2 text-center">
                          <div>
                            <div className="text-lg font-bold text-primary">
                              {entry.points.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">Points total</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">
                              {entry.streak || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">Jours série</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold">
                              {entry.badges || 0}
                            </div>
                            <div className="text-xs text-muted-foreground">Badges</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {sortedEntries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-2 opacity-20" />
              <p>Aucun classement disponible</p>
            </div>
          )}

          {/* Stats footer */}
          {sortedEntries.length > 0 && (
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
              <span>{sortedEntries.length} participants</span>
              <span>{getPeriodLabel(period)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
});

LeaderboardCard.displayName = 'LeaderboardCard';

export default LeaderboardCard;
