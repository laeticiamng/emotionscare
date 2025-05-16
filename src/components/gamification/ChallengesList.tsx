
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Challenge } from '@/types/gamification';
import { CheckCircle, AlertCircle, Clock, Award, Target } from 'lucide-react';
import { getCategoryColor, completeChallenge } from '@/utils/gamificationUtils';

interface ChallengesListProps {
  challenges: Challenge[];
  onComplete?: (id: string) => Promise<boolean>;
}

const ChallengesList: React.FC<ChallengesListProps> = ({ 
  challenges,
  onComplete = completeChallenge
}) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Filter challenges into categories: active, completed, failed
  const activeChallenges = challenges.filter(c => !c.completed && !c.failed);
  const completedChallenges = challenges.filter(c => c.completed);
  const failedChallenges = challenges.filter(c => c.failed);
  
  // Handle completing a challenge
  const handleComplete = async (challengeId: string) => {
    setProcessingId(challengeId);
    try {
      // Call the provided onComplete function or the default completeChallenge utility
      const success = await onComplete(challengeId);
      
      // In a real app, you might want to update the local state or refetch the challenges
      console.log(`Challenge ${challengeId} ${success ? 'completed' : 'failed to complete'}`);
      
    } catch (error) {
      console.error('Error completing challenge:', error);
    } finally {
      setProcessingId(null);
    }
    
    return true; // Return boolean for compatibility
  };
  
  // Render a single challenge
  const renderChallenge = (challenge: Challenge) => {
    const isProcessing = processingId === challenge.id;
    const isCompleted = challenge.completed;
    const isFailed = challenge.failed;
    const isActive = !isCompleted && !isFailed;
    
    // Determine icon based on challenge status
    let statusIcon = null;
    if (isCompleted) {
      statusIcon = <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (isFailed) {
      statusIcon = <AlertCircle className="h-5 w-5 text-red-600" />;
    } else if (challenge.deadline) {
      statusIcon = <Clock className="h-5 w-5 text-amber-600" />;
    }
    
    // Map category name to an icon component
    const iconMap: Record<string, React.ReactNode> = {
      'daily': <Clock className="h-5 w-5" />,
      'weekly': <Target className="h-5 w-5" />,
      'monthly': <Award className="h-5 w-5" />
    };
    
    // Get icon based on category or use a default
    const categoryIcon = iconMap[challenge.category.toLowerCase()] || <Award className="h-5 w-5" />;
    
    return (
      <div 
        key={challenge.id}
        className={`p-4 border rounded-lg mb-4 ${
          isCompleted ? 'bg-green-50 border-green-200' : 
          isFailed ? 'bg-red-50 border-red-200' : 
          'bg-card border-border'
        }`}
      >
        <div className="flex items-start">
          <div className={`w-10 h-10 rounded-lg ${getCategoryColor(challenge.category)} flex items-center justify-center mr-3`}>
            {categoryIcon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{challenge.title}</h3>
              {statusIcon}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
            
            <div className="flex items-center justify-between mb-1 text-xs">
              <Badge variant="outline" className="bg-muted">
                {challenge.category}
              </Badge>
              <span className="font-medium">{challenge.points} points</span>
            </div>
            
            {!isCompleted && !isFailed && (
              <>
                <Progress value={challenge.progress} className="h-2 mb-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{challenge.progress}% terminé</span>
                  {challenge.deadline && (
                    <span>Expire: {new Date(challenge.deadline).toLocaleDateString()}</span>
                  )}
                </div>
              </>
            )}
            
            {isActive && challenge.progress === 100 && (
              <div className="mt-3 flex justify-end">
                <Button 
                  size="sm" 
                  onClick={() => handleComplete(challenge.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? "En cours..." : "Valider"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6">
      {activeChallenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Défis actifs ({activeChallenges.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {activeChallenges.map(renderChallenge)}
          </CardContent>
        </Card>
      )}
      
      {completedChallenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Défis complétés ({completedChallenges.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {completedChallenges.map(renderChallenge)}
          </CardContent>
        </Card>
      )}
      
      {failedChallenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Défis échoués ({failedChallenges.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {failedChallenges.map(renderChallenge)}
          </CardContent>
        </Card>
      )}
      
      {challenges.length === 0 && (
        <div className="text-center py-12">
          <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">Aucun défi disponible</h3>
          <p className="text-muted-foreground">
            Revenez plus tard pour découvrir de nouveaux défis
          </p>
        </div>
      )}
    </div>
  );
};

export default ChallengesList;
