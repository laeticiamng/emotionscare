import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle } from 'lucide-react';
import { Challenge } from '@/types/types';

interface ChallengesListProps {
  challenges: Challenge[];
  className?: string;
}

const ChallengesList = ({ challenges, className = '' }) => {
  // Filter logic that handles both status formats
  const completedChallenges = challenges.filter(
    (challenge) => challenge.status === 'complete' || 
                  challenge.status === 'completed' ||
                  challenge.completed === true
  );
  
  const inProgressChallenges = challenges.filter(
    (challenge) => challenge.status === 'in-progress' && 
                  challenge.status !== 'complete' && 
                  challenge.status !== 'completed' &&
                  challenge.completed !== true
  );
  
  const notStartedChallenges = challenges.filter(
    (challenge) => challenge.status !== 'complete' &&
                  challenge.status !== 'completed' &&
                  challenge.status !== 'in-progress' &&
                  challenge.completed !== true
  );

  return (
    <div className={`space-y-4 ${className}`}>
      {completedChallenges.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Terminées</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {completedChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{challenge.title || challenge.name}</h4>
                    <p className="text-xs text-muted-foreground">{challenge.description}</p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {inProgressChallenges.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">En cours</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {inProgressChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{challenge.title || challenge.name}</h4>
                    <p className="text-xs text-muted-foreground">{challenge.description}</p>
                  </div>
                  <Circle className="h-5 w-5 text-blue-500" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {notStartedChallenges.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Non commencées</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {notStartedChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{challenge.title || challenge.name}</h4>
                    <p className="text-xs text-muted-foreground">{challenge.description}</p>
                  </div>
                  <Circle className="h-5 w-5 text-gray-300" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {challenges.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          Aucun défi disponible pour le moment.
        </div>
      )}
    </div>
  );
};

export default ChallengesList;
