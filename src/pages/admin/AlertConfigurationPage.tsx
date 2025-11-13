import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Save, 
  Trash2, 
  Mail, 
  MessageSquare, 
  Bell,
  Settings,
  Filter,
  Clock,
  AlertCircle
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

interface AlertConfiguration {
  id: string;
  created_at: string;
  updated_at: string;
  enabled: boolean;
  name: string;
  description?: string;
  min_priority: 'urgent' | 'high' | 'medium' | 'low';
  min_severity: 'critical' | 'high' | 'medium' | 'low';
  included_categories: string[];
  excluded_categories: string[];
  notify_email: boolean;
  email_recipients: string[];
  notify_slack: boolean;
  slack_webhook_url?: string;
  slack_channel?: string;
  notify_discord: boolean;
  discord_webhook_url?: string;
  discord_username?: string;
  throttle_minutes: number;
  max_alerts_per_hour: number;
  require_alert_flag: boolean;
  last_triggered_at?: string;
}

const defaultConfig: Omit<AlertConfiguration, 'id' | 'created_at' | 'updated_at' | 'last_triggered_at'> = {
  enabled: true,
  name: '',
  description: '',
  min_priority: 'high',
  min_severity: 'high',
  included_categories: [],
  excluded_categories: [],
  notify_email: true,
  email_recipients: [],
  notify_slack: false,
  slack_webhook_url: '',
  slack_channel: '',
  notify_discord: false,
  discord_webhook_url: '',
  discord_username: 'EmotionsCare Monitor',
  throttle_minutes: 5,
  max_alerts_per_hour: 10,
  require_alert_flag: false,
};

