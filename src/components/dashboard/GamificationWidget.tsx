
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEmotionalGamification } from '@/hooks/useEmotionalGamification';
import { calculateProgressToNextLevel } from '@/utils/gamification/emotionCalculator';
import GamificationWidgetSkeleton from '@/components/gamification/widgets/GamificationWidgetSkeleton';
import GamificationLevelProgress from '@/components/gamification/widgets/GamificationLevelProgress';
import GamificationStatsCards from '@/components/gamification/widgets/GamificationStatsCards';
import EmotionalBalanceIndicator from '@/components/gamification/widgets/EmotionalBalanceIndicator';
import EarnedBadgesDisplay from '@/components/gamification/widgets/EarnedBadgesDisplay';

export interface GamificationWidgetProps {
  collapsed: boolean;
  onToggle: () => void;
  userId?: string;
}

const GamificationWidget: React.FC<GamificationWidgetProps> = ({ collapsed, onToggle, userId }) => {
  const { stats, isLoading } = useEmotionalGamification(userId);
  
  // Calculate progress percentage for the level bar
  const progressToNextLevel = calculateProgressToNextLevel(stats.points);
  
  // Render loading state
  if (isLoading) {
    return <GamificationWidgetSkeleton />;
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Award className="mr-2 h-5 w-5 text-amber-500" />
            Gamification Émotionnelle
          </div>
          <Badge variant="outline" className="ml-2 bg-primary/10">
            Niveau {stats.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Level Progress */}
          <GamificationLevelProgress 
            level={stats.level}
            points={stats.points}
            nextMilestone={stats.next_milestone}
            progressToNextLevel={progressToNextLevel}
          />
          
          {/* Stats Cards */}
          <GamificationStatsCards 
            streakDays={stats.streak_days} 
            totalScans={stats.total_scans} 
          />
          
          {/* Emotional Balance */}
          <EmotionalBalanceIndicator emotionalBalance={stats.emotional_balance} />
          
          {/* Badges Section */}
          <EarnedBadgesDisplay badges={stats.badges_earned} />
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationWidget;
