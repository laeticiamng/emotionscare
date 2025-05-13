
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: string;
  category?: string;
  progress?: number;
}

interface ChallengesListProps {
  challenges: Challenge[];
}

const ChallengesList: React.FC<ChallengesListProps> = ({ challenges }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
      case 'ongoing':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'available':
      case 'open':
        return 'bg-amber-100 text-amber-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {challenges.map((challenge) => (
        <Card key={challenge.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-md">{challenge.title}</CardTitle>
              <Badge variant="outline" className={getStatusColor(challenge.status)}>
                {challenge.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{challenge.points} points</span>
              <Badge variant="secondary">{challenge.category || 'Général'}</Badge>
            </div>
            
            {challenge.progress !== undefined && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progression</span>
                  <span>{challenge.progress}%</span>
                </div>
                <Progress value={challenge.progress} className="h-1" />
              </div>
            )}
            
            {challenge.status !== 'completed' && (
              <Button variant="outline" size="sm" className="w-full mt-4">
                {challenge.status === 'available' || challenge.status === 'open' 
                  ? "Accepter le défi" 
                  : "Voir les détails"}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
      
      {challenges.length === 0 && (
        <div className="col-span-full text-center py-10">
          <p className="text-muted-foreground">Aucun défi disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default ChallengesList;
