
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import GlobalOverviewTab from './tabs/GlobalOverviewTab';
import ScanTeamTab from './tabs/ScanTeamTab';
import SocialCocoonTab from './tabs/SocialCocoonTab';
import GamificationTab from './tabs/GamificationTab';
import EventsCalendarTab from './tabs/EventsCalendarTab';
import JournalTrendsTab from './tabs/JournalTrendsTab';
import HRActionsTab from './tabs/HRActionsTab';
import ComplianceTab from './tabs/ComplianceTab';
import WeatherActivitiesTab from './tabs/weather/WeatherActivitiesTab';
import AdminSettingsTab from './tabs/AdminSettingsTab';
import UsersListTab from './tabs/UsersListTab';
import ActivityLogsTab from './tabs/ActivityLogsTab';
import { DashboardStats } from './tabs/overview/types';
import InvitationsTab from './tabs/invitations/InvitationsTab';
import { GamificationStats } from '@/types';

interface AdminTabContentsProps {
  activeTab: string;
  absenteeismData: Array<{ date: string; value: number }>;
  emotionalScoreTrend: Array<{ date: string; value: number }>;
  dashboardStats: DashboardStats;
  isLoading?: boolean;
}

const AdminTabContents: React.FC<AdminTabContentsProps> = ({
  activeTab,
  absenteeismData,
  emotionalScoreTrend,
  dashboardStats,
  isLoading = false
}) => {
  // Create gamification data with required dashboard properties
  const gamificationData: GamificationStats = {
    // Required base properties from GamificationStats
    points: 0,
    level: 1,
    badges: [],
    streak: 0,
    completedChallenges: 0,
    totalChallenges: 0,
    
    // Admin dashboard specific properties
    activeUsersPercent: 68,
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
    ],
    
    // Optional properties
    rank: "",
    activeChallenges: 0,
    streakDays: 0,
    nextLevelPoints: 0,
    progressToNextLevel: 0,
    totalPoints: 0,
    badgesCount: 0,
    challenges: [],
    recentAchievements: [],
    nextLevel: {
      points: 100,
      rewards: ["Badge Spécial", "Points bonus"]
    },
    currentLevel: 1,
    pointsToNextLevel: 0,
    lastActivityDate: new Date().toISOString()
  };
  
  const socialCocoonData = {
    totalPosts: 248,
    moderationRate: 3.2,
    topHashtags: [
      { tag: '#bienetre', count: 42 },
      { tag: '#entraide', count: 36 },
      { tag: '#motivation', count: 31 },
      { tag: '#teamspirit', count: 28 },
      { tag: '#pausecafe', count: 22 }
    ]
  };
  
  const eventsData = [
    { date: '2023-05-15', title: 'Atelier Mindfulness', status: 'upcoming', attendees: 24 },
    { date: '2023-05-22', title: 'Webinaire Bien-être', status: 'upcoming', attendees: 31 },
    { date: '2023-05-29', title: 'Session de Yoga', status: 'upcoming', attendees: 18 }
  ];
  
  const hrActionsData = [
    { title: 'Alerte Stress', description: 'Équipe Marketing', icon: 'alert-triangle' },
    { title: 'Demande Entretien', description: 'Sarah Martin', icon: 'message-square' },
    { title: 'Signalement Conflit', description: 'Département Tech', icon: 'flag' }
  ];
  
  const complianceData = {
    mfaEnabled: 87,
    lastKeyRotation: '2023-04-15',
    lastPentest: '2023-03-22',
    gdprCompliance: 'Conforme',
    dataRetention: '90 jours',
    certifications: ['ISO 27001', 'RGPD', 'HDS', 'SOC 2']
  };

  // Create compatible stats
  const compatibleStats = {
    ...dashboardStats,
    activeUsers: dashboardStats.activeToday || 0,
    averageEmotionalScore: dashboardStats.averageScore || 0,
    absenteeismRate: 0
  };
  
  return (
    <>
      <TabsContent value="vue-globale" className="mt-0">
        <GlobalOverviewTab 
          absenteeismChartData={absenteeismData}
          emotionalScoreTrend={emotionalScoreTrend}
          dashboardStats={compatibleStats}
          gamificationData={gamificationData}
          isLoading={isLoading}
          kpiCards={[]}
        />
      </TabsContent>
      
      <TabsContent value="scan-equipe" className="mt-0">
        <ScanTeamTab 
          emotionalScoreTrend={emotionalScoreTrend} 
          currentScore={dashboardStats.averageScore || 75}
          isLoading={isLoading} 
        />
      </TabsContent>
      
      <TabsContent value="social-cocoon" className="mt-0">
        <SocialCocoonTab socialCocoonData={socialCocoonData} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="gamification" className="mt-0">
        <GamificationTab gamificationData={gamificationData} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="evenements" className="mt-0">
        <EventsCalendarTab eventsData={eventsData} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="journal-trends" className="mt-0">
        <JournalTrendsTab isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="actions-rh" className="mt-0">
        <HRActionsTab rhSuggestions={hrActionsData} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="compliance" className="mt-0">
        <ComplianceTab complianceData={complianceData} isLoading={isLoading} />
      </TabsContent>
      
      <TabsContent value="weather-activities" className="mt-0">
        <WeatherActivitiesTab />
      </TabsContent>
      
      <TabsContent value="users-list" className="mt-0">
        <UsersListTab />
      </TabsContent>
      
      <TabsContent value="activity-logs">
        <ActivityLogsTab />
      </TabsContent>
      
      <TabsContent value="admin-settings" className="mt-0">
        <AdminSettingsTab />
      </TabsContent>
      
      <TabsContent value="invitations">
        <InvitationsTab />
      </TabsContent>
    </>
  );
};

export default AdminTabContents;
