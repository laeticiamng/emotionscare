import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheck, Clock, TrendingUp, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Challenge } from '@/types';

interface ChallengesListProps {
  challenges: Challenge[];
  onComplete?: (challengeId: string) => Promise<boolean>;
}

const ChallengesList: React.FC<ChallengesListProps> = ({ challenges, onComplete }) => {
  // Filter challenges by status
  const activeChallenges = challenges.filter(c => !c.completed && !c.failed);
  const completedChallenges = challenges.filter(c => c.completed);
  const failedChallenges = challenges.filter(c => c.failed);
  
  const handleComplete = async (id: string) => {
    if (onComplete) {
      await onComplete(id);
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Défis</h2>
      
      {activeChallenges.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Clock className="mr-2 h-4 w-4 text-blue-500" />
            Défis actifs
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}
      
      {completedChallenges.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <BadgeCheck className="mr-2 h-4 w-4 text-green-500" />
            Défis complétés
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}
      
      {failedChallenges.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3 flex items-center">
            <Clock className="mr-2 h-4 w-4 text-red-500" />
            Défis échoués
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {failedChallenges.map(challenge => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
  const progressPercent = challenge.goal > 0 
    ? Math.round((challenge.progress / challenge.goal) * 100) 
    : 0;
    
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>{challenge.title || challenge.name}</span>
          {challenge.points && (
            <span className="text-sm font-normal bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center">
              <Award className="h-3 w-3 mr-1" /> {challenge.points} pts
            </span>
          )}
        </CardTitle>
        <CardDescription>{challenge.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progrès</span>
            <span className="font-medium">{challenge.progress} / {challenge.goal}</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </CardContent>
      {!challenge.completed && !challenge.failed && (
        <CardFooter className="pt-1">
          <Button variant="ghost" size="sm" className="w-full text-primary justify-start gap-1">
            <TrendingUp className="h-3 w-3" /> Voir les détails
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ChallengesList;
