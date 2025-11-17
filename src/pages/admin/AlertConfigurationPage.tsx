import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  AlertConfigForm,
  AlertConfigList,
  defaultConfig,
  type AlertConfiguration
} from '@/components/admin/alert-configuration';

const AlertConfigurationPage = () => {
  const queryClient = useQueryClient();
  const [editingConfig, setEditingConfig] = useState<Partial<AlertConfiguration> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  const handleConfigChange = (updates: Partial<AlertConfiguration>) => {
    setEditingConfig(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleEdit = (config: AlertConfiguration) => {
    setEditingConfig(config);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
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
              <AlertConfigForm
                config={editingConfig}
                onConfigChange={handleConfigChange}
                onSave={handleSave}
                onCancel={() => setIsDialogOpen(false)}
                isSaving={createMutation.isPending || updateMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Configurations List */}
      <AlertConfigList
        configs={configs}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AlertConfigurationPage;
