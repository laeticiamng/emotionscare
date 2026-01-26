/**
 * Improvement Market - Track and trade personal progress
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Plus, 
  Brain,
  Moon,
  Dumbbell,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useImprovementGoals, useCreateGoal, useUpdateGoalProgress, useAbandonGoal, useDeleteGoal } from '../hooks/useExchangeData';
import type { GoalType } from '../types';
import { toast } from 'sonner';

const goalIcons = {
  sleep: Moon,
  stress: Brain,
  productivity: Target,
  study: BookOpen,
  fitness: Dumbbell,
  meditation: Sparkles,
} as const;

const goalColors: Record<GoalType, string> = {
  sleep: 'from-indigo-500 to-purple-600',
  stress: 'from-rose-500 to-pink-600',
  productivity: 'from-emerald-500 to-teal-600',
  study: 'from-blue-500 to-cyan-600',
  fitness: 'from-orange-500 to-amber-600',
  meditation: 'from-violet-500 to-purple-600',
};

const ImprovementMarket: React.FC = () => {
  const { data: goals, isLoading } = useImprovementGoals();
  const createGoal = useCreateGoal();
  const updateProgress = useUpdateGoalProgress();
  const abandonGoal = useAbandonGoal();
  const deleteGoal = useDeleteGoal();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    goal_type: '' as GoalType,
    title: '',
    description: '',
    target_value: 100,
  });

  const handleCreateGoal = async () => {
    if (!newGoal.goal_type || !newGoal.title) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    try {
      await createGoal.mutateAsync(newGoal);
      toast.success('Objectif créé avec succès !');
      setIsDialogOpen(false);
      setNewGoal({ goal_type: '' as GoalType, title: '', description: '', target_value: 100 });
    } catch (error) {
      toast.error('Erreur lors de la création de l\'objectif');
    }
  };

  const handleUpdateProgress = async (goalId: string, change: number) => {
    try {
      await updateProgress.mutateAsync({ goalId, valueChange: change });
      toast.success('Progression mise à jour !');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleAbandon = async (goalId: string) => {
    try {
      await abandonGoal.mutateAsync({ goalId, abandon: true });
      toast.info('Objectif abandonné');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const handleDelete = async (goalId: string) => {
    try {
      await deleteGoal.mutateAsync(goalId);
      toast.success('Objectif supprimé définitivement');
      setDeleteConfirm(null);
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Market overview stats
  const goalsArray = goals || [];
  const marketStats = {
    avgScore: goalsArray.length > 0 ? goalsArray.reduce((acc, g) => acc + g.improvement_score, 0) / goalsArray.length : 0,
    activeGoals: goalsArray.filter(g => g.status === 'active').length,
    completedGoals: goalsArray.filter(g => g.status === 'completed').length,
  };

  return (
    <div className="space-y-8">
      {/* Market Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" aria-hidden="true" />
            Improvement Market
          </h2>
          <p className="text-muted-foreground">
            Trackez et valorisez votre progression personnelle
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-600">
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Nouvel Objectif
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouvel objectif</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="goal-type">Type d'objectif</Label>
                <Select
                  value={newGoal.goal_type}
                  onValueChange={(v) => setNewGoal(prev => ({ ...prev, goal_type: v as GoalType }))}
                >
                  <SelectTrigger id="goal-type">
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sleep">🌙 Sommeil</SelectItem>
                    <SelectItem value="stress">🧠 Gestion du stress</SelectItem>
                    <SelectItem value="productivity">🎯 Productivité</SelectItem>
                    <SelectItem value="study">📚 Études</SelectItem>
                    <SelectItem value="fitness">💪 Fitness</SelectItem>
                    <SelectItem value="meditation">✨ Méditation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="goal-title">Titre</Label>
                <Input
                  id="goal-title"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Améliorer mon sommeil"
                />
              </div>
              <div>
                <Label htmlFor="goal-description">Description (optionnel)</Label>
                <Textarea
                  id="goal-description"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrivez votre objectif..."
                />
              </div>
              <div>
                <Label htmlFor="goal-target">Valeur cible</Label>
                <Input
                  id="goal-target"
                  type="number"
                  value={newGoal.target_value}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, target_value: parseInt(e.target.value) }))}
                />
              </div>
              <Button 
                onClick={handleCreateGoal} 
                className="w-full"
                disabled={createGoal.isPending}
              >
                {createGoal.isPending ? 'Création...' : 'Créer l\'objectif'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Score moyen</p>
                <p className="text-3xl font-bold">{marketStats.avgScore.toFixed(1)}%</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-500/20">
                <TrendingUp className="w-6 h-6 text-emerald-500" aria-hidden="true" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Objectifs actifs</p>
                <p className="text-3xl font-bold">{marketStats.activeGoals}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <Target className="w-6 h-6 text-blue-500" aria-hidden="true" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Complétés</p>
                <p className="text-3xl font-bold">{marketStats.completedGoals}</p>
              </div>
              <div className="p-3 rounded-full bg-amber-500/20">
                <Sparkles className="w-6 h-6 text-amber-500" aria-hidden="true" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Vos Objectifs</h3>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="h-48" />
              </Card>
            ))}
          </div>
        ) : goals && goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal, index) => {
              const Icon = goalIcons[goal.goal_type as GoalType] || Target;
              const color = goalColors[goal.goal_type as GoalType] || 'from-gray-500 to-gray-600';
              const progress = (goal.current_value / goal.target_value) * 100;
              const trend = goal.improvement_score >= 50 ? 'up' : 'down';
              
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className={`h-1 bg-gradient-to-r ${color}`} />
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${color} text-white`}>
                            <Icon className="w-5 h-5" aria-hidden="true" />
                          </div>
                          <div>
                            <CardTitle className="text-base">{goal.title}</CardTitle>
                            <p className="text-xs text-muted-foreground capitalize">
                              {goal.goal_type}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={goal.status === 'active' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {goal.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {goal.description && (
                        <p className="text-sm text-muted-foreground">
                          {goal.description}
                        </p>
                      )}
                      
                      {/* Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progression</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <Progress 
                          value={progress} 
                          className="h-2" 
                          aria-label={`Progression: ${Math.round(progress)}%`}
                        />
                      </div>

                      {/* Market Value */}
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Valeur marché</span>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-lg">{goal.improvement_score}</span>
                          {trend === 'up' ? (
                            <ArrowUpRight className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4 text-rose-500" aria-hidden="true" />
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      {goal.status === 'active' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleUpdateProgress(goal.id, 5)}
                            disabled={updateProgress.isPending}
                          >
                            +5
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleUpdateProgress(goal.id, 10)}
                            disabled={updateProgress.isPending}
                          >
                            +10
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600"
                            onClick={() => handleUpdateProgress(goal.id, 25)}
                            disabled={updateProgress.isPending}
                          >
                            +25
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleAbandon(goal.id)}>
                                <XCircle className="w-4 h-4 mr-2" />
                                Abandonner
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => setDeleteConfirm(goal.id)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                      
                      {goal.status === 'abandoned' && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full"
                          onClick={() => setDeleteConfirm(goal.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer définitivement
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" aria-hidden="true" />
            <h3 className="font-semibold mb-2">Aucun objectif</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Commencez par créer votre premier objectif de progression
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Créer un objectif
            </Button>
          </Card>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet objectif ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L'objectif et tout son historique seront supprimés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ImprovementMarket;
