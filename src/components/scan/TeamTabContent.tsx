
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User } from '@/types';
import TeamOverview from './TeamOverview';
import TeamActivityChart from './TeamActivityChart';
import TeamMoodTimeline from './TeamMoodTimeline';

// Mock user data
const mockUsers: Partial<User>[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    role: 'b2b-user',
    emotional_score: 75,
    anonymity_code: 'JD-123',
    avatar_url: ''
  },
  {
    id: '2',
    name: 'Marie Leroy',
    role: 'b2b-user',
    emotional_score: 62,
    anonymity_code: 'ML-456',
    avatar_url: ''
  },
  {
    id: '3',
    name: 'Alex Moreau',
    role: 'b2b-user',
    emotional_score: 88,
    anonymity_code: 'AM-789',
    avatar_url: ''
  },
  {
    id: '4',
    name: 'Sophie Bernard',
    role: 'b2b-user',
    emotional_score: 45,
    anonymity_code: 'SB-012',
    avatar_url: ''
  }
];

interface TeamTabContentProps {
  onTeamMemberSelect?: (userId: string) => void;
}

const TeamTabContent: React.FC<TeamTabContentProps> = ({ onTeamMemberSelect }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Vue d'équipe</CardTitle>
          <CardDescription>
            Aperçu anonymisé de l'état émotionnel de votre équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="activity">Activité</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <TeamOverview users={mockUsers} onUserClick={onTeamMemberSelect} />
            </TabsContent>
            
            <TabsContent value="activity">
              <TeamActivityChart />
            </TabsContent>
            
            <TabsContent value="timeline">
              <TeamMoodTimeline />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamTabContent;
