import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  ArrowLeft,
  Palette,
  Hand,
  Sparkles,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { getOptimizedUniverse } from '@/data/universes/config';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';

interface EmotionReflection {
  valence: number; // -50 to 50 (négatif -> positif)
  arousal: number; // 0 to 100 (calme -> énergique)
  color: string;
  description: string;
}

const ScanPage: React.FC = () => {
  const { toast } = useToast();
  
  // Get optimized universe config
  const universe = getOptimizedUniverse('scan');
  
  // Universe state
  const [isEntering, setIsEntering] = useState(true);
  const [universeEntered, setUniverseEntered] = useState(false);
  
  // Scan state
  const [isScanning, setIsScanning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [valence, setValence] = useState([0]); // -50 to 50
  const [arousal, setArousal] = useState([30]); // 0 to 100
  const [fluidColor, setFluidColor] = useState('hsl(180, 70%, 60%)');
  const [reflection, setReflection] = useState<EmotionReflection | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Optimized animations
  const { entranceVariants, cleanupAnimation } = useOptimizedAnimation({
    enableComplexAnimations: true,
    useCSSAnimations: true,
  });

  // Handle universe entrance
  const handleUniverseEnterComplete = () => {
    setUniverseEntered(true);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAnimation();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cleanupAnimation]);

  // Update fluid color based on emotional state
  useEffect(() => {
    const normalizedValence = (valence[0] + 50) / 100; // 0 to 1
    const normalizedArousal = arousal[0] / 100; // 0 to 1
    
    // Color mapping based on valence and arousal
    const hue = normalizedValence * 120 + normalizedArousal * 240; // 0-360 degrees
    const saturation = 50 + normalizedArousal * 30; // 50-80%
    const lightness = 40 + normalizedValence * 30; // 40-70%
    
    const newColor = `hsl(${hue % 360}, ${saturation}%, ${lightness}%)`;
    setFluidColor(newColor);
  }, [valence, arousal]);

  // Animated fluid effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isScanning) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    
    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Create gradient based on emotional state
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 2
      );
      
      const normalizedValence = (valence[0] + 50) / 100;
      const normalizedArousal = arousal[0] / 100;
      
      gradient.addColorStop(0, `hsla(${(normalizedValence * 120 + time * 2) % 360}, 70%, 60%, 0.8)`);
      gradient.addColorStop(0.5, `hsla(${(normalizedValence * 120 + normalizedArousal * 240 + time) % 360}, 60%, 50%, 0.4)`);
      gradient.addColorStop(1, `hsla(${(normalizedArousal * 240 + time * 0.5) % 360}, 50%, 40%, 0.2)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Add flowing particles
      for (let i = 0; i < 8; i++) {
        const x = width / 2 + Math.cos(time * 0.01 + i * 0.8) * (50 + normalizedArousal * 100);
        const y = height / 2 + Math.sin(time * 0.01 + i * 0.8) * (30 + normalizedValence * 50);
        const size = 3 + Math.sin(time * 0.02 + i) * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${(i * 45 + time * 2) % 360}, 80%, 70%, 0.6)`;
        ctx.fill();
      }
      
      time += 1;
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isScanning, valence, arousal]);

  const startScan = () => {
    setIsScanning(true);
    
    // Canvas setup
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 400;
      canvas.height = 300;
    }
    
    toast({
      title: "Reflet en cours de création",
      description: "Bouge les curseurs pour peindre ton état intérieur",
    });
  };

  const completeScan = () => {
    setIsScanning(false);
    setIsComplete(true);
    
    // Generate reflection based on emotional state
    const normalizedValence = (valence[0] + 50) / 100;
    const normalizedArousal = arousal[0] / 100;
    
    let description = '';
    if (normalizedValence > 0.7 && normalizedArousal > 0.7) {
      description = 'Énergie rayonnante et positive';
    } else if (normalizedValence > 0.7 && normalizedArousal < 0.3) {
      description = 'Sérénité profonde et lumineuse';
    } else if (normalizedValence < 0.3 && normalizedArousal > 0.7) {
      description = 'Tension active qui demande apaisement';
    } else if (normalizedValence < 0.3 && normalizedArousal < 0.3) {
      description = 'Calme mélancolique, doux repos';
    } else {
      description = 'Équilibre délicat en mouvement';
    }
    
    const newReflection: EmotionReflection = {
      valence: valence[0],
      arousal: arousal[0],
      color: fluidColor,
      description
    };
    
    setReflection(newReflection);
    
    setTimeout(() => {
      setShowReward(true);
    }, 2000);
  };

  const handleRewardComplete = () => {
    setShowReward(false);
    setIsComplete(false);
    setReflection(null);
    setValence([0]);
    setArousal([30]);
    
    toast({
      title: "Reflet sauvegardé ✨",
      description: "Ton état intérieur illumine maintenant ta galerie",
    });
  };

  if (showReward && reflection) {
    return (
      <RewardSystem
        reward={{
          type: 'sticker',
          name: 'Reflet du moment',
          description: universe.artifacts.description,
          moduleId: 'scan'
        }}
        badgeText="Ambiance sereine 🎨"
        onComplete={handleRewardComplete}
      />
    );
  }

  return (
    <UniverseEngine
      universe={universe}
      isEntering={isEntering}
      onEnterComplete={handleUniverseEnterComplete}
      enableParticles={true}
      enableAmbianceSound={false}
      className="min-h-screen"
    >
      {/* Header */}
      <header className="relative z-50 p-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/app" 
            className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Retour</span>
          </Link>
          
          <div className="flex items-center space-x-2 text-foreground">
            <Palette className="h-6 w-6 text-cyan-500" />
            <h1 className="text-xl font-light tracking-wide">{universe.name}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!isScanning && !isComplete ? (
            <motion.div
              key="welcome"
              variants={entranceVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-12 text-center"
            >
              {/* Introduction */}
              <div className="space-y-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{ 
                    background: `linear-gradient(135deg, ${universe.ambiance.colors.primary}, ${universe.ambiance.colors.accent})` 
                  }}
                >
                  <Eye className="h-10 w-10 text-white" />
                </motion.div>
                
                <h2 className="text-4xl font-light text-foreground tracking-wide">
                  Miroir Liquide
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                  Pose ton doigt sur l'écran, ressens ton état intérieur. 
                  Les fluides colorés vont peindre ton reflet émotionnel en temps réel.
                </p>
              </div>

              {/* Start button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button 
                  onClick={startScan}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 px-8"
                >
                  <Hand className="h-5 w-5 mr-2" />
                  Toucher le miroir
                </Button>
              </motion.div>
            </motion.div>
          ) : isScanning ? (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {/* Instruction */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-light text-foreground">
                  Peins ton état intérieur
                </h2>
                <p className="text-muted-foreground">
                  Bouge les curseurs et observe comme ton reflet se transforme
                </p>
              </div>

              {/* Fluid Canvas */}
              <div className="flex justify-center">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="rounded-xl shadow-lg border-2 border-white/20"
                    style={{ backgroundColor: '#0a0a0a' }}
                  />
                  <div className="absolute inset-0 rounded-xl pointer-events-none">
                    <div 
                      className="absolute inset-0 rounded-xl opacity-30 blur-xl"
                      style={{ backgroundColor: fluidColor }}
                    />
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <Card className="bg-card/90 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="font-medium text-foreground">Valence émotionnelle</h3>
                        <p className="text-xs text-muted-foreground">Négatif ← → Positif</p>
                      </div>
                      <Slider
                        value={valence}
                        onValueChange={setValence}
                        min={-50}
                        max={50}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-muted-foreground">
                        {valence[0] > 20 ? 'Très positif' : valence[0] > 0 ? 'Positif' : valence[0] > -20 ? 'Neutre' : 'Négatif'}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/90 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h3 className="font-medium text-foreground">Intensité énergétique</h3>
                        <p className="text-xs text-muted-foreground">Calme ← → Énergique</p>
                      </div>
                      <Slider
                        value={arousal}
                        onValueChange={setArousal}
                        min={0}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-muted-foreground">
                        {arousal[0] > 75 ? 'Très énergique' : arousal[0] > 50 ? 'Actif' : arousal[0] > 25 ? 'Modéré' : 'Calme'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Complete Button */}
              <div className="text-center">
                <Button 
                  onClick={completeScan}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Cristalliser mon reflet
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl mx-auto text-center space-y-8"
            >
              {/* Result */}
              <div className="space-y-6">
                <h2 className="text-3xl font-light text-foreground">
                  Ton reflet est créé ✨
                </h2>
                
                {reflection && (
                  <>
                    <div 
                      className="w-32 h-32 mx-auto rounded-full shadow-xl border-4 border-white/20"
                      style={{ backgroundColor: reflection.color }}
                    />
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-medium" style={{ color: reflection.color }}>
                        {reflection.description}
                      </h3>
                      <p className="text-muted-foreground">
                        Cette couleur capture l'essence de ton état actuel
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Micro-gesture suggestion */}
              <Card className="bg-card/90 backdrop-blur-md">
                <CardContent className="p-6">
                  <h4 className="font-medium mb-2">Micro-geste recommandé</h4>
                  <p className="text-sm text-muted-foreground">
                    Étire tes épaules en douceur, 3 respirations profondes ✨
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </UniverseEngine>
  );
};

export default ScanPage;