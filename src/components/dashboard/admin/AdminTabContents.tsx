
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import GlobalOverviewTab from './tabs/GlobalOverviewTab';
import ScanTeamTab from './tabs/ScanTeamTab';
import JournalTrendsTab from './tabs/JournalTrendsTab';
import SocialCocoonTab from './tabs/SocialCocoonTab';
import GamificationTab from './tabs/GamificationTab';
import HRActionsTab from './tabs/HRActionsTab';
import EventsCalendarTab from './tabs/EventsCalendarTab';
import ComplianceTab from './tabs/ComplianceTab';
import AdminSettingsTab from './tabs/AdminSettingsTab';
import { 
  socialCocoonData,
  gamificationData,
  rhSuggestions,
  eventsData,
  complianceData
} from './data/mockData';

interface AdminTabContentsProps {
  activeTab: string;
  absenteeismData: Array<{ date: string; value: number }>;
  emotionalScoreTrend: Array<{ date: string; value: number }>;
  dashboardStats: {
    productivity: {
      current: number;
      trend: number;
    };
    emotionalScore: {
      current: number;
      trend: number;
    };
  };
}

const AdminTabContents: React.FC<AdminTabContentsProps> = ({ 
  activeTab,
  absenteeismData,
  emotionalScoreTrend,
  dashboardStats
}) => {
  return (
    <>
      <TabsContent value="vue-globale" className="mt-6">
        <GlobalOverviewTab 
          absenteeismChartData={absenteeismData}
          emotionalScoreTrend={emotionalScoreTrend}
          dashboardStats={dashboardStats}
          gamificationData={gamificationData}
        />
      </TabsContent>
      
      <TabsContent value="scan-team" className="mt-6">
        <ScanTeamTab 
          emotionalScoreTrend={emotionalScoreTrend} 
          currentScore={78}
        />
      </TabsContent>
      
      <TabsContent value="journal-trends" className="mt-6">
        <JournalTrendsTab />
      </TabsContent>
      
      <TabsContent value="social-cocoon" className="mt-6">
        <SocialCocoonTab socialCocoonData={socialCocoonData} />
      </TabsContent>
      
      <TabsContent value="gamification" className="mt-6">
        <GamificationTab gamificationData={gamificationData} />
      </TabsContent>
      
      <TabsContent value="actions-rh" className="mt-6">
        <HRActionsTab rhSuggestions={rhSuggestions} />
      </TabsContent>
      
      <TabsContent value="events" className="mt-6">
        <EventsCalendarTab eventsData={eventsData} />
      </TabsContent>
      
      <TabsContent value="compliance" className="mt-6">
        <ComplianceTab complianceData={complianceData} />
      </TabsContent>
      
      <TabsContent value="settings" className="mt-6">
        <AdminSettingsTab />
      </TabsContent>
    </>
  );
};

export default AdminTabContents;
