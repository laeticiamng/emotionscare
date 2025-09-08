import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Trophy, 
  Medal, 
  Crown, 
  TrendingUp, 
  Calendar,
  Users,
  Target,
  Flame,
  Star
} from 'lucide-react';

interface LeaderboardEntry {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  xp: number;
  streakDays: number;
  totalScans: number;
  weeklyScans: number;
  rank: number;
  previousRank?: number;
  badges: string[];
  isCurrentUser?: boolean;
}

interface LeaderboardCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  metric: keyof LeaderboardEntry;
}

const B2CLeaderboardPageEnhanced: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('xp');
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');

  const categories: LeaderboardCategory[] = [
    {
      id: 'xp',
      name: 'Points d\'Expérience',
      description: 'Classement par XP total',
      icon: <Star className="w-4 h-4" />,
      metric: 'xp'
    },
    {
      id: 'streak',
      name: 'Séries',
      description: 'Plus longues séries actives',
      icon: <Flame className="w-4 h-4" />,
      metric: 'streakDays'
    },
    {
      id: 'scans',
      name: 'Scans Totaux',
      description: 'Nombre total de scans',
      icon: <Target className="w-4 h-4" />,
      metric: 'totalScans'
    },
    {
      id: 'weekly',
      name: 'Activité Hebdomadaire',
      description: 'Scans cette semaine',
      icon: <Calendar className="w-4 h-4" />,
      metric: 'weeklyScans'
    }
  ];

  const leaderboardData: LeaderboardEntry[] = [
    {
      id: '1',
      username: 'Emma.Mindful',
      avatar: '/api/placeholder/40/40',
      level: 28,
      xp: 8420,
      streakDays: 45,
      totalScans: 342,
      weeklyScans: 28,
      rank: 1,
      previousRank: 2,
      badges: ['🏆', '🔥', '⭐'],
      isCurrentUser: false
    },
    {
      id: '2',
      username: 'Alex.Zen',
      avatar: '/api/placeholder/40/40',
      level: 25,
      xp: 7890,
      streakDays: 38,
      totalScans: 298,
      weeklyScans: 24,
      rank: 2,
      previousRank: 1,
      badges: ['🧠', '💎'],
      isCurrentUser: false
    },
    {
      id: '3',
      username: 'Sophie.Flow',
      avatar: '/api/placeholder/40/40',
      level: 24,
      xp: 7234,
      streakDays: 32,
      totalScans: 276,
      weeklyScans: 22,
      rank: 3,
      previousRank: 4,
      badges: ['🎯', '🌟'],
      isCurrentUser: false
    },
    {
      id: '4',
      username: 'MaxMood',
      avatar: '/api/placeholder/40/40',
      level: 22,
      xp: 6890,
      streakDays: 28,
      totalScans: 245,
      weeklyScans: 20,
      rank: 4,
      previousRank: 3,
      badges: ['🚀'],
      isCurrentUser: true
    },
    {
      id: '5',
      username: 'Luna.Calm',
      avatar: '/api/placeholder/40/40',
      level: 21,
      xp: 6456,
      streakDays: 25,
      totalScans: 223,
      weeklyScans: 18,
      rank: 5,
      previousRank: 5,
      badges: ['🦋'],
      isCurrentUser: false
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <div className="w-5 h-5 flex items-center justify-center text-sm font-bold">{rank}</div>;
    }
  };

  const getRankChange = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = previous - current;
    if (change > 0) {
      return <div className="flex items-center text-green-600 text-xs">
        <TrendingUp className="w-3 h-3" />
        +{change}
      </div>;
    } else if (change < 0) {
      return <div className="flex items-center text-red-600 text-xs">
        <TrendingUp className="w-3 h-3 rotate-180" />
        {change}
      </div>;
    }
    return <div className="text-xs text-muted-foreground">-</div>;
  };

  const getMetricValue = (entry: LeaderboardEntry, metric: keyof LeaderboardEntry) => {
    const value = entry[metric];
    if (typeof value === 'number') {
      if (metric === 'xp') {
        return `${value.toLocaleString()} XP`;
      } else if (metric === 'streakDays') {
        return `${value} jours`;
      } else {
        return value.toString();
      }
    }
    return value?.toString() || '';
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);
  const sortedData = [...leaderboardData].sort((a, b) => {
    const aValue = a[currentCategory?.metric || 'xp'] as number;
    const bValue = b[currentCategory?.metric || 'xp'] as number;
    return bValue - aValue;
  });

  return (
    <div className="container mx-auto p-6 max-w-4xl" data-testid="page-root">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Classements
        </h1>
        <p className="text-muted-foreground">
          Comparez vos progrès avec la communauté
        </p>
      </div>

      {/* Filtres de catégorie */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              {category.icon}
              {category.name}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2">
          {(['weekly', 'monthly', 'allTime'] as const).map((period) => (
            <Button
              key={period}
              variant={timeFrame === period ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTimeFrame(period)}
            >
              {period === 'weekly' && 'Cette semaine'}
              {period === 'monthly' && 'Ce mois'}
              {period === 'allTime' && 'Tous temps'}
            </Button>
          ))}
        </div>
      </div>

      {/* Podium Top 3 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-center items-end gap-8 mb-4">
            {/* 2ème place */}
            <div className="text-center">
              <div className="relative mb-2">
                <Avatar className="w-16 h-16 border-4 border-gray-300">
                  <AvatarImage src={sortedData[1]?.avatar} />
                  <AvatarFallback>{sortedData[1]?.username.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-gray-300 rounded-full p-1">
                  <Medal className="w-4 h-4 text-gray-600" />
                </div>
              </div>
              <div className="text-sm font-semibold">{sortedData[1]?.username}</div>
              <div className="text-xs text-muted-foreground">
                {getMetricValue(sortedData[1], currentCategory?.metric || 'xp')}
              </div>
            </div>

            {/* 1ère place */}
            <div className="text-center">
              <div className="relative mb-2">
                <Avatar className="w-20 h-20 border-4 border-yellow-400">
                  <AvatarImage src={sortedData[0]?.avatar} />
                  <AvatarFallback>{sortedData[0]?.username.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-3 -right-2 bg-yellow-400 rounded-full p-1">
                  <Crown className="w-5 h-5 text-yellow-700" />
                </div>
              </div>
              <div className="text-base font-bold">{sortedData[0]?.username}</div>
              <div className="text-sm text-muted-foreground">
                {getMetricValue(sortedData[0], currentCategory?.metric || 'xp')}
              </div>
              <div className="flex justify-center gap-1 mt-1">
                {sortedData[0]?.badges.map((badge, index) => (
                  <span key={index} className="text-sm">{badge}</span>
                ))}
              </div>
            </div>

            {/* 3ème place */}
            <div className="text-center">
              <div className="relative mb-2">
                <Avatar className="w-16 h-16 border-4 border-amber-600">
                  <AvatarImage src={sortedData[2]?.avatar} />
                  <AvatarFallback>{sortedData[2]?.username.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="absolute -top-2 -right-2 bg-amber-600 rounded-full p-1">
                  <Medal className="w-4 h-4 text-amber-200" />
                </div>
              </div>
              <div className="text-sm font-semibold">{sortedData[2]?.username}</div>
              <div className="text-xs text-muted-foreground">
                {getMetricValue(sortedData[2], currentCategory?.metric || 'xp')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classement complet */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {currentCategory?.name}
            </span>
            <Badge variant="secondary">
              {timeFrame === 'weekly' && 'Hebdomadaire'}
              {timeFrame === 'monthly' && 'Mensuel'}
              {timeFrame === 'allTime' && 'Global'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedData.map((entry, index) => (
              <div
                key={entry.id}
                className={`
                  flex items-center gap-4 p-3 rounded-lg transition-colors
                  ${entry.isCurrentUser 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'bg-muted/50 hover:bg-muted'
                  }
                `}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(index + 1)}
                  </div>
                  
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={entry.avatar} />
                    <AvatarFallback>{entry.username.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${entry.isCurrentUser ? 'text-primary' : ''}`}>
                        {entry.username}
                      </span>
                      {entry.isCurrentUser && <Badge variant="secondary" className="text-xs">Vous</Badge>}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Niveau {entry.level}</span>
                      <span>•</span>
                      <span>{getMetricValue(entry, currentCategory?.metric || 'xp')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {entry.badges.slice(0, 3).map((badge, index) => (
                      <span key={index} className="text-lg">{badge}</span>
                    ))}
                  </div>
                  
                  <div className="text-right">
                    {getRankChange(index + 1, entry.previousRank)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CLeaderboardPageEnhanced;