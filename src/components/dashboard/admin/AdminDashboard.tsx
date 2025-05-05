
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  BarChart2,
  MessageSquare,
  Trophy,
  Sparkles,
  ShieldCheck,
  CalendarDays,
  Settings,
  Activity,
  LineChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import PeriodSelector from './PeriodSelector';

// Import all tab components
import GlobalOverviewTab from './tabs/GlobalOverviewTab';
import ScanTeamTab from './tabs/ScanTeamTab';
import JournalTrendsTab from './tabs/JournalTrendsTab';
import SocialCocoonTab from './tabs/SocialCocoonTab';
import GamificationTab from './tabs/GamificationTab';
import HRActionsTab from './tabs/HRActionsTab';
import EventsCalendarTab from './tabs/EventsCalendarTab';
import ComplianceTab from './tabs/ComplianceTab';
import AdminSettingsTab from './tabs/AdminSettingsTab';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("vue-globale");
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  // Mock data for the dashboard
  const dashboardStats = {
    absenteeism: {
      current: 5.2,
      previous: 7.8,
      trend: -2.6,
      data: [4, 5, 7, 5, 6, 5, 4, 5, 3, 4, 5, 6, 5, 4, 3]
    },
    emotionalScore: {
      current: 78,
      previous: 72,
      trend: 6,
      data: [72, 71, 73, 74, 76, 77, 75, 78, 79, 78, 77, 78, 79, 80, 78]
    },
    productivity: {
      current: 92,
      previous: 87,
      trend: 5,
      data: [85, 86, 88, 87, 89, 90, 91, 92, 93, 92, 91, 92, 92, 93, 92]
    },
    journalEntries: [
      { date: '2024-05-01', avgScore: 76, checkIns: 42 },
      { date: '2024-05-02', avgScore: 78, checkIns: 38 },
      { date: '2024-05-03', avgScore: 75, checkIns: 45 },
      { date: '2024-05-04', avgScore: 79, checkIns: 40 },
      { date: '2024-05-05', avgScore: 80, checkIns: 37 }
    ]
  };

  // Mock data for social cocoon section
  const socialCocoonData = {
    totalPosts: 248,
    moderationRate: 3.2,
    activeUsers: 87,
    topHashtags: [
      { tag: '#bienetre', count: 42 },
      { tag: '#entraide', count: 36 },
      { tag: '#motivation', count: 31 },
      { tag: '#teamspirit', count: 28 },
      { tag: '#pausecafe', count: 22 }
    ]
  };

  // Mock data for gamification section
  const gamificationData = {
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
    ]
  };

  // Mock RH action suggestions
  const rhSuggestions = [
    {
      title: "Atelier Respiration",
      description: "Session de 30 minutes sur techniques de respiration anti-stress.",
      icon: "🧘"
    },
    {
      title: "Pause café virtuelle",
      description: "Encourager les échanges entre services via breaks virtuels.",
      icon: "☕"
    },
    {
      title: "Challenge bien-être",
      description: "Lancer un défi quotidien de micro-pauses actives.",
      icon: "🏆"
    }
  ];

  // Mock events data
  const eventsData = [
    { date: '2025-05-10', title: 'Atelier Méditation', status: 'confirmed', attendees: 12 },
    { date: '2025-05-15', title: 'Webinar Gestion du Stress', status: 'pending', attendees: 25 },
    { date: '2025-05-20', title: 'Rétrospective Mensuelle', status: 'confirmed', attendees: 18 }
  ];

  // Mock compliance data
  const complianceData = {
    mfaEnabled: 92,
    lastKeyRotation: '2025-04-15',
    lastPentest: '2025-03-20',
    gdprCompliance: 'Complet',
    dataRetention: 'Conforme',
    certifications: ['ISO 27001', 'RGPD', 'HDS']
  };

  // Convert dashboard data to the format expected by components
  const absenteeismChartData = dashboardStats.absenteeism.data.map((value, index) => ({
    date: `${index+1}/5`,
    value
  }));
  
  const emotionalScoreTrend = dashboardStats.emotionalScore.data.map((value, index) => ({
    date: `${index+1}/5`,
    value
  }));

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-[#1B365D]">Dashboard Direction</h1>
        <p className="text-slate-600 italic">Pilotage & Bien-être Collectif</p>
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="vue-globale" className="mb-8" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="vue-globale" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <BarChart2 className="mr-2 h-4 w-4" />
            Vue Globale
          </TabsTrigger>
          <TabsTrigger value="scan-team" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <Activity className="mr-2 h-4 w-4" />
            Scan Émotionnel - Équipe
          </TabsTrigger>
          <TabsTrigger value="journal-trends" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <LineChart className="mr-2 h-4 w-4" />
            Journal - Tendances
          </TabsTrigger>
          <TabsTrigger value="social-cocoon" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <MessageSquare className="mr-2 h-4 w-4" />
            Social Cocoon
          </TabsTrigger>
          <TabsTrigger value="gamification" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <Trophy className="mr-2 h-4 w-4" />
            Gamification
          </TabsTrigger>
          <TabsTrigger value="actions-rh" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <Sparkles className="mr-2 h-4 w-4" />
            Actions RH
          </TabsTrigger>
          <TabsTrigger value="events" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <CalendarDays className="mr-2 h-4 w-4" />
            Événements
          </TabsTrigger>
          <TabsTrigger value="compliance" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Conformité
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-full data-[state=active]:bg-[#1B365D]/10">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        <PeriodSelector timePeriod={selectedPeriod} setTimePeriod={setSelectedPeriod} />
        
        {/* Tab Contents */}
        <TabsContent value="vue-globale" className="mt-6">
          <GlobalOverviewTab 
            absenteeismChartData={absenteeismChartData}
            emotionalScoreTrend={emotionalScoreTrend}
            dashboardStats={dashboardStats} 
            gamificationData={gamificationData}
          />
        </TabsContent>
        
        <TabsContent value="scan-team" className="mt-6">
          <ScanTeamTab 
            emotionalScoreTrend={emotionalScoreTrend} 
            currentScore={dashboardStats.emotionalScore.current}
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
      </Tabs>
      
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>Données sécurisées avec chiffrement AES-256 • Conforme RGPD</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
