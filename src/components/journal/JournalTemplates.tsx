import { memo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Heart, Target, Lightbulb, Sparkles, TrendingUp } from 'lucide-react';

interface Template {
  id: string;
  title: string;
  category: 'gratitude' | 'reflection' | 'goals' | 'creativity' | 'mindfulness' | 'emotions';
  content: string;
  icon: typeof Heart;
}

interface JournalTemplatesProps {
  onUseTemplate: (content: string) => void;
  className?: string;
}

const templates: Template[] = [
  {
    id: 'gratitude-1',
    title: '3 choses positives',
    category: 'gratitude',
    content: "Aujourd'hui, je suis reconnaissant(e) pour :\n1. \n2. \n3. \n\nCe qui m'a fait sourire : ",
    icon: Heart,
  },
  {
    id: 'reflection-1',
    title: 'Bilan de journée',
    category: 'reflection',
    content: "Ma journée en quelques mots :\n\nCe qui s'est bien passé :\n\nCe que j'aurais pu améliorer :\n\nCe que j'ai appris :",
    icon: Lightbulb,
  },
  {
    id: 'goals-1',
    title: 'Objectifs hebdomadaires',
    category: 'goals',
    content: "Mes 3 objectifs pour cette semaine :\n1. \n2. \n3. \n\nPremières actions à entreprendre :",
    icon: Target,
  },
  {
    id: 'emotions-1',
    title: 'Météo émotionnelle',
    category: 'emotions',
    content: "Comment je me sens aujourd'hui :\n\nCe qui influence mon humeur :\n\nCe dont j'ai besoin maintenant :",
    icon: Sparkles,
  },
  {
    id: 'creativity-1',
    title: 'Idées créatives',
    category: 'creativity',
    content: "Mes idées du jour :\n\nCe qui m'inspire actuellement :\n\nProjet à explorer :",
    icon: Lightbulb,
  },
  {
    id: 'mindfulness-1',
    title: 'Moment présent',
    category: 'mindfulness',
    content: "En cet instant :\n- Ce que je vois : \n- Ce que j'entends : \n- Ce que je ressens : \n\nMa respiration est :",
    icon: TrendingUp,
  },
];

const categoryConfig = {
  gratitude: { label: 'Gratitude', color: 'bg-green-500/10 text-green-700 dark:text-green-400' },
  reflection: { label: 'Réflexion', color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400' },
  goals: { label: 'Objectifs', color: 'bg-purple-500/10 text-purple-700 dark:text-purple-400' },
  creativity: { label: 'Créativité', color: 'bg-orange-500/10 text-orange-700 dark:text-orange-400' },
  mindfulness: { label: 'Pleine conscience', color: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' },
  emotions: { label: 'Émotions', color: 'bg-pink-500/10 text-pink-700 dark:text-pink-400' },
};

/**
 * Composant de sélection de templates de journal pré-définis
 */
export const JournalTemplates = memo<JournalTemplatesProps>(({ onUseTemplate, className = '' }) => {
  const [activeCategory, setActiveCategory] = useState<Template['category']>('gratitude');

  const filteredTemplates = templates.filter(t => t.category === activeCategory);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" aria-hidden="true" />
          Templates de journal
        </CardTitle>
        <CardDescription>
          Utilisez un modèle pré-défini pour démarrer votre écriture
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as Template['category'])}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {Object.entries(categoryConfig).map(([key, config]) => (
              <TabsTrigger key={key} value={key} className="text-xs">
                {config.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(categoryConfig).map(category => (
            <TabsContent key={category} value={category} className="space-y-3 mt-4">
              {filteredTemplates.map(template => {
                const Icon = template.icon;
                return (
                  <Card key={template.id} className="border-dashed">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                          <h4 className="font-semibold text-sm">{template.title}</h4>
                        </div>
                        <Badge variant="secondary" className={categoryConfig[template.category].color}>
                          {categoryConfig[template.category].label}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap mb-3 line-clamp-3">
                        {template.content}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => onUseTemplate(template.content)}
                      >
                        Utiliser ce template
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
});

JournalTemplates.displayName = 'JournalTemplates';
