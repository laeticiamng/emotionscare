
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Users, Target, Calendar, Star, Award } from 'lucide-react';

const B2BUserGamification: React.FC = () => {
  const [activeChallenge, setActiveChallenge] = useState<string | null>(null);

  const individualChallenges = [
    {
      id: '1',
      title: 'Méditation quotidienne',
      description: '7 jours consécutifs de méditation de 10 minutes',
      progress: 60,
      total: 7,
      current: 4,
      reward: '50 points bien-être',
      icon: <Target className="h-5 w-5" />,
      difficulty: 'Facile'
    },
    {
      id: '2',
      title: 'Pause respiratoire',
      description: '20 exercices de respiration cette semaine',
      progress: 35,
      total: 20,
      current: 7,
      reward: '30 points bien-être',
      icon: <Calendar className="h-5 w-5" />,
      difficulty: 'Moyen'
    }
  ];

  const teamChallenges = [
    {
      id: '3',
      title: 'Défi équipe zen',
      description: 'Objectif collectif : 100 sessions de bien-être',
      progress: 75,
      total: 100,
      current: 75,
      participants: 12,
      reward: 'Badge équipe bien-être',
      icon: <Users className="h-5 w-5" />,
      status: 'En cours'
    }
  ];

  const achievements = [
    { title: 'Premier pas', description: 'Première session complétée', icon: <Star className="h-4 w-4" />, earned: true },
    { title: 'Régularité', description: '7 jours consécutifs', icon: <Trophy className="h-4 w-4" />, earned: true },
    { title: 'Champion', description: '30 jours consécutifs', icon: <Award className="h-4 w-4" />, earned: false }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Challenges Bien-être</h1>
          <p className="text-muted-foreground">
            Participez à des défis collectifs et individuels pour améliorer le bien-être au sein de votre entreprise.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">385</div>
          <div className="text-sm text-muted-foreground">Points bien-être</div>
        </div>
      </div>

      {/* Défis individuels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Défis personnels
          </CardTitle>
          <CardDescription>
            Challenges individuels pour développer vos habitudes bien-être
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {individualChallenges.map((challenge) => (
              <div key={challenge.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      {challenge.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                  <Badge variant={challenge.difficulty === 'Facile' ? 'secondary' : 'default'}>
                    {challenge.difficulty}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression: {challenge.current}/{challenge.total}</span>
                    <span className="text-primary">{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Récompense: {challenge.reward}</span>
                    <Button 
                      size="sm" 
                      onClick={() => setActiveChallenge(challenge.id)}
                      disabled={challenge.progress === 100}
                    >
                      {challenge.progress === 100 ? 'Terminé' : 'Continuer'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Défis d'équipe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Défis d'équipe
          </CardTitle>
          <CardDescription>
            Challenges collectifs avec vos collègues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {teamChallenges.map((challenge) => (
              <div key={challenge.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      {challenge.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{challenge.participants} participants</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Objectif collectif: {challenge.current}/{challenge.total}</span>
                    <span className="text-primary">{challenge.progress}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Récompense: {challenge.reward}</span>
                    <Button size="sm" variant="outline">
                      Voir l'équipe
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Succès et récompenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Mes succès
          </CardTitle>
          <CardDescription>
            Vos accomplissements et badges gagnés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <h3 className={`font-medium mb-1 ${
                  achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {achievement.title}
                </h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
                {achievement.earned && (
                  <Badge variant="secondary" className="mt-2">Obtenu</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2BUserGamification;
