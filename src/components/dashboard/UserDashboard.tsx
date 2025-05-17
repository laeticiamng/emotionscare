
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from '@/types/user';

// Import des onglets du tableau de bord
import EmotionalOverviewTab from './tabs/EmotionalOverviewTab';
import JournalTab from './tabs/JournalTab';
import GamificationTab from './tabs/GamificationTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import TeamTab from './tabs/TeamTab';
import SettingsTab from './tabs/SettingsTab';

interface UserDashboardProps {
  user: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Déterminer si l'utilisateur est B2B ou B2C
  const isB2B = user.role === 'b2b';
  
  return (
    <div className="container mx-auto py-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tableau de bord de {user.name}</CardTitle>
        </CardHeader>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Aperçu émotionnel</TabsTrigger>
          <TabsTrigger value="journal">Journal</TabsTrigger>
          <TabsTrigger value="gamification">Gamification</TabsTrigger>
          <TabsTrigger value="analytics">Analytiques</TabsTrigger>
          {isB2B && <TabsTrigger value="team">Équipe</TabsTrigger>}
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <EmotionalOverviewTab />
        </TabsContent>
        
        <TabsContent value="journal">
          <JournalTab />
        </TabsContent>
        
        <TabsContent value="gamification">
          <GamificationTab />
        </TabsContent>
        
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
        
        {isB2B && (
          <TabsContent value="team">
            <TeamTab />
          </TabsContent>
        )}
        
        <TabsContent value="settings">
          <SettingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
