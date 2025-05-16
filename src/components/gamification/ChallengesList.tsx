
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, isPast, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CheckCircle, Clock, Zap, Award, Target, Flag } from 'lucide-react';
import { Challenge } from '@/types';

interface ChallengesListProps {
  challenges: Challenge[];
  onCompleteChallenge?: (id: string) => void;
  className?: string;
  loading?: boolean;
}

const ChallengesList: React.FC<ChallengesListProps> = ({
  challenges,
  onCompleteChallenge,
  className = '',
  loading = false
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id)
        ? prev.filter(expandedId => expandedId !== id)
        : [...prev, id]
    );
  };

  // Helper to get status label in French
  const getStatusLabel = (status?: string): string => {
    switch (status) {
      case 'active':
      case 'ongoing':
      case 'available':
        return 'En cours';
      case 'completed':
        return 'Complété';
      case 'failed':
        return 'Échoué';
      case 'locked':
        return 'Verrouillé';
      case 'expired':
        return 'Expiré';
      case 'not-started':
        return 'À démarrer';
      default:
        return 'À faire';
    }
  };

  // Helper to get badge variant based on status
  const getStatusVariant = (status?: string): 'default' | 'outline' | 'secondary' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'active':
      case 'ongoing':
      case 'available':
        return 'default';
      case 'completed':
        return 'success';
      case 'failed':
      case 'expired':
        return 'error';
      case 'locked':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  // Get time remaining if deadline is present
  const getTimeRemaining = (challenge: Challenge): string | null => {
    if (!challenge.deadline) return null;
    
    try {
      const deadlineDate = parseISO(challenge.deadline);
      if (isPast(deadlineDate)) {
        return 'Délai expiré';
      }
      return `${formatDistanceToNow(deadlineDate, { locale: fr, addSuffix: false })} restant`;
    } catch (e) {
      console.error("Error parsing deadline:", e);
      return null;
    }
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 w-1/3 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 w-3/4 bg-muted rounded mb-4"></div>
              <div className="h-2 w-full bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!challenges || challenges.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <Target className="mx-auto h-12 w-12 mb-4 opacity-20" />
        <h3 className="text-lg font-medium">Aucun défi disponible</h3>
        <p className="mt-2">De nouveaux défis seront bientôt disponibles.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {challenges.map((challenge) => {
        const isExpanded = expandedIds.includes(challenge.id);
        const timeRemaining = getTimeRemaining(challenge);
        const progressValue = challenge.progress || 0;
        const targetValue = challenge.goal || challenge.total || 100;
        const progressPercent = Math.min(Math.round((progressValue / targetValue) * 100), 100);
        const isCompleted = challenge.status === 'completed' || challenge.completed;

        return (
          <Card 
            key={challenge.id}
            className={`transition-all ${isCompleted ? 'bg-success/5 border-success/20' : ''}`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {challenge.title || challenge.name}
                  </CardTitle>
                  <CardDescription>
                    {challenge.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge variant={getStatusVariant(challenge.status)}>
                    {getStatusLabel(challenge.status)}
                  </Badge>
                  <span className="text-sm font-medium">
                    {challenge.points} pts
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-2">
              {/* Progress display */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Progression</span>
                  <span className="font-medium">
                    {progressValue} / {targetValue}
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              {/* Time remaining info */}
              {timeRemaining && (
                <div className="flex items-center gap-1.5 mt-3 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{timeRemaining}</span>
                </div>
              )}
              
              {/* Extra details when expanded */}
              {isExpanded && (
                <div className="mt-4 space-y-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-sm">
                      {challenge.difficulty || 'Difficulté standard'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Flag className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {challenge.category || 'Catégorie générale'}
                    </span>
                  </div>
                  
                  {challenge.completions !== undefined && (
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-indigo-500" />
                      <span className="text-sm">
                        Complété {challenge.completions} fois
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpand(challenge.id)}
              >
                {isExpanded ? 'Masquer' : 'Détails'}
              </Button>

              {!isCompleted && onCompleteChallenge && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onCompleteChallenge(challenge.id)}
                  className="gap-1"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Marquer complété
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default ChallengesList;
