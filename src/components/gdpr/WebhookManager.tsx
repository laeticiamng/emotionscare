// @ts-nocheck
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { logger } from '@/lib/logger';
import { 
  Webhook, Plus, Trash2, Edit, Play, RefreshCw, 
  CheckCircle, XCircle, Clock, Activity, TrendingUp
} from 'lucide-react';
import { useWebhooks } from '@/hooks/useWebhooks';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const EVENT_TYPES = [
  { value: 'consent_granted', label: 'Consentement accordé' },
  { value: 'consent_withdrawn', label: 'Consentement retiré' },
  { value: 'export_requested', label: 'Export demandé' },
  { value: 'export_completed', label: 'Export complété' },
  { value: 'data_deleted', label: 'Données supprimées' },
  { value: 'policy_updated', label: 'Politique mise à jour' },
];

export const WebhookManager = () => {
  const {
    webhooks,
    deliveries,
    stats,
    isLoading,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    processEvents,
    retryWebhooks,
    isProcessing,
  } = useWebhooks();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    secret_key: '',
    description: '',
    events: [] as string[],
    is_active: true,
    headers: {},
    retry_config: {
      max_attempts: 3,
      backoff_seconds: [30, 300, 3600],
    },
  });

  const handleSubmit = async () => {
    try {
      if (editingWebhook) {
        await updateWebhook({ id: editingWebhook.id, ...formData });
      } else {
        await createWebhook(formData);
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      logger.error('Error saving webhook:', error, 'COMPONENT');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      url: '',
      secret_key: '',
      description: '',
      events: [],
      is_active: true,
      headers: {},
      retry_config: {
        max_attempts: 3,
        backoff_seconds: [30, 300, 3600],
      },
    });
    setEditingWebhook(null);
  };

  const handleEdit = (webhook: any) => {
    setEditingWebhook(webhook);
    setFormData({
      name: webhook.name,
      url: webhook.url,
      secret_key: webhook.secret_key,
      description: webhook.description,
      events: webhook.events,
      is_active: webhook.is_active,
      headers: webhook.headers || {},
      retry_config: webhook.retry_config,
    });
    setIsDialogOpen(true);
  };

  const handleEventToggle = (eventValue: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(eventValue)
        ? prev.events.filter(e => e !== eventValue)
        : [...prev.events, eventValue],
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'failed': return 'bg-red-500';
      case 'retrying': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <XCircle className="h-4 w-4" />;
      case 'retrying': return <RefreshCw className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-60">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Actions et statistiques */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={() => processEvents()} disabled={isProcessing}>
            <Play className="h-4 w-4 mr-2" />
            Traiter événements
          </Button>
          <Button variant="outline" onClick={() => retryWebhooks()} disabled={isProcessing}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer échecs
          </Button>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingWebhook ? 'Modifier' : 'Créer'} un webhook</DialogTitle>
              <DialogDescription>
                Configurez un endpoint pour recevoir les événements RGPD
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Mon webhook"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/webhooks/gdpr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret">Clé secrète</Label>
                <Input
                  id="secret"
                  type="password"
                  value={formData.secret_key}
                  onChange={(e) => setFormData({ ...formData, secret_key: e.target.value })}
                  placeholder="Clé pour signer les payloads"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description du webhook"
                />
              </div>
              <div className="space-y-2">
                <Label>Événements</Label>
                <div className="space-y-2">
                  {EVENT_TYPES.map(event => (
                    <div key={event.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={event.value}
                        checked={formData.events.includes(event.value)}
                        onCheckedChange={() => handleEventToggle(event.value)}
                      />
                      <label htmlFor={event.value} className="text-sm cursor-pointer">
                        {event.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active">Actif</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit}>
                {editingWebhook ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="webhooks" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="deliveries">Envois récents</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="webhooks" className="space-y-4">
          {webhooks.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Aucun webhook configuré
                </p>
              </CardContent>
            </Card>
          ) : (
            webhooks.map(webhook => (
              <Card key={webhook.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Webhook className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{webhook.name}</CardTitle>
                        <CardDescription>{webhook.url}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={webhook.is_active ? 'default' : 'secondary'}>
                        {webhook.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(webhook)} aria-label="Modifier le webhook">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteWebhook(webhook.id)}
                        aria-label="Supprimer le webhook"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{webhook.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map(event => (
                      <Badge key={event} variant="outline">
                        {EVENT_TYPES.find(e => e.value === event)?.label || event}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="deliveries">
          <Card>
            <CardHeader>
              <CardTitle>Envois récents</CardTitle>
              <CardDescription>Historique des 100 derniers envois</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {deliveries.map(delivery => (
                    <div 
                      key={delivery.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getStatusColor(delivery.status)}/10`}>
                          {getStatusIcon(delivery.status)}
                        </div>
                        <div>
                          <p className="font-medium">{delivery.event_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(delivery.created_at), 'Pp', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={delivery.status === 'success' ? 'default' : 'destructive'}>
                          {delivery.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Tentative {delivery.attempts}/{delivery.max_attempts}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <div className="space-y-4">
            {stats.map(stat => (
              <Card key={stat.webhook_id}>
                <CardHeader>
                  <CardTitle>{stat.webhook_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold">{stat.total_deliveries}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Succès</p>
                      <p className="text-2xl font-bold text-green-500">{stat.successful_deliveries}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Taux de succès</p>
                      <p className="text-2xl font-bold">{stat.success_rate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Temps moyen</p>
                      <p className="text-2xl font-bold">
                        {stat.avg_delivery_time_seconds ? `${stat.avg_delivery_time_seconds.toFixed(1)}s` : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
