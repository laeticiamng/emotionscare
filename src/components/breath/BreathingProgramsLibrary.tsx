import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BREATHING_PROGRAMS, BreathingProgram } from '@/features/breath/programs/breathingProgramsDB';
import { ChevronDown, Calendar, Clock, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    stress: 'Gestion du Stress',
    sleep: 'Sommeil',
    focus: 'Concentration',
    energy: 'Énergie',
    wellbeing: 'Bien-être',
  };
  return labels[category] || category;
};

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    stress: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    sleep: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    focus: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    energy: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    wellbeing: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  };
  return colors[category] || 'bg-slate-500/20 text-slate-300 border-slate-500/30';
};

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

const ProgramCard: React.FC<{ program: BreathingProgram }> = ({ program }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="border-border/50 bg-card/40 overflow-hidden" data-zero-number-check="true">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground">{program.name}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              {program.description}
            </CardDescription>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className={cn('whitespace-nowrap border', getCategoryColor(program.category))}>
            {getCategoryLabel(program.category)}
          </Badge>
          <Badge className={cn('whitespace-nowrap border', getDifficultyColor(program.difficulty))}>
            {program.difficulty === 'beginner' && 'Débutant'}
            {program.difficulty === 'intermediate' && 'Intermédiaire'}
            {program.difficulty === 'advanced' && 'Avancé'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary/70" />
            <span className="text-muted-foreground">{program.duration_days}j</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-info/70" />
            <span className="text-muted-foreground text-xs">{program.estimatedCommitment}</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-success/70" />
            <span className="text-muted-foreground">{program.sessions.length} étapes</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Bénéfices:</p>
          <ul className="space-y-1">
            {program.benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-primary/80 hover:text-primary transition-colors"
        >
          <span>{expanded ? 'Masquer' : 'Afficher'} le plan</span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')} />
        </button>

        {expanded && (
          <div className="space-y-4 border-t border-border/30 pt-4">
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-3">Plan du programme</h4>
              <div className="space-y-3">
                {program.sessions.map((session) => (
                  <div key={session.day} className="rounded-lg bg-muted/30 border border-border/50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-xs font-semibold text-primary">
                            {session.day}
                          </span>
                          <h5 className="font-medium text-foreground">{session.title}</h5>
                        </div>
                        <p className="text-sm text-muted-foreground ml-8">{session.description}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1 ml-8">💡 {session.notes}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-medium text-muted-foreground">{session.duration_minutes}min</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-info/10 border border-info/20 p-3">
              <p className="text-sm text-info">
                <strong>📖 À propos:</strong> {program.longDescription}
              </p>
            </div>

            <Button className="w-full">
              Commencer ce programme
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export const BreathingProgramsLibrary: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all');

  const categories = ['all', 'stress', 'sleep', 'focus', 'energy', 'wellbeing'] as const;

  const filteredPrograms = Object.values(BREATHING_PROGRAMS).filter(
    p => selectedCategory === 'all' || p.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Programmes Guidés</h2>
        <p className="text-muted-foreground">Des séquences structurées sur plusieurs jours pour des résultats durables</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
          >
            {category === 'all' && 'Tous'}
            {category === 'stress' && 'Stress'}
            {category === 'sleep' && 'Sommeil'}
            {category === 'focus' && 'Focus'}
            {category === 'energy' && 'Énergie'}
            {category === 'wellbeing' && 'Bien-être'}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredPrograms.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun programme dans cette catégorie</p>
        </div>
      )}
    </div>
  );
};
