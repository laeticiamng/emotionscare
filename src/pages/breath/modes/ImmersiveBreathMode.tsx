// @ts-nocheck
/**
 * ImmersiveBreathMode - Mode immersif (ex Constellation + VR)
 * Environnement 3D avec respiration synchronisée
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Play, Sparkles, Globe, Wind, Headphones, Star } from 'lucide-react';

const SCENES = [
  {
    id: 'constellation',
    name: 'Constellation',
    description: 'Respirez au rythme des étoiles qui s\'illuminent',
    gradient: 'from-indigo-950 via-violet-900 to-slate-900',
    icon: '✨',
  },
  {
    id: 'galaxy',
    name: 'Galaxie VR',
    description: 'Explorez une galaxie en respirant calmement',
    gradient: 'from-slate-900 via-blue-900 to-purple-950',
    icon: '🌌',
  },
  {
    id: 'ocean',
    name: 'Océan profond',
    description: 'Plongez dans les profondeurs au rythme de l\'eau',
    gradient: 'from-cyan-900 via-blue-800 to-slate-900',
    icon: '🌊',
  },
  {
    id: 'forest',
    name: 'Forêt enchantée',
    description: 'Marchez entre les arbres lumineux',
    gradient: 'from-emerald-950 via-green-900 to-slate-900',
    icon: '🌲',
  },
];

export default function ImmersiveBreathMode() {
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inspire' | 'expire'>('inspire');

  // Breath cycle for immersive
  React.useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setBreathPhase(p => p === 'inspire' ? 'expire' : 'inspire');
    }, 5000);
    return () => clearInterval(interval);
  }, [isActive]);

  if (selectedScene && isActive) {
    const scene = SCENES.find(s => s.id === selectedScene)!;
    return (
      <div className="relative min-h-[500px] rounded-2xl overflow-hidden">
        {/* Immersive background */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${scene.gradient}`}
          animate={{
            opacity: breathPhase === 'inspire' ? 1 : 0.7,
          }}
          transition={{ duration: 5, ease: 'easeInOut' }}
        />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full"
              animate={{
                y: [0, -200, 0],
                opacity: [0, 1, 0],
                scale: breathPhase === 'inspire' ? [0.5, 1.5, 0.5] : [1, 0.5, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${50 + Math.random() * 50}%`,
              }}
            />
          ))}
        </div>

        {/* Center breath circle */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.div
            animate={{
              scale: breathPhase === 'inspire' ? 1.5 : 0.8,
              boxShadow: breathPhase === 'inspire'
                ? '0 0 80px rgba(255,255,255,0.3)'
                : '0 0 20px rgba(255,255,255,0.1)',
            }}
            transition={{ duration: 5, ease: 'easeInOut' }}
            className="w-32 h-32 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center"
          >
            <p className="text-white text-lg font-medium">
              {breathPhase === 'inspire' ? 'Inspirez' : 'Expirez'}
            </p>
          </motion.div>
        </div>

        {/* Controls overlay */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
          <Button
            variant="secondary"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
            onClick={() => setIsActive(false)}
          >
            Quitter l'immersion
          </Button>
        </div>

        {/* Scene title */}
        <div className="absolute top-6 left-6 z-20">
          <Badge className="bg-white/10 backdrop-blur-md border-white/20 text-white">
            {scene.icon} {scene.name}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Eye className="h-10 w-10 text-emerald-500 mx-auto" />
        <h2 className="text-lg font-semibold">Mode Immersif</h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Choisissez un environnement et laissez-vous guider dans une expérience de respiration visuelle et sonore.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SCENES.map((scene) => (
          <Card
            key={scene.id}
            className="cursor-pointer hover:border-primary/50 transition-all overflow-hidden group"
            onClick={() => {
              setSelectedScene(scene.id);
              setIsActive(true);
            }}
          >
            <div className={`h-32 bg-gradient-to-br ${scene.gradient} flex items-center justify-center relative`}>
              <span className="text-4xl">{scene.icon}</span>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <Play className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{scene.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{scene.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="pt-6 text-center space-y-3">
          <Headphones className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">
            💡 Utilisez un casque audio pour une expérience optimale. 
            Les modes VR nécessitent un casque compatible WebXR.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
