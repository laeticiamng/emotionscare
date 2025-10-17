import { useState, useEffect } from 'react';
import { Plus, Trash2, Bell, BellOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { journalRemindersService, JournalReminder } from '@/services/journalReminders';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Dim' },
  { value: 1, label: 'Lun' },
  { value: 2, label: 'Mar' },
  { value: 3, label: 'Mer' },
  { value: 4, label: 'Jeu' },
  { value: 5, label: 'Ven' },
  { value: 6, label: 'Sam' },
];

/**
 * Liste et gestion des rappels de journal
 * Permet de créer, activer/désactiver et supprimer des rappels
 */
export function JournalRemindersList() {
  const { toast } = useToast();
  const [reminders, setReminders] = useState<JournalReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTime, setNewTime] = useState('09:00');
  const [newDays, setNewDays] = useState<number[]>([1, 2, 3, 4, 5]); // Lun-Ven par défaut
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      setLoading(true);
      const data = await journalRemindersService.getUserReminders();
      setReminders(data);
    } catch (error) {
      toast({
        title: 'Erreur de chargement',
        description: 'Impossible de charger vos rappels.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      if (newDays.length === 0) {
        toast({
          title: 'Jours requis',
          description: 'Sélectionnez au moins un jour pour le rappel.',
          variant: 'destructive',
        });
        return;
      }

      await journalRemindersService.createReminder({
        reminder_time: newTime,
        days_of_week: newDays,
        message: newMessage || undefined,
      });

      toast({
        title: 'Rappel créé',
        description: 'Votre nouveau rappel a été enregistré.',
      });

      setDialogOpen(false);
      setNewTime('09:00');
      setNewDays([1, 2, 3, 4, 5]);
      setNewMessage('');
      loadReminders();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le rappel.',
        variant: 'destructive',
      });
    }
  };

  const handleToggle = async (reminder: JournalReminder) => {
    try {
      await journalRemindersService.toggleReminder(reminder.id, !reminder.is_active);
      toast({
        title: reminder.is_active ? 'Rappel désactivé' : 'Rappel activé',
      });
      loadReminders();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le rappel.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await journalRemindersService.deleteReminder(id);
      toast({
        title: 'Rappel supprimé',
      });
      loadReminders();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le rappel.',
        variant: 'destructive',
      });
    }
  };

  const toggleDay = (day: number) => {
    setNewDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
    );
  };

  const formatDays = (days: number[]) => {
    return days
      .sort()
      .map(d => DAYS_OF_WEEK.find(dow => dow.value === d)?.label)
      .join(', ');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Rappels quotidiens</CardTitle>
            <CardDescription>
              Configurez des notifications pour maintenir votre pratique
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Nouveau rappel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un rappel</DialogTitle>
                <DialogDescription>
                  Définissez l'heure et les jours pour votre rappel de journaling
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Heure</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Jours de la semaine</Label>
                  <div className="flex gap-2">
                    {DAYS_OF_WEEK.map(day => (
                      <Button
                        key={day.value}
                        variant={newDays.includes(day.value) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleDay(day.value)}
                        className="flex-1"
                      >
                        {day.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message personnalisé (optionnel)</Label>
                  <Input
                    id="message"
                    placeholder="Prenez un moment pour vous..."
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    maxLength={100}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreate}>Créer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-center text-muted-foreground py-8">Chargement...</p>
        ) : reminders.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Aucun rappel configuré</p>
            <p className="text-sm text-muted-foreground">
              Créez votre premier rappel pour maintenir votre pratique quotidienne
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reminders.map(reminder => (
              <div
                key={reminder.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  {reminder.is_active ? (
                    <Bell className="h-5 w-5 text-primary" />
                  ) : (
                    <BellOff className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium">{reminder.reminder_time}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDays(reminder.days_of_week)}
                    </div>
                    {reminder.message && (
                      <div className="text-sm text-muted-foreground italic mt-1">
                        "{reminder.message}"
                      </div>
                    )}
                  </div>
                  <Badge variant={reminder.is_active ? 'default' : 'secondary'}>
                    {reminder.is_active ? 'Actif' : 'Inactif'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={reminder.is_active}
                    onCheckedChange={() => handleToggle(reminder)}
                    aria-label={reminder.is_active ? 'Désactiver' : 'Activer'}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(reminder.id)}
                    aria-label="Supprimer le rappel"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
