import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Trophy, Medal, Award, ChevronDown, AlertCircle, RefreshCw, 
  Search, Filter, TrendingUp, TrendingDown, Minus, Crown, Flame,
  Calendar, Users, Star, Sparkles, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeaderboardEntry } from '@/store/gamification.store';
import { FixedSizeList as List } from 'react-window';

type TimePeriod = 'week' | 'month' | 'allTime';
type Category = 'all' | 'streak' | 'points' | 'badges';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
  currentUserId?: string;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="w-5 h-5 text-yellow-500 fill-yellow-500" />;
    case 2: return <Medal className="w-5 h-5 text-gray-400" />;
    case 3: return <Award className="w-5 h-5 text-amber-600" />;
    default: return null;
  }
};

const getRankStyle = (rank: number) => {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
  if (rank === 2) return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
  if (rank === 3) return 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border-amber-600/30';
  return '';
};

const getRankChange = (change: number | undefined) => {
  if (!change || change === 0) return <Minus className="w-3 h-3 text-muted-foreground" />;
  if (change > 0) return (
    <span className="flex items-center text-green-500 text-xs">
      <TrendingUp className="w-3 h-3 mr-0.5" />+{change}
    </span>
  );
  return (
    <span className="flex items-center text-red-500 text-xs">
      <TrendingDown className="w-3 h-3 mr-0.5" />{change}
    </span>
  );
};

