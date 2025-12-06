// @ts-nocheck
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Mail, Trash2, Plus, Power } from 'lucide-react';
import { useScheduledExports, type CreateScheduledExportInput } from '@/hooks/useScheduledExports';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function ScheduledExportsManager() {
  const { scheduledExports, isLoading, createScheduledExport, deleteScheduledExport, toggleActive } = useScheduledExports();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<CreateScheduledExportInput>({
    frequency: 'weekly',
    day_of_week: 1,
    time: '09:00:00',
    format: 'csv',
    admin_emails: [],
    is_active: true,
  });
  const [emailInput, setEmailInput] = useState('');

  const handleSubmit = () => {
    if (formData.admin_emails.length === 0) {
      alert('Veuillez ajouter au moins un email administrateur');
      return;
    }

    createScheduledExport(formData);
    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      frequency: 'weekly',
      day_of_week: 1,
      time: '09:00:00',
      format: 'csv',
      admin_emails: [],
      is_active: true,
    });
    setEmailInput('');
  };

  const addEmail = () => {
    if (emailInput && emailInput.includes('@')) {
      setFormData(prev => ({
        ...prev,
        admin_emails: [...prev.admin_emails, emailInput.trim()],
      }));
      setEmailInput('');
    }
  };

  const removeEmail = (email: string) => {
    setFormData(prev => ({
      ...prev,
      admin_emails: prev.admin_emails.filter(e => e !== email),
    }));
  };

  const getFrequencyLabel = (frequency: string) => {
    const labels = {
      daily: 'Quotidien',
      weekly: 'Hebdomadaire',
      monthly: 'Mensuel',
    };
    return labels[frequency] || frequency;
  };

  const getDayLabel = (frequency: string, dayOfWeek?: number | null, dayOfMonth?: number | null) => {
    if (frequency === 'weekly' && dayOfWeek !== null && dayOfWeek !== undefined) {
      const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
      return days[dayOfWeek];
    }
    if (frequency === 'monthly' && dayOfMonth) {
      return `Le ${dayOfMonth} du mois`;
    }
    return 'Tous les jours';
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Exports Planifiés</h2>
          <p className="text-muted-foreground">Configurez des exports automatiques de rapports RGPD</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Export
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un Export Planifié</DialogTitle>
              <DialogDescription>
                Configurez un export automatique de rapport RGPD
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Fréquence</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Quotidien</SelectItem>
                    <SelectItem value="weekly">Hebdomadaire</SelectItem>
                    <SelectItem value="monthly">Mensuel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.frequency === 'weekly' && (
                <div className="space-y-2">
                  <Label>Jour de la semaine</Label>
                  <Select
                    value={formData.day_of_week?.toString()}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, day_of_week: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Lundi</SelectItem>
                      <SelectItem value="2">Mardi</SelectItem>
                      <SelectItem value="3">Mercredi</SelectItem>
                      <SelectItem value="4">Jeudi</SelectItem>
                      <SelectItem value="5">Vendredi</SelectItem>
                      <SelectItem value="6">Samedi</SelectItem>
                      <SelectItem value="0">Dimanche</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.frequency === 'monthly' && (
                <div className="space-y-2">
                  <Label>Jour du mois</Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.day_of_month || 1}
                    onChange={(e) => setFormData(prev => ({ ...prev, day_of_month: parseInt(e.target.value) }))}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Heure d'exécution</Label>
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value + ':00' }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Format</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value: any) => setFormData(prev => ({ ...prev, format: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Emails administrateurs</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addEmail())}
                  />
                  <Button type="button" onClick={addEmail}>Ajouter</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.admin_emails.map((email) => (
                    <Badge key={email} variant="secondary" className="gap-1">
                      {email}
                      <button onClick={() => removeEmail(email)} className="ml-1">×</button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {scheduledExports?.map((schedule) => (
          <Card key={schedule.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {getFrequencyLabel(schedule.frequency)}
                  </CardTitle>
                  <CardDescription>
                    {getDayLabel(schedule.frequency, schedule.day_of_week, schedule.day_of_month)} à {schedule.time.slice(0, 5)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={schedule.is_active}
                    onCheckedChange={(checked) => toggleActive({ id: schedule.id, is_active: checked })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteScheduledExport(schedule.id)}
                    aria-label="Supprimer l'export planifié"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                  {schedule.is_active ? 'Actif' : 'Inactif'}
                </Badge>
                <Badge variant="outline">{schedule.format.toUpperCase()}</Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{schedule.admin_emails.length} destinataire(s)</span>
                </div>
                {schedule.last_run_at && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>
                      Dernier: {format(new Date(schedule.last_run_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </span>
                  </div>
                )}
                {schedule.next_run_at && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Power className="w-4 h-4" />
                    <span>
                      Prochain: {format(new Date(schedule.next_run_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {scheduledExports?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Aucun export planifié</h3>
            <p className="text-muted-foreground mb-4">
              Créez votre premier export automatique pour recevoir des rapports RGPD par email
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Créer un Export
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
