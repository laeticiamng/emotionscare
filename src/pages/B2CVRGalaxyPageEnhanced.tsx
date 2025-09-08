import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Globe, Play, Pause, RotateCcw, Settings, Volume2, Headphones, Star } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float } from '@react-three/drei';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Composant 3D pour la galaxie
const Galaxy3D = ({ intensity = 50, rotation = 0, showPlanets = true }) => {
  return (
    <>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Soleil central */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[2, 32, 32]} />
          <meshStandardMaterial 
            color="#FFD700" 
            emissive="#FFA500" 
            emissiveIntensity={intensity / 100}
          />
        </mesh>
      </Float>

      {/* Planètes orbitales */}
      {showPlanets && (
        <>
          <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <mesh position={[5, 0, 0]} rotation={[0, rotation, 0]}>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshStandardMaterial color="#4CAF50" />
            </mesh>
          </Float>
          
          <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.8}>
            <mesh position={[-7, 2, 0]} rotation={[0, -rotation * 0.7, 0]}>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshStandardMaterial color="#2196F3" />
            </mesh>
          </Float>
          
          <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.3}>
            <mesh position={[0, 0, 10]} rotation={[0, rotation * 1.2, 0]}>
              <sphereGeometry args={[0.6, 16, 16]} />
              <meshStandardMaterial color="#9C27B0" />
            </mesh>
          </Float>
        </>
      )}

      {/* Texte flottant motivationnel */}
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.2}>
        <Text
          position={[0, 4, 0]}
          fontSize={0.8}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          Respirez profondément
        </Text>
      </Float>

      {/* Éclairage */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4CAF50" />
    </>
  );
};

