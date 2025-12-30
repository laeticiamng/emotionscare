/**
 * B2C Boss Level Grit Page - Module de résilience gamifié
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown, BarChart2, Sword, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGritQuest } from '@/hooks/useGritQuest';
import {
  ChallengeCard,
  QuestPanel,
  PlayerStats,
  QuestComplete,
  type Challenge,
  type Quest
} from '@/components/boss-grit';

type ViewMode = 'challenges' | 'stats';

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
    resetQuest
  } = useGritQuest();

  // Player stats from localStorage
  const [playerStats, setPlayerStats] = useState({
    level: 1,
    currentXP: 0,
    maxXP: 100,
    totalQuests: 0,
    completedQuests: 0,
    streak: 0,
    bestStreak: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem('boss-grit-stats');
    if (saved) {
      try {
        setPlayerStats(JSON.parse(saved));
      } catch {
        // Ignore
      }
    }
  }, []);

  const saveStats = (stats: typeof playerStats) => {
    localStorage.setItem('boss-grit-stats', JSON.stringify(stats));
    setPlayerStats(stats);
  };

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
    }
  }, [quest]);

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

    const xp = activeQuest.tasks
      .filter(t => t.completed)
      .reduce((sum, t) => sum + t.xp, 0);
    
    setEarnedXP(xp);

    // Update stats
    let newStats = {
      ...playerStats,
      currentXP: playerStats.currentXP + xp,
      completedQuests: playerStats.completedQuests + 1,
      totalQuests: playerStats.totalQuests + 1,
      streak: playerStats.streak + 1,
      bestStreak: Math.max(playerStats.bestStreak, playerStats.streak + 1)
    };

    // Level up check
    while (newStats.currentXP >= newStats.maxXP) {
      newStats = {
        ...newStats,
        level: newStats.level + 1,
        currentXP: newStats.currentXP - newStats.maxXP,
        maxXP: Math.floor(newStats.maxXP * 1.5)
      };
    }

    saveStats(newStats);
    await completeQuest(true);
    setShowCompletion(true);
  };

  const handleAbandonQuest = () => {
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
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="challenges" className="gap-2">
                  <Sword className="w-4 h-4" />
                  Défis
                </TabsTrigger>
                <TabsTrigger value="stats" className="gap-2">
                  <BarChart2 className="w-4 h-4" />
                  Statistiques
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
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
};

export default B2CBossLevelGritPage;
