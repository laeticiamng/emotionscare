
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EmotionPieChart from '@/components/dashboard/charts/EmotionPieChart';
import WeeklyActivityChart from '@/components/dashboard/charts/WeeklyActivityChart';
import BadgesWidget from '@/components/dashboard/widgets/BadgesWidget';
import LeaderboardWidget from '@/components/dashboard/widgets/LeaderboardWidget';
import { LeaderboardEntry, Badge } from '@/types/gamification';

export const AdminTabContents: React.FC = () => {
  // Mock data
  const emotionData = [
    { name: 'Joie', value: 35, color: '#4CAF50' },
    { name: 'Calme', value: 25, color: '#2196F3' },
    { name: 'Énergie', value: 15, color: '#FF9800' },
    { name: 'Stress', value: 10, color: '#F44336' },
    { name: 'Focus', value: 15, color: '#9C27B0' }
  ];

  const activityData = [
    { day: 'Lun', value: 55 },
    { day: 'Mar', value: 70 },
    { day: 'Mer', value: 45 },
    { day: 'Jeu', value: 80 },
    { day: 'Ven', value: 65 },
    { day: 'Sam', value: 30 },
    { day: 'Dim', value: 25 }
  ];

  const badges: Badge[] = [
    {
      id: '1',
      name: 'Champion d\'équipe',
      description: 'Soutenu 10 collègues',
      image: '/badges/team-champion.png',
      category: 'team',
      rarity: 'rare',
      unlockedAt: '2023-04-01'
    },
    {
      id: '2',
      name: 'Bien-être collectif',
      description: 'Créé une initiative de bien-être',
      image: '/badges/wellbeing.png',
      category: 'wellness',
      rarity: 'epic',
    },
    {
      id: '3',
      name: 'Mentorat',
      description: 'Guidé 5 nouveaux membres',
      image: '/badges/mentor.png',
      category: 'leadership',
      rarity: 'legendary',
    }
  ];

  const leaderboard: LeaderboardEntry[] = [
    {
      id: '1',
      userId: '1',
      name: 'Équipe Marketing',
      avatar: '/teams/marketing.jpg',
      points: 1850,
      position: 1
    },
    {
      id: '2',
      userId: '2',
      name: 'Équipe Développement',
      avatar: '/teams/development.jpg',
      points: 1680,
      position: 2
    },
    {
      id: '3',
      userId: '3',
      name: 'Équipe Design',
      avatar: '/teams/design.jpg',
      points: 1540,
      position: 3
    }
  ];

  return (
    <>
      <TabsContent value="global">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendances émotionnelles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <EmotionPieChart data={emotionData} />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Activité de la plateforme</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <WeeklyActivityChart data={activityData} />
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="emotions">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des émotions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <EmotionPieChart data={emotionData} />
              </div>
            </CardContent>
          </Card>
          <BadgesWidget 
            badges={badges}
            title="Badges d'équipe" 
            onSeeAll={() => console.log('View all badges')} 
          />
        </div>
      </TabsContent>
      <TabsContent value="activity">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Activité hebdomadaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <WeeklyActivityChart data={activityData} />
              </div>
            </CardContent>
          </Card>
          <LeaderboardWidget 
            leaderboard={leaderboard}
            title="Classement des équipes" 
            onSeeAll={() => console.log('View all leaderboard')} 
          />
        </div>
      </TabsContent>
      <TabsContent value="teams">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance des équipes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Graphique de performance des équipes
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Distribution des ressources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Graphique de distribution des ressources
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </>
  );
};

export default AdminTabContents;
