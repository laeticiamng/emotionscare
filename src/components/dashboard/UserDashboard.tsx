
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalOverviewTab from './tabs/GlobalOverviewTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import JournalTab from './tabs/JournalTab';
import TeamTab from './tabs/TeamTab';
import { User } from '@/types/user';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  // Vérifier si l'utilisateur a un rôle d'entreprise (B2B)
  const isB2BUser = user.role === 'b2b_user' || user.role === 'b2b_admin';
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 gap-2">
          <TabsTrigger value="overview">Vue globale</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          {isB2BUser && <TabsTrigger value="team">Équipe</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="overview">
          <GlobalOverviewTab className="w-full" />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsTab className="w-full" />
        </TabsContent>
        
        <TabsContent value="journal">
          <JournalTab className="w-full" />
        </TabsContent>
        
        {isB2BUser && (
          <TabsContent value="team">
            <TeamTab className="w-full" />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default UserDashboard;
