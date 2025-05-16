
import React, { useState } from 'react';
import { Challenge } from '@/types/gamification';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, Calendar, Award } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getCategoryColor } from '@/utils/gamificationUtils'; 

interface ChallengesListProps {
  challenges: Challenge[];
}

const ChallengesList: React.FC<ChallengesListProps> = ({ challenges }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Filter challenges based on active tab
  const filteredChallenges = challenges.filter(challenge => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return challenge.status === 'active';
    if (activeTab === 'completed') return challenge.status === 'completed';
    if (activeTab === 'failed') return challenge.status === 'failed' || challenge.failed;
    return true;
  });
  
  const getChallengeStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'locked':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  const getChallengeIcon = (challenge: Challenge) => {
    if (challenge.icon) return challenge.icon;
    
    if (challenge.isDaily) return <Clock className="h-4 w-4" />;
    if (challenge.isWeekly) return <Calendar className="h-4 w-4" />;
    return <Award className="h-4 w-4" />;
  };
  
  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      // Here you would normally call your API to complete the challenge
      // For now, we'll just simulate a successful response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: 'Défi complété',
        description: 'Félicitations! Vous avez remporté ce défi.',
      });
      
      return true;
    } catch (error) {
      console.error('Error completing challenge:', error);
      
      toast({
        title: 'Erreur',
        description: 'Impossible de compléter le défi. Veuillez réessayer.',
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  const handleRetryChallenge = async (challengeId: string) => {
    try {
      // Here you would call your API to retry the challenge
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: 'Défi réactivé',
        description: 'Vous pouvez maintenant réessayer ce défi.',
      });
      
      return true;
    } catch (error) {
      console.error('Error retrying challenge:', error);
      
      toast({
        title: 'Erreur',
        description: 'Impossible de réactiver le défi. Veuillez réessayer.',
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  const handleAbandonChallenge = async (challengeId: string) => {
    try {
      // Here you would call your API to abandon the challenge
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: 'Défi abandonné',
        description: 'Vous avez abandonné ce défi. Vous pourrez le reprendre plus tard.',
      });
      
      return true;
    } catch (error) {
      console.error('Error abandoning challenge:', error);
      
      toast({
        title: 'Erreur',
        description: 'Impossible d\'abandonner le défi. Veuillez réessayer.',
        variant: 'destructive',
      });
      
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="active">En cours</TabsTrigger>
          <TabsTrigger value="completed">Complétés</TabsTrigger>
          <TabsTrigger value="failed">Échoués</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChallenges.length > 0 ? (
          filteredChallenges.map((challenge) => (
            <Card key={challenge.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${getCategoryColor(challenge.category)} flex items-center justify-center`}>
                      {getChallengeIcon(challenge)}
                    </div>
                    <CardTitle className="text-base">{challenge.title}</CardTitle>
                  </div>
                  <Badge variant={
                    challenge.status === 'completed' ? 'default' :
                    challenge.status === 'active' ? 'outline' :
                    challenge.failed || challenge.status === 'failed' ? 'destructive' : 'secondary'
                  }>
                    {challenge.status === 'completed' ? 'Complété' :
                     challenge.status === 'active' ? 'En cours' :
                     challenge.failed || challenge.status === 'failed' ? 'Échoué' : 'Verrouillé'}
                  </Badge>
                </div>
                <CardDescription className="mt-1">
                  {challenge.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                {challenge.status !== 'completed' && challenge.status !== 'failed' && !challenge.failed && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progression</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>
                )}
                {(challenge.status === 'completed') && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>+{challenge.xp} XP gagnés</span>
                  </div>
                )}
                {(challenge.failed || challenge.status === 'failed') && (
                  <div className="flex items-center gap-1 text-red-600 text-sm">
                    <XCircle className="h-4 w-4" />
                    <span>Défi non complété à temps</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-2">
                {challenge.status === 'active' && (
                  <div className="flex justify-between w-full">
                    <Button variant="outline" size="sm" onClick={() => handleAbandonChallenge(challenge.id)}>
                      Abandonner
                    </Button>
                    <Button size="sm" onClick={() => handleCompleteChallenge(challenge.id)}>
                      Compléter
                    </Button>
                  </div>
                )}
                {(challenge.failed || challenge.status === 'failed') && (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => handleRetryChallenge(challenge.id)}>
                    Réessayer
                  </Button>
                )}
                {challenge.status === 'completed' && (
                  <Button variant="ghost" size="sm" className="w-full" disabled>
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Défi complété
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">Aucun défi trouvé dans cette catégorie.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengesList;