interface LeaderboardRowProps {
  index: number;
  style: React.CSSProperties;
  data: { entries: LeaderboardEntry[]; currentUserId?: string };
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ index, style, data }) => {
  const entry = data.entries[index];
  if (!entry) return null;

  const rankIcon = getRankIcon(entry.rank);
  const rankStyle = getRankStyle(entry.rank);
  const isCurrentUser = entry.me || entry.user_id === data.currentUserId;

  return (
    <div style={style} className="px-1">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: Math.min(index * 0.03, 0.3) }}
        className={`
          flex items-center gap-3 p-3 rounded-lg border transition-all
          ${isCurrentUser ? 'bg-primary/10 border-primary/30 shadow-sm' : 'hover:bg-muted/50'}
          ${rankStyle}
        `}
        role="row"
        tabIndex={0}
        aria-label={`Rang ${entry.rank}, ${entry.display_name}`}
      >
        {/* Rank */}
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
          entry.rank <= 3 ? 'bg-gradient-to-br from-primary/20 to-secondary/20' : 'bg-muted/50'
        }`}>
          {rankIcon || (
            <span className="text-sm font-bold text-muted-foreground">
              {entry.rank}
            </span>
          )}
        </div>

        {/* Rank change indicator */}
        <div className="w-8 flex justify-center">
          {getRankChange(entry.rankChange)}
        </div>

        {/* Avatar */}
        <div className="relative">
          <Avatar className="w-10 h-10">
            <AvatarImage src={entry.avatar_url} alt={entry.display_name} />
            <AvatarFallback>
              {entry.display_name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {entry.rank <= 3 && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-background rounded-full flex items-center justify-center">
              {entry.rank === 1 && <span className="text-xs">🥇</span>}
              {entry.rank === 2 && <span className="text-xs">🥈</span>}
              {entry.rank === 3 && <span className="text-xs">🥉</span>}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-medium truncate">
              {entry.display_name}
            </p>
            {isCurrentUser && (
              <Badge variant="default" className="text-xs px-1.5 py-0">
                Vous
              </Badge>
            )}
            {entry.streak && entry.streak >= 7 && (
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-orange-500 text-xs flex items-center">
                    <Flame className="w-3 h-3 mr-0.5" />{entry.streak}
                  </span>
                </TooltipTrigger>
                <TooltipContent>Série de {entry.streak} jours</TooltipContent>
              </Tooltip>
            )}
          </div>
          
          <div className="flex items-center gap-2 mt-0.5">
            {entry.tier_label && (
              <p className="text-xs text-muted-foreground">
                {entry.tier_label}
              </p>
            )}
            {entry.points && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0">
                {entry.points.toLocaleString()} pts
              </Badge>
            )}
          </div>
        </div>

        {/* Badges */}
        {entry.badges && entry.badges.length > 0 && (
          <div className="flex items-center gap-1">
            {entry.badges.slice(0, 3).map((badge, _idx) => (
              <Tooltip key={badge}>
                <TooltipTrigger>
                  <div
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                  >
                    <Award className="w-4 h-4 text-primary" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>{badge}</TooltipContent>
              </Tooltip>
            ))}
            {entry.badges.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{entry.badges.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Score highlight for top 3 */}
        {entry.rank <= 3 && entry.points && (
          <div className="text-right">
            <p className="text-lg font-bold">{entry.points.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">points</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  loading,
  error,
  onLoadMore,
  hasMore,
  currentUserId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('week');
  const [category, setCategory] = useState<Category>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and search
  const filteredEntries = useMemo(() => {
    let result = [...entries];
    
    // Search filter
    if (searchQuery) {
      result = result.filter(e => 
        e.display_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter (simulated - in real app would come from API)
    // This is just for UI demonstration

    return result;
  }, [entries, searchQuery, category]);

  // Find current user's position
  const currentUserEntry = entries.find(e => e.me || e.user_id === currentUserId);
  const currentUserRank = currentUserEntry?.rank;

  if (error) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
            <div>
              <h3 className="text-lg font-semibold">Classement indisponible</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
            <Button onClick={() => window.location.reload()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading && entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Classement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="w-10 h-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-24" />
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Classement
              {currentUserRank && (
                <Badge variant="outline" className="ml-2">
                  Vous êtes #{currentUserRank}
                </Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center gap-2">
              {/* Time period tabs */}
              <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as TimePeriod)}>
                <TabsList className="h-8">
                  <TabsTrigger value="week" className="text-xs px-2">
                    <Calendar className="w-3 h-3 mr-1" />
                    Semaine
                  </TabsTrigger>
                  <TabsTrigger value="month" className="text-xs px-2">Mois</TabsTrigger>
                  <TabsTrigger value="allTime" className="text-xs px-2">
                    <Star className="w-3 h-3 mr-1" />
                    Total
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-1"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap gap-3 pt-4">
                  <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un joueur..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-9"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                        onClick={() => setSearchQuery('')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                    <SelectTrigger className="w-[150px] h-9">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes catégories</SelectItem>
                      <SelectItem value="streak">🔥 Séries</SelectItem>
                      <SelectItem value="points">⭐ Points</SelectItem>
                      <SelectItem value="badges">🏆 Badges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>
        
        <CardContent>
          {filteredEntries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{searchQuery ? 'Aucun joueur trouvé' : 'Aucun participant pour cette période'}</p>
              {searchQuery && (
                <Button variant="link" size="sm" onClick={() => setSearchQuery('')}>
                  Effacer la recherche
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Top 3 highlight */}
              {!searchQuery && filteredEntries.length >= 3 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[1, 0, 2].map((podiumIndex) => {
                    const entry = filteredEntries[podiumIndex];
                    if (!entry) return null;
                    const isFirst = podiumIndex === 0;
                    return (
                      <motion.div
                        key={entry.rank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: podiumIndex * 0.1 }}
                        className={`text-center p-3 rounded-lg ${getRankStyle(entry.rank)} ${isFirst ? 'order-2' : podiumIndex === 1 ? 'order-1' : 'order-3'}`}
                      >
                        <Avatar className={`mx-auto ${isFirst ? 'w-14 h-14' : 'w-10 h-10'}`}>
                          <AvatarImage src={entry.avatar_url} />
                          <AvatarFallback>{entry.display_name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div className="mt-2">
                          {getRankIcon(entry.rank)}
                        </div>
                        <p className="font-medium text-sm truncate mt-1">{entry.display_name}</p>
                        {entry.points && (
                          <p className="text-xs text-muted-foreground">{entry.points.toLocaleString()} pts</p>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* List */}
              {filteredEntries.length > 50 ? (
                <div style={{ height: '400px' }}>
                  <List
                    height={400}
                    itemCount={filteredEntries.length}
                    itemSize={80}
                    itemData={{ entries: filteredEntries, currentUserId }}
                    width="100%"
                  >
                    {LeaderboardRow}
                  </List>
                </div>
              ) : (
                <div 
                  className="space-y-2"
                  role="table"
                  aria-label="Classement des utilisateurs"
                >
                  {filteredEntries.slice(searchQuery ? 0 : 3).map((entry, index) => (
                    <LeaderboardRow 
                      key={entry.rank}
                      index={searchQuery ? index : index + 3}
                      style={{}}
                      data={{ entries: [entry], currentUserId }}
                    />
                  ))}
                </div>
              )}

              {/* Load More */}
              {hasMore && onLoadMore && (
                <div className="text-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={onLoadMore}
                    disabled={loading}
                    className="w-full max-w-xs"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <ChevronDown className="w-4 h-4 mr-2" />
                    )}
                    Charger plus
                  </Button>
                </div>
              )}

              {/* Stats footer */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {entries.length} participants
                </span>
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Mis à jour en temps réel
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};
