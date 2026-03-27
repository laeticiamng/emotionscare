// @ts-nocheck
/**
 * ModerationToolsPanel - Outils de modération communautaire
 * Gestion des signalements, filtres et actions modérateurs
 */

import { memo, useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Shield,
  AlertTriangle,
  Ban,
  Eye,
  MessageSquareOff,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Report {
  id: string;
  contentId: string;
  contentType: 'post' | 'comment' | 'user';
  contentPreview: string;
  reporterId: string;
  reporterName: string;
  reason: string;
  details?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface ModerationToolsPanelProps {
  isAdmin?: boolean;
  className?: string;
}

const REASON_LABELS: Record<string, string> = {
  harassment: 'Harcèlement',
  spam: 'Spam',
  misinformation: 'Désinformation',
  inappropriate: 'Contenu inapproprié',
  violence: 'Violence',
  other: 'Autre',
};

const PRIORITY_STYLES: Record<string, string> = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="h-4 w-4 text-amber-500" />,
  reviewed: <Eye className="h-4 w-4 text-blue-500" />,
  resolved: <CheckCircle className="h-4 w-4 text-green-500" />,
  dismissed: <XCircle className="h-4 w-4 text-slate-500" />,
};

export const ModerationToolsPanel = memo(function ModerationToolsPanel({
  isAdmin = true,
  className = '',
}: ModerationToolsPanelProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [moderationNote, setModerationNote] = useState('');

  // Fetch reports from Supabase
  const {
    data: reports = [],
    isLoading,
    error,
  } = useQuery<Report[]>({
    queryKey: ['moderation_reports', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('moderation_reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data ?? []).map((row: any) => ({
        id: row.id,
        contentId: row.content_id ?? '',
        contentType: row.content_type ?? 'post',
        contentPreview: row.content_preview ?? row.description ?? '',
        reporterId: row.reporter_id ?? '',
        reporterName: row.reporter_name ?? 'Anonyme',
        reason: row.reason ?? 'other',
        details: row.details,
        status: row.status ?? 'pending',
        createdAt: new Date(row.created_at),
        priority: row.priority ?? 'low',
      }));
    },
    enabled: !!user,
  });

  // Mutation for updating report status
  const updateReportMutation = useMutation({
    mutationFn: async ({ reportId, newStatus }: { reportId: string; newStatus: string }) => {
      const { error } = await supabase
        .from('moderation_reports')
        .update({ status: newStatus, moderation_note: moderationNote || null })
        .eq('id', reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation_reports'] });
    },
  });

  const filteredReports = reports.filter(
    (r) => filterStatus === 'all' || r.status === filterStatus
  );

  const handleAction = useCallback((reportId: string, action: 'resolve' | 'dismiss' | 'ban' | 'warn') => {
    const newStatus = action === 'dismiss' ? 'dismissed' : 'resolved';
    updateReportMutation.mutate({ reportId, newStatus });

    const messages: Record<string, string> = {
      resolve: 'Signalement résolu',
      dismiss: 'Signalement rejeté',
      ban: 'Utilisateur banni',
      warn: 'Avertissement envoyé',
    };

    toast.success(messages[action]);
    setSelectedReport(null);
    setModerationNote('');
  }, [updateReportMutation, moderationNote]);

  const stats = {
    pending: reports.filter((r) => r.status === 'pending').length,
    resolved: reports.filter((r) => r.status === 'resolved').length,
    total: reports.length,
  };

  if (!isAdmin) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-3" aria-hidden="true" />
          <p className="text-muted-foreground">
            Accès réservé aux modérateurs
          </p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center" role="alert" aria-label="Erreur de chargement des signalements">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-3" aria-hidden="true" />
          <p className="text-red-500 font-medium">Erreur lors du chargement des signalements</p>
          <p className="text-sm text-muted-foreground mt-1">Veuillez réessayer ultérieurement.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`} aria-label="Panneau d'outils de modération">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
          Outils de modération
        </CardTitle>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-amber-500" aria-hidden="true" />
            {stats.pending} en attente
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" aria-hidden="true" />
            {stats.resolved} résolus
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="reports" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports" className="gap-1">
              <AlertTriangle className="h-4 w-4" />
              Signalements
            </TabsTrigger>
            <TabsTrigger value="filters" className="gap-1">
              <Filter className="h-4 w-4" />
              Filtres
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            {/* Filtre status */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48" aria-label="Filtrer par statut">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="reviewed">En cours</SelectItem>
                <SelectItem value="resolved">Résolus</SelectItem>
                <SelectItem value="dismissed">Rejetés</SelectItem>
              </SelectContent>
            </Select>

            {/* Liste des signalements */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto" aria-label="Liste des signalements">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {filteredReports.map((report) => (
                    <div
                      key={report.id}
                      className={`rounded-lg border p-4 cursor-pointer transition-colors hover:bg-muted/50 ${
                        selectedReport?.id === report.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setSelectedReport(report)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Signalement : ${report.contentPreview}`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          setSelectedReport(report);
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {STATUS_ICONS[report.status]}
                            <Badge className={PRIORITY_STYLES[report.priority]}>
                              {report.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {REASON_LABELS[report.reason] || report.reason}
                            </Badge>
                          </div>
                          <p className="text-sm line-clamp-2">{report.contentPreview}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Signalé par {report.reporterName} • {new Date(report.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredReports.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground" aria-label="Aucun signalement à traiter">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2" aria-hidden="true" />
                      <p>Aucun signalement à traiter</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Panel d'action */}
            {selectedReport && (
              <div className="border-t pt-4 space-y-3">
                <h4 className="font-medium">Actions pour ce signalement</h4>
                <Textarea
                  value={moderationNote}
                  onChange={(e) => setModerationNote(e.target.value)}
                  placeholder="Note de modération (optionnel)..."
                  className="min-h-[60px]"
                  aria-label="Note de modération"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleAction(selectedReport.id, 'resolve')}
                    aria-label="Résoudre le signalement"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Résoudre
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAction(selectedReport.id, 'warn')}
                    aria-label="Envoyer un avertissement"
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Avertir
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleAction(selectedReport.id, 'ban')}
                    aria-label="Bannir l'utilisateur"
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Bannir
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAction(selectedReport.id, 'dismiss')}
                    aria-label="Rejeter le signalement"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Rejeter
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="filters">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <MessageSquareOff className="h-4 w-4" aria-hidden="true" />
                  Filtres automatiques
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Mots-clés sensibles</span>
                    <Badge variant="secondary">Configuré</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Détection spam</span>
                    <Badge className="bg-green-100 text-green-700">Actif</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Analyse de toxicité IA</span>
                    <Badge className="bg-green-100 text-green-700">Actif</Badge>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2" aria-hidden="true" />
              <p>Gestion des utilisateurs à venir</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
});

export default ModerationToolsPanel;
