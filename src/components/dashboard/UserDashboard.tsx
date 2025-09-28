
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalOverviewTab from './tabs/GlobalOverviewTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import JournalTab from './tabs/JournalTab';
import PersonalDataTab from './tabs/PersonalDataTab';
import { User } from '@/types/user';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  // Les collaborateurs B2B n'ont accès qu'à leurs données personnelles
  const isB2BUser = user.role === 'b2b_user';
  
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord personnel</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-3 gap-2">
          <TabsTrigger value="overview">Vue globale</TabsTrigger>
          <TabsTrigger value="analytics">Mes analyses</TabsTrigger>
          <TabsTrigger value="journal">Mon journal</TabsTrigger>
          {/* Suppression de l'onglet équipe pour les collaborateurs */}
        </TabsList>
        
        <TabsContent value="overview">
          <GlobalOverviewTab className="w-full" userRole={user.role} />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsTab className="w-full" personalOnly={isB2BUser} />
        </TabsContent>
        
        <TabsContent value="journal">
          <JournalTab className="w-full" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
