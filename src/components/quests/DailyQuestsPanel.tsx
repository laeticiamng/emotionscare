/**
 * Panneau d'affichage des quêtes quotidiennes et hebdomadaires
 * Progression temps réel avec animations
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Clock, Trophy, Zap } from 'lucide-react';
import {
  Quest,
  generateDailyQuests,
  generateWeeklyQuests,
  updateQuestProgress,
  isQuestExpired,
  getQuestProgressPercentage,
  getQuestDifficultyColor,
  getTimeRemaining
} from '@/services/quests/quests-service';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export const DailyQuestsPanel: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dailyQuests, setDailyQuests] = useState<Quest[]>([]);
  const [weeklyQuests, setWeeklyQuests] = useState<Quest[]>([]);

  useEffect(() => {
    if (user?.id) {
      // Charger les quêtes (normalement depuis Supabase)
      // Pour l'instant, on génère des quêtes mock
      setDailyQuests(generateDailyQuests(user.id));
      setWeeklyQuests(generateWeeklyQuests(user.id));
    }
  }, [user?.id]);

  const handleClaimReward = (quest: Quest) => {
    if (!quest.completed) return;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    toast({
      title: "🎉 Récompense réclamée !",
      description: `+${quest.xpReward} XP ${quest.badgeReward ? '+ Badge exclusif débloqué !' : ''}`,
      duration: 4000,
    });

    // Mettre à jour la quête (normalement dans Supabase)
  };

  const handleSimulateProgress = (questId: string, isWeekly: boolean) => {
    if (isWeekly) {
      setWeeklyQuests(prev => updateQuestProgress(prev, questId, 1));
    } else {
      setDailyQuests(prev => updateQuestProgress(prev, questId, 1));
    }
  };

  const renderQuest = (quest: Quest, isWeekly: boolean) => {
    const progress = getQuestProgressPercentage(quest);
    const expired = isQuestExpired(quest);
    const timeRemaining = quest.expiresAt ? getTimeRemaining(quest.expiresAt) : '';

    return (
      <motion.div
        key={quest.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        layout
      >
        <Card className={`${quest.completed ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20' : 'hover:shadow-md'} transition-all duration-300`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="text-3xl">{quest.icon}</div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{quest.title}</h4>
                      {quest.completed && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{quest.description}</p>
                  </div>
                  
                  <Badge variant="outline" className={getQuestDifficultyColor(quest.difficulty)}>
                    {quest.difficulty}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Progression: {quest.currentValue}/{quest.targetValue}
                    </span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">+{quest.xpReward} XP</span>
                    </div>
                    {quest.badgeReward && (
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-purple-500" />
                        <span className="text-xs">Badge</span>
                      </div>
                    )}
                    {!expired && timeRemaining && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{timeRemaining}</span>
                      </div>
                    )}
                  </div>

                  {quest.completed ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleClaimReward(quest)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500"
                    >
                      Réclamer
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSimulateProgress(quest.id, isWeekly)}
                      disabled={expired}
                    >
                      Simuler +1
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Quêtes & Missions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">
                Quotidiennes ({dailyQuests.filter(q => !q.completed).length})
              </TabsTrigger>
              <TabsTrigger value="weekly">
                Hebdomadaires ({weeklyQuests.filter(q => !q.completed).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-3 mt-4">
              <AnimatePresence mode="popLayout">
                {dailyQuests.length > 0 ? (
                  dailyQuests.map(quest => renderQuest(quest, false))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune quête quotidienne disponible
                  </p>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="weekly" className="space-y-3 mt-4">
              <AnimatePresence mode="popLayout">
                {weeklyQuests.length > 0 ? (
                  weeklyQuests.map(quest => renderQuest(quest, true))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune quête hebdomadaire disponible
                  </p>
                )}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
