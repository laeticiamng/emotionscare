
import React from 'react';
import { Challenge } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Clock, Trophy } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface ChallengesListProps {
  challenges: Challenge[];
  className?: string;
  onComplete?: (challengeId: string) => Promise<boolean>;
}

const ChallengesList: React.FC<ChallengesListProps> = ({ challenges, className = '', onComplete }) => {
  if (!challenges || challenges.length === 0) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-muted-foreground">Aucun défi disponible pour le moment</p>
      </div>
    );
  }

  const handleCompleteClick = async (id: string) => {
    if (onComplete) {
      await onComplete(id);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {challenges.map(challenge => (
        <Card key={challenge.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-8 h-8 flex items-center justify-center rounded-full 
                      ${challenge.status === 'completed' || challenge.status === 'complete' 
                        ? 'bg-green-100 text-green-500' 
                        : 'bg-blue-100 text-blue-500'}`}
                  >
                    {challenge.status === 'completed' 
                      ? <Check className="h-4 w-4" />
                      : <Clock className="h-4 w-4" />
                    }
                  </div>
                  <h4 className="font-medium">{challenge.title || challenge.name}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{challenge.description}</p>

                {(challenge.progress !== undefined && challenge.goal !== undefined) && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progression</span>
                      <span>{challenge.progress}/{challenge.goal}</span>
                    </div>
                    <Progress value={(challenge.progress / challenge.goal) * 100} className="h-1.5" />
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end gap-2 ml-4">
                <div className="flex items-center gap-1 text-amber-500">
                  <Trophy className="h-4 w-4" />
                  <span className="font-bold">{challenge.reward || challenge.points}</span>
                </div>

                {onComplete && challenge.status !== 'completed' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleCompleteClick(challenge.id)}
                    className="mt-2"
                  >
                    Compléter
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChallengesList;
