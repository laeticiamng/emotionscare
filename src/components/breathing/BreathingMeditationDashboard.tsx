import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Play, Pause, RotateCcw, Wind, Brain, Heart, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface Exercise {
  id: string;
  name: string;
  type: 'breathing' | 'meditation';
  duration: number;
  description: string;
  pattern?: { inhale: number; hold: number; exhale: number; rest: number };
  script?: string;
  benefits: string[];
}

interface Session {
  id: string;
  exercise_id: string;
  duration_seconds: number;
  completed_at: string | null;
  created_at: string;
}

interface Stats {
  totalSessions: number;
  completedSessions: number;
  totalMinutes: number;
  currentStreak: number;
  exerciseBreakdown: Record<string, number>;
}

export const BreathingMeditationDashboard: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [countdown, setCountdown] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const sessionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (isPlaying && activeExercise?.pattern) {
      startBreathingCycle();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, activeExercise]);

  useEffect(() => {
    if (isPlaying) {
      sessionIntervalRef.current = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
    }

    return () => {
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
    };
  }, [isPlaying]);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Veuillez vous connecter');
        return;
      }

      const [exercisesRes, sessionsRes, statsRes] = await Promise.all([
        supabase.functions.invoke('breathing-meditation/exercises'),
        supabase.functions.invoke('breathing-meditation/sessions?limit=10'),
        supabase.functions.invoke('breathing-meditation/stats'),
      ]);

      if (exercisesRes.data?.exercises) setExercises(exercisesRes.data.exercises);
      if (sessionsRes.data?.sessions) setSessions(sessionsRes.data.sessions);
      if (statsRes.data?.stats) setStats(statsRes.data.stats);
    } catch (error: any) {
      logger.error('Error loading data', error as Error, 'UI');
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const startBreathingCycle = () => {
    if (!activeExercise?.pattern) return;

    const phases: Array<'inhale' | 'hold' | 'exhale' | 'rest'> = ['inhale', 'hold', 'exhale', 'rest'];
    let phaseIndex = 0;
    let timeLeft = activeExercise.pattern[phases[phaseIndex]];

    setCurrentPhase(phases[phaseIndex]);
    setCountdown(timeLeft);

    intervalRef.current = setInterval(() => {
      timeLeft--;
      setCountdown(timeLeft);

      if (timeLeft <= 0) {
        phaseIndex = (phaseIndex + 1) % phases.length;
        const nextPhase = phases[phaseIndex];
        timeLeft = activeExercise.pattern![nextPhase];
        setCurrentPhase(nextPhase);
        setCountdown(timeLeft);
      }
    }, 1000);
  };

  const startSession = async (exercise: Exercise) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Veuillez vous connecter');
        return;
      }

      const { data, error } = await supabase.functions.invoke('breathing-meditation/sessions', {
        method: 'POST',
        body: { exercise_id: exercise.id, duration: 0, completed: false },
      });

      if (error) throw error;

      setCurrentSessionId(data.session.id);
      setActiveExercise(exercise);
      setIsPlaying(true);
      setSessionTime(0);
      toast.success(`Session ${exercise.name} démarrée`);
    } catch (error: any) {
      logger.error('Error starting session', error as Error, 'UI');
      toast.error('Erreur lors du démarrage de la session');
    }
  };

  const completeSession = async () => {
    if (!currentSessionId) return;

    try {
      await supabase.functions.invoke(`breathing-meditation/sessions/${currentSessionId}`, {
        method: 'PATCH',
        body: { completed: true, biometric_data: { duration: sessionTime } },
      });

      setIsPlaying(false);
      setActiveExercise(null);
      setCurrentSessionId(null);
      setSessionTime(0);
      toast.success('Session terminée avec succès !');
      loadData();
    } catch (error: any) {
      logger.error('Error completing session', error as Error, 'UI');
      toast.error('Erreur lors de la finalisation');
    }
  };

  const resetSession = () => {
    setIsPlaying(false);
    setSessionTime(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return 'text-blue-500';
      case 'hold': return 'text-yellow-500';
      case 'exhale': return 'text-green-500';
      case 'rest': return 'text-gray-500';
    }
  };

  const getPhaseLabel = () => {
    switch (currentPhase) {
      case 'inhale': return 'Inspirez';
      case 'hold': return 'Retenez';
      case 'exhale': return 'Expirez';
      case 'rest': return 'Pause';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sessions totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSessions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Minutes pratiquées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMinutes}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Série actuelle</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                {stats.currentStreak} <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalSessions > 0
                  ? Math.round((stats.completedSessions / stats.totalSessions) * 100)
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Session */}
      {activeExercise && (
        <Card>
          <CardHeader>
            <CardTitle>{activeExercise.name}</CardTitle>
            <CardDescription>{activeExercise.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activeExercise.type === 'breathing' && (
                <div className="text-center space-y-4">
                  <div className={`text-6xl font-bold ${getPhaseColor()}`}>
                    {countdown}
                  </div>
                  <div className="text-2xl font-medium">{getPhaseLabel()}</div>
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <Wind className="h-4 w-4" />
                    <span>Temps écoulé: {formatTime(sessionTime)}</span>
                  </div>
                </div>
              )}

              {activeExercise.type === 'meditation' && (
                <div className="text-center space-y-4">
                  <Brain className="h-16 w-16 mx-auto text-primary" />
                  <div className="text-lg">{activeExercise.script}</div>
                  <div className="text-sm text-muted-foreground">
                    Temps écoulé: {formatTime(sessionTime)} / {formatTime(activeExercise.duration)}
                  </div>
                  <Progress
                    value={(sessionTime / activeExercise.duration) * 100}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  size="lg"
                  variant={isPlaying ? 'secondary' : 'default'}
                >
                  {isPlaying ? <Pause className="h-5 w-5 mr-2" /> : <Play className="h-5 w-5 mr-2" />}
                  {isPlaying ? 'Pause' : 'Reprendre'}
                </Button>
                <Button onClick={resetSession} size="lg" variant="outline">
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Réinitialiser
                </Button>
                <Button onClick={completeSession} size="lg" variant="default">
                  Terminer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercises List */}
      <Card>
        <CardHeader>
          <CardTitle>Exercices disponibles</CardTitle>
          <CardDescription>Choisissez un exercice de respiration ou de méditation</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="breathing">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="breathing">
                <Wind className="h-4 w-4 mr-2" />
                Respiration
              </TabsTrigger>
              <TabsTrigger value="meditation">
                <Brain className="h-4 w-4 mr-2" />
                Méditation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="breathing" className="space-y-4 mt-4">
              {exercises
                .filter((ex) => ex.type === 'breathing')
                .map((exercise) => (
                  <Card key={exercise.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{exercise.name}</CardTitle>
                          <CardDescription>{exercise.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">{Math.floor(exercise.duration / 60)} min</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {exercise.benefits.map((benefit) => (
                            <Badge key={benefit} variant="outline">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          onClick={() => startSession(exercise)}
                          disabled={!!activeExercise}
                          className="w-full"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Commencer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>

            <TabsContent value="meditation" className="space-y-4 mt-4">
              {exercises
                .filter((ex) => ex.type === 'meditation')
                .map((exercise) => (
                  <Card key={exercise.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{exercise.name}</CardTitle>
                          <CardDescription>{exercise.description}</CardDescription>
                        </div>
                        <Badge variant="secondary">{Math.floor(exercise.duration / 60)} min</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {exercise.benefits.map((benefit) => (
                            <Badge key={benefit} variant="outline">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          onClick={() => startSession(exercise)}
                          disabled={!!activeExercise}
                          className="w-full"
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          Commencer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique récent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sessions.slice(0, 5).map((session) => {
                const exercise = exercises.find((ex) => ex.id === session.exercise_id);
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      {exercise?.type === 'breathing' ? (
                        <Wind className="h-5 w-5 text-primary" />
                      ) : (
                        <Brain className="h-5 w-5 text-primary" />
                      )}
                      <div>
                        <div className="font-medium">{exercise?.name || 'Exercice'}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(session.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {Math.floor(session.duration_seconds / 60)} min
                      </div>
                      {session.completed_at && (
                        <Badge variant="secondary" className="text-xs">
                          Complété
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BreathingMeditationDashboard;
