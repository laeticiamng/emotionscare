
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GamificationPanel from '@/components/gamification/GamificationPanel';
import BadgeShowcase from '@/components/gamification/BadgeShowcase';
import LeaderboardCard from '@/components/gamification/LeaderboardCard';
import { Trophy, Award, Users, TrendingUp } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';

const GamificationPage: React.FC = () => {
  const { userPoints } = useGamification();

  // Mock leaderboard data
  const mockLeaderboard = [
    { id: '1', name: 'Alice Martin', points: 2847, level: 8, rank: 1 },
    { id: '2', name: 'Bob Dupont', points: 2634, level: 7, rank: 2 },
    { id: '3', name: 'Claire Durand', points: 2156, level: 6, rank: 3 },
    { id: '4', name: 'David Laurent', points: 1934, level: 5, rank: 4 },
    { id: '5', name: 'Emma Rousseau', points: 1788, level: 5, rank: 5 },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Gamification & Récompenses</h1>
        <p className="text-muted-foreground">
          Suivez votre progression, collectionnez des badges et comparez-vous aux autres utilisateurs.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="badges" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Classements
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Succès
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <GamificationPanel />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <LeaderboardCard 
                entries={mockLeaderboard} 
                currentUserId="1"
                title="Top 5 Cette Semaine"
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Activité Récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">+50 points pour scan émotionnel quotidien</span>
                      <span className="text-xs text-muted-foreground ml-auto">Il y a 2h</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Badge "Explorateur" débloqué</span>
                      <span className="text-xs text-muted-foreground ml-auto">Hier</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Niveau 5 atteint !</span>
                      <span className="text-xs text-muted-foreground ml-auto">Il y a 3 jours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="badges">
          <BadgeShowcase />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <LeaderboardCard 
              entries={mockLeaderboard} 
              currentUserId="1"
              title="Classement Hebdomadaire"
            />
            <LeaderboardCard 
              entries={mockLeaderboard.map(entry => ({ ...entry, points: entry.points * 4 }))} 
              currentUserId="1"
              title="Classement Mensuel"
            />
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Succès et Accomplissements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Premier pas</h3>
                      <p className="text-sm text-muted-foreground">Terminé</p>
                    </div>
                  </div>
                  <p className="text-sm">Effectuer votre premier scan émotionnel</p>
                  <div className="mt-2 text-xs text-green-600 font-medium">+100 points</div>
                </div>

                <div className="p-4 rounded-lg border bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Régularité</h3>
                      <p className="text-sm text-muted-foreground">En cours</p>
                    </div>
                  </div>
                  <p className="text-sm">Utiliser l'app 7 jours consécutifs</p>
                  <div className="mt-2 text-xs text-blue-600 font-medium">5/7 jours</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationPage;
