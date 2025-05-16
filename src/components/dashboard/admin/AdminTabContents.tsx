
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import LineChart from '@/components/dashboard/charts/LineChart';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { Badge, Challenge, LeaderboardEntry, GamificationStats } from '@/types/gamification';
import LeaderboardWidget from '../widgets/LeaderboardWidget';
import BadgesWidget from '../widgets/BadgesWidget';
import ChallengesList from '@/components/gamification/ChallengesList';

interface AdminTabContentsProps {
  dashboardStats?: any;
  gamificationData?: GamificationStats;
  onCompleteChallenge?: (id: string) => Promise<boolean>;
}

export const AdminTabContents = ({ 
  dashboardStats, 
  gamificationData,
  onCompleteChallenge 
}: AdminTabContentsProps) => {
  // Mock badges data
  const badges: Badge[] = [
    {
      id: '1',
      name: 'Super admin',
      description: 'Gérer les paramètres administrateur avancés',
      image_url: '/badges/admin.png',
      tier: 'bronze',
      unlockedAt: '2023-05-12'
    },
    {
      id: '2',
      name: 'Analytics Pro',
      description: 'Expertise en analyse des données',
      image_url: '/badges/analytics.png',
      tier: 'silver',
      unlockedAt: '2023-06-25'
    },
    {
      id: '3',
      name: 'Invitations Master',
      description: 'Inviter plus de 50 utilisateurs',
      image_url: '/badges/invite.png',
      tier: 'gold'
    }
  ];
  
  // Mock leaderboard data
  const leaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      name: 'Thomas Martin',
      avatar: '/avatars/user1.jpg',
      points: 1250,
      rank: 1,
      trend: 'up',
      userId: 'user-001',
    },
    {
      id: '2',
      name: 'Sophie Durand',
      avatar: '/avatars/user2.jpg',
      points: 980,
      rank: 2,
      trend: 'stable',
      userId: 'user-002',
    },
    {
      id: '3',
      name: 'Jean Petit',
      avatar: '/avatars/user3.jpg',
      points: 760,
      rank: 3,
      trend: 'down',
      userId: 'user-003',
    }
  ];
  
  // Mock challenges
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Engagement personnel',
      description: 'Participer aux défis de la semaine',
      category: 'Admin',
      points: 200,
      completed: false,
      progress: 40,
      deadline: new Date().toISOString(),
      status: 'active'
    },
    {
      id: '2',
      title: 'Analyser les données',
      description: 'Examiner les rapports hebdomadaires',
      category: 'Analytics',
      points: 150,
      completed: true,
      progress: 100,
      status: 'completed'
    }
  ];
  
  // Mock emotions data for pie chart
  const emotionData = [
    { name: 'Joie', value: 35, color: '#4CAF50' },
    { name: 'Calme', value: 25, color: '#2196F3' },
    { name: 'Énergie', value: 15, color: '#FF9800' },
    { name: 'Stress', value: 10, color: '#F44336' },
    { name: 'Focus', value: 15, color: '#9C27B0' }
  ];
  
  // Mock data for line chart
  const lineData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(2023, 4, i + 1).toISOString().split('T')[0],
    value: Math.floor(Math.random() * 50) + 50
  }));
  
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
        <TabsTrigger value="emotions">Émotions</TabsTrigger>
        <TabsTrigger value="engagement">Engagement</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Défis à venir</CardTitle>
              <CardDescription>Défis planifiés pour les prochains jours</CardDescription>
            </CardHeader>
            <CardContent>
              <ChallengesList 
                challenges={challenges} 
                onComplete={onCompleteChallenge}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Badges d'administration</CardTitle>
              <CardDescription>Badges disponibles pour les administrateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <BadgesWidget 
                badges={badges}
                title="Badges Admin"
                onSeeAll={() => console.log('View all admin badges')}
              />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Classement des Utilisateurs</CardTitle>
            <CardDescription>Les utilisateurs les plus actifs cette semaine</CardDescription>
          </CardHeader>
          <CardContent>
            <LeaderboardWidget 
              leaderboard={leaderboard}
              title="Classement"
              onSeeAll={() => console.log('View all leaderboard')}
            />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="emotions" className="space-y-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Distribution des émotions</CardTitle>
            <CardDescription>Répartition des émotions signalées par les utilisateurs</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={emotionData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {emotionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tendance émotionnelle</CardTitle>
            <CardDescription>Évolution des scores émotionnels moyens au fil du temps</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <LineChart data={lineData} />
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="engagement" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Sessions les plus populaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium">Session #{i + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 100) + 100} utilisateurs
                        </p>
                      </div>
                    </div>
                    <BadgeComponent variant="outline">{['Facile', 'Moyen', 'Difficile'][i % 3]}</BadgeComponent>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Statistiques d'engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Sessions terminées:</span>
                  <span className="font-medium">1,234</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Temps moyen par session:</span>
                  <span className="font-medium">24 min</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Taux de complétion:</span>
                  <span className="font-medium">87%</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Utilisateurs actifs:</span>
                  <span className="font-medium">342</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Nouvelles inscriptions:</span>
                  <span className="font-medium">45</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
};
