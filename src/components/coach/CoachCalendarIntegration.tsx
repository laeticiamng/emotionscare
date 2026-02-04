/**
 * CoachCalendarIntegration - Intégration calendrier pour les sessions de coaching
 * Planification et rappels de sessions avec le coach IA
 */

import React, { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Calendar, Clock, Bell, Plus, Trash2, Edit2, 
  Check, X, CalendarPlus, Repeat, ChevronRight 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ScheduledSession {
  id: string;
  title: string;
  datetime: Date;
  duration: number;
  recurring: 'none' | 'daily' | 'weekly' | 'monthly';
  reminder: boolean;
  reminderMinutes: number;
  completed: boolean;
}

const DURATIONS = [
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' }
];

const CoachCalendarIntegration = memo(() => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ScheduledSession[]>([
    {
      id: '1',
      title: 'Check-in matinal',
      datetime: new Date(Date.now() + 86400000),
      duration: 10,
      recurring: 'daily',
      reminder: true,
      reminderMinutes: 15,
      completed: false
    },
    {
      id: '2',
      title: 'Session bien-être',
      datetime: new Date(Date.now() + 172800000),
      duration: 20,
      recurring: 'weekly',
      reminder: true,
      reminderMinutes: 30,
      completed: false
    }
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newSession, setNewSession] = useState({
    title: '',
    date: '',
    time: '',
    duration: 15,
    recurring: 'none' as ScheduledSession['recurring'],
    reminder: true,
    reminderMinutes: 15
  });

  const handleAddSession = () => {
    if (!newSession.title || !newSession.date || !newSession.time) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive'
      });
      return;
    }

    const datetime = new Date(`${newSession.date}T${newSession.time}`);
    const session: ScheduledSession = {
      id: Date.now().toString(),
      title: newSession.title,
      datetime,
      duration: newSession.duration,
      recurring: newSession.recurring,
      reminder: newSession.reminder,
      reminderMinutes: newSession.reminderMinutes,
      completed: false
    };

    setSessions(prev => [...prev, session]);
    setIsAdding(false);
    setNewSession({
      title: '',
      date: '',
      time: '',
      duration: 15,
      recurring: 'none',
      reminder: true,
      reminderMinutes: 15
    });

    toast({
      title: 'Session planifiée',
      description: `${session.title} ajoutée au calendrier`
    });
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    toast({ title: 'Session supprimée' });
  };

  const toggleComplete = (id: string) => {
    setSessions(prev => prev.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecurringBadge = (recurring: ScheduledSession['recurring']) => {
    const config = {
      none: null,
      daily: { label: 'Quotidien', color: 'bg-blue-500' },
      weekly: { label: 'Hebdomadaire', color: 'bg-green-500' },
      monthly: { label: 'Mensuel', color: 'bg-purple-500' }
    };
    const badge = config[recurring];
    if (!badge) return null;
    return (
      <Badge variant="outline" className={`${badge.color} bg-opacity-20 text-xs`}>
        <Repeat className="h-3 w-3 mr-1" />
        {badge.label}
      </Badge>
    );
  };

  const upcomingSessions = sessions
    .filter(s => !s.completed && s.datetime > new Date())
    .sort((a, b) => a.datetime.getTime() - b.datetime.getTime());

  const pastSessions = sessions
    .filter(s => s.completed || s.datetime <= new Date())
    .sort((a, b) => b.datetime.getTime() - a.datetime.getTime());

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sessions Planifiées
            </CardTitle>
            <CardDescription>
              Organisez vos sessions de coaching
            </CardDescription>
          </div>
          <Button onClick={() => setIsAdding(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Nouvelle session
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulaire d'ajout */}
        {isAdding && (
          <div className="p-4 rounded-lg border bg-muted/50 space-y-4">
            <h4 className="font-medium">Planifier une session</h4>
            
            <Input
              placeholder="Titre de la session"
              value={newSession.title}
              onChange={(e) => setNewSession(prev => ({ ...prev, title: e.target.value }))}
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">Date</label>
                <Input
                  type="date"
                  value={newSession.date}
                  onChange={(e) => setNewSession(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Heure</label>
                <Input
                  type="time"
                  value={newSession.time}
                  onChange={(e) => setNewSession(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground">Durée</label>
                <Select
                  value={newSession.duration.toString()}
                  onValueChange={(v) => setNewSession(prev => ({ ...prev, duration: parseInt(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATIONS.map(d => (
                      <SelectItem key={d.value} value={d.value.toString()}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Récurrence</label>
                <Select
                  value={newSession.recurring}
                  onValueChange={(v) => setNewSession(prev => ({ 
                    ...prev, 
                    recurring: v as ScheduledSession['recurring'] 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Unique</SelectItem>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Rappel {newSession.reminderMinutes} min avant</span>
              </div>
              <Switch
                checked={newSession.reminder}
                onCheckedChange={(v) => setNewSession(prev => ({ ...prev, reminder: v }))}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddSession} className="flex-1">
                <CalendarPlus className="h-4 w-4 mr-2" />
                Planifier
              </Button>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Annuler
              </Button>
            </div>
          </div>
        )}

        {/* Sessions à venir */}
        <div>
          <h4 className="font-medium mb-3 text-sm text-muted-foreground">
            À VENIR ({upcomingSessions.length})
          </h4>
          {upcomingSessions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Calendar className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>Aucune session planifiée</p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingSessions.map(session => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[50px]">
                      <div className="text-lg font-bold">
                        {session.datetime.getDate()}
                      </div>
                      <div className="text-xs text-muted-foreground uppercase">
                        {session.datetime.toLocaleDateString('fr-FR', { month: 'short' })}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {session.title}
                        {getRecurringBadge(session.recurring)}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {formatTime(session.datetime)} • {session.duration} min
                        {session.reminder && (
                          <>
                            <Bell className="h-3 w-3 ml-2" />
                            Rappel
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleComplete(session.id)}
                      title="Marquer comme fait"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteSession(session.id)}
                      title="Supprimer"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sessions passées */}
        {pastSessions.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 text-sm text-muted-foreground">
              HISTORIQUE ({pastSessions.length})
            </h4>
            <div className="space-y-2">
              {pastSessions.slice(0, 3).map(session => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 opacity-70"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      session.completed ? 'bg-green-500/20 text-green-600' : 'bg-muted'
                    }`}>
                      {session.completed ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{session.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(session.datetime)} à {formatTime(session.datetime)}
                      </div>
                    </div>
                  </div>
                  <Badge variant={session.completed ? 'default' : 'secondary'}>
                    {session.completed ? 'Complété' : 'Manqué'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Connexion calendrier externe */}
        <div className="p-4 rounded-lg border border-dashed">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CalendarPlus className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium text-sm">Synchroniser avec votre calendrier</div>
                <div className="text-xs text-muted-foreground">
                  Google Calendar, Apple Calendar, Outlook
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Connecter
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CoachCalendarIntegration.displayName = 'CoachCalendarIntegration';

export default CoachCalendarIntegration;
