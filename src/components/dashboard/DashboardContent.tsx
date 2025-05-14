
import React from 'react';
import { useUserMode } from '@/contexts/UserModeContext';
import { useAuth } from '@/contexts/AuthContext';
import { UserModeType } from '@/types';
import DashboardHeader from '@/components/dashboard/admin/DashboardHeader';
import EmotionalCheckIn from '@/components/dashboard/EmotionScanSection';
import EmotionalTrends from '@/components/dashboard/EmotionalTrends';
import RecentJournalEntries from '@/components/dashboard/RecentJournalEntries';
import UpcomingReminders from '@/components/dashboard/UpcomingReminders';
import CoachSuggestions from '@/components/dashboard/CoachSuggestions';
import TeamOverview from '../scan/TeamOverview';
import OrganizationStats from '@/components/admin/OrganizationStats';
import UserActivityChart from '@/components/admin/UserActivityChart';
import NewUsersCard from '@/components/admin/NewUsersCard';
import EmotionalHealthOverview from '@/components/admin/EmotionalHealthOverview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isAdminRole } from '@/utils/roleUtils';

// Mock data pour team overview
const mockTeamUsers = [
  {
    id: '1',
    name: 'Jane Smith',
    avatar_url: '',
    emotional_score: 82,
    anonymity_code: 'JS-2022'
  },
  {
    id: '2',
    name: 'John Doe',
    avatar_url: '',
    emotional_score: 65,
    anonymity_code: 'JD-2022'
  },
  {
    id: '3',
    name: 'Amy Johnson',
    avatar_url: '',
    emotional_score: 78,
    anonymity_code: 'AJ-2022'
  }
];

export interface DashboardContentProps {
  isMobile: boolean;
  minimalView: boolean;
  collapsedSections: { [key: string]: boolean };
  toggleSection: (section: string) => void;
  userId: string;
  latestEmotion?: { emotion: string; score: number; };
  userMode: UserModeType;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  isMobile,
  minimalView,
  collapsedSections,
  toggleSection,
  userId,
  latestEmotion,
  userMode
}) => {
  const { userMode: contextUserMode } = useUserMode();
  const { user } = useAuth();
  
  // Convert personal to b2c for backwards compatibility
  const normalizedUserMode = userMode === 'personal' ? 'b2c' as UserModeType : userMode;
  
  // Update comparisons to match normalized userMode
  const isB2BUser = normalizedUserMode === 'b2b-user';
  const isB2BAdmin = normalizedUserMode === 'b2b-admin';
  const isB2C = normalizedUserMode === 'b2c';
  const isAdmin = user ? isAdminRole(user.role) : false;
  
  // Render different dashboard based on user mode
  if (isB2BAdmin || (isAdmin && isB2BUser)) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <DashboardHeader />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Activité des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <UserActivityChart />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <OrganizationStats />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Nouveaux utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <NewUsersCard />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Santé émotionnelle</CardTitle>
            </CardHeader>
            <CardContent>
              <EmotionalHealthOverview />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (isB2BUser) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <DashboardHeader />
        
        <Tabs defaultValue="personal">
          <TabsList>
            <TabsTrigger value="personal">Personnel</TabsTrigger>
            <TabsTrigger value="team">Équipe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <EmotionalCheckIn 
                collapsed={collapsedSections['emotionalCheckin'] || false} 
                onToggle={() => toggleSection('emotionalCheckin')} 
              />
              <EmotionalTrends />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RecentJournalEntries />
              <UpcomingReminders />
            </div>
          </TabsContent>
          
          <TabsContent value="team" className="space-y-4">
            <TeamOverview users={mockTeamUsers} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  // Default B2C dashboard
  return (
    <div className="container mx-auto p-4 space-y-6">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EmotionalCheckIn 
          collapsed={collapsedSections['emotionalCheckin'] || false} 
          onToggle={() => toggleSection('emotionalCheckin')}
        />
        <EmotionalTrends />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecentJournalEntries />
        <CoachSuggestions />
      </div>
      
      <div className="grid grid-cols-1">
        <UpcomingReminders />
      </div>
    </div>
  );
};

export default DashboardContent;
