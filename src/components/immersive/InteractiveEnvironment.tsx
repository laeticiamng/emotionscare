// @ts-nocheck
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { 
  Sparkles, Eye, Mouse, Mic, Camera, Bluetooth,
  Waves, Wind, Sun, Moon, Star, Palette, Volume2,
  Zap, Heart, Brain, Target, Trophy, Award
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface InteractionPoint {
  id: string;
  x: number;
  y: number;
  type: 'click' | 'hover' | 'gaze' | 'voice';
  intensity: number;
  timestamp: number;
}

interface EnvironmentEffect {
  id: string;
  name: string;
  description: string;
  active: boolean;
  intensity: number;
  color: string;
  animation: string;
}

interface BiometricData {
  heartRate: number;
  stressLevel: number;
  focusLevel: number;
  emotionalState: string;
  engagement: number;
}

const InteractiveEnvironment: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interactions, setInteractions] = useState<InteractionPoint[]>([]);
  const [isGazeTracking, setIsGazeTracking] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const backgroundX = useTransform(mouseX, [0, window.innerWidth], [0, 50]);
  const backgroundY = useTransform(mouseY, [0, window.innerHeight], [0, 50]);

  const [biometrics, setBiometrics] = useState<BiometricData>({
    heartRate: 72,
    stressLevel: 25,
    focusLevel: 78,
    emotionalState: 'Calme',
    engagement: 85
  });

  const [effects, setEffects] = useState<EnvironmentEffect[]>([
    {
      id: 'particles',
      name: 'Particules Énergétiques',
      description: 'Particules qui suivent vos mouvements',
      active: true,
      intensity: 70,
      color: 'text-blue-400',
      animation: 'float'
    },
    {
      id: 'aura',
      name: 'Aura Émotionnelle',
      description: 'Halo coloré basé sur votre état',
      active: true,
      intensity: 60,
      color: 'text-purple-400',
      animation: 'pulse'
    },
    {
      id: 'ripples',
      name: 'Ondulations Tactiles',
      description: 'Vagues lors des interactions',
      active: true,
      intensity: 80,
      color: 'text-cyan-400',
      animation: 'ripple'
    },
    {
      id: 'neural',
      name: 'Réseau Neural',
      description: 'Connexions synaptiques visuelles',
      active: false,
      intensity: 40,
      color: 'text-green-400',
      animation: 'network'
    }
  ]);

  // Mouse tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    setMousePosition({ x, y });
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  // Interaction tracking
  const addInteraction = useCallback((x: number, y: number, type: InteractionPoint['type']) => {
    const newInteraction: InteractionPoint = {
      id: Math.random().toString(36).substr(2, 9),
      x,
      y,
      type,
      intensity: Math.random() * 100,
      timestamp: Date.now()
    };
    
    setInteractions(prev => [...prev.slice(-9), newInteraction]);
  }, []);

  // Click handler
  const handleClick = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      addInteraction(x, y, 'click');
    }
  }, [addInteraction]);

  // Simulate biometric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setBiometrics(prev => ({
        heartRate: Math.max(60, Math.min(100, prev.heartRate + (Math.random() - 0.5) * 4)),
        stressLevel: Math.max(0, Math.min(100, prev.stressLevel + (Math.random() - 0.5) * 6)),
        focusLevel: Math.max(40, Math.min(100, prev.focusLevel + (Math.random() - 0.5) * 8)),
        emotionalState: prev.emotionalState,
        engagement: Math.max(60, Math.min(100, prev.engagement + (Math.random() - 0.5) * 5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Mouse event listeners
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Clean up old interactions
  useEffect(() => {
    const interval = setInterval(() => {
      setInteractions(prev => 
        prev.filter(interaction => Date.now() - interaction.timestamp < 3000)
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const toggleEffect = (effectId: string) => {
    setEffects(prev => prev.map(effect => 
      effect.id === effectId 
        ? { ...effect, active: !effect.active }
        : effect
    ));
  };

  const updateEffectIntensity = (effectId: string, intensity: number) => {
    setEffects(prev => prev.map(effect => 
      effect.id === effectId 
        ? { ...effect, intensity }
        : effect
    ));
  };

  const getEmotionalColor = (state: string) => {
    switch (state.toLowerCase()) {
      case 'calme': return 'from-blue-400 to-cyan-400';
      case 'énergique': return 'from-orange-400 to-red-400';
      case 'joyeux': return 'from-yellow-400 to-orange-400';
      case 'concentré': return 'from-purple-400 to-indigo-400';
      default: return 'from-gray-400 to-slate-400';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900"
      onClick={handleClick}
    >
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`,
          x: backgroundX,
          y: backgroundY
        }}
      />

      {/* Particle System */}
      {effects.find(e => e.id === 'particles')?.active && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: mousePosition.x + (Math.random() - 0.5) * 200,
                y: mousePosition.y + (Math.random() - 0.5) * 200,
              }}
              transition={{
                duration: 2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      )}

      {/* Emotional Aura */}
      {effects.find(e => e.id === 'aura')?.active && (
        <motion.div
          className={cn(
            "absolute w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-r",
            getEmotionalColor(biometrics.emotionalState)
          )}
          style={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}

      {/* Interaction Ripples */}
      <AnimatePresence>
        {interactions.map((interaction) => (
          <motion.div
            key={interaction.id}
            className="absolute pointer-events-none"
            style={{
              left: `${interaction.x}%`,
              top: `${interaction.y}%`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <div className={cn(
              "w-8 h-8 rounded-full border-2",
              interaction.type === 'click' && "border-cyan-400",
              interaction.type === 'hover' && "border-purple-400",
              interaction.type === 'gaze' && "border-green-400",
              interaction.type === 'voice' && "border-yellow-400"
            )} />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Biometric HUD */}
      <div className="absolute top-4 left-4 space-y-4 z-50">
        <Card className="bg-black/20 backdrop-blur-xl border-purple-500/30">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center space-x-2 text-white">
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-sm">Rythme: {Math.round(biometrics.heartRate)} BPM</span>
            </div>
            
            <div className="flex items-center space-x-2 text-white">
              <Brain className="h-4 w-4 text-purple-400" />
              <span className="text-sm">Focus: {Math.round(biometrics.focusLevel)}%</span>
            </div>
            
            <div className="flex items-center space-x-2 text-white">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">Stress: {Math.round(biometrics.stressLevel)}%</span>
            </div>
            
            <Badge className={cn(
              "bg-gradient-to-r text-white",
              getEmotionalColor(biometrics.emotionalState)
            )}>
              {biometrics.emotionalState}
            </Badge>
          </CardContent>
        </Card>

        {/* Sensor Status */}
        <Card className="bg-black/20 backdrop-blur-xl border-blue-500/30">
          <CardContent className="p-4 space-y-2">
            <div className="text-white text-sm font-medium mb-2">Capteurs Actifs</div>
            
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <Mouse className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-300">Souris</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isGazeTracking ? "bg-green-500 animate-pulse" : "bg-gray-500"
              )} />
              <Eye className={cn("h-3 w-3", isGazeTracking ? "text-green-400" : "text-gray-400")} />
              <span className={cn("text-xs", isGazeTracking ? "text-green-300" : "text-gray-400")}>
                Regard
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-2 h-2 rounded-full",
                isVoiceActive ? "bg-blue-500 animate-pulse" : "bg-gray-500"
              )} />
              <Mic className={cn("h-3 w-3", isVoiceActive ? "text-blue-400" : "text-gray-400")} />
              <span className={cn("text-xs", isVoiceActive ? "text-blue-300" : "text-gray-400")}>
                Voix
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Effects Control Panel */}
      <div className="absolute top-4 right-4 space-y-2 z-50">
        <Card className="bg-black/20 backdrop-blur-xl border-indigo-500/30">
          <CardContent className="p-4 space-y-3">
            <div className="text-white text-sm font-medium">Effets Environnementaux</div>
            
            {effects.map((effect) => (
              <div key={effect.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleEffect(effect.id)}
                      className={cn(
                        "w-3 h-3 rounded-full border-2 transition-colors",
                        effect.active 
                          ? "bg-green-500 border-green-500" 
                          : "bg-transparent border-gray-500"
                      )}
                    />
                    <span className={cn("text-xs", effect.color)}>{effect.name}</span>
                  </div>
                </div>
                
                {effect.active && (
                  <Slider
                    value={[effect.intensity]}
                    onValueChange={(value) => updateEffectIntensity(effect.id, value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sensor Controls */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsGazeTracking(!isGazeTracking)}
            className={cn(
              "border-green-500/50",
              isGazeTracking ? "bg-green-500/20 text-green-300" : "text-green-400"
            )}
          >
            <Eye className="h-3 w-3" />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            className={cn(
              "border-blue-500/50",
              isVoiceActive ? "bg-blue-500/20 text-blue-300" : "text-blue-400"
            )}
          >
            <Mic className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Achievement Notifications */}
      <AnimatePresence>
        {biometrics.focusLevel > 90 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="absolute bottom-4 right-4 z-50"
          >
            <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 backdrop-blur-xl">
              <CardContent className="p-4 flex items-center space-x-3">
                <Trophy className="h-6 w-6 text-yellow-400" />
                <div>
                  <div className="text-white font-medium">État de Flow Atteint!</div>
                  <div className="text-yellow-300 text-sm">Concentration maximale</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <Card className="bg-black/10 backdrop-blur-xl border-white/10 max-w-2xl w-full">
          <CardContent className="p-8 text-center space-y-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="mx-auto"
            >
              <Sparkles className="h-16 w-16 text-purple-400" />
            </motion.div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Environnement Interactif
            </h1>
            
            <p className="text-white/80 text-lg">
              Votre environnement réagit à vos mouvements, émotions et interactions.
              Explorez les différents effets en bougeant votre souris et en cliquant.
            </p>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <Target className="h-5 w-5 text-cyan-400 mx-auto mb-2" />
                <div className="text-white">Interactions</div>
                <div className="text-cyan-300">{interactions.length}</div>
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <Award className="h-5 w-5 text-purple-400 mx-auto mb-2" />
                <div className="text-white">Engagement</div>
                <div className="text-purple-300">{Math.round(biometrics.engagement)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InteractiveEnvironment;