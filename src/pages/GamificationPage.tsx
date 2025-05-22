
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Medal, Target, Award, Star, Clock, Users } from 'lucide-react';
import UnifiedLayout from '@/components/unified/UnifiedLayout';

const GamificationPage: React.FC = () => {
  // Données fictives pour les défis
  const challenges = [
    { 
      id: 1, 
      title: 'Maître de la méditation', 
      description: 'Complétez 10 séances de méditation',
      progress: 70,
      reward: '50 points + Badge',
      type: 'Personnel',
      difficulty: 'Moyen',
      expiresIn: '12 jours'
    },
    { 
      id: 2, 
      title: 'Journal quotidien', 
      description: 'Enregistrez vos émotions chaque jour pendant une semaine',
      progress: 42,
      reward: '30 points',
      type: 'Personnel',
      difficulty: 'Facile',
      expiresIn: '3 jours'
    },
    { 
      id: 3, 
      title: 'Défis d\'équipe', 
      description: 'Complétez 5 défis en équipe',
      progress: 20,
      reward: '100 points + Badge d\'équipe',
      type: 'Équipe',
      difficulty: 'Difficile',
      expiresIn: '30 jours'
    },
    {
      id: 4,
      title: 'Bien-être collectif',
      description: 'Contribuez à améliorer le score de bien-être de l\'équipe',
      progress: 60,
      reward: '75 points',
      type: 'Équipe',
      difficulty: 'Moyen',
      expiresIn: '15 jours'
    }
  ];
  
  // Données fictives pour les badges
  const badges = [
    { id: 1, name: 'Explorateur', description: 'A essayé tous les modules', icon: <Star className="h-10 w-10 text-amber-400" /> },
    { id: 2, name: 'Émotions maîtrisées', description: 'A maintenu un bon équilibre émotionnel', icon: <Award className="h-10 w-10 text-blue-400" /> },
    { id: 3, name: 'Méditant régulier', description: '30 jours de méditation', icon: <Medal className="h-10 w-10 text-green-400" /> },
  ];
  
  return (
    <UnifiedLayout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Défis et récompenses</h1>
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
            <Trophy className="text-primary h-5 w-5" />
            <span className="font-semibold">425 points</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Niveau actuel</CardDescription>
              <CardTitle className="text-2xl">Niveau 8</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={70} className="h-2" />
              <p className="text-xs text-right mt-1 text-muted-foreground">350/500 pour niveau 9</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Badges obtenus</CardDescription>
              <CardTitle className="text-2xl">12</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex">
                <Award className="h-5 w-5 text-primary" />
                <Award className="h-5 w-5 text-primary" />
                <Award className="h-5 w-5 text-primary" />
                <span className="text-xs text-muted-foreground ml-1">+9</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Défis complétés</CardDescription>
              <CardTitle className="text-2xl">28</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Ce mois: 4 défis
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Classement</CardDescription>
              <CardTitle className="text-2xl">#6</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Top 10% de l'équipe
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-semibold mb-4">Défis actifs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {challenges.map(challenge => (
            <Card key={challenge.id} className="hover:shadow-md transition-all">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{challenge.title}</CardTitle>
                    <CardDescription>{challenge.description}</CardDescription>
                  </div>
                  <Badge variant={challenge.type === 'Équipe' ? 'outline' : 'secondary'} className="ml-2">
                    {challenge.type === 'Équipe' ? (
                      <Users className="mr-1 h-3 w-3" />
                    ) : null}
                    {challenge.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span>{challenge.reward}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{challenge.expiresIn}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">Voir détails</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        <h2 className="text-2xl font-semibold mb-4">Mes badges</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {badges.map(badge => (
            <Card key={badge.id} className="text-center hover:shadow-md transition-all">
              <CardHeader>
                <div className="mx-auto">
                  {badge.icon}
                </div>
                <CardTitle className="mt-2">{badge.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{badge.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
          
          <Card className="text-center border-dashed hover:shadow-md transition-all">
            <CardHeader>
              <div className="mx-auto rounded-full h-10 w-10 border-2 border-dashed flex items-center justify-center">
                <Target className="h-6 w-6 text-muted-foreground" />
              </div>
              <CardTitle className="mt-2">Nouveau badge</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Complétez des défis pour débloquer plus de badges</CardDescription>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full">Voir tous les badges</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default GamificationPage;
