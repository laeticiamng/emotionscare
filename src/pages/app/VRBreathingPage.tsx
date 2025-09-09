import React, { useState, useEffect } from 'react';
import { VrIcon, Monitor, Play, Pause, RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const VRBreathingPage = () => {
  const [vrSupported, setVrSupported] = useState(false);
  const [vrMode, setVrMode] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');

  // Vérifier support VR
  useEffect(() => {
    const checkVRSupport = async () => {
      if ('xr' in navigator) {
        try {
          // @ts-ignore - WebXR types
          const supported = await navigator.xr.isSessionSupported('immersive-vr');
          setVrSupported(supported);
        } catch (error) {
          setVrSupported(false);
        }
      } else {
        setVrSupported(false);
      }
    };

    checkVRSupport();
  }, []);

  // Gestion du cycle de respiration
  useEffect(() => {
    if (!sessionActive) return;

    const phaseTimer = setTimeout(() => {
      setPhase(current => current === 'inhale' ? 'exhale' : 'inhale');
    }, 4000); // 4 secondes par phase

    return () => clearTimeout(phaseTimer);
  }, [sessionActive, phase]);

  // Timer de session (max 5 min)
  useEffect(() => {
    if (!sessionActive) return;

    const timer = setInterval(() => {
      setSessionTime(prev => {
        const newTime = prev + 1;
        // Auto-stop après 5 minutes
        if (newTime >= 300) {
          endSession();
          return 300;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionActive]);

  const startVRSession = async () => {
    if (!vrSupported) {
      toast.info('VR non disponible, bascule vers le mode 2D', {
        description: 'L\'expérience continue en mode classique'
      });
      start2DSession();
      return;
    }

    try {
      // Tentative de démarrage VR
      setVrMode(true);
      setSessionActive(true);
      setSessionTime(0);
      toast.success('Session VR Galaxy démarrée', {
        description: 'Immergez-vous dans l\'univers galactique'
      });
    } catch (error) {
      toast.error('Impossible de démarrer la VR', {
        description: 'Bascule automatique vers le mode 2D'
      });
      start2DSession();
    }
  };

  const start2DSession = () => {
    setVrMode(false);
    setSessionActive(true);
    setSessionTime(0);
    setPhase('inhale');
    toast.success('Session Galaxy 2D démarrée', {
      description: 'Respirez avec les étoiles'
    });
  };

  const pauseSession = () => {
    setSessionActive(false);
    toast.info('Session mise en pause');
  };

  const endSession = () => {
    setSessionActive(false);
    setVrMode(false);
    setSessionTime(0);
    setPhase('inhale');
    toast.success('Session Galaxy terminée', {
      description: 'Vous vous sentez plus centré et apaisé'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Gestion Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        endSession();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
            VR Galaxy Respiration
          </h1>
          <p className="text-slate-300">
            Respirez avec les étoiles dans l'espace infini
          </p>
          {sessionTime > 0 && (
            <p className="text-sm text-slate-400 mt-2">
              Session : {formatTime(sessionTime)} / 5:00
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Visualisation */}
          <div className="flex items-center justify-center">
            <Card className="p-8 w-full max-w-md aspect-square flex flex-col items-center justify-center bg-slate-800/50 backdrop-blur-sm border-slate-700">
              {sessionActive ? (
                <div className="relative">
                  {/* Simulation galaxie */}
                  <div className="relative w-48 h-48 rounded-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-full" />
                    <div 
                      className={`absolute inset-4 bg-gradient-to-r from-purple-400/50 to-pink-400/50 rounded-full transition-transform duration-4000 ease-in-out ${
                        phase === 'inhale' ? 'scale-110' : 'scale-90'
                      }`}
                    />
                    <div className="absolute inset-8 bg-gradient-to-r from-white/20 to-purple-200/20 rounded-full" />
                    
                    {/* Étoiles */}
                    {Array.from({ length: 12 }, (_, i) => (
                      <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                        style={{
                          top: `${Math.random() * 80 + 10}%`,
                          left: `${Math.random() * 80 + 10}%`,
                          animationDelay: `${Math.random() * 2}s`
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="text-center mt-6 space-y-2">
                    <p className="text-lg font-medium text-purple-300">
                      {phase === 'inhale' ? 'Inspirez avec l\'univers...' : 'Expirez vers les étoiles...'}
                    </p>
                    <p className="text-sm text-slate-400">
                      {vrMode ? 'Mode VR actif' : 'Mode 2D Galaxy'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center">
                    {vrSupported ? (
                      <VrIcon className="w-12 h-12 text-purple-400" />
                    ) : (
                      <Monitor className="w-12 h-12 text-purple-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Prêt pour l'immersion ?
                    </h3>
                    <p className="text-slate-400">
                      {vrSupported 
                        ? 'Casque VR détecté - Expérience immersive disponible'
                        : 'Mode 2D disponible - Expérience visuelle apaisante'
                      }
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Contrôles */}
          <div className="space-y-6">
            {/* Status VR */}
            {!vrSupported && (
              <Alert className="border-amber-500/50 bg-amber-500/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-amber-200">
                  Casque VR non détecté. L'expérience se déroulera en mode 2D avec les mêmes bénéfices relaxants.
                </AlertDescription>
              </Alert>
            )}

            {/* Contrôles de session */}
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <div className="space-y-4">
                <h3 className="font-semibold text-white">Contrôles Galaxy</h3>
                
                <div className="flex gap-3">
                  {!sessionActive ? (
                    <>
                      {vrSupported && (
                        <Button onClick={startVRSession} className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <VrIcon className="w-4 h-4 mr-2" />
                          VR Galaxy
                        </Button>
                      )}
                      <Button onClick={start2DSession} variant="secondary" className="flex-1">
                        <Monitor className="w-4 h-4 mr-2" />
                        Galaxy 2D
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button onClick={pauseSession} variant="secondary" className="flex-1">
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </Button>
                      <Button onClick={endSession} variant="outline" className="flex-1">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Terminer
                      </Button>
                    </>
                  )}
                </div>

                {sessionActive && (
                  <div className="text-xs text-slate-400 text-center space-y-1">
                    <p>Appuyez sur Échap pour sortir immédiatement</p>
                    <div className="w-full bg-slate-700 rounded-full h-1">
                      <div 
                        className="bg-purple-500 h-1 rounded-full transition-all duration-1000"
                        style={{ width: `${(sessionTime / 300) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Informations */}
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <h3 className="font-semibold text-white mb-3">À propos de Galaxy</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Expérience limitée à 5 minutes pour un effet optimal</li>
                <li>• Respirez naturellement avec l'expansion de la galaxie</li>
                <li>• Mode VR pour immersion totale si disponible</li>
                <li>• Mode 2D avec la même efficacité relaxante</li>
                <li>• Sortie immédiate possible à tout moment</li>
              </ul>
            </Card>

            {/* Bénéfices */}
            <Card className="p-6 bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <h3 className="font-semibold text-white mb-3">Bénéfices</h3>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Réduction du stress et de l'anxiété</li>
                <li>• Amélioration de la concentration</li>
                <li>• Sensation de paix et de connexion</li>
                <li>• Recalibrage émotionnel en douceur</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRBreathingPage;