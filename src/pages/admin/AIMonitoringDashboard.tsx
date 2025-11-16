import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle, CheckCircle2, Clock, Filter, RefreshCw, TrendingUp, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { logger } from '@/lib/logger';

interface AIMonitoringError {
  id: string;
  created_at: string;
  error_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  stack?: string;
  url?: string;
  user_agent?: string;
  context?: any;
  user_id?: string;
  ai_analysis: {
    isKnownIssue: boolean;
    suggestedFix: string;
    autoFixCode?: string | null;
    relatedErrors: string[];
    priority: string;
    category: string;
    needsAlert: boolean;
    analysis: string;
    preventionTips: string[];
  };
  is_known_issue: boolean;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  needs_alert: boolean;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
}

interface MonitoringStats {
  total_errors: number;
  unresolved_errors: number;
  critical_errors: number;
  high_errors: number;
  urgent_errors: number;
  alert_needed_errors: number;
  errors_last_24h: number;
  errors_last_7d: number;
  unique_categories: number;
}

const AIMonitoringDashboard = () => {
  const queryClient = useQueryClient();
  const [selectedError, setSelectedError] = useState<AIMonitoringError | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [resolvedFilter, setResolvedFilter] = useState<string>('unresolved');

  // Fetch statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['ai-monitoring-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_monitoring_stats')
        .select('*')
        .single();
      if (error) throw error;
      return data as MonitoringStats;
    },
  });

  // Fetch errors with filters
  const { data: errors, isLoading: errorsLoading, refetch } = useQuery({
    queryKey: ['ai-monitoring-errors', severityFilter, priorityFilter, categoryFilter, resolvedFilter, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('ai_monitoring_errors')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (severityFilter !== 'all') {
        query = query.eq('severity', severityFilter);
      }
      if (priorityFilter !== 'all') {
        query = query.eq('priority', priorityFilter);
      }
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }
      if (resolvedFilter === 'resolved') {
        query = query.eq('resolved', true);
      } else if (resolvedFilter === 'unresolved') {
        query = query.eq('resolved', false);
      }
      if (searchQuery) {
        query = query.ilike('message', `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AIMonitoringError[];
    },
  });

  // Mark as resolved mutation
  const resolveErrorMutation = useMutation({
    mutationFn: async ({ errorId, notes }: { errorId: string; notes?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('ai_monitoring_errors')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: user?.id,
          resolution_notes: notes,
        })
        .eq('id', errorId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-monitoring-errors'] });
      queryClient.invalidateQueries({ queryKey: ['ai-monitoring-stats'] });
      toast({
        title: 'Erreur marquée comme résolue',
        description: 'L\'erreur a été marquée comme résolue avec succès.',
      });
      setSelectedError(null);
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Impossible de marquer l\'erreur comme résolue.',
      });
      logger.error(error, 'PAGE');
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitoring AI des Erreurs</h1>
          <p className="text-muted-foreground">Surveillance intelligente et analyse automatique des erreurs</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erreurs totales</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_errors || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.unresolved_errors || 0} non résolues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critiques</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats?.critical_errors || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.urgent_errors || 0} urgentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernières 24h</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.errors_last_24h || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.errors_last_7d || 0} sur 7 jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Catégories</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unique_categories || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.alert_needed_errors || 0} nécessitent alerte
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="text-sm font-medium mb-2 block">Recherche</label>
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Sévérité</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Priorité</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Catégorie</label>
              <Input
                placeholder="Catégorie..."
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Statut</label>
              <Select value={resolvedFilter} onValueChange={setResolvedFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes</SelectItem>
                  <SelectItem value="unresolved">Non résolues</SelectItem>
                  <SelectItem value="resolved">Résolues</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Errors List */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Erreurs ({errors?.length || 0})</CardTitle>
            <CardDescription>Cliquez sur une erreur pour voir les détails</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {errorsLoading ? (
                  <p className="text-center text-muted-foreground py-8">Chargement...</p>
                ) : errors && errors.length > 0 ? (
                  errors.map((error) => (
                    <Card
                      key={error.id}
                      className={`cursor-pointer hover:bg-accent transition-colors ${
                        selectedError?.id === error.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedError(error)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityColor(error.severity)}>
                              {error.severity}
                            </Badge>
                            <Badge className={getPriorityColor(error.priority)}>
                              {error.priority}
                            </Badge>
                            <Badge variant="outline">{error.category}</Badge>
                          </div>
                          {error.resolved && (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-sm font-medium line-clamp-2 mb-1">{error.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(error.created_at), 'PPp', { locale: fr })}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">Aucune erreur trouvée</p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Error Details */}
        <Card>
          <CardHeader>
            <CardTitle>Détails & Analyse AI</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedError ? (
              <ScrollArea className="h-[600px]">
                <Tabs defaultValue="analysis" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="analysis">Analyse</TabsTrigger>
                    <TabsTrigger value="details">Détails</TabsTrigger>
                    <TabsTrigger value="resolution">Résolution</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="analysis" className="space-y-4 mt-4">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        🔍 Diagnostic
                      </h3>
                      <p className="text-sm text-muted-foreground">{selectedError.ai_analysis.analysis}</p>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        💡 Solution suggérée
                      </h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {selectedError.ai_analysis.suggestedFix}
                      </p>
                    </div>

                    {selectedError.ai_analysis.autoFixCode && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            🔧 Code de correction
                          </h3>
                          <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                            <code>{selectedError.ai_analysis.autoFixCode}</code>
                          </pre>
                        </div>
                      </>
                    )}

                    {selectedError.ai_analysis.preventionTips?.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            🛡️ Conseils de prévention
                          </h3>
                          <ul className="space-y-2">
                            {selectedError.ai_analysis.preventionTips.map((tip, i) => (
                              <li key={i} className="text-sm text-muted-foreground">
                                {i + 1}. {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}

                    {selectedError.ai_analysis.relatedErrors?.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            🔗 Erreurs similaires
                          </h3>
                          <ul className="space-y-1">
                            {selectedError.ai_analysis.relatedErrors.map((err, i) => (
                              <li key={i} className="text-sm text-muted-foreground">• {err}</li>
                            ))}
                          </ul>
                        </div>
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4 mt-4">
                    <div>
                      <h3 className="font-semibold mb-2">Message</h3>
                      <p className="text-sm text-muted-foreground">{selectedError.message}</p>
                    </div>

                    {selectedError.url && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-2">URL</h3>
                          <p className="text-sm text-muted-foreground break-all">{selectedError.url}</p>
                        </div>
                      </>
                    )}

                    {selectedError.stack && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-2">Stack Trace</h3>
                          <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto max-h-[200px]">
                            <code>{selectedError.stack}</code>
                          </pre>
                        </div>
                      </>
                    )}

                    {selectedError.context && Object.keys(selectedError.context).length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="font-semibold mb-2">Contexte</h3>
                          <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto max-h-[200px]">
                            <code>{JSON.stringify(selectedError.context, null, 2)}</code>
                          </pre>
                        </div>
                      </>
                    )}
                  </TabsContent>

                  <TabsContent value="resolution" className="space-y-4 mt-4">
                    {selectedError.resolved ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="font-semibold">Erreur résolue</span>
                        </div>
                        {selectedError.resolved_at && (
                          <p className="text-sm text-muted-foreground">
                            Résolue le {format(new Date(selectedError.resolved_at), 'PPp', { locale: fr })}
                          </p>
                        )}
                        {selectedError.resolution_notes && (
                          <>
                            <Separator />
                            <div>
                              <h3 className="font-semibold mb-2">Notes de résolution</h3>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {selectedError.resolution_notes}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Marquer cette erreur comme résolue après avoir appliqué les corrections suggérées.
                        </p>
                        <Button
                          onClick={() => resolveErrorMutation.mutate({ errorId: selectedError.id })}
                          disabled={resolveErrorMutation.isPending}
                          className="w-full"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Marquer comme résolu
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                Sélectionnez une erreur pour voir les détails
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIMonitoringDashboard;
