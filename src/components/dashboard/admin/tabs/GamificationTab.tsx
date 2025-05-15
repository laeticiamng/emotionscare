
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Trophy } from 'lucide-react';
import GamificationSummaryCard from '../GamificationSummaryCard';
import { Skeleton } from '@/components/ui/skeleton';
import { GamificationStats } from '@/types/gamification';

export interface GamificationTabProps {
  gamificationData: GamificationStats;
  isLoading?: boolean;
}

const GamificationTab: React.FC<GamificationTabProps> = ({ gamificationData, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-80 w-full col-span-1 md:col-span-2" />
      </div>
    );
  }

  // Safely access properties with fallbacks
  const topChallenges = gamificationData.topChallenges || [];
  const badgeLevels = gamificationData.badgeLevels || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <GamificationSummaryCard gamificationData={gamificationData} />
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Top Défis</CardTitle>
          <CardDescription>Les défis les plus réussis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topChallenges.map((challenge, index) => (
              <div key={index} className="flex items-center justify-between mb-2">
                <span className="font-medium">
                  {challenge.name || challenge.title}
                </span>
                <span className="text-muted-foreground">
                  {challenge.completions || 0} complétions
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2 glass-card">
        <CardHeader>
          <CardTitle>Distribution des badges</CardTitle>
          <CardDescription>Répartition des niveaux de badges obtenus</CardDescription>
        </CardHeader>
        <CardContent className="h-60 flex items-center justify-center">
          <div className="bg-white/80 rounded-xl p-6 w-full h-full flex items-center justify-around">
            {Array.isArray(badgeLevels) && badgeLevels.map((level, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`w-24 h-24 rounded-full flex items-center justify-center mb-3 ${
                    index === 0 ? 'bg-amber-100 text-amber-800' :
                    index === 1 ? 'bg-gray-200 text-gray-700' : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <Trophy size={48} />
                </div>
                <div className="text-center">
                  <p className="font-medium">{level.level}</p>
                  <p className="text-2xl font-bold">{level.count}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationTab;
