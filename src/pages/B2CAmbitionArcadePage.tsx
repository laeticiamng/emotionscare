/**
 * Page Ambition Arcade - Gamification d'objectifs
 */
import React, { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Gamepad2, Target, TrendingUp, Trophy, Plus, Lightbulb, Flame } from 'lucide-react';
import { useAmbitionGoals, useAmbitionStats, useAmbitionNotifications } from '@/modules/ambition-arcade/hooks';
import { GoalCard } from '@/modules/ambition-arcade/components/GoalCard';
import { GoalCreator } from '@/modules/ambition-arcade/components/GoalCreator';
import { GoalFilters, type GoalStatusFilter, type GoalSortOption } from '@/modules/ambition-arcade/components/GoalFilters';
import { StatsPanel } from '@/modules/ambition-arcade/components/StatsPanel';
import { AchievementsTab } from '@/modules/ambition-arcade/components/AchievementsTab';
import { RecommendationsPanel } from '@/modules/ambition-arcade/components/RecommendationsPanel';
import { ExportButton } from '@/modules/ambition-arcade/components/ExportButton';
import { ProgressChart } from '@/modules/ambition-arcade/components/ProgressChart';
import { DailyStreak } from '@/modules/ambition-arcade/components/DailyStreak';
import { GlobalArtifactGallery } from '@/modules/ambition-arcade/components/GlobalArtifactGallery';

const B2CAmbitionArcadePage: React.FC = () => {
  const [showCreator, setShowCreator] = useState(false);
  const [statusFilter, setStatusFilter] = useState<GoalStatusFilter>('all');
  const [sortBy, setSortBy] = useState<GoalSortOption>('newest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: goals, isLoading: goalsLoading } = useAmbitionGoals();
  const { data: stats } = useAmbitionStats();
  
  // Enable realtime notifications
  useAmbitionNotifications();

  // Extract all unique tags
  const availableTags = useMemo(() => {
    const allTags = goals?.flatMap(g => g.tags) || [];
    return [...new Set(allTags)].sort();
  }, [goals]);

  // Handle tag toggle - memoized for GoalCard
  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  }, []);

  // Filter and sort goals
  const filteredGoals = useMemo(() => {
    if (!goals) return [];

    let result = [...goals];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(g => g.status === statusFilter);
    }

    // Tag filter
    if (selectedTags.length > 0) {
      result = result.filter(g => 
        selectedTags.some(tag => g.tags.includes(tag))
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(g => 
        g.objective.toLowerCase().includes(query) ||
        g.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (sortBy) {
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'xp':
        result.sort((a, b) => b.xpEarned - a.xpEarned);
        break;
      case 'progress':
        result.sort((a, b) => {
          const progressA = a.questsTotal > 0 ? a.questsCompleted / a.questsTotal : 0;
          const progressB = b.questsTotal > 0 ? b.questsCompleted / b.questsTotal : 0;
          return progressB - progressA;
        });
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [goals, statusFilter, selectedTags, searchQuery, sortBy]);

  // Group by status for display
  const activeGoals = filteredGoals.filter(g => g.status === 'active');
  const completedGoals = filteredGoals.filter(g => g.status === 'completed');
  const abandonedGoals = filteredGoals.filter(g => g.status === 'abandoned');

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

            {/* Filters */}
            {goals && goals.length > 0 && (
              <GoalFilters
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
                availableTags={availableTags}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}

            {/* Loading */}
            {goalsLoading && (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-40" />)}
              </div>
            )}

            {/* Goals grouped by status (only when filter is "all") */}
            {statusFilter === 'all' ? (
              <>
                {/* Active Goals */}
                {activeGoals.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase">Actifs ({activeGoals.length})</h3>
                    {activeGoals.map(goal => (
                      <GoalCard key={goal.id} goal={goal} onTagClick={handleTagToggle} />
                    ))}
                  </div>
                )}

                {/* Completed Goals */}
                {completedGoals.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase">Complétés ({completedGoals.length})</h3>
                    {completedGoals.map(goal => (
                      <GoalCard key={goal.id} goal={goal} onTagClick={handleTagToggle} />
                    ))}
                  </div>
                )}

                {/* Abandoned Goals */}
                {abandonedGoals.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase">Abandonnés ({abandonedGoals.length})</h3>
                    {abandonedGoals.map(goal => (
                      <GoalCard key={goal.id} goal={goal} onTagClick={handleTagToggle} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Flat list when filtered */
              <div className="space-y-4">
                {filteredGoals.map(goal => (
                  <GoalCard key={goal.id} goal={goal} onTagClick={handleTagToggle} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!goalsLoading && filteredGoals.length === 0 && (
              <div className="text-center py-12">
                <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">
                  {goals?.length === 0 ? 'Aucun objectif' : 'Aucun résultat'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {goals?.length === 0 
                    ? 'Créez votre premier objectif' 
                    : 'Modifiez vos filtres pour voir plus de résultats'}
                </p>
                {goals?.length === 0 && (
                  <Button onClick={() => setShowCreator(true)}>Commencer</Button>
                )}
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
            <GlobalArtifactGallery />
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
