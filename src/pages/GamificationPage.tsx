
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import Shell from '@/Shell';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Award, Target, Users, Star, Zap, Calendar } from 'lucide-react';

const GamificationPage: React.FC = () => {
  // Mock data for challenges and badges
  const dailyChallenges = [
    { id: 1, name: "Journal quotidien", completed: true, points: 50 },
    { id: 2, name: "5 minutes de méditation", completed: true, points: 30 },
    { id: 3, name: "Écouter une playlist thérapeutique", completed: false, points: 40 }
  ];
  
  const weeklyGoals = [
    { id: 1, name: "Compléter 5 sessions de méditation", current: 3, target: 5, points: 100 },
    { id: 2, name: "Partager 2 réflexions dans la communauté", current: 1, target: 2, points: 80 },
    { id: 3, name: "Atteindre 3 jours consécutifs de bien-être", current: 2, target: 3, points: 150 }
  ];
  
  const badges = [
    { id: 1, name: "Première connexion", icon: <Star className="h-8 w-8" />, earned: true, date: "15 Mai 2024" },
    { id: 2, name: "7 jours consécutifs", icon: <Calendar className="h-8 w-8" />, earned: true, date: "22 Mai 2024" },
    { id: 3, name: "Maître de la méditation", icon: <Zap className="h-8 w-8" />, earned: false },
    { id: 4, name: "Expert en journal", icon: <Award className="h-8 w-8" />, earned: false }
  ];

  return (
    <Shell>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Défis et Récompenses</h1>
            <p className="text-muted-foreground">Suivez votre progression et gagnez des récompenses</p>
          </div>
          
          <div className="mt-4 md:mt-0 p-4 bg-accent/50 rounded-lg">
            <div className="flex items-center gap-4">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <div>
                <div className="text-sm text-muted-foreground">Points accumulés</div>
                <div className="text-2xl font-bold">760</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Niveau actuel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">Niveau 4</div>
              <p className="text-sm text-muted-foreground mb-4">Explorer émotionnel</p>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-right mt-1">760 / 1000 points</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Voir les avantages du niveau</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Classement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-2 bg-accent rounded-md">
                  <div className="flex items-center">
                    <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center mr-3">3</div>
                    <span className="font-medium">Votre position</span>
                  </div>
                  <span>760 pts</span>
                </div>
                <p className="text-sm text-muted-foreground text-center">Parmi 56 personnes dans votre groupe</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Voir le classement complet</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Prochaine récompense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium mb-2">Session de coaching gratuite</div>
              <p className="text-sm text-muted-foreground mb-4">Débloquez au niveau 5</p>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-right mt-1">Plus que 240 points</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Voir toutes les récompenses</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Défis quotidiens</CardTitle>
              <CardDescription>Complétez ces défis pour gagner des points</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyChallenges.map(challenge => (
                  <div key={challenge.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center">
                      {challenge.completed ? 
                        <div className="h-5 w-5 rounded-full bg-green-500 mr-3 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        :
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground mr-3"></div>
                      }
                      <span>{challenge.name}</span>
                    </div>
                    <Badge variant={challenge.completed ? "default" : "outline"}>
                      {challenge.points} pts
                    </Badge>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4">Actualiser les défis</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Objectifs hebdomadaires</CardTitle>
              <CardDescription>Progression vers vos objectifs de la semaine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyGoals.map(goal => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>{goal.name}</span>
                      <Badge variant="outline">{goal.points} pts</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Progress value={(goal.current / goal.target) * 100} className="h-2 flex-1" />
                      <span className="text-sm text-muted-foreground ml-3">
                        {goal.current}/{goal.target}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Vos badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {badges.map(badge => (
            <Card key={badge.id} className={`text-center ${!badge.earned ? 'opacity-50' : ''}`}>
              <CardHeader className="pb-2">
                <div className={`mx-auto p-3 rounded-full ${badge.earned ? 'bg-primary/20' : 'bg-muted'}`}>
                  {badge.icon}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <h3 className="font-medium">{badge.name}</h3>
                {badge.earned ? (
                  <p className="text-xs text-muted-foreground">Obtenu le {badge.date}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">Non obtenu</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
};

export default GamificationPage;
