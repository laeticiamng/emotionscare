
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Star, Gift, Zap, Heart, Brain, Target, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const B2CGamification: React.FC = () => {
  const [userLevel, setUserLevel] = useState(12);
  const [userPoints, setUserPoints] = useState(2840);
  const [streak, setStreak] = useState(15);

  const dailyChallenges = [
    {
      id: '1',
      title: 'Méditation matinale',
      description: 'Méditer 10 minutes au réveil',
      points: 50,
      completed: true,
      icon: <Brain className="h-4 w-4" />
    },
    {
      id: '2',
      title: 'Respiration profonde',
      description: '5 exercices de respiration',
      points: 30,
      completed: false,
      icon: <Heart className="h-4 w-4" />
    },
    {
      id: '3',
      title: 'Journal de gratitude',
      description: 'Noter 3 choses positives',
      points: 40,
      completed: false,
      icon: <Star className="h-4 w-4" />
    }
  ];

  const weeklyGoals = [
    {
      id: '1',
      title: 'Maître de la sérénité',
      description: 'Compléter 21 sessions de méditation',
      progress: 75,
      current: 16,
      total: 21,
      reward: '200 points + Badge Or',
      icon: <Target className="h-5 w-5" />
    },
    {
      id: '2',
      title: 'Régularité parfaite',
      description: 'Se connecter 7 jours consécutifs',
      progress: 85,
      current: 6,
      total: 7,
      reward: '150 points + Streak Bonus',
      icon: <Calendar className="h-5 w-5" />
    }
  ];

  const rewards = [
    {
      id: '1',
      title: 'Méditation guidée premium',
      description: 'Accès à 10 méditations exclusives',
      cost: 500,
      available: true,
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: '2',
      title: 'Thème interface zen',
      description: 'Personnalisation visuelle apaisante',
      cost: 300,
      available: true,
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: '3',
      title: 'Session coaching privée',
      description: '30 min avec un coach certifié',
      cost: 1000,
      available: true,
      icon: <Trophy className="h-5 w-5" />
    }
  ];

  const achievements = [
    { title: 'Premier pas', description: 'Première session', icon: <Star className="h-4 w-4" />, earned: true },
    { title: 'Habitué', description: '7 jours consécutifs', icon: <Target className="h-4 w-4" />, earned: true },
    { title: 'Expert', description: '30 jours consécutifs', icon: <Trophy className="h-4 w-4" />, earned: false },
    { title: 'Maître zen', description: '100 sessions complétées', icon: <Brain className="h-4 w-4" />, earned: false }
  ];

  const completeChallenge = (challengeId: string, points: number) => {
    setUserPoints(prev => prev + points);
    toast.success(`Défi complété ! +${points} points`);
  };

  const redeemReward = (rewardId: string, cost: number) => {
    if (userPoints >= cost) {
      setUserPoints(prev => prev - cost);
      toast.success('Récompense obtenue !');
    } else {
      toast.error('Points insuffisants');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header avec stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Défis et Récompenses</h1>
          <p className="text-muted-foreground">
            Participez à des défis quotidiens pour améliorer votre bien-être et gagnez des récompenses.
          </p>
        </div>
        <div className="text-right space-y-1">
          <div className="text-2xl font-bold text-primary">{userPoints}</div>
          <div className="text-sm text-muted-foreground">Points bien-être</div>
        </div>
      </div>

      {/* Stats utilisateur */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Niveau</p>
                <p className="text-2xl font-bold">{userLevel}</p>
              </div>
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <Progress value={75} className="mt-3 h-2" />
            <p className="text-xs text-muted-foreground mt-1">160 points pour le niveau suivant</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Série actuelle</p>
                <p className="text-2xl font-bold">{streak} jours</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-3">
              <Badge variant="secondary">Série de feu ! 🔥</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rang cette semaine</p>
                <p className="text-2xl font-bold">#3</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Top 10% des utilisateurs</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="challenges" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges">Défis du jour</TabsTrigger>
          <TabsTrigger value="goals">Objectifs</TabsTrigger>
          <TabsTrigger value="rewards">Récompenses</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <CardTitle>Défis quotidiens</CardTitle>
              <CardDescription>
                Complétez ces défis pour gagner des points et maintenir votre série
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyChallenges.map((challenge) => (
                  <div 
                    key={challenge.id} 
                    className={`p-4 border rounded-lg transition-colors ${
                      challenge.completed 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          challenge.completed 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {challenge.icon}
                        </div>
                        <div>
                          <h3 className={`font-medium ${
                            challenge.completed ? 'line-through text-muted-foreground' : ''
                          }`}>
                            {challenge.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {challenge.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={challenge.completed ? 'default' : 'secondary'}>
                          +{challenge.points} pts
                        </Badge>
                        <Button 
                          size="sm"
                          disabled={challenge.completed}
                          onClick={() => completeChallenge(challenge.id, challenge.points)}
                        >
                          {challenge.completed ? 'Terminé' : 'Commencer'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Objectifs hebdomadaires</CardTitle>
              <CardDescription>
                Défis à plus long terme avec des récompenses spéciales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {weeklyGoals.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                          {goal.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression: {goal.current}/{goal.total}</span>
                        <span className="text-primary">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                      <p className="text-sm text-muted-foreground">
                        Récompense: {goal.reward}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Boutique de récompenses
                </CardTitle>
                <CardDescription>
                  Échangez vos points contre des récompenses exclusives
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                          {reward.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{reward.title}</h3>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-4">
                        {reward.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{reward.cost} points</Badge>
                        <Button 
                          size="sm"
                          disabled={!reward.available || userPoints < reward.cost}
                          onClick={() => redeemReward(reward.id, reward.cost)}
                        >
                          {userPoints >= reward.cost ? 'Échanger' : 'Insuffisant'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mes succès</CardTitle>
                <CardDescription>
                  Vos accomplissements et badges gagnés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border rounded-lg text-center ${
                        achievement.earned 
                          ? 'bg-primary/5 border-primary/20' 
                          : 'bg-muted/20 border-muted'
                      }`}
                    >
                      <div className={`inline-flex p-3 rounded-full mb-3 ${
                        achievement.earned 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {achievement.icon}
                      </div>
                      <h3 className={`font-medium mb-1 text-sm ${
                        achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.earned && (
                        <Badge variant="secondary" className="mt-2 text-xs">Obtenu</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default B2CGamification;
