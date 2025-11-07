// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, Clock, Plus, Trash2, Edit, Bell, AlertTriangle,
  CheckCircle, XCircle, TrendingDown
} from 'lucide-react';
import { useScheduledAudits } from '@/hooks/useScheduledAudits';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea';

const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Quotidien' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuel' },
];

const WEEKDAYS = [
  { value: 0, label: 'Dimanche' },
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
];

const SEVERITY_CONFIG = {
  critical: { color: 'bg-red-500', icon: XCircle },
  warning: { color: 'bg-yellow-500', icon: AlertTriangle },
  info: { color: 'bg-blue-500', icon: Bell },
};

export const ScheduledAuditsManager = () => {
  const {
    schedules,
    alerts,
    isLoading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    markAlertRead,
    isUpdating,
  } = useScheduledAudits();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    frequency: 'weekly',
    day_of_week: 1,
    day_of_month: 1,
    time_of_day: '02:00:00',
    is_active: true,
    alert_threshold: 75,
    alert_recipients: '',
  });

  const handleSubmit = async () => {
    try {
      const recipients = formData.alert_recipients
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0);

      const scheduleData = {
        ...formData,
        alert_recipients: recipients,
      };

      if (editingSchedule) {
        await updateSchedule({ id: editingSchedule.id, ...scheduleData });
      } else {
        await createSchedule(scheduleData);
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      frequency: 'weekly',
      day_of_week: 1,
      day_of_month: 1,
      time_of_day: '02:00:00',
      is_active: true,
      alert_threshold: 75,
      alert_recipients: '',
    });
    setEditingSchedule(null);
  };

  const handleEdit = (schedule: any) => {
    setEditingSchedule(schedule);
    setFormData({
      name: schedule.name,
      frequency: schedule.frequency,
      day_of_week: schedule.day_of_week || 1,
      day_of_month: schedule.day_of_month || 1,
      time_of_day: schedule.time_of_day,
      is_active: schedule.is_active,
      alert_threshold: schedule.alert_threshold || 75,
      alert_recipients: (schedule.alert_recipients || []).join(', '),
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-60">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const unreadAlerts = alerts.filter(a => !a.is_sent);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="schedules" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="schedules">Planifications</TabsTrigger>
          <TabsTrigger value="alerts">
            Alertes
            {unreadAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Configurez des audits automatiques pour surveiller la conformité en continu
            </p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle planification
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSchedule ? 'Modifier' : 'Créer'} une planification
                  </DialogTitle>
                  <DialogDescription>
                    Configurez l'exécution automatique des audits RGPD
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Audit hebdomadaire"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency">Fréquence</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCY_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.frequency === 'weekly' && (
                    <div className="space-y-2">
                      <Label htmlFor="day_of_week">Jour de la semaine</Label>
                      <Select
                        value={formData.day_of_week.toString()}
                        onValueChange={(value) => setFormData({ ...formData, day_of_week: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {WEEKDAYS.map(day => (
                            <SelectItem key={day.value} value={day.value.toString()}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {formData.frequency === 'monthly' && (
                    <div className="space-y-2">
                      <Label htmlFor="day_of_month">Jour du mois</Label>
                      <Input
                        id="day_of_month"
                        type="number"
                        min="1"
                        max="31"
                        value={formData.day_of_month}
                        onChange={(e) => setFormData({ ...formData, day_of_month: parseInt(e.target.value) })}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="time">Heure d'exécution</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time_of_day}
                      onChange={(e) => setFormData({ ...formData, time_of_day: e.target.value + ':00' })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="threshold">Seuil d'alerte (score)</Label>
                    <Input
                      id="threshold"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.alert_threshold}
                      onChange={(e) => setFormData({ ...formData, alert_threshold: parseFloat(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Une alerte sera générée si le score passe sous ce seuil
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipients">Emails de notification (séparés par des virgules)</Label>
                    <Textarea
                      id="recipients"
                      value={formData.alert_recipients}
                      onChange={(e) => setFormData({ ...formData, alert_recipients: e.target.value })}
                      placeholder="admin@example.com, dpo@example.com"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label htmlFor="active">Actif</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSubmit} disabled={isUpdating}>
                    {editingSchedule ? 'Mettre à jour' : 'Créer'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {schedules.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Aucune planification</h3>
                  <p className="text-muted-foreground mb-6">
                    Créez une planification pour automatiser vos audits
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            schedules.map(schedule => (
              <Card key={schedule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{schedule.name}</CardTitle>
                        <CardDescription>
                          {FREQUENCY_OPTIONS.find(f => f.value === schedule.frequency)?.label}
                          {schedule.frequency === 'weekly' && ` - ${WEEKDAYS.find(d => d.value === schedule.day_of_week)?.label}`}
                          {schedule.frequency === 'monthly' && ` - Jour ${schedule.day_of_month}`}
                          {' à '}{schedule.time_of_day.substring(0, 5)}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                        {schedule.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(schedule)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteSchedule(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {schedule.last_run_at && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Dernier audit : {format(new Date(schedule.last_run_at), 'Pp', { locale: fr })}
                      </span>
                    </div>
                  )}
                  {schedule.next_run_at && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">
                        Prochain audit : {format(new Date(schedule.next_run_at), 'Pp', { locale: fr })}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Alerte si score {'<'} {schedule.alert_threshold}
                    </span>
                  </div>
                  {schedule.alert_recipients && schedule.alert_recipients.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {schedule.alert_recipients.map((email: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {email}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="alerts">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {alerts.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                      <p className="text-lg font-medium">Aucune alerte</p>
                      <p className="text-muted-foreground">Tout est sous contrôle</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                alerts.map(alert => {
                  const config = SEVERITY_CONFIG[alert.severity];
                  const Icon = config.icon;

                  return (
                    <Card key={alert.id} className={!alert.is_sent ? 'border-l-4 border-l-primary' : ''}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${config.color}/10`}>
                              <Icon className={`h-5 w-5 ${config.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{alert.title}</CardTitle>
                              <CardDescription>{alert.message}</CardDescription>
                              <p className="text-xs text-muted-foreground mt-2">
                                {format(new Date(alert.created_at), 'Pp', { locale: fr })}
                              </p>
                            </div>
                          </div>
                          {!alert.is_sent && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => markAlertRead(alert.id)}
                            >
                              Marquer comme lu
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      {alert.score_drop && (
                        <CardContent>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <TrendingDown className="h-4 w-4 text-red-500" />
                              <span>Baisse : {alert.score_drop.toFixed(1)} points</span>
                            </div>
                            <div className="text-muted-foreground">
                              {alert.previous_score?.toFixed(1)} → {alert.current_score?.toFixed(1)}
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
