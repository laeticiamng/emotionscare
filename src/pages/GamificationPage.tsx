
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Calendar, Users, Zap, Star, Award, Gift } from 'lucide-react';

export const GamificationPage: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(12);
  const [xpCurrent, setXpCurrent] = useState(2450);
  const [xpNeeded, setXpNeeded] = useState(3000);

  const achievements = [
    { id: 1, name: 'Premier Scan', description: 'Votre premier scan émotionnel', icon: Trophy, unlocked: true, date: '2024-01-15' },
    { id: 2, name: 'Semaine Parfaite', description: '7 jours consécutifs d\'activité', icon: Calendar, unlocked: true, date: '2024-01-20' },
    { id: 3, name: 'Explorateur VR', description: '10 sessions VR complétées', icon: Star, unlocked: true, date: '2024-01-25' },
    { id: 4, name: 'Maître Zen', description: '100 minutes de méditation', icon: Zap, unlocked: false },
    { id: 5, name: 'Social Butterfly', description: 'Partager 5 moments positifs', icon: Users, unlocked: false },
    { id: 6, name: 'Légende', description: 'Atteindre le niveau 20', icon: Award, unlocked: false }
  ];

  const challenges = [
    { id: 1, name: 'Défi 30 Jours', description: 'Scanner votre humeur pendant 30 jours', progress: 23, total: 30, reward: 500 },
    { id: 2, name: 'Guru de la Musique', description: 'Écouter 50 playlists thérapeutiques', progress: 12, total: 50, reward: 300 },
    { id: 3, name: 'Coach Personnel', description: 'Suivre 10 conseils du coach', progress: 7, total: 10, reward: 200 }
  ];

  const leaderboard = [
    { rank: 1, name: 'Emma L.', points: 15420, level: 18 },
    { rank: 2, name: 'Pierre M.', points: 14890, level: 17 },
    { rank: 3, name: 'Sophie D.', points: 13250, level: 16 },
    { rank: 4, name: 'Vous', points: xpCurrent, level: currentLevel },
    { rank: 5, name: 'Marc R.', points: 11200, level: 14 }
  ];

  return (
    <div data-testid="page-root" className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🎮 Gamification</h1>
            <p className="text-muted-foreground">Transformez votre bien-être en aventure</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              {xpCurrent} XP
            </Badge>
            <Badge className="px-4 py-2">
              Niveau {currentLevel}
            </Badge>
          </div>
        </div>

        {/* Progression du niveau */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Progression du Niveau
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Niveau {currentLevel}</span>
                <span>{xpCurrent} / {xpNeeded} XP</span>
              </div>
              <Progress value={(xpCurrent / xpNeeded) * 100} className="h-3" />
              <p className="text-sm text-muted-foreground">
                Plus que {xpNeeded - xpCurrent} XP pour atteindre le niveau {currentLevel + 1}
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="achievements" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="achievements">Succès</TabsTrigger>
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="leaderboard">Classement</TabsTrigger>
            <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`${achievement.unlocked ? 'border-green-200 bg-green-50' : 'opacity-60'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <achievement.icon className={`w-5 h-5 ${achievement.unlocked ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{achievement.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                        {achievement.unlocked && achievement.date && (
                          <p className="text-xs text-green-600 mt-2">Débloqué le {achievement.date}</p>
                        )}
                      </div>
                      {achievement.unlocked && (
                        <Trophy className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{challenge.name}</h3>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                    <Badge variant="outline">
                      <Gift className="w-3 h-3 mr-1" />
                      {challenge.reward} XP
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{challenge.progress} / {challenge.total}</span>
                    </div>
                    <Progress value={(challenge.progress / challenge.total) * 100} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
                  Classement Hebdomadaire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user) => (
                    <div key={user.rank} className={`flex items-center justify-between p-3 rounded-lg ${user.name === 'Vous' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                          user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                          user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {user.rank}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">Niveau {user.level}</p>
                        </div>
                      </div>
                      <p className="font-semibold">{user.points.toLocaleString()} XP</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Gift className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold mb-1">Session VR Gratuite</h3>
                  <p className="text-sm text-muted-foreground mb-3">Une session VR premium offerte</p>
                  <Button size="sm" disabled>500 XP requis</Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <h3 className="font-semibold mb-1">Avatar Exclusif</h3>
                  <p className="text-sm text-muted-foreground mb-3">Débloquez un avatar unique</p>
                  <Button size="sm" disabled>1000 XP requis</Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <h3 className="font-semibold mb-1">Badge Maître</h3>
                  <p className="text-sm text-muted-foreground mb-3">Badge de maître du bien-être</p>
                  <Button size="sm">Échanger (2000 XP)</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
