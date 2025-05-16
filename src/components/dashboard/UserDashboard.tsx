
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DashboardHero from './DashboardHero';
import { useAuth } from '@/contexts/AuthContext';
import EmotionPieChart from './charts/EmotionPieChart';
import WeeklyActivityChart from './charts/WeeklyActivityChart';
import { 
  ProgressLatestSection, 
  JournalLatestSection,
  RecommendedVRSection,
  MoodHistorySection
} from './UserDashboardSections';
import { Badge, LeaderboardEntry } from '@/types';
import LeaderboardWidget from './widgets/LeaderboardWidget';
import BadgesWidget from './widgets/BadgesWidget';
import DailyInsightCard from './widgets/DailyInsightCard';
import QuickActionLinks from './widgets/QuickActionLinks';
import { PenLine, Headphones, BarChart, Sparkles } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Placeholder data for the dashboard
  const emotions = [
    { name: 'Calme', value: 35, color: '#4299E1' },
    { name: 'Joie', value: 30, color: '#F6AD55' },
    { name: 'Concentration', value: 20, color: '#9F7AEA' },
    { name: 'Stress', value: 15, color: '#FC8181' },
  ];

  const weeklyActivity = [
    { day: 'Lun', journal: 1, music: 2, scan: 1, coach: 0 },
    { day: 'Mar', journal: 1, music: 1, scan: 0, coach: 1 },
    { day: 'Mer', journal: 0, music: 3, scan: 0, coach: 0 },
    { day: 'Jeu', journal: 2, music: 2, scan: 1, coach: 1 },
    { day: 'Ven', journal: 1, music: 1, scan: 0, coach: 0 },
    { day: 'Sam', journal: 0, music: 4, scan: 0, coach: 0 },
    { day: 'Dim', journal: 1, music: 2, scan: 1, coach: 2 },
  ];

  const quickLinks = [
    {
      title: 'Journal',
      description: 'Écrivez une entrée de journal',
      icon: <PenLine className="h-5 w-5" />,
      href: '/journal',
      color: 'bg-blue-500'
    },
    {
      title: 'Musique',
      description: 'Créez une ambiance musicale',
      icon: <Headphones className="h-5 w-5" />,
      href: '/music',
      color: 'bg-purple-500'
    },
    {
      title: 'Stats',
      description: 'Consultez vos statistiques',
      icon: <BarChart className="h-5 w-5" />,
      href: '/stats',
      color: 'bg-emerald-500'
    },
    {
      title: 'Inspiration',
      description: 'Découvrez des idées',
      icon: <Sparkles className="h-5 w-5" />,
      href: '/inspiration',
      color: 'bg-amber-500'
    }
  ];

  // Sample progress data
  const userProgress = {
    points: 1250,
    level: 5,
    streak: 7,
    nextLevel: {
      points: 1500,
      level: 6
    },
    progress: 0.75 // This is now a simple number representing percentage (0-1)
  };

  // Sample badges
  const badges: Badge[] = [
    { 
      id: '1', 
      name: 'Journaliste débutant', 
      description: '5 entrées de journal', 
      icon: '📝', 
      category: 'journal', 
      level: 1,
      unlocked: true,
      progress: 100,
      completed: true
    },
    { 
      id: '2', 
      name: 'Mélomane', 
      description: '10 musiques créées', 
      icon: '🎵', 
      category: 'music', 
      level: 1, 
      unlocked: true,
      progress: 70,
      completed: false
    }
  ];

  // Sample leaderboard
  const leaderboard: LeaderboardEntry[] = [
    { id: '1', name: 'JohnDoe', points: 1500, level: 6, position: 1, avatar: '', username: 'john_doe' },
    { id: '2', name: 'AliceW', points: 1350, level: 5, position: 2, avatar: '', username: 'alice_w' },
    { id: '3', name: 'BobSmith', points: 1200, level: 5, position: 3, avatar: '', username: 'bob_smith' }
  ];

  return (
    <div className="container mx-auto py-6">
      <DashboardHero 
        user={user}
        points={userProgress.points}
        level={userProgress.level}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Bienvenue, {user?.name || 'Utilisateur'}</CardTitle>
            </CardHeader>
            <CardContent>
              <DailyInsightCard />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Actions rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <QuickActionLinks links={quickLinks} />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <JournalLatestSection />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Émotions cette semaine</CardTitle>
              </CardHeader>
              <CardContent>
                <EmotionPieChart data={emotions} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activité hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklyActivityChart data={weeklyActivity} />
              </CardContent>
            </Card>
          </div>

          <RecommendedVRSection />
        </div>

        <div className="space-y-6">
          <ProgressLatestSection progress={userProgress} />
          
          <Card>
            <CardHeader>
              <CardTitle>Vos badges</CardTitle>
            </CardHeader>
            <CardContent>
              <BadgesWidget badges={badges} />
            </CardContent>
          </Card>
          
          <MoodHistorySection />
          
          <Card>
            <CardHeader>
              <CardTitle>Classement</CardTitle>
            </CardHeader>
            <CardContent>
              <LeaderboardWidget leaderboard={leaderboard} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
