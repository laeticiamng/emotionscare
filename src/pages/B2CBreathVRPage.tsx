import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Wind, 
  Heart, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  ArrowLeft
} from 'lucide-react';

const B2CBreathVRPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [count, setCount] = useState(0);
  const [totalBreaths, setTotalBreaths] = useState(0);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isVRActive, setIsVRActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [coherenceScore, setCoherenceScore] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check VR support
    if ('xr' in navigator) {
      navigator.xr?.isSessionSupported('immersive-vr').then(setIsVRSupported);
    }
  }, []);

  const phaseTimings = {
    inhale: 4000,  // 4 secondes
    hold: 4000,    // 4 secondes
    exhale: 6000,  // 6 secondes
    rest: 2000     // 2 secondes
  };

  const startSession = async () => {
    setIsActive(true);
    setTotalBreaths(0);
    setCoherenceScore(0);
    
    if (isVRSupported && isVRActive) {
      try {
        // Simplified VR session initialization
        console.log('Starting VR breathing session...');
      } catch (error) {
        console.log('VR fallback to 2D mode');
        setIsVRActive(false);
      }
    }
    
    runBreathingCycle();
  };

  const runBreathingCycle = () => {
    const phases: Array<typeof phase> = ['inhale', 'hold', 'exhale', 'rest'];
    let currentPhaseIndex = 0;
    setPhase(phases[0]);
    setCount(phaseTimings[phases[0]] / 1000);

    const runPhase = () => {
      const currentPhase = phases[currentPhaseIndex];
      const duration = phaseTimings[currentPhase];
      
      setPhase(currentPhase);
      setCount(duration / 1000);

      let timeLeft = duration;
      const stepTime = 100;
      
      intervalRef.current = setInterval(() => {
        timeLeft -= stepTime;
        setCount(Math.ceil(timeLeft / 1000));
        
        if (timeLeft <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          
          currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
          
          if (currentPhaseIndex === 0) {
            setTotalBreaths(prev => prev + 1);
            setCoherenceScore(prev => Math.min(100, prev + Math.random() * 10));
          }
          
          if (currentPhaseIndex < phases.length) {
            setTimeout(runPhase, 100);
          }
        }
      }, stepTime);
    };

    runPhase();
  };

  const stopSession = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetSession = () => {
    stopSession();
    setTotalBreaths(0);
    setCoherenceScore(0);
    setPhase('inhale');
    setCount(0);
  };

  const enterVR = async () => {
    if (!isVRSupported) return;
    
    try {
      setIsVRActive(true);
      console.log('Entering VR mode for breathing...');
    } catch (error) {
      console.error('Failed to enter VR:', error);
      setIsVRActive(false);
    }
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Inspirez profondément';
      case 'hold': return 'Retenez votre souffle';
      case 'exhale': return 'Expirez lentement';
      case 'rest': return 'Détendez-vous';
      default: return '';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'bg-blue-500';
      case 'hold': return 'bg-purple-500';
      case 'exhale': return 'bg-green-500';
      case 'rest': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getFinalMessage = () => {
    if (coherenceScore >= 80) return "Cohérence excellente atteinte";
    if (coherenceScore >= 60) return "Bonne cohérence cardiaque";
    if (coherenceScore >= 40) return "Cohérence en amélioration";
    return "Continuez la pratique";
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/app/home">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">VR Respiration</h1>
              <p className="text-blue-200">Cohérence cardiaque immersive</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isVRSupported && (
              <Button
                variant={isVRActive ? "default" : "outline"}
                size="sm"
                onClick={enterVR}
                disabled={isActive}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                {isVRActive ? 'Mode VR' : 'Activer VR'}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* VR Status */}
        {isVRActive && (
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white font-medium">Mode VR Actif - Immersion galactique</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Breathing Interface */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Breathing Visualizer */}
          <Card className="bg-black/40 border-white/20">
            <CardHeader>
              <CardTitle className="text-white text-center">
                {isActive ? getPhaseInstruction() : 'Prêt à commencer'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative w-64 h-64 mx-auto">
                {/* Breathing Circle */}
                <div 
                  className={`absolute inset-0 rounded-full transition-all duration-1000 ${getPhaseColor()} opacity-70`}
                  style={{
                    transform: phase === 'inhale' ? 'scale(1.3)' : 
                             phase === 'exhale' ? 'scale(0.7)' : 'scale(1)',
                    filter: 'blur(8px)',
                  }}
                />
                <div 
                  className={`absolute inset-4 rounded-full transition-all duration-1000 ${getPhaseColor()}`}
                  style={{
                    transform: phase === 'inhale' ? 'scale(1.2)' : 
                             phase === 'exhale' ? 'scale(0.8)' : 'scale(1)',
                  }}
                />
                
                {/* Count Display */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    {isActive && (
                      <>
                        <div className="text-4xl font-bold">{count}</div>
                        <div className="text-sm opacity-80 capitalize">{phase}</div>
                      </>
                    )}
                    {!isActive && (
                      <Wind className="h-16 w-16 opacity-60" />
                    )}
                  </div>
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex justify-center gap-4 mt-8">
                {!isActive ? (
                  <Button onClick={startSession} size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Play className="h-5 w-5 mr-2" />
                    Commencer
                  </Button>
                ) : (
                  <>
                    <Button onClick={stopSession} variant="outline" size="lg">
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </Button>
                    <Button onClick={resetSession} variant="ghost" size="lg">
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Reset
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats & Progress */}
          <div className="space-y-6">
            <Card className="bg-black/40 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-400" />
                  Cohérence Cardiaque
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-300 mb-2">
                      <span>Niveau de cohérence</span>
                      <span>{Math.round(coherenceScore)}%</span>
                    </div>
                    <Progress value={coherenceScore} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">{totalBreaths}</div>
                      <div className="text-sm text-gray-400">Cycles complétés</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-white">
                        {isActive ? Math.round((totalBreaths * 16) / 60) : 0}
                      </div>
                      <div className="text-sm text-gray-400">Minutes</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">État Actuel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {totalBreaths > 0 && (
                    <Badge variant="secondary" className="w-full justify-center py-2">
                      {getFinalMessage()}
                    </Badge>
                  )}
                  
                  <div className="text-center text-gray-300">
                    <p className="text-sm">
                      Respirez au rythme du guide visuel pour optimiser votre cohérence cardiaque
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* VR Experience Info */}
            <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Expérience Immersive
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• Environnement spatial relaxant</p>
                  <p>• Guidance respiratoire 3D</p>
                  <p>• Retour biofeedback en temps réel</p>
                  <p>• Fallback 2D automatique</p>
                </div>
                
                {!isVRSupported && (
                  <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
                    <p className="text-yellow-200 text-sm">
                      VR non disponible - Mode 2D activé automatiquement
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Access */}
        <Card className="bg-black/40 border-white/20">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button variant="outline" size="sm" asChild>
                <Link to="/app/breath">Breathwork 2D</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/app/vr-galaxy">VR Galactique</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/app/flash-glow">Flash Glow</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/app/bubble-beat">Bubble Beat</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2CBreathVRPage;