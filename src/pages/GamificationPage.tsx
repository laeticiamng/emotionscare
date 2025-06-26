
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Target, 
  Flame, 
  Award, 
  Medal, 
  Zap, 
  TrendingUp,
  Calendar,
  Users,
  Gift,
  Crown,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const GamificationPage: React.FC = () => {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  
  const userStats = {
    level: 12,
    xp: 2450,
    xpToNext: 2800,
    totalPoints: 15670,
    streakDays: 7,
    completedChallenges: 23,
    badges: 8
  };

  const badges = [
    { 
      id: 1, 
      name: 'Premier Scan', 
      description: 'Complétez votre premier scan émotionnel',
      icon: Star,
      earned: true,
      rarity: 'common'
    },
    { 
      id: 2, 
      name: 'Méditateur', 
      description: '7 jours consécutifs de méditation',
      icon: Sparkles,
      earned: true,
      rarity: 'rare'
    },
    { 
      id: 3, 
      name: 'Coach Actif', 
      description: '50 conversations avec le coach IA',
      icon: Crown,
      earned: true,
      rarity: 'epic'
    },
    { 
      id: 4, 
      name: 'Musicothérapeute', 
      description: 'Écoutez 100 heures de musicothérapie',
      icon: Award,
      earned: false,
      rarity: 'legendary'
    }
  ];

  const challenges = [
    {
      id: 1,
      title: 'Semaine de Sérénité',
      description: 'Complétez un scan émotionnel chaque jour pendant 7 jours',
      progress: 5,
      total: 7,
      reward: 500,
      type: 'daily',
      difficulty: 'Facile',
      timeLeft: '2 jours'
    },
    {
      id: 2,
      title: 'Maître de la Musique',
      description: 'Écoutez 5 playlists différentes de musicothérapie',
      progress: 2,
      total: 5,
      reward: 750,
      type: 'weekly',
      difficulty: 'Moyen',
      timeLeft: '5 jours'
    },
    {
      id: 3,
      title: 'Explorateur VR',
      description: 'Essayez toutes les expériences de réalité virtuelle',
      progress: 1,
      total: 8,
      reward: 1200,
      type: 'special',
      difficulty: 'Difficile',
      timeLeft: '14 jours'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Marie L.', points: 18500, badge: 'crown' },
    { rank: 2, name: 'Thomas M.', points: 17200, badge: 'medal' },
    { rank: 3, name: 'Sophie D.', points: 16800, badge: 'trophy' },
    { rank: 4, name: 'Vous', points: 15670, badge: 'star', isUser: true },
    { rank: 5, name: 'Pierre R.', points: 15100, badge: 'target' }
  ];

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-green-100 text-green-800';
      case 'weekly': return 'bg-blue-100 text-blue-800';
      case 'special': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Espace Récompenses
          </h1>
          <p className="text-lg text-gray-600">
            Relevez des défis, gagnez des points et débloquez des badges !
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">Niv. {userStats.level}</p>
              <p className="text-sm text-gray-600">Niveau actuel</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-8 w-8 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalPoints}</p>
              <p className="text-sm text-gray-600">Points totaux</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Flame className="h-8 w-8 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.streakDays}</p>
              <p className="text-sm text-gray-600">Jours consécutifs</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Award className="h-8 w-8 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{userStats.badges}</p>
              <p className="text-sm text-gray-600">Badges débloqués</p>
            </CardContent>
          </Card>
        </div>

        {/* XP Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Progression vers le niveau {userStats.level + 1}</h3>
              <span className="text-sm text-gray-600">
                {userStats.xp} / {userStats.xpToNext} XP
              </span>
            </div>
            <Progress value={(userStats.xp / userStats.xpToNext) * 100} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">
              {userStats.xpToNext - userStats.xp} XP restants pour le prochain niveau
            </p>
          </CardContent>
        </Card>

        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="leaderboard">Classement</TabsTrigger>
          </TabsList>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid gap-6">
              {challenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  whileHover={{ scale: 1.02 }}
                  className="cursor-pointer"
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            <Target className="h-5 w-5 mr-2 text-blue-600" />
                            {challenge.title}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {challenge.description}
                          </CardDescription>
                        </div>
                        <div className="text-center">
                          <Badge className={getChallengeTypeColor(challenge.type)}>
                            {challenge.type === 'daily' ? 'Quotidien' : 
                             challenge.type === 'weekly' ? 'Hebdomadaire' : 'Spécial'}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">{challenge.timeLeft}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>Progression</span>
                            <span>{challenge.progress}/{challenge.total}</span>
                          </div>
                          <Progress value={(challenge.progress / challenge.total) * 100} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">{challenge.difficulty}</Badge>
                            <div className="flex items-center text-yellow-600">
                              <Gift className="h-4 w-4 mr-1" />
                              <span className="font-semibold">{challenge.reward} points</span>
                            </div>
                          </div>
                          <Button 
                            size="sm"
                            disabled={challenge.progress >= challenge.total}
                          >
                            {challenge.progress >= challenge.total ? 'Terminé' : 'Participer'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05 }}
                    className={`relative ${!badge.earned ? 'opacity-60' : ''}`}
                  >
                    <Card className={`${badge.earned ? 'ring-2 ring-yellow-300' : ''}`}>
                      <CardContent className="text-center p-6">
                        <div className={`w-16 h-16 mx-auto rounded-full ${getBadgeRarityColor(badge.rarity)} flex items-center justify-center mb-4`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{badge.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{badge.description}</p>
                        <Badge 
                          className={`${getBadgeRarityColor(badge.rarity)} text-white`}
                        >
                          {badge.rarity === 'common' ? 'Commun' :
                           badge.rarity === 'rare' ? 'Rare' :
                           badge.rarity === 'epic' ? 'Épique' : 'Légendaire'}
                        </Badge>
                        {badge.earned && (
                          <div className="absolute -top-2 -right-2">
                            <div className="bg-green-500 rounded-full p-1">
                              <Trophy className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Classement mensuel
                </CardTitle>
                <CardDescription>
                  Comparez vos performances avec les autres utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div 
                      key={user.rank}
                      className={`flex items-center justify-between p-4 rounded-lg ${
                        user.isUser ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          user.rank === 1 ? 'bg-yellow-500' :
                          user.rank === 2 ? 'bg-gray-400' :
                          user.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          <span className="text-white font-bold text-sm">#{user.rank}</span>
                        </div>
                        <div>
                          <p className={`font-semibold ${user.isUser ? 'text-blue-900' : 'text-gray-900'}`}>
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-600">{user.points.toLocaleString()} points</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {user.rank <= 3 && (
                          <Medal className={`h-6 w-6 ${
                            user.rank === 1 ? 'text-yellow-500' :
                            user.rank === 2 ? 'text-gray-400' :
                            'text-orange-500'
                          }`} />
                        )}
                        {user.isUser && (
                          <Badge className="bg-blue-500 text-white">Vous</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-purple-900">Récompense du mois</h4>
                      <p className="text-sm text-purple-700">
                        Le top 3 gagne des fonctionnalités premium gratuites !
                      </p>
                    </div>
                    <Crown className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GamificationPage;
