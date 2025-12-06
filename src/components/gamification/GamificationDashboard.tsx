
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Target, Gift, Zap, Medal, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  maxProgress: number;
  category: 'daily' | 'weekly' | 'special';
  difficulty: 'facile' | 'moyen' | 'difficile';
  completed: boolean;
  deadline?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserStats {
  totalPoints: number;
  level: number;
  rank: string;
  streak: number;
  completedChallenges: number;
  achievements: number;
}

const GamificationDashboard: React.FC = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 1250,
    level: 8,
    rank: 'Explorateur Émotionnel',
    streak: 5,
    completedChallenges: 23,
    achievements: 12
  });

  const [challenges, setChallenges] = useState<Challenge[]>([
    {
      id: '1',
      title: 'Scanner quotidien',
      description: 'Effectuez un scan émotionnel aujourd\'hui',
      points: 50,
      progress: 0,
      maxProgress: 1,
      category: 'daily',
      difficulty: 'facile',
      completed: false
    },
    {
      id: '2',
      title: 'Méditation guidée',
      description: 'Complétez 3 sessions de méditation cette semaine',
      points: 150,
      progress: 1,
      maxProgress: 3,
      category: 'weekly',
      difficulty: 'moyen',
      completed: false,
      deadline: '2025-06-29'
    },
    {
      id: '3',
      title: 'Journal intime',
      description: 'Écrivez dans votre journal 7 jours consécutifs',
      points: 200,
      progress: 5,
      maxProgress: 7,
      category: 'special',
      difficulty: 'difficile',
      completed: false
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Premier Pas',
      description: 'Première connexion à l\'application',
      icon: <Star className="h-6 w-6" />,
      points: 50,
      unlocked: true,
      unlockedAt: '2025-06-20',
      rarity: 'common'
    },
    {
      id: '2',
      title: 'Régularité',
      description: '7 jours de connexion consécutifs',
      icon: <Zap className="h-6 w-6" />,
      points: 100,
      unlocked: true,
      unlockedAt: '2025-06-21',
      rarity: 'rare'
    },
    {
      id: '3',
      title: 'Maître Zen',
      description: '50 sessions de méditation complétées',
      icon: <Crown className="h-6 w-6" />,
      points: 500,
      unlocked: false,
      rarity: 'legendary'
    }
  ]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-500';
      case 'moyen': return 'bg-yellow-500';
      case 'difficile': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-yellow-400';
      default: return 'border-gray-400';
    }
  };

  const calculateLevelProgress = () => {
    const currentLevelPoints = userStats.level * 200;
    const nextLevelPoints = (userStats.level + 1) * 200;
    const progress = ((userStats.totalPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{userStats.totalPoints}</p>
                <p className="text-sm text-muted-foreground">Points totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">Niveau {userStats.level}</p>
                <p className="text-sm text-muted-foreground">{userStats.rank}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{userStats.streak}</p>
                <p className="text-sm text-muted-foreground">Jours consécutifs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Medal className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{userStats.achievements}</p>
                <p className="text-sm text-muted-foreground">Succès débloqués</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Progression du niveau</h3>
              <span className="text-sm text-muted-foreground">
                Niveau {userStats.level} → {userStats.level + 1}
              </span>
            </div>
            <Progress value={calculateLevelProgress()} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {((userStats.level + 1) * 200) - userStats.totalPoints} points pour le prochain niveau
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="challenges" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges">Défis</TabsTrigger>
          <TabsTrigger value="achievements">Succès</TabsTrigger>
          <TabsTrigger value="leaderboard">Classement</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid gap-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{challenge.title}</h3>
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        <Badge variant="outline">
                          {challenge.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {challenge.description}
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span>{challenge.progress}/{challenge.maxProgress}</span>
                        </div>
                        <Progress 
                          value={(challenge.progress / challenge.maxProgress) * 100} 
                          className="h-2" 
                        />
                      </div>
                      {challenge.deadline && (
                        <p className="text-xs text-muted-foreground">
                          Échéance: {new Date(challenge.deadline).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Trophy className="h-4 w-4" />
                        <span className="font-semibold">{challenge.points}</span>
                      </div>
                      {challenge.completed ? (
                        <Badge className="bg-green-500 mt-2">Terminé</Badge>
                      ) : (
                        <Button size="sm" className="mt-2">
                          Continuer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`${getRarityColor(achievement.rarity)} border-2 ${
                  achievement.unlocked ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <CardContent className="p-4 text-center">
                  <div className={`mx-auto mb-3 ${achievement.unlocked ? 'text-primary' : 'text-gray-400'}`}>
                    {achievement.icon}
                  </div>
                  <h3 className="font-semibold mb-1">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-yellow-600 mb-2">
                    <Trophy className="h-4 w-4" />
                    <span className="font-semibold">{achievement.points}</span>
                  </div>
                  <Badge variant="outline" className={`capitalize ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </Badge>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Débloqué le {new Date(achievement.unlockedAt).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Classement {userMode === 'b2b_admin' || userMode === 'b2b_user' ? 'Équipe' : 'Global'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: user?.email || 'Vous', points: userStats.totalPoints, isCurrentUser: true },
                  { rank: 2, name: 'Sophie M.', points: 1180, isCurrentUser: false },
                  { rank: 3, name: 'Thomas L.', points: 1050, isCurrentUser: false },
                  { rank: 4, name: 'Marie D.', points: 980, isCurrentUser: false },
                  { rank: 5, name: 'Pierre K.', points: 920, isCurrentUser: false }
                ].map((entry) => (
                  <div 
                    key={entry.rank} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-white' :
                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                        entry.rank === 3 ? 'bg-orange-600 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {entry.rank}
                      </div>
                      <span className={entry.isCurrentUser ? 'font-semibold' : ''}>
                        {entry.name}
                      </span>
                      {entry.isCurrentUser && (
                        <Badge variant="outline">Vous</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Trophy className="h-4 w-4" />
                      <span className="font-semibold">{entry.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;
