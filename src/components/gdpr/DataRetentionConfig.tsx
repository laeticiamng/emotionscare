// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDataRetention } from '@/hooks/useDataRetention';
import { 
  Clock, 
  Archive, 
  Trash2, 
  Bell, 
  Play, 
  Settings, 
  CheckCircle2, 
  AlertTriangle,
  Calendar,
  Database,
  TrendingUp,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export const DataRetentionConfig: React.FC = () => {
  const {
    rules,
    archives,
    notifications,
    stats,
    loading,
    updateRule,
    acknowledgeNotification,
    runRetentionProcess,
    fetchArchives,
  } = useDataRetention();

  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [filterEntityType, setFilterEntityType] = useState<string>('all');

  const entityTypeLabels: Record<string, string> = {
    journal_entries: 'Entrées journal',
    emotion_scans: 'Scans émotionnels',
    assessment_results: 'Résultats évaluations',
    coach_logs: 'Logs coach',
    user_activity_logs: 'Logs activité',
    audit_logs: 'Logs audit',
  };

  const notificationTypeLabels: Record<string, string> = {
    warning: 'Avertissement',
    final_warning: 'Dernier avertissement',
    expired: 'Expiré',
  };

  const notificationTypeColors: Record<string, string> = {
    warning: 'bg-yellow-500/10 text-yellow-500',
    final_warning: 'bg-orange-500/10 text-orange-500',
    expired: 'bg-red-500/10 text-red-500',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Règles actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRules || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Archives actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeArchives || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingNotifications || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Database className="h-4 w-4" />
              Total archivé
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalArchived || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Supprimés (30j)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.deletedLastMonth || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Expire bientôt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.upcomingExpirations || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for pending notifications */}
      {(stats?.pendingNotifications || 0) > 0 && (
        <Alert>
          <Bell className="h-4 w-4" />
          <AlertDescription>
            Vous avez {stats?.pendingNotifications} notification(s) d'expiration en attente.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Règles de rétention</TabsTrigger>
          <TabsTrigger value="archives">Archives</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Configuration des règles</CardTitle>
                  <CardDescription>
                    Gérez les périodes de rétention pour chaque type de données
                  </CardDescription>
                </div>
                <Button onClick={runRetentionProcess} size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Exécuter maintenant
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type de données</TableHead>
                    <TableHead>Rétention (jours)</TableHead>
                    <TableHead>Archivage</TableHead>
                    <TableHead>Suppression auto</TableHead>
                    <TableHead>Notification (jours avant)</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">
                        {entityTypeLabels[rule.entity_type] || rule.entity_type}
                      </TableCell>
                      <TableCell>
                        {editingRule === rule.id ? (
                          <Input
                            type="number"
                            defaultValue={rule.retention_days}
                            className="w-24"
                            onBlur={(e) => {
                              updateRule(rule.id, { retention_days: parseInt(e.target.value) });
                              setEditingRule(null);
                            }}
                          />
                        ) : (
                          <span
                            onClick={() => setEditingRule(rule.id)}
                            className="cursor-pointer hover:text-primary"
                          >
                            {rule.retention_days}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.archive_enabled}
                          onCheckedChange={(checked) =>
                            updateRule(rule.id, { archive_enabled: checked })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.auto_delete_enabled}
                          onCheckedChange={(checked) =>
                            updateRule(rule.id, { auto_delete_enabled: checked })
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {editingRule === rule.id ? (
                          <Input
                            type="number"
                            defaultValue={rule.notification_days_before}
                            className="w-24"
                            onBlur={(e) => {
                              updateRule(rule.id, {
                                notification_days_before: parseInt(e.target.value),
                              });
                              setEditingRule(null);
                            }}
                          />
                        ) : (
                          <span
                            onClick={() => setEditingRule(rule.id)}
                            className="cursor-pointer hover:text-primary"
                          >
                            {rule.notification_days_before}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingRule(rule.id)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Archives Tab */}
        <TabsContent value="archives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Données archivées</CardTitle>
              <CardDescription>
                Données archivées avant suppression définitive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label>Filtrer par type</Label>
                <select
                  value={filterEntityType}
                  onChange={(e) => {
                    setFilterEntityType(e.target.value);
                    if (e.target.value === 'all') {
                      fetchArchives();
                    } else {
                      fetchArchives({ entity_type: e.target.value });
                    }
                  }}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="all">Tous les types</option>
                  {Object.entries(entityTypeLabels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Archivé le</TableHead>
                    <TableHead>Expire le</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {archives.slice(0, 50).map((archive) => (
                    <TableRow key={archive.id}>
                      <TableCell>
                        {entityTypeLabels[archive.entity_type] || archive.entity_type}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {archive.user_id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(archive.archived_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(archive.expires_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell>
                        {archive.deleted_at ? (
                          <Badge variant="destructive">Supprimé</Badge>
                        ) : new Date(archive.expires_at) < new Date() ? (
                          <Badge variant="outline" className="bg-orange-500/10">
                            Expiré
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-500/10">
                            Actif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Voir détails
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Données archivées</DialogTitle>
                              <DialogDescription>
                                Contenu de l'archive (JSON)
                              </DialogDescription>
                            </DialogHeader>
                            <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                              {JSON.stringify(archive.original_data, null, 2)}
                            </pre>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications d'expiration</CardTitle>
              <CardDescription>
                Alertes envoyées aux utilisateurs concernant l'expiration de leurs données
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Données concernées</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Date expiration</TableHead>
                    <TableHead>Envoyé le</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notif) => (
                    <TableRow key={notif.id}>
                      <TableCell>
                        <Badge className={notificationTypeColors[notif.notification_type]}>
                          {notificationTypeLabels[notif.notification_type]}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {notif.user_id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        {entityTypeLabels[notif.entity_type] || notif.entity_type}
                      </TableCell>
                      <TableCell>{notif.entities_count}</TableCell>
                      <TableCell>
                        {new Date(notif.expiration_date).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(notif.sent_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </TableCell>
                      <TableCell>
                        {notif.acknowledged ? (
                          <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-xs">Acquittée</span>
                          </div>
                        ) : (
                          <Badge variant="outline">En attente</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {!notif.acknowledged && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => acknowledgeNotification(notif.id)}
                          >
                            Acquitter
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
