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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertTemplate,
  AlertTemplateForm,
  AlertTemplateList,
} from '@/components/admin/alert-templates';

const AlertTemplatesPage = () => {
  const queryClient = useQueryClient();
  const [editingTemplate, setEditingTemplate] = useState<Partial<AlertTemplate> | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch templates
  const { data: templates, isLoading } = useQuery({
    queryKey: ['alert-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AlertTemplate[];
    },
  });

  // Create template
  const createMutation = useMutation({
    mutationFn: async (template: Omit<AlertTemplate, 'id' | 'created_at' | 'updated_at' | 'last_used_at' | 'available_variables'>) => {
      const { data, error } = await supabase
        .from('alert_templates')
        .insert([template])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-templates'] });
      toast({ title: 'Template créé avec succès' });
      setIsDialogOpen(false);
      setEditingTemplate(null);
      setPreviewMode(false);
    },
  });

  // Update template
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AlertTemplate> & { id: string }) => {
      const { data, error } = await supabase
        .from('alert_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-templates'] });
      toast({ title: 'Template mis à jour avec succès' });
      setIsDialogOpen(false);
      setEditingTemplate(null);
      setPreviewMode(false);
    },
  });

  // Delete template
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('alert_templates')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-templates'] });
      toast({ title: 'Template supprimé avec succès' });
    },
  });

  const handleSave = () => {
    if (!editingTemplate?.name || !editingTemplate?.body || !editingTemplate?.template_type) {
      toast({
        title: 'Champs requis manquants',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive'
      });
      return;
    }

    if (editingTemplate.id) {
      updateMutation.mutate(editingTemplate as Partial<AlertTemplate> & { id: string });
    } else {
      createMutation.mutate(editingTemplate as any);
    }
  };

  const handleNewTemplate = () => {
    setEditingTemplate({
      name: '',
      template_type: 'email',
      body: '',
      is_default: false,
    });
    setPreviewMode(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (template: AlertTemplate) => {
    setEditingTemplate(template);
    setPreviewMode(false);
    setIsDialogOpen(true);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setEditingTemplate(null);
    setPreviewMode(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates de Notifications</h1>
          <p className="text-muted-foreground">
            Personnalisez les messages d'alerte avec des variables dynamiques
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleNewTemplate}>
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate?.id ? 'Modifier le template' : 'Nouveau template'}
              </DialogTitle>
              <DialogDescription>
                {'Utilisez {{variableName}} pour insérer des variables dynamiques'}
              </DialogDescription>
            </DialogHeader>

            {editingTemplate && (
              <AlertTemplateForm
                template={editingTemplate}
                onTemplateChange={setEditingTemplate}
                onSave={handleSave}
                onCancel={handleCancel}
                isSaving={createMutation.isPending || updateMutation.isPending}
                previewMode={previewMode}
                onTogglePreview={() => setPreviewMode(!previewMode)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates List */}
      <AlertTemplateList
        templates={templates}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </div>
  );
};

export default AlertTemplatesPage;
