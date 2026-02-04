/**
 * Widget de suivi d'objectifs pour le Coach IA
 * Permet de définir et suivre des objectifs avec milestones
 */

import { memo, useState } from 'react';
import { 
  Target, 
  Plus, 
  Check, 
  Clock, 
  TrendingUp,
  ChevronRight,
  Sparkles,
  Trophy,
  Calendar,
  MoreVertical,
  Edit2,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface CoachGoal {
  id: string;
  title: string;
  description?: string;
  category: 'wellness' | 'habit' | 'skill' | 'emotion' | 'relationship';
  priority: 'high' | 'medium' | 'low';
  targetDate?: string;
  createdAt: string;
  milestones: GoalMilestone[];
  notes?: string;
  status: 'active' | 'completed' | 'paused';
}

const CATEGORY_CONFIG = {
  wellness: { label: 'Bien-être', icon: '🌱', color: 'bg-green-500/10 text-green-600' },
  habit: { label: 'Habitude', icon: '🔄', color: 'bg-blue-500/10 text-blue-600' },
  skill: { label: 'Compétence', icon: '📚', color: 'bg-purple-500/10 text-purple-600' },
  emotion: { label: 'Émotion', icon: '💖', color: 'bg-rose-500/10 text-rose-600' },
  relationship: { label: 'Relation', icon: '🤝', color: 'bg-amber-500/10 text-amber-600' },
};

const PRIORITY_CONFIG = {
  high: { label: 'Haute', color: 'bg-red-500/10 text-red-600' },
  medium: { label: 'Moyenne', color: 'bg-yellow-500/10 text-yellow-600' },
  low: { label: 'Basse', color: 'bg-slate-500/10 text-slate-600' },
};

// Demo goals for display
const DEMO_GOALS: CoachGoal[] = [
  {
    id: '1',
    title: 'Méditer 10 minutes par jour',
    description: 'Développer une pratique quotidienne de méditation',
    category: 'wellness',
    priority: 'high',
    targetDate: '2026-03-01',
    createdAt: '2026-01-15',
    status: 'active',
    milestones: [
      { id: 'm1', title: 'Première semaine complète', completed: true, completedAt: '2026-01-22' },
      { id: 'm2', title: '2 semaines consécutives', completed: true, completedAt: '2026-01-29' },
      { id: 'm3', title: '1 mois complet', completed: false },
      { id: 'm4', title: 'Augmenter à 15 min', completed: false },
    ],
  },
  {
    id: '2',
    title: 'Gérer mon anxiété sociale',
    description: 'Réduire l\'évitement et augmenter mes interactions',
    category: 'emotion',
    priority: 'medium',
    createdAt: '2026-01-20',
    status: 'active',
    milestones: [
      { id: 'm1', title: 'Identifier mes déclencheurs', completed: true },
      { id: 'm2', title: 'Pratiquer 3 techniques de respiration', completed: true },
      { id: 'm3', title: 'Initier une conversation/jour', completed: false },
    ],
  },
  {
    id: '3',
    title: 'Journal quotidien',
    description: 'Écrire au moins 5 minutes chaque soir',
    category: 'habit',
    priority: 'medium',
    createdAt: '2026-02-01',
    status: 'active',
    milestones: [
      { id: 'm1', title: '7 jours consécutifs', completed: false },
      { id: 'm2', title: '21 jours (habitude formée)', completed: false },
    ],
  },
];

interface CoachGoalsTrackerProps {
  goals?: CoachGoal[];
  onAddGoal?: (goal: Omit<CoachGoal, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateGoal?: (id: string, updates: Partial<CoachGoal>) => void;
  onDeleteGoal?: (id: string) => void;
  onToggleMilestone?: (goalId: string, milestoneId: string) => void;
  className?: string;
}

export const CoachGoalsTracker = memo(function CoachGoalsTracker({
  goals = DEMO_GOALS,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
  onToggleMilestone,
  className
}: CoachGoalsTrackerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'wellness' as CoachGoal['category'],
    priority: 'medium' as CoachGoal['priority'],
  });

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  const calculateProgress = (goal: CoachGoal) => {
    if (goal.milestones.length === 0) return 0;
    const completed = goal.milestones.filter(m => m.completed).length;
    return Math.round((completed / goal.milestones.length) * 100);
  };

  const handleAddGoal = () => {
    if (onAddGoal && newGoal.title) {
      onAddGoal({
        ...newGoal,
        milestones: [],
      });
      setNewGoal({
        title: '',
        description: '',
        category: 'wellness',
        priority: 'medium',
      });
      setIsAddDialogOpen(false);
    }
  };

  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>Mes Objectifs</CardTitle>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Nouvel objectif
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un objectif</DialogTitle>
                <DialogDescription>
                  Définissez un nouvel objectif à atteindre avec l'aide de votre coach
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l'objectif</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Méditer 10 minutes par jour"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optionnel)</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre objectif..."
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(CATEGORY_CONFIG) as CoachGoal['category'][]).map((cat) => (
                        <Button
                          key={cat}
                          size="sm"
                          variant={newGoal.category === cat ? "default" : "outline"}
                          onClick={() => setNewGoal(prev => ({ ...prev, category: cat }))}
                          className="text-xs"
                        >
                          {CATEGORY_CONFIG[cat].icon} {CATEGORY_CONFIG[cat].label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Priorité</Label>
                    <div className="flex gap-2">
                      {(Object.keys(PRIORITY_CONFIG) as CoachGoal['priority'][]).map((pri) => (
                        <Button
                          key={pri}
                          size="sm"
                          variant={newGoal.priority === pri ? "default" : "outline"}
                          onClick={() => setNewGoal(prev => ({ ...prev, priority: pri }))}
                          className="text-xs"
                        >
                          {PRIORITY_CONFIG[pri].label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddGoal} disabled={!newGoal.title}>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Créer l'objectif
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <CardDescription>
          {activeGoals.length} objectif(s) en cours · {completedGoals.length} complété(s)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Goals */}
        {activeGoals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Aucun objectif en cours</p>
            <p className="text-sm">Créez votre premier objectif pour commencer</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeGoals.map((goal) => {
              const progress = calculateProgress(goal);
              const catConfig = CATEGORY_CONFIG[goal.category];
              const priConfig = PRIORITY_CONFIG[goal.priority];
              
              return (
                <div
                  key={goal.id}
                  className="rounded-xl border p-4 bg-card/50 hover:shadow-md transition-shadow"
                >
                  {/* Goal Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{catConfig.icon}</div>
                      <div>
                        <h3 className="font-semibold text-sm">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {goal.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit2 className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => onDeleteGoal?.(goal.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 mb-3">
                    <Badge className={cn("text-[10px]", catConfig.color)}>
                      {catConfig.label}
                    </Badge>
                    <Badge className={cn("text-[10px]", priConfig.color)}>
                      {priConfig.label}
                    </Badge>
                    {goal.targetDate && (
                      <Badge variant="outline" className="text-[10px] flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(goal.targetDate).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
                      </Badge>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-medium">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  {/* Milestones */}
                  {goal.milestones.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <Trophy className="h-3 w-3" />
                        Étapes ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                      </div>
                      <div className="space-y-1.5">
                        {goal.milestones.map((milestone) => (
                          <button
                            key={milestone.id}
                            onClick={() => onToggleMilestone?.(goal.id, milestone.id)}
                            className={cn(
                              "flex items-center gap-2 w-full p-2 rounded-lg text-left text-xs transition-colors",
                              milestone.completed 
                                ? "bg-green-500/10 text-green-700 line-through" 
                                : "bg-muted/50 hover:bg-muted"
                            )}
                          >
                            <div className={cn(
                              "h-4 w-4 rounded-full border flex items-center justify-center",
                              milestone.completed ? "bg-green-500 border-green-500" : "border-muted-foreground/40"
                            )}>
                              {milestone.completed && <Check className="h-3 w-3 text-white" />}
                            </div>
                            <span>{milestone.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-4 border-t">
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-bold text-primary">{activeGoals.length}</div>
            <div className="text-[10px] text-muted-foreground">En cours</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-bold text-green-600">{completedGoals.length}</div>
            <div className="text-[10px] text-muted-foreground">Complétés</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-bold text-amber-600">
              {goals.reduce((acc, g) => acc + g.milestones.filter(m => m.completed).length, 0)}
            </div>
            <div className="text-[10px] text-muted-foreground">Étapes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