const AlertConfigurationPage = () => {
  const queryClient = useQueryClient();
  const [editingConfig, setEditingConfig] = useState<Partial<AlertConfiguration> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');

  // Fetch configurations
  const { data: configs, isLoading } = useQuery({
    queryKey: ['alert-configurations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_configurations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AlertConfiguration[];
    },
  });

  // Create configuration
  const createMutation = useMutation({
    mutationFn: async (config: Omit<AlertConfiguration, 'id' | 'created_at' | 'updated_at' | 'last_triggered_at'>) => {
      const { data, error } = await supabase
        .from('alert_configurations')
        .insert([config])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-configurations'] });
      toast({ title: 'Configuration créée avec succès' });
      setIsDialogOpen(false);
      setEditingConfig(null);
    },
    onError: (error) => {
      toast({ 
        title: 'Erreur lors de la création', 
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  // Update configuration
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AlertConfiguration> & { id: string }) => {
      const { data, error } = await supabase
        .from('alert_configurations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-configurations'] });
      toast({ title: 'Configuration mise à jour avec succès' });
      setIsDialogOpen(false);
      setEditingConfig(null);
    },
    onError: (error) => {
      toast({ 
        title: 'Erreur lors de la mise à jour', 
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  // Delete configuration
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('alert_configurations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-configurations'] });
      toast({ title: 'Configuration supprimée avec succès' });
    },
    onError: (error) => {
      toast({ 
        title: 'Erreur lors de la suppression', 
        description: error.message,
        variant: 'destructive'
      });
    },
  });

  const handleSave = () => {
    if (!editingConfig?.name) {
      toast({ 
        title: 'Nom requis', 
        description: 'Veuillez saisir un nom pour la configuration',
        variant: 'destructive'
      });
      return;
    }

    if (editingConfig.id) {
      updateMutation.mutate(editingConfig as Partial<AlertConfiguration> & { id: string });
    } else {
      createMutation.mutate(editingConfig as Omit<AlertConfiguration, 'id' | 'created_at' | 'updated_at' | 'last_triggered_at'>);
    }
  };

  const handleAddEmail = () => {
    if (!emailInput || !editingConfig) return;
    
    const emails = editingConfig.email_recipients || [];
    if (!emails.includes(emailInput)) {
      setEditingConfig({
        ...editingConfig,
        email_recipients: [...emails, emailInput],
      });
      setEmailInput('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    if (!editingConfig) return;
    setEditingConfig({
      ...editingConfig,
      email_recipients: (editingConfig.email_recipients || []).filter(e => e !== email),
    });
  };

  const handleAddCategory = (type: 'included' | 'excluded') => {
    if (!categoryInput || !editingConfig) return;
    
    const field = type === 'included' ? 'included_categories' : 'excluded_categories';
    const categories = editingConfig[field] || [];
    
    if (!categories.includes(categoryInput)) {
      setEditingConfig({
        ...editingConfig,
        [field]: [...categories, categoryInput],
      });
      setCategoryInput('');
    }
  };

  const handleRemoveCategory = (category: string, type: 'included' | 'excluded') => {
    if (!editingConfig) return;
    
    const field = type === 'included' ? 'included_categories' : 'excluded_categories';
    setEditingConfig({
      ...editingConfig,
      [field]: (editingConfig[field] || []).filter(c => c !== category),
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuration des Alertes</h1>
          <p className="text-muted-foreground">
            Gérez les notifications pour les erreurs critiques détectées par l'IA
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingConfig(defaultConfig);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingConfig?.id ? 'Modifier la configuration' : 'Nouvelle configuration'}
              </DialogTitle>
              <DialogDescription>
                Configurez les seuils et les canaux de notification pour les alertes
              </DialogDescription>
            </DialogHeader>

            {editingConfig && (
              <div className="space-y-6 py-4">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="enabled">Configuration active</Label>
                    <Switch
                      id="enabled"
                      checked={editingConfig.enabled}
                      onCheckedChange={(enabled) => setEditingConfig({ ...editingConfig, enabled })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Nom *</Label>
                    <Input
                      id="name"
                      value={editingConfig.name}
                      onChange={(e) => setEditingConfig({ ...editingConfig, name: e.target.value })}
                      placeholder="Ex: Alertes critiques production"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editingConfig.description || ''}
                      onChange={(e) => setEditingConfig({ ...editingConfig, description: e.target.value })}
                      placeholder="Description optionnelle"
                      rows={2}
                    />
                  </div>
                </div>

                <Separator />

                {/* Thresholds */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <h3 className="text-lg font-semibold">Seuils et Filtres</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="min_priority">Priorité minimale</Label>
                      <Select
                        value={editingConfig.min_priority}
                        onValueChange={(value) => setEditingConfig({ ...editingConfig, min_priority: value as any })}
                      >
                        <SelectTrigger id="min_priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Basse</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="high">Haute</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="min_severity">Gravité minimale</Label>
                      <Select
                        value={editingConfig.min_severity}
                        onValueChange={(value) => setEditingConfig({ ...editingConfig, min_severity: value as any })}
                      >
                        <SelectTrigger id="min_severity">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Basse</SelectItem>
                          <SelectItem value="medium">Moyenne</SelectItem>
                          <SelectItem value="high">Haute</SelectItem>
                          <SelectItem value="critical">Critique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="require_alert_flag">Nécessite flag d'alerte AI</Label>
                    <Switch
                      id="require_alert_flag"
                      checked={editingConfig.require_alert_flag}
                      onCheckedChange={(require_alert_flag) => setEditingConfig({ ...editingConfig, require_alert_flag })}
                    />
                  </div>

                  {/* Categories */}
                  <div className="space-y-3">
                    <Label>Catégories incluses</Label>
                    <div className="flex gap-2">
                      <Input
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        placeholder="Ex: auth, api, typescript..."
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory('included')}
                      />
                      <Button type="button" onClick={() => handleAddCategory('included')} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(editingConfig.included_categories || []).map((cat) => (
                        <Badge key={cat} variant="secondary">
                          {cat}
                          <button
                            onClick={() => handleRemoveCategory(cat, 'included')}
                            className="ml-2 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Catégories exclues</Label>
                    <div className="flex gap-2">
                      <Input
                        value={categoryInput}
                        onChange={(e) => setCategoryInput(e.target.value)}
                        placeholder="Ex: ui, performance..."
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCategory('excluded')}
                      />
                      <Button type="button" onClick={() => handleAddCategory('excluded')} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(editingConfig.excluded_categories || []).map((cat) => (
                        <Badge key={cat} variant="destructive">
                          {cat}
                          <button
                            onClick={() => handleRemoveCategory(cat, 'excluded')}
                            className="ml-2 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Email Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <h3 className="text-lg font-semibold">Notifications Email</h3>
                    </div>
                    <Switch
                      checked={editingConfig.notify_email}
                      onCheckedChange={(notify_email) => setEditingConfig({ ...editingConfig, notify_email })}
                    />
                  </div>

                  {editingConfig.notify_email && (
                    <div className="space-y-3">
                      <Label>Destinataires</Label>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="email@example.com"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddEmail()}
                        />
                        <Button type="button" onClick={handleAddEmail} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(editingConfig.email_recipients || []).map((email) => (
                          <Badge key={email} variant="secondary">
                            {email}
                            <button
                              onClick={() => handleRemoveEmail(email)}
                              className="ml-2 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Slack Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <h3 className="text-lg font-semibold">Notifications Slack</h3>
                    </div>
                    <Switch
                      checked={editingConfig.notify_slack}
                      onCheckedChange={(notify_slack) => setEditingConfig({ ...editingConfig, notify_slack })}
                    />
                  </div>

                  {editingConfig.notify_slack && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="slack_webhook_url">Webhook URL *</Label>
                        <Input
                          id="slack_webhook_url"
                          type="url"
                          value={editingConfig.slack_webhook_url || ''}
                          onChange={(e) => setEditingConfig({ ...editingConfig, slack_webhook_url: e.target.value })}
                          placeholder="https://hooks.slack.com/services/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="slack_channel">Canal (optionnel)</Label>
                        <Input
                          id="slack_channel"
                          value={editingConfig.slack_channel || ''}
                          onChange={(e) => setEditingConfig({ ...editingConfig, slack_channel: e.target.value })}
                          placeholder="#alerts"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Discord Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      <h3 className="text-lg font-semibold">Notifications Discord</h3>
                    </div>
                    <Switch
                      checked={editingConfig.notify_discord}
                      onCheckedChange={(notify_discord) => setEditingConfig({ ...editingConfig, notify_discord })}
                    />
                  </div>

                  {editingConfig.notify_discord && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="discord_webhook_url">Webhook URL *</Label>
                        <Input
                          id="discord_webhook_url"
                          type="url"
                          value={editingConfig.discord_webhook_url || ''}
                          onChange={(e) => setEditingConfig({ ...editingConfig, discord_webhook_url: e.target.value })}
                          placeholder="https://discord.com/api/webhooks/..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="discord_username">Nom d'utilisateur</Label>
                        <Input
                          id="discord_username"
                          value={editingConfig.discord_username || ''}
                          onChange={(e) => setEditingConfig({ ...editingConfig, discord_username: e.target.value })}
                          placeholder="EmotionsCare Monitor"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Advanced Settings */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    <h3 className="text-lg font-semibold">Paramètres Avancés</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="throttle_minutes">Throttling (minutes)</Label>
                      <Input
                        id="throttle_minutes"
                        type="number"
                        min="0"
                        value={editingConfig.throttle_minutes}
                        onChange={(e) => setEditingConfig({ ...editingConfig, throttle_minutes: parseInt(e.target.value) || 0 })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Temps minimum entre deux alertes identiques
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max_alerts_per_hour">Max alertes/heure</Label>
                      <Input
                        id="max_alerts_per_hour"
                        type="number"
                        min="1"
                        value={editingConfig.max_alerts_per_hour}
                        onChange={(e) => setEditingConfig({ ...editingConfig, max_alerts_per_hour: parseInt(e.target.value) || 1 })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Nombre maximum d'alertes par heure
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    Enregistrer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Configurations List */}
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid gap-4">
          {isLoading ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Chargement...
              </CardContent>
            </Card>
          ) : !configs || configs.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                Aucune configuration trouvée
              </CardContent>
            </Card>
          ) : (
            configs.map((config) => (
              <Card key={config.id} className={!config.enabled ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {config.name}
                        {!config.enabled && <Badge variant="secondary">Désactivée</Badge>}
                      </CardTitle>
                      {config.description && (
                        <CardDescription>{config.description}</CardDescription>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingConfig(config);
                          setIsDialogOpen(true);
                        }}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) {
                            deleteMutation.mutate(config.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm font-medium">Priorité min.</div>
                      <Badge variant="outline">{config.min_priority}</Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Gravité min.</div>
                      <Badge variant="outline">{config.min_severity}</Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Throttling</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {config.throttle_minutes} min
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Max/heure</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <AlertCircle className="w-3 h-3" />
                        {config.max_alerts_per_hour}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {config.notify_email && (
                      <Badge variant="secondary">
                        <Mail className="w-3 h-3 mr-1" />
                        Email ({config.email_recipients.length})
                      </Badge>
                    )}
                    {config.notify_slack && (
                      <Badge variant="secondary">
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Slack
                      </Badge>
                    )}
                    {config.notify_discord && (
                      <Badge variant="secondary">
                        <Bell className="w-3 h-3 mr-1" />
                        Discord
                      </Badge>
                    )}
                  </div>

                  {config.included_categories.length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-2">Catégories incluses</div>
                      <div className="flex flex-wrap gap-1">
                        {config.included_categories.map((cat) => (
                          <Badge key={cat} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {config.last_triggered_at && (
                    <div className="text-xs text-muted-foreground">
                      Dernière alerte: {new Date(config.last_triggered_at).toLocaleString('fr-FR')}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlertConfigurationPage;
