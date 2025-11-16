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
    <Card className="border-slate-800/50 bg-slate-900/40 overflow-hidden" data-zero-number-check="true">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold text-slate-100">{technique.name}</CardTitle>
            <CardDescription className="text-sm text-slate-400 mt-1">
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
            <Clock className="h-4 w-4 text-amber-400/70" />
            <span className="text-slate-300">{technique.duration_minutes} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-cyan-400/70" />
            <span className="text-slate-300">Ins: {technique.timings.inhale / 1000}s</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400/70" />
            <span className="text-slate-300">Exp: {technique.timings.exhale / 1000}s</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {technique.benefits.slice(0, 2).map((benefit) => (
            <Badge key={benefit} variant="secondary" className="bg-slate-800/50 text-slate-300 border-0">
              {benefit}
            </Badge>
          ))}
          {technique.benefits.length > 2 && (
            <Badge variant="secondary" className="bg-slate-800/50 text-slate-300 border-0">
              +{technique.benefits.length - 2} plus
            </Badge>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-amber-400/80 hover:text-amber-300 transition-colors"
        >
          <span>{expanded ? 'Masquer' : 'Afficher'} détails</span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
        </button>

        {expanded && (
          <div className="space-y-4 border-t border-slate-800/30 pt-4">
            <div>
              <h4 className="font-semibold text-slate-200 text-sm mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400/70" />
                Bénéfices
              </h4>
              <ul className="space-y-1 text-sm text-slate-300">
                {technique.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400/50" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-200 text-sm mb-2">Instructions</h4>
              <ol className="space-y-2 text-sm text-slate-300">
                {technique.instructions.map((instruction, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="flex-shrink-0 font-semibold text-amber-400/60 min-w-[1.5rem]">{idx + 1}.</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>

            {technique.contraindications && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                <p className="text-sm text-red-200">
                  <strong>⚠️ Attention:</strong> {technique.contraindications}
                </p>
              </div>
            )}

            {technique.scientific_basis && (
              <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-3">
                <p className="text-sm text-cyan-200">
                  <strong>📚 Fondement scientifique:</strong> {technique.scientific_basis}
                </p>
              </div>
            )}

            <Button className="w-full bg-amber-600/80 hover:bg-amber-600 text-amber-50">
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
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Bibliothèque de Techniques</h2>
        <p className="text-slate-400">Découvre différentes techniques respiratoires adaptées à tes besoins</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((difficulty) => (
          <Button
            key={difficulty}
            variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDifficulty(difficulty)}
            className={cn(
              'transition-colors',
              selectedDifficulty === difficulty
                ? 'bg-amber-600/80 text-amber-50 border-amber-600'
                : 'border-slate-700 text-slate-300 hover:border-slate-600'
            )}
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
