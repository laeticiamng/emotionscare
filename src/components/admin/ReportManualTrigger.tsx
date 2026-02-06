import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, Eye, Calendar, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateReportHTML, generateReportPreview, type ReportData } from '@/services/reportTemplateService';
import { logger } from '@/lib/logger';

export function ReportManualTrigger() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [previewMode, setPreviewMode] = useState<'text' | 'html'>('text');
  const [recipientEmails, setRecipientEmails] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const fetchReportData = async () => {
    setIsGeneratingPreview(true);
    try {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);

      // Récupérer les logs d'audit
      const { data: auditLogs, error: auditError } = await supabase
        .from('role_audit_logs')
        .select('*')
        .gte('changed_at', startDate.toISOString())
        .lte('changed_at', endDate.toISOString());

      if (auditError) throw auditError;

      // Récupérer les alertes de sécurité
      const { data: alerts, error: alertsError } = await supabase
        .from('security_alerts')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (alertsError) throw alertsError;

      // Analyser les données
      const changesByAction: Record<string, number> = {};
      const alertsBySeverity: Record<string, number> = {};
      const adminActivity: Record<string, number> = {};

      auditLogs?.forEach((log) => {
        const action = log.action || 'unknown';
        changesByAction[action] = (changesByAction[action] || 0) + 1;

        const adminEmail = log.changed_by_email || 'unknown';
        adminActivity[adminEmail] = (adminActivity[adminEmail] || 0) + 1;
      });

      alerts?.forEach((alert) => {
        const severity = alert.severity || 'unknown';
        alertsBySeverity[severity] = (alertsBySeverity[severity] || 0) + 1;
      });

      const topAdmins = Object.entries(adminActivity)
        .map(([email, count]) => ({ email, count }))
        .sort((a, b) => b.count - a.count);

      const data: ReportData = {
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        stats: {
          totalChanges: auditLogs?.length || 0,
          totalAlerts: alerts?.length || 0,
          criticalAlerts: alerts?.filter((a) => a.severity === 'critical').length || 0,
          changesByAction,
          alertsBySeverity,
        },
        topAdmins,
      };

      setReportData(data);
      toast({
        title: 'Prévisualisation générée',
        description: 'Le rapport a été généré avec succès',
      });
    } catch (error: unknown) {
      logger.error('Erreur génération rapport', error instanceof Error ? error : new Error(String(error)), 'SYSTEM');
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de générer la prévisualisation',
        variant: 'destructive',
      });
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const sendReport = async () => {
    if (!reportData) {
      toast({
        title: 'Erreur',
        description: 'Veuillez d\'abord générer une prévisualisation',
        variant: 'destructive',
      });
      return;
    }

    if (!recipientEmails.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez saisir au moins une adresse email',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const emails = recipientEmails
        .split(',')
        .map((e) => e.trim())
        .filter((e) => e.length > 0);

      // Sauvegarder directement dans la base
      const { error: logError } = await supabase.from('audit_report_logs').insert({
        recipients: emails,
        period_start: reportData.period.start,
        period_end: reportData.period.end,
        total_changes: reportData.stats.totalChanges || 0,
        total_alerts: reportData.stats.totalAlerts || 0,
        critical_alerts: reportData.stats.criticalAlerts || 0,
      });

      if (logError) throw logError;

      toast({
        title: 'Rapport enregistré',
        description: `Rapport enregistré pour ${emails.length} destinataire(s)`,
      });

      // Réinitialiser le formulaire
      setRecipientEmails('');
      setReportData(null);
    } catch (error: unknown) {
      logger.error('Erreur envoi rapport', error instanceof Error ? error : new Error(String(error)), 'SYSTEM');
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible d\'enregistrer le rapport',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Configuration du rapport
          </CardTitle>
          <CardDescription>
            Définissez la période et les destinataires du rapport d'audit
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start-date">Date de début</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Date de fin</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">
              Destinataires (emails séparés par des virgules)
            </Label>
            <Textarea
              id="recipients"
              placeholder="admin@example.com, manager@example.com"
              value={recipientEmails}
              onChange={(e) => setRecipientEmails(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={fetchReportData}
              disabled={isGeneratingPreview}
              variant="outline"
              className="flex-1"
            >
              {isGeneratingPreview ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Prévisualiser
                </>
              )}
            </Button>
            <Button
              onClick={sendReport}
              disabled={isLoading || !reportData}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer le rapport
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Prévisualisation du rapport</CardTitle>
            <CardDescription>
              Aperçu du contenu qui sera envoyé par email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={previewMode} onValueChange={(v) => setPreviewMode(v as 'text' | 'html')}>
              <TabsList className="mb-4">
                <TabsTrigger value="text">Texte</TabsTrigger>
                <TabsTrigger value="html">HTML</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {generateReportPreview(reportData)}
                    </pre>
                  </AlertDescription>
                </Alert>
              </TabsContent>

              <TabsContent value="html" className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    srcDoc={generateReportHTML(reportData)}
                    className="w-full h-[600px]"
                    title="Prévisualisation HTML"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>{reportData.stats.totalChanges}</strong> modifications
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>{reportData.stats.totalAlerts}</strong> alertes
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>{reportData.stats.criticalAlerts}</strong> alertes critiques
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
