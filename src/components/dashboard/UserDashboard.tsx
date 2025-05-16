import React from 'react';
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

const { 
  PopularSessionsSection, 
  RecentActivitySection, 
  UpcomingEventsSection
} = UserDashboardSections;

const UserDashboard: React.FC = () => {
  // Mock data for dashboard
  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Journal quotidien',
      description: 'Écrivez dans votre journal aujourd\'hui',
      category: 'daily',
      points: 50,
      progress: 0,
      completed: false,
      isDaily: true,
      status: 'active'
      // Removed icon property that was causing errors
    },
    {
      id: '2',
      title: '3 séances de musique',
      description: 'Écoutez 3 séances de musique cette semaine',
      category: 'weekly',
      points: 100,
      progress: 33,
      completed: false,
      isWeekly: true,
      status: 'active'
      // Removed icon property that was causing errors
    },
    {
      id: '3',
      title: 'Séance de VR complète',
      description: 'Terminez une séance de réalité virtuelle',
      category: 'special',
      points: 150,
      progress: 0,
      completed: false,
      status: 'active'
      // Removed icon property that was causing errors
    }
  ];

  const badges = [
    {
      id: '1',
      name: 'Débutant',
      description: 'Premier pas sur la plateforme',
      image: '/badges/beginner.png',
      category: 'progress',
      tier: 'bronze' as const,
      unlockedAt: '2023-04-01',
      completed: true
    },
    {
      id: '2',
      name: 'Journal émotionnel',
      description: 'Écrit dans le journal 5 jours consécutifs',
      image: '/badges/journal.png',
      category: 'journal',
      tier: 'silver' as const,
      unlockedAt: '2023-04-15',
      completed: true
    },
    {
      id: '3',
      name: 'Mélomane',
      description: 'Écoute 10 sessions de musique différentes',
      image: '/badges/music.png',
      category: 'music',
      tier: 'gold' as const,
      progress: 70,
      completed: false
    }
  ];

  const leaderboard = [
    {
      id: '1',
      userId: '1',
      name: 'Thomas',
      avatar: '/avatars/thomas.jpg',
      points: 1250,
      rank: 1,
      level: 5
    },
    {
      id: '2',
      userId: '2',
      name: 'Marie',
      avatar: '/avatars/marie.jpg',
      points: 980,
      rank: 2,
      level: 4
    },
    {
      id: '3',
      userId: '3',
      name: 'Julien',
      avatar: '/avatars/julien.jpg',
      points: 760,
      rank: 3,
      level: 3
    }
  ];

  const userStat: GamificationStats = {
    points: 980,
    level: 4,
    badges: badges,
    completedChallenges: 24,
    totalChallenges: 35,
    challenges: challenges,
    streak: 5,
    nextLevel: {
      points: 1200,
      level: 5, // Added the level property to match interface
      rewards: ["Badge Premium", "Accès VIP"]
    },
    progress: 75,
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
              badges={badges}
              title="Badges récents"
              showSeeAll={true}
              onSeeAll={() => console.log('View all badges')} 
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
              leaderboard={leaderboard}
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
