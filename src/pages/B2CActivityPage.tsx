/**
 * 🏃‍♀️ PAGE ACTIVITÉ - Version Unifiée
 * Suivi des activités physiques et bien-être avec intégration émotionnelle
 */

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { UnifiedEmotionAnalyzer } from '@/core/UnifiedEmotionAnalyzer';
import { UnifiedMusicTherapy } from '@/core/UnifiedMusicTherapy';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Heart, 
  Timer, 
  Target, 
  Play, 
  Pause, 
  RotateCcw,
  TrendingUp,
  Calendar,
  Award,
  Music,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ActivitySession {
  id: string;
  type: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
  emotion?: string;
  completed: boolean;
  startTime?: Date;
}

const ACTIVITY_TYPES = [
  { id: 'meditation', name: 'Méditation', icon: Brain, emotion: 'calm' },
  { id: 'cardio', name: 'Cardio', icon: Heart, emotion: 'energetic' },
  { id: 'yoga', name: 'Yoga', icon: Activity, emotion: 'focused' },
  { id: 'breathing', name: 'Respiration', icon: Timer, emotion: 'relaxed' },
  { id: 'walking', name: 'Marche', icon: Target, emotion: 'peaceful' },
];

export const B2CActivityPage: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<ActivitySession | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITY_TYPES[0]);
  const [weeklyProgress, setWeeklyProgress] = useState(65);
  const [dailyGoal] = useState(30); // 30 minutes par jour
  const [todayActivity] = useState(18); // 18 minutes aujourd'hui
  const { toast } = useToast();

  // Timer pour la session active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && currentSession) {
      interval = setInterval(() => {
        setSessionTime(time => time + 1);
      }, 1000);
    } else if (!isActive && sessionTime !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, sessionTime, currentSession]);

  const startSession = () => {
    const session: ActivitySession = {
      id: Date.now().toString(),
      type: selectedActivity.id,
      duration: 0,
      intensity: 'medium',
      emotion: selectedActivity.emotion,
      completed: false,
      startTime: new Date()
    };
    
    setCurrentSession(session);
    setSessionTime(0);
    setIsActive(true);
    
    toast({
      title: "Session démarrée",
      description: `Début de votre session de ${selectedActivity.name}`,
    });
  };

  const pauseSession = () => {
    setIsActive(!isActive);
    toast({
      title: isActive ? "Session mise en pause" : "Session reprise",
      description: isActive ? "Prenez une pause" : "Continuez votre activité",
    });
  };

  const stopSession = () => {
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        duration: sessionTime,
        completed: true
      };
      
      toast({
        title: "Session terminée !",
        description: `${Math.floor(sessionTime / 60)}min ${sessionTime % 60}s de ${selectedActivity.name} complétées`,
      });
    }
    
    setCurrentSession(null);
    setSessionTime(0);
    setIsActive(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmotionDetected = (emotion: string) => {
    const activityMatch = ACTIVITY_TYPES.find(a => a.emotion === emotion);
    if (activityMatch) {
      setSelectedActivity(activityMatch);
      toast({
        title: "Activité suggérée",
        description: `Basé sur votre émotion, nous recommandons: ${activityMatch.name}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Activités & Bien-être
            </h1>
            <p className="text-muted-foreground text-lg">
              Suivez vos activités physiques avec analyse émotionnelle et musique adaptative
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Session en cours */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {React.createElement(selectedActivity.icon, { className: "w-5 h-5" })}
                    Session Active - {selectedActivity.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-6xl font-mono font-bold mb-4 text-primary">
                      {formatTime(sessionTime)}
                    </div>
                    <Badge variant={currentSession ? "default" : "secondary"} className="mb-4">
                      {currentSession ? `En cours - ${selectedActivity.emotion}` : 'Prêt à commencer'}
                    </Badge>
                  </div>

                  <div className="flex justify-center gap-3 mb-6">
                    {!currentSession ? (
                      <Button onClick={startSession} size="lg" className="px-8">
                        <Play className="w-4 h-4 mr-2" />
                        Démarrer
                      </Button>
                    ) : (
                      <>
                        <Button onClick={pauseSession} size="lg" variant="outline">
                          {isActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                          {isActive ? 'Pause' : 'Reprendre'}
                        </Button>
                        <Button onClick={stopSession} size="lg" variant="destructive">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Terminer
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Sélection d'activité */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ACTIVITY_TYPES.map((activity) => (
                      <Button
                        key={activity.id}
                        variant={selectedActivity.id === activity.id ? "default" : "outline"}
                        className="h-auto p-3 flex flex-col gap-2"
                        onClick={() => setSelectedActivity(activity)}
                        disabled={!!currentSession}
                      >
                        {React.createElement(activity.icon, { className: "w-5 h-5" })}
                        <span className="text-xs">{activity.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tabs pour fonctionnalités avancées */}
              <Tabs defaultValue="emotion" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="emotion" className="flex items-center gap-2">
                    <Brain className="w-4 h-4" />
                    Analyse Émotionnelle
                  </TabsTrigger>
                  <TabsTrigger value="music" className="flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    Musique d'Accompagnement
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="emotion" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Comment vous sentez-vous ?</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <UnifiedEmotionAnalyzer
                        text=""
                        onEmotionDetected={handleEmotionDetected}
                        showResults={true}
                        autoAnalyze={false}
                        placeholder="Décrivez votre état d'esprit avant l'activité..."
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="music" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Musique d'Entraînement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <UnifiedMusicTherapy
                        emotion={selectedActivity.emotion}
                        autoGenerate={!!currentSession}
                        showPlayer={true}
                        intensity={0.8}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Statistiques et objectifs */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Objectifs Quotidiens
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Activité du jour</span>
                        <span className="text-sm text-muted-foreground">
                          {todayActivity}/{dailyGoal} min
                        </span>
                      </div>
                      <Progress value={(todayActivity / dailyGoal) * 100} />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Objectif hebdomadaire</span>
                        <span className="text-sm text-muted-foreground">
                          {weeklyProgress}%
                        </span>
                      </div>
                      <Progress value={weeklyProgress} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Statistiques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Cette semaine</span>
                      <Badge variant="secondary">142 min</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Séries réalisées</span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Activité préférée</span>
                      <Badge>Méditation</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Récompenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-center p-2">
                      🏃‍♀️ Première semaine complète
                    </Badge>
                    <Badge variant="outline" className="w-full justify-center p-2">
                      🧘‍♂️ Expert en méditation
                    </Badge>
                    <Badge variant="outline" className="w-full justify-center p-2">
                      ❤️ Équilibre émotionnel
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default B2CActivityPage;