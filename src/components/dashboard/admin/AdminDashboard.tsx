
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import PeriodSelector from './PeriodSelector';
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
  BarChart2, MessageSquare, Trophy, Sparkles, 
  ShieldCheck, CalendarDays, Settings, Activity, LineChart 
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("vue-globale");
  const [timePeriod, setTimePeriod] = useState<string>("30");
  const [absenteeismData, setAbsenteeismData] = useState<Array<{ date: string; value: number }>>([]);
  const [productivityData, setProductivityData] = useState<Array<{ date: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mock data for emotional climate
  const emotionalScoreTrend = [
    { date: '1/5', value: 72 },
    { date: '2/5', value: 75 },
    { date: '3/5', value: 78 },
    { date: '4/5', value: 80 }
  ];

  // Mock data for Social Cocoon section
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

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        
        // Simulation de chargement des données
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Données de démonstration pour l'absentéisme
        const absentData = Array.from({ length: 15 }, (_, i) => ({
          date: `${i+1}/5`,
          value: 4 + Math.floor(Math.random() * 5)
        }));
        
        // Données de démonstration pour la productivité
        const prodData = Array.from({ length: 15 }, (_, i) => ({
          date: `${i+1}/5`,
          value: 85 + Math.floor(Math.random() * 10)
        }));
        
        setAbsenteeismData(absentData);
        setProductivityData(prodData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, [timePeriod]);
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section with Period Selector */}
      <div className="mb-10 animate-fade-in">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div>
            <h1 className="text-4xl font-light">Tableau de bord <span className="font-semibold">Direction</span></h1>
            <h2 className="text-xl text-muted-foreground mt-2">
              Métriques globales et anonymisées
            </h2>
          </div>
          <PeriodSelector timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <Tabs defaultValue="vue-globale" className="mb-8" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4 bg-white/50 backdrop-blur-sm">
          <TabsTrigger value="vue-globale">
            <BarChart2 className="mr-2 h-4 w-4" />
            Vue Globale
          </TabsTrigger>
          <TabsTrigger value="scan-team">
            <Activity className="mr-2 h-4 w-4" />
            Scan Émotionnel
          </TabsTrigger>
          <TabsTrigger value="journal-trends">
            <LineChart className="mr-2 h-4 w-4" />
            Journal
          </TabsTrigger>
          <TabsTrigger value="social-cocoon">
            <MessageSquare className="mr-2 h-4 w-4" />
            Social Cocoon
          </TabsTrigger>
          <TabsTrigger value="gamification">
            <Trophy className="mr-2 h-4 w-4" />
            Gamification
          </TabsTrigger>
          <TabsTrigger value="actions-rh">
            <Sparkles className="mr-2 h-4 w-4" />
            Actions RH
          </TabsTrigger>
          <TabsTrigger value="events">
            <CalendarDays className="mr-2 h-4 w-4" />
            Événements
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Conformité
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>
        
        {/* Tab Contents */}
        <TabsContent value="vue-globale" className="mt-6">
          <GlobalOverviewTab 
            absenteeismData={absenteeismData}
            emotionalScoreTrend={emotionalScoreTrend}
            isLoading={isLoading}
            socialCocoonData={socialCocoonData}
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
      </Tabs>
      
      <div className="mt-8 text-center text-xs text-muted-foreground">
        <p>Données sécurisées avec chiffrement AES-256 • Conforme RGPD</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
