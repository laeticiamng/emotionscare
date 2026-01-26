/**
 * Page principale du module Ambition
 * Gestion unifiée des objectifs (Standard + Mode Arcade)
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { logger } from '@/lib/logger';
import {
  Target,
  Trophy,
  Zap,
  Plus,
  Check,
  Loader2,
  TrendingUp,
  Star,
  Calendar,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  createRun,
  fetchActiveRuns,
  getStats,
  createQuest,
  completeQuest,
  fetchQuests,
  generateGameStructure,
} from '../ambitionService';
import type {
  AmbitionRun,
  AmbitionQuest,
  AmbitionStats,
  AmbitionMode,
} from '../types';

export const AmbitionPage: React.FC = () => {
  const { toast } = useToast();
  const [mode, setMode] = useState<AmbitionMode>('standard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<AmbitionStats | null>(null);
  const [activeRuns, setActiveRuns] = useState<AmbitionRun[]>([]);
  const [selectedRun, setSelectedRun] = useState<AmbitionRun | null>(null);
  const [quests, setQuests] = useState<AmbitionQuest[]>([]);

  // Form states
  const [newObjective, setNewObjective] = useState('');
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestDetails, setNewQuestDetails] = useState('');

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  // Load quests when run selected
  useEffect(() => {
    if (selectedRun) {
      loadQuests(selectedRun.id);
    }
  }, [selectedRun]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, runsData] = await Promise.all([
        getStats(),
        fetchActiveRuns(),
      ]);

      setStats(statsData);
      setActiveRuns(runsData);

      // Auto-select first active run
      if (runsData.length > 0 && !selectedRun) {
        setSelectedRun(runsData[0]);
      }
    } catch (error) {
      logger.error('Error loading data:', error, 'COMPONENT');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadQuests = async (runId: string) => {
    try {
      const questsData = await fetchQuests(runId);
      setQuests(questsData);
    } catch (error) {
      logger.error('Error loading quests:', error, 'COMPONENT');
    }
  };

  const handleCreateRun = async () => {
    if (!newObjective.trim()) return;

    try {
      setLoading(true);
      const run = await createRun({
        objective: newObjective.trim(),
        tags: mode === 'arcade' ? ['arcade'] : [],
      });

      toast({
        title: 'Run créé !',
        description: `Objectif : ${run.objective}`,
      });

      setNewObjective('');
      await loadData();
      setSelectedRun(run);
    } catch (error) {
      logger.error('Error creating run:', error, 'COMPONENT');
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le run',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateGameAI = async () => {
    if (!newObjective.trim()) return;

    try {
      setLoading(true);
      toast({
        title: 'Génération IA en cours...',
        description: 'L\'IA crée votre structure de jeu',
      });

      const gameStructure = await generateGameStructure({
        goal: newObjective.trim(),
        timeframe: '30',
        difficulty: 'medium',
      });

      // Create run
      const run = await createRun({
        objective: newObjective.trim(),
        tags: ['arcade', 'ai-generated'],
        metadata: { gameStructure },
      });

      // Create quests from generated structure
      const questPromises = gameStructure.levels.flatMap((level) =>
        level.tasks.map((task) =>
          createQuest({
            run_id: run.id,
            title: task,
            flavor: level.description,
            est_minutes: 15,
            xp_reward: level.points,
          })
        )
      );

      await Promise.all(questPromises);

      toast({
        title: 'Jeu généré !',
        description: `${gameStructure.levels.length} niveaux créés par IA`,
      });

      setNewObjective('');
      await loadData();
      setSelectedRun(run);
    } catch (error) {
      logger.error('Error generating game:', error, 'COMPONENT');
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le jeu',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuest = async () => {
    if (!selectedRun || !newQuestTitle.trim()) return;

    try {
      await createQuest({
        run_id: selectedRun.id,
        title: newQuestTitle.trim(),
        flavor: newQuestDetails.trim() || undefined,
        est_minutes: 15,
        xp_reward: 25,
      });

      toast({
        title: 'Quête ajoutée !',
        description: newQuestTitle.trim(),
      });

      setNewQuestTitle('');
      setNewQuestDetails('');
      await loadQuests(selectedRun.id);
    } catch (error) {
      logger.error('Error creating quest:', error, 'COMPONENT');
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la quête',
        variant: 'destructive',
      });
    }
  };

  const handleCompleteQuest = async (questId: string) => {
    try {
      await completeQuest(questId, 'success');

      toast({
        title: 'Quête complétée !',
        description: '+25 XP',
      });

      if (selectedRun) {
        await loadQuests(selectedRun.id);
      }
      await loadData(); // Refresh stats
    } catch (error) {
      logger.error('Error completing quest:', error, 'COMPONENT');
      toast({
        title: 'Erreur',
        description: 'Impossible de compléter la quête',
        variant: 'destructive',
      });
    }
  };

  const completedQuests = quests.filter((q) => q.status === 'completed').length;
  const totalQuests = quests.length;
  const completionPercentage = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;
  const currentXP = quests
    .filter((q) => q.status === 'completed')
    .reduce((sum, q) => sum + q.xp_reward, 0);

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            Ambition
          </h1>
          <p className="text-muted-foreground mt-1">
            Définissez et accomplissez vos objectifs
          </p>
        </div>

        <div className="flex gap-4">
          <Card className="flex items-center gap-3 p-4">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">{stats?.totalXP || 0}</p>
              <p className="text-xs text-muted-foreground">XP Total</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 p-4">
            <TrendingUp className="h-6 w-6 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{stats?.completedRuns || 0}</p>
              <p className="text-xs text-muted-foreground">Runs Complétés</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Mode Tabs */}
      <Tabs value={mode} onValueChange={(v) => setMode(v as AmbitionMode)}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="standard" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Standard
          </TabsTrigger>
          <TabsTrigger value="arcade" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Arcade (IA)
          </TabsTrigger>
        </TabsList>

        {/* Standard Mode */}
        <TabsContent value="standard" className="space-y-6">
          {/* Create New Run */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Nouvel Objectif
              </CardTitle>
              <CardDescription>
                Définissez un objectif personnel à accomplir
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Ex: Apprendre React en 30 jours"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                disabled={loading}
              />
              <Button
                onClick={handleCreateRun}
                disabled={loading || !newObjective.trim()}
                className="w-full"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer l'objectif
              </Button>
            </CardContent>
          </Card>

          {renderRunsAndQuests()}
        </TabsContent>

        {/* Arcade Mode */}
        <TabsContent value="arcade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Génération IA - Mode Arcade
              </CardTitle>
              <CardDescription>
                L'IA crée un jeu complet avec niveaux et défis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Ex: Maîtriser le piano en 90 jours"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                disabled={loading}
              />
              <Button
                onClick={handleGenerateGameAI}
                disabled={loading || !newObjective.trim()}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Zap className="mr-2 h-4 w-4" />
                Générer le jeu (IA)
              </Button>
            </CardContent>
          </Card>

          {renderRunsAndQuests()}
        </TabsContent>
      </Tabs>
    </div>
  );

  // Render runs and quests section (shared between modes)
  function renderRunsAndQuests() {
    if (activeRuns.length === 0) {
      return (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun objectif actif. Créez-en un !</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Runs List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Objectifs Actifs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {activeRuns.map((run) => (
              <Button
                key={run.id}
                variant={selectedRun?.id === run.id ? 'default' : 'outline'}
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => setSelectedRun(run)}
              >
                <div className="flex-1 truncate">
                  <p className="font-medium truncate">{run.objective}</p>
                  <p className="text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {new Date(run.created_at).toLocaleDateString()}
                  </p>
                </div>
                {run.tags?.includes('arcade') && (
                  <Zap className="h-4 w-4 text-yellow-500 ml-2" />
                )}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Quests Detail */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {selectedRun?.objective}
                  {selectedRun?.tags?.includes('arcade') && (
                    <Badge variant="secondary" className="gap-1">
                      <Zap className="h-3 w-3" />
                      Arcade
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="mt-2 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    {currentXP} XP
                  </span>
                  <span>
                    {completedQuests} / {totalQuests} quêtes
                  </span>
                </CardDescription>
              </div>
            </div>
            <Progress value={completionPercentage} className="mt-4" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add Quest Form */}
            <div className="space-y-2 p-4 border rounded-lg bg-muted/50">
              <Input
                placeholder="Titre de la quête"
                value={newQuestTitle}
                onChange={(e) => setNewQuestTitle(e.target.value)}
              />
              <Textarea
                placeholder="Description (optionnel)"
                value={newQuestDetails}
                onChange={(e) => setNewQuestDetails(e.target.value)}
                rows={2}
              />
              <Button
                onClick={handleCreateQuest}
                disabled={!newQuestTitle.trim()}
                size="sm"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une quête
              </Button>
            </div>

            {/* Quests List */}
            <div className="space-y-2">
              {quests.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucune quête. Ajoutez-en une !
                </p>
              ) : (
                quests.map((quest) => (
                  <div
                    key={quest.id}
                    className={`flex items-start gap-3 p-3 border rounded-lg ${
                      quest.status === 'completed'
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                        : 'bg-background'
                    }`}
                  >
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          quest.status === 'completed' ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {quest.title}
                      </p>
                      {quest.flavor && (
                        <p className="text-sm text-muted-foreground mt-1">{quest.flavor}</p>
                      )}
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span>⏱️ {quest.est_minutes} min</span>
                        <span>⭐ {quest.xp_reward} XP</span>
                      </div>
                    </div>
                    {quest.status !== 'completed' && (
                      <Button
                        size="sm"
                        onClick={() => handleCompleteQuest(quest.id)}
                        className="shrink-0"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {quest.status === 'completed' && (
                      <Badge variant="secondary" className="shrink-0">
                        <Check className="h-3 w-3 mr-1" />
                        Complété
                      </Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default AmbitionPage;
