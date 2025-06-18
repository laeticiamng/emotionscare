
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VrIcon, Play, Pause, RotateCcw, HeadphonesIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VRSession {
  id: string;
  name: string;
  description: string;
  duration: number;
  type: 'meditation' | 'therapy' | 'exploration';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  benefits: string[];
}

const VRExperienceModule: React.FC = () => {
  const [sessions] = useState<VRSession[]>([
    {
      id: 'calm-forest',
      name: 'Forêt Apaisante',
      description: 'Méditation immersive dans une forêt sereine',
      duration: 15,
      type: 'meditation',
      difficulty: 'beginner',
      thumbnail: '/images/vr-forest.jpg',
      benefits: ['Réduction du stress', 'Amélioration du focus', 'Relaxation profonde']
    },
    {
      id: 'confidence-arena',
      name: 'Arène de Confiance',
      description: 'Thérapie d\'exposition pour surmonter l\'anxiété sociale',
      duration: 25,
      type: 'therapy',
      difficulty: 'intermediate',
      thumbnail: '/images/vr-arena.jpg',
      benefits: ['Confiance en soi', 'Gestion de l\'anxiété', 'Compétences sociales']
    },
    {
      id: 'ocean-depths',
      name: 'Profondeurs Océaniques',
      description: 'Exploration sous-marine pour la pleine conscience',
      duration: 20,
      type: 'exploration',
      difficulty: 'beginner',
      thumbnail: '/images/vr-ocean.jpg',
      benefits: ['Mindfulness', 'Créativité', 'Émerveillement']
    }
  ]);

  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [weeklyStats, setWeeklyStats] = useState({
    totalSessions: 12,
    totalMinutes: 180,
    streakDays: 5,
    avgStressReduction: 35
  });
  
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && activeSession) {
      interval = setInterval(() => {
        setSessionProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            setActiveSession(null);
            toast({
              title: 'Session terminée !',
              description: 'Félicitations, vous avez complété votre session VR.',
            });
            return 0;
          }
          return prev + 1;
        });
      }, 100);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, activeSession, toast]);

  const handleStartSession = async (sessionId: string) => {
    try {
      // Simulation d'appel API VR
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setActiveSession(sessionId);
      setSessionProgress(0);
      setIsPlaying(true);
      
      toast({
        title: 'Session VR démarrée',
        description: 'Mettez votre casque VR et détendez-vous.',
      });
    } catch (error) {
      toast({
        title: 'Erreur VR',
        description: 'Impossible de démarrer la session VR',
        variant: 'destructive'
      });
    }
  };

  const handlePauseResume = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setActiveSession(null);
    setSessionProgress(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meditation': return '🧘';
      case 'therapy': return '💚';
      case 'exploration': return '🌍';
      default: return '🎯';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <VrIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Expériences VR</h1>
        </div>
        <p className="text-muted-foreground">
          Immergez-vous dans des environnements virtuels thérapeutiques
        </p>
      </div>

      {/* Statistiques hebdomadaires */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>📊 Vos Statistiques VR</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{weeklyStats.totalSessions}</div>
              <div className="text-sm text-muted-foreground">Sessions cette semaine</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{weeklyStats.totalMinutes}min</div>
              <div className="text-sm text-muted-foreground">Temps d'immersion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{weeklyStats.streakDays}</div>
              <div className="text-sm text-muted-foreground">Jours consécutifs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">-{weeklyStats.avgStressReduction}%</div>
              <div className="text-sm text-muted-foreground">Réduction du stress</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session active */}
      {activeSession && (
        <Card className="mb-8 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeadphonesIcon className="h-5 w-5" />
              Session en cours: {sessions.find(s => s.id === activeSession)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression</span>
                  <span>{sessionProgress}%</span>
                </div>
                <Progress value={sessionProgress} className="h-3" />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handlePauseResume} variant="outline">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Reprendre'}
                </Button>
                <Button onClick={handleStop} variant="outline">
                  <RotateCcw className="h-4 w-4" />
                  Arrêter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <Card key={session.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-4xl">{getTypeIcon(session.type)}</div>
            </div>
            
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className={getDifficultyColor(session.difficulty)}>
                  {session.difficulty}
                </Badge>
                <Badge variant="outline">
                  {session.duration}min
                </Badge>
              </div>
              
              <CardTitle className="text-xl">{session.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {session.description}
              </p>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold mb-2">Bénéfices:</h4>
                  <div className="flex flex-wrap gap-1">
                    {session.benefits.map((benefit, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => handleStartSession(session.id)}
                  disabled={activeSession === session.id}
                >
                  {activeSession === session.id ? 'En cours...' : 'Démarrer l\'expérience'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">🎧 Conseil d'utilisation</h3>
        <p className="text-muted-foreground">
          Pour une expérience optimale, utilisez un casque VR compatible et assurez-vous d'être dans un environnement sûr. 
          Les sessions peuvent être arrêtées à tout moment si vous ressentez un inconfort.
        </p>
      </div>
    </div>
  );
};

export default VRExperienceModule;
