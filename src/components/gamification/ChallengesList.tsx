
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Challenge } from '@/types/gamification';
import { Trophy, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ChallengesListProps {
  challenges: Challenge[];
  onComplete?: (challengeId: string) => Promise<boolean>;
}

const ChallengesList: React.FC<ChallengesListProps> = ({ challenges, onComplete }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [isCompleting, setIsCompleting] = useState<string | null>(null);

  const filteredChallenges = challenges.filter(challenge => {
    if (filter === 'all') return true;
    if (filter === 'completed') return challenge.completed;
    if (filter === 'active') return !challenge.completed && !challenge.failed;
    return true;
  });

  const handleCompleteChallenge = async (challengeId: string) => {
    if (!onComplete) return;
    
    setIsCompleting(challengeId);
    try {
      const success = await onComplete(challengeId);
      if (!success) {
        console.error('Failed to complete challenge');
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
    } finally {
      setIsCompleting(null);
    }
  };

  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      'daily': 'bg-blue-500',
      'weekly': 'bg-purple-500',
      'monthly': 'bg-amber-500',
      'special': 'bg-emerald-500',
      'streak': 'bg-rose-500',
      'social': 'bg-cyan-500',
      'achievement': 'bg-indigo-500'
    };
    
    return categories[category.toLowerCase()] || 'bg-gray-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Défis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={filter} onValueChange={(v) => setFilter(v as 'all' | 'active' | 'completed')}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="active">En cours</TabsTrigger>
            <TabsTrigger value="completed">Complétés</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredChallenges.map(challenge => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                onComplete={handleCompleteChallenge}
                isCompleting={isCompleting === challenge.id}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            {filteredChallenges.map(challenge => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                onComplete={handleCompleteChallenge}
                isCompleting={isCompleting === challenge.id}
              />
            ))}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {filteredChallenges.map(challenge => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge} 
                onComplete={handleCompleteChallenge}
                isCompleting={isCompleting === challenge.id}
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete?: (id: string) => Promise<boolean>;
  isCompleting?: boolean;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onComplete, isCompleting = false }) => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(challenge.category)}`}>
            <span className="text-white">
              {challenge.icon || '🏆'}
            </span>
          </div>
          <div>
            <h3 className="font-medium">{challenge.title}</h3>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {challenge.completed && (
            <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3" />
              Complété
            </Badge>
          )}
          
          {challenge.failed && (
            <Badge variant="outline" className="gap-1 bg-red-50 text-red-700 border-red-200">
              <XCircle className="h-3 w-3" />
              Échoué
            </Badge>
          )}
          
          {(!challenge.completed && !challenge.failed) && challenge.deadline && (
            <Badge variant="outline" className="gap-1">
              <Clock className="h-3 w-3" />
              {new Date(challenge.deadline).toLocaleDateString()}
            </Badge>
          )}
          
          <Badge variant="secondary">{challenge.points} pts</Badge>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        {!challenge.completed && !challenge.failed && (
          <>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progrès</span>
              <span>{challenge.progress}%</span>
            </div>
            <Progress value={challenge.progress} className="h-2" />
            
            {challenge.progress === 100 && onComplete && (
              <Button 
                size="sm" 
                className="w-full mt-2"
                onClick={() => onComplete(challenge.id)}
                disabled={isCompleting}
              >
                {isCompleting ? 'Validation...' : 'Valider le défi'}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChallengesList;
