import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Heart, Play, Pause, Activity, Zap, Target, TrendingUp, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Simulation du capteur de fréquence cardiaque
const simulateHeartRate = (baseRate = 70, stress = 0.5) => {
  const variation = Math.sin(Date.now() / 1000) * 10 * stress;
  return Math.round(baseRate + variation + (Math.random() - 0.5) * 5);
};

const Bubble3D = ({ size, color, intensity, isActive }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} opacity-70`}
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 ${intensity * 20}px ${color.includes('blue') ? '#3B82F6' : '#EF4444'}`,
      }}
      animate={{
        scale: isActive ? [1, 1.2, 1] : 1,
        opacity: isActive ? [0.7, 1, 0.7] : 0.7,
      }}
      transition={{
        duration: 60 / (70 + intensity * 30), // Sync avec heartrate
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

const B2CBubbleBeatPageEnhanced = () => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [heartRate, setHeartRate] = useState(70);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [targetZone, setTargetZone] = useState([60, 80]);
  const [coherenceScore, setCoherenceScore] = useState(50);
  const [breathingRate, setBreathingRate] = useState(15);
  const [sessionData, setSessionData] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  const zones = [
    { name: 'Repos', range: [50, 60], color: 'bg-blue-500', intensity: 0.3 },
    { name: 'Récupération', range: [60, 70], color: 'bg-green-500', intensity: 0.5 },
    { name: 'Aérobie', range: [70, 85], color: 'bg-yellow-500', intensity: 0.7 },
    { name: 'Anaérobie', range: [85, 95], color: 'bg-orange-500', intensity: 0.9 },
    { name: 'Max', range: [95, 110], color: 'bg-red-500', intensity: 1.0 }
  ];

  const getCurrentZone = () => {
    return zones.find(zone => heartRate >= zone.range[0] && heartRate <= zone.range[1]) || zones[0];
  };

  const isInTargetZone = () => {
    return heartRate >= targetZone[0] && heartRate <= targetZone[1];
  };

  const startSession = async () => {
    setIsSessionActive(true);
    setSessionDuration(0);
    setSessionData([]);
    
    // Démarrer la simulation du capteur HR
    intervalRef.current = setInterval(() => {
      const newHeartRate = simulateHeartRate(75, coherenceScore / 100);
      const newCoherence = Math.min(100, coherenceScore + (isInTargetZone() ? 2 : -1));
      const newBreathing = 12 + Math.sin(Date.now() / 2000) * 3;
      
      setHeartRate(newHeartRate);
      setCoherenceScore(newCoherence);
      setBreathingRate(Math.round(newBreathing));
      
      setSessionData(prev => [...prev.slice(-50), {
        time: Date.now(),
        heartRate: newHeartRate,
        coherence: newCoherence,
        breathing: newBreathing
      }]);
      
      setSessionDuration(prev => prev + 1);
    }, 1000);

    toast({
      title: "Session Bubble Beat démarrée",
      description: "Synchronisez votre respiration avec les bulles.",
    });
  };

  const endSession = async () => {
    setIsSessionActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // Sauvegarder les données de session
    try {
      const avgHeartRate = sessionData.reduce((sum, d) => sum + d.heartRate, 0) / sessionData.length;
      const maxCoherence = Math.max(...sessionData.map(d => d.coherence));
      
      const { error } = await supabase.functions.invoke('biotune-session', {
        body: {
          emotion: 'focused',
          session_type: 'bubble_beat',
          biometric_data: {
            avg_heart_rate: avgHeartRate,
            max_coherence: maxCoherence,
            session_duration: sessionDuration,
            target_zone_time: sessionData.filter(d => 
              d.heartRate >= targetZone[0] && d.heartRate <= targetZone[1]
            ).length
          }
        }
      });

      if (!error) {
        toast({
          title: "Session terminée",
          description: `Score de cohérence max: ${maxCoherence}%`,
        });
      }
    } catch (error) {
      console.error('Erreur sauvegarde session:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateBubbles = () => {
    const bubbles = [];
    const currentZone = getCurrentZone();
    
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * 2 * Math.PI;
      const radius = 100 + (coherenceScore / 100) * 50;
      const x = 50 + Math.cos(angle) * (radius / 5);
      const y = 50 + Math.sin(angle) * (radius / 5);
      
      bubbles.push(
        <Bubble3D
          key={i}
          size={30 + (coherenceScore / 100) * 20}
          color={currentZone.color}
          intensity={currentZone.intensity}
          isActive={isSessionActive}
        />
      );
    }
    
    return bubbles;
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="h-12 w-12 text-red-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bubble Beat Biofeedback
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Optimisez votre cohérence cardiaque avec des bulles interactives synchronisées à votre rythme
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Visualisation principale */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <Card className="h-[600px] bg-white/70 backdrop-blur-sm border-0 shadow-2xl overflow-hidden">
              <CardContent className="p-0 h-full relative">
                {/* Zone de bulles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-80 h-80">
                    {/* Bulle centrale principale */}
                    <motion.div
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        ${getCurrentZone().color} rounded-full flex items-center justify-center text-white font-bold text-2xl`}
                      style={{
                        width: 120 + (coherenceScore / 100) * 40,
                        height: 120 + (coherenceScore / 100) * 40,
                        boxShadow: `0 0 ${coherenceScore}px ${getCurrentZone().color.includes('blue') ? '#3B82F6' : '#EF4444'}`,
                      }}
                      animate={{
                        scale: isSessionActive ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 60 / heartRate,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {heartRate}
                    </motion.div>
                    
                    {/* Bulles orbitales */}
                    {generateBubbles()}
                  </div>
                </div>

                {/* Overlay d'informations */}
                <div className="absolute top-4 left-4 right-4 z-10">
                  <div className="flex justify-between items-center">
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white">
                      <div className="text-2xl font-mono">{formatTime(sessionDuration)}</div>
                      <div className="text-sm opacity-80">Durée</div>
                    </div>
                    
                    <Badge className={`${getCurrentZone().color} text-white text-lg px-4 py-2`}>
                      Zone {getCurrentZone().name}
                    </Badge>
                    
                    <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 text-white text-center">
                      <div className="text-2xl font-bold">{coherenceScore}%</div>
                      <div className="text-sm opacity-80">Cohérence</div>
                    </div>
                  </div>
                </div>

                {/* Indicateur de zone cible */}
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex justify-between text-white text-sm mb-2">
                      <span>Zone Cible: {targetZone[0]}-{targetZone[1]} bpm</span>
                      <span className={isInTargetZone() ? "text-green-400" : "text-red-400"}>
                        {isInTargetZone() ? "✓ Dans la zone" : "✗ Hors zone"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(coherenceScore / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contrôles et métriques */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Contrôles de session */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Contrôles de Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isSessionActive ? (
                  <Button
                    onClick={startSession}
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Démarrer Session
                  </Button>
                ) : (
                  <Button
                    onClick={endSession}
                    variant="destructive"
                    size="lg"
                    className="w-full"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Terminer Session
                  </Button>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Zone Cible (bpm)
                    </label>
                    <Slider
                      value={targetZone}
                      onValueChange={setTargetZone}
                      max={100}
                      min={50}
                      step={5}
                      disabled={isSessionActive}
                      className="w-full"
                    />
                    <span className="text-xs text-gray-500">{targetZone[0]} - {targetZone[1]} bpm</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Métriques en temps réel */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Métriques Live
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <Heart className="h-6 w-6 text-red-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-red-600">{heartRate}</div>
                    <div className="text-xs text-gray-600">BPM</div>
                  </div>
                  
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Activity className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-blue-600">{Math.round(breathingRate)}</div>
                    <div className="text-xs text-gray-600">Resp/min</div>
                  </div>
                </div>

                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <Zap className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                  <div className="text-3xl font-bold text-purple-600">{coherenceScore}%</div>
                  <div className="text-xs text-gray-600">Score Cohérence</div>
                </div>
              </CardContent>
            </Card>

            {/* Zones cardiaques */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Zones Cardiaques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {zones.map((zone, index) => (
                    <motion.div
                      key={zone.name}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        getCurrentZone().name === zone.name 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200'
                      }`}
                      animate={{
                        scale: getCurrentZone().name === zone.name ? 1.02 : 1
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${zone.color}`} />
                          <span className="font-medium">{zone.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {zone.range[0]}-{zone.range[1]}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default B2CBubbleBeatPageEnhanced;