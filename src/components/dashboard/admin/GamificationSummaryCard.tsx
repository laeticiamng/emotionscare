
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GamificationStats } from '@/types/gamification';
import { Badge } from 'lucide-react';

interface GamificationSummaryCardProps {
  gamificationData: GamificationStats;
  isLoading?: boolean;
}

const GamificationSummaryCard: React.FC<GamificationSummaryCardProps> = ({ 
  gamificationData,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Gamification Overview</CardTitle>
          <CardDescription>Loading gamification data...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700 w-3/4"></div>
        </CardContent>
      </Card>
    );
  }

  // Get the top badges by level
  const topBadgeLevels = gamificationData.badgeLevels?.slice(0, 3) || [];
  
  // Format level counts
  const formatLevelData = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {topBadgeLevels.map((badge, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">{badge.level}</p>
              <p className="text-sm text-muted-foreground">{badge.count} users</p>
            </div>
            <Badge className="h-10 w-10 text-primary p-2" />
          </div>
        ))}
      </div>
    );
  };

  // Format challenge completion data
  const formatChallengeData = () => {
    const topChallenges = gamificationData.topChallenges?.slice(0, 3) || [];
    
    return (
      <div className="space-y-4">
        {topChallenges.map((challenge, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{challenge.name}</p>
              <p className="text-sm text-muted-foreground">{challenge.completions} completions</p>
            </div>
            <Progress value={(challenge.completions / 100) * 100} className="h-2" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gamification Overview</CardTitle>
        <CardDescription>Badge distributions and challenge completions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-3">Top Badge Levels</h4>
            {formatLevelData()}
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-3">Most Completed Challenges</h4>
            {formatChallengeData()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationSummaryCard;
