import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  Brain, 
  Heart, 
  Dumbbell,
  Sparkles
} from 'lucide-react';

interface GritAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'streak' | 'completion' | 'score' | 'time' | 'category';
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  reward: {
    xp: number;
    features?: string[];
  };
}

interface GritStats {
  totalXp: number;
  currentLevel: {
    id: string;
    name: string;
    minXp: number;
    maxXp: number;
    color: string;
    icon: string;
    benefits: string[];
  };
  nextLevel: {
    id: string;
    name: string;
    minXp: number;
  };
  completedChallenges: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  totalSessionTime: number;
  categoriesProgress: {
    mental: number;
    physical: number;
    emotional: number;
    spiritual: number;
  };
  achievements: GritAchievement[];
}

interface ProgressStatsProps {
  stats: GritStats;
}

const categoryIcons = {
  mental: Brain,
  physical: Dumbbell,
  emotional: Heart,
  spiritual: Sparkles
};

const categoryColors = {
  mental: 'text-blue-500',
  physical: 'text-green-500',
  emotional: 'text-pink-500',
  spiritual: 'text-purple-500'
};

const ProgressStats: React.FC<ProgressStatsProps> = ({ stats }) => {
  const levelProgress = ((stats.totalXp - stats.currentLevel.minXp) / 
    (stats.nextLevel.minXp - stats.currentLevel.minXp)) * 100;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Level Progress */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Progression de Niveau
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{stats.currentLevel.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold">{stats.currentLevel.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {stats.totalXp} / {stats.nextLevel.minXp} XP
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-sm">
                  Niveau {stats.currentLevel.id}
                </Badge>
              </div>
              
              <Progress value={levelProgress} className="h-3" />
              
              <div className="text-center text-sm text-muted-foreground">
                {stats.nextLevel.minXp - stats.totalXp} XP pour atteindre {stats.nextLevel.name}
              </div>

              {/* Level Benefits */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Avantages actuels:</h4>
                <div className="flex flex-wrap gap-2">
                  {stats.currentLevel.benefits.map((benefit, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.completedChallenges}</div>
                <div className="text-xs text-muted-foreground">Défis Complétés</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.currentStreak}</div>
                <div className="text-xs text-muted-foreground">Série Actuelle</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{stats.averageScore}%</div>
                <div className="text-xs text-muted-foreground">Score Moyen</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{formatTime(stats.totalSessionTime)}</div>
                <div className="text-xs text-muted-foreground">Temps Total</div>
              </CardContent>
            </Card>
          </div>

          {/* Streaks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Historique des Séries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Série actuelle</span>
                  <Badge className="bg-orange-500">{stats.currentStreak} jours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Meilleure série</span>
                  <Badge variant="outline">{stats.longestStreak} jours</Badge>
                </div>
                <Progress value={(stats.currentStreak / stats.longestStreak) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(stats.categoriesProgress).map(([category, progress]) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
              const colorClass = categoryColors[category as keyof typeof categoryColors];
              
              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 capitalize">
                      <IconComponent className={`h-5 w-5 ${colorClass}`} />
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Évolution de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Graphiques de tendances en développement</p>
                <p className="text-sm">Complétez des sessions pour visualiser votre progression</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressStats;