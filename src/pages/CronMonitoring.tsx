import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEdgeFunctionLogs } from '@/hooks/useCronJobs';
import { Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Calendar } from 'lucide-react';
import { useState } from 'react';

/**
 * Page de monitoring des jobs cron en temps réel
 */
const CronMonitoring = () => {
  const [selectedJob, setSelectedJob] = useState<'scheduled-pdf-reports' | 'pdf-notifications'>('scheduled-pdf-reports');
  
  const { data: pdfReportsLogs, isLoading: loadingPdfReports, refetch: refetchPdfReports } = useEdgeFunctionLogs('scheduled-pdf-reports');
  const { data: notificationsLogs, isLoading: loadingNotifications, refetch: refetchNotifications } = useEdgeFunctionLogs('pdf-notifications');

  const jobs = [
    {
      id: 'scheduled-pdf-reports',
      name: 'Rapports PDF Planifiés',
      schedule: '0 * * * *',
      scheduleText: 'Toutes les heures',
      description: 'Génération automatique des rapports PDF mensuels',
      logs: pdfReportsLogs,
      isLoading: loadingPdfReports,
      refetch: refetchPdfReports,
    },
    {
      id: 'pdf-notifications',
      name: 'Notifications PDF',
      schedule: '0 8,16 * * *',
      scheduleText: 'Deux fois par jour (8h et 16h)',
      description: 'Envoi des notifications pour rapports prêts',
      logs: notificationsLogs,
      isLoading: loadingNotifications,
      refetch: refetchNotifications,
    },
  ];

  const currentJob = jobs.find(j => j.id === selectedJob);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Succès</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Échec</Badge>;
      case 'processing':
        return <Badge variant="secondary"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />En cours</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Inconnu</Badge>;
    }
  };

  const calculateNextRun = (schedule: string) => {
    const now = new Date();
    const next = new Date(now);
    
    if (schedule === '0 * * * *') {
      next.setHours(next.getHours() + 1, 0, 0, 0);
    } else if (schedule === '0 8,16 * * *') {
      const hour = next.getHours();
      if (hour < 8) {
        next.setHours(8, 0, 0, 0);
      } else if (hour < 16) {
        next.setHours(16, 0, 0, 0);
      } else {
        next.setDate(next.getDate() + 1);
        next.setHours(8, 0, 0, 0);
      }
    }
    
    return next;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Monitoring Jobs Cron</h1>
        <p className="text-muted-foreground">
          Surveillance en temps réel des tâches planifiées et de leur historique d'exécution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {jobs.map((job) => {
          const nextRun = calculateNextRun(job.schedule);
          const timeUntilNext = nextRun.getTime() - Date.now();
          const hoursUntilNext = Math.floor(timeUntilNext / (1000 * 60 * 60));
          const minutesUntilNext = Math.floor((timeUntilNext % (1000 * 60 * 60)) / (1000 * 60));

          const recentLogs = job.logs?.slice(0, 5) || [];
          const successCount = recentLogs.filter(log => log.status === 'completed').length;
          const failureCount = recentLogs.filter(log => log.status === 'failed').length;

          return (
            <Card 
              key={job.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${selectedJob === job.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedJob(job.id as any)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {job.name}
                    </CardTitle>
                    <CardDescription className="mt-2">{job.description}</CardDescription>
                  </div>
                  {successCount > failureCount ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : failureCount > 0 ? (
                    <XCircle className="h-6 w-6 text-red-500" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Planification</div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">{job.scheduleText}</span>
                      <code className="text-xs bg-muted px-2 py-1 rounded">{job.schedule}</code>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Prochaine exécution</div>
                    <div className="font-medium">
                      {nextRun.toLocaleString('fr-FR')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Dans {hoursUntilNext}h {minutesUntilNext}min
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <div className="text-2xl font-bold text-green-500">{successCount}</div>
                      <div className="text-xs text-muted-foreground">Succès récents</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-500">{failureCount}</div>
                      <div className="text-xs text-muted-foreground">Échecs récents</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Historique d'exécution - {currentJob?.name}</CardTitle>
              <CardDescription>
                Logs détaillés des 50 dernières exécutions
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => currentJob?.refetch()}
              disabled={currentJob?.isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${currentJob?.isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="recent">
            <TabsList className="mb-4">
              <TabsTrigger value="recent">Récents</TabsTrigger>
              <TabsTrigger value="failed">Échecs</TabsTrigger>
              <TabsTrigger value="success">Succès</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-3">
              {currentJob?.logs && currentJob.logs.length > 0 ? (
                currentJob.logs.map((log: any, index: number) => (
                  <div
                    key={log.id || index}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(log.status)}
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.created_at || log.generated_at).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      {log.report_type && (
                        <div className="text-sm">
                          <span className="font-medium">Type:</span> {log.report_type}
                        </div>
                      )}
                      {log.message && (
                        <div className="text-sm text-muted-foreground mt-1">
                          {log.message}
                        </div>
                      )}
                      {log.metadata && (
                        <div className="text-xs text-muted-foreground mt-2">
                          <code className="bg-muted px-2 py-1 rounded">
                            {JSON.stringify(log.metadata, null, 2)}
                          </code>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun log disponible</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="failed" className="space-y-3">
              {currentJob?.logs && currentJob.logs.filter((log: any) => log.status === 'failed').length > 0 ? (
                currentJob.logs.filter((log: any) => log.status === 'failed').map((log: any, index: number) => (
                  <div
                    key={log.id || index}
                    className="flex items-start justify-between p-4 border border-red-200 rounded-lg bg-red-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Échec</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.created_at || log.generated_at).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      <div className="text-sm text-red-700">
                        {log.message || 'Erreur inconnue'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
                  <p>Aucun échec récent 🎉</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="success" className="space-y-3">
              {currentJob?.logs && currentJob.logs.filter((log: any) => log.status === 'completed').length > 0 ? (
                currentJob.logs.filter((log: any) => log.status === 'completed').map((log: any, index: number) => (
                  <div
                    key={log.id || index}
                    className="flex items-start justify-between p-4 border border-green-200 rounded-lg bg-green-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Succès</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(log.created_at || log.generated_at).toLocaleString('fr-FR')}
                        </span>
                      </div>
                      {log.report_type && (
                        <div className="text-sm text-green-700">
                          Rapport {log.report_type} généré avec succès
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun succès récent</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CronMonitoring;
