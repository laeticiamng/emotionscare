
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent } from "@/components/ui";
import { fetchReports } from '@/lib/dashboardService';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PeriodSelector from '@/components/dashboard/admin/PeriodSelector';
import AdminChartSection from '@/components/dashboard/admin/AdminChartSection';
import EmotionalClimateCard from '@/components/dashboard/admin/EmotionalClimateCard';
import SocialCocoonCard from '@/components/dashboard/admin/SocialCocoonCard';
import GamificationSummaryCard from '@/components/dashboard/admin/GamificationSummaryCard';
import { GamificationStats } from '@/types/gamification';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [absenteeismData, setAbsenteeismData] = useState<Array<{ date: string; value: number }>>([]);
  const [productivityData, setProductivityData] = useState<Array<{ date: string; value: number }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timePeriod, setTimePeriod] = useState<string>('7');

  // Mock data for Social Cocoon section
  const socialCocoonData = {
    totalPosts: 248,
    moderationRate: 3.2, // Changed from blockedPercentage to moderationRate
    topHashtags: [
      { tag: '#bienetre', count: 42 },
      { tag: '#entraide', count: 36 },
      { tag: '#motivation', count: 31 },
      { tag: '#teamspirit', count: 28 },
      { tag: '#pausecafe', count: 22 }
    ]
  };

  // Mock data for gamification section
  const stats: GamificationStats = {
    points: 0,
    level: 1,
    badges: [],
    streak: 0,
    completedChallenges: 0,
    totalChallenges: 0,
    challenges: [],
    progress: 45,
    leaderboard: [],
    // Additional properties needed by components
    activeUsersPercent: 68,
    totalBadges: 24,
    badgeLevels: [
      { level: "Bronze", count: 120 },
      { level: "Silver", count: 68 },
      { level: "Gold", count: 23 }
    ],
    topChallenges: [
      { 
        id: "challenge-1", 
        title: "Méditation quotidienne", 
        name: "Méditation quotidienne", 
        completions: 89,
        description: "Méditez tous les jours pendant une semaine",
        points: 100,
        progress: 0,
        completed: false,
        category: "daily"
      },
      { 
        id: "challenge-2", 
        title: "Journal émotionnel", 
        name: "Journal émotionnel", 
        completions: 76,
        description: "Complétez votre journal pendant 5 jours consécutifs",
        points: 150,
        progress: 0,
        completed: false,
        category: "weekly"
      },
      { 
        id: "challenge-3", 
        title: "Scan émotionnel", 
        name: "Scan émotionnel", 
        completions: 45,
        description: "Effectuez 3 scans émotionnels en une semaine",
        points: 120,
        progress: 0,
        completed: false,
        category: "special"
      }
    ],
    completionRate: 65
  };

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        
        // Load reports data
        const reportsData = await fetchReports(['absenteeism', 'productivity'], parseInt(timePeriod));
        
        setAbsenteeismData(reportsData.absenteeism || []);
        setProductivityData(reportsData.productivity || []);
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
      
      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Charts Section */}
        <AdminChartSection 
          absenteeismData={absenteeismData} 
          productivityData={productivityData}
        />
        
        {/* Emotional Climate Overview */}
        <EmotionalClimateCard emotionalScoreTrend={[
          { date: '1/5', value: 72 },
          { date: '2/5', value: 75 },
          { date: '3/5', value: 78 },
          { date: '4/5', value: 80 }
        ]} />
        
        {/* Social Cocoon Analytics */}
        <SocialCocoonCard socialStats={socialCocoonData} />
        
        {/* Gamification Summary */}
        <GamificationSummaryCard gamificationData={stats} />
      </div>
    </div>
  );
};

export default AdminDashboard;
