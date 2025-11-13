import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Save, 
  Trash2, 
  Mail, 
  MessageSquare, 
  Bell,
  Eye,
  Code,
  Copy
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface AlertTemplate {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description?: string;
  template_type: 'email' | 'slack' | 'discord';
  subject?: string;
  body: string;
  available_variables: string[];
  is_default: boolean;
  last_used_at?: string;
}

const TEMPLATE_VARIABLES = [
  { name: 'errorMessage', description: 'Message d\'erreur' },
  { name: 'severity', description: 'Gravité (critical, high, medium, low)' },
  { name: 'priority', description: 'Priorité (urgent, high, medium, low)' },
  { name: 'category', description: 'Catégorie de l\'erreur' },
  { name: 'analysis', description: 'Analyse AI détaillée' },
  { name: 'suggestedFix', description: 'Solution suggérée' },
  { name: 'autoFixCode', description: 'Code de correction automatique (optionnel)' },
  { name: 'preventionTips', description: 'Conseils de prévention (tableau)' },
  { name: 'url', description: 'URL où l\'erreur s\'est produite' },
  { name: 'timestamp', description: 'Horodatage de l\'erreur' },
  { name: 'errorId', description: 'ID unique de l\'erreur' },
  { name: 'dashboardUrl', description: 'URL du dashboard de monitoring' },
];

const EXAMPLE_DATA = {
  errorMessage: 'TypeError: Cannot read property \'user\' of undefined',
  severity: 'critical',
  priority: 'urgent',
  category: 'react-hooks',
  analysis: 'L\'erreur se produit lors de l\'accès à la propriété user d\'un objet undefined. Cela indique probablement un problème de timing où le composant essaie d\'accéder aux données avant qu\'elles ne soient chargées.',
  suggestedFix: 'Ajouter une vérification de nullité ou utiliser optional chaining (?.) avant d\'accéder à la propriété.',
  autoFixCode: 'const userName = data?.user?.name || \'Unknown\';',
  preventionTips: [
    'Toujours vérifier si les données sont chargées avant de les utiliser',
    'Utiliser TypeScript strict mode pour détecter ces erreurs',
    'Implémenter des états de chargement appropriés'
  ],
  url: 'https://app.emotionscare.com/dashboard',
  timestamp: new Date().toISOString(),
  errorId: 'err_' + Math.random().toString(36).substr(2, 9),
  dashboardUrl: 'https://app.emotionscare.com/admin/ai-monitoring',
};

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

  const renderPreview = () => {
    if (!editingTemplate?.body) return null;

    let preview = editingTemplate.body;
    
    // Simple variable replacement for preview
    Object.entries(EXAMPLE_DATA).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      if (Array.isArray(value)) {
        preview = preview.replace(regex, value.join(', '));
      } else {
        preview = preview.replace(regex, String(value));
      }
    });

    // Handle conditionals (simplified)
    preview = preview.replace(/{{#if \w+}}[\s\S]*?{{\/if}}/g, (match) => {
      return match.replace(/{{#if \w+}}|{{\/if}}/g, '');
    });

    // Handle loops (simplified)
    preview = preview.replace(/{{#each preventionTips}}[\s\S]*?{{\/each}}/g, 
      EXAMPLE_DATA.preventionTips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')
    );

    return preview;
  };

  const insertVariable = (variableName: string) => {
    if (!editingTemplate || !editingTemplate.body) return;
    
    const textarea = document.getElementById('template-body') as HTMLTextAreaElement;
    const cursorPos = textarea?.selectionStart || editingTemplate.body.length;
    const textBefore = editingTemplate.body.substring(0, cursorPos);
    const textAfter = editingTemplate.body.substring(cursorPos);
    
    setEditingTemplate({
      ...editingTemplate,
      body: `${textBefore}{{${variableName}}}${textAfter}`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'slack': return <MessageSquare className="w-4 h-4" />;
      case 'discord': return <Bell className="w-4 h-4" />;
      default: return null;
    }
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
            <Button 
              onClick={() => {
                setEditingTemplate({
                  name: '',
                  template_type: 'email',
                  body: '',
                  is_default: false,
                });
                setPreviewMode(false);
                setIsDialogOpen(true);
              }}
            >
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
              <div className="grid grid-cols-3 gap-4 py-4">
                {/* Left: Form */}
                <div className="col-span-2 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom *</Label>
                    <Input
                      id="name"
                      value={editingTemplate.name}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                      placeholder="Ex: Email critique personnalisé"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template_type">Type *</Label>
                    <Select
                      value={editingTemplate.template_type}
                      onValueChange={(value) => setEditingTemplate({ ...editingTemplate, template_type: value as any })}
                    >
                      <SelectTrigger id="template_type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="slack">Slack</SelectItem>
                        <SelectItem value="discord">Discord</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {editingTemplate.template_type === 'email' && (
                    <div className="space-y-2">
                      <Label htmlFor="subject">Sujet</Label>
                      <Input
                        id="subject"
                        value={editingTemplate.subject || ''}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                        placeholder="Ex: 🚨 {{category}} - {{priority}}"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="template-body">Corps du message *</Label>
                    <Textarea
                      id="template-body"
                      value={editingTemplate.body}
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                      placeholder="Utilisez {{variableName}} pour les variables dynamiques"
                      rows={12}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setPreviewMode(!previewMode)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {previewMode ? 'Éditer' : 'Prévisualiser'}
                    </Button>
                  </div>

                  {previewMode && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Prévisualisation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap">{renderPreview()}</pre>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right: Variables */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        Variables disponibles
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-2">
                          {TEMPLATE_VARIABLES.map((variable) => (
                            <div
                              key={variable.name}
                              className="p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
                              onClick={() => insertVariable(variable.name)}
                            >
                              <div className="flex items-center justify-between">
                                <code className="text-xs font-mono">{`{{${variable.name}}}`}</code>
                                <Button variant="ghost" size="sm" onClick={() => insertVariable(variable.name)}>
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {variable.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="slack">Slack</TabsTrigger>
          <TabsTrigger value="discord">Discord</TabsTrigger>
        </TabsList>

        {['all', 'email', 'slack', 'discord'].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid gap-4">
              {isLoading ? (
                <Card>
                  <CardContent className="py-10 text-center text-muted-foreground">
                    Chargement...
                  </CardContent>
                </Card>
              ) : (
                templates
                  ?.filter((t) => tab === 'all' || t.template_type === tab)
                  .map((template) => (
                    <Card key={template.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                              {getTypeIcon(template.template_type)}
                              {template.name}
                              {template.is_default && <Badge variant="secondary">Par défaut</Badge>}
                            </CardTitle>
                            {template.description && (
                              <CardDescription>{template.description}</CardDescription>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingTemplate(template);
                                setPreviewMode(false);
                                setIsDialogOpen(true);
                              }}
                            >
                              Modifier
                            </Button>
                            {!template.is_default && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Êtes-vous sûr de vouloir supprimer ce template ?')) {
                                    deleteMutation.mutate(template.id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{template.template_type}</Badge>
                            {template.last_used_at && (
                              <span className="text-xs text-muted-foreground">
                                Dernière utilisation: {new Date(template.last_used_at).toLocaleDateString('fr-FR')}
                              </span>
                            )}
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <pre className="text-xs whitespace-pre-wrap font-mono">
                              {template.body.substring(0, 200)}...
                            </pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default AlertTemplatesPage;
