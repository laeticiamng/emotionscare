
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"; 
import { Trophy, Award } from 'lucide-react';
import CountUp from 'react-countup';

interface GamificationSummaryCardProps {
  gamificationStats: {
    activeUsersPercent: number;
    totalBadges: number;
  };
}

const GamificationSummaryCard: React.FC<GamificationSummaryCardProps> = ({ 
  gamificationStats = { activeUsersPercent: 68, totalBadges: 24 } 
}) => {
  return (
    <Card className="glass-card overflow-hidden hover:shadow-md hover:scale-[1.02] transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="text-[#1B365D]" />
          Synthèse Gamification
        </CardTitle>
        <CardDescription>
          Engagement des utilisateurs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Utilisateurs actifs</span>
              <span className="text-sm font-semibold">
                <CountUp 
                  end={gamificationStats.activeUsersPercent} 
                  duration={2} 
                  suffix="%" 
                  enableScrollSpy 
                  scrollSpyOnce
                />
              </span>
            </div>
            <Progress value={gamificationStats.activeUsersPercent} className="h-2" />
          </div>
          
          <div className="flex items-center">
            <Award className="h-10 w-10 text-yellow-500 mr-3" />
            <div>
              <div className="text-2xl font-semibold">
                <CountUp 
                  end={gamificationStats.totalBadges} 
                  duration={2} 
                  enableScrollSpy 
                  scrollSpyOnce
                />
              </div>
              <p className="text-sm text-muted-foreground">Badges distribués</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationSummaryCard;
