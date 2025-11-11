import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  useGamificationCronHistory, 
  useGamificationCronJobs,
  useTriggerDailyChallenges,
  useTriggerRankings 
} from '@/hooks/useCronJobs';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Calendar,
  Play,
  Filter,
  Activity,
  Zap,
  Trophy,
  Target,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

/**
 * Page de monitoring admin pour les jobs cron de gamification
 */
export default function GamificationCronMonitoring() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: cronHistory, isLoading: loadingHistory, refetch: refetchHistory } = useGamificationCronHistory();
  const { data: cronJobs, isLoading: loadingJobs, refetch: refetchJobs } = useGamificationCronJobs();
  const triggerChallenges = useTriggerDailyChallenges();
  const triggerRankings = useTriggerRankings();

  const jobs = [
    {
      id: 'generate-daily-challenges-midnight',
      name: 'Génération des Défis Quotidiens',
      schedule: '0 0 * * *',
      scheduleText: 'Chaque jour à minuit UTC',
      description: 'Génère automatiquement les défis quotidiens pour tous les profils émotionnels',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
      trigger: () => triggerChallenges.mutate(),
      isLoading: triggerChallenges.isPending,
    },
    {
      id: 'calculate-rankings-hourly',
      name: 'Calcul du Classement',
      schedule: '0 * * * *',
      scheduleText: 'Toutes les heures',
      description: 'Recalcule les rangs et identifie le top 10% pour les badges mensuels',
      icon: Trophy,
      color: 'from-orange-500 to-red-500',
      trigger: () => triggerRankings.mutate(),
      isLoading: triggerRankings.isPending,
    },
  ];

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Succès</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Échec</Badge>;
      case 'running':
        return <Badge variant="secondary"><RefreshCw className="h-3 w-3 mr-1 animate-spin" />En cours</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Inconnu</Badge>;
    }
  };

  const calculateNextRun = (schedule: string) => {
    const now = new Date();
    const next = new Date(now);
    
    if (schedule === '0 0 * * *') {
      // Daily at midnight
      next.setDate(next.getDate() + 1);
      next.setHours(0, 0, 0, 0);
    } else if (schedule === '0 * * * *') {
      // Every hour
      next.setHours(next.getHours() + 1, 0, 0, 0);
    }
    
    return next;
  };

  const getJobConfig = (jobName: string) => {
    return cronJobs?.find((j: any) => j.jobname === jobName);
  };

  // Filter history
  const filteredHistory = cronHistory?.filter((log: any) => {
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    const matchesJob = jobFilter === 'all' || log.job_name === jobFilter;
    const matchesSearch = !searchTerm || 
      log.job_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.return_message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesJob && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: cronHistory?.length || 0,
    succeeded: cronHistory?.filter((log: any) => log.status === 'succeeded').length || 0,
    failed: cronHistory?.filter((log: any) => log.status === 'failed').length || 0,
    successRate: cronHistory?.length ? 
      ((cronHistory.filter((log: any) => log.status === 'succeeded').length / cronHistory.length) * 100).toFixed(1) : '0',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/app/park')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
                <Activity className="h-10 w-10 text-primary" />
                Monitoring Cron Jobs
              </h1>
              <p className="text-muted-foreground mt-2">
                Surveillance en temps réel des tâches automatiques de gamification
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchHistory();
                refetchJobs();
              }}
              disabled={loadingHistory || loadingJobs}
            >
              <RefreshCw className={cn('h-4 w-4 mr-2', (loadingHistory || loadingJobs) && 'animate-spin')} />
              Actualiser
            </Button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Exécutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Succès</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">{stats.succeeded}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Échecs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">{stats.failed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taux de Succès</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.successRate}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {jobs.map((job) => {
            const config = getJobConfig(job.id);
            const nextRun = calculateNextRun(job.schedule);
            const timeUntilNext = nextRun.getTime() - Date.now();
            const hoursUntilNext = Math.floor(timeUntilNext / (1000 * 60 * 60));
            const minutesUntilNext = Math.floor((timeUntilNext % (1000 * 60 * 60)) / (1000 * 60));

            const recentLogs = cronHistory?.filter((log: any) => log.job_name === job.id).slice(0, 5) || [];
            const successCount = recentLogs.filter((log: any) => log.status === 'succeeded').length;
            const failureCount = recentLogs.filter((log: any) => log.status === 'failed').length;

            const Icon = job.icon;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden">
                  <div className={cn('h-2 bg-gradient-to-r', job.color)} />
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={cn('p-3 rounded-lg bg-gradient-to-br', job.color, 'bg-opacity-10')}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            {job.name}
                            {config?.active ? (
                              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                <Zap className="h-3 w-3 mr-1" />
                                Actif
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                                Inactif
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-2">{job.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Schedule */}
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Planification</div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">{job.scheduleText}</span>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{job.schedule}</code>
                        </div>
                      </div>

                      {/* Next Run */}
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Prochaine exécution</div>
                        <div className="font-medium">
                          {nextRun.toLocaleString('fr-FR')}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Dans {hoursUntilNext}h {minutesUntilNext}min
                        </div>
                      </div>

                      {/* Recent Stats */}
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

                      {/* Manual Trigger */}
                      <Button
                        onClick={job.trigger}
                        disabled={job.isLoading}
                        className="w-full"
                        variant="outline"
                      >
                        {job.isLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Exécution en cours...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Déclencher manuellement
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Execution History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Historique d'exécution</CardTitle>
                <CardDescription>
                  Logs détaillés des 100 dernières exécutions
                </CardDescription>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher dans les logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <select
                  value={jobFilter}
                  onChange={(e) => setJobFilter(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">Tous les jobs</option>
                  {jobs.map(job => (
                    <option key={job.id} value={job.id}>{job.name}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="succeeded">Succès</option>
                  <option value="failed">Échecs</option>
                  <option value="running">En cours</option>
                </select>
              </div>
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
                {loadingHistory ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 mx-auto mb-2 animate-spin text-muted-foreground" />
                    <p className="text-muted-foreground">Chargement...</p>
                  </div>
                ) : filteredHistory && filteredHistory.length > 0 ? (
                  filteredHistory.map((log: any, index: number) => (
                    <div
                      key={`${log.jobid}-${log.start_time}-${index}`}
                      className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusBadge(log.status)}
                          <span className="text-sm font-medium">{log.job_name}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.start_time).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        {log.return_message && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {log.return_message}
                          </div>
                        )}
                        {log.end_time && (
                          <div className="text-xs text-muted-foreground mt-2">
                            Durée: {Math.round((new Date(log.end_time).getTime() - new Date(log.start_time).getTime()) / 1000)}s
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Aucun log trouvé</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="failed" className="space-y-3">
                {filteredHistory?.filter((log: any) => log.status === 'failed').length ? (
                  filteredHistory.filter((log: any) => log.status === 'failed').map((log: any, index: number) => (
                    <div
                      key={`${log.jobid}-${log.start_time}-${index}`}
                      className="flex items-start justify-between p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Échec</Badge>
                          <span className="text-sm font-medium">{log.job_name}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.start_time).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        <div className="text-sm text-red-700 dark:text-red-400">
                          {log.return_message || 'Erreur inconnue'}
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
                {filteredHistory?.filter((log: any) => log.status === 'succeeded').length ? (
                  filteredHistory.filter((log: any) => log.status === 'succeeded').map((log: any, index: number) => (
                    <div
                      key={`${log.jobid}-${log.start_time}-${index}`}
                      className="flex items-start justify-between p-4 border border-green-200 rounded-lg bg-green-50 dark:bg-green-950/20"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Succès</Badge>
                          <span className="text-sm font-medium">{log.job_name}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.start_time).toLocaleString('fr-FR')}
                          </span>
                        </div>
                        {log.return_message && (
                          <div className="text-sm text-green-700 dark:text-green-400">
                            {log.return_message}
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
    </div>
  );
}
