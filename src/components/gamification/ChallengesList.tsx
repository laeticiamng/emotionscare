
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Challenge } from '@/types';
import { getCategoryColor, getFormattedChallengeStatus } from '@/utils/gamificationUtils';
import { Calendar, Clock, Award, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

// Update the function signature to match the expected return type
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

  const getStatusClass = (challenge: Challenge) => {
    if (challenge.status === 'completed') return 'bg-green-50 border-green-200';
    if (challenge.status === 'failed' || challenge.failed) return 'bg-red-50 border-red-200';
    if (challenge.status === 'locked') return 'bg-gray-50 border-gray-200';
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
                  <div className={cn("h-10 w-10 rounded-full flex items-center justify-center", 
                    challenge.icon ? "" : "bg-primary/10")}>
                    {challenge.icon || <Award className="h-5 w-5 text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-base">{challenge.title}</h3>
                    <div className="flex items-center gap-x-2 text-xs text-muted-foreground mt-1">
                      {challenge.isDaily && <Badge variant="outline" className="text-xs">Quotidien</Badge>}
                      {challenge.isWeekly && <Badge variant="outline" className="text-xs">Hebdomadaire</Badge>}
                      {challenge.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(challenge.deadline).toLocaleDateString()}
                        </span>
                      )}
                      <span className={cn("font-medium", getCategoryColor(challenge.category))}>
                        {challenge.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-normal">
                    {challenge.xp} XP
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
                    <span>{Math.round(challenge.progress)}%</span>
                  </div>
                  <Progress value={challenge.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5">
                    {challenge.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : challenge.failed || challenge.status === 'failed' ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-muted-foreground">
                      {challenge.status === 'completed' ? 'Complété' : 
                       challenge.status === 'failed' ? 'Échoué' :
                       challenge.status === 'locked' ? 'Verrouillé' : 'En cours'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    {challenge.status === 'active' && onComplete && (
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
                    
                    {challenge.status === 'active' && onFail && (
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
                    
                    {(challenge.failed || challenge.status === 'failed') && onRetry && (
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
