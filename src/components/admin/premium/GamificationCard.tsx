
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Users, Target, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GamificationCardProps {
  title?: string;
}

const GamificationCard: React.FC<GamificationCardProps> = ({ title = "Statistiques Gamification" }) => {
  const metrics = [
    { name: "Utilisateurs engagés", value: "73%", progress: 73 },
    { name: "Objectifs complétés", value: "4,382", progress: 65 },
    { name: "Badges débloqués", value: "9,271", progress: 82 }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Trophy className="h-5 w-5 mr-2 text-amber-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{metric.name}</p>
                <span className="text-sm font-semibold">{metric.value}</span>
              </div>
              <Progress value={metric.progress} className="h-2" />
            </div>
          ))}

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col items-center p-3 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 mb-1 text-primary" />
              <span className="text-xs text-center">12.5K<br/>Utilisateurs</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-amber-500/10">
              <Target className="h-5 w-5 mb-1 text-amber-500" />
              <span className="text-xs text-center">85%<br/>Rétention</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-lg bg-emerald-500/10">
              <Award className="h-5 w-5 mb-1 text-emerald-500" />
              <span className="text-xs text-center">32<br/>Badges</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamificationCard;
