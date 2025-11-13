import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bell, Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';

const eventOptions = [
  { value: 'ab_test_significant', label: 'Test A/B significatif' },
  { value: 'ticket_created', label: 'Ticket créé automatiquement' },
  { value: 'alert_critical', label: 'Alerte critique' },
  { value: 'escalation_high', label: 'Escalade niveau élevé' }
];

const NotificationWebhooksConfig: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    webhook_type: 'slack' as 'slack' | 'discord',
    webhook_url: '',
    channel: '',
    enabled: true,
    events: ['ab_test_significant', 'ticket_created']
  });

  const { data: webhooks, isLoading } = useQuery({
    queryKey: ['notification-webhooks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_webhooks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('notification_webhooks')
        .insert(data);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-webhooks'] });
      toast.success('Webhook créé avec succès');
      resetForm();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const { error } = await supabase
        .from('notification_webhooks')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-webhooks'] });
      toast.success('Webhook mis à jour');
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notification_webhooks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-webhooks'] });
      toast.success('Webhook supprimé');
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      webhook_type: 'slack',
      webhook_url: '',
      channel: '',
      enabled: true,
      events: ['ab_test_significant', 'ticket_created']
    });
    setEditingWebhook(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (webhook: any) => {
    setEditingWebhook(webhook);
    setFormData({
      name: webhook.name,
      webhook_type: webhook.webhook_type,
      webhook_url: webhook.webhook_url,
      channel: webhook.channel || '',
      enabled: webhook.enabled,
      events: webhook.events
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.webhook_url) {
      toast.error('Nom et URL du webhook requis');
      return;
    }

    if (editingWebhook) {
      updateMutation.mutate({ id: editingWebhook.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const toggleEventSelection = (eventValue: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.includes(eventValue)
        ? prev.events.filter(e => e !== eventValue)
        : [...prev.events, eventValue]
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="h-8 w-8 text-primary" />
            Notifications Slack/Discord
          </h1>
          <p className="text-muted-foreground mt-2">
            Configurez les webhooks pour recevoir des notifications automatiques
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Webhook
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingWebhook ? 'Modifier le Webhook' : 'Créer un Webhook'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du webhook</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Production Alerts"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook_type">Type</Label>
                <Select
                  value={formData.webhook_type}
                  onValueChange={(value: 'slack' | 'discord') =>
                    setFormData({ ...formData, webhook_type: value })
                  }
                >
                  <SelectTrigger id="webhook_type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="slack">Slack</SelectItem>
                    <SelectItem value="discord">Discord</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook_url">URL du Webhook</Label>
                <Input
                  id="webhook_url"
                  type="url"
                  value={formData.webhook_url}
                  onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                  placeholder="https://hooks.slack.com/services/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="channel">Canal (optionnel)</Label>
                <Input
                  id="channel"
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                  placeholder="#alerts"
                />
              </div>

              <div className="space-y-3">
                <Label>Événements à notifier</Label>
                <div className="space-y-2">
                  {eventOptions.map((event) => (
                    <div key={event.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={event.value}
                        checked={formData.events.includes(event.value)}
                        onCheckedChange={() => toggleEventSelection(event.value)}
                      />
                      <label
                        htmlFor={event.value}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {event.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enabled">Webhook actif</Label>
                <Switch
                  id="enabled"
                  checked={formData.enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit}>
                  {editingWebhook ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Chargement...</p>
          </CardContent>
        </Card>
      ) : webhooks && webhooks.length > 0 ? (
        <div className="grid gap-4">
          {webhooks.map((webhook) => (
            <Card key={webhook.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle>{webhook.name}</CardTitle>
                    <Badge variant={webhook.enabled ? 'default' : 'secondary'}>
                      {webhook.enabled ? 'Actif' : 'Inactif'}
                    </Badge>
                    <Badge variant="outline">
                      {webhook.webhook_type === 'slack' ? 'Slack' : 'Discord'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEdit(webhook)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteMutation.mutate(webhook.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {webhook.channel && (
                  <CardDescription>Canal : {webhook.channel}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-2">Événements notifiés :</p>
                    <div className="flex flex-wrap gap-2">
                      {webhook.events.map((event: string) => (
                        <Badge key={event} variant="secondary" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {eventOptions.find(e => e.value === event)?.label || event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-mono truncate">
                      {webhook.webhook_url}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">Aucun webhook configuré</p>
              <p className="text-sm text-muted-foreground">
                Créez votre premier webhook pour recevoir des notifications
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationWebhooksConfig;
