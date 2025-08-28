import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Heart, Play, Pause, Activity, Bluetooth, Watch } from 'lucide-react';
import { PrivacyFallbacks } from '@/components/privacy/PrivacyFallbacks';
import { analyticsService } from '@/services/analyticsService';
import { useToast } from '@/hooks/use-toast';

const B2CBubbleBeatPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [hrPermission, setHrPermission] = useState<boolean>(true);
  const [isSimulation, setIsSimulation] = useState(false);
  const [currentRhythm, setCurrentRhythm] = useState<'calme' | 'neutre' | 'soutenu'>('neutre');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [coherenceLevel, setCoherenceLevel] = useState<'élevée' | 'correcte' | 'à entraîner'>('correcte');

  useEffect(() => {
    analyticsService.trackModuleStart('bubble-beat');
    checkHRPermission();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMonitoring) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
        simulateHeartRateData();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring]);

  const checkHRPermission = async () => {
    try {
      // Simulation de vérification de permission HR
      if ('bluetooth' in navigator) {
        setHrPermission(true);
        setIsSimulation(false);
      } else {
        throw new Error('HR sensors not available');
      }
    } catch (error) {
      setHrPermission(false);
      setIsSimulation(true);
      analyticsService.trackModuleFallback('bubble-beat', 'no_hr_sensor');
    }
  };

  const simulateHeartRateData = () => {
    // Simulation de données de rythme cardiaque
    const rhythms: ('calme' | 'neutre' | 'soutenu')[] = ['calme', 'neutre', 'soutenu'];
    const coherences: ('élevée' | 'correcte' | 'à entraîner')[] = ['élevée', 'correcte', 'à entraîner'];
    
    if (Math.random() > 0.8) {
      setCurrentRhythm(rhythms[Math.floor(Math.random() * rhythms.length)]);
    }
    
    if (Math.random() > 0.9) {
      setCoherenceLevel(coherences[Math.floor(Math.random() * coherences.length)]);
    }
  };

  const startMonitoring = () => {
    if (!hrPermission && !isSimulation) {
      analyticsService.trackModuleFallback('bubble-beat', 'no_permission');
      return;
    }

    setIsMonitoring(true);
    setSessionDuration(0);
    analyticsService.track('bubble-beat.session.start', 'module', { 
      mode: isSimulation ? 'simulation' : 'real' 
    });

    if (isSimulation) {
      toast({
        title: "Mode simulation activé",
        description: "Données de démonstration utilisées",
      });
    }
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    analyticsService.trackModuleFinish('bubble-beat', sessionDuration);
    
    toast({
      title: "Session terminée",
      description: `Durée: ${Math.floor(sessionDuration / 60)}:${(sessionDuration % 60).toString().padStart(2, '0')}`,
    });
  };

  const getRhythmColor = () => {
    switch (currentRhythm) {
      case 'calme': return 'bg-blue-500';
      case 'neutre': return 'bg-green-500';
      case 'soutenu': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getCoherenceColor = () => {
    switch (coherenceLevel) {
      case 'élevée': return 'text-green-600';
      case 'correcte': return 'text-blue-600';
      case 'à entraîner': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/b2c/dashboard')}
            className="hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bubble-Beat</h1>
            <p className="text-gray-600">Cohérence cardiaque et variabilité HRV</p>
          </div>
        </div>

        {/* Privacy Fallback */}
        {!hrPermission && (
          <PrivacyFallbacks 
            type="SimHR"
            message="Capteurs cardiaques non disponibles"
            fallbackAction={() => setIsSimulation(true)}
            fallbackLabel="Utiliser la simulation"
          />
        )}

        {/* Interface principale */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Visualisation du rythme */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Rythme Cardiaque
                </div>
                {isSimulation && (
                  <Badge className="bg-orange-500" aria-label="Mode simulation actif">
                    Simulation
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                {/* Animation de battement */}
                <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
                  isMonitoring ? 'animate-pulse' : ''
                } ${getRhythmColor()}`}>
                  <Heart className={`w-16 h-16 text-white ${
                    isMonitoring ? 'animate-bounce' : ''
                  }`} />
                </div>

                {/* État du rythme */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-2xl font-bold capitalize">{currentRhythm}</h3>
                  <p className="text-gray-600" role="status" aria-live="polite">
                    Rythme cardiaque {currentRhythm}
                  </p>
                  
                  {isMonitoring && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Durée de session</p>
                      <p className="text-xl font-mono">{formatDuration(sessionDuration)}</p>
                    </div>
                  )}
                </div>

                {/* Contrôles */}
                <div className="flex gap-4 justify-center">
                  {!isMonitoring ? (
                    <Button 
                      onClick={startMonitoring}
                      size="lg"
                      className="bg-gradient-to-r from-red-500 to-pink-500"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Démarrer la mesure
                    </Button>
                  ) : (
                    <Button 
                      onClick={stopMonitoring}
                      size="lg"
                      variant="outline"
                    >
                      <Pause className="w-5 h-5 mr-2" />
                      Arrêter
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métriques de cohérence */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Cohérence Cardiaque
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Niveau de cohérence */}
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${getCoherenceColor()}`}>
                  {coherenceLevel}
                </div>
                <Progress 
                  value={coherenceLevel === 'élevée' ? 90 : coherenceLevel === 'correcte' ? 60 : 30} 
                  className="mb-4"
                  aria-label={`Niveau de cohérence: ${coherenceLevel}`}
                />
                <p className="text-sm text-gray-600">
                  Niveau de cohérence cardiaque
                </p>
              </div>

              {/* Conseils contextuels */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Conseil du moment</h4>
                <p className="text-sm text-gray-600">
                  {coherenceLevel === 'élevée' && "Excellent ! Maintenez cette cohérence."}
                  {coherenceLevel === 'correcte' && "Bon niveau. Concentrez-vous sur votre respiration."}
                  {coherenceLevel === 'à entraîner' && "Respirez profondément et régulièrement."}
                </p>
              </div>

              {/* État des capteurs */}
              <div className="space-y-3">
                <h4 className="font-medium">État des capteurs</h4>
                <div className="flex items-center gap-3">
                  <Bluetooth className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">
                    {hrPermission ? 'Capteurs disponibles' : 'Capteurs indisponibles'}
                  </span>
                  <Badge variant={hrPermission ? "default" : "secondary"}>
                    {hrPermission ? 'Connecté' : 'Déconnecté'}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Watch className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Mode {isSimulation ? 'Simulation' : 'Réel'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exercices de cohérence cardiaque */}
        <Card>
          <CardHeader>
            <CardTitle>Exercices de Cohérence Cardiaque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: '4-7-8 Respiration',
                  description: 'Inspirez 4s, retenez 7s, expirez 8s',
                  duration: '5 min',
                  difficulty: 'Débutant'
                },
                {
                  title: 'Cohérence 5-5',
                  description: 'Inspirez 5s, expirez 5s en continu',
                  duration: '10 min',
                  difficulty: 'Intermédiaire'
                },
                {
                  title: 'Variation Personnalisée',
                  description: 'Adapté à votre rythme cardiaque actuel',
                  duration: '15 min',
                  difficulty: 'Avancé'
                }
              ].map((exercise, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{exercise.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                      <span>{exercise.duration}</span>
                      <Badge variant="outline">{exercise.difficulty}</Badge>
                    </div>
                    <Button size="sm" className="w-full">
                      Commencer
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Historique des sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { date: 'Aujourd\'hui 14:30', duration: '12 min', coherence: 'Élevée', rhythm: 'Calme' },
                { date: 'Hier 09:15', duration: '8 min', coherence: 'Correcte', rhythm: 'Neutre' },
                { date: '2 jours - 16:45', duration: '15 min', coherence: 'Élevée', rhythm: 'Calme' }
              ].map((session, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{session.date}</div>
                    <div className="text-sm text-gray-600">
                      {session.duration} • Rythme {session.rhythm}
                    </div>
                  </div>
                  <Badge variant={session.coherence === 'Élevée' ? 'default' : 'secondary'}>
                    {session.coherence}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CBubbleBeatPage;