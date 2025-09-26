import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, Settings, Headphones, Wind, Heart, Zap } from 'lucide-react';

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;  
  hold: number;
  exhale: number;
  cycles: number;
  benefits: string[];
  color: string;
}

interface VREnvironment {
  id: string;
  name: string;
  description: string;
  preview: string;
  soundscape: string;
}

const VRBreathPage: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState<VREnvironment | null>(null);
  const [immersionLevel, setImmersionLevel] = useState([75]);

  const breathingPatterns: BreathingPattern[] = [
    {
      id: 'box-breath',
      name: 'Respiration Carrée',
      description: 'Technique équilibrée pour la relaxation générale',
      inhale: 4,
      hold: 4,
      exhale: 4,
      cycles: 8,
      benefits: ['Réduction du stress', 'Amélioration de la concentration', 'Équilibre du système nerveux'],
      color: 'from-blue-400 to-cyan-500'
    },
    {
      id: 'calm-breath',
      name: 'Respiration Apaisante',
      description: 'Expiration prolongée pour la détente profonde',
      inhale: 4,
      hold: 2,
      exhale: 8,
      cycles: 6,
      benefits: ['Relaxation profonde', 'Réduction de l\'anxiété', 'Amélioration du sommeil'],
      color: 'from-purple-400 to-indigo-500'
    },
    {
      id: 'energy-breath',
      name: 'Respiration Énergisante',
      description: 'Technique dynamique pour l\'activation',
      inhale: 6,
      hold: 2,
      exhale: 4,
      cycles: 10,
      benefits: ['Augmentation de l\'énergie', 'Amélioration de la vigilance', 'Stimulation cognitive'],
      color: 'from-orange-400 to-red-500'
    }
  ];

  const vrEnvironments: VREnvironment[] = [
    {
      id: 'forest',
      name: 'Forêt Enchantée',
      description: 'Respirez au cœur d\'une forêt mystique',
      preview: '🌲',
      soundscape: 'Bruissement des feuilles, chants d\'oiseaux'
    },
    {
      id: 'ocean',
      name: 'Plage Sereine',
      description: 'Vagues apaisantes et horizon infini',
      preview: '🌊',
      soundscape: 'Vagues douces, vent marin'
    },
    {
      id: 'mountain',
      name: 'Sommet Montagnard',  
      description: 'Air pur et panorama majestueux',
      preview: '⛰️',
      soundscape: 'Vent de montagne, silence'
    },
    {
      id: 'space',
      name: 'Cosmos Infini',
      description: 'Flottez parmi les étoiles',
      preview: '🌌',
      soundscape: 'Ambiances cosmiques, fréquences profondes'
    }
  ];

  const startSession = () => {
    if (!selectedPattern) return;
    setIsActive(true);
  };

  const pauseSession = () => {
    setIsActive(false);
  };

  const resetSession = () => {
    setIsActive(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-indigo-50/20 to-muted/20 p-6" data-testid="page-root">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
            <Wind className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">
            VR Breath
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Expérience immersive de respiration consciente. Plongez dans des environnements virtuels apaisants pour une pratique optimale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Zone d'immersion VR */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-5 h-5" />
                  Expérience Immersive
                </CardTitle>
                <CardDescription>
                  {selectedEnvironment ? selectedEnvironment.name : 'Sélectionnez un environnement'}
                  {selectedPattern && ` • ${selectedPattern.name}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg overflow-hidden aspect-video mb-4">
                  {!isActive && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-6xl mb-4">
                          {selectedEnvironment?.preview || '🧘‍♀️'}
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {selectedEnvironment ? selectedEnvironment.name : 'Prêt à commencer'}
                        </h3>
                        <p className="text-indigo-200">
                          {selectedEnvironment ? selectedEnvironment.description : 'Sélectionnez un motif de respiration'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contrôles de session */}
                <div className="flex gap-3">
                  {!isActive ? (
                    <Button
                      onClick={startSession}
                      disabled={!selectedPattern}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Commencer la session
                    </Button>
                  ) : (
                    <Button onClick={pauseSession} variant="outline" className="flex-1">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                  
                  <Button onClick={resetSession} variant="outline">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau de configuration */}
          <div className="space-y-6">
            {/* Motifs de respiration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Motifs de Respiration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {breathingPatterns.map((pattern) => {
                  const isSelected = selectedPattern?.id === pattern.id;
                  return (
                    <Card
                      key={pattern.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedPattern(pattern)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{pattern.name}</span>
                          <Badge variant="outline">
                            {pattern.inhale}-{pattern.hold}-{pattern.exhale}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {pattern.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {pattern.benefits.slice(0, 2).map((benefit, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            {/* Environnements VR */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Environnements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {vrEnvironments.map((environment) => (
                  <Card
                    key={environment.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedEnvironment?.id === environment.id ? 'ring-2 ring-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedEnvironment(environment)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{environment.preview}</div>
                        <div className="flex-1">
                          <div className="font-medium">{environment.name}</div>
                          <p className="text-xs text-muted-foreground">
                            {environment.soundscape}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Niveau d'immersion */}
            <Card>
              <CardHeader>
                <CardTitle>Immersion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Niveau d'immersion</span>
                    <span>{immersionLevel[0]}%</span>
                  </div>
                  <Slider
                    value={immersionLevel}
                    onValueChange={setImmersionLevel}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p>• Plus élevé = Plus d'effets visuels</p>
                  <p>• Plus faible = Plus minimaliste</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRBreathPage;