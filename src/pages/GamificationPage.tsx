
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Target, Award, Zap, Calendar } from 'lucide-react';

const GamificationPage: React.FC = () => {
  const achievements = [
    { id: 1, name: 'Premier Pas', description: 'Complétez votre première séance', icon: '🎯', unlocked: true },
    { id: 2, name: 'Série de 7', description: '7 jours consécutifs d\'activité', icon: '🔥', unlocked: true },
    { id: 3, name: 'Méditateur', description: '50 minutes de méditation', icon: '🧘', unlocked: true },
    { id: 4, name: 'Explorateur VR', description: 'Testez tous les environnements VR', icon: '🥽', unlocked: false },
    { id: 5, name: 'Maître Coach', description: '100 interactions avec le coach IA', icon: '🤖', unlocked: false },
    { id: 6, name: 'Communauté', description: 'Aidez 10 autres utilisateurs', icon: '👥', unlocked: false }
  ];

  const challenges = [
    { id: 1, name: 'Défi Méditation', progress: 75, total: 100, reward: 500, timeLeft: '2 jours' },
    { id: 2, name: 'Scan Quotidien', progress: 5, total: 7, reward: 200, timeLeft: '5 jours' },
    { id: 3, name: 'Musicothérapie', progress: 12, total: 20, reward: 300, timeLeft: '1 semaine' }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Gamification</h1>
        <p className="text-muted-foreground">
          Suivez vos progrès et débloquez des récompenses en chemin vers le bien-être
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
            <h3 className="text-2xl font-bold">1,250</h3>
            <p className="text-sm text-muted-foreground">Points XP</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="text-2xl font-bold">Niveau 5</h3>
            <p className="text-sm text-muted-foreground">Explorateur</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <h3 className="text-2xl font-bold">12</h3>
            <p className="text-sm text-muted-foreground">Badges</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="text-2xl font-bold">7</h3>
            <p className="text-sm text-muted-foreground">Série de jours</p>
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

        <TabsContent value="achievements">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`${achievement.unlocked ? 'border-green-200 bg-green-50' : 'opacity-75'}`}>
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold mb-1">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                  {achievement.unlocked ? (
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <Award className="h-4 w-4" />
                      <span className="text-sm font-medium">Débloqué !</span>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">🔒 Verrouillé</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges">
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{challenge.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {challenge.timeLeft}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Progression</span>
                      <span>{challenge.progress}/{challenge.total}</span>
                    </div>
                    <div className="w-full bg-muted h-2 rounded-full">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{challenge.reward} XP</span>
                    </div>
                    <Button size="sm">
                      Continuer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Classement Hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { rank: 1, name: 'Alex M.', points: 2840, avatar: '🥇' },
                  { rank: 2, name: 'Sophie L.', points: 2650, avatar: '🥈' },
                  { rank: 3, name: 'Thomas K.', points: 2420, avatar: '🥉' },
                  { rank: 4, name: 'Vous', points: 1250, avatar: '😊', isUser: true },
                  { rank: 5, name: 'Marie D.', points: 1180, avatar: '⭐' }
                ].map((user) => (
                  <div 
                    key={user.rank} 
                    className={`flex items-center justify-between p-4 rounded-lg ${user.isUser ? 'bg-primary/10 border border-primary/20' : 'bg-muted'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{user.avatar}</span>
                      <div>
                        <span className="font-medium">{user.name}</span>
                        {user.isUser && <span className="ml-2 text-sm text-primary">(Vous)</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{user.points} XP</div>
                      <div className="text-sm text-muted-foreground">#{user.rank}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">🎵</div>
                <h3 className="font-semibold mb-2">Playlist Premium</h3>
                <p className="text-sm text-muted-foreground mb-4">Accès à 50 nouvelles mélodies</p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">500 XP</span>
                </div>
                <Button size="sm">Échanger</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">🎨</div>
                <h3 className="font-semibold mb-2">Thème Personnalisé</h3>
                <p className="text-sm text-muted-foreground mb-4">Nouveau thème pour l'interface</p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">750 XP</span>
                </div>
                <Button size="sm">Échanger</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-4xl mb-2">🏆</div>
                <h3 className="font-semibold mb-2">Titre Exclusif</h3>
                <p className="text-sm text-muted-foreground mb-4">"Maître du Bien-être"</p>
                <div className="flex items-center justify-center gap-1 mb-3">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">1000 XP</span>
                </div>
                <Button size="sm" variant="outline" disabled>
                  Insuffisant
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationPage;
