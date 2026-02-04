/**
 * Personnalités de Coach IA
 * Différents styles de coaching adaptés aux besoins
 */

import { memo, useState } from 'react';
import { 
  Heart, 
  Brain, 
  Flame, 
  Leaf, 
  Sun, 
  Shield,
  Sparkles,
  Target,
  Compass,
  Smile,
  Check
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface CoachPersonality {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: React.ElementType;
  traits: string[];
  bestFor: string[];
  communicationStyle: string;
  color: string;
  avatarEmoji: string;
  samplePhrases: string[];
  isDefault?: boolean;
  isPremium?: boolean;
}

export const COACH_PERSONALITIES: CoachPersonality[] = [
  {
    id: 'empathetic',
    name: 'Emma l\'Empathique',
    tagline: 'Écoute bienveillante et soutien inconditionnel',
    description: 'Un accompagnement chaleureux centré sur vos émotions. Emma vous accueille sans jugement et vous aide à explorer vos ressentis en toute sécurité.',
    icon: Heart,
    traits: ['Bienveillante', 'Patiente', 'À l\'écoute', 'Douce'],
    bestFor: [
      'Moments difficiles',
      'Besoin de se sentir compris',
      'Exploration émotionnelle',
      'Anxiété et stress'
    ],
    communicationStyle: 'Questions ouvertes, reformulations empathiques, validation des émotions',
    color: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
    avatarEmoji: '💖',
    samplePhrases: [
      'Je comprends que ce soit difficile pour toi...',
      'Tes sentiments sont valides.',
      'Prends tout le temps dont tu as besoin.',
      'Je suis là pour t\'écouter.'
    ],
    isDefault: true
  },
  {
    id: 'motivator',
    name: 'Max le Motivateur',
    tagline: 'Énergie positive et encouragements',
    description: 'Un coach dynamique qui vous pousse à dépasser vos limites. Max célèbre vos victoires et vous aide à voir le positif en toute situation.',
    icon: Flame,
    traits: ['Énergique', 'Positif', 'Encourageant', 'Dynamique'],
    bestFor: [
      'Boost de motivation',
      'Atteinte d\'objectifs',
      'Sortir de sa zone de confort',
      'Besoin d\'énergie'
    ],
    communicationStyle: 'Encouragements enthousiastes, célébration des progrès, défis stimulants',
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
    avatarEmoji: '🔥',
    samplePhrases: [
      'Tu peux le faire, j\'en suis convaincu !',
      'Chaque petit pas compte, continue !',
      'Regarde tout le chemin parcouru !',
      'C\'est une opportunité de grandir !'
    ]
  },
  {
    id: 'analytical',
    name: 'Alex l\'Analyste',
    tagline: 'Clarté mentale et réflexion structurée',
    description: 'Une approche logique et méthodique. Alex vous aide à décortiquer vos pensées, identifier les patterns et trouver des solutions concrètes.',
    icon: Brain,
    traits: ['Logique', 'Structuré', 'Précis', 'Perspicace'],
    bestFor: [
      'Résolution de problèmes',
      'Prise de décision',
      'Analyse de situations',
      'Planification'
    ],
    communicationStyle: 'Questions précises, frameworks, analyse étape par étape',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    avatarEmoji: '🧠',
    samplePhrases: [
      'Décomposons cela ensemble.',
      'Quelles sont les options possibles ?',
      'Examinons les preuves pour et contre.',
      'Définissons des étapes concrètes.'
    ]
  },
  {
    id: 'zen',
    name: 'Zoé la Zen',
    tagline: 'Calme intérieur et pleine conscience',
    description: 'Un accompagnement paisible inspiré de la sagesse orientale. Zoé vous guide vers la sérénité à travers la méditation et l\'acceptation.',
    icon: Leaf,
    traits: ['Sereine', 'Sagesse', 'Présence', 'Apaisante'],
    bestFor: [
      'Gestion du stress',
      'Méditation',
      'Lâcher-prise',
      'Retrouver le calme'
    ],
    communicationStyle: 'Ton calme, métaphores naturelles, exercices de pleine conscience',
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
    avatarEmoji: '🧘',
    samplePhrases: [
      'Prenons un moment pour respirer ensemble.',
      'Observe cette pensée sans la juger.',
      'Le calme est toujours accessible en toi.',
      'Reviens doucement à l\'instant présent.'
    ],
    isPremium: true
  },
  {
    id: 'challenger',
    name: 'Chris le Challenger',
    tagline: 'Croissance par le défi bienveillant',
    description: 'Un coach direct qui vous pousse à questionner vos croyances limitantes. Chris vous challenge avec respect pour catalyser votre transformation.',
    icon: Target,
    traits: ['Direct', 'Stimulant', 'Courageux', 'Transformateur'],
    bestFor: [
      'Sortir de sa zone de confort',
      'Développement personnel intense',
      'Croyances limitantes',
      'Changements majeurs'
    ],
    communicationStyle: 'Questions provocantes, confrontation bienveillante, push vers l\'action',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    avatarEmoji: '🎯',
    samplePhrases: [
      'Et si cette croyance était fausse ?',
      'Qu\'est-ce qui t\'empêche vraiment ?',
      'Ose imaginer que c\'est possible.',
      'Quelle serait la version audacieuse de toi ?'
    ],
    isPremium: true
  },
  {
    id: 'sunshine',
    name: 'Sam le Soleil',
    tagline: 'Optimisme contagieux et légèreté',
    description: 'Un coach joyeux qui apporte de la lumière dans les moments sombres. Sam trouve toujours le côté positif et vous aide à retrouver le sourire.',
    icon: Sun,
    traits: ['Joyeux', 'Optimiste', 'Léger', 'Rayonnant'],
    bestFor: [
      'Retrouver le moral',
      'Période de déprime légère',
      'Besoin de positivité',
      'Prendre du recul'
    ],
    communicationStyle: 'Humour doux, perspective positive, célébration des petites joies',
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30',
    avatarEmoji: '☀️',
    samplePhrases: [
      'Hey, même les nuages passent !',
      'C\'est super que tu sois là aujourd\'hui.',
      'Trouve-moi 3 petits trucs cools de ta journée !',
      'Tu as le droit de sourire, tu sais ?'
    ]
  },
  {
    id: 'protector',
    name: 'Pat le Protecteur',
    tagline: 'Sécurité et ancrage en période de crise',
    description: 'Un coach rassurant spécialisé dans les moments de crise. Pat vous aide à retrouver votre ancrage et à vous sentir en sécurité.',
    icon: Shield,
    traits: ['Rassurant', 'Stable', 'Protecteur', 'Ancré'],
    bestFor: [
      'Moments de crise',
      'Crises d\'angoisse',
      'Sentiment d\'insécurité',
      'Besoin de stabilité'
    ],
    communicationStyle: 'Ton calme et assurant, techniques d\'ancrage, présence rassurante',
    color: 'bg-slate-500/10 text-slate-600 border-slate-500/30',
    avatarEmoji: '🛡️',
    samplePhrases: [
      'Tu es en sécurité ici.',
      'Je suis là, on va traverser ça ensemble.',
      'Concentrons-nous sur ta respiration.',
      'Sens tes pieds sur le sol, tu es ancré(e).'
    ]
  },
  {
    id: 'guide',
    name: 'Gaia la Guide',
    tagline: 'Exploration intérieure et découverte de soi',
    description: 'Une guide spirituelle qui vous accompagne dans l\'exploration de votre monde intérieur. Gaia pose les bonnes questions pour des insights profonds.',
    icon: Compass,
    traits: ['Intuitive', 'Profonde', 'Exploratrice', 'Sage'],
    bestFor: [
      'Connaissance de soi',
      'Quête de sens',
      'Exploration intérieure',
      'Travail sur les valeurs'
    ],
    communicationStyle: 'Questions profondes, métaphores, exploration des valeurs et du sens',
    color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30',
    avatarEmoji: '🧭',
    samplePhrases: [
      'Qu\'est-ce que cela révèle sur toi ?',
      'Si tu écoutais ta voix intérieure...',
      'Quelle est la leçon cachée ici ?',
      'Qu\'est-ce qui compte vraiment pour toi ?'
    ],
    isPremium: true
  }
];

interface CoachPersonalitiesProps {
  selectedPersonality: string;
  onSelectPersonality: (personality: CoachPersonality) => void;
  className?: string;
}

export const CoachPersonalities = memo(function CoachPersonalities({
  selectedPersonality,
  onSelectPersonality,
  className
}: CoachPersonalitiesProps) {
  const [showDetails, setShowDetails] = useState<string | null>(null);

  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Choisissez votre Coach
        </CardTitle>
        <CardDescription>
          Chaque personnalité offre un style d'accompagnement unique
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedPersonality} 
          onValueChange={(value) => {
            const personality = COACH_PERSONALITIES.find(p => p.id === value);
            if (personality) onSelectPersonality(personality);
          }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {COACH_PERSONALITIES.map((personality) => {
            const Icon = personality.icon;
            const isSelected = selectedPersonality === personality.id;
            
            return (
              <div key={personality.id} className="relative">
                <RadioGroupItem 
                  value={personality.id} 
                  id={personality.id} 
                  className="peer sr-only" 
                />
                <Label
                  htmlFor={personality.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all",
                    personality.color,
                    isSelected 
                      ? "border-primary ring-2 ring-primary/20 shadow-lg scale-[1.02]" 
                      : "hover:shadow-md hover:border-primary/50"
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{personality.avatarEmoji}</div>
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-2">
                          {personality.name}
                          {isSelected && <Check className="h-4 w-4 text-primary" />}
                        </div>
                        <div className="text-xs text-muted-foreground">{personality.tagline}</div>
                      </div>
                    </div>
                    {personality.isPremium && (
                      <Badge className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500">
                        Pro
                      </Badge>
                    )}
                  </div>

                  {/* Traits */}
                  <div className="flex flex-wrap gap-1">
                    {personality.traits.slice(0, 3).map((trait) => (
                      <Badge key={trait} variant="secondary" className="text-[10px] px-1.5">
                        {trait}
                      </Badge>
                    ))}
                  </div>

                  {/* Best For */}
                  <div className="text-[11px] text-muted-foreground">
                    <span className="font-medium">Idéal pour :</span>{' '}
                    {personality.bestFor.slice(0, 2).join(', ')}
                  </div>

                  {/* Sample Phrase */}
                  <div className="text-xs italic text-muted-foreground border-l-2 border-primary/30 pl-2">
                    "{personality.samplePhrases[0]}"
                  </div>
                </Label>

                {personality.isDefault && (
                  <Badge 
                    variant="outline" 
                    className="absolute -top-2 left-4 text-[10px] bg-background"
                  >
                    Par défaut
                  </Badge>
                )}
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
});

// Hook pour utiliser la personnalité dans le chat
export function useCoachPersonality(personalityId: string) {
  const personality = COACH_PERSONALITIES.find(p => p.id === personalityId) || COACH_PERSONALITIES[0];
  
  const getSystemPrompt = () => {
    return `Tu es ${personality.name}, un coach IA avec les caractéristiques suivantes:
- Tagline: ${personality.tagline}
- Style de communication: ${personality.communicationStyle}
- Traits: ${personality.traits.join(', ')}
- Domaines d'expertise: ${personality.bestFor.join(', ')}

Exemples de phrases que tu utilises:
${personality.samplePhrases.map(p => `- "${p}"`).join('\n')}

Adopte ce style de manière cohérente dans toutes tes réponses. Sois authentique à cette personnalité tout en restant utile et bienveillant.`;
  };

  return {
    personality,
    getSystemPrompt,
    avatar: personality.avatarEmoji,
    name: personality.name,
    color: personality.color
  };
}
