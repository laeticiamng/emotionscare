// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, ChevronDown, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { LeaderboardEntry } from '@/store/gamification.store';
import { FixedSizeList as List } from 'react-window';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Trophy className="w-4 h-4 text-yellow-500" />;
    case 2: return <Medal className="w-4 h-4 text-gray-400" />;
    case 3: return <Award className="w-4 h-4 text-amber-600" />;
    default: return null;
  }
};

const getRankColor = (rank: number) => {
  if (rank === 1) return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
  if (rank === 2) return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
  if (rank === 3) return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
  return '';
};

interface LeaderboardRowProps {
  index: number;
  style: React.CSSProperties;
  data: LeaderboardEntry[];
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ index, style, data }) => {
  const entry = data[index];
  if (!entry) return null;

  const rankIcon = getRankIcon(entry.rank);
  const rankColor = getRankColor(entry.rank);

  return (
    <div style={style}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`
          flex items-center gap-4 p-3 rounded-lg border transition-colors
          ${entry.me ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'}
          ${rankColor}
        `}
        role="row"
        tabIndex={0}
        aria-label={`Rang ${entry.rank}, ${entry.display_name}, ${entry.tier_label || 'Aucun rang'}`}
      >
        {/* Rank */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/30">
          {rankIcon || (
            <span className="text-sm font-bold">
              {entry.rank}
            </span>
          )}
        </div>

        {/* Avatar */}
        <Avatar className="w-10 h-10">
          <AvatarImage src={entry.avatar_url} alt={`Avatar de ${entry.display_name}`} />
          <AvatarFallback>
            {entry.display_name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-medium">
              {entry.display_name}
              {entry.me && (
                <Badge variant="default" className="ml-2 text-xs">
                  Toi
                </Badge>
              )}
            </p>
          </div>
          
          {entry.tier_label && (
            <p className="text-xs text-muted-foreground">
              {entry.tier_label}
            </p>
          )}
        </div>

        {/* Badges */}
        {entry.badges && entry.badges.length > 0 && (
          <div className="flex items-center gap-1">
            {entry.badges.slice(0, 3).map((badge, idx) => (
              <div
                key={badge}
                className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                title={`Badge ${badge}`}
              >
                <Award className="w-3 h-3 text-primary" />
              </div>
            ))}
            {entry.badges.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{entry.badges.length - 3}
              </Badge>
            )}
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
  hasMore
}) => {
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
          <CardTitle>Classement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Classement
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucun participant pour cette période</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Use virtualization for long lists (>50 entries) */}
            {entries.length > 50 ? (
              <div style={{ height: '400px' }}>
                <List
                  height={400}
                  itemCount={entries.length}
                  itemSize={80}
                  itemData={entries}
                  role="table"
                  aria-label="Classement des utilisateurs"
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
                {entries.map((entry, index) => (
                  <LeaderboardRow 
                    key={entry.rank}
                    index={index}
                    style={{}}
                    data={[entry]}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};