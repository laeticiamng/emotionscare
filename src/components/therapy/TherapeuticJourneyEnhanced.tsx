import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  SkipForward, 
  CheckCircle2, 
  Clock, 
  Heart, 
  Brain,
  Sparkles,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { logger } from '@/lib/logger';

interface JourneySegment {
  title: string;
  type: string;
  duration: number;
  instructions: string;
  benefits: string[];
}

interface Journey {
  id: string;
  title: string;
  introduction: string;
  segments: JourneySegment[];
  recommendations: string[];
  emotion: string;
  intensity: number;
  duration_minutes: number;
  created_at: string;
}

interface Session {
  id: string;
  journey_id: string;
  started_at: string;
  completed_at?: string;
  status: string;
}

const EMOTIONS = [
  { value: 'stress', label: 'Stress', icon: '😰', color: 'bg-orange-500' },
  { value: 'anxiete', label: 'Anxiété', icon: '😟', color: 'bg-yellow-500' },
  { value: 'tristesse', label: 'Tristesse', icon: '😢', color: 'bg-blue-500' },
  { value: 'colere', label: 'Colère', icon: '😠', color: 'bg-red-500' },
  { value: 'peur', label: 'Peur', icon: '😨', color: 'bg-purple-500' },
  { value: 'solitude', label: 'Solitude', icon: '😔', color: 'bg-indigo-500' },
  { value: 'joie', label: 'Joie', icon: '😊', color: 'bg-green-500' },
  { value: 'gratitude', label: 'Gratitude', icon: '🙏', color: 'bg-pink-500' },
];

