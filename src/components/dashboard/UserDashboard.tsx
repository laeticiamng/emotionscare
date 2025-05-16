import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Challenge, GamificationStats } from '@/types/gamification';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Calendar, Music, Scan, MessagesSquare } from 'lucide-react';
import EmotionPieChart from '@/components/dashboard/charts/EmotionPieChart';
import WeeklyActivityChart from '@/components/dashboard/charts/WeeklyActivityChart';
import DashboardHero from '@/components/dashboard/DashboardHero';
import { UserDashboardSections } from '@/components/dashboard/UserDashboardSections';
import LeaderboardWidget from '@/components/dashboard/widgets/LeaderboardWidget';
import BadgesWidget from '@/components/dashboard/widgets/BadgesWidget';
import DailyInsightCard from '@/components/dashboard/widgets/DailyInsightCard';
import QuickActionLinks from '@/components/dashboard/widgets/QuickActionLinks';
import { normalizeBadges, visibleBadges } from '@/utils/badgeUtils';

const { 
  PopularSessionsSection, 
  RecentActivitySection, 
  UpcomingEventsSection
} = UserDashboardSections;

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data for dashboard
  const userChallenges = [
    {
      id: "1",
      title: "Méditation quotidienne",
      name: "Méditation quotidienne",
      description: "Méditez pendant 5 minutes",
      category: "daily",
      points: 10,
      progress: 0,
      completions: 0,
      status: "active" as const
    },
    {
      id: "2",
      title: "Journal hebdomadaire",
      name: "Journal hebdomadaire",
      description: "Complétez 3 entrées de journal cette semaine",
      category: "weekly",
      points: 30,
      progress: 33,
      completions: 1,
      status: "active" as const
    },
    {
      id: "3",
      title: "Quête mensuelle",
      name: "Quête mensuelle",
      description: "Atteignez 500 points ce mois-ci",
      category: "monthly",
      points: 50,
      progress: 60,
      completions: 0,
      status: "active" as const
    }
  ];

  const userProgress = 250;

  const userBadges = normalizeBadges([
    {
      id: "1",
      name: "Premier pas",
      description: "Premier jour sur la plateforme",
      image: "/badges/first-day.svg",
      category: "milestone",
      tier: "bronze",
      unlockedAt: "2023-05-10T12:00:00Z",
      completed: true
    },
    {
      id: "2",
      name: "Journal émotionnel",
      description: "Écrit dans le journal 5 jours consécutifs",
      image: "/badges/journal.png",
      category: "journal",
      tier: "silver",
      unlockedAt: "2023-04-15",
      completed: true
    },
    {
      id: "3",
      name: "Mélomane",
      description: "Écoute 10 sessions de musique différentes",
      image: "/badges/music.png",
      category: "music",
      tier: "gold",
      progress: 70,
      completed: false
    }
  ]);

  const leaderboard = [
    {
      id: "1",
      userId: "1",
      name: "Thomas",
      avatar: "/avatars/thomas.jpg",
      points: 1250,
      rank: 1,
      level: 5,
      isCurrentUser: false
    },
    {
      id: "2",
      userId: "2",
      name: "Marie",
      avatar: "/avatars/marie.jpg",
      points: 980,
      rank: 2,
      level: 4,
      isCurrentUser: true
    },
    {
      id: "3",
      userId: "3",
      name: "Julien",
      avatar: "/avatars/julien.jpg",
      points: 760,
      rank: 3,
      level: 3,
      isCurrentUser: false
    }
  ];

  const userStat: GamificationStats = {
    points: 980,
    level: 4,
    badges: userBadges,
    completedChallenges: 24,
    totalChallenges: 35,
    challenges: userChallenges,
    streak: 5,
    nextLevel: {
      points: 1200,
      rewards: ["Badge Premium", "Accès VIP"],
      level: 5
    },
    progress: userProgress,
    leaderboard: leaderboard
  };

  const emotionData = [
    { name: 'Joie', value: 35, color: '#4CAF50' },
    { name: 'Calme', value: 25, color: '#2196F3' },
    { name: 'Énergie', value: 15, color: '#FF9800' },
    { name: 'Stress', value: 10, color: '#F44336' },
    { name: 'Focus', value: 15, color: '#9C27B0' }
  ];

  const activityData = [
    { day: 'Lun', value: 30 },
    { day: 'Mar', value: 45 },
    { day: 'Mer', value: 25 },
    { day: 'Jeu', value: 60 },
    { day: 'Ven', value: 35 },
    { day: 'Sam', value: 15 },
    { day: 'Dim', value: 20 }
  ];

  const quickLinks = [
    {
      title: 'Journal',
      description: 'Exprimez vos émotions',
      icon: <Book className="h-5 w-5 text-white" />,
      href: '/journal',
      color: 'bg-blue-500'
    },
    {
      title: 'Musique',
      description: 'Relaxez-vous en musique',
      icon: <Music className="h-5 w-5 text-white" />,
      href: '/music',
      color: 'bg-purple-500'
    },
    {
      title: 'Coach',
      description: 'Parlez à votre coach IA',
      icon: <MessagesSquare className="h-5 w-5 text-white" />,
      href: '/coach',
      color: 'bg-green-500'
    },
    {
      title: 'Scan',
      description: 'Analysez vos émotions',
      icon: <Scan className="h-5 w-5 text-white" />,
      href: '/scan',
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Hero section */}
      <DashboardHero 
        user={{ name: 'Thomas', avatar: '/avatars/thomas.jpg' }} 
        points={userStat.points} 
        level={userStat.level.toString()} 
      />

      {/* Insight card */}
      <DailyInsightCard 
        message="Aujourd'hui est un bon jour pour prendre soin de votre bien-être émotionnel. Avez-vous pensé à faire une séance de respiration ?" 
      />
      
      {/* Quick action links */}
      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">Actions rapides</h2>
        <QuickActionLinks links={quickLinks} />
      </section>

      {/* Main dashboard content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="emotions">Émotions</TabsTrigger>
          <TabsTrigger value="activity">Activité</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <RecentActivitySection />
            <UpcomingEventsSection />
            <PopularSessionsSection />
          </div>
        </TabsContent>
        
        <TabsContent value="emotions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Émotions cette semaine</h3>
                <div className="h-[300px]">
                  <EmotionPieChart data={emotionData} />
                </div>
              </CardContent>
            </Card>
            <BadgesWidget 
              badges={normalizeBadges(visibleBadges)}
              showSeeAll={true}
              onSeeAll={() => navigate('/gamification')}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Activité hebdomadaire</h3>
                <div className="h-[300px]">
                  <WeeklyActivityChart data={activityData} />
                </div>
              </CardContent>
            </Card>
            <LeaderboardWidget 
              entries={leaderboard}
              title="Classement"
              showSeeAll={true}
              onSeeAll={() => console.log('View all leaderboard')} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
