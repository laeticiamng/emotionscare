
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface GamificationLevelProgressProps {
  level: number;
  points: number;
  nextMilestone: number;
  progressToNextLevel: number;
}

const GamificationLevelProgress: React.FC<GamificationLevelProgressProps> = ({
  level,
  points,
  nextMilestone,
  progressToNextLevel
}) => {
  // Get level color based on level
  const getLevelColor = (level: number): string => {
    if (level < 3) return 'bg-emerald-500';
    if (level < 5) return 'bg-blue-500';
    if (level < 10) return 'bg-purple-500';
    return 'bg-amber-500';
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>{points} points</span>
          <span>{nextMilestone} points</span>
        </div>
        <Progress value={progressToNextLevel} className={`h-2 ${getLevelColor(level)}`} />
        <p className="text-xs text-muted-foreground mt-1 text-center">
          {nextMilestone - points} points jusqu'au niveau {level + 1}
        </p>
      </div>
    </div>
  );
};

export default GamificationLevelProgress;
