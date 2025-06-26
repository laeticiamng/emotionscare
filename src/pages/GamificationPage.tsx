
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Flame, 
  Crown, 
  Medal,
  Calendar,
  TrendingUp
} from 'lucide-react';

const GamificationPage: React.FC = () => {
  const userStats = {
    level: 12,
    xp: 2840,
    xpToNext: 3200,
    streakDays: 15,
    totalBadges: 8,
    completedChallenges: 23
  };

  const badges = [
    {
      id: 1,
      name: 'Premier Scan',
      description: 'Réalisez votre premier scan émotionnel',
      icon: Star,
      color: 'text-yellow-500',
      earned: true,
      earnedDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Mélomane',
      description: 'Écoutez 50 sessions de musicothérapie',
      icon: Medal,
      color: 'text-purple-500',
      earned: true,
      earnedDate: '2024-01-20'
    },
    {
      id: 3,
      name: 'Régularité',
      description: 'Utilisez l\'app 7 jours consécutifs',
      icon: Flame,
      color: 'text-red-500',
      earned: true,
      earnedDate: '2024-01-25'
    },
    {
      id: 4,
      name: 'Explorateur VR',
      description: 'Terminez 10 expériences VR',
      icon: Crown,
      color: 'text-blue-500',
      earned: false
    },
    {
      id: 5,
      name: 'Maître Coach',
      description: 'Conversez 100 fois avec le coach IA',
      icon: Trophy,
      color: 'text-green-500',
      earned: false
    },
    {
      id: 6,
      name: 'Écrivain',
      description: 'Rédigez 30 entrées de journal',
      icon: Award,
      color: 'text-indigo-500',
      earned: false
    }
  ];

  const challenges = [
    {
      id: 1,
      title: 'Semaine Zen',
      description: 'Réalisez un scan émotionnel chaque jour pendant 7 jours',
      progress: 5,
      total: 7,
      reward: '500 XP',
      type: 'weekly'
    },
    {
      id: 2,
      title: 'Musicothérapie Intensive',
      description: 'Écoutez 5 sessions de musicothérapie cette semaine',
      progress: 3,
      total: 5,
      reward: '300 XP',
      type: 'weekly'
    },
    {
      id: 3,
      title: 'Explorateur Virtuel',
      description: 'Terminez 3 expériences VR différentes',
      progress: 1,
      total: 3,
      reward: '1000 XP',
      type: 'monthly'
    }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Récompenses & Progression</h1>
          <p className="text-gray-600">
            Suivez vos accomplissements et débloquez de nouveaux badges
          </p>
        </div>

        {/* User Level Card */}
        <Card className="mb-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Niveau {userStats.level}</h2>
                  <p className="opacity-90">Maître du Bien-être</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{userStats.xp} XP</div>
                <div className="opacity-90">
                  {userStats.xpToNext - userStats.xp} XP jusqu'au niveau suivant
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Progress 
                value={(userStats.xp / userStats.xpToNext) * 100} 
                className="h-3 bg-white/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Flame className="h-8 w-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-600">{userStats.streakDays}</div>
              <div className="text-gray-600">Jours consécutifs</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">{userStats.totalBadges}</div>
              <div className="text-gray-600">Badges obtenus</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{userStats.completedChallenges}</div>
              <div className="text-gray-600">Défis complétés</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Badges Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Badges & Achievements</h2>
            <div className="grid grid-cols-1 gap-4">
              {badges.map((badge) => {
                const IconComponent = badge.icon;
                return (
                  <Card 
                    key={badge.id} 
                    className={`${badge.earned ? 'bg-white' : 'bg-gray-100 opacity-60'} hover:shadow-md transition-shadow`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          badge.earned ? 'bg-gray-100' : 'bg-gray-200'
                        }`}>
                          <IconComponent className={`h-6 w-6 ${badge.earned ? badge.color : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{badge.name}</h3>
                          <p className="text-sm text-gray-600">{badge.description}</p>
                          {badge.earned && badge.earnedDate && (
                            <p className="text-xs text-green-600 mt-1">
                              Obtenu le {new Date(badge.earnedDate).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                        {badge.earned && (
                          <Badge className="bg-green-100 text-green-800">
                            Obtenu
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Challenges Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Défis Actifs</h2>
            <div className="space-y-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{challenge.title}</CardTitle>
                        <CardDescription>{challenge.description}</CardDescription>
                      </div>
                      <Badge variant={challenge.type === 'weekly' ? 'default' : 'secondary'}>
                        {challenge.type === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{challenge.progress}/{challenge.total}</span>
                      </div>
                      <Progress value={(challenge.progress / challenge.total) * 100} />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Récompense: {challenge.reward}</span>
                        {challenge.progress === challenge.total ? (
                          <Button size="sm">Réclamer</Button>
                        ) : (
                          <Button size="sm" variant="outline">Continuer</Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Leaderboard Preview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Classement cette semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                    <span className="font-medium">🥇 Vous</span>
                    <span className="font-bold">2,840 XP</span>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <span>🥈 Sarah M.</span>
                    <span>2,720 XP</span>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <span>🥉 Marc L.</span>
                    <span>2,650 XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationPage;
