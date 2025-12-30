/**
 * GoalsPanel - Objectifs personnalisés avec progression
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Check, Clock, Trash2, Trophy, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface ScoreGoal {
  id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  deadline: string | null;
  status: 'active' | 'completed' | 'failed' | 'paused';
  created_at: string;
}

const GOAL_TYPES = [
  { value: 'emotional', label: 'Score Émotionnel', icon: '💚', color: 'text-emerald-500' },
  { value: 'wellbeing', label: 'Bien-être', icon: '🧘', color: 'text-teal-500' },
  { value: 'engagement', label: 'Engagement', icon: '⚡', color: 'text-violet-500' },
  { value: 'overall', label: 'Score Global', icon: '🎯', color: 'text-blue-500' },
  { value: 'streak', label: 'Streak (jours)', icon: '🔥', color: 'text-orange-500' },
  { value: 'sessions', label: 'Sessions', icon: '📊', color: 'text-pink-500' },
];

export default function GoalsPanel() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({ goal_type: 'emotional', target_value: 80, deadline: '' });

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['score-goals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('score_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as ScoreGoal[];
    },
    enabled: !!user?.id
  });

  const createGoalMutation = useMutation({
    mutationFn: async (goal: typeof newGoal) => {
      if (!user?.id) throw new Error('Non authentifié');
      const { error } = await supabase.from('score_goals').insert({
        user_id: user.id,
        goal_type: goal.goal_type,
        target_value: goal.target_value,
        deadline: goal.deadline || null
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['score-goals'] });
      setIsDialogOpen(false);
      setNewGoal({ goal_type: 'emotional', target_value: 80, deadline: '' });
      toast({ title: 'Objectif créé !', description: 'Votre nouvel objectif a été ajouté.' });
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const { error } = await supabase.from('score_goals').delete().eq('id', goalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['score-goals'] });
      toast({ title: 'Objectif supprimé' });
    }
  });

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  const getGoalConfig = (type: string) => GOAL_TYPES.find(t => t.value === type) || GOAL_TYPES[0];

  if (isLoading) {
    return <div className="animate-pulse h-40 bg-muted rounded-lg" />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Mes Objectifs
          </CardTitle>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" /> Nouvel objectif
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un objectif</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Type d'objectif</Label>
                <Select value={newGoal.goal_type} onValueChange={v => setNewGoal(p => ({ ...p, goal_type: v }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GOAL_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.icon} {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Valeur cible</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={newGoal.target_value}
                  onChange={e => setNewGoal(p => ({ ...p, target_value: parseInt(e.target.value) || 80 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Date limite (optionnel)</Label>
                <Input
                  type="date"
                  value={newGoal.deadline}
                  onChange={e => setNewGoal(p => ({ ...p, deadline: e.target.value }))}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={() => createGoalMutation.mutate(newGoal)}
                disabled={createGoalMutation.isPending}
              >
                {createGoalMutation.isPending ? 'Création...' : 'Créer l\'objectif'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeGoals.length === 0 && completedGoals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun objectif défini</p>
            <p className="text-sm">Créez votre premier objectif pour suivre votre progression</p>
          </div>
        ) : (
          <>
            {/* Active Goals */}
            <AnimatePresence>
              {activeGoals.map((goal, idx) => {
                const config = getGoalConfig(goal.goal_type);
                const progress = Math.min(100, (goal.current_value / goal.target_value) * 100);
                const isNearComplete = progress >= 80;

                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: idx * 0.1 }}
                    className={cn(
                      "p-4 rounded-lg border",
                      isNearComplete && "border-primary/50 bg-primary/5"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <p className="font-medium">{config.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {goal.current_value} / {goal.target_value}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {goal.deadline && (
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(goal.deadline).toLocaleDateString()}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => deleteGoalMutation.mutate(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2 text-right">
                      {Math.round(progress)}% complété
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-500" />
                  Objectifs atteints ({completedGoals.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {completedGoals.slice(0, 5).map(goal => {
                    const config = getGoalConfig(goal.goal_type);
                    return (
                      <Badge key={goal.id} variant="secondary" className="gap-1">
                        <span>{config.icon}</span>
                        {config.label}: {goal.target_value}
                        <Check className="h-3 w-3 text-emerald-500" />
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
