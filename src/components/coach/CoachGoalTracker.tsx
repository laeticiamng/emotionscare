// @ts-nocheck

/**
 * Coach Goal Tracker - Planification de sessions et suivi d'objectifs enrichi
 * Avec persistance, statistiques avancées, export et notifications
 */

import React, { useState, useEffect, useMemo } from 'react';
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
  ChevronRight,
  Download,
  Share2,
  BarChart3,
  Flame,
  Trophy,
  Pause,
  Play,
  Archive,
  Filter,
  Search
} from 'lucide-react';
import { format, addDays, differenceInDays, startOfWeek, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  status: 'active' | 'completed' | 'paused' | 'archived';
  priority: 'low' | 'medium' | 'high';
  streak: number;
  lastUpdated: Date;
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
  notes?: string;
  completed: boolean;
  rating?: number;
}

interface Stats {
  totalGoals: number;
  completedGoals: number;
  activeGoals: number;
  totalMilestones: number;
  completedMilestones: number;
  avgProgress: number;
  longestStreak: number;
  totalSessions: number;
  completedSessions: number;
}

const CATEGORIES = {
  wellbeing: { label: 'Bien-être', color: 'bg-green-500', icon: '🌿' },
  mindfulness: { label: 'Pleine conscience', color: 'bg-purple-500', icon: '🧘' },
  social: { label: 'Relations', color: 'bg-blue-500', icon: '💬' },
  growth: { label: 'Croissance', color: 'bg-amber-500', icon: '🌱' },
  health: { label: 'Santé', color: 'bg-red-500', icon: '❤️' }
};

const STORAGE_KEY = 'coach-goal-tracker-data';

