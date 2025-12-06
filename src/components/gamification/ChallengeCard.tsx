// @ts-nocheck

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Clock, Target } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  progress: number;
  maxProgress: number;
  category: 'daily' | 'weekly' | 'special';
  difficulty: 'facile' | 'moyen' | 'difficile';
  completed: boolean;
  deadline?: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onStart?: (challengeId: string) => void;
  onClaim?: (challengeId: string) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  onStart, 
  onClaim 
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'bg-green-500';
      case 'moyen': return 'bg-yellow-500';
      case 'difficile': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily': return <Clock className="h-4 w-4" />;
      case 'weekly': return <Target className="h-4 w-4" />;
      case 'special': return <Trophy className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const isCompleted = challenge.progress >= challenge.maxProgress;
  const progressPercentage = (challenge.progress / challenge.maxProgress) * 100;

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{challenge.title}</h3>
              <p className="text-sm text-muted-foreground">
                {challenge.description}
              </p>
            </div>
            <div className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
              <Trophy className="h-4 w-4" />
              <span className="font-semibold text-sm">{challenge.points}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-2 flex-wrap">
            <Badge className={getDifficultyColor(challenge.difficulty)}>
              {challenge.difficulty}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              {getCategoryIcon(challenge.category)}
              {challenge.category}
            </Badge>
            {isCompleted && (
              <Badge className="bg-green-500">
                Terminé
              </Badge>
            )}
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span className="font-medium">
                {challenge.progress}/{challenge.maxProgress}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Deadline */}
          {challenge.deadline && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>
                Échéance: {new Date(challenge.deadline).toLocaleDateString('fr-FR')}
              </span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            {isCompleted && !challenge.completed ? (
              <Button 
                onClick={() => onClaim?.(challenge.id)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Réclamer la récompense
              </Button>
            ) : challenge.completed ? (
              <Button variant="outline" disabled className="w-full">
                Défi terminé
              </Button>
            ) : challenge.progress > 0 ? (
              <Button 
                onClick={() => onStart?.(challenge.id)}
                variant="outline" 
                className="w-full"
              >
                Continuer
              </Button>
            ) : (
              <Button 
                onClick={() => onStart?.(challenge.id)}
                className="w-full"
              >
                Commencer
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengeCard;
