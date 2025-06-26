
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Headphones, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Volume2, 
  Settings,
  Timer,
  Mountain,
  Waves,
  TreePine,
  Sun,
  Moon,
  Cloud
} from 'lucide-react';

interface VRSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: 'relaxation' | 'meditation' | 'therapy' | 'focus';
  environment: string;
  icon: React.ComponentType<any>;
  color: string;
  completed: boolean;
}

const VRPage: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<VRSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const vrSessions: VRSession[] = [
    {
      id: '1',
      title: 'Montagne Zen',
      description: 'Méditation guidée au sommet d\'une montagne paisible',
      duration: 15,
      type: 'meditation',
      environment: 'Mountain',
      icon: Mountain,
      color: 'bg-blue-500',
      completed: false
    },
    {
      id: '2',
      title: 'Plage Tropicale',
      description: 'Relaxation profonde au bord de l\'océan',
      duration: 20,
      type: 'relaxation',
      environment: 'Beach',
      icon: Waves,
      color: 'bg-cyan-500',
      completed: true
    },
    {
      id: '3',
      title: 'Forêt Enchantée',
      description: 'Thérapie par la nature en forêt immersive',
      duration: 25,
      type: 'therapy',
      environment: 'Forest',
      icon: TreePine,
      color: 'bg-green-500',
      completed: false
    },
    {
      id: '4',
      title: 'Lever de Soleil',
      description: 'Session de concentration avec un lever de soleil',
      duration: 10,
      type: 'focus',
      environment: 'Sunrise',
      icon: Sun,
      color: 'bg-orange-500',
      completed: false
    },
    {
      id: '5',
      title: 'Nuit Étoilée',
      description: 'Méditation nocturne sous les étoiles',
      duration: 30,
      type: 'meditation',
      environment: 'Night Sky',
      icon: Moon,
      color: 'bg-purple-500',
      completed: false
    },
    {
      id: '6',
      title: 'Nuages Flottants',
      description: 'Relaxation en flottant parmi les nuages',
      duration: 18,
      type: 'relaxation',
      environment: 'Clouds',
      icon: Cloud,
      color: 'bg-gray-500',
      completed: false
    }
  ];

  const startSession = (session: VRSession) => {
    setCurrentSession(session);
    setIsPlaying(true);
    setProgress(0);
    setDuration(session.duration * 60); // Convert to seconds
    
    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsPlaying(false);
          return 100;
        }
        return prev + (100 / (session.duration * 60));
      });
    }, 1000);
  };

  const pauseSession = () => {
    setIsPlaying(false);
  };

  const stopSession = () => {
    setCurrentSession(null);
    setIsPlaying(false);
    setProgress(0);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'meditation': return 'bg-purple-100 text-purple-800';
      case 'relaxation': return 'bg-blue-100 text-blue-800';
      case 'therapy': return 'bg-green-100 text-green-800';
      case 'focus': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'meditation': return 'Méditation';
      case 'relaxation': return 'Relaxation';
      case 'therapy': return 'Thérapie';
      case 'focus': return 'Concentration';
      default: return type;
    }
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-100 rounded-full">
              <Headphones className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Expériences VR Thérapeutiques</h1>
              <p className="text-gray-600">Immersion totale pour votre bien-être mental</p>
            </div>
          </div>
        </div>

        {/* Current Session */}
        {currentSession && (
          <Card className="mb-8 border-2 border-indigo-200 bg-indigo-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 ${currentSession.color} rounded-full`}>
                    <currentSession.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {currentSession.title}
                      {isPlaying && <div className="animate-pulse h-2 w-2 bg-red-500 rounded-full"></div>}
                    </CardTitle>
                    <CardDescription>{currentSession.description}</CardDescription>
                  </div>
                </div>
                <Badge className={getTypeColor(currentSession.type)}>
                  {getTypeLabel(currentSession.type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Timer className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {Math.floor((currentSession.duration * 60 * progress) / 100 / 60)}:
                    {String(Math.floor(((currentSession.duration * 60 * progress) / 100) % 60)).padStart(2, '0')} / 
                    {currentSession.duration}:00
                  </span>
                </div>
                
                <Progress value={progress} className="h-2" />
                
                <div className="flex items-center gap-2">
                  {!isPlaying ? (
                    <Button 
                      onClick={() => setIsPlaying(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {progress > 0 ? 'Reprendre' : 'Démarrer'}
                    </Button>
                  ) : (
                    <Button 
                      onClick={pauseSession}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  <Button onClick={stopSession} variant="outline">
                    <Square className="h-4 w-4 mr-2" />
                    Arrêter
                  </Button>
                  
                  <Button onClick={() => setProgress(0)} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Recommencer
                  </Button>
                  
                  <Button variant="outline" size="icon">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="outline" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Headphones className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Sessions totales</p>
                  <p className="text-2xl font-bold">{vrSessions.filter(s => s.completed).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Timer className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Temps total</p>
                  <p className="text-2xl font-bold">2h 45m</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Mountain className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Environnement favori</p>
                  <p className="text-lg font-bold">Montagne</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Sun className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Série actuelle</p>
                  <p className="text-2xl font-bold">5 jours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Available Sessions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Expériences disponibles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vrSessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 ${session.color} rounded-full`}>
                        <session.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{session.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Timer className="h-4 w-4" />
                          {session.duration} minutes
                        </CardDescription>
                      </div>
                    </div>
                    {session.completed && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Terminé
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{session.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge className={getTypeColor(session.type)}>
                      {getTypeLabel(session.type)}
                    </Badge>
                    <Button 
                      onClick={() => startSession(session)}
                      disabled={currentSession?.id === session.id}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {currentSession?.id === session.id ? 'En cours' : 'Démarrer'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">💡 Conseils pour une meilleure expérience</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Trouvez un endroit calme et confortable</li>
              <li>• Utilisez un casque audio de qualité pour une immersion optimale</li>
              <li>• Pratiquez régulièrement pour des bénéfices durables</li>
              <li>• N'hésitez pas à ajuster les paramètres selon vos préférences</li>
              <li>• Prenez quelques minutes après chaque session pour intégrer l'expérience</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VRPage;
