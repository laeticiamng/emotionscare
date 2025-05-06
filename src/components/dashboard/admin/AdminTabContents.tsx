
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
  isLoading?: boolean;
}

const AdminTabContents: React.FC<AdminTabContentsProps> = ({
  activeTab,
  absenteeismData,
  emotionalScoreTrend,
  dashboardStats,
  isLoading = false,
}) => {
  // Create properly formatted data for each component
  const gamificationData = {
    activeUsersPercent: 85,
    totalBadges: 24,
    badgeLevels: [
      { level: 'Bronze', count: 14 },
      { level: 'Argent', count: 7 },
      { level: 'Or', count: 3 }
    ],
    topChallenges: [
      { name: 'Check-in quotidien', completions: 156 },
      { name: 'Partage d\'expérience', completions: 87 },
      { name: 'Lecture bien-être', completions: 63 }
    ]
  };

  const scanTeamData = {
    emotionalScoreTrend,
    currentScore: 78
  };

  const socialCocoonData = {
    totalPosts: 248,
    moderationRate: 5.2,
    topHashtags: [
      { tag: '#bienetre', count: 42 },
      { tag: '#entraide', count: 36 },
      { tag: '#motivation', count: 31 }
    ]
  };

  const eventsData = [
    { date: '2025-05-10', title: 'Atelier Bien-être', status: 'confirmed', attendees: 24 },
    { date: '2025-05-15', title: 'Séance Méditation', status: 'pending', attendees: 18 },
    { date: '2025-05-22', title: 'Challenge d\'équipe', status: 'confirmed', attendees: 32 }
  ];

  const hrSuggestions = [
    { title: 'Séance de cohésion', description: 'Organiser un atelier pour renforcer l\'esprit d\'équipe', icon: '🤝' },
    { title: 'Journée bien-être', description: 'Proposer une journée dédiée aux activités de bien-être', icon: '🧘' },
    { title: 'Formation gestion du stress', description: 'Mettre en place des sessions sur la gestion du stress', icon: '🌿' }
  ];

  const complianceData = {
    mfaEnabled: 92,
    lastKeyRotation: '2025-04-15',
    lastPentest: '2025-03-22',
    gdprCompliance: 'Conforme',
    dataRetention: '30 jours',
    certifications: ['ISO 27001', 'RGPD', 'HDS']
  };

  return (
    <>
      <TabsContent value="vue-globale" className="space-y-4 animate-in fade-in-50">
        <GlobalOverviewTab 
          absenteeismChartData={absenteeismData} 
          emotionalScoreTrend={emotionalScoreTrend}
          dashboardStats={dashboardStats}
          gamificationData={gamificationData}
          isLoading={isLoading}
        />
      </TabsContent>
      
      <TabsContent value="gamification" className="animate-in fade-in-50">
        <GamificationTab gamificationData={gamificationData} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="scan-equipe" className="animate-in fade-in-50">
        <ScanTeamTab {...scanTeamData} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="journal" className="animate-in fade-in-50">
        <JournalTrendsTab isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="social-cocoon" className="animate-in fade-in-50">
        <SocialCocoonTab socialCocoonData={socialCocoonData} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="events" className="animate-in fade-in-50">
        <EventsCalendarTab eventsData={eventsData} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="actions-rh" className="animate-in fade-in-50">
        <HRActionsTab rhSuggestions={hrSuggestions} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="compliance" className="animate-in fade-in-50">
        <ComplianceTab complianceData={complianceData} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="meteo-activites" className="animate-in fade-in-50">
        <WeatherActivitiesTab />
      </TabsContent>
      
      <TabsContent value="settings" className="space-y-8 animate-in fade-in-50">
        <AdminSettingsTab />
        
        {/* Pagination Settings Section */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">Paramètres d'affichage et pagination</h2>
          <p className="text-muted-foreground mt-2">
            Configurez les options de pagination et d'affichage des données pour tous les utilisateurs de l'application.
          </p>
          <PaginationSettings />
        </div>
      </TabsContent>
    </>
  );
};

export default AdminTabContents;
