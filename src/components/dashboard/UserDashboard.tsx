
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, BarChart2, Settings, Users, Rocket } from 'lucide-react';
import EmotionalOverviewTab from './tabs/EmotionalOverviewTab';
import JournalTab from './tabs/JournalTab';
import GamificationTab from './tabs/GamificationTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import TeamTab from './tabs/TeamTab';
import SettingsTab from './tabs/SettingsTab';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardContentProps {
  children: React.ReactNode;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ children }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow overflow-auto p-1">{children}</div>
    </div>
  );
};

const UserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { preferences } = useUserPreferences();
  const { user } = useAuth();
  const isB2B = user?.role === 'b2b';

  return (
    <div className="flex flex-col h-full">
      {/* En-tête du tableau de bord */}
      <header className="flex justify-between items-center pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue, {user?.name || 'utilisateur'} • {new Date().toLocaleDateString()}
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nouveau scan
        </Button>
      </header>

      {/* Onglets principaux */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="flex-grow flex flex-col"
      >
        <TabsList className="grid grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="overview">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Vue d'ensemble</span>
          </TabsTrigger>
          <TabsTrigger value="journal">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Journal</span>
          </TabsTrigger>
          <TabsTrigger value="gamification">
            <Rocket className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Progression</span>
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Analytique</span>
          </TabsTrigger>
          {isB2B && (
            <TabsTrigger value="team">
              <Users className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Équipe</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Paramètres</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-grow mt-4 overflow-hidden">
          <TabsContent value="overview" className="h-full">
            <DashboardContent>
              <EmotionalOverviewTab />
            </DashboardContent>
          </TabsContent>

          <TabsContent value="journal" className="h-full">
            <DashboardContent>
              <JournalTab />
            </DashboardContent>
          </TabsContent>

          <TabsContent value="gamification" className="h-full">
            <DashboardContent>
              <GamificationTab />
            </DashboardContent>
          </TabsContent>

          <TabsContent value="analytics" className="h-full">
            <DashboardContent>
              <AnalyticsTab />
            </DashboardContent>
          </TabsContent>

          {isB2B && (
            <TabsContent value="team" className="h-full">
              <DashboardContent>
                <TeamTab />
              </DashboardContent>
            </TabsContent>
          )}

          <TabsContent value="settings" className="h-full">
            <DashboardContent>
              <SettingsTab />
            </DashboardContent>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
