import { memo, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Check, Edit2, Trash2, Plus } from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { logger } from '@/lib/logger';

interface JournalWritingGoalsProps {
  notes: SanitizedNote[];
  className?: string;
}

interface Goal {
  id: string;
  type: 'weekly' | 'monthly';
  target: number;
  unit: 'notes' | 'words';
  label: string;
}

const DEFAULT_GOALS: Goal[] = [
  { id: '1', type: 'weekly', target: 7, unit: 'notes', label: 'Notes par semaine' },
  { id: '2', type: 'monthly', target: 5000, unit: 'words', label: 'Mots par mois' },
];

const STORAGE_KEY = 'journal-writing-goals';

/**
 * Composant de gestion des objectifs d'écriture
 * Permet de définir et suivre des objectifs hebdomadaires/mensuels
 */
export const JournalWritingGoals = memo<JournalWritingGoalsProps>(({ notes, className = '' }) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_GOALS;
    } catch {
      return DEFAULT_GOALS;
    }
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    type: 'weekly',
    unit: 'notes',
    target: 7,
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      logger.error('Failed to save goals', error as Error, 'UI');
    }
  }, [goals]);

  const calculateProgress = (goal: Goal): { current: number; percentage: number } => {
    const now = new Date();
    let start: Date;
    let end: Date;

    if (goal.type === 'weekly') {
      start = startOfWeek(now, { locale: fr });
      end = endOfWeek(now, { locale: fr });
    } else {
      start = startOfMonth(now);
      end = endOfMonth(now);
    }

    const periodNotes = notes.filter(note => {
      const noteDate = parseISO(note.created_at);
      return isWithinInterval(noteDate, { start, end });
    });

    let current: number;
    if (goal.unit === 'notes') {
      current = periodNotes.length;
    } else {
      current = periodNotes.reduce((sum, note) => {
        return sum + note.text.split(/\s+/).filter(w => w.length > 0).length;
      }, 0);
    }

    const percentage = Math.min((current / goal.target) * 100, 100);

    return { current, percentage };
  };

  const addGoal = () => {
    if (!newGoal.target || !newGoal.unit || !newGoal.type) return;

    const goal: Goal = {
      id: Date.now().toString(),
      type: newGoal.type as 'weekly' | 'monthly',
      target: newGoal.target,
      unit: newGoal.unit as 'notes' | 'words',
      label: `${newGoal.target} ${newGoal.unit === 'notes' ? 'notes' : 'mots'} par ${newGoal.type === 'weekly' ? 'semaine' : 'mois'}`,
    };

    setGoals([...goals, goal]);
    setIsAdding(false);
    setNewGoal({ type: 'weekly', unit: 'notes', target: 7 });
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const updated = { ...g, ...updates };
        updated.label = `${updated.target} ${updated.unit === 'notes' ? 'notes' : 'mots'} par ${updated.type === 'weekly' ? 'semaine' : 'mois'}`;
        return updated;
      }
      return g;
    }));
    setEditingId(null);
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600 dark:text-green-400';
    if (percentage >= 75) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-600';
    if (percentage >= 75) return 'bg-blue-600';
    if (percentage >= 50) return 'bg-orange-600';
    return 'bg-red-600';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" aria-hidden="true" />
              Objectifs d'écriture
            </CardTitle>
            <CardDescription>
              Définissez et suivez vos objectifs d'écriture
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
          >
            <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Liste des objectifs */}
        {goals.map(goal => {
          const { current, percentage } = calculateProgress(goal);
          const isCompleted = percentage >= 100;
          const isEditing = editingId === goal.id;

          return (
            <div
              key={goal.id}
              className="p-4 rounded-lg border bg-card/50 space-y-3"
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`type-${goal.id}`}>Période</Label>
                      <select
                        id={`type-${goal.id}`}
                        value={goal.type}
                        onChange={(e) => updateGoal(goal.id, { type: e.target.value as 'weekly' | 'monthly' })}
                        className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
                      >
                        <option value="weekly">Semaine</option>
                        <option value="monthly">Mois</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`unit-${goal.id}`}>Unité</Label>
                      <select
                        id={`unit-${goal.id}`}
                        value={goal.unit}
                        onChange={(e) => updateGoal(goal.id, { unit: e.target.value as 'notes' | 'words' })}
                        className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
                      >
                        <option value="notes">Notes</option>
                        <option value="words">Mots</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`target-${goal.id}`}>Objectif</Label>
                    <Input
                      id={`target-${goal.id}`}
                      type="number"
                      min="1"
                      value={goal.target}
                      onChange={(e) => updateGoal(goal.id, { target: parseInt(e.target.value, 10) })}
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setEditingId(null)}
                    className="w-full"
                  >
                    <Check className="h-4 w-4 mr-1" aria-hidden="true" />
                    Valider
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{goal.label}</h4>
                      {isCompleted && (
                        <Badge variant="default" className="bg-green-600">
                          <Check className="h-3 w-3 mr-1" aria-hidden="true" />
                          Atteint
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setEditingId(goal.id)}
                        aria-label="Modifier l'objectif"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => deleteGoal(goal.id)}
                        aria-label="Supprimer l'objectif"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className={getStatusColor(percentage)}>
                        {current} / {goal.target}
                      </span>
                      <span className={getStatusColor(percentage)}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${getProgressColor(percentage)}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* Formulaire d'ajout */}
        {isAdding && (
          <div className="p-4 rounded-lg border bg-muted/50 space-y-3">
            <h4 className="font-medium text-sm">Nouvel objectif</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="new-type">Période</Label>
                <select
                  id="new-type"
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as 'weekly' | 'monthly' })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
                >
                  <option value="weekly">Semaine</option>
                  <option value="monthly">Mois</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-unit">Unité</Label>
                <select
                  id="new-unit"
                  value={newGoal.unit}
                  onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value as 'notes' | 'words' })}
                  className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background"
                >
                  <option value="notes">Notes</option>
                  <option value="words">Mots</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-target">Objectif</Label>
              <Input
                id="new-target"
                type="number"
                min="1"
                value={newGoal.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value, 10) })}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={addGoal} className="flex-1">
                <Check className="h-4 w-4 mr-1" aria-hidden="true" />
                Ajouter
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewGoal({ type: 'weekly', unit: 'notes', target: 7 });
                }}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

        {goals.length === 0 && !isAdding && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucun objectif défini. Ajoutez-en un pour commencer à suivre vos progrès.
          </p>
        )}
      </CardContent>
    </Card>
  );
});

JournalWritingGoals.displayName = 'JournalWritingGoals';
