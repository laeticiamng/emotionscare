
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Calendar, BarChart, Target, Award, Music, Headphones } from 'lucide-react';
import { User } from '@/types/user';
import { Badge, Challenge, LeaderboardEntry } from '@/types/gamification';
import DashboardHero from './DashboardHero';
import EmotionPieChart from './charts/EmotionPieChart';
import WeeklyActivityChart from './charts/WeeklyActivityChart';
import { UserDashboardSections } from './UserDashboardSections';
import { GamificationStats } from '@/types/gamification';
import BadgesWidget from './widgets/BadgesWidget';
import LeaderboardWidget from './widgets/LeaderboardWidget';
import DailyInsightCard from './widgets/DailyInsightCard';
import QuickActionLinks from './widgets/QuickActionLinks';

interface UserDashboardProps {
  user?: User;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
  // Mock data - in a real app this would come from an API
  const mockChallenges: Challenge[] = [
    {
      id: "1",
      title: "Méditation quotidienne",
      description: "Pratiquez la méditation pendant 10 minutes",
      category: "daily",
      points: 50,
      progress: 100,
      completed: true,
      icon: "meditation"
    },
    {
      id: "2",
      title: "Journal des émotions",
      description: "Notez vos émotions 5 jours de suite",
      category: "weekly",
      points: 100,
      progress: 60,
      completed: false,
      icon: "journal"
    },
    {
      id: "3",
      title: "Session VR complète",
      description: "Terminez une session VR de détente",
      category: "daily",
      points: 75,
      progress: 100,
      completed: true,
      icon: "vr"
    }
  ];
  
  const userBadges: Badge[] = [
    {
      id: "1",
      name: "Premier pas",
      description: "Première connexion à la plateforme",
      icon: "star",
      category: "onboarding",
      unlockedAt: new Date().toISOString(),
      completed: true
    },
    {
      id: "2",
      name: "Explorateur VR",
      description: "A essayé 5 expériences VR différentes",
      icon: "compass",
      category: "vr",
      progress: 3,
      level: 1,
      completed: false
    },
    {
      id: "3",
      name: "Journal assidu",
      description: "A écrit dans son journal 7 jours de suite",
      icon: "book",
      category: "journal",
      progress: 5,
      level: 2,
      unlockedAt: new Date().toISOString(),
      completed: true
    }
  ];
  
  const leaderboard: LeaderboardEntry[] = [
    {
      id: "1",
      name: "Thomas M.",
      points: 1250,
      level: 5,
      position: 1,
      username: "thomas_m",
      avatar: "/avatars/avatar-1.png"
    },
    {
      id: "2",
      name: "Sophie L.",
      points: 980,
      level: 4,
      position: 2,
      username: "sophie_l"
    },
    {
      id: "3",
      name: "Marc D.",
      points: 840,
      level: 4,
      position: 3,
      username: "marc_d"
    }
  ];
  
  // Quick action links
  const quickLinks = [
    {
      title: "Journal des émotions",
      description: "Notez vos pensées et émotions",
      icon: <Brain className="h-5 w-5" />,
      href: "/journal",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Planifier une session",
      description: "Réservez un créneau de thérapie",
      icon: <Calendar className="h-5 w-5" />,
      href: "/scheduler",
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Statistiques bien-être",
      description: "Consultez vos tendances",
      icon: <BarChart className="h-5 w-5" />,
      href: "/stats",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      title: "Objectifs personnels",
      description: "Suivez votre progression",
      icon: <Target className="h-5 w-5" />,
      href: "/goals",
      color: "bg-amber-50 text-amber-600"
    }
  ];
  
  // Weekly activity data - transform to expected format
  const rawActivityData = [
    { day: "Lun", journal: 1, music: 0, scan: 1, coach: 0 },
    { day: "Mar", journal: 1, music: 1, scan: 0, coach: 0 },
    { day: "Mer", journal: 0, music: 1, scan: 1, coach: 1 },
    { day: "Jeu", journal: 1, music: 0, scan: 0, coach: 0 },
    { day: "Ven", journal: 1, music: 1, scan: 0, coach: 0 },
    { day: "Sam", journal: 0, music: 1, scan: 1, coach: 0 },
    { day: "Dim", journal: 1, music: 1, scan: 0, coach: 0 },
  ];
  
  // Transform raw data to the format expected by WeeklyActivityChart
  const weeklyActivityData = rawActivityData.map(item => ({
    day: item.day,
    value: item.journal + item.music + item.scan + item.coach
  }));
  
  const stats: GamificationStats = {
    points: 850,
    level: 4,
    streak: 7,
    nextLevel: {
      points: 1000,
      level: 5
    },
    progress: 85,
    badges: userBadges,
    completedChallenges: 8,
    totalChallenges: 12,
    challenges: mockChallenges,
    rank: 7
  };
  
  return (
    <div className="container mx-auto py-6">
      <DashboardHero 
        points={stats.points} 
        level={stats.level}
        user={user}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="mr-2 h-5 w-5 text-primary" />
              Vos badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BadgesWidget badges={userBadges} showSeeAll />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Headphones className="mr-2 h-5 w-5 text-primary" />
              Musique recommandée
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 flex items-center">
              <div className="w-12 h-12 bg-primary/20 flex items-center justify-center rounded-lg mr-3">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Méditation guidée</h3>
                <p className="text-xs text-muted-foreground">10:30 • Relaxation</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardContent className="p-0">
            <DailyInsightCard />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Activité hebdomadaire</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyActivityChart data={weeklyActivityData} />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Classement</CardTitle>
          </CardHeader>
          <CardContent>
            <LeaderboardWidget leaderboard={leaderboard} showSeeAll />
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <QuickActionLinks links={quickLinks} />
      </div>
      
      <Tabs defaultValue="emotions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="vr">Réalité Virtuelle</TabsTrigger>
          <TabsTrigger value="music">Musicothérapie</TabsTrigger>
          <TabsTrigger value="goals">Objectifs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="emotions" className="space-y-4">
          <UserDashboardSections.EmotionsSection />
        </TabsContent>
        
        <TabsContent value="vr" className="space-y-4">
          <UserDashboardSections.VRSection />
        </TabsContent>
        
        <TabsContent value="music" className="space-y-4">
          <UserDashboardSections.MusicSection />
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-4">
          <UserDashboardSections.GoalsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
