
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, Clock, Trophy } from 'lucide-react';
import { Challenge } from '@/types/gamification';

interface ChallengesListProps {
  challenges: Challenge[];
  onComplete?: (challengeId: string) => Promise<boolean>;
}

const ChallengesList: React.FC<ChallengesListProps> = ({ challenges, onComplete }) => {
  const activeFilter = 'all';
  
  const filteredChallenges = challenges.filter((challenge) => {
    if (activeFilter === 'completed') return challenge.completed;
    if (activeFilter === 'active') return !challenge.completed;
    return true;
  });
  
  // Adding failed property to Challenge type
  const checkIsFailed = (challenge: Challenge & {failed?: boolean}) => {
    return challenge.failed === true;
  };

  const getChallengeStatusColor = (challenge: Challenge & {failed?: boolean}) => {
    if (challenge.completed) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
    if (checkIsFailed(challenge)) return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
  };

  const getChallengeStatus = (challenge: Challenge & {failed?: boolean}) => {
    if (challenge.completed) return 'Terminé';
    if (checkIsFailed(challenge)) return 'Échoué';
    return 'En cours';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChallenges.map((challenge) => (
          <Card key={challenge.id} className="h-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg mb-2">
                  {challenge.icon || '🏆'}
                </div>
                <Badge 
                  variant="outline" 
                  className={getChallengeStatusColor(challenge as Challenge & {failed?: boolean})}
                >
                  {getChallengeStatus(challenge as Challenge & {failed?: boolean})}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg">{challenge.title}</h3>
              <p className="text-sm text-muted-foreground">{challenge.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progression</span>
                    <span>{Math.round(challenge.progress)}%</span>
                  </div>
                  <Progress
                    value={challenge.progress}
                    className={`h-2 ${
                      checkIsFailed(challenge as Challenge & {failed?: boolean})
                        ? 'bg-red-100 dark:bg-red-950'
                        : challenge.completed
                          ? 'bg-green-100 dark:bg-green-950'
                          : 'bg-blue-100 dark:bg-blue-950'
                    }`}
                  />
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Trophy className="h-4 w-4 mr-1" />
                    <span>{challenge.points} pts</span>
                  </div>
                  
                  {challenge.deadline && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(challenge.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
                
                {onComplete && !challenge.completed && !checkIsFailed(challenge as Challenge & {failed?: boolean}) && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => onComplete(challenge.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Valider
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {filteredChallenges.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Aucun défi disponible pour le moment.
        </div>
      )}
    </div>
  );
};

export default ChallengesList;