const B2CVRGalaxyPageEnhanced = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [totalDuration, setTotalDuration] = useState(600); // 10 minutes par défaut
  const [intensity, setIntensity] = useState([50]);
  const [volume, setVolume] = useState([70]);
  const [rotation, setRotation] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('preparation');
  const [sessionStats, setSessionStats] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  const phases = [
    { name: 'preparation', label: 'Préparation', duration: 60, color: 'bg-blue-500' },
    { name: 'immersion', label: 'Immersion', duration: 300, color: 'bg-purple-500' },
    { name: 'meditation', label: 'Méditation', duration: 180, color: 'bg-green-500' },
    { name: 'integration', label: 'Intégration', duration: 60, color: 'bg-orange-500' }
  ];

  const startSession = async () => {
    setIsSessionActive(true);
    setSessionDuration(0);
    setCurrentPhase('preparation');
    
    // Démarrer le timer
    intervalRef.current = setInterval(() => {
      setSessionDuration(prev => {
        const newDuration = prev + 1;
        setRotation(newDuration * 0.1);
        
        // Changer de phase selon la durée
        if (newDuration <= 60) setCurrentPhase('preparation');
        else if (newDuration <= 360) setCurrentPhase('immersion');
        else if (newDuration <= 540) setCurrentPhase('meditation');
        else setCurrentPhase('integration');
        
        // Fin de session
        if (newDuration >= totalDuration) {
          endSession();
        }
        
        return newDuration;
      });
    }, 1000);

    toast({
      title: "Session VR démarrée",
      description: "Votre voyage dans la galaxie du bien-être commence.",
    });
  };

  const endSession = async () => {
    setIsSessionActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    const stats = {
      duration: sessionDuration,
      completed: sessionDuration >= totalDuration,
      phases_completed: getCurrentPhaseIndex() + 1,
      total_phases: phases.length
    };

    setSessionStats(stats);

    // Sauvegarder les statistiques
    try {
      const { error } = await supabase.functions.invoke('vr-galaxy-metrics', {
        body: {
          session_duration: sessionDuration,
          completion_rate: (sessionDuration / totalDuration) * 100,
          intensity_level: intensity[0],
          session_type: 'galaxy_meditation'
        }
      });

      if (!error) {
        toast({
          title: "Session terminée",
          description: `Bravo ! Vous avez médité pendant ${Math.floor(sessionDuration / 60)} minutes.`,
        });
      }
    } catch (error) {
      console.error('Erreur sauvegarde session:', error);
    }
  };

  const getCurrentPhaseIndex = () => {
    let elapsed = 0;
    for (let i = 0; i < phases.length; i++) {
      elapsed += phases[i].duration;
      if (sessionDuration <= elapsed) return i;
    }
    return phases.length - 1;
  };

  const getCurrentPhase = () => {
    return phases[getCurrentPhaseIndex()];
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-12 w-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              VR Galaxie du Bien-être
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Plongez dans une expérience immersive de méditation spatiale pour retrouver votre équilibre
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Visualisation 3D */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <Card className="h-[600px] bg-black/30 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-0 h-full">
                <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                  <Galaxy3D 
                    intensity={intensity[0]} 
                    rotation={rotation}
                    showPlanets={isSessionActive}
                  />
                  <OrbitControls 
                    enableZoom={!isSessionActive}
                    enablePan={!isSessionActive}
                    autoRotate={isSessionActive}
                    autoRotateSpeed={0.5}
                  />
                </Canvas>
                
                {/* Overlay de session */}
                <AnimatePresence>
                  {isSessionActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute top-4 left-4 right-4"
                    >
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-2xl font-mono">{formatTime(sessionDuration)}</span>
                          <Badge className={`${getCurrentPhase().color} text-white`}>
                            {getCurrentPhase().label}
                          </Badge>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(sessionDuration / totalDuration) * 100}%` }}
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contrôles */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Contrôles principaux */}
            <Card className="bg-black/30 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400">
                  <Star className="h-5 w-5" />
                  Contrôles de Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isSessionActive ? (
                  <Button
                    onClick={startSession}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Démarrer la Session
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Button
                      onClick={endSession}
                      variant="destructive"
                      size="lg"
                      className="w-full"
                    >
                      <Pause className="h-5 w-5 mr-2" />
                      Terminer la Session
                    </Button>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Durée (minutes)</label>
                    <Slider
                      value={[totalDuration / 60]}
                      onValueChange={(value) => setTotalDuration(value[0] * 60)}
                      max={30}
                      min={5}
                      step={1}
                      disabled={isSessionActive}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{totalDuration / 60} minutes</span>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Intensité lumineuse
                    </label>
                    <Slider
                      value={intensity}
                      onValueChange={setIntensity}
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{intensity[0]}%</span>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Volume ambiant
                    </label>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-400">{volume[0]}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phases de la session */}
            <Card className="bg-black/30 border-purple-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-400">Phases de la Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {phases.map((phase, index) => (
                    <motion.div
                      key={phase.name}
                      initial={{ opacity: 0.5 }}
                      animate={{ 
                        opacity: phase.name === currentPhase ? 1 : 0.5,
                        scale: phase.name === currentPhase ? 1.02 : 1
                      }}
                      className={`p-3 rounded-lg border ${
                        phase.name === currentPhase 
                          ? 'border-purple-400 bg-purple-500/10' 
                          : 'border-gray-600 bg-gray-500/10'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{phase.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.floor(phase.duration / 60)}min
                        </Badge>
                      </div>
                      {phase.name === currentPhase && isSessionActive && (
                        <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                          <div className="bg-purple-500 h-1 rounded-full transition-all duration-1000" 
                               style={{ width: '60%' }} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Statistiques de session */}
            <AnimatePresence>
              {sessionStats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="bg-green-500/10 border-green-500/20 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-green-400">Session Terminée</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Durée:</span>
                          <span className="font-mono">{formatTime(sessionStats.duration)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phases complétées:</span>
                          <span>{sessionStats.phases_completed}/{sessionStats.total_phases}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Statut:</span>
                          <Badge variant={sessionStats.completed ? "default" : "secondary"}>
                            {sessionStats.completed ? "Complète" : "Partielle"}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default B2CVRGalaxyPageEnhanced;