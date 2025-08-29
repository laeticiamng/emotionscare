import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Zap, Sparkles, Sun, Heart, Star, Flame, Rainbow, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { usePageMetadata } from '@/hooks/usePageMetadata';

const B2CFlashGlowEnhanced: React.FC = () => {
  const [isGlowing, setIsGlowing] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState([75]);
  const [glowDuration, setGlowDuration] = useState([30]);
  const [selectedGlowType, setSelectedGlowType] = useState('energy');
  const [personalizedGlow, setPersonalizedGlow] = useState<any>(null);
  const [dailyStreak, setDailyStreak] = useState(3);
  const [totalGlows, setTotalGlows] = useState(42);
  const [currentMood, setCurrentMood] = useState('neutral');
  const [aiRecommendation, setAiRecommendation] = useState('');

  const glowTypes = {
    energy: { 
      icon: Zap, 
      color: 'from-yellow-400 via-orange-500 to-red-500',
      description: 'Boost explosif d\'énergie',
      particles: '⚡🔥✨',
      duration: 25
    },
    calm: { 
      icon: Heart, 
      color: 'from-blue-400 via-cyan-500 to-teal-400',
      description: 'Sérénité profonde',
      particles: '💙🌊✨',
      duration: 35
    },
    creativity: { 
      icon: Sparkles, 
      color: 'from-purple-400 via-pink-500 to-indigo-500',
      description: 'Inspiration créative',
      particles: '🎨✨🌟',
      duration: 30
    },
    confidence: { 
      icon: Crown, 
      color: 'from-amber-400 via-yellow-500 to-orange-400',
      description: 'Confiance royale',
      particles: '👑⭐✨',
      duration: 20
    },
    love: { 
      icon: Heart, 
      color: 'from-pink-400 via-rose-500 to-red-400',
      description: 'Amour et compassion',
      particles: '💝💖✨',
      duration: 40
    }
  };

  const generatePersonalizedGlow = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-emotion-analysis', {
        body: { 
          action: 'generate_glow',
          mood: currentMood,
          intensity: glowIntensity[0],
          duration: glowDuration[0],
          history: { dailyStreak, totalGlows }
        }
      });

      if (error) throw error;
      
      setPersonalizedGlow(data.recommendation);
      setAiRecommendation(data.message);
    } catch (error) {
      console.error('Error generating personalized glow:', error);
    }
  };

  const startGlowSession = async () => {
    setIsGlowing(true);
    
    // Effet visuel immersif
    const duration = glowDuration[0] * 1000;
    
    try {
      // Enregistrer la session
      await supabase.functions.invoke('flash-glow-metrics', {
        body: {
          glowType: selectedGlowType,
          intensity: glowIntensity[0],
          duration: glowDuration[0],
          mood: currentMood
        }
      });

      // Simuler l'effet glow avec feedback tactile
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }

      setTimeout(() => {
        setIsGlowing(false);
        setTotalGlows(prev => prev + 1);
        
        toast({
          title: "✨ Flash Glow Terminé !",
          description: `Vous rayonnez de ${selectedGlowType} ! Streak: ${dailyStreak + 1} jours`,
        });
      }, duration);

    } catch (error) {
      console.error('Error starting glow session:', error);
      setIsGlowing(false);
    }
  };

  useEffect(() => {
    generatePersonalizedGlow();
  }, [currentMood, glowIntensity, glowDuration]);

  const IconComponent = glowTypes[selectedGlowType as keyof typeof glowTypes]?.icon || Sparkles;

  return (
    <div className="space-y-6">
      <Breadcrumbs />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <motion.div
          animate={isGlowing ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 360]
          } : { scale: 1, rotate: 0 }}
          transition={{ duration: 2, repeat: isGlowing ? Infinity : 0 }}
        >
          <Sparkles className="h-8 w-8 text-yellow-500" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold">Flash Glow Ultra ✨</h1>
          <p className="text-muted-foreground">Transformation énergétique instantanée</p>
        </div>
      </motion.div>

      {/* Stats & Streak */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{dailyStreak}</div>
            <div className="text-sm text-muted-foreground">Streak Quotidien</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">{totalGlows}</div>
            <div className="text-sm text-muted-foreground">Glows Totaux</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">A+</div>
            <div className="text-sm text-muted-foreground">Niveau Glow</div>
          </CardContent>
        </Card>
      </div>

      {/* Zone de Glow Principal */}
      <Card className="relative overflow-hidden">
        <CardHeader>
          <CardTitle>Zone d'Activation Glow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Sélection du Type de Glow */}
          <div>
            <label className="block text-sm font-medium mb-3">Type d'Énergie</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(glowTypes).map(([key, type]) => {
                const Icon = type.icon;
                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant={selectedGlowType === key ? "default" : "outline"}
                      className={`w-full h-auto p-4 flex flex-col gap-2 ${
                        selectedGlowType === key ? `bg-gradient-to-r ${type.color} text-white` : ''
                      }`}
                      onClick={() => setSelectedGlowType(key)}
                    >
                      <Icon className="h-6 w-6" />
                      <div className="text-sm font-medium capitalize">{key}</div>
                      <div className="text-xs opacity-80">{type.description}</div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Contrôles d'Intensité */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Intensité Glow</label>
                <Badge variant="outline">{glowIntensity[0]}%</Badge>
              </div>
              <Slider
                value={glowIntensity}
                onValueChange={setGlowIntensity}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Durée (secondes)</label>
                <Badge variant="outline">{glowDuration[0]}s</Badge>
              </div>
              <Slider
                value={glowDuration}
                onValueChange={setGlowDuration}
                max={60}
                min={10}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          {/* Zone de Visualisation */}
          <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
            <AnimatePresence>
              {isGlowing && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                    scale: [0.5, 1.5, 1.5, 2],
                    background: [
                      `linear-gradient(45deg, ${glowTypes[selectedGlowType as keyof typeof glowTypes]?.color})`,
                      `linear-gradient(90deg, ${glowTypes[selectedGlowType as keyof typeof glowTypes]?.color})`,
                      `linear-gradient(135deg, ${glowTypes[selectedGlowType as keyof typeof glowTypes]?.color})`
                    ]
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ 
                    duration: glowDuration[0],
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0"
                />
              )}
            </AnimatePresence>

            <div className="absolute inset-0 flex items-center justify-center">
              {!isGlowing ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-center"
                >
                  <IconComponent className="h-16 w-16 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Prêt pour le Glow</p>
                </motion.div>
              ) : (
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-center text-white"
                >
                  <IconComponent className="h-20 w-20 mx-auto mb-2" />
                  <div className="text-lg font-bold">GLOW ACTIF</div>
                  <div className="text-4xl">{glowTypes[selectedGlowType as keyof typeof glowTypes]?.particles}</div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Recommandation IA */}
          {aiRecommendation && (
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm mb-1">Recommandation IA</div>
                    <div className="text-sm text-muted-foreground">{aiRecommendation}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bouton Principal */}
          <Button 
            onClick={startGlowSession}
            disabled={isGlowing}
            size="lg"
            className={`w-full relative overflow-hidden ${
              isGlowing 
                ? `bg-gradient-to-r ${glowTypes[selectedGlowType as keyof typeof glowTypes]?.color}` 
                : ''
            }`}
          >
            <AnimatePresence>
              {isGlowing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                  Glow en cours...
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="h-5 w-5" />
                  Déclencher le Flash Glow
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CFlashGlowEnhanced;