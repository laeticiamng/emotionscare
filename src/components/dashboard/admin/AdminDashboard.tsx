
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { fetchReports, fetchUsersAvgScore, fetchUsersWithStatus, fetchJournalStats, fetchSocialActivityStats, fetchGamificationStats } from '@/lib/dashboardService';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Timeline, TimelineItem, TimelineHeader, TimelineIcon, TimelineTitle, TimelineContent, TimelineBody } from "@/components/ui/timeline";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, MessageSquare, Trophy, Users, Plus, Bell, ChartBar } from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import PeriodSelector from '@/components/dashboard/admin/PeriodSelector';
import AdminChartSection from '@/components/dashboard/admin/AdminChartSection';
import EmotionalClimateCard from '@/components/dashboard/admin/EmotionalClimateCard';
import SocialCocoonCard from '@/components/dashboard/admin/SocialCocoonCard';
import GamificationSummaryCard from '@/components/dashboard/admin/GamificationSummaryCard';
import LoadingAnimation from '@/components/ui/loading-animation';
import CountUp from 'react-countup';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [absenteeismData, setAbsenteeismData] = useState<Array<{ date: string; value: number }>>([]);
  const [productivityData, setProductivityData] = useState<Array<{ date: string; value: number }>>([]);
  const [emotionalScoreTrend, setEmotionalScoreTrend] = useState<Array<{ date: string; value: number }>>([]);
  const [journalStats, setJournalStats] = useState<Array<{ date: string; score: number; count: number }>>([]);
  const [socialStats, setSocialStats] = useState<{
    totalPosts: number;
    moderationRate: number;
    topHashtags: Array<{ tag: string; count: number }>
  }>({
    totalPosts: 0,
    moderationRate: 0,
    topHashtags: []
  });
  const [gamificationStats, setGamificationStats] = useState<{
    activeUsersPercent: number;
    totalBadges: number;
  }>({
    activeUsersPercent: 0,
    totalBadges: 0
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timePeriod, setTimePeriod] = useState<string>('7');

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        
        // Load reports data
        const reportsData = await fetchReports(['absenteeism', 'productivity'], parseInt(timePeriod));
        setAbsenteeismData(reportsData.absenteeism || []);
        setProductivityData(reportsData.productivity || []);
        
        // Load emotional score trend
        const avgScoreData = await fetchUsersAvgScore(parseInt(timePeriod));
        setEmotionalScoreTrend(avgScoreData);
        
        // Load journal stats
        const journalData = await fetchJournalStats(parseInt(timePeriod));
        setJournalStats(journalData);
        
        // Load social stats
        const socialData = await fetchSocialActivityStats();
        setSocialStats(socialData);
        
        // Load gamification stats
        const gamificationData = await fetchGamificationStats();
        setGamificationStats(gamificationData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, [timePeriod]);
  
  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Hero Section with Period Selector */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold mb-1 text-[#1B365D]">Dashboard Direction</h1>
            <h2 className="text-xl text-muted-foreground mt-2 italic font-light">
              Pilotage & Bien-être Collectif
            </h2>
          </div>
          <PeriodSelector timePeriod={timePeriod} setTimePeriod={setTimePeriod} />
        </div>
      </div>
      
      {isLoading ? (
        <LoadingAnimation text="Chargement des données anonymisées..." />
      ) : (
        /* Main Content */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Charts Section */}
          <AdminChartSection 
            absenteeismData={absenteeismData} 
            productivityData={productivityData}
          />
          
          {/* Emotional Climate Overview */}
          <EmotionalClimateCard emotionalScoreTrend={emotionalScoreTrend} />
          
          {/* Journal de bord global */}
          <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300 col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="text-[#1B365D]" />
                Journal de bord global
              </CardTitle>
              <CardDescription>
                Timeline anonymisée des check-ins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 overflow-y-auto pr-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Score moyen</TableHead>
                      <TableHead>Nombre de check-ins</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {journalStats.map((entry, index) => (
                      <TableRow key={index} className="hover:bg-muted/30">
                        <TableCell>{entry.date}</TableCell>
                        <TableCell>{entry.score.toFixed(1)}/100</TableCell>
                        <TableCell>{entry.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Social Cocoon Analytics */}
          <SocialCocoonCard socialStats={socialStats} />
          
          {/* Gamification Summary */}
          <GamificationSummaryCard gamificationStats={gamificationStats} />
          
          {/* Actions RH */}
          <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300 col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="text-[#1B365D]" />
                Actions RH
              </CardTitle>
              <CardDescription>
                Proposer des ateliers ou envoyer des sondages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="coral" className="flex-1">
                  <Plus size={16} />
                  Proposer un atelier
                </Button>
                <Button variant="coral" className="flex-1">
                  <Bell size={16} />
                  Envoyer un sondage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <DashboardFooter isAdmin={true} />
    </div>
  );
};

export default AdminDashboard;
