import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Zap, Sparkles, Heart, Crown, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import Breadcrumbs from '@/components/navigation/Breadcrumbs';
import { usePageMetadata } from '@/hooks/usePageMetadata';
import { useFlashGlowMachine } from '@/modules/flash-glow/useFlashGlowMachine';
import VelvetPulse from '@/modules/flash-glow/ui/VelvetPulse';
import EndChoice from '@/modules/flash-glow/ui/EndChoice';

const B2CFlashGlowPage: React.FC = () => {
  const machine = useFlashGlowMachine();
  
  // Charger les stats au montage
  useEffect(() => {
    machine.loadStats();
  }, []);

  // Metadata de la page
  usePageMetadata({
    title: 'Flash Glow - Thérapie lumière instantanée',
    description: 'Transformation énergétique rapide avec Flash Glow'
  });

  const glowTypes = {
    energy: { 
      icon: Zap, 
      color: 'from-yellow-400 via-orange-500 to-red-500',
      description: 'Boost explosif d\'énergie',
      particles: '⚡',
      defaultDuration: 90
    },
    calm: { 
      icon: Heart, 
      color: 'from-blue-400 via-cyan-500 to-teal-400',
      description: 'Sérénité profonde',
      particles: '💙',
      defaultDuration: 120
    },
    creativity: { 
      icon: Sparkles, 
      color: 'from-purple-400 via-pink-500 to-indigo-500',
      description: 'Inspiration créative',
      particles: '🎨',
      defaultDuration: 100
    },
    confidence: { 
      icon: Crown, 
      color: 'from-amber-400 via-yellow-500 to-orange-400',
      description: 'Confiance royale',
      particles: '👑',
      defaultDuration: 80
    },
    love: { 
      icon: Heart, 
      color: 'from-pink-400 via-rose-500 to-red-400',
      description: 'Amour et compassion',
      particles: '💝',
      defaultDuration: 110
    },
    // Advanced modes from Flash Glow Advanced
    doux: {
      icon: Heart,
      color: 'from-blue-300 via-cyan-400 to-teal-300',
      description: 'Velours léger apaisant',
      particles: '💙',
      defaultDuration: 90
    },
    standard: {
      icon: Sparkles,
      color: 'from-yellow-300 via-orange-400 to-amber-300',
      description: 'Velours équilibré',
      particles: '✨',
      defaultDuration: 120
    },
    tonique: {
      icon: Zap,
      color: 'from-green-300 via-emerald-400 to-teal-300',
      description: 'Velours dynamique',
      particles: '⚡',
      defaultDuration: 90
    }
  };

  const currentGlowType = glowTypes[machine.config.glowType as keyof typeof glowTypes] || glowTypes.energy;
  const IconComponent = currentGlowType.icon;

  const handleGlowTypeChange = (newType: string) => {
    const typeConfig = glowTypes[newType as keyof typeof glowTypes];
    if (typeConfig) {
      machine.setConfig({ 
        glowType: newType,
        duration: typeConfig.defaultDuration
      });
    }
  };

  return (
    <div className="space-y-6 min-h-screen">
      <Breadcrumbs />
      
      {/* Header avec animation dynamique */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <motion.div
          animate={machine.isActive ? { 
            scale: [1, 1.2, 1],
            rotate: [0, 360]
          } : { scale: 1, rotate: 0 }}
          transition={{ duration: 2, repeat: machine.isActive ? Infinity : 0 }}
        >
          <IconComponent className="h-8 w-8 text-yellow-500" />
        </motion.div>
        <div>
          <h1 className="text-3xl font-bold">Flash Glow Ultra ✨</h1>
          <p className="text-muted-foreground">
            {machine.state === 'active' ? 'Session en cours...' : 'Transformation énergétique instantanée'}
          </p>
        </div>
      </motion.div>

      {/* Stats utilisateur */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">
              {machine.stats?.totalSessions || 0}
            </div>
            <div className="text-sm text-muted-foreground">Sessions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-500">
              {machine.stats?.avgDuration || 0}s
            </div>
            <div className="text-sm text-muted-foreground">Durée Moy.</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {machine.state === 'success' ? '✨' : machine.state === 'active' ? '🔥' : '💤'}
            </div>
            <div className="text-sm text-muted-foreground">État</div>
          </CardContent>
        </Card>
      </div>

      {/* Si session terminée, afficher les choix de fin */}
      {machine.state === 'ending' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <EndChoice
            onChoice={machine.onSessionComplete}
            sessionDuration={machine.sessionDuration}
            className="max-w-lg mx-auto"
          />
        </motion.div>
      )}

      {/* Configuration et contrôles principaux */}
      {machine.state !== 'ending' && (
        <Card className="relative overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconComponent className="h-5 w-5" />
              Zone d'Activation Flash Glow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Sélection du type d'énergie */}
            <div>
              <label className="block text-sm font-medium mb-3">Type d'Énergie</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(glowTypes).map(([key, type]) => {
                  const Icon = type.icon;
                  const isSelected = machine.config.glowType === key;
                  
                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={isSelected ? "default" : "outline"}
                        disabled={machine.isActive || machine.isLoading}
                        className={`w-full h-auto p-4 flex flex-col gap-2 ${
                          isSelected ? `bg-gradient-to-r ${type.color} text-white` : ''
                        }`}
                        onClick={() => handleGlowTypeChange(key)}
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

            {/* Contrôles d'intensité et durée */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Intensité Glow</label>
                  <Badge variant="outline">{machine.config.intensity}%</Badge>
                </div>
                <Slider
                  value={[machine.config.intensity]}
                  onValueChange={([value]) => machine.setConfig({ intensity: value })}
                  max={100}
                  min={20}
                  step={5}
                  disabled={machine.isActive || machine.isLoading}
                  className="w-full"
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Durée (secondes)</label>
                  <Badge variant="outline">{machine.config.duration}s</Badge>
                </div>
                <Slider
                  value={[machine.config.duration]}
                  onValueChange={([value]) => machine.setConfig({ duration: value })}
                  max={180}
                  min={30}
                  step={15}
                  disabled={machine.isActive || machine.isLoading}
                  className="w-full"
                />
              </div>
            </div>

            {/* Zone de visualisation VelvetPulse */}
            <div className="relative h-64 bg-muted rounded-lg overflow-hidden">
              <VelvetPulse
                isActive={machine.isActive}
                intensity={machine.config.intensity}
                glowType={machine.config.glowType}
                duration={machine.config.duration}
                onComplete={() => {
                  // Le callback sera géré par la state machine
                }}
                className="w-full h-full"
              />
            </div>

            {/* Contrôles principaux */}
            <div className="flex gap-3">
              {machine.state === 'idle' && (
                <Button 
                  onClick={machine.startSession}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Déclencher le Flash Glow
                </Button>
              )}

              {machine.isActive && (
                <Button 
                  onClick={machine.stopSession}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <Pause className="h-5 w-5 mr-2" />
                  Arrêter
                </Button>
              )}

              {machine.state === 'success' && (
                <Button 
                  onClick={machine.startSession}
                  size="lg"
                  className="flex-1"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Nouvelle Session
                </Button>
              )}

              {machine.state === 'error' && (
                <Button 
                  onClick={machine.retry}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  Réessayer
                </Button>
              )}
            </div>

            {/* État de chargement */}
            {machine.isLoading && (
              <div className="text-center text-sm text-muted-foreground">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Préparation de votre session Flash Glow...
                </motion.div>
              </div>
            )}

            {/* Message d'erreur */}
            {machine.error && (
              <Card className="bg-destructive/10 border-destructive/20">
                <CardContent className="p-4">
                  <div className="text-sm text-destructive">
                    {machine.error.message}
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      )}

      {/* Note sur l'accessibilité */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="text-sm text-muted-foreground text-center">
            <p className="font-medium mb-1">♿ Respecte prefers-reduced-motion</p>
            <p>Les animations s'adaptent automatiquement à vos préférences d'accessibilité</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default B2CFlashGlowPage;