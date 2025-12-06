// @ts-nocheck
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmotionalEnergyDisplay } from './EmotionalEnergyDisplay';
import { WellnessStreakDisplay } from './WellnessStreakDisplay';
import { HarmonyPointsDisplay } from './HarmonyPointsDisplay';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useWellnessQuests } from '@/hooks/useWellnessQuests';
import { useEmotionalBoosts } from '@/hooks/useEmotionalBoosts';
import { useEmotionalEnergy } from '@/hooks/useEmotionalEnergy';
import { Gift, Zap, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';

/**
 * Panel principal de gamification bien-être
 * Affiche l'énergie, streak, points, quêtes et boosts
 */
export const WellnessGamificationPanel = () => {
  const { quests, activeQuests, completedQuests, claimReward } = useWellnessQuests();
  const { boosts } = useEmotionalBoosts();
  const { energy, isLow } = useEmotionalEnergy();
  const [selectedBoost, setSelectedBoost] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <EmotionalEnergyDisplay size="md" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <WellnessStreakDisplay showCheckin={false} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Points Harmonie</p>
              <HarmonyPointsDisplay size="lg" className="mt-2" />
            </div>
            <TrendingUp className="w-8 h-8 text-muted-foreground/30" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="quests" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="quests">
            <Target className="w-4 h-4 mr-2" />
            Quêtes ({activeQuests.length})
          </TabsTrigger>
          <TabsTrigger value="boosts">
            <Zap className="w-4 h-4 mr-2" />
            Boosts ({boosts.length})
          </TabsTrigger>
        </TabsList>

        {/* Quests Tab */}
        <TabsContent value="quests" className="space-y-4">
          {activeQuests.length === 0 && completedQuests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Aucune quête disponible pour le moment</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Active Quests */}
              {activeQuests.map(quest => (
                <Card key={quest.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">{quest.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {quest.description}
                        </p>
                      </div>
                      <Badge variant={quest.questType === 'daily' ? 'default' : 'secondary'}>
                        {quest.questType === 'daily' ? '📅 Quotidien' : 
                         quest.questType === 'weekly' ? '📆 Hebdomadaire' : 
                         '✨ Spécial'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">
                          {quest.progress || 0} / {quest.targetValue}
                        </span>
                      </div>
                      <Progress 
                        value={((quest.progress || 0) / quest.targetValue) * 100} 
                        className="h-2"
                      />
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>⚡ +{quest.energyReward} énergie</span>
                        <span>✨ +{quest.harmonyPointsReward} points</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Completed Quests */}
              {completedQuests.map(quest => (
                <Card key={quest.id} className="border-success">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          ✅ {quest.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {quest.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={() => claimReward(quest.id)}
                      className="w-full"
                      variant="default"
                    >
                      <Gift className="w-4 h-4 mr-2" />
                      Réclamer la récompense
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </TabsContent>

        {/* Boosts Tab */}
        <TabsContent value="boosts" className="space-y-4">
          {isLow && (
            <Card className="bg-amber-500/10 border-amber-500/20">
              <CardContent className="py-4">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  💡 Ton énergie est basse. Essaie un boost pour te recharger !
                </p>
              </CardContent>
            </Card>
          )}

          {boosts.map(boost => (
            <Card key={boost.id}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-2xl">{boost.icon}</span>
                  {boost.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {boost.description}
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>⏱️ {boost.durationMinutes} min</span>
                    <span>⚡ +{boost.energyRestore} énergie</span>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => setSelectedBoost(boost.id)}
                  >
                    Commencer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
