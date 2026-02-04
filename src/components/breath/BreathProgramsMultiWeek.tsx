/**
 * BreathProgramsMultiWeek - Programmes de respiration multi-semaines
 * Parcours progressifs sur plusieurs semaines pour développer la pratique
 */

import React, { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, Clock, Target, CheckCircle, Lock, 
  Play, Star, Trophy, ChevronRight, Wind 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface WeekSession {
  id: string;
  day: number;
  title: string;
  technique: string;
  duration: number;
  completed: boolean;
  locked: boolean;
}

interface ProgramWeek {
  number: number;
  theme: string;
  sessions: WeekSession[];
  unlocked: boolean;
}

interface BreathProgram {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  objectives: string[];
  weeks: ProgramWeek[];
  enrolled: boolean;
  progress: number;
}

const PROGRAMS: BreathProgram[] = [
  {
    id: 'stress-relief',
    name: 'Libération du Stress',
    description: 'Programme de 4 semaines pour apprendre à gérer le stress par la respiration',
    duration: '4 semaines',
    difficulty: 'beginner',
    objectives: [
      'Maîtriser la respiration abdominale',
      'Réduire le stress quotidien de 50%',
      'Améliorer la qualité du sommeil'
    ],
    enrolled: true,
    progress: 35,
    weeks: [
      {
        number: 1,
        theme: 'Les Fondations',
        unlocked: true,
        sessions: [
          { id: 's1', day: 1, title: 'Découverte', technique: 'Respiration naturelle', duration: 5, completed: true, locked: false },
          { id: 's2', day: 2, title: 'Conscience', technique: 'Scan corporel', duration: 7, completed: true, locked: false },
          { id: 's3', day: 3, title: 'Repos', technique: 'Détente', duration: 5, completed: false, locked: false },
          { id: 's4', day: 4, title: 'Abdominale', technique: 'Respiration ventrale', duration: 8, completed: false, locked: false },
          { id: 's5', day: 5, title: 'Intégration', technique: 'Pratique guidée', duration: 10, completed: false, locked: false }
        ]
      },
      {
        number: 2,
        theme: 'Approfondissement',
        unlocked: true,
        sessions: [
          { id: 's6', day: 1, title: 'Rythme', technique: '4-4-4-4', duration: 8, completed: false, locked: false },
          { id: 's7', day: 2, title: 'Équilibre', technique: 'Respiration alternée', duration: 10, completed: false, locked: false },
          { id: 's8', day: 3, title: 'Calme', technique: '4-7-8', duration: 8, completed: false, locked: false },
          { id: 's9', day: 4, title: 'Ancrage', technique: 'Grounding', duration: 12, completed: false, locked: false },
          { id: 's10', day: 5, title: 'Synthèse', technique: 'Combiné', duration: 15, completed: false, locked: false }
        ]
      },
      {
        number: 3,
        theme: 'Maîtrise',
        unlocked: false,
        sessions: [
          { id: 's11', day: 1, title: 'Cohérence', technique: 'Cohérence cardiaque', duration: 10, completed: false, locked: true },
          { id: 's12', day: 2, title: 'Énergie', technique: 'Kapalabhati', duration: 8, completed: false, locked: true },
          { id: 's13', day: 3, title: 'Équanimité', technique: 'Ujjayi', duration: 12, completed: false, locked: true },
          { id: 's14', day: 4, title: 'Profondeur', technique: 'Respiration 3D', duration: 15, completed: false, locked: true },
          { id: 's15', day: 5, title: 'Flow', technique: 'Session libre', duration: 20, completed: false, locked: true }
        ]
      },
      {
        number: 4,
        theme: 'Autonomie',
        unlocked: false,
        sessions: [
          { id: 's16', day: 1, title: 'Révision', technique: 'Toutes techniques', duration: 15, completed: false, locked: true },
          { id: 's17', day: 2, title: 'Situation réelle', technique: 'Anti-stress express', duration: 5, completed: false, locked: true },
          { id: 's18', day: 3, title: 'Personnalisation', technique: 'Votre routine', duration: 12, completed: false, locked: true },
          { id: 's19', day: 4, title: 'Défi', technique: 'Session longue', duration: 25, completed: false, locked: true },
          { id: 's20', day: 5, title: 'Célébration', technique: 'Graduation', duration: 20, completed: false, locked: true }
        ]
      }
    ]
  }
];

const BreathProgramsMultiWeek = memo(() => {
  const [selectedProgram] = useState<BreathProgram>(PROGRAMS[0]);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);

  const getDifficultyBadge = (difficulty: BreathProgram['difficulty']) => {
    const config = {
      beginner: { label: 'Débutant', variant: 'outline' as const },
      intermediate: { label: 'Intermédiaire', variant: 'secondary' as const },
      advanced: { label: 'Avancé', variant: 'default' as const }
    };
    return config[difficulty];
  };

  const totalSessions = selectedProgram.weeks.reduce((acc, w) => acc + w.sessions.length, 0);
  const completedSessions = selectedProgram.weeks.reduce(
    (acc, w) => acc + w.sessions.filter(s => s.completed).length, 0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {selectedProgram.name}
            </CardTitle>
            <CardDescription>{selectedProgram.description}</CardDescription>
          </div>
          <Badge {...getDifficultyBadge(selectedProgram.difficulty)}>
            {getDifficultyBadge(selectedProgram.difficulty).label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progression globale */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Progression du programme</span>
            <span className="text-sm text-muted-foreground">
              {completedSessions}/{totalSessions} sessions
            </span>
          </div>
          <Progress value={selectedProgram.progress} className="h-3" aria-label="Progression programme" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>{selectedProgram.progress}% complété</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {selectedProgram.duration}
            </span>
          </div>
        </div>

        {/* Objectifs */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Objectifs du programme
          </h4>
          <div className="space-y-1">
            {selectedProgram.objectives.map((obj, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {obj}
              </div>
            ))}
          </div>
        </div>

        {/* Semaines */}
        <div className="space-y-3">
          {selectedProgram.weeks.map((week) => (
            <motion.div
              key={week.number}
              initial={false}
              className={`rounded-lg border ${
                week.unlocked ? 'bg-card' : 'bg-muted/30'
              }`}
            >
              <button
                onClick={() => week.unlocked && setExpandedWeek(
                  expandedWeek === week.number ? null : week.number
                )}
                className={`w-full p-4 flex items-center justify-between ${
                  week.unlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                }`}
                disabled={!week.unlocked}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    week.unlocked ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {week.unlocked ? (
                      <span className="font-bold">{week.number}</span>
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-medium">Semaine {week.number}: {week.theme}</div>
                    <div className="text-sm text-muted-foreground">
                      {week.sessions.filter(s => s.completed).length}/{week.sessions.length} sessions
                    </div>
                  </div>
                </div>
                {week.unlocked && (
                  <ChevronRight className={`h-5 w-5 transition-transform ${
                    expandedWeek === week.number ? 'rotate-90' : ''
                  }`} />
                )}
              </button>

              {/* Sessions de la semaine */}
              {expandedWeek === week.number && week.unlocked && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t"
                >
                  <div className="p-4 space-y-2">
                    {week.sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          session.completed 
                            ? 'bg-green-500/10' 
                            : session.locked 
                              ? 'bg-muted/50 opacity-60' 
                              : 'bg-muted/30 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            session.completed 
                              ? 'bg-green-500 text-white' 
                              : 'bg-primary/20 text-primary'
                          }`}>
                            {session.completed ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <span className="text-sm">J{session.day}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{session.title}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <Wind className="h-3 w-3" />
                              {session.technique}
                              <span>•</span>
                              <Clock className="h-3 w-3" />
                              {session.duration} min
                            </div>
                          </div>
                        </div>

                        {!session.locked && !session.completed && (
                          <Button size="sm" variant="ghost">
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        {session.completed && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-600">
                            <Star className="h-3 w-3 mr-1" />
                            Fait
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Récompense finale */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <div className="font-medium">Récompense de fin de programme</div>
              <div className="text-sm text-muted-foreground">
                Badge "Maître de la Respiration" + 500 XP + Certificat
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

BreathProgramsMultiWeek.displayName = 'BreathProgramsMultiWeek';

export default BreathProgramsMultiWeek;
