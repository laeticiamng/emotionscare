
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, CheckCircle, Clock } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  status: 'completed' | 'ongoing' | 'available';
  deadline?: string;
  category: string;
}

interface ChallengesListProps {
  challenges: Challenge[];
}

const ChallengesList: React.FC<ChallengesListProps> = ({ challenges }) => {
  if (!challenges || challenges.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun défi disponible pour le moment.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle className="mr-1 h-3 w-3" /> Complété</Badge>;
      case 'ongoing':
        return <Badge className="bg-blue-500"><Clock className="mr-1 h-3 w-3" /> En cours</Badge>;
      default:
        return <Badge variant="outline">Disponible</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <Card key={challenge.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                {challenge.title}
              </CardTitle>
              {getStatusBadge(challenge.status)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
            <div className="flex justify-between items-center mt-4">
              <Badge variant="secondary">{challenge.category}</Badge>
              <span className="font-bold">{challenge.points} points</span>
            </div>
            {challenge.deadline && (
              <p className="text-xs text-muted-foreground mt-2">
                Échéance: {new Date(challenge.deadline).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChallengesList;
