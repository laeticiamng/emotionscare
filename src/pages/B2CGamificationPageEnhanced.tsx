import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Star, 
  Target, 
  Flame, 
  Calendar, 
  TrendingUp,
  Award,
  Zap,
  Heart,
  Brain
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'scan' | 'mood' | 'social' | 'milestone';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  rewards: {
    xp: number;
    gems?: number;
  };
}

interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  totalScans: number;
  streakDays: number;
  totalGems: number;
  rank: string;
  weeklyGoal: number;
  weeklyProgress: number;
}

const B2CGamificationPageEnhanced: React.FC = () => {
  const [userStats, setUserStats] = useState<UserStats>({
    level: 12,
    xp: 2340,
    xpToNext: 2500,
    totalScans: 156,
    streakDays: 7,
    totalGems: 450,
    rank: 'Explorateur Émotionnel',
    weeklyGoal: 10,
    weeklyProgress: 7
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: 'first-scan',
      title: 'Premier Pas',
      description: 'Effectuer votre premier scan émotionnel',
      icon: '🎯',
      category: 'milestone',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      rarity: 'common',
      rewards: { xp: 50 }
    },
    {
      id: 'streak-7',
      title: 'Semaine Parfaite',
      description: 'Maintenir une série de 7 jours',
      icon: '🔥',
      category: 'streak',
      progress: 7,
      maxProgress: 7,
      unlocked: true,
      rarity: 'rare',
      rewards: { xp: 200, gems: 50 }
    },
    {
      id: 'mood-master',
      title: 'Maître des Émotions',
      description: 'Identifier 50 émotions différentes',
      icon: '🧠',
      category: 'mood',
      progress: 34,
      maxProgress: 50,
      unlocked: false,
      rarity: 'epic',
      rewards: { xp: 500, gems: 100 }
    },
    {
      id: 'scan-100',
      title: 'Centurion',
      description: 'Effectuer 100 scans émotionnels',
      icon: '⭐',
      category: 'scan',
      progress: 156,
      maxProgress: 100,
      unlocked: true,
      rarity: 'rare',
      rewards: { xp: 300, gems: 75 }
    },
    {
      id: 'social-butterfly',
      title: 'Papillon Social',
      description: 'Partager 25 insights avec la communauté',
      icon: '🦋',
      category: 'social',
      progress: 12,
      maxProgress: 25,
      unlocked: false,
      rarity: 'epic',
      rewards: { xp: 400, gems: 80 }
    },
    {
      id: 'legend',
      title: 'Légende Émotionnelle',
      description: 'Atteindre le niveau 25',
      icon: '👑',
      category: 'milestone',
      progress: 12,
      maxProgress: 25,
      unlocked: false,
      rarity: 'legendary',
      rewards: { xp: 1000, gems: 250 }
    }
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'streak': return <Flame className="w-4 h-4" />;
      case 'scan': return <Target className="w-4 h-4" />;
      case 'mood': return <Heart className="w-4 h-4" />;
      case 'social': return <Star className="w-4 h-4" />;
      case 'milestone': return <Trophy className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl" data-testid="page-root">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-500" />
          Centre de Récompenses
        </h1>
        <p className="text-muted-foreground">
          Suivez vos progrès et débloquez de nouveaux achievements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profil utilisateur */}
        <div className="lg:col-span-1 space-y-6">
          {/* Niveau et XP */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Niveau {userStats.level}</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  {userStats.rank}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-2xl font-bold">
                    {userStats.level}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>{userStats.xp} / {userStats.xpToNext} XP</span>
                </div>
                <Progress value={(userStats.xp / userStats.xpToNext) * 100} />
              </div>

              <div className="flex items-center justify-center gap-4 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userStats.totalGems}</div>
                  <div className="text-xs text-muted-foreground">Gemmes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 flex items-center justify-center gap-1">
                    <Flame className="w-5 h-5" />
                    {userStats.streakDays}
                  </div>
                  <div className="text-xs text-muted-foreground">Série</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Objectif hebdomadaire */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Objectif Hebdomadaire
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Scans cette semaine</span>
                  <span className="font-semibold">{userStats.weeklyProgress}/{userStats.weeklyGoal}</span>
                </div>
                <Progress value={(userStats.weeklyProgress / userStats.weeklyGoal) * 100} />
                <p className="text-xs text-muted-foreground">
                  Plus que {userStats.weeklyGoal - userStats.weeklyProgress} scans pour atteindre votre objectif !
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Statistiques rapides */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Scans totaux</span>
                <span className="font-semibold">{userStats.totalScans}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Meilleure série</span>
                <span className="font-semibold">14 jours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Rang global</span>
                <span className="font-semibold">#342</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Achievements
                </span>
                <Badge variant="secondary">
                  {achievements.filter(a => a.unlocked).length}/{achievements.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <Card 
                    key={achievement.id}
                    className={`transition-all ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-background to-muted/30 shadow-sm' 
                        : 'opacity-75 bg-muted/30'
                    } ${getRarityColor(achievement.rarity)} border`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center text-2xl
                          ${achievement.unlocked ? 'bg-white shadow-sm' : 'bg-muted grayscale'}
                        `}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-sm ${
                              achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {achievement.title}
                            </h3>
                            {getCategoryIcon(achievement.category)}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2 leading-tight">
                            {achievement.description}
                          </p>
                          
                          {!achievement.unlocked && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progression</span>
                                <span>{achievement.progress}/{achievement.maxProgress}</span>
                              </div>
                              <Progress 
                                value={(achievement.progress / achievement.maxProgress) * 100} 
                                className="h-1"
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getRarityColor(achievement.rarity)}`}
                            >
                              {achievement.rarity}
                            </Badge>
                            <div className="flex items-center gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <Zap className="w-3 h-3 text-blue-500" />
                                <span>{achievement.rewards.xp}</span>
                              </div>
                              {achievement.rewards.gems && (
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
                                  <span>{achievement.rewards.gems}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default B2CGamificationPageEnhanced;