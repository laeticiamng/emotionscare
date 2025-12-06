import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, RotateCcw, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function TemplateVersioning({ templateId }: { templateId: string }) {
  const queryClient = useQueryClient();

  const { data: versions } = useQuery({
    queryKey: ['template-versions', templateId],
    queryFn: async () => {
      const { data } = await supabase
        .from('template_versions')
        .select('*')
        .eq('template_id', templateId)
        .order('version_number', { ascending: false });
      return data || [];
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (versionId: string) => {
      const version = versions?.find(v => v.id === versionId);
      if (!version) throw new Error('Version not found');

      // Créer une nouvelle version avec le contenu restauré
      const { error: insertError } = await supabase
        .from('template_versions')
        .insert({
          template_id: templateId,
          version_number: (versions?.[0]?.version_number || 0) + 1,
          config: version.config,
          change_description: `Restauration de la version ${version.version_number}`,
        });

      if (insertError) throw insertError;

      // Mettre à jour le template actuel
      const { error: updateError } = await supabase
        .from('pdf_templates')
        .update({
          name: version.config.name,
          primary_color: version.config.primaryColor,
          logo_url: version.config.logo,
          sections: version.config.sections,
        })
        .eq('id', templateId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-versions', templateId] });
      toast.success('Version restaurée');
    },
  });

  const createVersionMutation = useMutation({
    mutationFn: async (changeDescription: string) => {
      // Récupérer le template actuel
      const { data: template } = await supabase
        .from('pdf_templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (!template) throw new Error('Template not found');

      const { error } = await supabase
        .from('template_versions')
        .insert({
          template_id: templateId,
          version_number: (versions?.[0]?.version_number || 0) + 1,
          config: {
            name: template.name,
            primaryColor: template.primary_color,
            logo: template.logo_url,
            sections: template.sections,
          },
          change_description: changeDescription,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['template-versions', templateId] });
      toast.success('Version sauvegardée');
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Historique des Versions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => {
            const description = prompt('Description des modifications:');
            if (description) createVersionMutation.mutate(description);
          }}
          className="w-full"
        >
          Sauvegarder Version Actuelle
        </Button>

        <div className="space-y-2">
          {versions?.map((version) => (
            <div key={version.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">v{version.version_number}</Badge>
                  <span className="text-sm font-medium">{version.config.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{version.change_description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(version.created_at).toLocaleString('fr-FR')}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    // Prévisualiser la version
                    toast.info('Prévisualisation: ' + version.config.name);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    if (confirm('Restaurer cette version ?')) {
                      restoreMutation.mutate(version.id);
                    }
                  }}
                  disabled={restoreMutation.isPending}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