export const TherapeuticJourneyEnhanced: React.FC = () => {
  const { toast } = useToast();
  const [selectedEmotion, setSelectedEmotion] = useState('stress');
  const [intensity, setIntensity] = useState([5]);
  const [duration, setDuration] = useState([20]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentJourney, setCurrentJourney] = useState<Journey | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [segmentProgress, setSegmentProgress] = useState(0);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    favoriteEmotion: 'stress'
  });

  useEffect(() => {
    loadJourneys();
    loadStats();
  }, []);

  const loadJourneys = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('therapeutic-journey', {
        body: { action: 'list' }
      });

      if (error) throw error;
      if (data?.journeys) {
        setJourneys(data.journeys);
      }
    } catch (error) {
      logger.error('Error loading journeys', error as Error, 'UI');
    }
  };

  const loadStats = async () => {
    // Load user statistics from therapeutic_sessions
    const { data: sessions } = await supabase
      .from('therapeutic_sessions')
      .select('*')
      .eq('status', 'completed');

    if (sessions) {
      setStats({
        totalSessions: sessions.length,
        totalMinutes: sessions.length * 20, // Approximation
        favoriteEmotion: 'stress'
      });
    }
  };

  const generateJourney = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('therapeutic-journey', {
        body: {
          action: 'generate',
          emotion: selectedEmotion,
          intensity: intensity[0],
          duration: duration[0]
        }
      });

      if (error) throw error;

      if (data?.journey) {
        setCurrentJourney(data.journey);
        toast({
          title: "Parcours généré ✨",
          description: "Votre parcours thérapeutique personnalisé est prêt",
        });
      }
    } catch (error: any) {
      logger.error('Error generating journey', error as Error, 'UI');
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer le parcours",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startSession = async () => {
    if (!currentJourney) return;

    try {
      const { data, error } = await supabase.functions.invoke('therapeutic-journey', {
        body: {
          action: 'start',
          journeyId: currentJourney.id
        }
      });

      if (error) throw error;

      if (data?.session) {
        setCurrentSession(data.session);
        setIsPlaying(true);
        setCurrentSegmentIndex(0);
        toast({
          title: "Session démarrée 🎯",
          description: "Prenez une profonde inspiration et commençons",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de démarrer la session",
        variant: "destructive"
      });
    }
  };

  const completeSession = async () => {
    if (!currentSession) return;

    try {
      const { error } = await supabase.functions.invoke('therapeutic-journey', {
        body: {
          action: 'complete',
          sessionId: currentSession.id,
          completionData: {
            segments_completed: currentSegmentIndex + 1,
            total_segments: currentJourney?.segments.length || 0
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Session terminée ✅",
        description: "Bravo ! Vous avez complété votre parcours thérapeutique",
      });

      setIsPlaying(false);
      setCurrentSession(null);
      loadJourneys();
      loadStats();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de terminer la session",
        variant: "destructive"
      });
    }
  };

  const selectedEmotionData = EMOTIONS.find(e => e.value === selectedEmotion);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            Parcours Thérapeutiques Guidés
          </h1>
          <p className="text-muted-foreground mt-1">
            Séances personnalisées générées par IA
          </p>
        </div>
        <Card className="p-4">
          <div className="flex gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalSessions}</div>
              <div className="text-muted-foreground">Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalMinutes}</div>
              <div className="text-muted-foreground">Minutes</div>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">
            <Sparkles className="w-4 h-4 mr-2" />
            Nouveau Parcours
          </TabsTrigger>
          <TabsTrigger value="session">
            <Play className="w-4 h-4 mr-2" />
            Session Active
          </TabsTrigger>
          <TabsTrigger value="history">
            <Calendar className="w-4 h-4 mr-2" />
            Historique
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Générer un parcours personnalisé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Sélectionnez votre émotion principale
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {EMOTIONS.map((emotion) => (
                    <Button
                      key={emotion.value}
                      variant={selectedEmotion === emotion.value ? "default" : "outline"}
                      className="h-auto py-4 flex-col gap-2"
                      onClick={() => setSelectedEmotion(emotion.value)}
                    >
                      <span className="text-3xl">{emotion.icon}</span>
                      <span className="text-sm">{emotion.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Intensité émotionnelle: {intensity[0]}/10
                </label>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  min={1}
                  max={10}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Légère</span>
                  <span>Modérée</span>
                  <span>Intense</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Durée souhaitée: {duration[0]} minutes
                </label>
                <Slider
                  value={duration}
                  onValueChange={setDuration}
                  min={10}
                  max={45}
                  step={5}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10 min</span>
                  <span>25 min</span>
                  <span>45 min</span>
                </div>
              </div>

              <Button
                onClick={generateJourney}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin mr-2">⚡</span>
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Générer mon parcours thérapeutique
                  </>
                )}
              </Button>

              {currentJourney && !currentSession && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-lg mb-2">{currentJourney.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {currentJourney.introduction}
                    </p>
                    <div className="space-y-2 mb-4">
                      {currentJourney.segments?.map((segment, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">{segment.duration} min</Badge>
                          <span>{segment.title}</span>
                        </div>
                      ))}
                    </div>
                    <Button onClick={startSession} className="w-full">
                      <Play className="w-4 h-4 mr-2" />
                      Commencer la session
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="session">
          {currentSession && currentJourney ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentJourney.title}</span>
                  <Badge className={selectedEmotionData?.color}>
                    {selectedEmotionData?.icon} {selectedEmotionData?.label}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Segment {currentSegmentIndex + 1} sur {currentJourney.segments?.length || 0}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {segmentProgress}%
                    </span>
                  </div>
                  <Progress value={segmentProgress} className="mb-4" />
                </div>

                {currentJourney.segments?.[currentSegmentIndex] && (
                  <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Brain className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">
                          {currentJourney.segments[currentSegmentIndex].title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {currentJourney.segments[currentSegmentIndex].duration} minutes
                          <Badge variant="outline" className="ml-2">
                            {currentJourney.segments[currentSegmentIndex].type}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="prose prose-sm max-w-none">
                      <p className="text-foreground leading-relaxed">
                        {currentJourney.segments[currentSegmentIndex].instructions}
                      </p>
                    </div>

                    {currentJourney.segments[currentSegmentIndex].benefits && (
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium mb-2">Bénéfices attendus:</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {currentJourney.segments[currentSegmentIndex].benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isPlaying ? 'Pause' : 'Reprendre'}
                  </Button>
                  
                  {currentSegmentIndex < (currentJourney.segments?.length || 0) - 1 ? (
                    <Button
                      onClick={() => setCurrentSegmentIndex(prev => prev + 1)}
                      className="flex-1"
                    >
                      <SkipForward className="w-4 h-4 mr-2" />
                      Segment suivant
                    </Button>
                  ) : (
                    <Button
                      onClick={completeSession}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Terminer la session
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Aucune session active</h3>
                <p className="text-muted-foreground mb-4">
                  Générez un parcours thérapeutique pour commencer
                </p>
                <Button onClick={() => document.querySelector<HTMLButtonElement>('[data-value="generate"]')?.click()}>
                  Générer un parcours
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history">
          <div className="grid gap-4">
            {journeys.length > 0 ? (
              journeys.map((journey) => (
                <Card key={journey.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold mb-1">{journey.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {journey.introduction?.substring(0, 150)}...
                        </p>
                        <div className="flex gap-2">
                          <Badge>{journey.emotion}</Badge>
                          <Badge variant="outline">
                            <Clock className="w-3 h-3 mr-1" />
                            {journey.duration_minutes} min
                          </Badge>
                          <Badge variant="outline">
                            Intensité {journey.intensity}/10
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => {
                          setCurrentJourney(journey);
                          document.querySelector<HTMLButtonElement>('[data-value="generate"]')?.click();
                        }}
                      >
                        Reprendre
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <TrendingUp className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun parcours</h3>
                  <p className="text-muted-foreground">
                    Vos parcours thérapeutiques apparaîtront ici
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
