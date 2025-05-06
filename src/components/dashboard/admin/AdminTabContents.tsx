
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import GlobalOverviewTab from './tabs/overview/GlobalOverviewTab';
import GamificationTab from './tabs/GamificationTab';
import JournalTrendsTab from './tabs/JournalTrendsTab';
import ScanTeamTab from './tabs/ScanTeamTab';
import SocialCocoonTab from './tabs/SocialCocoonTab';
import EventsCalendarTab from './tabs/EventsCalendarTab';
import ComplianceTab from './tabs/ComplianceTab';
import HRActionsTab from './tabs/HRActionsTab';
import AdminSettingsTab from './tabs/AdminSettingsTab';
import PaginationSettings from './settings/PaginationSettings';
import { ChartData } from './tabs/overview/types';
import { DashboardStats } from './tabs/overview/types';

interface AdminTabContentsProps {
  activeTab: string;
  absenteeismData: ChartData[];
  emotionalScoreTrend: ChartData[];
  dashboardStats: DashboardStats;
}

const AdminTabContents: React.FC<AdminTabContentsProps> = ({
  activeTab,
  absenteeismData,
  emotionalScoreTrend,
  dashboardStats,
}) => {
  return (
    <>
      <TabsContent value="vue-globale" className="space-y-4 animate-in fade-in-50">
        <GlobalOverviewTab 
          absenteeismData={absenteeismData} 
          emotionalScoreTrend={emotionalScoreTrend}
          dashboardStats={dashboardStats}
        />
      </TabsContent>
      
      <TabsContent value="gamification" className="animate-in fade-in-50">
        <GamificationTab />
      </TabsContent>
      
      <TabsContent value="scan-equipe" className="animate-in fade-in-50">
        <ScanTeamTab />
      </TabsContent>
      
      <TabsContent value="journal" className="animate-in fade-in-50">
        <JournalTrendsTab />
      </TabsContent>
      
      <TabsContent value="social-cocoon" className="animate-in fade-in-50">
        <SocialCocoonTab />
      </TabsContent>
      
      <TabsContent value="calendrier" className="animate-in fade-in-50">
        <EventsCalendarTab />
      </TabsContent>
      
      <TabsContent value="rh" className="animate-in fade-in-50">
        <HRActionsTab />
      </TabsContent>
      
      <TabsContent value="conformite" className="animate-in fade-in-50">
        <ComplianceTab />
      </TabsContent>
      
      <TabsContent value="parametres" className="space-y-8 animate-in fade-in-50">
        <AdminSettingsTab />
        
        {/* New Pagination Settings Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Paramètres d'affichage et pagination</h2>
          <p className="text-muted-foreground">
            Configurez les options de pagination et d'affichage des données pour tous les utilisateurs de l'application.
          </p>
          <PaginationSettings />
        </div>
      </TabsContent>
    </>
  );
};

export default AdminTabContents;
