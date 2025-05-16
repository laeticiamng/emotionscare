
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserSidePanel from './UserSidePanel';
import EmotionalTrends from './EmotionalTrends';
import RecentJournalEntries from './RecentJournalEntries';
import { ChevronRight, Award, Zap } from 'lucide-react';
import { GamificationStats, Badge } from '@/types/gamification';

// Example data for badges
const mockBadges: Partial<Badge>[] = [
  {
    id: '1',
    name: 'Premier Pas',
    description: 'Compléter votre première entrée de journal',
    icon: '/icons/badges/firstStep.svg',
    rarity: 'common',
    unlocked: true,
  },
  {
    id: '2',
    name: 'Zen Master',
    description: '10 méditations complétées',
    icon: '/icons/badges/zenMaster.svg',
    rarity: 'uncommon',
    unlocked: true,
  },
  {
    id: '3',
    name: 'Explorateur Musical',
    description: 'Écouter 5 types de musiques thérapeutiques',
    icon: '/icons/badges/musicExplorer.svg',
    rarity: 'rare',
    unlocked: false,
    progress: 3,
    maxProgress: 5,
  }
];

// Example gamification stats
const mockGamificationStats: GamificationStats = {
  level: 5,
  xp: 2400,
  xpToNextLevel: 1000,
  streakDays: 7,
  longestStreak: 14,
  completedChallenges: 12,
  totalChallenges: 20,
  unlockedBadges: 8,
  totalBadges: 25,
  points: 1250 // Added to fix the error
};

// Example emotional assessment data
const emotionalAssessment = {
  currentMood: 'calm',
  moodIntensity: 60,
  lastUpdated: '2023-05-15T10:30:00',
  suggestions: [
    'Take a moment for deep breathing',
    'Listen to calming music',
    'Write in your journal'
  ]
};

interface UserDashboardProps {
  userName?: string;
  userAvatar?: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ 
  userName = "Alex",
  userAvatar = "/avatars/default.png"
}) => {
  const xpPercentage = (mockGamificationStats.xp / (mockGamificationStats.xp + mockGamificationStats.xpToNextLevel)) * 100;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left side - User panel */}
      <UserSidePanel 
        userName={userName}
        userAvatar={userAvatar}
        stats={mockGamificationStats}
        emotionalAssessment={emotionalAssessment}
      />
      
      {/* Middle and Right - Main content */}
      <div className="md:col-span-2 space-y-6">
        {/* Welcome and level info */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-20 h-20 relative">
                <CircularProgressbar 
                  value={xpPercentage} 
                  text={`${mockGamificationStats.level}`}
                  styles={buildStyles({
                    textSize: '2rem',
                    pathColor: '#6366f1',
                    textColor: '#6366f1',
                    trailColor: '#e2e8f0',
                  })}
                />
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold">Bienvenue, {userName}</h2>
                <p className="text-muted-foreground mb-2">
                  Vous êtes niveau {mockGamificationStats.level} avec {mockGamificationStats.points} points
                </p>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <div className="text-xs text-muted-foreground">
                    {mockGamificationStats.xp} XP
                  </div>
                  <div className="w-full max-w-xs h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${xpPercentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {mockGamificationStats.xp + mockGamificationStats.xpToNextLevel} XP
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tabs for different content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="emotional">État émotionnel</TabsTrigger>
            <TabsTrigger value="activity">Activité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Badges section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-md font-medium">Vos badges récents</CardTitle>
                <Button variant="ghost" size="sm" className="text-sm">
                  Voir tout
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {mockBadges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className="flex flex-col items-center text-center"
                    >
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
                        {badge.icon ? (
                          <img 
                            src={badge.icon} 
                            alt={badge.name} 
                            className="w-8 h-8"
                            onError={(e) => {
                              // Fallback for image load errors
                              const target = e.target as HTMLImageElement;
                              target.src = '/icons/badges/default.svg';
                            }}
                          />
                        ) : (
                          <Award className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <div className="text-xs font-medium">{badge.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Recent journal entries */}
            <RecentJournalEntries />
          </TabsContent>
          
          <TabsContent value="emotional">
            <EmotionalTrends />
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Visualisation de votre activité récente...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
