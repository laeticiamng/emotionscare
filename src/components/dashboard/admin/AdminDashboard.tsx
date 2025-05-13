
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import PeriodSelector from '@/components/dashboard/admin/PeriodSelector';
import AdminChartSection from '@/components/dashboard/admin/AdminChartSection';
import EmotionalClimateCard from '@/components/dashboard/admin/EmotionalClimateCard';
import SocialCocoonCard from '@/components/dashboard/admin/SocialCocoonCard';
import GamificationSummaryCard from '@/components/dashboard/admin/GamificationSummaryCard';
import { useSegment } from '@/contexts/SegmentContext';
import DraggableKpiCardsGrid from './draggable/DraggableKpiCardsGrid';
import { DashboardWidgetConfig } from '@/types/dashboard';
import { toast } from '@/hooks/use-toast';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [absenteeismData, setAbsenteeismData] = useState<Array<{ date: string; value: number }>>([]);
  const [productivityData, setProductivityData] = useState<Array<{ date: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timePeriod, setTimePeriod] = useState<string>('7');
  const { segment } = useSegment();
  const [kpiWidgets, setKpiWidgets] = useState<DashboardWidgetConfig[]>([
    {
      id: 'absenteeism-overview',
      type: 'absenteeism-card',
      position: { x: 0, y: 0, w: 1, h: 1 },
      settings: {
        title: "Taux d'absentéisme",
        trend: "+2.5%"
      }
    },
    {
      id: 'emotional-health-overview',
      type: 'emotional-health-card',
      position: { x: 1, y: 0, w: 1, h: 1 },
      settings: {
        title: "Santé émotionnelle",
        trend: "+5%"
      }
    },
    {
      id: 'productivity-overview',
      type: 'productivity-card',
      position: { x: 2, y: 0, w: 1, h: 1 },
      settings: {
        title: "Productivité",
        trend: "+3.2%"
      }
    },
    {
      id: 'turnover-risk',
      type: 'turnover-risk-card',
      position: { x: 0, y: 1, w: 1, h: 1 },
      settings: {
        title: "Risque de turnover",
        trend: "-1.5%"
      }
    }
  ]);

  console.log('AdminDashboard component rendering');

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

  // Générer des données fictives pour les graphiques
  useEffect(() => {
    console.log('Generating chart data with timePeriod:', timePeriod);
    const generateMockData = () => {
      setIsLoading(true);
      
      // Générer des données d'absentéisme
      const absentData = [];
      const prodData = [];
      
      const days = parseInt(timePeriod);
      const today = new Date();
      
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - (days - i - 1));
        const dateStr = `${date.getDate()}/${date.getMonth() + 1}`;
        
        // Valeurs aléatoires pour la démo
        absentData.push({
          date: dateStr,
          value: Math.floor(Math.random() * 10) + 2 // Valeur entre 2 et 12
        });
        
        prodData.push({
          date: dateStr,
          value: Math.floor(Math.random() * 20) + 70 // Valeur entre 70 et 90
        });
      }
      
      setAbsenteeismData(absentData);
      setProductivityData(prodData);
      setIsLoading(false);
    };
    
    generateMockData();
  }, [timePeriod, segment]);
  
  const handleKpiWidgetsChange = (newWidgets: DashboardWidgetConfig[]) => {
    setKpiWidgets(newWidgets);
    toast({
      title: "Disposition mise à jour",
      description: "La disposition du tableau de bord a été enregistrée",
    });
  };
  
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
      
      {/* KPI Cards Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Indicateurs clés de performance</h2>
        <DraggableKpiCardsGrid 
          widgets={kpiWidgets}
          onWidgetsChange={handleKpiWidgetsChange}
        />
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Charts Section */}
        <AdminChartSection 
          absenteeismData={absenteeismData} 
          productivityData={productivityData}
          isLoading={isLoading}
        />
        
        {/* Emotional Climate Overview */}
        <EmotionalClimateCard emotionalScoreTrend={[
          { date: '1/5', value: 72 },
          { date: '2/5', value: 75 },
          { date: '3/5', value: 78 },
          { date: '4/5', value: 80 },
          { date: '5/5', value: 83 },
          { date: '6/5', value: 79 },
          { date: '7/5', value: 82 }
        ]} />
        
        {/* Social Cocoon Analytics */}
        <SocialCocoonCard socialStats={socialCocoonData} />
        
        {/* Gamification Summary */}
        <GamificationSummaryCard gamificationStats={gamificationData} />
      </div>
    </div>
  );
};

export default AdminDashboard;
