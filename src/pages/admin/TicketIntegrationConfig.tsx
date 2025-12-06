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
import { Ticket, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

const TicketIntegrationConfig: React.FC = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<any>(null);

  const [formData, setFormData] = useState({
    integration_type: 'jira' as 'jira' | 'linear',
    name: '',
    api_url: '',
    api_token: '',
    project_key: '',
    default_assignee: '',
    is_active: true
  });

  const { data: integrations, isLoading } = useQuery({
    queryKey: ['ticket-integrations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ticket_integrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: autoTickets } = useQuery({
    queryKey: ['auto-created-tickets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auto_created_tickets')
        .select('*, unified_alerts(*), ticket_integrations(*)')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('ticket_integrations')
        .insert(data);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-integrations'] });
      toast.success('Intégration créée avec succès');
      resetForm();
    },
    onError: (error) => {
      logger.error('Create integration error:', error, 'PAGE');
      toast.error('Erreur lors de la création');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const { error } = await supabase
        .from('ticket_integrations')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-integrations'] });
      toast.success('Intégration mise à jour');
      resetForm();
    },
    onError: (error) => {
      logger.error('Update integration error:', error, 'PAGE');
      toast.error('Erreur lors de la mise à jour');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('ticket_integrations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-integrations'] });
      toast.success('Intégration supprimée');
    },
    onError: (error) => {
      logger.error('Delete integration error:', error, 'PAGE');
      toast.error('Erreur lors de la suppression');
    }
  });

  const resetForm = () => {
    setFormData({
      integration_type: 'jira',
      name: '',
      api_url: '',
      api_token: '',
      project_key: '',
      default_assignee: '',
      is_active: true
    });
    setEditingIntegration(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIntegration) {
      updateMutation.mutate({ id: editingIntegration.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (integration: any) => {
    setEditingIntegration(integration);
    setFormData({
      integration_type: integration.integration_type,
      name: integration.name,
      api_url: integration.api_url,
      api_token: integration.api_token,
      project_key: integration.project_key,
      default_assignee: integration.default_assignee || '',
      is_active: integration.is_active
    });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Intégrations Tickets</h1>
          <p className="text-muted-foreground mt-2">
            Configurez les intégrations Jira/Linear pour la création automatique de tickets
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle intégration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingIntegration ? 'Modifier' : 'Nouvelle'} intégration
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={formData.integration_type}
                    onValueChange={(value: 'jira' | 'linear') =>
                      setFormData(prev => ({ ...prev, integration_type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jira">Jira</SelectItem>
                      <SelectItem value="linear">Linear</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api_url">URL API</Label>
                <Input
                  id="api_url"
                  value={formData.api_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, api_url: e.target.value }))}
                  placeholder={formData.integration_type === 'jira' ? 'https://your-domain.atlassian.net' : 'https://api.linear.app/graphql'}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api_token">API Token</Label>
                <Input
                  id="api_token"
                  type="password"
                  value={formData.api_token}
                  onChange={(e) => setFormData(prev => ({ ...prev, api_token: e.target.value }))}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project_key">Clé Projet</Label>
                  <Input
                    id="project_key"
                    value={formData.project_key}
                    onChange={(e) => setFormData(prev => ({ ...prev, project_key: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="default_assignee">Assignee par défaut</Label>
                  <Input
                    id="default_assignee"
                    value={formData.default_assignee}
                    onChange={(e) => setFormData(prev => ({ ...prev, default_assignee: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label>Intégration active</Label>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingIntegration ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Intégrations configurées</CardTitle>
            <CardDescription>{integrations?.length || 0} intégration(s)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {integrations?.map((integration) => (
              <div key={integration.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">{integration.name}</span>
                    <Badge variant={integration.integration_type === 'jira' ? 'default' : 'secondary'}>
                      {integration.integration_type}
                    </Badge>
                    {integration.is_active ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-500/10">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{integration.project_key}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(integration)} aria-label="Modifier l'intégration">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(integration.id)}
                    aria-label="Supprimer l'intégration"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {!integrations?.length && (
              <p className="text-center text-muted-foreground py-8">
                Aucune intégration configurée
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tickets créés automatiquement</CardTitle>
            <CardDescription>20 derniers tickets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {autoTickets?.map((ticket) => (
              <div key={ticket.id} className="p-3 border border-border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{ticket.ticket_key}</Badge>
                      <Badge variant={ticket.ticket_integrations?.integration_type === 'jira' ? 'default' : 'secondary'}>
                        {ticket.ticket_integrations?.integration_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {ticket.unified_alerts?.message?.substring(0, 80)}...
                    </p>
                  </div>
                  {ticket.ticket_url && (
                    <Button variant="ghost" size="icon" asChild aria-label="Ouvrir le ticket">
                      <a href={ticket.ticket_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
                {ticket.ml_suggested_assignee && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-600">
                      ML: {ticket.ml_suggested_assignee}
                    </Badge>
                    <span>Confiance: {(ticket.ml_confidence * 100).toFixed(0)}%</span>
                  </div>
                )}
              </div>
            ))}
            {!autoTickets?.length && (
              <p className="text-center text-muted-foreground py-8">
                Aucun ticket créé automatiquement
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketIntegrationConfig;