// @ts-nocheck

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Float, Sphere, Box, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Globe, Zap, Heart, Brain, Stars as StarsIcon, Gamepad2, Target, Award } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { triggerConfetti } from '@/lib/confetti';

interface Planet {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  color: string;
  size: number;
  unlocked: boolean;
  experience: 'meditation' | 'breathing' | 'exploration' | 'challenge';
  story: string;
  rewards: number;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'exploration' | 'meditation' | 'collection' | 'challenge';
  progress: number;
  maxProgress: number;
  completed: boolean;
  reward: number;
}

interface GalaxyState {
  currentPlanet: string | null;
  unlockedPlanets: string[];
  totalExperience: number;
  completedQuests: string[];
  collectibles: string[];
  achievements: string[];
}

// Component for animated planets
function AnimatedPlanet({ planet, isSelected, onClick, isUnlocked }: {
  planet: Planet;
  isSelected: boolean;
  onClick: () => void;
  isUnlocked: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      meshRef.current.rotation.y += 0.01;
      
      if (isSelected) {
        meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={planet.position}>
        <Sphere
          ref={meshRef}
          args={[planet.size, 32, 32]}
          onClick={onClick}
        >
          <meshStandardMaterial
            color={isUnlocked ? planet.color : '#555555'}
            emissive={isSelected ? planet.color : '#000000'}
            emissiveIntensity={isSelected ? 0.3 : 0}
            roughness={0.3}
            metalness={0.7}
          />
        </Sphere>
        
        {isUnlocked && (
          <Text
            position={[0, planet.size + 1, 0]}
            fontSize={0.5}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {planet.name}
          </Text>
        )}
        
        {/* Orbital rings */}
        {isSelected && (
          <>
            <Torus args={[planet.size + 0.5, 0.05, 16, 100]}>
              <meshBasicMaterial color={planet.color} transparent opacity={0.6} />
            </Torus>
            <Torus args={[planet.size + 1, 0.03, 16, 100]}>
              <meshBasicMaterial color={planet.color} transparent opacity={0.3} />
            </Torus>
          </>
        )}
        
        {/* Lock indicator for locked planets */}
        {!isUnlocked && (
          <Box args={[0.5, 0.5, 0.1]} position={[0, 0, planet.size + 0.3]}>
            <meshBasicMaterial color="#ff6b6b" />
          </Box>
        )}
      </group>
    </Float>
  );
}

// Galaxy experience component
function GalaxyExperience({ galaxyState, onPlanetSelect, selectedPlanet }: {
  galaxyState: GalaxyState;
  onPlanetSelect: (planetId: string) => void;
  selectedPlanet: string | null;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {planets.map(planet => (
        <AnimatedPlanet
          key={planet.id}
          planet={planet}
          isSelected={selectedPlanet === planet.id}
          onClick={() => onPlanetSelect(planet.id)}
          isUnlocked={galaxyState.unlockedPlanets.includes(planet.id)}
        />
      ))}
      
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </>
  );
}

const planets: Planet[] = [
  {
    id: 'earth',
    name: 'Terre Apaisante',
    description: 'Votre point de départ vers la sérénité',
    position: [0, 0, 0],
    color: '#4fc3f7',
    size: 2,
    unlocked: true,
    experience: 'meditation',
    story: 'Commencez votre voyage cosmique avec des méditations guidées douces...',
    rewards: 100
  },
  {
    id: 'mars',
    name: 'Mars Énergétique',
    description: 'Planète de l\'énergie et de la vitalité',
    position: [8, 2, 0],
    color: '#ff6b35',
    size: 1.5,
    unlocked: false,
    experience: 'breathing',
    story: 'Découvrez des techniques de respiration pour booster votre énergie...',
    rewards: 150
  },
  {
    id: 'jupiter',
    name: 'Jupiter Mystique',
    description: 'Géante gazeuse aux secrets profonds',
    position: [-6, -3, 4],
    color: '#9b59b6',
    size: 3,
    unlocked: false,
    experience: 'exploration',
    story: 'Explorez les mystères de la conscience dans cette géante cosmique...',
    rewards: 200
  },
  {
    id: 'saturn',
    name: 'Saturne Défi',
    description: 'Planète aux anneaux, tests ultimes',
    position: [4, -6, -2],
    color: '#f39c12',
    size: 2.5,
    unlocked: false,
    experience: 'challenge',
    story: 'Relevez les défis les plus intenses pour maîtriser votre esprit...',
    rewards: 300
  },
  {
    id: 'neptune',
    name: 'Neptune Transcendante',
    description: 'Monde océanique de transcendance',
    position: [-8, 4, -6],
    color: '#3498db',
    size: 2.2,
    unlocked: false,
    experience: 'meditation',
    story: 'Atteignez les plus hauts niveaux de conscience méditative...',
    rewards: 500
  }
];

const initialQuests: Quest[] = [
  {
    id: 'first_landing',
    title: 'Premier Atterrissage',
    description: 'Complétez votre première expérience sur Terre',
    type: 'exploration',
    progress: 0,
    maxProgress: 1,
    completed: false,
    reward: 50
  },
  {
    id: 'planet_explorer',
    title: 'Explorateur Galactique',
    description: 'Visitez 3 planètes différentes',
    type: 'exploration',
    progress: 0,
    maxProgress: 3,
    completed: false,
    reward: 200
  },
  {
    id: 'meditation_master',
    title: 'Maître Méditant',
    description: 'Complétez 10 séances de méditation',
    type: 'meditation',
    progress: 0,
    maxProgress: 10,
    completed: false,
    reward: 300
  }
];

export default function EnhancedVRGalaxy() {
  const { toast } = useToast();
  
  // Game state
  const [galaxyState, setGalaxyState] = useState<GalaxyState>({
    currentPlanet: null,
    unlockedPlanets: ['earth'],
    totalExperience: 0,
    completedQuests: [],
    collectibles: [],
    achievements: []
  });
  
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isExperienceActive, setIsExperienceActive] = useState(false);
  const [experienceTime, setExperienceTime] = useState(0);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [immersionLevel, setImmersionLevel] = useState([7]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showStory, setShowStory] = useState(false);

  // Experience data
  const [breathingPattern, setBreathingPattern] = useState('4-7-8');
  const [meditationProgress, setMeditationProgress] = useState(0);
  const [collectedItems, setCollectedItems] = useState(0);
  
  const currentPlanet = planets.find(p => p.id === selectedPlanet);
  
  // Handle planet selection
  const handlePlanetSelect = (planetId: string) => {
    const planet = planets.find(p => p.id === planetId);
    if (!planet || !galaxyState.unlockedPlanets.includes(planetId)) return;
    
    setSelectedPlanet(planetId);
    setShowStory(true);
    
    toast({
      title: `🪐 ${planet.name}`,
      description: planet.description,
    });
  };

  // Start planet experience
  const startExperience = async () => {
    if (!currentPlanet) return;
    
    setIsExperienceActive(true);
    setExperienceTime(0);
    setMeditationProgress(0);
    setCollectedItems(0);
    
    setGalaxyState(prev => ({ ...prev, currentPlanet: selectedPlanet }));
    
    toast({
      title: "🚀 Expérience Lancée!",
      description: `Commençant l'exploration de ${currentPlanet.name}`,
    });
  };

  // Complete experience
  const completeExperience = async () => {
    if (!currentPlanet) return;
    
    setIsExperienceActive(false);
    
    // Calculate rewards
    const baseReward = currentPlanet.rewards;
    const timeBonus = Math.max(0, (300 - experienceTime) / 10); // Bonus for longer sessions
    const immersionBonus = immersionLevel[0] * 10;
    const totalReward = Math.round(baseReward + timeBonus + immersionBonus);
    
    // Update galaxy state
    setGalaxyState(prev => ({
      ...prev,
      totalExperience: prev.totalExperience + totalReward,
      currentPlanet: null
    }));
    
    // Update quests
    updateQuestProgress('first_landing', 1);
    updateQuestProgress('planet_explorer', 1);
    if (currentPlanet.experience === 'meditation') {
      updateQuestProgress('meditation_master', 1);
    }
    
    // Unlock next planet based on experience
    const nextPlanetIndex = planets.findIndex(p => p.id === selectedPlanet) + 1;
    if (nextPlanetIndex < planets.length && galaxyState.totalExperience + totalReward >= 200) {
      const nextPlanet = planets[nextPlanetIndex];
      setGalaxyState(prev => ({
        ...prev,
        unlockedPlanets: [...prev.unlockedPlanets, nextPlanet.id]
      }));
      
      toast({
        title: "🌟 Nouvelle Planète Débloquée!",
        description: `${nextPlanet.name} est maintenant accessible`,
      });
      
      triggerConfetti();
    }
    
    // Save to database
    try {
      await supabase.functions.invoke('vr-galaxy-metrics', {
        body: {
          planet_id: selectedPlanet,
          experience_type: currentPlanet.experience,
          duration_sec: experienceTime,
          immersion_level: immersionLevel[0],
          rewards_earned: totalReward,
          progress_data: {
            meditation_progress: meditationProgress,
            collected_items: collectedItems,
            breathing_pattern: breathingPattern
          }
        }
      });
    } catch (error) {
      // VR Galaxy save error
    }

    triggerConfetti();
    toast({
      title: "✨ Expérience Complétée!",
      description: `+${totalReward} XP gagnés sur ${currentPlanet.name}`,
    });
  };

  const updateQuestProgress = (questId: string, increment: number) => {
    setQuests(prev => prev.map(quest => {
      if (quest.id === questId && !quest.completed) {
        const newProgress = Math.min(quest.progress + increment, quest.maxProgress);
        const isCompleted = newProgress >= quest.maxProgress;
        
        if (isCompleted && !quest.completed) {
          setGalaxyState(prevState => ({
            ...prevState,
            totalExperience: prevState.totalExperience + quest.reward,
            completedQuests: [...prevState.completedQuests, questId]
          }));
          
          toast({
            title: "🏆 Quête Terminée!",
            description: `${quest.title} - +${quest.reward} XP`,
          });
        }
        
        return { ...quest, progress: newProgress, completed: isCompleted };
      }
      return quest;
    }));
  };

  // Timer for active experience
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isExperienceActive) {
      interval = setInterval(() => {
        setExperienceTime(prev => prev + 1);
        
        // Simulate progress based on experience type
        if (currentPlanet?.experience === 'meditation') {
          setMeditationProgress(prev => Math.min(prev + 0.5, 100));
        }
        
        // Simulate collecting items during exploration
        if (currentPlanet?.experience === 'exploration' && Math.random() < 0.1) {
          setCollectedItems(prev => prev + 1);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isExperienceActive, currentPlanet]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-black">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                VR Galaxy Explorer
              </h1>
              <p className="text-gray-300">Voyage cosmique immersif et évolutif</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Card className="bg-black/50 border-purple-500/30">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-cyan-400" />
                  <div>
                    <div className="font-bold text-white">{galaxyState.totalExperience}</div>
                    <div className="text-xs text-gray-300">XP Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Badge variant="secondary" className="bg-purple-900/50 text-purple-200 border-purple-500">
              Planètes: {galaxyState.unlockedPlanets.length}/{planets.length}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main VR Galaxy Display */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="border-2 border-purple-500/30 bg-black/50 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="relative" style={{ height: '600px' }}>
                  <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                    <Suspense fallback={null}>
                      <GalaxyExperience 
                        galaxyState={galaxyState}
                        onPlanetSelect={handlePlanetSelect}
                        selectedPlanet={selectedPlanet}
                      />
                    </Suspense>
                  </Canvas>
                  
                  {/* Experience overlay */}
                  {isExperienceActive && currentPlanet && (
                    <div className="absolute top-4 left-4 text-white">
                      <Card className="bg-black/80 border-cyan-500/30">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
                              <span className="font-medium">Expérience Active</span>
                            </div>
                            <div className="text-xl font-mono">{formatTime(experienceTime)}</div>
                            <div className="text-sm text-gray-300">{currentPlanet.name}</div>
                            
                            {currentPlanet.experience === 'meditation' && (
                              <div className="mt-3">
                                <div className="text-sm text-gray-300 mb-1">Méditation</div>
                                <Progress value={meditationProgress} className="h-2" />
                              </div>
                            )}
                            
                            {currentPlanet.experience === 'exploration' && collectedItems > 0 && (
                              <div className="text-sm text-cyan-300">
                                ✨ {collectedItems} objets découverts
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                  
                  {/* Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <Card className="bg-black/80 border-purple-500/30">
                      <CardContent className="p-3">
                        <div className="flex items-center gap-4">
                          {selectedPlanet && !isExperienceActive ? (
                            <Button 
                              onClick={startExperience}
                              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Démarrer l'Exploration
                            </Button>
                          ) : isExperienceActive ? (
                            <Button 
                              onClick={completeExperience}
                              variant="destructive"
                            >
                              <Pause className="w-4 h-4 mr-2" />
                              Terminer
                            </Button>
                          ) : (
                            <div className="text-white text-sm">
                              Sélectionnez une planète pour commencer
                            </div>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className="text-white hover:bg-white/10"
                          >
                            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Planet story modal */}
            {showStory && currentPlanet && (
              <Card className="border-2 border-cyan-500/30 bg-gradient-to-r from-cyan-900/20 to-purple-900/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Globe className="w-5 h-5" />
                    {currentPlanet.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-white space-y-4">
                  <p>{currentPlanet.story}</p>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="border-cyan-500 text-cyan-300">
                      {currentPlanet.experience}
                    </Badge>
                    <Badge variant="outline" className="border-yellow-500 text-yellow-300">
                      +{currentPlanet.rewards} XP
                    </Badge>
                  </div>
                  <Button 
                    onClick={() => setShowStory(false)}
                    variant="outline"
                    className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
                  >
                    Fermer
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quests */}
            <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-5 w-5" />
                  Quêtes Actives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quests.filter(q => !q.completed).map(quest => (
                  <div key={quest.id} className="p-3 rounded-lg bg-slate-800/50">
                    <div className="text-white font-medium text-sm">{quest.title}</div>
                    <div className="text-gray-300 text-xs mb-2">{quest.description}</div>
                    <Progress 
                      value={(quest.progress / quest.maxProgress) * 100} 
                      className="h-1 mb-1"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{quest.progress}/{quest.maxProgress}</span>
                      <span>+{quest.reward} XP</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Paramètres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-white text-sm font-medium">Niveau d'Immersion</label>
                  <Slider
                    value={immersionLevel}
                    onValueChange={setImmersionLevel}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                    aria-label="Niveau d'immersion VR"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    Niveau {immersionLevel[0]}/10
                  </div>
                </div>
                
                {currentPlanet?.experience === 'breathing' && (
                  <div>
                    <label className="text-white text-sm font-medium">Pattern de Respiration</label>
                    <select 
                      value={breathingPattern}
                      onChange={(e) => setBreathingPattern(e.target.value)}
                      className="w-full mt-1 bg-slate-800 text-white rounded px-3 py-1 text-sm"
                    >
                      <option value="4-7-8">4-7-8 (Relaxation)</option>
                      <option value="4-4-4">4-4-4 (Équilibre)</option>
                      <option value="6-2-8">6-2-8 (Énergie)</option>
                    </select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Progrès
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white">
                    <span>Planètes visitées</span>
                    <span>{galaxyState.unlockedPlanets.length}/{planets.length}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Quêtes complétées</span>
                    <span>{quests.filter(q => q.completed).length}/{quests.length}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Expérience totale</span>
                    <span>{galaxyState.totalExperience} XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="bg-black/50 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-300 space-y-2">
                <div>🖱️ Clic + glisser pour tourner la vue</div>
                <div>🔍 Molette pour zoomer</div>
                <div>🪐 Cliquez sur une planète pour la sélectionner</div>
                <div>⭐ Débloquez de nouvelles planètes avec l'XP</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}