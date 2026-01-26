// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, CheckCircle, Plus, Clock, Repeat, X, AlarmClock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'emotionscare_reminders';

interface Reminder {
  id: string;
  title: string;
  time: string;
  completed: boolean;
  category: 'meditation' | 'journal' | 'scan' | 'breath' | 'custom';
  recurring: 'none' | 'daily' | 'weekly';
  snoozedUntil?: string;
}

const CATEGORIES = [
  { value: 'meditation', label: 'Méditation', icon: '🧘', color: 'bg-purple-500/10 text-purple-500' },
  { value: 'journal', label: 'Journal', icon: '📔', color: 'bg-blue-500/10 text-blue-500' },
  { value: 'scan', label: 'Scan émotionnel', icon: '🔍', color: 'bg-green-500/10 text-green-500' },
  { value: 'breath', label: 'Respiration', icon: '🌬️', color: 'bg-cyan-500/10 text-cyan-500' },
  { value: 'custom', label: 'Personnalisé', icon: '⭐', color: 'bg-yellow-500/10 text-yellow-500' },
];

const UpcomingReminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    time: '',
    category: 'custom' as Reminder['category'],
    recurring: 'none' as Reminder['recurring'],
  });
  const { toast } = useToast();

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Filter out old completed non-recurring reminders
        const filtered = parsed.filter((r: Reminder) => {
          if (r.completed && r.recurring === 'none') {
            const reminderDate = new Date(r.time);
            const dayAgo = new Date();
            dayAgo.setDate(dayAgo.getDate() - 1);
            return reminderDate > dayAgo;
          }
          return true;
        });
        setReminders(filtered);
      } catch (e) {
        // Invalid data
      }
    } else {
      // Default reminders
      const now = new Date();
      const defaultReminders: Reminder[] = [
        {
          id: '1',
          title: 'Session de méditation',
          time: new Date(now.setHours(10, 0, 0, 0)).toISOString(),
          completed: false,
          category: 'meditation',
          recurring: 'daily',
        },
        {
          id: '2',
          title: 'Scanner votre émotion',
          time: new Date(now.setHours(14, 30, 0, 0)).toISOString(),
          completed: false,
          category: 'scan',
          recurring: 'daily',
        },
        {
          id: '3',
          title: 'Écrire dans le journal',
          time: new Date(now.setHours(19, 0, 0, 0)).toISOString(),
          completed: true,
          category: 'journal',
          recurring: 'daily',
        }
      ];
      setReminders(defaultReminders);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultReminders));
    }
  }, []);

  // Save to localStorage
  const saveReminders = (newReminders: Reminder[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newReminders));
    setReminders(newReminders);
  };

  const handleComplete = (id: string) => {
    const updated = reminders.map(r => 
      r.id === id ? { ...r, completed: true } : r
    );
    saveReminders(updated);
    
    const reminder = reminders.find(r => r.id === id);
    toast({
      title: '✓ Rappel terminé',
      description: reminder?.title,
    });
  };

  const handleSnooze = (id: string, minutes: number) => {
    const snoozeTime = new Date();
    snoozeTime.setMinutes(snoozeTime.getMinutes() + minutes);
    
    const updated = reminders.map(r => 
      r.id === id ? { ...r, snoozedUntil: snoozeTime.toISOString() } : r
    );
    saveReminders(updated);
    
    toast({
      title: `⏰ Rappel reporté de ${minutes} min`,
      description: `Nouveau rappel à ${snoozeTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
    });
  };

  const handleDelete = (id: string) => {
    const updated = reminders.filter(r => r.id !== id);
    saveReminders(updated);
    
    toast({
      title: 'Rappel supprimé',
      variant: 'destructive',
    });
  };

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.time) return;

    const today = new Date();
    const [hours, minutes] = newReminder.time.split(':');
    today.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      time: today.toISOString(),
      completed: false,
      category: newReminder.category,
      recurring: newReminder.recurring,
    };

    saveReminders([...reminders, reminder]);
    setShowAddDialog(false);
    setNewReminder({ title: '', time: '', category: 'custom', recurring: 'none' });
    
    toast({
      title: '✓ Rappel ajouté',
      description: reminder.title,
    });
  };

  // Sort reminders by time
  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return new Date(a.time).getTime() - new Date(b.time).getTime();
  });

  const pendingCount = reminders.filter(r => !r.completed).length;
  const completedCount = reminders.filter(r => r.completed).length;

  const getCategoryInfo = (category: Reminder['category']) => 
    CATEGORIES.find(c => c.value === category) || CATEGORIES[4];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>Rappels à venir</CardTitle>
          {pendingCount > 0 && (
            <Badge variant="secondary">{pendingCount}</Badge>
          )}
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau rappel</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Titre</label>
                <Input
                  placeholder="Ex: Méditation du matin"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Heure</label>
                <Input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select
                  value={newReminder.category}
                  onValueChange={(value) => setNewReminder({ ...newReminder, category: value as Reminder['category'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        <span className="flex items-center gap-2">
                          {cat.icon} {cat.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Récurrence</label>
                <Select
                  value={newReminder.recurring}
                  onValueChange={(value) => setNewReminder({ ...newReminder, recurring: value as Reminder['recurring'] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Une seule fois</SelectItem>
                    <SelectItem value="daily">Tous les jours</SelectItem>
                    <SelectItem value="weekly">Chaque semaine</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleAddReminder} className="w-full">
                Créer le rappel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {sortedReminders.map((reminder) => {
              const categoryInfo = getCategoryInfo(reminder.category);
              const reminderTime = new Date(reminder.time);
              const isOverdue = !reminder.completed && reminderTime < new Date();
              const isSnoozed = reminder.snoozedUntil && new Date(reminder.snoozedUntil) > new Date();
              
              return (
                <motion.div 
                  key={reminder.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`flex items-center justify-between border-l-4 px-3 py-2 rounded transition-all ${
                    reminder.completed 
                      ? 'border-muted bg-muted/30 text-muted-foreground' 
                      : isOverdue
                        ? 'border-red-500 bg-red-500/5'
                        : isSnoozed
                          ? 'border-yellow-500 bg-yellow-500/5'
                          : 'border-primary bg-primary/5'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {reminder.completed ? (
                      <CheckCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <div className={`w-8 h-8 rounded-full ${categoryInfo.color} flex items-center justify-center flex-shrink-0`}>
                        <span>{categoryInfo.icon}</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium truncate ${reminder.completed ? 'line-through' : ''}`}>
                          {reminder.title}
                        </p>
                        {reminder.recurring !== 'none' && (
                          <Repeat className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          {isSnoozed 
                            ? `Reporté à ${new Date(reminder.snoozedUntil!).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
                            : reminderTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                          }
                        </span>
                        {isOverdue && !reminder.completed && (
                          <Badge variant="destructive" className="text-xs">En retard</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {!reminder.completed && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleSnooze(reminder.id, 15)}
                          title="Reporter de 15 min"
                        >
                          <AlarmClock className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleComplete(reminder.id)}
                        >
                          Terminer
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(reminder.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {reminders.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>Aucun rappel pour aujourd'hui</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => setShowAddDialog(true)}
              >
                Créer un rappel
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        {reminders.length > 0 && (
          <div className="mt-4 pt-3 border-t flex justify-between text-xs text-muted-foreground">
            <span>{completedCount} terminé{completedCount > 1 ? 's' : ''}</span>
            <span>{pendingCount} en attente</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingReminders;
