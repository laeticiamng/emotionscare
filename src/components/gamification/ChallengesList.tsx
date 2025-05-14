
import React from 'react';
import { Challenge } from '@/types';
import ChallengeItem from './ChallengeItem';

interface ChallengesListProps {
  challenges: Challenge[];
  onComplete?: (id: string) => void;
}

const ChallengesList: React.FC<ChallengesListProps> = ({ 
  challenges, 
  onComplete = () => {} 
}) => {
  const sortedChallenges = [...challenges].sort((a, b) => {
    // First incomplete ones, then completed ones
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    
    // Within the same completion status, sort by priority/points
    return b.points - a.points;
  });
  
  return (
    <div className="space-y-4">
      {sortedChallenges.map((challenge) => (
        <ChallengeItem
          key={challenge.id}
          id={challenge.id}
          title={challenge.title}
          description={challenge.description}
          points={challenge.points}
          isCompleted={challenge.status === 'completed'}
          onComplete={onComplete}
        />
      ))}
      
      {challenges.length === 0 && (
        <p className="text-center py-4 text-muted-foreground">
          Aucun défi disponible actuellement
        </p>
      )}
    </div>
  );
};

export default ChallengesList;
