
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Challenge } from '@/types/badge';
import { Trophy, Clock, Award, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChallengesListProps {
  challenges: Challenge[];
  className?: string;
}

const ChallengesList: React.FC<ChallengesListProps> = ({ challenges, className }) => {
  // If there are no challenges
  if (!challenges || challenges.length === 0) {
    return (
      <Card className={cn("border", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Challenges
          </CardTitle>
          <CardDescription>
            Aucun challenge disponible pour le moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            De nouveaux challenges seront bientôt disponibles. Revenez plus tard !
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Challenges
        </CardTitle>
        <CardDescription>
          Accomplissez des objectifs pour gagner des récompenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {challenges.map((challenge) => {
            // Calculate progress percentage
            const progress = challenge.completed
              ? 100 
              : challenge.progress !== undefined && (typeof challenge.goal === 'number' || challenge.total || challenge.totalSteps) 
                ? Math.round((challenge.progress / (
                    typeof challenge.goal === 'number' 
                      ? challenge.goal 
                      : challenge.total || challenge.totalSteps || 1
                  )) * 100)
                : 0;
                  
            // For challenges with completions
            const completionsProgress = challenge.completions !== undefined && (typeof challenge.goal === 'number' || challenge.total || challenge.totalSteps)
              ? Math.round((challenge.completions / (
                  typeof challenge.goal === 'number'
                    ? challenge.goal
                    : challenge.total || challenge.totalSteps || 1
                )) * 100)
              : 0;
            
            // Determine difficulty color
            const difficultyColor = 
              challenge.difficulty === 'hard' ? 'text-red-500' :
              challenge.difficulty === 'medium' ? 'text-amber-500' : 
              'text-green-500';
            
            // Determine status
            const isCompleted = challenge.completed;
            
            return (
              <div key={challenge.id} className="relative">
                {isCompleted && (
                  <div className="absolute -right-1 -top-1 bg-green-500 text-white p-1 rounded-full z-10">
                    <Award className="h-3 w-3" />
                  </div>
                )}
                
                <div className={cn(
                  "p-4 rounded-lg border",
                  isCompleted ? "bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800" : "bg-card"
                )}>
                  <div className="flex justify-between">
                    <h3 className="font-medium text-sm">
                      {challenge.name}
                    </h3>
                    {challenge.difficulty && (
                      <span className={cn("text-xs font-medium", difficultyColor)}>
                        {challenge.difficulty}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-1 mb-2">
                    {challenge.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center space-x-1">
                      <Flag className="h-3 w-3 text-muted-foreground" />
                      <span>
                        {challenge.progress || challenge.completions || 0} / {typeof challenge.goal === 'number' ? challenge.goal : (challenge.total || challenge.totalSteps || 1)}
                      </span>
                    </div>
                    
                    {challenge.points && (
                      <div className="font-medium text-amber-600 dark:text-amber-400">
                        {challenge.points} points
                      </div>
                    )}
                  </div>
                  
                  <Progress 
                    value={completionsProgress || progress} 
                    className={cn(
                      isCompleted ? "bg-green-200 dark:bg-green-800" : "bg-blue-100 dark:bg-blue-900/20"
                    )}
                  />
                  
                  {challenge.deadline && (
                    <div className="flex items-center text-xs mt-2 text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        Expire le {new Date(challenge.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengesList;
