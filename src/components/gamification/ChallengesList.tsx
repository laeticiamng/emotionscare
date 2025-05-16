import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Lock } from 'lucide-react';
import { Challenge } from '@/types/gamification';

interface ChallengesListProps {
  challenges: Challenge[];
}

export const ChallengesList: React.FC<ChallengesListProps> = ({ challenges }) => {
  return (
    <Card>
      <CardContent className="space-y-4">
        {challenges.map((challenge) => {
          // Add fallback for deadline
          const deadlineDate = challenge.deadline ? new Date(challenge.deadline) : null;

          return (
            <div key={challenge.id} className="relative">
              {/* Add fallback for completed status */}
              <div className={`rounded-md p-4 mb-2 ${
                challenge.status === "completed" || challenge.completed ? "bg-green-100 dark:bg-green-900/20" : 
                "bg-background border"
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    {/* Add fallback for name */}
                    <div className="font-medium">{challenge.title || challenge.name}</div>
                    <p className="text-sm text-muted-foreground mt-1">{challenge.description}</p>
                    {/* Add fallback for deadline display */}
                    {challenge.deadline && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Expire le {deadlineDate?.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {/* Add fallbacks for difficulty */}
                  <div className={`text-xs px-2 py-0.5 rounded-full ${
                    challenge.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    challenge.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    challenge.difficulty === 'hard' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {challenge.difficulty || 'normal'}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    {/* Add fallback for completions */}
                    <div className="text-sm">
                      {challenge.completions || 0} 
                      {challenge.completions === 1 ? ' utilisateur' : ' utilisateurs'}
                    </div>
                    {/* Add fallbacks for completions percentage */}
                    <div className="text-xs text-muted-foreground">
                      {((challenge.completions || 0) / 100 * 100).toFixed(1)}% de complétion
                    </div>
                  </div>
                  <div className="text-xl font-bold text-primary">{challenge.points} pts</div>
                </div>
              </div>
              {/* Add fallbacks for goal and total */}
              <Progress value={(challenge.progress || 0) * 100} className="h-1.5" />
              <div className="text-xs text-muted-foreground mt-1">
                Progression: {Math.round((challenge.progress || 0) * 100)}% 
                {challenge.goal && challenge.total ? ` (${challenge.goal}/${challenge.total})` : ''}
              </div>
              {challenge.status === "completed" || challenge.completed ? (
                <div className="absolute top-2 right-2 text-green-500">
                  <CheckCircle className="h-5 w-5" />
                </div>
              ) : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
