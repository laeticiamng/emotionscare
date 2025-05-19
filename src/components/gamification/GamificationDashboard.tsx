
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge, Challenge } from '@/types/badge';
import { Award, Star, Zap, TrendingUp, Calendar, User, UserPlus } from 'lucide-react';
import KpiCard from '@/components/dashboard/admin/KpiCard';
import ChallengesList from './ChallengesList';
import { cn } from '@/lib/utils';

interface GamificationDashboardProps {
  userData: {
    points: number;
    level: number;
    badges: Badge[];
    streak_days: number;
    challenges: Challenge[];
    activityData?: {
      total: number;
      today: number;
      thisWeek: number;
      improvement: number;
    };
  };
  className?: string;
}

const GamificationDashboard: React.FC<GamificationDashboardProps> = ({ userData, className }) => {
  const { points, level, badges, streak_days, challenges, activityData } = userData;
  
  // XP needed for next level (example formula)
  const currentLevelXP = Math.pow(level, 2) * 100;
  const nextLevelXP = Math.pow(level + 1, 2) * 100;
  const xpForNextLevel = nextLevelXP - currentLevelXP;
  const currentXPInLevel = points - currentLevelXP;
  const progressToNextLevel = Math.min(Math.floor((currentXPInLevel / xpForNextLevel) * 100), 100);

  // Stats cards data
  const statsCards = [
    {
      title: "Niveau",
      value: level,
      icon: <Star className="h-4 w-4 text-yellow-500" />,
      status: "info" as const,
    },
    {
      title: "Points",
      value: points.toLocaleString(),
      icon: <Zap className="h-4 w-4 text-purple-500" />,
      status: "neutral" as const,
    },
    {
      title: "Badges",
      value: badges.length,
      icon: <Award className="h-4 w-4 text-blue-500" />,
      status: "success" as const,
    },
    {
      title: "Série",
      value: `${streak_days} jours`,
      icon: <Calendar className="h-4 w-4 text-green-500" />,
      status: "warning" as const,
    },
  ];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Level progress card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Progression
          </CardTitle>
          <CardDescription>
            {level === 1 
              ? "Commencez votre aventure dès maintenant !" 
              : "Continuez à progresser pour débloquer plus de fonctionnalités"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-bold text-lg">Niveau {level}</h3>
              <p className="text-xs text-muted-foreground">
                {currentXPInLevel.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP pour niveau {level + 1}
              </p>
            </div>
            <div className="bg-primary/10 text-primary font-medium rounded-full px-3 py-1 text-sm">
              {progressToNextLevel}% complété
            </div>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
          
          {/* Activities summary */}
          {activityData && (
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center bg-muted/50 rounded-md p-2">
                <div className="bg-primary/10 p-2 rounded-md mr-3">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Activités aujourd'hui</p>
                  <p className="font-medium">{activityData.today}</p>
                </div>
              </div>
              
              <div className="flex items-center bg-muted/50 rounded-md p-2">
                <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-md mr-3">
                  <UserPlus className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cette semaine</p>
                  <p className="font-medium">{activityData.thisWeek}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((card, index) => (
          <KpiCard key={index} {...card} />
        ))}
      </div>

      {/* Badges section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Badges
          </CardTitle>
          <CardDescription>
            Débloquez des badges en accomplissant des objectifs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {badges.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Vous n'avez pas encore obtenu de badges. Accomplissez des défis pour en gagner !
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div key={badge.id} className="flex flex-col items-center text-center space-y-2 p-3 border rounded-lg">
                  {badge.imageUrl || badge.image_url ? (
                    <img 
                      src={badge.imageUrl || badge.image_url} 
                      alt={badge.name} 
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <h3 className="font-medium text-sm">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{badge.description}</p>
                  
                  {!badge.unlocked && !badge.completed && !badge.unlockedAt && 
                   badge.progress !== undefined && badge.threshold !== undefined && (
                    <div className="w-full space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span>{badge.progress}</span>
                        <span>{badge.threshold}</span>
                      </div>
                      <Progress value={(badge.progress / badge.threshold) * 100} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Challenges */}
      <ChallengesList challenges={challenges} />
    </div>
  );
};

export default GamificationDashboard;
