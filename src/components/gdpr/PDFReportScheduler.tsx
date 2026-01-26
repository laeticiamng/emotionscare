// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { usePDFReportHistory } from '@/hooks/usePDFReportHistory';
import { logger } from '@/lib/logger';
import { 
  Clock, 
  Plus, 
  Trash2, 
  Mail, 
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

const CRON_PRESETS = {
  daily: { cron: '0 9 * * *', label: 'Quotidien (9h)' },
  weekly_monday: { cron: '0 9 * * 1', label: 'Hebdomadaire (Lundi 9h)' },
  monthly: { cron: '0 9 1 * *', label: 'Mensuel (1er du mois 9h)' },
};

export const PDFReportScheduler: React.FC = () => {
  const { schedules, createSchedule, updateSchedule, deleteSchedule } = usePDFReportHistory();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);

  const [formData, setFormData] = useState({
    report_type: 'audit' as 'audit' | 'violations' | 'dsar' | 'full',
    recipient_emails: [''],
    schedule_cron: CRON_PRESETS.weekly_monday.cron,
    is_active: true,
    options: {
      includeGraphs: true,
      includeRecommendations: true,
      includeCategoryDetails: true,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validEmails = formData.recipient_emails.filter(email => email.trim() !== '');
    if (validEmails.length === 0) {
      return;
    }

    const scheduleData = {
      ...formData,
      recipient_emails: validEmails,
      next_run_at: calculateNextRun(formData.schedule_cron),
    };

    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, scheduleData);
      } else {
        await createSchedule(scheduleData);
      }
      
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      logger.error('Error saving schedule:', error, 'COMPONENT');
    }
  };

  const resetForm = () => {
    setFormData({
      report_type: 'audit',
      recipient_emails: [''],
      schedule_cron: CRON_PRESETS.weekly_monday.cron,
      is_active: true,
      options: {
        includeGraphs: true,
        includeRecommendations: true,
        includeCategoryDetails: true,
      },
    });
    setEditingSchedule(null);
  };

  const addEmailField = () => {
    setFormData(prev => ({
      ...prev,
      recipient_emails: [...prev.recipient_emails, ''],
    }));
  };

  const removeEmailField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      recipient_emails: prev.recipient_emails.filter((_, i) => i !== index),
    }));
  };

  const updateEmail = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      recipient_emails: prev.recipient_emails.map((email, i) => i === index ? value : email),
    }));
  };

  const toggleScheduleActive = async (scheduleId: string, isActive: boolean) => {
    await updateSchedule(scheduleId, { is_active: !isActive });
  };

  const getScheduleLabel = (cron: string) => {
    const preset = Object.values(CRON_PRESETS).find(p => p.cron === cron);
    return preset?.label || 'Personnalisé';
  };

  const getNextRunLabel = (nextRun: string | null) => {
    if (!nextRun) return 'Non planifié';
    const date = new Date(nextRun);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 1) return `Dans ${diffDays} jours`;
    if (diffHours > 1) return `Dans ${diffHours}h`;
    if (diffMs > 0) return 'Bientôt';
    return 'Planifié';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Rapports Planifiés
              </CardTitle>
              <CardDescription>
                Configurez l'envoi automatique de rapports PDF par email
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={resetForm}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle planification
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSchedule ? 'Modifier la planification' : 'Créer une planification'}
                  </DialogTitle>
                  <DialogDescription>
                    Les rapports seront générés et envoyés automatiquement selon le planning défini
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Type de rapport</Label>
                        <Select
                          value={formData.report_type}
                          onValueChange={(value: any) => setFormData(prev => ({ ...prev, report_type: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="audit">Audit de conformité</SelectItem>
                            <SelectItem value="violations">Violations RGPD</SelectItem>
                            <SelectItem value="dsar">Demandes DSAR</SelectItem>
                            <SelectItem value="full">Rapport complet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Fréquence</Label>
                        <Select
                          value={formData.schedule_cron}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, schedule_cron: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={CRON_PRESETS.daily.cron}>{CRON_PRESETS.daily.label}</SelectItem>
                            <SelectItem value={CRON_PRESETS.weekly_monday.cron}>
                              {CRON_PRESETS.weekly_monday.label}
                            </SelectItem>
                            <SelectItem value={CRON_PRESETS.monthly.cron}>{CRON_PRESETS.monthly.label}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Destinataires
                      </Label>
                      <ScrollArea className="h-[120px] rounded-md border p-3">
                        <div className="space-y-2">
                          {formData.recipient_emails.map((email, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                type="email"
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => updateEmail(index, e.target.value)}
                                required
                              />
                              {formData.recipient_emails.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeEmailField(index)}
                                  aria-label="Supprimer l'email"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <Button type="button" variant="outline" size="sm" onClick={addEmailField}>
                        <Plus className="h-3 w-3 mr-1" />
                        Ajouter un destinataire
                      </Button>
                    </div>

                    <div className="space-y-3 rounded-lg border p-4 bg-muted/50">
                      <Label className="text-sm font-semibold">Options du rapport</Label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="graphs" className="text-sm font-normal">Inclure les graphiques</Label>
                          <Switch
                            id="graphs"
                            checked={formData.options.includeGraphs}
                            onCheckedChange={(checked) =>
                              setFormData(prev => ({
                                ...prev,
                                options: { ...prev.options, includeGraphs: checked },
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="recommendations" className="text-sm font-normal">
                            Inclure les recommandations
                          </Label>
                          <Switch
                            id="recommendations"
                            checked={formData.options.includeRecommendations}
                            onCheckedChange={(checked) =>
                              setFormData(prev => ({
                                ...prev,
                                options: { ...prev.options, includeRecommendations: checked },
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="details" className="text-sm font-normal">Détails par catégorie</Label>
                          <Switch
                            id="details"
                            checked={formData.options.includeCategoryDetails}
                            onCheckedChange={(checked) =>
                              setFormData(prev => ({
                                ...prev,
                                options: { ...prev.options, includeCategoryDetails: checked },
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit">
                      {editingSchedule ? 'Mettre à jour' : 'Créer la planification'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune planification configurée</p>
              <p className="text-sm mt-1">Créez votre première planification pour automatiser vos rapports</p>
            </div>
          ) : (
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <Card key={schedule.id} className="transition-colors hover:bg-accent/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant={schedule.is_active ? 'default' : 'secondary'}>
                            {schedule.is_active ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Actif
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Inactif
                              </>
                            )}
                          </Badge>
                          <Badge variant="outline">{schedule.report_type}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {getScheduleLabel(schedule.schedule_cron)}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {schedule.recipient_emails.length} destinataire(s)
                          </span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Prochain: {getNextRunLabel(schedule.next_run_at)}
                          </span>
                          {schedule.last_run_at && (
                            <span className="text-muted-foreground">
                              Dernier: {new Date(schedule.last_run_at).toLocaleDateString('fr-FR')}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {schedule.recipient_emails.map((email, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {email}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          checked={schedule.is_active}
                          onCheckedChange={() => toggleScheduleActive(schedule.id, schedule.is_active)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSchedule(schedule.id)}
                          aria-label="Supprimer la planification"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

function calculateNextRun(cronExpression: string): string {
  const now = new Date();
  const next = new Date(now);
  
  if (cronExpression === '0 9 * * *') {
    next.setDate(next.getDate() + 1);
    next.setHours(9, 0, 0, 0);
  } else if (cronExpression === '0 9 * * 1') {
    const daysUntilMonday = (8 - next.getDay()) % 7 || 7;
    next.setDate(next.getDate() + daysUntilMonday);
    next.setHours(9, 0, 0, 0);
  } else if (cronExpression === '0 9 1 * *') {
    next.setMonth(next.getMonth() + 1, 1);
    next.setHours(9, 0, 0, 0);
  } else {
    next.setDate(next.getDate() + 1);
  }
  
  return next.toISOString();
}