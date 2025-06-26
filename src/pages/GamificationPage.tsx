
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Star, 
  Target, 
  Flame, 
  Award, 
  Calendar,
  TrendingUp,
  Gift,
  Users,
  Crown,
  Zap,
  Heart,
  Brain,
  Music,
  BookOpen
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  earned: boolean;
  dateEarned?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  type: 'daily' | 'weekly' | 'monthly';
  completed: boolean;
  icon: React.ComponentType<any>;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  date: string;
  type: string;
}

const GamificationPage: React.FC = () => {
  const [userStats] = useState({
    totalPoints: 2847,
    level: 12,
    nextLevelPoints: 3000,
    streak: 15,
    badgesEarned: 8,
    challengesCompleted: 23,
    rank: 3
  });

  const badges: Badge[] = [
    {
      id: '1',
      name: 'Premier Pas',
      description: 'Complétez votre première session',
      icon: Star,
      earned: true,
      dateEarned: '2024-01-01',
      rarity: 'common'
    },
    {
      id: '2',
      name: 'Série Hebdomadaire',
      description: '7 jours consécutifs d\'activité',
      icon: Flame,
      earned: true,
      dateEarned: '2024-01-08',
      rarity: 'rare'
    },
    {
      id: '3',
      name: 'Maître de la Méditation',
      description: '50 sessions de méditation complétées',
      icon: Brain,
      earned: true,
      dateEarned: '2024-01-15',
      rarity: 'epic'
    },
    {
      id: '4',
      name: 'Mélomane Zen',
      description: '100 heures de musicothérapie',
      icon: Music,
      earned: false,
      rarity: 'rare'
    },
    {
      id: '5',
      name: 'Roi du Bien-être',
      description: 'Atteignez la position #1 du classement',
      icon: Crown,
      earned: false,
      rarity: 'legendary'
    },
    {
      id: '6',
      name: 'Écrivain Émotionnel',
      description: '30 entrées de journal',
      icon: BookOpen,
      earned: true,
      dateEarned: '2024-01-10',
      rarity: 'common'
    }
  ];

  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Méditation quotidienne',
      description: 'Méditez 10 minutes aujourd\'hui',
      progress: 10,
      target: 10,
      reward: 50,
      type: 'daily',
      completed: true,
      icon: Brain
    },
    {
      id: '2',
      title: 'Semaine de bien-être',
      description: 'Complétez 5 sessions cette semaine',
      progress: 3,
      target: 5,
      reward: 200,
      type: 'weekly',
      completed: false,
      icon: Heart
    },
    {
      id: '3',
      title: 'Journal mensuel',
      description: 'Écrivez 20 entrées ce mois-ci',
      progress: 12,
      target: 20,
      reward: 500,
      type: 'monthly',
      completed: false,
      icon: BookOpen
    },
    {
      id: '4',
      title: 'Musicothérapie',
      description: 'Écoutez 2 heures de musique thérapeutique',
      progress: 1.5,
      target: 2,
      reward: 100,
      type: 'daily',
      completed: false,
      icon: Music
    }
  ];

  const recentAchievements: Achievement[] = [
    {
      id: '1',
      title: 'Série de 15 jours',
      description: 'Activité quotidienne pendant 15 jours',
      points: 300,
      date: '2024-01-15',
      type: 'streak'
    },
    {
      id: '2',
      title: 'Session parfaite',
      description: 'Complété une session sans interruption',
      points: 100,
      date: '2024-01-14',
      type: 'session'
    },
    {
      id: '3',
      title: 'Amélioration d\'humeur',
      description: 'Score de bien-être en hausse',
      points: 150,
      date: '2024-01-13',
      type: 'wellness'
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-green-100 text-green-800';
      case 'weekly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Récompenses et Défis</h1>
              <p className="text-gray-600">Transformez votre parcours bien-être en aventure</p>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Points totaux</p>
                  <p className="text-2xl font-bold">{userStats.totalPoints.toLocaleString()}</p>
                </div>
                <Trophy className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Niveau</p>
                  <p className="text-2xl font-bold">{userStats.level}</p>
                  <Progress 
                    value={(userStats.totalPoints / userStats.nextLevelPoints) * 100} 
                    className="mt-2 h-1 bg-white/20"
                  />
                </div>
                <Star className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-400 to-pink-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Série actuelle</p>
                  <p className="text-2xl font-bold">{userStats.streak} jours</p>
                </div>
                <Flame className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-400 to-teal-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Classement</p>
                  <p className="text-2xl font-bold">#{userStats.rank}</p>
                </div>
                <Award className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="leaderboard">Classement</TabsTrigger>
            <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          </TabsList>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className={challenge.completed ? 'border-green-200 bg-green-50' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${challenge.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <challenge.icon className={`h-5 w-5 ${challenge.completed ? 'text-green-600' : 'text-gray-600'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{challenge.title}</CardTitle>
                          <CardDescription>{challenge.description}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getChallengeTypeColor(challenge.type)}>
                        {challenge.type === 'daily' ? 'Quotidien' : 
                         challenge.type === 'weekly' ? 'Hebdomadaire' : 'Mensuel'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{challenge.progress}/{challenge.target}</span>
                      </div>
                      <Progress value={(challenge.progress / challenge.target) * 100} className="h-2" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Zap className="h-4 w-4" />
                          <span>{challenge.reward} points</span>
                        </div>
                        {challenge.completed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Terminé ✓
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <Card 
                  key={badge.id} 
                  className={`${getRarityColor(badge.rarity)} ${badge.earned ? 'shadow-lg' : 'opacity-60'}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${badge.earned ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                        <badge.icon className={`h-6 w-6 ${badge.earned ? 'text-yellow-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{badge.name}</h3>
                        <p className="text-sm text-gray-600">{badge.description}</p>
                        {badge.earned && badge.dateEarned && (
                          <p className="text-xs text-green-600 mt-1">
                            Obtenu le {new Date(badge.dateEarned).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className={`capitalize text-xs ${
                        badge.rarity === 'legendary' ? 'border-yellow-500 text-yellow-700' :
                        badge.rarity === 'epic' ? 'border-purple-500 text-purple-700' :
                        badge.rarity === 'rare' ? 'border-blue-500 text-blue-700' :
                        'border-gray-400 text-gray-600'
                      }`}>
                        {badge.rarity === 'legendary' ? 'Légendaire' :
                         badge.rarity === 'epic' ? 'Épique' :
                         badge.rarity === 'rare' ? 'Rare' : 'Commun'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Classement hebdomadaire
                </CardTitle>
                <CardDescription>
                  Votre position parmi les utilisateurs les plus actifs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'Marie L.', points: 3524, trend: 'up' },
                    { rank: 2, name: 'Pierre D.', points: 3201, trend: 'up' },
                    { rank: 3, name: 'Vous', points: 2847, trend: 'up', isUser: true },
                    { rank: 4, name: 'Sophie M.', points: 2756, trend: 'down' },
                    { rank: 5, name: 'Jean B.', points: 2643, trend: 'stable' },
                  ].map((user) => (
                    <div 
                      key={user.rank} 
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        user.isUser ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100">
                        {user.rank === 1 ? <Crown className="h-4 w-4 text-yellow-600" /> : 
                         <span className="text-sm font-bold text-yellow-600">#{user.rank}</span>}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.points.toLocaleString()} points</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`h-4 w-4 ${
                          user.trend === 'up' ? 'text-green-500' : 
                          user.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                        }`} />
                        {user.isUser && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            Vous
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Récompenses disponibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div>
                        <p className="font-medium">Session VR premium</p>
                        <p className="text-sm text-gray-600">1 heure d'accès exclusif</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">500 points</p>
                        <Button size="sm" className="mt-1">
                          Échanger
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Playlist personnalisée</p>
                        <p className="text-sm text-gray-600">Musique adaptée à votre profil</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">300 points</p>
                        <Button size="sm" className="mt-1">
                          Échanger
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Consultation coach</p>
                        <p className="text-sm text-gray-600">30 min avec un expert</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">1000 points</p>
                        <Button size="sm" variant="outline" disabled>
                          Bientôt
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Réussites récentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentAchievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-green-100 rounded-full">
                          <Trophy className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{achievement.title}</p>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(achievement.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          +{achievement.points}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GamificationPage;
