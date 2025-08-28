import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Music, Palette, Zap, Heart, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { LoadingStates } from '@/components/ui/LoadingStates';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CMoodMixerPage: React.FC = () => {
  const [energyLevel, setEnergyLevel] = useState([65]);
  const [calmLevel, setCalmLevel] = useState([70]);
  const [focusLevel, setFocusLevel] = useState([80]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMix, setCurrentMix] = useState('');
  const { loadingState } = usePageMetadata();

  if (loadingState === 'loading') return <LoadingStates.Loading text="Chargement Mood Mixer..." />;
  if (loadingState === 'error') return <LoadingStates.Error message="Erreur de chargement" />;

  const generateMix = () => {
    const energy = energyLevel[0];
    const calm = calmLevel[0];
    const focus = focusLevel[0];
    
    let mixName = '';
    let mixColor = '';
    
    if (energy > 80 && calm < 40) {
      mixName = 'Énergie Explosive 🔥';
      mixColor = 'from-red-500 to-orange-500';
    } else if (calm > 80 && energy < 40) {
      mixName = 'Sérénité Profonde 🌊';
      mixColor = 'from-blue-500 to-cyan-500';
    } else if (focus > 80) {
      mixName = 'Focus Laser 🎯';
      mixColor = 'from-purple-500 to-pink-500';
    } else if (energy > 60 && calm > 60) {
      mixName = 'Équilibre Parfait ⚖️';
      mixColor = 'from-green-500 to-blue-500';
    } else {
      mixName = 'Mix Personnalisé ✨';
      mixColor = 'from-indigo-500 to-purple-500';
    }
    
    setCurrentMix(mixName);
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 30000); // Arrêt auto après 30s
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <div className="flex items-center gap-3">
        <Palette className="h-8 w-8 text-purple-500" />
        <div>
          <h1 className="text-3xl font-bold">Mood Mixer</h1>
          <p className="text-muted-foreground">Créez votre ambiance sonore personnalisée</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contrôles du Mixer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-6 w-6 text-blue-500" />
              Table de Mixage Émotionnelle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Slider Énergie */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Énergie
                </label>
                <Badge variant="outline">{energyLevel[0]}%</Badge>
              </div>
              <Slider
                value={energyLevel}
                onValueChange={setEnergyLevel}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Slider Calme */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4 text-blue-500" />
                  Calme
                </label>
                <Badge variant="outline">{calmLevel[0]}%</Badge>
              </div>
              <Slider
                value={calmLevel}
                onValueChange={setCalmLevel}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            {/* Slider Focus */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500" />
                  Focus
                </label>
                <Badge variant="outline">{focusLevel[0]}%</Badge>
              </div>
              <Slider
                value={focusLevel}
                onValueChange={setFocusLevel}
                max={100}
                step={5}
                className="w-full"
              />
            </div>

            <Button 
              onClick={generateMix}
              disabled={isPlaying}
              size="lg"
              className="w-full"
            >
              {isPlaying ? (
                <>
                  <Volume2 className="h-5 w-5 mr-2 animate-pulse" />
                  Mix en cours...
                </>
              ) : (
                <>
                  <Music className="h-5 w-5 mr-2" />
                  Générer le Mix
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Visualiseur */}
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle>Visualiseur d'Humeur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isPlaying && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <Badge variant="default" className="mb-4 px-4 py-2">
                  {currentMix}
                </Badge>
              </motion.div>
            )}

            <div className="relative h-48 bg-muted rounded-lg overflow-hidden">
              {isPlaying ? (
                <motion.div
                  animate={{
                    background: [
                      'linear-gradient(45deg, rgb(139, 69, 19), rgb(255, 140, 0))',
                      'linear-gradient(90deg, rgb(34, 197, 94), rgb(59, 130, 246))',
                      'linear-gradient(135deg, rgb(168, 85, 247), rgb(236, 72, 153))'
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute inset-0"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Music className="h-12 w-12 mx-auto mb-2" />
                    <p>Ajustez les niveaux et générez votre mix</p>
                  </div>
                </div>
              )}
              
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 360]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  >
                    <Volume2 className="h-12 w-12 text-white" />
                  </motion.div>
                </div>
              )}
            </div>

            {/* Métriques du Mix */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-yellow-500">{energyLevel[0]}%</div>
                <div className="text-xs text-muted-foreground">Énergie</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-blue-500">{calmLevel[0]}%</div>
                <div className="text-xs text-muted-foreground">Calme</div>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-lg font-bold text-purple-500">{focusLevel[0]}%</div>
                <div className="text-xs text-muted-foreground">Focus</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Presets de Mix */}
      <Card>
        <CardHeader>
          <CardTitle>Mix Populaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => {
                setEnergyLevel([90]);
                setCalmLevel([30]);
                setFocusLevel([70]);
              }}
            >
              <div className="text-xl">🔥</div>
              <div className="text-sm font-medium">Motivation</div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => {
                setEnergyLevel([30]);
                setCalmLevel([90]);
                setFocusLevel([60]);
              }}
            >
              <div className="text-xl">🌊</div>
              <div className="text-sm font-medium">Détente</div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => {
                setEnergyLevel([60]);
                setCalmLevel([50]);
                setFocusLevel([95]);
              }}
            >
              <div className="text-xl">🎯</div>
              <div className="text-sm font-medium">Concentration</div>
            </Button>
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col gap-2"
              onClick={() => {
                setEnergyLevel([75]);
                setCalmLevel([75]);
                setFocusLevel([75]);
              }}
            >
              <div className="text-xl">⚖️</div>
              <div className="text-sm font-medium">Équilibre</div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CMoodMixerPage;