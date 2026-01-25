import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUserQueueItems, 
  triggerQueueWorker, 
  getSunoApiStatus,
  getQueueStatistics,
  retryQueueItem,
  cancelQueueItem,
  getAllQueueItems
} from '@/services/musicQueueService';
import { Loader2, Play, XCircle, RefreshCw, Activity, Clock, CheckCircle, AlertCircle, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { PremiumBadge } from '@/components/music/PremiumBadge';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/lib/routes';

export default function MusicQueueAdmin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Récupérer toutes les demandes de la queue
  const { data: queueItems = [], isLoading: isLoadingQueue } = useQuery({
    queryKey: ['admin-queue-items', selectedStatus],
    queryFn: getAllQueueItems,
    refetchInterval: 5000, // Refresh toutes les 5s
  });

  // Récupérer les statistiques
  const { data: statistics } = useQuery({
    queryKey: ['queue-statistics'],
    queryFn: getQueueStatistics,
    refetchInterval: 10000, // Refresh toutes les 10s
  });

  // Récupérer le statut de l'API
  const { data: apiStatus } = useQuery({
    queryKey: ['suno-api-status'],
    queryFn: getSunoApiStatus,
    refetchInterval: 30000, // Refresh toutes les 30s
  });

  // Mutation pour déclencher le worker
  const triggerWorkerMutation = useMutation({
    mutationFn: triggerQueueWorker,
    onSuccess: () => {
      toast.success('Worker de la queue déclenché avec succès');
      queryClient.invalidateQueries({ queryKey: ['admin-queue-items'] });
      queryClient.invalidateQueries({ queryKey: ['queue-statistics'] });
    },
    onError: () => {
      toast.error('Échec du déclenchement du worker');
    },
  });

  // Mutation pour relancer un élément
  const retryMutation = useMutation({
    mutationFn: retryQueueItem,
    onSuccess: () => {
      toast.success('Demande relancée avec succès');
      queryClient.invalidateQueries({ queryKey: ['admin-queue-items'] });
    },
    onError: () => {
      toast.error('Échec de la relance');
    },
  });

  // Mutation pour annuler un élément
  const cancelMutation = useMutation({
    mutationFn: cancelQueueItem,
    onSuccess: () => {
      toast.success('Demande annulée');
      queryClient.invalidateQueries({ queryKey: ['admin-queue-items'] });
    },
    onError: () => {
      toast.error('Échec de l\'annulation');
    },
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: 'outline', icon: Clock, color: 'text-yellow-500' },
      processing: { variant: 'default', icon: Activity, color: 'text-blue-500' },
      completed: { variant: 'default', icon: CheckCircle, color: 'text-green-500' },
      failed: { variant: 'destructive', icon: AlertCircle, color: 'text-red-500' },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status}
      </Badge>
    );
  };

  const filteredItems = selectedStatus === 'all' 
    ? queueItems 
    : queueItems.filter(item => item.status === selectedStatus);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Administration de la Queue Musicale</h1>
          <p className="text-muted-foreground mt-1">
            Gestion et monitoring des générations musicales
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => navigate(routes.b2b.admin.musicMetrics())}
            variant="outline"
            size="lg"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Métriques
          </Button>
          <Button 
            onClick={() => triggerWorkerMutation.mutate()}
            disabled={triggerWorkerMutation.isPending}
            size="lg"
          >
            {triggerWorkerMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Lancer le Worker
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.pending || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.processing || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Terminées (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.completed_24h || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Échouées (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{statistics?.failed_24h || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Statut de l'API Suno */}
      <Card>
        <CardHeader>
          <CardTitle>Statut de l'API Suno</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`h-4 w-4 rounded-full ${apiStatus?.is_available ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <p className="font-medium">
                {apiStatus?.is_available ? 'Service opérationnel' : 'Service indisponible'}
              </p>
              {apiStatus?.last_check && (
                <p className="text-sm text-muted-foreground">
                  Dernière vérification : {formatDistanceToNow(new Date(apiStatus.last_check), { 
                    addSuffix: true,
                    locale: fr 
                  })}
                </p>
              )}
              {apiStatus?.response_time_ms && (
                <p className="text-sm text-muted-foreground">
                  Temps de réponse : {apiStatus.response_time_ms}ms
                </p>
              )}
              {apiStatus?.error_message && (
                <p className="text-sm text-red-500 mt-1">
                  Erreur : {apiStatus.error_message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {['all', 'pending', 'processing', 'completed', 'failed'].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                onClick={() => setSelectedStatus(status)}
                size="sm"
              >
                {status === 'all' ? 'Tous' : status}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes de génération ({filteredItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingQueue ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Aucune demande trouvée
            </p>
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      {getStatusBadge(item.status)}
                      {item.priority >= 50 && (
                        <PremiumBadge 
                          role={item.priority >= 100 ? 'admin' : item.priority >= 75 ? 'moderator' : 'premium'} 
                          size="sm"
                        />
                      )}
                      <span className="font-medium">Émotion : {item.emotion}</span>
                      <span className="text-sm text-muted-foreground">
                        Intensité : {item.intensity}
                      </span>
                      {item.priority > 0 && (
                        <span className="text-xs text-muted-foreground">
                          Priorité : {item.priority}
                        </span>
                      )}
                    </div>
                    
                    {item.user_context && (
                      <p className="text-sm text-muted-foreground">
                        Contexte : {item.user_context}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        Créé {formatDistanceToNow(new Date(item.created_at), { 
                          addSuffix: true,
                          locale: fr 
                        })}
                      </span>
                      
                      {item.started_at && (
                        <span>
                          Démarré {formatDistanceToNow(new Date(item.started_at), { 
                            addSuffix: true,
                            locale: fr 
                          })}
                        </span>
                      )}
                      
                      {item.completed_at && (
                        <span>
                          Terminé {formatDistanceToNow(new Date(item.completed_at), { 
                            addSuffix: true,
                            locale: fr 
                          })}
                        </span>
                      )}
                      
                      <span>Tentatives : {item.retry_count}/{item.max_retries}</span>
                    </div>

                    {item.error_message && (
                      <p className="text-sm text-red-500 mt-1">
                        ⚠️ {item.error_message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {(item.status === 'failed' || item.status === 'pending') && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => retryMutation.mutate(item.id)}
                        disabled={retryMutation.isPending}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Relancer
                      </Button>
                    )}
                    
                    {(item.status === 'pending' || item.status === 'processing') && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => cancelMutation.mutate(item.id)}
                        disabled={cancelMutation.isPending}
                      >
                        <XCircle className="h-3 w-3 mr-1" />
                        Annuler
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance */}
      {statistics && (
        <Card>
          <CardHeader>
            <CardTitle>Statistiques de performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Taux de réussite</p>
                <p className="text-2xl font-bold">
                  {statistics.success_rate ? `${statistics.success_rate.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Temps moyen de traitement</p>
                <p className="text-2xl font-bold">
                  {statistics.avg_processing_time 
                    ? `${Math.round(statistics.avg_processing_time)}s` 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
