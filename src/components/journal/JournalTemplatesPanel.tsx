// @ts-nocheck
/**
 * Templates de journal personnalisables
 * Permet de créer des entrées pré-formatées par catégorie
 */

import { memo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { 
  FileText, 
  Heart, 
  Brain, 
  Sun, 
  Moon, 
  Trophy, 
  Lightbulb,
  Target,
  Smile,
  Frown,
  Zap,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface JournalTemplate {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: 'emotion' | 'gratitude' | 'reflection' | 'growth' | 'clinical';
  prompts: string[];
  color: string;
  isNew?: boolean;
  isPremium?: boolean;
}

const JOURNAL_TEMPLATES: JournalTemplate[] = [
  {
    id: 'morning-check',
    name: 'Check-in Matinal',
    description: 'Commencez la journée avec intention',
    icon: Sun,
    category: 'reflection',
    prompts: [
      '🌅 Comment je me sens ce matin ?',
      '🎯 Mes 3 priorités pour aujourd\'hui :',
      '💪 Une chose pour laquelle je suis reconnaissant(e) :',
      '✨ Mon intention pour la journée :'
    ],
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
  },
  {
    id: 'evening-review',
    name: 'Bilan du Soir',
    description: 'Réflexion et gratitude avant le repos',
    icon: Moon,
    category: 'gratitude',
    prompts: [
      '🌙 Comment s\'est passée ma journée ?',
      '🙏 3 choses positives d\'aujourd\'hui :',
      '📚 Ce que j\'ai appris :',
      '💭 Ce que je ferai différemment demain :'
    ],
    color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30'
  },
  {
    id: 'emotion-deep',
    name: 'Exploration Émotionnelle',
    description: 'Comprendre et exprimer vos émotions',
    icon: Heart,
    category: 'emotion',
    prompts: [
      '💭 Quelle émotion domine en ce moment ?',
      '🔍 Où est-ce que je la ressens dans mon corps ?',
      '📖 Qu\'est-ce qui a déclenché cette émotion ?',
      '🌱 De quoi ai-je besoin maintenant ?'
    ],
    color: 'bg-rose-500/10 text-rose-600 border-rose-500/30'
  },
  {
    id: 'cognitive-reframe',
    name: 'Recadrage Cognitif',
    description: 'Transformer les pensées négatives',
    icon: Brain,
    category: 'clinical',
    prompts: [
      '💭 La pensée qui me préoccupe :',
      '🔬 Preuves pour cette pensée :',
      '⚖️ Preuves contre cette pensée :',
      '🌟 Une perspective plus équilibrée :'
    ],
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    isPremium: true
  },
  {
    id: 'gratitude-journal',
    name: 'Journal de Gratitude',
    description: 'Cultivez la reconnaissance au quotidien',
    icon: Smile,
    category: 'gratitude',
    prompts: [
      '🙏 3 choses pour lesquelles je suis reconnaissant(e) :',
      '💕 Une personne qui a illuminé ma journée :',
      '🌟 Un petit moment de bonheur :',
      '✨ Ce qui me rend unique :'
    ],
    color: 'bg-green-500/10 text-green-600 border-green-500/30'
  },
  {
    id: 'anxiety-log',
    name: 'Journal d\'Anxiété',
    description: 'Suivre et comprendre l\'anxiété',
    icon: Frown,
    category: 'clinical',
    prompts: [
      '😰 Mon niveau d\'anxiété (1-10) :',
      '🎯 Ce qui a déclenché cette anxiété :',
      '💭 Les pensées associées :',
      '🛠️ Stratégies d\'apaisement utilisées :'
    ],
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
    isPremium: true
  },
  {
    id: 'achievement',
    name: 'Victoires du Jour',
    description: 'Célébrez vos accomplissements',
    icon: Trophy,
    category: 'growth',
    prompts: [
      '🏆 Ma plus grande victoire aujourd\'hui :',
      '💪 Un défi que j\'ai surmonté :',
      '📈 Comment j\'ai progressé :',
      '🎉 Je suis fier(e) de :'
    ],
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/30'
  },
  {
    id: 'insight',
    name: 'Déclic & Insight',
    description: 'Capturez vos prises de conscience',
    icon: Lightbulb,
    category: 'growth',
    prompts: [
      '💡 Le déclic que j\'ai eu :',
      '🔗 Ce que cela m\'apprend sur moi :',
      '🎯 Comment je vais utiliser cette prise de conscience :',
      '🌱 Ce que je veux explorer davantage :'
    ],
    color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30',
    isNew: true
  },
  {
    id: 'goals-tracker',
    name: 'Suivi d\'Objectifs',
    description: 'Progressez vers vos buts',
    icon: Target,
    category: 'growth',
    prompts: [
      '🎯 Mon objectif principal :',
      '📊 Ma progression cette semaine :',
      '🚧 Les obstacles rencontrés :',
      '📝 Prochaines étapes concrètes :'
    ],
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/30'
  },
  {
    id: 'energy-check',
    name: 'Bilan Énergétique',
    description: 'Comprenez vos niveaux d\'énergie',
    icon: Zap,
    category: 'reflection',
    prompts: [
      '⚡ Mon niveau d\'énergie (1-10) :',
      '🔋 Ce qui a rechargé mes batteries :',
      '😴 Ce qui m\'a vidé(e) :',
      '🌟 Ce dont j\'ai besoin pour récupérer :'
    ],
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
  },
  {
    id: 'learning-log',
    name: 'Journal d\'Apprentissage',
    description: 'Retenez ce que vous apprenez',
    icon: BookOpen,
    category: 'growth',
    prompts: [
      '📚 Ce que j\'ai appris aujourd\'hui :',
      '🤔 Ce que je ne comprends pas encore :',
      '🔗 Comment cela se connecte à ce que je sais :',
      '💡 Comment je vais appliquer cela :'
    ],
    color: 'bg-teal-500/10 text-teal-600 border-teal-500/30'
  },
  {
    id: 'free-write',
    name: 'Écriture Libre',
    description: 'Exprimez-vous sans contrainte',
    icon: FileText,
    category: 'reflection',
    prompts: [
      '✍️ Écrivez librement pendant 5 minutes...',
      '(Pas de règles, pas de jugement, juste vous et vos pensées)'
    ],
    color: 'bg-slate-500/10 text-slate-600 border-slate-500/30'
  }
];

const CATEGORY_LABELS: Record<JournalTemplate['category'], string> = {
  emotion: 'Émotions',
  gratitude: 'Gratitude',
  reflection: 'Réflexion',
  growth: 'Croissance',
  clinical: 'Thérapeutique'
};

interface JournalTemplatesPanelProps {
  onSelectTemplate: (template: JournalTemplate) => void;
  className?: string;
}

export const JournalTemplatesPanel = memo(function JournalTemplatesPanel({ 
  onSelectTemplate,
  className 
}: JournalTemplatesPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<JournalTemplate['category'] | 'all'>('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? JOURNAL_TEMPLATES 
    : JOURNAL_TEMPLATES.filter(t => t.category === selectedCategory);

  const categories = ['all', ...Object.keys(CATEGORY_LABELS)] as const;

  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Templates de Journal
        </CardTitle>
        <CardDescription>
          Choisissez un modèle pour guider votre écriture
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat as typeof selectedCategory)}
              className="text-xs"
            >
              {cat === 'all' ? 'Tous' : CATEGORY_LABELS[cat as JournalTemplate['category']]}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <ScrollArea className="h-[320px] pr-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {filteredTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-all hover:shadow-md",
                    template.color,
                    "hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span className="font-medium text-sm">{template.name}</span>
                    </div>
                    <div className="flex gap-1">
                      {template.isNew && (
                        <Badge variant="secondary" className="text-[10px] px-1.5">
                          Nouveau
                        </Badge>
                      )}
                      {template.isPremium && (
                        <Badge variant="default" className="text-[10px] px-1.5 bg-gradient-to-r from-amber-500 to-orange-500">
                          Pro
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                  <div className="text-[10px] text-muted-foreground/70 mt-1">
                    {template.prompts.length} prompts
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

export { JOURNAL_TEMPLATES };
