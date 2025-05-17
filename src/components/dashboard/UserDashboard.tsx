
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Trophy, ArrowRight } from 'lucide-react';
import { mockChallenges } from '@/hooks/community-gamification/mockData';
import DashboardContent from './DashboardContent';

const UserDashboard: React.FC = () => {
  const userPoints = 150;
  const userStreak = 7;
  const userBadges = 5;
  
  const recentChallenges = mockChallenges.slice(0, 3).map((challenge) => ({
    id: challenge.id,
    title: challenge.title,
    progress: challenge.progress,
    points: challenge.points.toString(),
    difficulty: challenge.difficulty
  }));
  
  const moodData = [
    { date: '2023-08-01', mood: 3 },
    { date: '2023-08-02', mood: 4 },
    { date: '2023-08-03', mood: 5 },
    { date: '2023-08-04', mood: 4 },
    { date: '2023-08-05', mood: 3 },
    { date: '2023-08-06', mood: 4 },
    { date: '2023-08-07', mood: 5 }
  ];
  
  const todaysMoodScore = 4;
  const moodAverage = moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length;
  
  const completedSessions = 12;
  const totalSessionsGoal = 20;
  
  return (
    <DashboardContent>
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue ! Voici votre progression et activités récentes.
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Points Totaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userPoints.toString()}</div>
            <p className="text-xs text-muted-foreground">
              + 25 cette semaine
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Série Actuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStreak.toString()} jours</div>
            <p className="text-xs text-muted-foreground">
              Votre meilleur: 9 jours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Badges Débloqués</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userBadges.toString()}/15</div>
            <p className="text-xs text-muted-foreground">
              2 badges proches du déblocage
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Today's Mood */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Humeur du jour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg 
                ${level === todaysMoodScore 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'}`}
              >
                {level}
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground">
            Votre moyenne sur 7 jours: {moodAverage.toFixed(1)}/5
          </p>
        </CardContent>
      </Card>
      
      {/* Challenges */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Défis en cours</CardTitle>
            <Button variant="ghost" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentChallenges.map((challenge) => (
                <div key={challenge.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{challenge.title}</span>
                    <span className="text-xs bg-muted px-2 py-1 rounded-md">
                      {challenge.points} pts
                    </span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>
              ))}
              <Button variant="outline" className="w-full mt-2" size="sm">
                Voir tous les défis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sessions de bien-être</CardTitle>
            <Button variant="ghost" size="icon">
              <Zap className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{completedSessions}/{totalSessionsGoal}</div>
                <p className="text-xs text-muted-foreground">
                  Sessions réalisées ce mois-ci
                </p>
                <Progress 
                  value={completedSessions} 
                  max={totalSessionsGoal}
                  className="h-2 mt-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button variant="outline" className="w-full" size="sm">
                  Méditation
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Relaxation
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Journal
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Exercices
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardContent>
  );
};

export default UserDashboard;
