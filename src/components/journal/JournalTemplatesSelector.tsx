/**
 * JournalTemplatesSelector - Templates métier pour soignants
 * Facilite la saisie rapide avec prompts pré-configurés
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Stethoscope, 
  Heart, 
  Brain, 
  Coffee, 
  Users, 
  AlertCircle,
  Sparkles,
  Clock,
  LucideIcon
} from 'lucide-react';

export interface JournalTemplate {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  prompts: string[];
  category: 'healthcare' | 'personal' | 'work' | 'emotional';
  isNew?: boolean;
}

const JOURNAL_TEMPLATES: JournalTemplate[] = [
  // Templates métier soignants
  {
    id: 'post-garde',
    title: 'Fin de Garde',
    description: 'Débriefer après une garde ou shift long',
    icon: Clock,
    color: 'bg-primary/10 text-primary',
    category: 'healthcare',
    isNew: true,
    prompts: [
      'Comment s\'est passée cette garde ?',
      'Y a-t-il eu des moments difficiles à digérer ?',
      'Qu\'est-ce qui m\'a donné de l\'énergie ?',
      'Comment je me sens physiquement et émotionnellement ?'
    ]
  },
  {
    id: 'patient-difficile',
    title: 'Situation Difficile',
    description: 'Après une prise en charge émotionnellement lourde',
    icon: AlertCircle,
    color: 'bg-warning/10 text-warning',
    category: 'healthcare',
    isNew: true,
    prompts: [
      'Quelle situation m\'a marqué(e) aujourd\'hui ?',
      'Quelles émotions ai-je ressenti sur le moment ?',
      'Comment ai-je réagi ?',
      'De quoi aurais-je besoin pour mieux gérer à l\'avenir ?'
    ]
  },
  {
    id: 'equipe',
    title: 'Dynamique d\'Équipe',
    description: 'Réflexion sur les interactions avec l\'équipe',
    icon: Users,
    color: 'bg-info/10 text-info',
    category: 'healthcare',
    prompts: [
      'Comment était l\'ambiance dans l\'équipe ?',
      'Y a-t-il eu des tensions ou au contraire de beaux moments de solidarité ?',
      'Me suis-je senti(e) soutenu(e) ?',
      'Qu\'est-ce que j\'aimerais améliorer dans nos échanges ?'
    ]
  },
  {
    id: 'accomplissement',
    title: 'Fierté du Jour',
    description: 'Célébrer une réussite professionnelle',
    icon: Sparkles,
    color: 'bg-success/10 text-success',
    category: 'healthcare',
    prompts: [
      'De quoi suis-je fier(ère) aujourd\'hui ?',
      'Quelle compétence ai-je particulièrement bien utilisée ?',
      'Comment cette réussite me fait-elle sentir ?',
      'Qu\'est-ce que cela m\'apprend sur moi ?'
    ]
  },
  // Templates généraux
  {
    id: 'gratitude',
    title: 'Gratitude',
    description: '3 choses positives de la journée',
    icon: Heart,
    color: 'bg-destructive/10 text-destructive',
    category: 'personal',
    prompts: [
      'Quelles sont 3 choses pour lesquelles je suis reconnaissant(e) ?',
      'Qui m\'a fait du bien aujourd\'hui ?',
      'Quel petit plaisir ai-je savouré ?'
    ]
  },
  {
    id: 'stress',
    title: 'Gestion du Stress',
    description: 'Identifier et comprendre mes sources de stress',
    icon: Brain,
    color: 'bg-accent/10 text-accent-foreground',
    category: 'emotional',
    prompts: [
      'Qu\'est-ce qui m\'a stressé(e) aujourd\'hui ?',
      'Comment mon corps a-t-il réagi ?',
      'Quelle stratégie ai-je utilisée pour me calmer ?',
      'Qu\'est-ce qui pourrait m\'aider la prochaine fois ?'
    ]
  },
  {
    id: 'pause',
    title: 'Moment de Pause',
    description: 'Prendre le temps de respirer',
    icon: Coffee,
    color: 'bg-muted text-muted-foreground',
    category: 'personal',
    prompts: [
      'Comment je me sens en ce moment précis ?',
      'Qu\'est-ce dont j\'ai besoin maintenant ?',
      'Quelle intention je pose pour la suite de ma journée ?'
    ]
  },
];

interface JournalTemplatesSelectorProps {
  onSelectTemplate: (template: JournalTemplate) => void;
  selectedTemplateId?: string;
  showCategories?: boolean;
}

export const JournalTemplatesSelector: React.FC<JournalTemplatesSelectorProps> = ({
  onSelectTemplate,
  selectedTemplateId,
  showCategories = true
}) => {
  const healthcareTemplates = JOURNAL_TEMPLATES.filter(t => t.category === 'healthcare');
  const otherTemplates = JOURNAL_TEMPLATES.filter(t => t.category !== 'healthcare');

  const renderTemplate = (template: JournalTemplate) => {
    const Icon = template.icon;
    const isSelected = selectedTemplateId === template.id;

    return (
      <Card 
        key={template.id}
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => onSelectTemplate(template)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className={`p-2 rounded-lg ${template.color}`}>
              <Icon className="h-4 w-4" />
            </div>
            {template.isNew && (
              <Badge variant="secondary" className="text-xs">Nouveau</Badge>
            )}
          </div>
          <CardTitle className="text-sm mt-2">{template.title}</CardTitle>
          <CardDescription className="text-xs">
            {template.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">
            {template.prompts.length} questions guidées
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {showCategories && (
        <>
          {/* Healthcare Templates */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-sm">Templates Soignants</h3>
              <Badge variant="outline" className="text-xs">Recommandés</Badge>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {healthcareTemplates.map(renderTemplate)}
            </div>
          </div>

          {/* Other Templates */}
          <div>
            <h3 className="font-medium text-sm mb-3">Autres Templates</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {otherTemplates.map(renderTemplate)}
            </div>
          </div>
        </>
      )}

      {!showCategories && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {JOURNAL_TEMPLATES.map(renderTemplate)}
        </div>
      )}
    </div>
  );
};

export { JOURNAL_TEMPLATES };
export default JournalTemplatesSelector;
