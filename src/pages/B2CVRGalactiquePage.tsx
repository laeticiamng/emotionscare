import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Play, Pause, RotateCw, Volume2, VolumeOff, Sparkles, Globe, Zap, Heart, Brain, Stars } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VRSession {
  id: string;
  sessionType: string;
  environment: string;
  duration: number;
  emotionsBefore?: Record<string, number>;
  emotionsAfter?: Record<string, number>;
  rating?: number;
}

interface Galaxy3DProps {
  isActive: boolean;
  environment: string;
  intensity: number;
  soundEnabled: boolean;
}

const Galaxy3D: React.FC<Galaxy3DProps> = ({ isActive, environment, intensity, soundEnabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [stars, setStars] = useState<Array<{x: number, y: number, z: number, speed: number}>>([]);

  useEffect(() => {
    // Générer les étoiles
    const newStars = Array.from({ length: 200 + intensity * 50 }, () => ({
      x: (Math.random() - 0.5) * 2000,
      y: (Math.random() - 0.5) * 2000,
      z: Math.random() * 2000,
      speed: 0.5 + Math.random() * 2
    }));
    setStars(newStars);
  }, [intensity]);

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Adapter la taille du canvas
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    
    const animate = () => {
      ctx.fillStyle = getEnvironmentColor(environment);
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dessiner les étoiles
      stars.forEach(star => {
        star.z -= star.speed * (1 + intensity);
        if (star.z <= 0) {
          star.z = 2000;
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
        }

        const x = (star.x / star.z) * canvas.width / 2 + canvas.width / 2;
        const y = (star.y / star.z) * canvas.height / 2 + canvas.height / 2;
        const size = (1 - star.z / 2000) * 3;

        if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
          ctx.beginPath();
          ctx.fillStyle = `hsl(${200 + Math.sin(time * 0.01) * 60}, 70%, ${50 + size * 20}%)`;
          ctx.arc(x, y, Math.max(0.1, size), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Effets de particules spéciaux selon l'environnement
      drawEnvironmentEffects(ctx, canvas, time, environment, intensity);
      
      time++;
      if (isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, environment, intensity, stars]);

  const getEnvironmentColor = (env: string): string => {
    switch (env) {
      case 'nebula': return 'radial-gradient(circle, #1a0033, #000011)';
      case 'deep_space': return 'linear-gradient(45deg, #000011, #001122)';
      case 'cosmic_storm': return 'radial-gradient(circle, #330011, #110033)';
      case 'peaceful_void': return 'linear-gradient(to bottom, #000022, #000044)';
      default: return 'linear-gradient(to bottom, #000033, #000066)';
    }
  };

  const drawEnvironmentEffects = (
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    time: number, 
    env: string, 
    intensity: number
  ) => {
    switch (env) {
      case 'nebula':
        // Effet nébuleuse avec particules colorées
        for (let i = 0; i < 20 + intensity * 10; i++) {
          const x = Math.sin(time * 0.002 + i) * 200 + canvas.width / 2;
          const y = Math.cos(time * 0.003 + i) * 150 + canvas.height / 2;
          ctx.beginPath();
          ctx.fillStyle = `hsla(${280 + i * 10}, 60%, 50%, 0.1)`;
          ctx.arc(x, y, 20 + Math.sin(time * 0.01 + i) * 10, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      case 'cosmic_storm':
        // Éclairs cosmiques
        if (time % 60 < 3) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 * intensity})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(Math.random() * canvas.width, 0);
          ctx.quadraticCurveTo(
            Math.random() * canvas.width, 
            canvas.height / 2, 
            Math.random() * canvas.width, 
            canvas.height
          );
          ctx.stroke();
        }
        break;
      case 'peaceful_void':
        // Orbes flottantes paisibles
        for (let i = 0; i < 5; i++) {
          const x = Math.sin(time * 0.001 + i * 2) * 100 + canvas.width / 2;
          const y = Math.cos(time * 0.0015 + i * 2) * 80 + canvas.height / 2;
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 30);
          glow.addColorStop(0, `hsla(180, 50%, 70%, 0.3)`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.fillRect(x - 30, y - 30, 60, 60);
        }
        break;
    }
  };

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full"
      style={{
        background: getEnvironmentColor(environment),
        filter: soundEnabled ? `blur(0px)` : `blur(1px)`
      }}
    />
  );
};

const B2CVRGalactiquePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [selectedEnvironment, setSelectedEnvironment] = useState('deep_space');
  const [intensity, setIntensity] = useState([5]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [emotionBefore, setEmotionBefore] = useState<Record<string, number>>({});
  const [emotionAfter, setEmotionAfter] = useState<Record<string, number>>({});
  const [sessionHistory, setSessionHistory] = useState<VRSession[]>([]);

  const environments = [
    { id: 'deep_space', name: 'Espace Profond', description: 'Voyage dans les étoiles', icon: '🌌' },
    { id: 'nebula', name: 'Nébuleuse Colorée', description: 'Nuages cosmiques magiques', icon: '🌈' },
    { id: 'cosmic_storm', name: 'Tempête Cosmique', description: 'Énergie et électricité', icon: '⚡' },
    { id: 'peaceful_void', name: 'Vide Paisible', description: 'Sérénité absolue', icon: '🕊️' }
  ];

  const emotionScales = [
    { id: 'stress', label: 'Niveau de stress', icon: '😰' },
    { id: 'calm', label: 'Sentiment de calme', icon: '😌' },
    { id: 'energy', label: 'Niveau d\'énergie', icon: '⚡' },
    { id: 'focus', label: 'Capacité de concentration', icon: '🎯' }
  ];

  useEffect(() => {
    loadSessionHistory();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive) {
      interval = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSessionActive]);

  const loadSessionHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('vr_sessions')
        .select('*')
        .eq('session_type', 'galaxy')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      if (data) {
        const formattedSessions = data.map(session => ({
          id: session.id,
          sessionType: session.session_type,
          environment: session.environment,
          duration: session.duration,
          emotionsBefore: session.emotions_before,
          emotionsAfter: session.emotions_after,
          rating: session.session_rating
        }));
        setSessionHistory(formattedSessions);
      }
    } catch (error) {
      console.error('Erreur chargement historique:', error);
    }
  };

  const startSession = async () => {
    setIsSessionActive(true);
    setSessionDuration(0);
    
    toast({
      title: "Session VR démarrée 🚀",
      description: `Immersion dans ${environments.find(e => e.id === selectedEnvironment)?.name}`,
    });

    // Simulation de capteurs biométriques
    const simulatedEmotions = {
      stress: Math.floor(Math.random() * 4) + 6, // 6-9
      calm: Math.floor(Math.random() * 4) + 3,   // 3-6
      energy: Math.floor(Math.random() * 4) + 5, // 5-8
      focus: Math.floor(Math.random() * 4) + 4   // 4-7
    };
    setEmotionBefore(simulatedEmotions);
  };

  const endSession = async () => {
    setIsSessionActive(false);
    
    // Simulation d'amélioration des émotions après VR
    const improvedEmotions = {
      stress: Math.max(1, emotionBefore.stress - Math.floor(Math.random() * 3) - 2),
      calm: Math.min(10, emotionBefore.calm + Math.floor(Math.random() * 3) + 2),
      energy: emotionBefore.energy + Math.floor(Math.random() * 2),
      focus: Math.min(10, emotionBefore.focus + Math.floor(Math.random() * 2) + 1)
    };
    setEmotionAfter(improvedEmotions);

    try {
      // Sauvegarder la session
      await supabase.from('vr_sessions').insert({
        session_type: 'galaxy',
        environment: selectedEnvironment,
        duration: sessionDuration,
        emotions_before: emotionBefore,
        emotions_after: improvedEmotions,
        biometric_data: { intensity: intensity[0], sound_enabled: soundEnabled }
      });

      await loadSessionHistory();
      
      toast({
        title: "Session terminée! ✨",
        description: `Durée: ${formatTime(sessionDuration)}. Bienfaits détectés!`,
      });
    } catch (error) {
      console.error('Erreur sauvegarde session:', error);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmotionImprovement = (before: number, after: number): string => {
    const diff = after - before;
    if (diff > 2) return 'Excellente amélioration';
    if (diff > 0) return 'Amélioration positive';
    if (diff === 0) return 'Stable';
    return 'Léger déclin';
  };

  const getImprovementColor = (before: number, after: number): string => {
    const diff = after - before;
    if (diff > 2) return 'text-green-600';
    if (diff > 0) return 'text-blue-600';
    if (diff === 0) return 'text-gray-600';
    return 'text-orange-600';
  };

  return (
    <div data-testid="page-root" className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/app/home')} className="text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                VR Galaxy
              </h1>
              <p className="text-gray-300">Voyage cosmique immersif</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Stars className="w-6 h-6 text-cyan-400" />
            <Badge variant="secondary" className="bg-purple-900/50 text-purple-200 border-purple-500">
              VR Thérapie
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main VR Display */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="border-2 border-purple-500/30 bg-black/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  <Galaxy3D 
                    isActive={true}
                    environment={selectedEnvironment}
                    intensity={intensity[0]}
                    soundEnabled={soundEnabled}
                  />
                  
                  {/* Overlay de contrôles VR */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Session Info Overlay */}
                  {isSessionActive && (
                    <div className="absolute top-4 left-4 text-white">
                      <div className="bg-black/60 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">Session Active</span>
                        </div>
                        <div className="text-2xl font-mono">{formatTime(sessionDuration)}</div>
                        <div className="text-sm text-gray-300">{environments.find(e => e.id === selectedEnvironment)?.name}</div>
                      </div>
                    </div>
                  )}

                  {/* Contrôles en bas */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 pointer-events-auto">
                    <div className="bg-black/80 rounded-full px-6 py-3 flex items-center gap-4">
                      {!isSessionActive ? (
                        <Button 
                          onClick={startSession}
                          size="lg"
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-full"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Démarrer l'Immersion
                        </Button>
                      ) : (
                        <Button 
                          onClick={endSession}
                          size="lg"
                          variant="destructive"
                          className="rounded-full"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Terminer
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className="text-white hover:bg-white/10 rounded-full"
                      >
                        {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeOff className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Résultats de session */}
            {emotionAfter.calm && (
              <Card className="border-2 border-green-500/30 bg-gradient-to-r from-green-900/20 to-blue-900/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Sparkles className="w-5 h-5" />
                    Résultats de la Session
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {emotionScales.map(scale => (
                    <div key={scale.id} className="space-y-2">
                      <div className="flex items-center justify-between text-white">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <span>{scale.icon}</span>
                          {scale.label}
                        </span>
                        <span className={`text-sm font-bold ${getImprovementColor(emotionBefore[scale.id] || 0, emotionAfter[scale.id] || 0)}`}>
                          {emotionBefore[scale.id]} → {emotionAfter[scale.id]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(emotionAfter[scale.id] || 0) * 10} className="flex-1" />
                        <Badge variant="outline" className="text-xs bg-black/20 text-white border-white/20">
                          {getEmotionImprovement(emotionBefore[scale.id] || 0, emotionAfter[scale.id] || 0)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar de contrôles */}
          <div className="space-y-4">
            {/* Environnements */}
            <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Environnements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {environments.map(env => (
                  <button
                    key={env.id}
                    onClick={() => setSelectedEnvironment(env.id)}
                    disabled={isSessionActive}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      selectedEnvironment === env.id
                        ? 'bg-purple-500/30 border-2 border-purple-400 text-white'
                        : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 border border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{env.icon}</span>
                      <div>
                        <div className="font-medium">{env.name}</div>
                        <div className="text-xs opacity-70">{env.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Intensité */}
            <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Intensité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-white text-sm">
                    <span>Calme</span>
                    <span>{intensity[0]}/10</span>
                    <span>Intense</span>
                  </div>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={10}
                    min={1}
                    step={1}
                    disabled={isSessionActive}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Historique */}
            <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <RotateCw className="w-5 h-5" />
                  Historique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-64 overflow-y-auto">
                {sessionHistory.length > 0 ? (
                  sessionHistory.map(session => (
                    <div key={session.id} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium text-sm">
                          {environments.find(e => e.id === session.environment)?.icon}
                          {environments.find(e => e.id === session.environment)?.name}
                        </span>
                        <Badge variant="outline" className="text-xs bg-black/20 text-white border-white/20">
                          {formatTime(session.duration)}
                        </Badge>
                      </div>
                      {session.rating && (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Heart 
                              key={i} 
                              className={`w-3 h-3 ${i < session.rating! ? 'text-red-400 fill-current' : 'text-gray-600'}`} 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-6">
                    <Globe className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Aucune session</p>
                    <p className="text-xs">Commencez votre premier voyage!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-cyan-900/30 to-purple-900/30 backdrop-blur-sm border-cyan-500/30">
              <CardContent className="p-4 text-center">
                <Brain className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                <h3 className="font-semibold mb-2 text-white">Thérapie VR</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Réduction du stress et amélioration du bien-être par immersion cosmique
                </p>
                <Button variant="outline" size="sm" className="w-full bg-transparent border-cyan-500 text-cyan-300 hover:bg-cyan-500/10">
                  Voir les Bénéfices
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default B2CVRGalactiquePage;