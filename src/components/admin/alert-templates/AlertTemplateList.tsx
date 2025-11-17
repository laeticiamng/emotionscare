import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Mail, MessageSquare, Bell, Trash2 } from 'lucide-react';
import { AlertTemplate } from './types';

interface AlertTemplateListProps {
  templates: AlertTemplate[] | undefined;
  isLoading: boolean;
  onEdit: (template: AlertTemplate) => void;
  onDelete: (id: string) => void;
}

export const AlertTemplateList = ({
  templates,
  isLoading,
  onEdit,
  onDelete,
}: AlertTemplateListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'slack':
        return <MessageSquare className="w-4 h-4" />;
      case 'discord':
        return <Bell className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleDeleteClick = (id: string) => {
    setTemplateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (templateToDelete) {
      onDelete(templateToDelete);
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const renderTemplateCard = (template: AlertTemplate) => (
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
              onClick={() => onEdit(template)}
            >
              Modifier
            </Button>
            {!template.is_default && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteClick(template.id)}
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
  );

  return (
    <>
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
                  .map((template) => renderTemplateCard(template))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Ce template sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setTemplateToDelete(null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
