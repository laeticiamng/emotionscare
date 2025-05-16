
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BadgesWidget from '@/components/dashboard/widgets/BadgesWidget';
import { Badge } from '@/types/badge';

// Mock data
const badges: Badge[] = [
  {
    id: '1',
    name: 'Premier Pas',
    description: 'Compléter votre première entrée de journal',
    image_url: '/icons/badges/first-step.svg',
    icon: '/icons/badges/first-step.svg',
    rarity: 'common',
    unlocked: true,
  },
  {
    id: '2',
    name: 'Zen Master',
    description: '10 méditations complétées',
    image_url: '/icons/badges/zen-master.svg',
    icon: '/icons/badges/zen-master.svg',
    rarity: 'uncommon',
    unlocked: true,
  },
  {
    id: '3',
    name: 'Explorateur Musical',
    description: 'Écouter 5 types de musiques thérapeutiques',
    image_url: '/icons/badges/music-explorer.svg',
    icon: '/icons/badges/music-explorer.svg',
    rarity: 'rare',
    unlocked: false,
    progress: 3,
    maxProgress: 5,
  }
];

const GamificationDashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Gamification</h1>
      
      <Tabs defaultValue="badges">
        <TabsList className="mb-4">
          <TabsTrigger value="badges">Badges</TabsTrigger>
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="rewards">Récompenses</TabsTrigger>
          <TabsTrigger value="leaderboard">Classement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="badges">
          <Card>
            <CardHeader>
              <CardTitle>Vos badges</CardTitle>
            </CardHeader>
            <CardContent>
              <BadgesWidget badges={badges} showSeeAll={false} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="challenges">
          <Card>
            <CardHeader>
              <CardTitle>Challenges en cours</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Contenu des challenges à venir</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rewards">
          <Card>
            <CardHeader>
              <CardTitle>Récompenses disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Contenu des récompenses à venir</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Classement</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Contenu du classement à venir</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationDashboard;
