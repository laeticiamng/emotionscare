// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Calendar,
  Clock,
  Mail,
  Plus,
  Trash2,
  Edit,
  Play,
  Pause,
  FileText,
  Bell,
  Users,
  BarChart3,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
  isActive: boolean;
  lastRun?: string;
  nextRun: string;
  createdAt: string;
}

interface ScheduleConfig {
  name: string;
  reportType: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  dayOfWeek: number;
  dayOfMonth: number;
  time: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
}

const defaultSchedule: ScheduleConfig = {
  name: '',
  reportType: 'wellbeing',
  frequency: 'weekly',
  dayOfWeek: 1,
  dayOfMonth: 1,
  time: '09:00',
  recipients: [],
  format: 'pdf',
};

const reportTypes = [
  { value: 'wellbeing', label: 'Bien-tre gnral', icon: '❤️' },
  { value: 'productivity', label: 'Productivit', icon: '📈' },
  { value: 'engagement', label: 'Engagement', icon: '👥' },
  { value: 'emotional', label: 'Analyse motionnelle', icon: '🧠' },
  { value: 'activity', label: 'Activit utilisateurs', icon: '📊' },
  { value: 'compliance', label: 'Conformit RGPD', icon: '🔒' },
];

const frequencies = [
  { value: 'daily', label: 'Quotidien' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuel' },
  { value: 'quarterly', label: 'Trimestriel' },
];

const daysOfWeek = [
  { value: 0, label: 'Dimanche' },
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
];

const formats = [
  { value: 'pdf', label: 'PDF' },
  { value: 'excel', label: 'Excel' },
  { value: 'csv', label: 'CSV' },
];

export const ScheduledReports: React.FC = () => {
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Rapport hebdomadaire bien-tre',
      reportType: 'wellbeing',
      frequency: 'weekly',
      dayOfWeek: 1,
      time: '09:00',
      recipients: ['hr@company.com', 'manager@company.com'],
      format: 'pdf',
      isActive: true,
      lastRun: '2024-11-18T09:00:00',
      nextRun: '2024-11-25T09:00:00',
      createdAt: '2024-10-01T10:00:00',
    },
    {
      id: '2',
      name: 'Rapport mensuel productivit',
      reportType: 'productivity',
      frequency: 'monthly',
      dayOfMonth: 1,
      time: '08:00',
      recipients: ['direction@company.com'],
      format: 'excel',
      isActive: true,
      lastRun: '2024-11-01T08:00:00',
      nextRun: '2024-12-01T08:00:00',
      createdAt: '2024-09-15T14:30:00',
    },
    {
      id: '3',
      name: 'Rapport RGPD trimestriel',
      reportType: 'compliance',
      frequency: 'quarterly',
      dayOfMonth: 1,
      time: '10:00',
      recipients: ['dpo@company.com', 'legal@company.com'],
      format: 'pdf',
      isActive: false,
      lastRun: '2024-10-01T10:00:00',
      nextRun: '2025-01-01T10:00:00',
      createdAt: '2024-07-01T09:00:00',
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledReport | null>(null);
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>(defaultSchedule);
  const [newRecipient, setNewRecipient] = useState('');

  const handleOpenDialog = (schedule?: ScheduledReport) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setScheduleConfig({
        name: schedule.name,
        reportType: schedule.reportType,
        frequency: schedule.frequency,
        dayOfWeek: schedule.dayOfWeek || 1,
        dayOfMonth: schedule.dayOfMonth || 1,
        time: schedule.time,
        recipients: [...schedule.recipients],
        format: schedule.format,
      });
    } else {
      setEditingSchedule(null);
      setScheduleConfig(defaultSchedule);
    }
    setIsDialogOpen(true);
  };

  const handleAddRecipient = () => {
    const email = newRecipient.trim().toLowerCase();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (!scheduleConfig.recipients.includes(email)) {
        setScheduleConfig((prev) => ({
          ...prev,
          recipients: [...prev.recipients, email],
        }));
      }
      setNewRecipient('');
    } else {
      toast({
        title: 'Email invalide',
        description: 'Veuillez entrer une adresse email valide.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveRecipient = (email: string) => {
    setScheduleConfig((prev) => ({
      ...prev,
      recipients: prev.recipients.filter((r) => r !== email),
    }));
  };

  const calculateNextRun = (config: ScheduleConfig): string => {
    const now = new Date();
    const [hours, minutes] = config.time.split(':').map(Number);

    let nextRun = new Date();
    nextRun.setHours(hours, minutes, 0, 0);

    if (nextRun <= now) {
      switch (config.frequency) {
        case 'daily':
          nextRun.setDate(nextRun.getDate() + 1);
          break;
        case 'weekly':
          const daysUntilTarget = (config.dayOfWeek - now.getDay() + 7) % 7 || 7;
          nextRun.setDate(nextRun.getDate() + daysUntilTarget);
          break;
        case 'monthly':
          nextRun.setMonth(nextRun.getMonth() + 1);
          nextRun.setDate(config.dayOfMonth);
          break;
        case 'quarterly':
          nextRun.setMonth(nextRun.getMonth() + 3);
          nextRun.setDate(config.dayOfMonth);
          break;
      }
    }

    return nextRun.toISOString();
  };

  const handleSaveSchedule = () => {
    if (!scheduleConfig.name) {
      toast({
        title: 'Nom requis',
        description: 'Veuillez donner un nom  la planification.',
        variant: 'destructive',
      });
      return;
    }

    if (scheduleConfig.recipients.length === 0) {
      toast({
        title: 'Destinataires requis',
        description: 'Ajoutez au moins un destinataire.',
        variant: 'destructive',
      });
      return;
    }

    const nextRun = calculateNextRun(scheduleConfig);

    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingSchedule.id
            ? {
                ...s,
                ...scheduleConfig,
                nextRun,
              }
            : s
        )
      );
      toast({
        title: 'Planification mise  jour',
        description: `La planification "${scheduleConfig.name}" a t modifie.`,
      });
    } else {
      const newSchedule: ScheduledReport = {
        id: `schedule-${Date.now()}`,
        ...scheduleConfig,
        isActive: true,
        nextRun,
        createdAt: new Date().toISOString(),
      };
      setSchedules((prev) => [...prev, newSchedule]);
      toast({
        title: 'Planification cre',
        description: `La planification "${scheduleConfig.name}" a t cre.`,
      });
    }

    setIsDialogOpen(false);
    logger.info('Schedule saved', { scheduleConfig }, 'REPORTS');
  };

  const handleToggleActive = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    toast({
      title: 'Planification supprime',
      description: 'La planification a t supprime.',
    });
  };

  const handleRunNow = (schedule: ScheduledReport) => {
    toast({
      title: 'Rapport en cours de gnration',
      description: `Le rapport "${schedule.name}" sera envoy sous peu.`,
    });
    logger.info('Manual report triggered', { scheduleId: schedule.id }, 'REPORTS');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFrequencyLabel = (schedule: ScheduledReport): string => {
    switch (schedule.frequency) {
      case 'daily':
        return `Tous les jours  ${schedule.time}`;
      case 'weekly':
        const day = daysOfWeek.find((d) => d.value === schedule.dayOfWeek)?.label || '';
        return `Chaque ${day}  ${schedule.time}`;
      case 'monthly':
        return `Le ${schedule.dayOfMonth} de chaque mois  ${schedule.time}`;
      case 'quarterly':
        return `Le ${schedule.dayOfMonth} chaque trimestre  ${schedule.time}`;
      default:
        return schedule.time;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rapports Planifis</h2>
          <p className="text-muted-foreground">
            Configurez l'envoi automatique de rapports par email
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle planification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Modifier la planification' : 'Nouvelle planification'}
              </DialogTitle>
              <DialogDescription>
                Configurez l'envoi automatique d'un rapport
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-name">Nom de la planification</Label>
                <Input
                  id="schedule-name"
                  placeholder="Ex: Rapport hebdomadaire RH"
                  value={scheduleConfig.name}
                  onChange={(e) =>
                    setScheduleConfig((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de rapport</Label>
                  <Select
                    value={scheduleConfig.reportType}
                    onValueChange={(value) =>
                      setScheduleConfig((prev) => ({ ...prev, reportType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <span className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            {type.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select
                    value={scheduleConfig.format}
                    onValueChange={(value: any) =>
                      setScheduleConfig((prev) => ({ ...prev, format: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Frquence</Label>
                  <Select
                    value={scheduleConfig.frequency}
                    onValueChange={(value: any) =>
                      setScheduleConfig((prev) => ({ ...prev, frequency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Heure d'envoi</Label>
                  <Input
                    type="time"
                    value={scheduleConfig.time}
                    onChange={(e) =>
                      setScheduleConfig((prev) => ({ ...prev, time: e.target.value }))
                    }
                  />
                </div>
              </div>

              {scheduleConfig.frequency === 'weekly' && (
                <div className="space-y-2">
                  <Label>Jour de la semaine</Label>
                  <Select
                    value={scheduleConfig.dayOfWeek.toString()}
                    onValueChange={(value) =>
                      setScheduleConfig((prev) => ({
                        ...prev,
                        dayOfWeek: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day.value} value={day.value.toString()}>
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(scheduleConfig.frequency === 'monthly' ||
                scheduleConfig.frequency === 'quarterly') && (
                <div className="space-y-2">
                  <Label>Jour du mois</Label>
                  <Select
                    value={scheduleConfig.dayOfMonth.toString()}
                    onValueChange={(value) =>
                      setScheduleConfig((prev) => ({
                        ...prev,
                        dayOfMonth: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Destinataires</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="email@exemple.com"
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddRecipient()}
                  />
                  <Button variant="outline" onClick={handleAddRecipient}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <AnimatePresence>
                    {scheduleConfig.recipients.map((email) => (
                      <motion.div
                        key={email}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <Badge
                          variant="secondary"
                          className="cursor-pointer hover:bg-destructive/20"
                          onClick={() => handleRemoveRecipient(email)}
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          {email}
                          <Trash2 className="h-3 w-3 ml-1" />
                        </Badge>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveSchedule}>
                {editingSchedule ? 'Mettre  jour' : 'Crer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{schedules.length}</p>
                <p className="text-sm text-muted-foreground">Planifications</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {schedules.filter((s) => s.isActive).length}
                </p>
                <p className="text-sm text-muted-foreground">Actives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Users className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(schedules.flatMap((s) => s.recipients)).size}
                </p>
                <p className="text-sm text-muted-foreground">Destinataires</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-info/10">
                <BarChart3 className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(schedules.map((s) => s.reportType)).size}
                </p>
                <p className="text-sm text-muted-foreground">Types de rapports</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Planifications actives
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune planification configure</p>
              <p className="text-sm">
                Crez une planification pour automatiser l'envoi de rapports
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Frquence</TableHead>
                  <TableHead>Destinataires</TableHead>
                  <TableHead>Prochain envoi</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {schedules.map((schedule) => {
                    const reportType = reportTypes.find(
                      (t) => t.value === schedule.reportType
                    );
                    return (
                      <motion.tr
                        key={schedule.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="group"
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            {schedule.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {reportType?.icon} {reportType?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {getFrequencyLabel(schedule)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {schedule.recipients.length}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(schedule.nextRun)}
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={schedule.isActive}
                            onCheckedChange={() => handleToggleActive(schedule.id)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRunNow(schedule)}
                              title="Excuter maintenant"
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenDialog(schedule)}
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduledReports;
