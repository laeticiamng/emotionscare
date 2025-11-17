import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, Plus, Trash2, Edit, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ScheduledReport {
  id: string;
  name: string;
  description: string | null;
  recipient_emails: string[];
  frequency: string;
  day_of_week: number | null;
  day_of_month: number | null;
  time_of_day: string;
  timezone: string;
  include_charts: boolean;
  date_range_days: number;
  format: string;
  is_active: boolean;
  last_sent_at: string | null;
  created_at: string;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Dimanche' },
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
];

export default function ScheduledReportsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    recipient_emails: '',
    frequency: 'weekly',
    day_of_week: 1,
    day_of_month: 1,
    time_of_day: '09:00',
    timezone: 'Europe/Paris',
    include_charts: true,
    date_range_days: 7,
    format: 'pdf',
    is_active: true,
  });

  const { data: reports, isLoading } = useQuery({
    queryKey: ['scheduled-reports'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ScheduledReport[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { error } = await supabase.from('scheduled_reports').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-reports'] });
      toast.success('Rapport programmé créé avec succès');
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error('Erreur lors de la création: ' + (error as Error).message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { error } = await supabase
        .from('scheduled_reports')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-reports'] });
      toast.success('Rapport programmé mis à jour');
      setIsDialogOpen(false);
      setEditingReport(null);
      resetForm();
    },
    onError: (error) => {
      toast.error('Erreur lors de la mise à jour: ' + (error as Error).message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scheduled_reports')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-reports'] });
      toast.success('Rapport programmé supprimé');
    },
    onError: (error) => {
      toast.error('Erreur lors de la suppression: ' + (error as Error).message);
    },
  });

  const testReportMutation = useMutation({
    mutationFn: async (report: ScheduledReport) => {
      const { data, error } = await supabase.functions.invoke('generate-analytics-report', {
        body: {
          dateRangeDays: report.date_range_days,
          format: report.format,
          includeCharts: report.include_charts,
          recipientEmails: report.recipient_emails,
        },
      });
      if (error) throw error;
      if (!data.success) throw new Error(data.error);
    },
    onSuccess: () => {
      toast.success('Rapport de test envoyé avec succès');
    },
    onError: (error) => {
      toast.error('Erreur lors de l\'envoi: ' + (error as Error).message);
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      recipient_emails: '',
      frequency: 'weekly',
      day_of_week: 1,
      day_of_month: 1,
      time_of_day: '09:00',
      timezone: 'Europe/Paris',
      include_charts: true,
      date_range_days: 7,
      format: 'pdf',
      is_active: true,
    });
    setEditingReport(null);
  };

  const handleEdit = (report: ScheduledReport) => {
    setEditingReport(report);
    setFormData({
      name: report.name,
      description: report.description || '',
      recipient_emails: report.recipient_emails.join(', '),
      frequency: report.frequency,
      day_of_week: report.day_of_week || 1,
      day_of_month: report.day_of_month || 1,
      time_of_day: report.time_of_day,
      timezone: report.timezone,
      include_charts: report.include_charts,
      date_range_days: report.date_range_days,
      format: report.format,
      is_active: report.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const emails = formData.recipient_emails
      .split(',')
      .map(email => email.trim())
      .filter(email => email);

    if (emails.length === 0) {
      toast.error('Au moins une adresse email est requise');
      return;
    }

    const reportData = {
      name: formData.name,
      description: formData.description || null,
      recipient_emails: emails,
      frequency: formData.frequency,
      day_of_week: formData.frequency === 'weekly' ? formData.day_of_week : null,
      day_of_month: formData.frequency === 'monthly' ? formData.day_of_month : null,
      time_of_day: formData.time_of_day,
      timezone: formData.timezone,
      include_charts: formData.include_charts,
      date_range_days: formData.date_range_days,
      format: formData.format,
      is_active: formData.is_active,
    };

    if (editingReport) {
      updateMutation.mutate({ id: editingReport.id, data: reportData });
    } else {
      createMutation.mutate(reportData);
    }
  };

  const handleDeleteClick = (reportId: string) => {
    setReportToDelete(reportId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (reportToDelete) {
      deleteMutation.mutate(reportToDelete);
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Rapports Programmés</h1>
          <p className="text-muted-foreground mt-2">
            Configurez des rapports analytics automatiques envoyés par email
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau rapport
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingReport ? 'Modifier le rapport' : 'Créer un rapport programmé'}
              </DialogTitle>
              <DialogDescription>
                Configurez un rapport analytics automatique envoyé par email selon un planning défini
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du rapport *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Rapport hebdomadaire des alertes"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description optionnelle du rapport"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emails">Destinataires (emails séparés par virgule) *</Label>
                <Textarea
                  id="emails"
                  value={formData.recipient_emails}
                  onChange={(e) => setFormData({ ...formData, recipient_emails: e.target.value })}
                  placeholder="admin@example.com, manager@example.com"
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Fréquence *</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
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
                    <Label htmlFor="day_of_week">Jour de la semaine</Label>
                    <Select
                      value={formData.day_of_week.toString()}
                      onValueChange={(value) =>
                        setFormData({ ...formData, day_of_week: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
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
                      onChange={(e) =>
                        setFormData({ ...formData, day_of_month: parseInt(e.target.value) })
                      }
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Heure d'envoi</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time_of_day}
                    onChange={(e) => setFormData({ ...formData, time_of_day: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select
                    value={formData.format}
                    onValueChange={(value) => setFormData({ ...formData, format: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="both">PDF + CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_range">Période (jours)</Label>
                  <Input
                    id="date_range"
                    type="number"
                    min="1"
                    max="365"
                    value={formData.date_range_days}
                    onChange={(e) =>
                      setFormData({ ...formData, date_range_days: parseInt(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="include_charts"
                  checked={formData.include_charts}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, include_charts: checked })
                  }
                />
                <Label htmlFor="include_charts">Inclure les graphiques</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Actif</Label>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {editingReport ? 'Mettre à jour' : 'Créer'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des rapports programmés</CardTitle>
          <CardDescription>
            {reports?.length || 0} rapport(s) configuré(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : reports && reports.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Fréquence</TableHead>
                  <TableHead>Destinataires</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Dernier envoi</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{report.name}</div>
                        {report.description && (
                          <div className="text-sm text-muted-foreground">
                            {report.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {report.frequency === 'daily' && 'Quotidien'}
                        {report.frequency === 'weekly' && 
                          `${DAYS_OF_WEEK.find(d => d.value === report.day_of_week)?.label}`}
                        {report.frequency === 'monthly' && `Le ${report.day_of_month}`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {report.recipient_emails.length}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{report.format.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell>
                      {report.last_sent_at ? (
                        <div className="text-sm">
                          {format(new Date(report.last_sent_at), 'dd MMM yyyy HH:mm', {
                            locale: fr,
                          })}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Jamais</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={report.is_active ? 'default' : 'secondary'}>
                        {report.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => testReportMutation.mutate(report)}
                          disabled={testReportMutation.isPending}
                        >
                          <PlayCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(report)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(report.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucun rapport programmé. Créez-en un pour commencer.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce rapport programmé ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setReportToDelete(null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
