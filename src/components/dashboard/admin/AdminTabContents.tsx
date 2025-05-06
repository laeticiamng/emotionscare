
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import GlobalOverviewTab from '@/components/dashboard/admin/tabs/GlobalOverviewTab';
import GamificationTab from './tabs/GamificationTab';
import JournalTrendsTab from './tabs/JournalTrendsTab';
import ScanTeamTab from './tabs/ScanTeamTab';
import SocialCocoonTab from './tabs/SocialCocoonTab';
import EventsCalendarTab from './tabs/EventsCalendarTab';
import ComplianceTab from './tabs/ComplianceTab';
import HRActionsTab from './tabs/HRActionsTab';
import AdminSettingsTab from './tabs/AdminSettingsTab';
import PaginationSettings from './settings/PaginationSettings';
import WeatherActivitiesTab from './tabs/weather/WeatherActivitiesTab';
import { ChartData } from '@/components/dashboard/admin/tabs/overview/types';
import { DashboardStats } from '@/components/dashboard/admin/tabs/overview/types';

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
  // Dummy data for tabs that require props
  const gamificationData = {
    activeUsers: 85,
    totalChallenges: 24,
    completionRate: 68,
    topPerformers: []
  };

  const scanTeamData = {
    emotionalScoreTrend,
    currentScore: 78
  };

  const socialCocoonData = {
    posts: 248,
    engagementRate: 72,
    topTags: ['#bienetre', '#entraide', '#motivation']
  };

  const eventsData = {
    upcoming: 5,
    registered: 120,
    attendance: 85
  };

  const hrSuggestions = {
    total: 12,
    priority: 3,
    resolved: 8
  };

  const complianceData = {
    completionRate: 94,
    pendingReports: 3,
    lastUpdate: '2025-04-28'
  };

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
        <GamificationTab gamificationData={gamificationData} />
      </TabsContent>
      
      <TabsContent value="scan-equipe" className="animate-in fade-in-50">
        <ScanTeamTab {...scanTeamData} />
      </TabsContent>
      
      <TabsContent value="journal" className="animate-in fade-in-50">
        <JournalTrendsTab />
      </TabsContent>
      
      <TabsContent value="social-cocoon" className="animate-in fade-in-50">
        <SocialCocoonTab socialCocoonData={socialCocoonData} />
      </TabsContent>
      
      <TabsContent value="calendrier" className="animate-in fade-in-50">
        <EventsCalendarTab eventsData={eventsData} />
      </TabsContent>
      
      <TabsContent value="rh" className="animate-in fade-in-50">
        <HRActionsTab rhSuggestions={hrSuggestions} />
      </TabsContent>
      
      <TabsContent value="conformite" className="animate-in fade-in-50">
        <ComplianceTab complianceData={complianceData} />
      </TabsContent>
      
      <TabsContent value="meteo-activites" className="animate-in fade-in-50">
        <WeatherActivitiesTab />
      </TabsContent>
      
      <TabsContent value="parametres" className="space-y-8 animate-in fade-in-50">
        <AdminSettingsTab />
        
        {/* Pagination Settings Section */}
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
