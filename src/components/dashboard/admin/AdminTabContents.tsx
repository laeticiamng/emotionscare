
import React from 'react';
import { TabsContent } from '@/components/ui';
import GlobalOverviewTab from './tabs/GlobalOverviewTab';
import EmotionsTab from './tabs/EmotionsTab';
import ActivityTab from './tabs/ActivityTab';
import TeamsTab from './tabs/TeamsTab';
import { Badge } from '@/types/gamification';
import { Challenge } from '@/types/gamification';

// Mock badge data for the gamification tab
const mockBadges: Badge[] = [
  {
    id: "1",
    name: "Super Mentor",
    description: "A aidé 50 collaborateurs avec leurs défis émotionnels",
    image: "/images/badges/super-mentor.png",
    imageUrl: "/images/badges/super-mentor.png",
    category: "community",
    tier: "platinum",
    unlockedAt: "2023-10-15",
    completed: true
  },
  {
    id: "2",
    name: "Explorateur émotionnel",
    description: "A identifié et partagé 20 émotions différentes",
    image: "/images/badges/emotion-explorer.png",
    imageUrl: "/images/badges/emotion-explorer.png",
    category: "emotion",
    tier: "gold",
    unlockedAt: "2023-09-22",
    completed: true
  },
  {
    id: "3",
    name: "Journal introspectif",
    description: "A complété 30 entrées de journal émotionnel",
    image: "/images/badges/introspective-journal.png",
    imageUrl: "/images/badges/introspective-journal.png",
    category: "journal",
    tier: "silver",
    completed: false
  }
];

// Mock challenges data for the gamification tab  
const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Scan quotidien",
    description: "Effectuez un scan émotionnel chaque jour pendant 7 jours",
    category: "daily",
    points: 100,
    progress: 5,
    goal: 7,
    total: 7,
    completed: false,
    status: "active",
    deadline: new Date(Date.now() + 86400000 * 2).toISOString()
  },
  {
    id: "2",
    title: "Journal hebdomadaire",
    description: "Rédigez 3 entrées de journal cette semaine",
    category: "weekly",
    points: 150,
    progress: 2,
    goal: 3,
    total: 3,
    completed: false,
    status: "active",
    deadline: new Date(Date.now() + 86400000 * 5).toISOString()
  },
  {
    id: "3",
    title: "Mentorat",
    description: "Aidez 5 collègues avec leurs défis émotionnels",
    category: "monthly",
    points: 300,
    progress: 5,
    goal: 5,
    total: 5,
    completed: true,
    status: "completed"
  }
];

export const AdminTabContents: React.FC = () => {
  return (
    <>
      <TabsContent value="global" className="space-y-4">
        <GlobalOverviewTab />
      </TabsContent>
      
      <TabsContent value="emotions" className="space-y-4">
        <EmotionsTab />
      </TabsContent>

      <TabsContent value="activity" className="space-y-4">
        <ActivityTab />
      </TabsContent>

      <TabsContent value="teams" className="space-y-4">
        <TeamsTab />
      </TabsContent>
    </>
  );
};

export default AdminTabContents;
