import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Challenge } from '@/types/gamification';
import { getCategoryColor } from '@/utils/gamificationUtils';
import { Calendar, Clock, Award, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

interface ChallengesListProps {
  challenges: Challenge[];
  onComplete?: (id: string) => Promise<boolean>;
  onFail?: (id: string) => Promise<boolean>;
  onRetry?: (id: string) => Promise<boolean>;
  className?: string;
}

const ChallengesList: React.FC<ChallengesListProps> = ({
  challenges,
  onComplete,
  onFail,
  onRetry,
  className
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Helper function to check status - adapted to work with our Challenge interface
  const isChallengeCompleted = (challenge: Challenge): boolean => {
    return challenge.completed;
  };

  const isChallengeFailed = (challenge: Challenge): boolean => {
    return false; // Default to false since 'failed' is optional
  };

  const isChallengeLocked = (challenge: Challenge): boolean => {
    return false; // Default to false since 'status' is optional
  };

  const getChallengeStatus = (challenge: Challenge): 'completed' | 'failed' | 'locked' | 'active' => {
    if (isChallengeCompleted(challenge)) return 'completed';
    if (isChallengeFailed(challenge)) return 'failed';
    if (isChallengeLocked(challenge)) return 'locked';
    return 'active';
  };

  const getStatusClass = (challenge: Challenge) => {
    const status = getChallengeStatus(challenge);
    if (status === 'completed') return 'bg-green-50 border-green-200';
    if (status === 'failed') return 'bg-red-50 border-red-200';
    if (status === 'locked') return 'bg-gray-50 border-gray-200';
    return 'bg-white border-slate-200';
  };

  // Wrapper functions to handle the Promise<boolean> return type
  const handleComplete = async (challengeId: string) => {
    if (onComplete) {
      try {
        return await onComplete(challengeId);
      } catch (error) {
        console.error('Error completing challenge:', error);
        return false;
      }
    }
    return false;
  };

  const handleFail = async (challengeId: string) => {
    if (onFail) {
      try {
        return await onFail(challengeId);
      } catch (error) {
        console.error('Error marking challenge as failed:', error);
        return false;
      }
    }
    return false;
  };

  const handleRetry = async (challengeId: string) => {
    if (onRetry) {
      try {
        return await onRetry(challengeId);
      } catch (error) {
        console.error('Error retrying challenge:', error);
        return false;
      }
    }
    return false;
  };

  // Helper to get status text
  const getStatusText = (challenge: Challenge): string => {
    if (isChallengeCompleted(challenge)) return 'Complété';
    if (isChallengeFailed(challenge)) return 'Échoué';
    if (isChallengeLocked(challenge)) return 'Verrouillé';
    return 'En cours';
  };

  return (
    <div className={cn("space-y-3", className)}>
      {challenges.map((challenge) => (
        <Card 
          key={challenge.id}
          className={cn("border overflow-hidden transition-all", getStatusClass(challenge))}
        >
          <CardContent className="p-0">
            <div 
              className="p-4 cursor-pointer"
              onClick={() => toggleExpand(challenge.id)}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-base">{challenge.title || challenge.name}</h3>
                    <div className="flex items-center gap-x-2 text-xs text-muted-foreground mt-1">
                      {challenge.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(challenge.deadline).toLocaleDateString()}
                        </span>
                      )}
                      {challenge.category && (
                        <span className={cn("font-medium", getCategoryColor(challenge.category))}>
                          {challenge.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-normal">
                    {challenge.points} pts
                  </Badge>
                  <ArrowRight className={cn(
                    "h-5 w-5 transition-transform",
                    expandedId === challenge.id ? "rotate-90" : "rotate-0"
                  )} />
                </div>
              </div>
            </div>
            
            {expandedId === challenge.id && (
              <div className="px-4 pb-4 pt-2 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>Progression</span>
                    <span>{Math.round(challenge.progress || 0)}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    {isChallengeCompleted(challenge) ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : isChallengeFailed(challenge) ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-muted-foreground">
                      {getStatusText(challenge)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    {(!isChallengeCompleted(challenge) && !isChallengeFailed(challenge) && !isChallengeLocked(challenge)) && onComplete && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleComplete(challenge.id);
                        }}
                      >
                        Marquer complété
                      </Button>
                    )}
                    
                    {(!isChallengeCompleted(challenge) && !isChallengeFailed(challenge) && !isChallengeLocked(challenge)) && onFail && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFail(challenge.id);
                        }}
                      >
                        Abandonner
                      </Button>
                    )}
                    
                    {isChallengeFailed(challenge) && onRetry && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRetry(challenge.id);
                        }}
                      >
                        Réessayer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChallengesList;
