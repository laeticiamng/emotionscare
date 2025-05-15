
import React from 'react';
import { Challenge } from '@/types';

interface ChallengesListProps {
  challenges: Challenge[];
  onComplete?: (challengeId: string) => Promise<boolean>; 
}

const ChallengesList: React.FC<ChallengesListProps> = ({ challenges, onComplete }) => {
  // Helper to render challenge status correctly
  const renderStatus = (challenge: Challenge) => {
    // Use completed property consistently
    if (challenge.completed) {
      return <span className="text-green-600">Terminé</span>;
    }
    
    if (challenge.failed) {
      return <span className="text-red-600">Échoué</span>;
    }
    
    // For active challenges
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-primary h-2.5 rounded-full" 
          style={{ width: `${Math.min(100, (challenge.progress / (challenge.goal || 1)) * 100)}%` }}
        ></div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {challenges.map(challenge => (
        <div key={challenge.id} className="bg-card p-4 rounded-lg border shadow-sm">
          <h3 className="font-medium mb-1">{challenge.title || challenge.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
          
          <div className="flex justify-between items-center">
            <div className="text-xs">
              {challenge.progress}/{challenge.goal} complétés
            </div>
            <div className="text-xs">
              {challenge.points && `${challenge.points} points`}
            </div>
          </div>
          
          <div className="mt-2">
            {renderStatus(challenge)}
          </div>
        </div>
      ))}
      
      {challenges.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Aucun défi disponible pour le moment.</p>
        </div>
      )}
    </div>
  );
};

export default ChallengesList;
