import React, { useState, useEffect } from 'react';
import { PageRoot } from '@/components/common/PageRoot';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sword, Shield, Crown, Target, Zap, Heart } from 'lucide-react';
import { useMood } from '@/contexts/MoodContext';
import { useActivityLogger } from '@/hooks/useActivityLogger';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

const BossLevelGritPage = () => {
  const [currentQuest, setCurrentQuest] = useState<any>(null);
  const [gritLevel, setGritLevel] = useState(1);
  const [experience, setExperience] = useState(250);
  const [isLoadingQuest, setIsLoadingQuest] = useState(false);
  const [completedQuests, setCompletedQuests] = useState(0);
  const { currentMood } = useMood();
  const { logActivity } = useActivityLogger();

  useEffect(() => {
    logActivity('/boss-level-grit', 'grit_development_page');
    loadPersonalizedQuest();
  }, [logActivity]);

  const startChallenge = (challenge: GritChallenge) => {
    setSelectedChallenge(challenge);
    setActiveTab('session');
  };

  const completeChallenge = (score: number, insights: string[]) => {
    if (selectedChallenge) {
      console.log('Défi complété:', {
        challenge: selectedChallenge.id,
        score,
        insights
      });
      
      // Mise à jour du statut du défi
      setSelectedChallenge(null);
      setActiveTab('challenges');
      
      // Ici on mettrait à jour les stats et sauvegarderait en base
    }
  };

  const backToChallenges = () => {
    setSelectedChallenge(null);
    setActiveTab('challenges');
  };

  return (
    <UnifiedShell>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header avec stats globales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Boss Level Grit
            </h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{gritStats.totalXp}</div>
                <div className="text-sm text-muted-foreground">XP Total</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Flame className="h-4 w-4 text-accent" />
                  <div className="text-2xl font-bold text-accent">{gritStats.currentStreak}</div>
                </div>
                <div className="text-sm text-muted-foreground">Série Actuelle</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-muted/20 to-muted/10">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{gritStats.completedChallenges}</div>
                <div className="text-sm text-muted-foreground">Défis Complétés</div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-destructive">{gritStats.averageScore}%</div>
                <div className="text-sm text-muted-foreground">Score Moyen</div>
              </CardContent>
            </Card>
          </div>

          {/* Progression vers le niveau suivant */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{gritStats.currentLevel.name}</span>
                  <Badge variant="secondary">{gritStats.currentLevel.icon}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {gritStats.totalXp} / {gritStats.nextLevel.minXp} XP
                </div>
              </div>
              <Progress 
                value={(gritStats.totalXp - gritStats.currentLevel.minXp) / (gritStats.nextLevel.minXp - gritStats.currentLevel.minXp) * 100} 
                className="h-3"
              />
              <div className="text-center mt-2 text-sm text-muted-foreground">
                {gritStats.nextLevel.minXp - gritStats.totalXp} XP pour atteindre {gritStats.nextLevel.name}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="challenges">Défis</TabsTrigger>
            <TabsTrigger value="session">Session Active</TabsTrigger>
            <TabsTrigger value="progress">Progression</TabsTrigger>
            <TabsTrigger value="achievements">Succès</TabsTrigger>
          </TabsList>

          {/* Onglet Défis */}
          <TabsContent value="challenges" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {challenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onStart={startChallenge}
                />
              ))}
            </div>
          </TabsContent>

          {/* Onglet Session Active */}
          <TabsContent value="session" className="space-y-6">
            <ActiveSession
              challenge={selectedChallenge}
              onComplete={completeChallenge}
              onBack={backToChallenges}
            />
          </TabsContent>

          {/* Onglet Progression */}
          <TabsContent value="progress" className="space-y-6">
            <ProgressStats stats={gritStats} />
          </TabsContent>

          {/* Onglet Succès */}
          <TabsContent value="achievements" className="space-y-6">
            <AchievementsList achievements={gritStats.achievements} />
          </TabsContent>
        </Tabs>
      </div>
    </UnifiedShell>
  );
};

export default BossLevelGritPage;