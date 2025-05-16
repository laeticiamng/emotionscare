
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Progress, Badge, Button } from '@/components/ui';
import { Calendar, ArrowUpRight, Clock, Award, Target, CheckCircle } from 'lucide-react';
import { Challenge } from '@/types/gamification';
import { formatDistanceToNow, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChallengesListProps {
  challenges: Challenge[];
  onComplete?: (id: string) => void | Promise<boolean>;
  hideCompletedChallenges?: boolean;
  onChallengeClick?: (challenge: Challenge) => void;
  filtersEnabled?: boolean;
  className?: string;
}

const ChallengesList: React.FC<ChallengesListProps> = ({
  challenges,
  onComplete,
  hideCompletedChallenges = false,
  onChallengeClick,
  filtersEnabled = true,
  className = '',
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedChallenge(expandedChallenge === id ? null : id);
  };

  const filteredChallenges = challenges.filter((challenge) => {
    if (hideCompletedChallenges) return !challenge.completed;
    if (activeFilter === 'all') return true;
    return activeFilter === 'completed' ? challenge.completed : !challenge.completed;
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'daily':
        return 'Quotidien';
      case 'weekly':
        return 'Hebdomadaire';
      case 'monthly':
        return 'Mensuel';
      case 'special':
        return 'Spécial';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily':
        return 'bg-blue-500 text-white';
      case 'weekly':
        return 'bg-purple-500 text-white';
      case 'monthly':
        return 'bg-orange-500 text-white';
      case 'special':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false;
    try {
      return isAfter(new Date(), new Date(deadline));
    } catch (e) {
      return false;
    }
  };

  const renderDeadline = (challenge: Challenge) => {
    if (!challenge.deadline) return null;
    
    try {
      const date = new Date(challenge.deadline);
      const isLate = isOverdue(challenge.deadline);
      
      return (
        <div className={`flex items-center text-xs ${isLate ? 'text-red-500' : 'text-muted-foreground'}`}>
          <Clock className="mr-1 h-3 w-3" />
          {isLate ? 'Expiré depuis ' : 'Expire dans '}
          {formatDistanceToNow(date, { locale: fr })}
        </div>
      );
    } catch (e) {
      return null;
    }
  };

  if (!challenges || challenges.length === 0) {
    return (
      <div className="text-center p-8 bg-muted/20 rounded-lg">
        <Target className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="font-medium text-lg mb-1">Pas de défis disponibles</h3>
        <p className="text-muted-foreground">Revenez plus tard pour découvrir de nouveaux défis.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {filtersEnabled && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          <Button
            variant={activeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('all')}
          >
            Tous
          </Button>
          <Button
            variant={activeFilter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('active')}
          >
            En cours
          </Button>
          <Button
            variant={activeFilter === 'completed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter('completed')}
          >
            Complétés
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {filteredChallenges.map((challenge) => (
          <Card
            key={challenge.id}
            className={`overflow-hidden transition-all cursor-pointer ${
              expandedChallenge === challenge.id ? 'ring-2 ring-primary' : ''
            } ${challenge.completed ? 'bg-muted/20' : ''}`}
            onClick={() => {
              if (onChallengeClick) {
                onChallengeClick(challenge);
              } else {
                toggleExpand(challenge.id);
              }
            }}
          >
            <CardHeader className="p-4 pb-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <Badge className={`mr-2 ${getCategoryColor(challenge.category)}`}>
                      {getCategoryLabel(challenge.category)}
                    </Badge>
                    {challenge.completed && (
                      <Badge variant="success-subtle" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Complété
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base font-medium">
                    {challenge.title || (challenge.name ? challenge.name : '')}
                  </CardTitle>
                </div>
                <div className="text-lg font-semibold text-primary">
                  +{challenge.points}
                  <span className="text-xs ml-1">pts</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-2">
              <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
              
              <div>
                {(challenge.total !== undefined || challenge.goal !== undefined) ? (
                  <div className="mb-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs">Progression</span>
                      <span className="text-xs font-medium">
                        {challenge.progress}/{challenge.total !== undefined ? challenge.total : (challenge.goal !== undefined ? challenge.goal : 1)}
                      </span>
                    </div>
                    <Progress
                      value={(challenge.progress / (challenge.total !== undefined ? challenge.total : (challenge.goal !== undefined ? challenge.goal : 1))) * 100}
                      className="h-1.5"
                    />
                  </div>
                ) : (
                  <Progress value={challenge.progress} className="h-1.5 mb-2" />
                )}
                
                <div className="flex justify-between items-center mt-3">
                  <div className="text-xs">
                    {renderDeadline(challenge)}
                  </div>
                  
                  {!challenge.completed && onComplete && expandedChallenge === challenge.id && (
                    <Button
                      size="sm"
                      className="ml-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        onComplete(challenge.id);
                      }}
                    >
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Marquer comme complété
                    </Button>
                  )}
                  
                  {challenge.completed && expandedChallenge === challenge.id && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Award className="h-3 w-3 mr-1" />
                      Défi terminé
                    </div>
                  )}

                  {expandedChallenge !== challenge.id && (
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChallengesList;