export const CoachGoalTracker: React.FC = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [showNewSession, setShowNewSession] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState('active');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    category: 'wellbeing',
    reminderFrequency: 'weekly',
    priority: 'medium',
    milestones: []
  });
  const [newMilestone, setNewMilestone] = useState('');

  // Load saved data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      setGoals(data.goals?.map((g: any) => ({
        ...g,
        targetDate: new Date(g.targetDate),
        createdAt: new Date(g.createdAt),
        lastUpdated: new Date(g.lastUpdated || g.createdAt)
      })) || []);
      setSessions(data.sessions?.map((s: any) => ({
        ...s,
        date: new Date(s.date)
      })) || []);
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ goals, sessions }));
  }, [goals, sessions]);

  // Calculate stats
  const stats = useMemo((): Stats => {
    const totalMilestones = goals.reduce((acc, g) => acc + g.milestones.length, 0);
    const completedMilestones = goals.reduce((acc, g) => acc + g.milestones.filter(m => m.completed).length, 0);
    const avgProgress = goals.length > 0 
      ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / goals.length) 
      : 0;
    const longestStreak = Math.max(...goals.map(g => g.streak || 0), 0);

    return {
      totalGoals: goals.length,
      completedGoals: goals.filter(g => g.status === 'completed').length,
      activeGoals: goals.filter(g => g.status === 'active').length,
      totalMilestones,
      completedMilestones,
      avgProgress,
      longestStreak,
      totalSessions: sessions.length,
      completedSessions: sessions.filter(s => s.completed).length
    };
  }, [goals, sessions]);

  // Filtered goals
  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      const matchesTab = activeTab === 'all' 
        || (activeTab === 'active' && goal.status === 'active')
        || (activeTab === 'completed' && goal.status === 'completed')
        || (activeTab === 'archived' && (goal.status === 'archived' || goal.status === 'paused'));
      
      const matchesCategory = filterCategory === 'all' || goal.category === filterCategory;
      const matchesSearch = searchQuery === '' 
        || goal.title.toLowerCase().includes(searchQuery.toLowerCase())
        || goal.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesTab && matchesCategory && matchesSearch;
    });
  }, [goals, activeTab, filterCategory, searchQuery]);

  const upcomingSessions = sessions
    .filter(s => !s.completed && new Date(s.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id !== goalId) return goal;
      
      const updatedMilestones = goal.milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, completed: !m.completed, completedAt: !m.completed ? new Date() : undefined }
          : m
      );
      
      const completedCount = updatedMilestones.filter(m => m.completed).length;
      const progress = updatedMilestones.length > 0 
        ? Math.round((completedCount / updatedMilestones.length) * 100)
        : 0;
      
      const newStreak = completedCount > goal.milestones.filter(m => m.completed).length 
        ? (goal.streak || 0) + 1 
        : goal.streak;
      
      return {
        ...goal,
        milestones: updatedMilestones,
        progress,
        streak: newStreak,
        status: progress === 100 ? 'completed' : goal.status,
        lastUpdated: new Date()
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
      priority: newGoal.priority as Goal['priority'],
      status: 'active',
      streak: 0,
      lastUpdated: new Date()
    };

    setGoals(prev => [...prev, goal]);
    setNewGoal({ category: 'wellbeing', reminderFrequency: 'weekly', priority: 'medium', milestones: [] });
    setShowNewGoal(false);

    toast({
      title: 'Objectif créé',
      description: 'Votre nouvel objectif a été ajouté.'
    });
  };

  const updateGoalStatus = (goalId: string, status: Goal['status']) => {
    setGoals(prev => prev.map(g => 
      g.id === goalId ? { ...g, status, lastUpdated: new Date() } : g
    ));
    toast({
      title: 'Statut mis à jour',
      description: `Objectif ${status === 'paused' ? 'mis en pause' : status === 'archived' ? 'archivé' : status === 'active' ? 'réactivé' : 'complété'}`
    });
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
    toast({ title: 'Objectif supprimé' });
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

  const completeSession = (sessionId: string, rating: number) => {
    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { ...s, completed: true, rating } : s
    ));
    toast({ title: 'Session complétée' });
  };

  const handleExport = () => {
    const exportData = {
      goals,
      sessions,
      stats,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coach-goals-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({ title: 'Données exportées' });
  };

  const handleShare = async (goal: Goal) => {
    const text = `🎯 Mon objectif: ${goal.title}\nProgression: ${goal.progress}%\nCatégorie: ${CATEGORIES[goal.category].label}`;
    
    if (navigator.share) {
      await navigator.share({ title: goal.title, text });
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copié dans le presse-papier' });
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-amber-500 bg-amber-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
    }
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
          <Dialog open={showStats} onOpenChange={setShowStats}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Statistiques
                </DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 py-4">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <Target className="h-5 w-5 mx-auto mb-1 text-blue-500" />
                  <div className="text-2xl font-bold">{stats.totalGoals}</div>
                  <div className="text-xs text-muted-foreground">Objectifs total</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-green-500" />
                  <div className="text-2xl font-bold">{stats.completedGoals}</div>
                  <div className="text-xs text-muted-foreground">Complétés</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <Sparkles className="h-5 w-5 mx-auto mb-1 text-purple-500" />
                  <div className="text-2xl font-bold">{stats.completedMilestones}/{stats.totalMilestones}</div>
                  <div className="text-xs text-muted-foreground">Étapes</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <TrendingUp className="h-5 w-5 mx-auto mb-1 text-amber-500" />
                  <div className="text-2xl font-bold">{stats.avgProgress}%</div>
                  <div className="text-xs text-muted-foreground">Progression moy.</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <Flame className="h-5 w-5 mx-auto mb-1 text-orange-500" />
                  <div className="text-2xl font-bold">{stats.longestStreak}</div>
                  <div className="text-xs text-muted-foreground">Meilleur streak</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <MessageSquare className="h-5 w-5 mx-auto mb-1 text-cyan-500" />
                  <div className="text-2xl font-bold">{stats.completedSessions}/{stats.totalSessions}</div>
                  <div className="text-xs text-muted-foreground">Sessions</div>
                </div>
              </div>
              <Button variant="outline" onClick={handleExport} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Exporter les données
              </Button>
            </DialogContent>
          </Dialog>

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
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Date de la session</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate 
                          ? format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })
                          : 'Sélectionner une date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-time">Heure</Label>
                  <Select defaultValue="10:00">
                    <SelectTrigger id="session-time">
                      <SelectValue placeholder="Choisir une heure" />
                    </SelectTrigger>
                    <SelectContent>
                      {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-topic">Sujet de la session</Label>
                  <Input id="session-topic" placeholder="Ex: Bilan de la semaine, Gestion du stress..." />
                </div>
                
                <div className="space-y-2">
                  <Label>Type de session</Label>
                  <Select defaultValue="check-in">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="check-in">Check-in rapide (15 min)</SelectItem>
                      <SelectItem value="deep-dive">Session approfondie (30 min)</SelectItem>
                      <SelectItem value="review">Revue des objectifs (45 min)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewSession(false)}>
                  Annuler
                </Button>
                <Button onClick={() => {
                  if (selectedDate) {
                    const newSession: ScheduledSession = {
                      id: Date.now().toString(),
                      date: selectedDate,
                      time: '10:00',
                      topic: 'Nouvelle session',
                      type: 'check-in',
                      confirmed: false,
                      completed: false
                    };
                    setSessions(prev => [...prev, newSession]);
                    setShowNewSession(false);
                    toast({
                      title: 'Session planifiée',
                      description: `Votre session est prévue le ${format(selectedDate, 'EEEE d MMMM', { locale: fr })}`
                    });
                  }
                }}>
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
              <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
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
                    <Label>Priorité</Label>
                    <Select
                      value={newGoal.priority}
                      onValueChange={v => setNewGoal(prev => ({ ...prev, priority: v as Goal['priority'] }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">🔴 Haute</SelectItem>
                        <SelectItem value="medium">🟡 Moyenne</SelectItem>
                        <SelectItem value="low">🟢 Basse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 ml-auto"
                            onClick={() => setNewGoal(prev => ({
                              ...prev,
                              milestones: prev.milestones?.filter(ms => ms.id !== m.id)
                            }))}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
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
                <Button onClick={addGoal}>
                  Créer l'objectif
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Target className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <div className="text-xl font-bold">{stats.activeGoals}</div>
              <div className="text-xs text-muted-foreground">Objectifs actifs</div>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <div className="text-xl font-bold">{stats.completedGoals}</div>
              <div className="text-xs text-muted-foreground">Complétés</div>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
            <div>
              <div className="text-xl font-bold">{stats.avgProgress}%</div>
              <div className="text-xs text-muted-foreground">Progression moy.</div>
            </div>
          </div>
        </Card>
        <Card className="p-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-orange-500/10">
              <Flame className="h-4 w-4 text-orange-500" />
            </div>
            <div>
              <div className="text-xl font-bold">{stats.longestStreak}</div>
              <div className="text-xs text-muted-foreground">Meilleur streak</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Prochaines sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingSessions.map(session => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'p-2 rounded-lg',
                      session.type === 'check-in' && 'bg-blue-500/10',
                      session.type === 'deep-dive' && 'bg-purple-500/10',
                      session.type === 'review' && 'bg-amber-500/10'
                    )}>
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{session.topic}</div>
                      <div className="text-sm text-muted-foreground">
                        {format(session.date, 'EEEE d MMMM', { locale: fr })} à {session.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.confirmed ? (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                        Confirmée
                      </Badge>
                    ) : (
                      <Button size="sm" onClick={() => confirmSession(session.id)}>
                        Confirmer
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals List */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Mes objectifs</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 w-40"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-32 h-8">
                  <Filter className="h-3 w-3 mr-1" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  {Object.entries(CATEGORIES).map(([key, cat]) => (
                    <SelectItem key={key} value={key}>{cat.icon} {cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-4">
              <TabsTrigger value="active" className="flex-1">Actifs ({goals.filter(g => g.status === 'active').length})</TabsTrigger>
              <TabsTrigger value="completed" className="flex-1">Complétés ({goals.filter(g => g.status === 'completed').length})</TabsTrigger>
              <TabsTrigger value="archived" className="flex-1">Archivés</TabsTrigger>
              <TabsTrigger value="all" className="flex-1">Tous</TabsTrigger>
            </TabsList>

            <div className="space-y-3">
              <AnimatePresence>
                {filteredGoals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun objectif trouvé
                  </div>
                ) : (
                  filteredGoals.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'p-4 rounded-lg border transition-all',
                        goal.status === 'completed' && 'bg-green-500/5 border-green-500/30',
                        goal.status === 'paused' && 'opacity-60',
                        goal.status === 'active' && 'hover:shadow-md'
                      )}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{CATEGORIES[goal.category].icon}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{goal.title}</h4>
                              <Badge className={cn('text-xs', getPriorityColor(goal.priority))}>
                                {goal.priority === 'high' ? 'Haute' : goal.priority === 'medium' ? 'Moyenne' : 'Basse'}
                              </Badge>
                              {goal.streak > 0 && (
                                <Badge variant="outline" className="gap-1">
                                  <Flame className="h-3 w-3 text-orange-500" />
                                  {goal.streak}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{goal.description}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <CalendarIcon className="h-3 w-3" />
                              Échéance: {format(goal.targetDate, 'dd MMM yyyy', { locale: fr })}
                              {differenceInDays(goal.targetDate, new Date()) <= 3 && goal.status === 'active' && (
                                <Badge variant="destructive" className="text-xs">Bientôt !</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShare(goal)}>
                            <Share2 className="h-4 w-4" />
                          </Button>
                          {goal.status === 'active' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateGoalStatus(goal.id, 'paused')}>
                              <Pause className="h-4 w-4" />
                            </Button>
                          )}
                          {goal.status === 'paused' && (
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateGoalStatus(goal.id, 'active')}>
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateGoalStatus(goal.id, 'archived')}>
                            <Archive className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteGoal(goal.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Progression</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>

                      {/* Milestones */}
                      {goal.milestones.length > 0 && (
                        <div className="space-y-1">
                          {goal.milestones.map(milestone => (
                            <div
                              key={milestone.id}
                              className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 p-1 rounded"
                              onClick={() => toggleMilestone(goal.id, milestone.id)}
                            >
                              {milestone.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className={cn(milestone.completed && 'line-through text-muted-foreground')}>
                                {milestone.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {goal.coachNotes && (
                        <div className="mt-3 p-2 rounded-lg bg-primary/5 border border-primary/20">
                          <div className="flex items-center gap-1 text-xs text-primary mb-1">
                            <MessageSquare className="h-3 w-3" />
                            Note du coach
                          </div>
                          <p className="text-sm">{goal.coachNotes}</p>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachGoalTracker;
