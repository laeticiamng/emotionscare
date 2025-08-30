import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Coffee, 
  Moon, 
  Briefcase, 
  Heart, 
  Dumbbell, 
  Plane,
  Book,
  Target,
  Sparkles,
  Calendar,
  Clock,
  Users
} from 'lucide-react';

interface JournalTemplate {
  id: string;
  name: string;
  description: string;
  icon: LucideIconType;
  color: string;
  category: 'daily' | 'weekly' | 'monthly' | 'special';
  prompts: string[];
  tags: string[];
}

interface JournalTemplatesProps {
  onSelectTemplate: (template: JournalTemplate) => void;
}

const JournalTemplates: React.FC<JournalTemplatesProps> = ({ onSelectTemplate }) => {
  const templates: JournalTemplate[] = [
    {
      id: 'morning-reflection',
      name: 'Réflexion Matinale',
      description: 'Commencez votre journée avec intention et clarté',
      icon: Coffee,
      color: 'from-orange-400 to-amber-500',
      category: 'daily',
      prompts: [
        'Comment je me sens ce matin ?',
        'Quelle est mon intention pour aujourd\'hui ?',
        'Qu\'est-ce qui m\'inspire le plus aujourd\'hui ?',
        'Quels sont mes 3 objectifs prioritaires ?'
      ],
      tags: ['matin', 'intention', 'objectifs']
    },
    {
      id: 'evening-gratitude',
      name: 'Gratitude du Soir',
      description: 'Terminez votre journée avec reconnaissance',
      icon: Moon,
      color: 'from-indigo-400 to-purple-500',
      category: 'daily',
      prompts: [
        'Quels sont les 3 moments les plus précieux de ma journée ?',
        'Qu\'ai-je appris aujourd\'hui ?',
        'Pour quoi suis-je le plus reconnaissant(e) ?',
        'Comment puis-je améliorer demain ?'
      ],
      tags: ['soir', 'gratitude', 'réflexion']
    },
    {
      id: 'work-stress',
      name: 'Gestion du Stress Professionnel',
      description: 'Analysez et gérez le stress au travail',
      icon: Briefcase,
      color: 'from-blue-400 to-cyan-500',
      category: 'special',
      prompts: [
        'Quelles sont mes principales sources de stress au travail ?',
        'Comment ai-je géré la pression aujourd\'hui ?',
        'Quelles stratégies ont fonctionné ?',
        'Que puis-je déléguer ou reprioritiser ?'
      ],
      tags: ['travail', 'stress', 'productivité']
    },
    {
      id: 'relationship-check',
      name: 'Bilan Relationnel',
      description: 'Réfléchissez sur vos relations personnelles',
      icon: Heart,
      color: 'from-pink-400 to-rose-500',
      category: 'weekly',
      prompts: [
        'Comment se portent mes relations importantes ?',
        'Ai-je donné suffisamment d\'attention à mes proches ?',
        'Y a-t-il des conflits à résoudre ?',
        'Comment puis-je mieux communiquer ?'
      ],
      tags: ['relations', 'famille', 'amis', 'communication']
    },
    {
      id: 'health-wellness',
      name: 'Santé & Bien-être',
      description: 'Suivez votre santé physique et mentale',
      icon: Dumbbell,
      color: 'from-green-400 to-emerald-500',
      category: 'weekly',
      prompts: [
        'Comment ai-je pris soin de mon corps cette semaine ?',
        'Quel est mon niveau d\'énergie général ?',
        'Ai-je suffisamment dormi et bien mangé ?',
        'Quelles habitudes santé puis-je améliorer ?'
      ],
      tags: ['santé', 'sport', 'alimentation', 'sommeil']
    },
    {
      id: 'travel-adventure',
      name: 'Aventure & Voyage',
      description: 'Capturez vos expériences de voyage',
      icon: Plane,
      color: 'from-teal-400 to-blue-500',
      category: 'special',
      prompts: [
        'Qu\'est-ce qui m\'a le plus marqué aujourd\'hui ?',
        'Quelles nouvelles cultures ai-je découvertes ?',
        'Quels défis ai-je relevés ?',
        'Comment ce voyage me transforme-t-il ?'
      ],
      tags: ['voyage', 'découverte', 'culture', 'aventure']
    },
    {
      id: 'learning-growth',
      name: 'Apprentissage & Croissance',
      description: 'Documentez votre développement personnel',
      icon: Book,
      color: 'from-violet-400 to-purple-500',
      category: 'monthly',
      prompts: [
        'Quelles nouvelles compétences ai-je développées ?',
        'Quels livres ou contenus m\'ont inspiré ?',
        'Comment ai-je évolué par rapport au mois dernier ?',
        'Quels sont mes prochains objectifs d\'apprentissage ?'
      ],
      tags: ['apprentissage', 'développement', 'compétences', 'lecture']
    },
    {
      id: 'goal-tracking',
      name: 'Suivi d\'Objectifs',
      description: 'Évaluez vos progress vers vos objectifs',
      icon: Target,
      color: 'from-red-400 to-pink-500',
      category: 'monthly',
      prompts: [
        'Où en suis-je avec mes objectifs principaux ?',
        'Quels obstacles ai-je rencontrés ?',
        'Quelles victoires puis-je célébrer ?',
        'Dois-je ajuster ma stratégie ?'
      ],
      tags: ['objectifs', 'progrès', 'planification', 'motivation']
    },
    {
      id: 'creative-inspiration',
      name: 'Inspiration Créative',
      description: 'Explorez votre créativité et vos idées',
      icon: Sparkles,
      color: 'from-yellow-400 to-orange-500',
      category: 'special',
      prompts: [
        'Qu\'est-ce qui nourrit ma créativité en ce moment ?',
        'Quelles idées nouvelles me viennent à l\'esprit ?',
        'Comment puis-je exprimer ma créativité différemment ?',
        'Quels projets créatifs m\'excitent le plus ?'
      ],
      tags: ['créativité', 'inspiration', 'art', 'innovation']
    }
  ];

  const categories = [
    { id: 'daily', name: 'Quotidien', icon: Calendar },
    { id: 'weekly', name: 'Hebdomadaire', icon: Clock },
    { id: 'monthly', name: 'Mensuel', icon: Users },
    { id: 'special', name: 'Spécial', icon: Sparkles }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Templates de Journal</h2>
        <p className="text-muted-foreground">
          Choisissez un template pour structurer votre réflexion
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
          size="sm"
        >
          Tous
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
            size="sm"
            className="flex items-center gap-2"
          >
            <category.icon className="h-4 w-4" />
            {category.name}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id} 
            className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => onSelectTemplate(template)}
          >
            <CardHeader className="pb-3">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${template.color} flex items-center justify-center mb-3`}>
                <template.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">
                {template.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Questions guides :</h4>
                <ul className="space-y-1">
                  {template.prompts.slice(0, 2).map((prompt, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>{prompt}</span>
                    </li>
                  ))}
                  {template.prompts.length > 2 && (
                    <li className="text-xs text-muted-foreground">
                      +{template.prompts.length - 2} autres questions
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button 
                className="w-full" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(template);
                }}
              >
                Utiliser ce template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default JournalTemplates;