/**
 * B2C Boss Level Grit Page - Module de résilience gamifié
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Crown, BarChart2, Sword, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGritQuest } from '@/hooks/useGritQuest';
import { useBossGritPersistence } from '@/hooks/useBossGritPersistence';
import { toast } from '@/hooks/use-toast';
import {
  ChallengeCard,
  QuestPanel,
  PlayerStats,
  QuestComplete,
  type Challenge,
  type Quest
} from '@/components/boss-grit';

type ViewMode = 'challenges' | 'stats' | 'history';

// Défis prédéfinis
const PRESET_CHALLENGES: Challenge[] = [
  {
    id: 'daily-focus',
    title: 'Maître de la Concentration',
    description: 'Maintenez votre focus pendant 25 minutes sans interruption',
    difficulty: 'douce',
    xp: 50,
    duration: '25 min',
    icon: 'target',
    status: 'available'
  },
  {
    id: 'stress-warrior',
    title: 'Guerrier Anti-Stress',
    description: 'Gérez 5 situations stressantes avec nos techniques',
    difficulty: 'modérée',
    xp: 100,
    duration: '1 heure',
    icon: 'shield',
    status: 'available'
  },
  {
    id: 'emotion-master',
    title: 'Maître des Émotions',
    description: 'Identifiez et gérez 10 émotions différentes',
    difficulty: 'épique',
    xp: 200,
    duration: '2 heures',
    icon: 'crown',
    status: 'available'
  },
  {
    id: 'boss-resilience',
    title: 'Boss Final: Résilience Ultime',
    description: 'Défi ultime de résilience émotionnelle',
    difficulty: 'boss',
    xp: 500,
    duration: '1 jour',
    icon: 'sword',
    status: 'locked'
  }
];

const B2CBossLevelGritPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('challenges');
  const [challenges, setChallenges] = useState<Challenge[]>(PRESET_CHALLENGES);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [showCompletion, setShowCompletion] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  const {
    quest,
    isLoading,
    elapsedTime,
    status,
    pauseCount,
    loadQuest,
    startQuest,
    completeQuest,
    pauseQuest,
    resumeQuest,
    abortQuest,
    resetQuest,
    updateElapsedTime
  } = useGritQuest();

  // Supabase persistence
  const { stats: persistedStats, saveQuest, quests: questHistory } = useBossGritPersistence();

  // Player stats from Supabase (with fallback)
  const playerStats = {
    level: persistedStats.level,
    currentXP: persistedStats.totalXP % 500,
    maxXP: 500,
    totalQuests: persistedStats.totalQuests,
    completedQuests: persistedStats.completedQuests,
    streak: persistedStats.currentStreak,
    bestStreak: persistedStats.bestStreak
  };

  // Timer ref for elapsed time
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // Stats are now loaded from Supabase via useBossGritPersistence

  // Timer effect: increment elapsed time every second when active
  useEffect(() => {
    if (status === 'active' && !timerRef.current) {
      startTimeRef.current = Date.now() - elapsedTime * 1000;
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const newElapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          updateElapsedTime(newElapsed);
        }
      }, 1000);
    } else if (status === 'paused' && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    } else if (status !== 'active' && status !== 'paused' && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status, elapsedTime, updateElapsedTime]);

  // Convert quest from hook to Quest format
  useEffect(() => {
    if (quest) {
      const convertedQuest: Quest = {
        id: quest.quest_id,
        title: quest.title,
        description: quest.copy,
        difficulty: 'Modérée',
        tasks: [
          { id: 't1', text: quest.copy, completed: false, xp: 50 },
          { id: 't2', text: 'Maintenir le focus pendant toute la durée', completed: false, xp: 30 },
          { id: 't3', text: 'Respirer profondément si le stress monte', completed: false, xp: 20 }
        ],
        totalXP: 100,
        icon: 'target',
        theme: 'balance'
      };
      setActiveQuest(convertedQuest);

      // Auto-start quest
      if (quest.quest_id && status === 'idle') {
        startQuest(quest.quest_id);
      }
    }
  }, [quest, status, startQuest]);

  const handleStartChallenge = async (challengeId: string) => {
    // Update challenge status
    setChallenges(prev =>
      prev.map(c =>
        c.id === challengeId ? { ...c, status: 'in-progress' as const } : c
      )
    );

    // Load quest from API
    await loadQuest();
  };

  const handleGenerateQuest = async () => {
    await loadQuest();
    if (quest) {
      startQuest(quest.quest_id);
    }
  };

  const handleToggleTask = (taskId: string | number) => {
    if (!activeQuest) return;
    
    setActiveQuest(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        tasks: prev.tasks.map(t =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      };
    });
  };

  const handleCompleteQuest = async () => {
    if (!activeQuest) return;

    const tasksCompleted = activeQuest.tasks.filter(t => t.completed).length;
    const xp = activeQuest.tasks
      .filter(t => t.completed)
      .reduce((sum, t) => sum + t.xp, 0);
    
    setEarnedXP(xp);

    // Save to Supabase
    await saveQuest({
      quest_title: activeQuest.title,
      quest_description: activeQuest.description,
      difficulty: activeQuest.difficulty,
      xp_earned: xp,
      tasks_completed: tasksCompleted,
      total_tasks: activeQuest.tasks.length,
      elapsed_seconds: elapsedTime,
      success: true,
      completed_at: new Date().toISOString()
    });

    await completeQuest(true);

    // Check for level up
    const newLevel = Math.floor((persistedStats.totalXP + xp) / 500) + 1;
    if (newLevel > persistedStats.level) {
      toast({
        title: `🎉 Niveau ${newLevel} atteint !`,
        description: 'Félicitations pour votre progression !'
      });
    }

    setShowCompletion(true);
  };

  const handleAbandonQuest = async () => {
    if (activeQuest) {
      // Save abandoned quest to Supabase
      await saveQuest({
        quest_title: activeQuest.title,
        quest_description: activeQuest.description,
        difficulty: activeQuest.difficulty,
        xp_earned: 0,
        tasks_completed: 0,
        total_tasks: activeQuest.tasks.length,
        elapsed_seconds: elapsedTime,
        success: false,
        completed_at: new Date().toISOString()
      });
    }

    abortQuest('User abandoned');
    setActiveQuest(null);
    setChallenges(prev =>
      prev.map(c =>
        c.status === 'in-progress' ? { ...c, status: 'available' as const } : c
      )
    );
  };

  const handleNewQuest = () => {
    setShowCompletion(false);
    setActiveQuest(null);
    resetQuest();
  };

  const handleBackToMenu = () => {
    setShowCompletion(false);
    setActiveQuest(null);
    resetQuest();
  };

  const isPaused = status === 'paused';
  const isActive = status === 'active';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-muted/20 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-info rounded-full mb-6">
            <Crown className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Boss Level Grit
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Relevez des défis émotionnels progressifs et développez votre résilience mentale
          </p>

          {/* Compact stats */}
          <PlayerStats stats={playerStats} compact />
        </motion.div>

        {/* Show completion screen */}
        {showCompletion && activeQuest && (
          <QuestComplete
            quest={activeQuest}
            elapsedTime={elapsedTime}
            earnedXP={earnedXP}
            newLevel={playerStats.level > 1 ? playerStats.level : undefined}
            onNewQuest={handleNewQuest}
            onBackToMenu={handleBackToMenu}
          />
        )}

        {/* Show active quest */}
        {!showCompletion && activeQuest && (isActive || isPaused) && (
          <div className="max-w-2xl mx-auto">
            <QuestPanel
              quest={activeQuest}
              elapsedTime={elapsedTime}
              isPaused={isPaused}
              onToggleTask={handleToggleTask}
              onPause={pauseQuest}
              onResume={resumeQuest}
              onComplete={handleCompleteQuest}
              onAbandon={handleAbandonQuest}
            />
          </div>
        )}

        {/* Show challenges/stats when no active quest */}
        {!showCompletion && !activeQuest && (
          <>
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)} className="mb-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="challenges" className="gap-2">
                  <Sword className="w-4 h-4" />
                  Défis
                </TabsTrigger>
                <TabsTrigger value="stats" className="gap-2">
                  <BarChart2 className="w-4 h-4" />
                  Stats
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2">
                  <Clock className="w-4 h-4" />
                  Historique
                </TabsTrigger>
              </TabsList>

              <TabsContent value="challenges" className="mt-6">
                {/* Generate quest button */}
                <div className="flex justify-center mb-8">
                  <Button
                    onClick={handleGenerateQuest}
                    disabled={isLoading}
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-primary to-info"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sword className="w-4 h-4" />
                    )}
                    {isLoading ? 'Génération...' : 'Générer une quête IA'}
                  </Button>
                </div>

                {/* Challenges grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {challenges.map((challenge, index) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      onStart={handleStartChallenge}
                      index={index}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="stats" className="mt-6">
                <div className="max-w-3xl mx-auto">
                  <PlayerStats stats={playerStats} />
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <div className="max-w-3xl mx-auto space-y-4">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Historique des quêtes
                  </h3>
                  {questHistory && questHistory.length > 0 ? (
                    <div className="space-y-3">
                      {questHistory.slice(0, 10).map((quest, index) => (
                        <motion.div
                          key={quest.id || index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-4 rounded-xl border ${
                            quest.success 
                              ? 'bg-success/10 border-success/30' 
                              : 'bg-destructive/10 border-destructive/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-foreground">
                                {quest.quest_title || 'Quête'}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {quest.quest_description?.slice(0, 60)}...
                              </p>
                            </div>
                            <div className="text-right">
                              <div className={`font-bold ${quest.success ? 'text-success' : 'text-destructive'}`}>
                                {quest.success ? `+${quest.xp_earned} XP` : 'Abandonné'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {quest.completed_at 
                                  ? new Date(quest.completed_at).toLocaleDateString('fr-FR')
                                  : 'Date inconnue'
                                }
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>⏱️ {Math.floor((quest.elapsed_seconds || 0) / 60)}min</span>
                            <span>✅ {quest.tasks_completed}/{quest.total_tasks} tâches</span>
                            <span className="capitalize">📊 {quest.difficulty}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Aucune quête terminée pour le moment</p>
                      <p className="text-sm">Commencez une quête pour voir votre historique ici</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default B2CBossLevelGritPage;
