import { memo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  FileText,
  Sparkles,
  Target,
  Heart,
  Brain,
  Calendar,
  TrendingUp,
  Plus,
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface JournalTemplate {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  category: 'reflection' | 'gratitude' | 'goals' | 'emotions' | 'daily' | 'custom';
  content: string;
  tags: string[];
}

interface JournalTemplatesProps {
  onUseTemplate: (template: JournalTemplate) => void;
  className?: string;
}

const DEFAULT_TEMPLATES: JournalTemplate[] = [
  {
    id: 'gratitude-daily',
    name: 'Gratitude quotidienne',
    description: 'Notez trois choses pour lesquelles vous êtes reconnaissant',
    icon: Heart,
    category: 'gratitude',
    content: `Aujourd'hui, je suis reconnaissant pour :

1. 
2. 
3. 

Ce qui m'a apporté le plus de joie aujourd'hui :

`,
    tags: ['gratitude', 'quotidien'],
  },
  {
    id: 'reflection-evening',
    name: 'Réflexion du soir',
    description: 'Bilan de votre journée',
    icon: Brain,
    category: 'reflection',
    content: `Réflexion du soir - ${new Date().toLocaleDateString()}

Ce qui s'est bien passé aujourd'hui :

Ce que j'aurais pu améliorer :

Ce que j'ai appris :

Mon ressenti général :

`,
    tags: ['réflexion', 'soir'],
  },
  {
    id: 'goals-weekly',
    name: 'Objectifs hebdomadaires',
    description: 'Planifiez vos objectifs pour la semaine',
    icon: Target,
    category: 'goals',
    content: `Objectifs de la semaine

Objectifs principaux :
- 
- 
- 

Habitudes à maintenir :
- 
- 

Ce que je veux accomplir :

`,
    tags: ['objectifs', 'planification'],
  },
  {
    id: 'emotions-check',
    name: 'Check-in émotionnel',
    description: 'Explorez vos émotions du moment',
    icon: Sparkles,
    category: 'emotions',
    content: `Check-in émotionnel

Comment je me sens en ce moment :

Les émotions que je ressens :

Ce qui a déclenché ces émotions :

Ce dont j'ai besoin maintenant :

`,
    tags: ['émotions', 'bien-être'],
  },
  {
    id: 'daily-log',
    name: 'Journal quotidien',
    description: 'Format simple pour capturer votre journée',
    icon: Calendar,
    category: 'daily',
    content: `${new Date().toLocaleDateString()}

Aujourd'hui :

Humeur : 

Points positifs :

Défis rencontrés :

Notes diverses :

`,
    tags: ['quotidien', 'journal'],
  },
  {
    id: 'progress-review',
    name: 'Suivi de progrès',
    description: 'Évaluez vos progrès sur un objectif',
    icon: TrendingUp,
    category: 'goals',
    content: `Suivi de progrès

Objectif en cours :

Progrès réalisés :

Obstacles rencontrés :

Prochaines étapes :

Ce que je célèbre :

`,
    tags: ['progrès', 'objectifs'],
  },
];

/**
 * Gestionnaire de templates de notes
 * Permet d'utiliser des modèles pré-remplis pour démarrer rapidement
 */
export const JournalTemplates = memo<JournalTemplatesProps>(({ onUseTemplate, className = '' }) => {
  const [templates, setTemplates] = useState<JournalTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<JournalTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    content: '',
    tags: '',
  });

  const handleUseTemplate = (template: JournalTemplate) => {
    onUseTemplate(template);
  };

  const handlePreview = (template: JournalTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleCreateCustom = () => {
    if (!newTemplate.name || !newTemplate.content) return;

    const customTemplate: JournalTemplate = {
      id: `custom-${Date.now()}`,
      name: newTemplate.name,
      description: newTemplate.description || 'Template personnalisé',
      icon: Plus,
      category: 'custom',
      content: newTemplate.content,
      tags: newTemplate.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    setTemplates([...templates, customTemplate]);
    setNewTemplate({ name: '', description: '', content: '', tags: '' });
    setIsCreateOpen(false);
  };

  const getCategoryLabel = (category: JournalTemplate['category']): string => {
    const labels = {
      reflection: 'Réflexion',
      gratitude: 'Gratitude',
      goals: 'Objectifs',
      emotions: 'Émotions',
      daily: 'Quotidien',
      custom: 'Personnalisé',
    };
    return labels[category];
  };

  const getCategoryColor = (category: JournalTemplate['category']): string => {
    const colors = {
      reflection: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      gratitude: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      goals: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      emotions: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      daily: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      custom: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    };
    return colors[category];
  };

  return (
    <>
      <Card className={className}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" aria-hidden="true" />
                Templates de notes
              </CardTitle>
              <CardDescription>
                Utilisez des modèles pour démarrer rapidement vos notes
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateOpen(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              Créer un template
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card key={template.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="space-y-2">
                      <div className="flex items-start justify-between">
                        <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
                        <Badge className={getCategoryColor(template.category)} variant="secondary">
                          {getCategoryLabel(template.category)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handlePreview(template)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          Aperçu
                        </Button>
                        <Button
                          onClick={() => handleUseTemplate(template)}
                          size="sm"
                          className="flex-1"
                        >
                          Utiliser
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
            <DialogDescription>{selectedTemplate?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {selectedTemplate?.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {selectedTemplate?.content}
              </pre>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Fermer
            </Button>
            <Button
              onClick={() => {
                if (selectedTemplate) {
                  handleUseTemplate(selectedTemplate);
                  setIsPreviewOpen(false);
                }
              }}
            >
              Utiliser ce template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Custom Template Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Créer un template personnalisé</DialogTitle>
            <DialogDescription>
              Créez votre propre modèle de note réutilisable
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template-name">Nom du template</Label>
              <Input
                id="template-name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="ex: Ma routine matinale"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-description">Description</Label>
              <Input
                id="template-description"
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="ex: Template pour ma routine du matin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-content">Contenu</Label>
              <Textarea
                id="template-content"
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                placeholder="Écrivez le contenu de votre template..."
                className="min-h-[200px] font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-tags">Tags (séparés par des virgules)</Label>
              <Input
                id="template-tags"
                value={newTemplate.tags}
                onChange={(e) => setNewTemplate({ ...newTemplate, tags: e.target.value })}
                placeholder="ex: routine, matin, bien-être"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateCustom} disabled={!newTemplate.name || !newTemplate.content}>
              Créer le template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

JournalTemplates.displayName = 'JournalTemplates';
