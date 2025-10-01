// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  points: number;
  level: number;
  isCurrentUser: boolean;
}

interface LeaderboardWidgetProps {
  entries?: LeaderboardEntry[];
  title?: string;
  showCurrentUser?: boolean;
  maxEntries?: number;
}

const LeaderboardWidget: React.FC<LeaderboardWidgetProps> = ({
  entries = [],
  title = "Classement",
  showCurrentUser = true,
  maxEntries = 5
}) => {
  const { user } = useAuth();
  const { userMode } = useUserMode();

  // Mock data si aucune entrée fournie
  const defaultEntries: LeaderboardEntry[] = [
    { rank: 1, userId: '1', name: user?.email || 'Vous', points: 1250, level: 8, isCurrentUser: true },
    { rank: 2, userId: '2', name: 'Sophie M.', points: 1180, level: 7, isCurrentUser: false },
    { rank: 3, userId: '3', name: 'Thomas L.', points: 1050, level: 6, isCurrentUser: false },
    { rank: 4, userId: '4', name: 'Marie D.', points: 980, level: 6, isCurrentUser: false },
    { rank: 5, userId: '5', name: 'Pierre K.', points: 920, level: 5, isCurrentUser: false }
  ];

  const displayEntries = entries.length > 0 ? entries : defaultEntries;
  const limitedEntries = displayEntries.slice(0, maxEntries);

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
      case 1: return 'bg-yellow-500 text-white';
      case 2: return 'bg-gray-400 text-white';
      case 3: return 'bg-orange-600 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDisplayTitle = () => {
    if (userMode === 'b2b_admin' || userMode === 'b2b_user') {
      return `${title} Équipe`;
    }
    return `${title} Global`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          {getDisplayTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {limitedEntries.map((entry) => (
          <div 
            key={entry.userId}
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
                </div>
                <p className="text-xs text-muted-foreground">
                  Niveau {entry.level}
                </p>
              </div>
            </div>

            {/* Points */}
            <div className="text-right">
              <div className="flex items-center gap-1 text-yellow-600">
                <Trophy className="h-4 w-4" />
                <span className="font-semibold">{entry.points.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}

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
      </CardContent>
    </Card>
  );
};

export default LeaderboardWidget;
