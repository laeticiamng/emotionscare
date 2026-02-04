/**
 * Patterns de respiration avancés
 * Wim Hof, Box Breathing, 4-7-8, Cohérence cardiaque, etc.
 */

import { memo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { 
  Wind, 
  Snowflake, 
  Square, 
  Moon, 
  Heart, 
  Zap, 
  Timer,
  PlayCircle,
  Info,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // en minutes
  phases: {
    name: string;
    duration: number; // en secondes
    instruction: string;
  }[];
  benefits: string[];
  contraindications?: string[];
  origin?: string;
  color: string;
  isPopular?: boolean;
  isPremium?: boolean;
}

export const ADVANCED_BREATHING_PATTERNS: BreathingPattern[] = [
  {
    id: 'box-breathing',
    name: 'Box Breathing (4-4-4-4)',
    description: 'Technique des Navy SEALs pour calme et focus',
    icon: Square,
    difficulty: 'beginner',
    duration: 5,
    phases: [
      { name: 'Inspirer', duration: 4, instruction: 'Inspirez lentement par le nez' },
      { name: 'Retenir', duration: 4, instruction: 'Retenez votre souffle' },
      { name: 'Expirer', duration: 4, instruction: 'Expirez lentement par la bouche' },
      { name: 'Retenir', duration: 4, instruction: 'Poumons vides, attendez' }
    ],
    benefits: [
      'Réduit le stress instantanément',
      'Améliore la concentration',
      'Régule le système nerveux',
      'Utilisé par les forces spéciales'
    ],
    origin: 'US Navy SEALs',
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
    isPopular: true
  },
  {
    id: '478-breathing',
    name: 'Respiration 4-7-8',
    description: 'Le "tranquillisant naturel" du Dr. Weil',
    icon: Moon,
    difficulty: 'beginner',
    duration: 5,
    phases: [
      { name: 'Inspirer', duration: 4, instruction: 'Inspirez silencieusement par le nez' },
      { name: 'Retenir', duration: 7, instruction: 'Retenez votre souffle' },
      { name: 'Expirer', duration: 8, instruction: 'Expirez par la bouche avec un son "whoosh"' }
    ],
    benefits: [
      'Favorise l\'endormissement en 60 secondes',
      'Réduit l\'anxiété',
      'Aide à gérer les fringales',
      'Calme le système nerveux'
    ],
    origin: 'Dr. Andrew Weil',
    color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30',
    isPopular: true
  },
  {
    id: 'wim-hof',
    name: 'Méthode Wim Hof',
    description: 'Technique de l\'Homme de Glace pour énergie et immunité',
    icon: Snowflake,
    difficulty: 'advanced',
    duration: 15,
    phases: [
      { name: 'Hyperventilation', duration: 30, instruction: '30 respirations profondes rapides' },
      { name: 'Rétention', duration: 90, instruction: 'Expirer et retenir aussi longtemps que possible' },
      { name: 'Récupération', duration: 15, instruction: 'Inspirer profondément et retenir 15s' }
    ],
    benefits: [
      'Boost le système immunitaire',
      'Augmente l\'énergie et la vitalité',
      'Améliore la résistance au froid',
      'Réduit l\'inflammation',
      'Développe la force mentale'
    ],
    contraindications: [
      'Ne jamais pratiquer dans l\'eau',
      'Éviter en conduisant',
      'Contre-indiqué pour épilepsie',
      'Consulter un médecin si enceinte'
    ],
    origin: 'Wim Hof (Pays-Bas)',
    color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30',
    isPremium: true
  },
  {
    id: 'coherence-cardiaque',
    name: 'Cohérence Cardiaque (365)',
    description: '3 fois par jour, 6 respirations/min, 5 minutes',
    icon: Heart,
    difficulty: 'beginner',
    duration: 5,
    phases: [
      { name: 'Inspirer', duration: 5, instruction: 'Inspirez doucement et profondément' },
      { name: 'Expirer', duration: 5, instruction: 'Expirez lentement et complètement' }
    ],
    benefits: [
      'Réduit le cortisol (stress)',
      'Améliore la variabilité cardiaque',
      'Booste la DHEA (anti-âge)',
      'Effets durables 4-6 heures',
      'Améliore le sommeil'
    ],
    origin: 'Institut HeartMath',
    color: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
    isPopular: true
  },
  {
    id: 'energizing',
    name: 'Respiration Énergisante',
    description: 'Boost d\'énergie naturel en 2 minutes',
    icon: Zap,
    difficulty: 'intermediate',
    duration: 2,
    phases: [
      { name: 'Inspirer vite', duration: 1, instruction: 'Inspiration rapide par le nez' },
      { name: 'Expirer vite', duration: 1, instruction: 'Expiration rapide par le nez' }
    ],
    benefits: [
      'Augmente l\'énergie rapidement',
      'Améliore la vigilance',
      'Active le système nerveux sympathique',
      'Parfait le matin ou avant effort'
    ],
    contraindications: [
      'Éviter si hypertension',
      'Ne pas pratiquer le soir'
    ],
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30'
  },
  {
    id: 'tummo',
    name: 'Tummo (Feu Intérieur)',
    description: 'Technique tibétaine de chaleur interne',
    icon: Flame,
    difficulty: 'advanced',
    duration: 20,
    phases: [
      { name: 'Visualisation', duration: 30, instruction: 'Visualisez une flamme au nombril' },
      { name: 'Inspirer profond', duration: 5, instruction: 'Remplissez les poumons complètement' },
      { name: 'Rétention', duration: 20, instruction: 'Compressez l\'air vers le bas' },
      { name: 'Expirer', duration: 10, instruction: 'Relâchez lentement' }
    ],
    benefits: [
      'Génère de la chaleur corporelle',
      'Méditation profonde',
      'Renforce la concentration',
      'Développe la résilience'
    ],
    contraindications: [
      'Réservé aux pratiquants expérimentés',
      'Supervision recommandée'
    ],
    origin: 'Bouddhisme tibétain',
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/30',
    isPremium: true
  },
  {
    id: 'relaxing-2to1',
    name: 'Respiration 2:1',
    description: 'Expiration double pour relaxation profonde',
    icon: Wind,
    difficulty: 'beginner',
    duration: 5,
    phases: [
      { name: 'Inspirer', duration: 4, instruction: 'Inspirez naturellement' },
      { name: 'Expirer', duration: 8, instruction: 'Expirez lentement, 2x plus long' }
    ],
    benefits: [
      'Active le système parasympathique',
      'Relaxation profonde',
      'Ralentit le rythme cardiaque',
      'Prépare au sommeil'
    ],
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
  },
  {
    id: 'physiological-sigh',
    name: 'Soupir Physiologique',
    description: 'Technique Stanford pour calme instantané',
    icon: Wind,
    difficulty: 'beginner',
    duration: 1,
    phases: [
      { name: 'Double inspiration', duration: 2, instruction: 'Inspirez, puis inspirez encore' },
      { name: 'Expiration longue', duration: 6, instruction: 'Expirez lentement par la bouche' }
    ],
    benefits: [
      'Calme en 1 seule respiration',
      'Prouvé scientifiquement (Stanford)',
      'Utilisable partout, discret',
      'Reset du système nerveux'
    ],
    origin: 'Stanford University',
    color: 'bg-purple-500/10 text-purple-600 border-purple-500/30',
    isPopular: true
  }
];

const DIFFICULTY_LABELS = {
  beginner: { label: 'Débutant', color: 'bg-green-500/20 text-green-700' },
  intermediate: { label: 'Intermédiaire', color: 'bg-yellow-500/20 text-yellow-700' },
  advanced: { label: 'Avancé', color: 'bg-red-500/20 text-red-700' }
};

interface BreathingPatternsAdvancedProps {
  onStartPattern: (pattern: BreathingPattern) => void;
  className?: string;
}

export const BreathingPatternsAdvanced = memo(function BreathingPatternsAdvanced({
  onStartPattern,
  className
}: BreathingPatternsAdvancedProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<BreathingPattern['difficulty'] | 'all'>('all');
  const [detailPattern, setDetailPattern] = useState<BreathingPattern | null>(null);

  const filteredPatterns = selectedDifficulty === 'all'
    ? ADVANCED_BREATHING_PATTERNS
    : ADVANCED_BREATHING_PATTERNS.filter(p => p.difficulty === selectedDifficulty);

  return (
    <Card className={cn("border-border/50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-primary" />
          Techniques Avancées
        </CardTitle>
        <CardDescription>
          Explorez des méthodes de respiration éprouvées scientifiquement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Difficulty Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedDifficulty === 'all' ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedDifficulty('all')}
          >
            Tous
          </Button>
          {(Object.keys(DIFFICULTY_LABELS) as BreathingPattern['difficulty'][]).map((diff) => (
            <Button
              key={diff}
              variant={selectedDifficulty === diff ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedDifficulty(diff)}
            >
              {DIFFICULTY_LABELS[diff].label}
            </Button>
          ))}
        </div>

        {/* Patterns Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredPatterns.map((pattern) => {
            const Icon = pattern.icon;
            const diffInfo = DIFFICULTY_LABELS[pattern.difficulty];
            
            return (
              <div
                key={pattern.id}
                className={cn(
                  "relative rounded-xl border p-4 transition-all hover:shadow-lg",
                  pattern.color
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-background/50">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">{pattern.name}</h3>
                      {pattern.origin && (
                        <p className="text-[10px] text-muted-foreground">{pattern.origin}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {pattern.isPopular && (
                      <Badge variant="secondary" className="text-[10px]">🔥 Populaire</Badge>
                    )}
                    {pattern.isPremium && (
                      <Badge className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500">Pro</Badge>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {pattern.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-3 mb-4 text-xs">
                  <Badge className={cn("text-[10px]", diffInfo.color)}>
                    {diffInfo.label}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Timer className="h-3 w-3" />
                    <span>{pattern.duration} min</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onStartPattern(pattern)}
                  >
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Pratiquer
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setDetailPattern(pattern)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Icon className="h-5 w-5" />
                          {pattern.name}
                        </DialogTitle>
                        <DialogDescription>{pattern.description}</DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        {/* Phases */}
                        <div>
                          <h4 className="font-medium text-sm mb-2">🔄 Phases</h4>
                          <div className="space-y-2">
                            {pattern.phases.map((phase, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                <Badge variant="outline" className="w-8 justify-center">
                                  {phase.duration}s
                                </Badge>
                                <span className="font-medium">{phase.name}</span>
                                <span className="text-muted-foreground text-xs">
                                  {phase.instruction}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Benefits */}
                        <div>
                          <h4 className="font-medium text-sm mb-2">✨ Bienfaits</h4>
                          <ul className="space-y-1">
                            {pattern.benefits.map((benefit, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-green-500">✓</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Contraindications */}
                        {pattern.contraindications && (
                          <div>
                            <h4 className="font-medium text-sm mb-2 text-orange-600">⚠️ Précautions</h4>
                            <ul className="space-y-1">
                              {pattern.contraindications.map((contra, idx) => (
                                <li key={idx} className="text-sm text-orange-600/80 flex items-start gap-2">
                                  <span>•</span>
                                  {contra}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <Button 
                          className="w-full mt-4" 
                          onClick={() => onStartPattern(pattern)}
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Démarrer la pratique
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});
