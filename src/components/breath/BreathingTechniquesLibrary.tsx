import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BREATHING_TECHNIQUES, BreathingTechnique } from '@/features/breath/techniques/breathingTechniquesDB';
import { ChevronDown, Lightbulb, Clock, Zap, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    case 'intermediate':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case 'advanced':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  }
};

const TechniqueCard: React.FC<{ technique: BreathingTechnique }> = ({ technique }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-border/50 bg-card/40 overflow-hidden" data-zero-number-check="true">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold text-foreground">{technique.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {technique.description}
            </CardDescription>
          </div>
          <Badge className={cn('whitespace-nowrap', getDifficultyColor(technique.difficulty))}>
            {technique.difficulty === 'beginner' && 'Débutant'}
            {technique.difficulty === 'intermediate' && 'Intermédiaire'}
            {technique.difficulty === 'advanced' && 'Avancé'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary/70" />
            <span className="text-muted-foreground">{technique.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-info/70" />
            <span className="text-muted-foreground">Ins: {technique.timings.inhale / 1000}s</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-warning/70" />
            <span className="text-muted-foreground">Exp: {technique.timings.exhale / 1000}s</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {technique.benefits.slice(0, 2).map((benefit) => (
            <Badge key={benefit} variant="secondary">
              {benefit}
            </Badge>
          ))}
          {technique.benefits.length > 2 && (
            <Badge variant="secondary">
              +{technique.benefits.length - 2} plus
            </Badge>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-primary/80 hover:text-primary transition-colors"
        >
          <span>{expanded ? 'Masquer' : 'Afficher'} détails</span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
        </button>

        {expanded && (
          <div className="space-y-4 border-t border-border/30 pt-4">
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary/70" />
                Bénéfices
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {technique.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground text-sm mb-2">Instructions</h4>
              <ol className="space-y-2 text-sm text-muted-foreground">
                {technique.instructions.map((instruction, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="flex-shrink-0 font-semibold text-primary/60 min-w-[1.5rem]">{idx + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {technique.contraindications && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
                <p className="text-sm text-destructive">
                  <strong>⚠️ Attention:</strong> {technique.contraindications}
                </p>
              </div>
            )}

            {technique.scientific_basis && (
              <div className="rounded-lg bg-info/10 border border-info/20 p-3">
                <p className="text-sm text-info">
                  <strong>📚 Fondement scientifique:</strong> {technique.scientific_basis}
                </p>
              </div>
            )}

            <Button className="w-full">
              Commencer cette technique
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const BreathingTechniquesLibrary: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const filteredTechniques = Object.values(BREATHING_TECHNIQUES).filter(
    t => selectedDifficulty === 'all' || t.difficulty === selectedDifficulty
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Bibliothèque de Techniques</h2>
        <p className="text-muted-foreground">Découvre différentes techniques respiratoires adaptées à tes besoins</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
          <Button
            key={difficulty}
            variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDifficulty(difficulty)}
          >
            {difficulty === 'all' && 'Toutes'}
            {difficulty === 'beginner' && 'Débutant'}
            {difficulty === 'intermediate' && 'Intermédiaire'}
            {difficulty === 'advanced' && 'Avancé'}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {filteredTechniques.map((technique) => (
          <TechniqueCard key={technique.id} technique={technique} />
        ))}
      </div>
    </div>
  );
};
