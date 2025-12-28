/**
 * Page Ambition Arcade - Gamification d'objectifs
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Gamepad2, Target, TrendingUp, Trophy, Plus, Lightbulb, Flame } from 'lucide-react';
import { useAmbitionGoals, useAmbitionStats } from '@/modules/ambition-arcade/hooks';
import { GoalCard } from '@/modules/ambition-arcade/components/GoalCard';
import { GoalCreator } from '@/modules/ambition-arcade/components/GoalCreator';
import { StatsPanel } from '@/modules/ambition-arcade/components/StatsPanel';
import { AchievementsTab } from '@/modules/ambition-arcade/components/AchievementsTab';
import { RecommendationsPanel } from '@/modules/ambition-arcade/components/RecommendationsPanel';
import { ExportButton } from '@/modules/ambition-arcade/components/ExportButton';
import { ProgressChart } from '@/modules/ambition-arcade/components/ProgressChart';
import { DailyStreak } from '@/modules/ambition-arcade/components/DailyStreak';

const B2CAmbitionArcadePage: React.FC = () => {
  const [showCreator, setShowCreator] = useState(false);
  const { data: goals, isLoading: goalsLoading } = useAmbitionGoals();
  const { data: stats } = useAmbitionStats();

  const activeGoals = goals?.filter(g => g.status === 'active') || [];
  const completedGoals = goals?.filter(g => g.status === 'completed') || [];
  const abandonedGoals = goals?.filter(g => g.status === 'abandoned') || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-muted/20 p-4 md:p-6" data-testid="page-root">
      {/* Back Button & Export */}
      <div className="max-w-6xl mx-auto mb-4 flex items-center justify-between">
        <Link to="/app/home">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour au menu
          </Button>
        </Link>
        <ExportButton />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full mb-6">
            <Gamepad2 className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Ambition Arcade</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
            Transformez vos ambitions en aventures ludiques
          </p>
          
          {/* Quick Stats */}
          {stats && (
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-warning" />
                <span>Niveau {stats.level}</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-primary" />
                <span>{stats.totalXP} XP</span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>{stats.currentStreak} jours</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="goals" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="goals" className="gap-2">
              <Target className="w-4 h-4" />
              Objectifs
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="gap-2">
              <Lightbulb className="w-4 h-4" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="progress" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Progression
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-2">
              <Trophy className="w-4 h-4" />
              Succès
            </TabsTrigger>
          </TabsList>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            {/* Create Button */}
            {!showCreator && (
              <Button onClick={() => setShowCreator(true)} className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Nouvel objectif
              </Button>
            )}

            {/* Creator */}
            {showCreator && (
              <GoalCreator onSuccess={() => setShowCreator(false)} onCancel={() => setShowCreator(false)} />
            )}

            {/* Loading */}
            {goalsLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)}
              </div>
            )}

            {/* Active Goals */}
            {activeGoals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase">Actifs</h3>
                {activeGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
              </div>
            )}

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase">Complétés ({completedGoals.length})</h3>
                {completedGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
              </div>
            )}

            {/* Abandoned Goals */}
            {abandonedGoals.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase">Abandonnés ({abandonedGoals.length})</h3>
                {abandonedGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
              </div>
            )}

            {/* Empty State */}
            {!goalsLoading && goals?.length === 0 && !showCreator && (
              <div className="text-center py-12">
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Aucun objectif</h3>
                <p className="text-muted-foreground mb-4">Créez votre premier objectif</p>
                <Button onClick={() => setShowCreator(true)}>Commencer</Button>
              </div>
            )}
          </TabsContent>

          {/* Suggestions Tab */}
          <TabsContent value="suggestions">
            <RecommendationsPanel />
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <DailyStreak />
            <ProgressChart />
            <StatsPanel />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <AchievementsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default B2CAmbitionArcadePage;
