/**
 * Widget de progression des objectifs personnels avec création inline
 */
import React, { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Target, CheckCircle2, Circle, Plus, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Goal {
  id: string;
  title: string;
  target_value: number;
  current_progress: number;
  completed: boolean;
  end_date: string | null;
}

async function fetchUserGoals(userId: string): Promise<Goal[]> {
  const { data, error } = await supabase
    .from('user_goals')
    .select('id, title, target_value, current_progress, completed, end_date')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching goals:', error);
    return [];
  }

  return (data || []).map(goal => ({
    id: goal.id,
    title: goal.title || 'Objectif sans titre',
    target_value: goal.target_value || 100,
    current_progress: goal.current_progress || 0,
    completed: goal.completed || false,
    end_date: goal.end_date
  }));
}

async function createUserGoal(userId: string, title: string, targetValue: number): Promise<boolean> {
  const { error } = await supabase
    .from('user_goals')
    .insert({
      user_id: userId,
      title,
      target_value: targetValue,
      current_progress: 0,
      completed: false
    });

  if (error) {
    console.error('Error creating goal:', error);
    return false;
  }
  return true;
}

export default function GoalsProgressWidget() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState(100);

  const { data: goals, isLoading } = useQuery({
    queryKey: ['user-goals-widget', user?.id],
    queryFn: () => fetchUserGoals(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  const handleCreateGoal = useCallback(async () => {
    if (!user?.id || !newGoalTitle.trim()) return;

    setIsCreating(true);
    try {
      const success = await createUserGoal(user.id, newGoalTitle.trim(), newGoalTarget);
      if (success) {
        toast.success('Objectif créé avec succès !');
        setNewGoalTitle('');
        setNewGoalTarget(100);
        setIsDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ['user-goals-widget', user.id] });
      } else {
        toast.error('Erreur lors de la création de l\'objectif');
      }
    } finally {
      setIsCreating(false);
    }
  }, [user?.id, newGoalTitle, newGoalTarget, queryClient]);

  const activeGoals = goals?.filter(g => !g.completed) || [];
  const completedCount = goals?.filter(g => g.completed).length || 0;
  const totalProgress = activeGoals.length > 0
    ? activeGoals.reduce((sum, g) => sum + Math.min(100, (g.current_progress / g.target_value) * 100), 0) / activeGoals.length
    : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" aria-hidden="true" />
              Mes objectifs
            </CardTitle>
            <CardDescription>Progression de vos objectifs personnels</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {goals && goals.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {completedCount} complété{completedCount > 1 ? 's' : ''}
              </Badge>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Ajouter un objectif">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Nouvel objectif</DialogTitle>
                  <DialogDescription>
                    Définissez un nouvel objectif personnel à atteindre.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="goal-title">Titre de l'objectif</Label>
                    <Input
                      id="goal-title"
                      placeholder="Ex: Méditer 10 minutes par jour"
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      maxLength={100}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="goal-target">Valeur cible</Label>
                    <Input
                      id="goal-target"
                      type="number"
                      min={1}
                      max={1000}
                      value={newGoalTarget}
                      onChange={(e) => setNewGoalTarget(Number(e.target.value) || 100)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Nombre de fois à atteindre (ex: 10 sessions, 30 jours, etc.)
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleCreateGoal} 
                    disabled={isCreating || !newGoalTitle.trim()}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Création...
                      </>
                    ) : (
                      'Créer l\'objectif'
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : !goals || goals.length === 0 ? (
          <div className="text-center py-4">
            <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-muted-foreground mb-3">
              Aucun objectif défini pour le moment
            </p>
            <Button size="sm" variant="outline" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-3 w-3 mr-1" />
              Définir mon premier objectif
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Barre de progression globale */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progression globale</span>
                <span>{Math.round(totalProgress)}%</span>
              </div>
              <Progress 
                value={totalProgress} 
                className="h-2"
                aria-label="Progression globale des objectifs"
              />
            </div>

            {/* Liste des objectifs actifs */}
            <div className="space-y-2">
              {activeGoals.slice(0, 3).map((goal) => {
                const progress = Math.min(100, (goal.current_progress / goal.target_value) * 100);
                return (
                  <div 
                    key={goal.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className={cn(
                      'h-8 w-8 rounded-full flex items-center justify-center shrink-0',
                      progress >= 100 ? 'bg-success/10' : 'bg-primary/10'
                    )}>
                      {progress >= 100 ? (
                        <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />
                      ) : (
                        <Circle className="h-4 w-4 text-primary" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{goal.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={progress} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground shrink-0">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lien vers tous les objectifs */}
            <div className="flex justify-end">
              <Button asChild variant="ghost" size="sm">
                <Link to="/app/gamification" className="inline-flex items-center gap-1 text-xs">
                  Voir tous les objectifs
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
