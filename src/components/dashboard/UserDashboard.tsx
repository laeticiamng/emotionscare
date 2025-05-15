import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useUserMode } from '@/contexts/UserModeContext';
import { normalizeUserRole } from '@/utils/roleUtils';
import { GamificationStats, VRSessionTemplate } from '@/types';
import DashboardHero from './DashboardHero';
import { CalendarClock, ListChecks, LucideIcon, Music2, Settings, Sparkles, UserCog, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EmotionDashboardSection, GamificationDashboardSection, ProfileDashboardSection, SocialDashboardSection, VRDashboardSection } from './UserDashboardSections';

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ title, children }) => {
  return (
    <Card className="mb-4">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        {children}
      </div>
    </Card>
  );
};

const UserDashboard = () => {
  const { user } = useAuth();
  const { userMode } = useUserMode();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [emotionSectionCollapsed, setEmotionSectionCollapsed] = useState(false);
  const [socialSectionCollapsed, setSocialSectionCollapsed] = useState(false);
  const [profileSectionCollapsed, setProfileSectionCollapsed] = useState(false);
  const [vrSectionCollapsed, setVRSectionCollapsed] = useState(false);
  const [gamificationSectionCollapsed, setGamificationSectionCollapsed] = useState(false);
  const [latestEmotion, setLatestEmotion] = useState<{ emotion: string; score: number } | null>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const toggleEmotionSection = () => {
    setEmotionSectionCollapsed(!emotionSectionCollapsed);
  };

  const toggleSocialSection = () => {
    setSocialSectionCollapsed(!socialSectionCollapsed);
  };

  const toggleProfileSection = () => {
    setProfileSectionCollapsed(!profileSectionCollapsed);
  };

  const toggleVRSection = () => {
    setVRSectionCollapsed(!vrSectionCollapsed);
  };

  const toggleGamificationSection = () => {
    setGamificationSectionCollapsed(!gamificationSectionCollapsed);
  };

  // Mock KPIs for demonstration
  const mockKpis = [
    { key: 'mood', label: 'Humeur', value: 'Calme', icon: Wand2 as LucideIcon, trend: 12 },
    { key: 'stress', label: 'Stress', value: 'Bas', icon: ListChecks as LucideIcon, trend: -5 },
    { key: 'sleep', label: 'Sommeil', value: '8h', icon: CalendarClock as LucideIcon, trend: 3 },
  ];

  // Mock shortcuts for demonstration
  const mockShortcuts = [
    { label: 'Journal', icon: PenLine as LucideIcon, to: '/b2c/journal', description: 'Écrivez vos pensées' },
    { label: 'Musique', icon: Music2 as LucideIcon, to: '/b2c/music', description: 'Écoutez de la musique' },
    { label: 'Coach', icon: UserCog as LucideIcon, to: '/b2c/coach', description: 'Parlez à un coach' },
    { label: 'Réglages', icon: Settings as LucideIcon, to: '/b2c/preferences', description: 'Modifiez vos préférences' },
    { label: 'Récompenses', icon: Sparkles as LucideIcon, to: '/b2c/gamification', description: 'Gérez vos récompenses' },
  ];

  // Mock gamification stats for demonstration
  const mockGamificationStats: GamificationStats = {
    points: 450,
    level: 3,
    badges: [],
    streak: 5,
    completedChallenges: 8,
    totalChallenges: 12,
    progress: { current: 75, target: 100 },
    completionRate: 66,
    achievements: [
      { id: '1', name: 'Premier journal', completed: true },
      { id: '2', name: 'Maître zen', completed: false },
    ],
    leaderboard: [
      { userId: '1', username: 'Sophie', points: 520 },
      { userId: '2', username: 'Thomas', points: 505 },
      { userId: '3', username: 'Emma', points: 480 },
    ]
  };

  return (
    <div className="container mx-auto p-4">
      {user && (
        <DashboardHero
          userName={user.name || 'Utilisateur'}
          kpis={mockKpis}
          shortcuts={mockShortcuts}
        />
      )}

      <EmotionDashboardSection
        collapsed={emotionSectionCollapsed}
        onToggle={toggleEmotionSection}
        isMobile={isMobile}
        userId={user?.id}
      />

      <SocialDashboardSection
        collapsed={socialSectionCollapsed}
        onToggle={toggleSocialSection}
        isMobile={isMobile}
        userId={user?.id}
      />

      <ProfileDashboardSection
        collapsed={profileSectionCollapsed}
        onToggle={toggleProfileSection}
        isMobile={isMobile}
        userId={user?.id}
      />

      <VRDashboardSection
        collapsed={vrSectionCollapsed}
        onToggle={toggleVRSection}
        isMobile={isMobile}
        latestEmotion={latestEmotion}
      />

      <GamificationDashboardSection
        collapsed={gamificationSectionCollapsed}
        onToggle={toggleGamificationSection}
        isMobile={isMobile}
        userId={user?.id}
      />
    </div>
  );
};

export default UserDashboard;
