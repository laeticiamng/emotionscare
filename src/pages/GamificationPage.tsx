
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Target, Zap, Gift, Award, Medal, Crown, Flame } from 'lucide-react';

const GamificationPage: React.FC = () => {
  const [userLevel, setUserLevel] = useState(7);
  const [currentXP, setCurrentXP] = useState(1450);
  const [nextLevelXP, setNextLevelXP] = useState(2000);
  const [streak, setStreak] = useState(12);

  const achievements = [
    {
      id: 1,
      title: "Premier Scan",
      description: "Effectuer votre premier scan émotionnel",
      icon: Star,
      unlocked: true,
      points: 50,
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Série de 7 jours",
      description: "Utiliser l'app 7 jours consécutifs",
      icon: Flame,
      unlocked: true,
      points: 150,
      date: "2024-01-22"
    },
    {
      id: 3,
      title: "Maître de la Méditation",
      description: "Compléter 20 sessions VR",
      icon: Crown,
      unlocked: false,
      points: 300,
      progress: 12
    },
    {
      id: 4,
      title: "Coach Advisor",
      description: "Avoir 50 conversations avec l'IA",
      icon: Award,
      unlocked: true,
      points: 200,
      date: "2024-02-01"
    }
  ];

  const challenges = [
    {
      id: 1,
      title: "Défi Bien-être Hebdomadaire",
      description: "Maintenir un score de bien-être > 75% cette semaine",
      progress: 85,
      target: 100,
      reward: "Badge Or + 500 XP",
      timeLeft: "3 jours",
      difficulty: "Facile"
    },
    {
      id: 2,
      title: "Marathon Émotionnel",
      description: "Effectuer 30 scans ce mois-ci",
      progress: 18,
      target: 30,
      reward: "Titre spécial + 1000 XP",
      timeLeft: "12 jours",
      difficulty: "Moyen"
    },
    {
      id: 3,
      title: "Explorateur VR",
      description: "Tester tous les environnements VR",
      progress: 4,
      target: 8,
      reward: "Environnement exclusif",
      timeLeft: "Permanent",
      difficulty: "Difficile"
    }
  ];

  const leaderboard = [
    { rank: 1, name: "Sarah M.", points: 8450, badge: "👑" },
    { rank: 2, name: "Marc L.", points: 7890, badge: "🥈" },
    { rank: 3, name: "Vous", points: 7234, badge: "🥉" },
    { rank: 4, name: "Julie R.", points: 6890, badge: "🏅" },
    { rank: 5, name: "Paul D.", points: 6234, badge: "🏅" }
  ];

  const rewards = [
    { id: 1, name: "Avatar Premium", cost: 500, type: "cosmetic", available: true },
    { id: 2, name: "Thème Zen", cost: 300, type: "cosmetic", available: true },
    { id: 3, name: "Session Coach Privée", cost: 1000, type: "feature", available: false },
    { id: 4, name: "Analyse Avancée", cost: 750, type: "feature", available: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gamification</h1>
          <p className="text-gray-600">Votre parcours de bien-être ludique</p>
        </div>

        {/* Stats générales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">Niveau {userLevel}</div>
              <p className="text-sm text-gray-600">Explorateur du Bien-être</p>
              <Progress value={(currentXP / nextLevelXP) * 100} className="mt-4" />
              <p className="text-xs text-gray-500 mt-2">{currentXP}/{nextLevelXP} XP</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <Flame className="h-8 w-8 text-orange-500 mr-2" />
                <span className="text-3xl font-bold text-orange-600">{streak}</span>
              </div>
              <p className="text-sm text-gray-600">Jours consécutifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2,340</div>
              <p className="text-sm text-gray-600">Points totaux</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">12</div>
              <p className="text-sm text-gray-600">Succès débloqués</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="achievements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="achievements">Succès</TabsTrigger>
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="leaderboard">Classement</TabsTrigger>
            <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={achievement.unlocked ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <achievement.icon className={`h-6 w-6 ${achievement.unlocked ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant={achievement.unlocked ? 'default' : 'secondary'}>
                            {achievement.points} XP
                          </Badge>
                          {achievement.unlocked ? (
                            <span className="text-xs text-green-600">Débloqué le {achievement.date}</span>
                          ) : (
                            <span className="text-xs text-gray-500">Progression: {achievement.progress || 0}/20</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{challenge.title}</h3>
                        <p className="text-gray-600 text-sm">{challenge.description}</p>
                      </div>
                      <Badge variant="outline">{challenge.difficulty}</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{challenge.progress}/{challenge.target}</span>
                      </div>
                      <Progress value={(challenge.progress / challenge.target) * 100} />
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <span className="text-gray-600">Récompense: </span>
                          <span className="font-medium">{challenge.reward}</span>
                        </div>
                        <span className="text-xs text-gray-500">{challenge.timeLeft} restant</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Classement Hebdomadaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.map((user) => (
                    <div key={user.rank} className={`flex items-center justify-between p-4 rounded-lg ${user.name === 'Vous' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{user.badge}</span>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-600">#{user.rank}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{user.points.toLocaleString()} pts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rewards.map((reward) => (
                <Card key={reward.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{reward.name}</h3>
                        <Badge variant={reward.type === 'cosmetic' ? 'secondary' : 'default'}>
                          {reward.type === 'cosmetic' ? 'Cosmétique' : 'Fonctionnalité'}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600">{reward.cost} pts</div>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      disabled={!reward.available}
                      variant={reward.available ? 'default' : 'secondary'}
                    >
                      {reward.available ? 'Échanger' : 'Pas assez de points'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GamificationPage;
