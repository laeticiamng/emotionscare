/**
 * Coach Goal Tracker - Planification de sessions et suivi d'objectifs
 * Permet de définir des objectifs avec le coach et suivre les progrès
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Target,
  Plus,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Clock,
  TrendingUp,
  Award,
  Sparkles,
  MessageSquare,
  Bell,
  Trash2,
  Edit,
  ChevronRight
} from 'lucide-react';
import { format, addDays, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'wellbeing' | 'mindfulness' | 'social' | 'growth' | 'health';
  targetDate: Date;
  createdAt: Date;
  progress: number;
  milestones: Milestone[];
  coachNotes?: string;
  reminderFrequency: 'daily' | 'weekly' | 'none';
  status: 'active' | 'completed' | 'paused';
}

interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
}

interface ScheduledSession {
  id: string;
  date: Date;
  time: string;
  topic: string;
  type: 'check-in' | 'deep-dive' | 'review';
  confirmed: boolean;
}

const CATEGORIES = {
  wellbeing: { label: 'Bien-être', color: 'bg-green-500', icon: '🌿' },
  mindfulness: { label: 'Pleine conscience', color: 'bg-purple-500', icon: '🧘' },
  social: { label: 'Relations', color: 'bg-blue-500', icon: '💬' },
  growth: { label: 'Croissance', color: 'bg-amber-500', icon: '🌱' },
  health: { label: 'Santé', color: 'bg-red-500', icon: '❤️' }
};

const INITIAL_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Pratiquer la méditation quotidienne',
    description: 'Méditer au moins 10 minutes chaque jour pour réduire le stress',
    category: 'mindfulness',
    targetDate: addDays(new Date(), 30),
    createdAt: new Date(),
    progress: 45,
    milestones: [
      { id: 'm1', title: '7 jours consécutifs', completed: true, completedAt: new Date() },
      { id: 'm2', title: '14 jours consécutifs', completed: false },
      { id: 'm3', title: '21 jours consécutifs', completed: false },
      { id: 'm4', title: '30 jours consécutifs', completed: false }
    ],
    coachNotes: 'Excellent début ! Continuez à maintenir cette habitude.',
    reminderFrequency: 'daily',
    status: 'active'
  },
  {
    id: '2',
    title: 'Améliorer la qualité du sommeil',
    description: 'Établir une routine de coucher régulière et sans écrans',
    category: 'health',
    targetDate: addDays(new Date(), 21),
    createdAt: addDays(new Date(), -7),
    progress: 70,
    milestones: [
      { id: 'm1', title: 'Définir horaire fixe', completed: true },
      { id: 'm2', title: 'Arrêter écrans 1h avant', completed: true },
      { id: 'm3', title: 'Routine de relaxation', completed: false }
    ],
    reminderFrequency: 'daily',
    status: 'active'
  }
];

const INITIAL_SESSIONS: ScheduledSession[] = [
  {
    id: 's1',
    date: addDays(new Date(), 2),
    time: '14:00',
    topic: 'Bilan méditation',
    type: 'check-in',
    confirmed: true
  },
  {
    id: 's2',
    date: addDays(new Date(), 7),
    time: '10:00',
    topic: 'Revue des objectifs',
    type: 'review',
    confirmed: false
  }
];

export const CoachGoalTracker: React.FC = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [sessions, setSessions] = useState<ScheduledSession[]>(INITIAL_SESSIONS);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showNewSession, setShowNewSession] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    category: 'wellbeing',
    reminderFrequency: 'weekly',
    milestones: []
  });
  const [newMilestone, setNewMilestone] = useState('');

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      
      const updatedMilestones = goal.milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date() : undefined }
          : m
      );
      
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const progress = Math.round((completedCount / updatedMilestones.length) * 100);
      
      return {
        ...goal,
        milestones: updatedMilestones,
        progress,
        status: progress === 100 ? 'completed' : goal.status
      };
    }));
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.targetDate) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir le titre et la date cible.',
        variant: 'destructive'
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description || '',
      category: newGoal.category as Goal['category'],
      targetDate: newGoal.targetDate,
      createdAt: new Date(),
      progress: 0,
      milestones: newGoal.milestones || [],
      reminderFrequency: newGoal.reminderFrequency as Goal['reminderFrequency'],
      status: 'active'
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({ category: 'wellbeing', reminderFrequency: 'weekly', milestones: [] });
    setShowNewGoal(false);

    toast({
      title: 'Objectif créé',
      description: 'Votre nouvel objectif a été ajouté.'
    });
  };

  const addMilestoneToNewGoal = () => {
    if (!newMilestone.trim()) return;
    
    setNewGoal(prev => ({
      ...prev,
      milestones: [
        ...(prev.milestones || []),
        { id: Date.now().toString(), title: newMilestone, completed: false }
      ]
    }));
    setNewMilestone('');
  };

  const confirmSession = (sessionId: string) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, confirmed: true } : s
    ));
    toast({
      title: 'Session confirmée',
      description: 'Vous recevrez un rappel avant la session.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Objectifs & Sessions
          </h2>
          <p className="text-muted-foreground">
            Suivez vos progrès avec votre coach IA
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showNewSession} onOpenChange={setShowNewSession}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Planifier session
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Planifier une session</DialogTitle>
                <DialogDescription>
                  Réservez un moment avec votre coach IA
                </DialogDescription>
              </DialogHeader>
              {/* Form session - simplifié pour l'exemple */}
              <div className="py-4 text-center text-muted-foreground">
                Sélectionnez une date et un créneau pour votre prochaine session.
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewSession(false)}>
                  Annuler
                </Button>
                <Button onClick={() => setShowNewSession(false)}>
                  Confirmer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={showNewGoal} onOpenChange={setShowNewGoal}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel objectif
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Créer un objectif</DialogTitle>
                <DialogDescription>
                  Définissez un nouvel objectif à atteindre avec l'aide de votre coach
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-title">Titre *</Label>
                  <Input
                    id="goal-title"
                    value={newGoal.title || ''}
                    onChange={e => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Méditer 10 minutes par jour"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal-desc">Description</Label>
                  <Textarea
                    id="goal-desc"
                    value={newGoal.description || ''}
                    onChange={e => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez votre objectif en détail..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select
                      value={newGoal.category}
                      onValueChange={v => setNewGoal(prev => ({ ...prev, category: v as Goal['category'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(CATEGORIES).map(([key, cat]) => (
                          <SelectItem key={key} value={key}>
                            {cat.icon} {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Date cible *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newGoal.targetDate 
                            ? format(newGoal.targetDate, 'dd MMM yyyy', { locale: fr })
                            : 'Sélectionner'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newGoal.targetDate}
                          onSelect={date => setNewGoal(prev => ({ ...prev, targetDate: date }))}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Rappels</Label>
                  <Select
                    value={newGoal.reminderFrequency}
                    onValueChange={v => setNewGoal(prev => ({ ...prev, reminderFrequency: v as Goal['reminderFrequency'] }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="none">Aucun</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Étapes clés</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newMilestone}
                      onChange={e => setNewMilestone(e.target.value)}
                      placeholder="Ajouter une étape..."
                      onKeyDown={e => e.key === 'Enter' && addMilestoneToNewGoal()}
                    />
                    <Button type="button" variant="outline" onClick={addMilestoneToNewGoal}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {newGoal.milestones && newGoal.milestones.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {newGoal.milestones.map((m, i) => (
                        <li key={m.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Circle className="h-3 w-3" />
                          {m.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewGoal(false)}>
                  Annuler
                </Button>
                <Button onClick={addGoal}>Créer l'objectif</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Sessions planifiées */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Prochaines sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions.map(session => (
                <div 
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      session.type === 'check-in' && 'bg-blue-500/10',
                      session.type === 'deep-dive' && 'bg-purple-500/10',
                      session.type === 'review' && 'bg-amber-500/10'
                    )}>
                      <CalendarIcon className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <h4 className="font-medium">{session.topic}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(session.date, 'EEEE d MMMM', { locale: fr })} à {session.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={session.confirmed ? 'default' : 'secondary'}>
                      {session.confirmed ? 'Confirmée' : 'En attente'}
                    </Badge>
                    {!session.confirmed && (
                      <Button size="sm" onClick={() => confirmSession(session.id)}>
                        Confirmer
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Objectifs actifs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active" className="gap-1">
            <Target className="h-4 w-4" />
            Actifs ({activeGoals.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-1">
            <CheckCircle2 className="h-4 w-4" />
            Terminés ({completedGoals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeGoals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Aucun objectif actif</h3>
                <p className="text-muted-foreground mb-4">
                  Créez votre premier objectif pour commencer le suivi.
                </p>
                <Button onClick={() => setShowNewGoal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un objectif
                </Button>
              </CardContent>
            </Card>
          ) : (
            activeGoals.map(goal => {
              const category = CATEGORIES[goal.category];
              const daysLeft = differenceInDays(goal.targetDate, new Date());
              
              return (
                <Card key={goal.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-lg", category.color, "bg-opacity-20")}>
                          {category.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold">{goal.title}</h3>
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                      </div>
                      <Badge variant={daysLeft < 7 ? 'destructive' : 'secondary'}>
                        <Clock className="h-3 w-3 mr-1" />
                        {daysLeft} jours
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Étapes</h4>
                      {goal.milestones.map(milestone => (
                        <div 
                          key={milestone.id}
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => toggleMilestone(goal.id, milestone.id)}
                        >
                          <Checkbox 
                            checked={milestone.completed}
                            onCheckedChange={() => toggleMilestone(goal.id, milestone.id)}
                          />
                          <span className={cn(
                            "text-sm",
                            milestone.completed && "line-through text-muted-foreground"
                          )}>
                            {milestone.title}
                          </span>
                          {milestone.completed && milestone.completedAt && (
                            <span className="text-xs text-muted-foreground">
                              {format(milestone.completedAt, 'd MMM', { locale: fr })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    {goal.coachNotes && (
                      <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Note du coach</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{goal.coachNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedGoals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Pas encore d'objectifs terminés</h3>
                <p className="text-muted-foreground">
                  Continuez à travailler sur vos objectifs actifs !
                </p>
              </CardContent>
            </Card>
          ) : (
            completedGoals.map(goal => (
              <Card key={goal.id} className="opacity-80">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                      <div>
                        <h3 className="font-semibold">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Complété le {format(goal.targetDate, 'd MMMM yyyy', { locale: fr })}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      100%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CoachGoalTracker;
