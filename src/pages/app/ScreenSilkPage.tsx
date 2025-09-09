import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Settings, Palette, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Texture {
  id: string;
  name: string;
  description: string;
  colors: string[];
  pattern: 'fluid' | 'geometric' | 'organic' | 'particle';
  intensity: number;
}

const ScreenSilkPage = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedTexture, setSelectedTexture] = useState('silk-waves');
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [volume, setVolume] = useState([0.3]);
  const [animationSpeed, setAnimationSpeed] = useState([1]);
  const [fullscreen, setFullscreen] = useState(false);
  const [liteMode, setLiteMode] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const textures: Texture[] = [
    {
      id: 'silk-waves',
      name: 'Vagues Soyeuses',
      description: 'Ondulations fluides apaisantes',
      colors: ['#667eea', '#764ba2', '#f093fb'],
      pattern: 'fluid',
      intensity: 0.7
    },
    {
      id: 'zen-garden',
      name: 'Jardin Zen',
      description: 'Motifs organiques naturels',
      colors: ['#11998e', '#38ef7d', '#a8edea'],
      pattern: 'organic',
      intensity: 0.5
    },
    {
      id: 'cosmic-silk',
      name: 'Soie Cosmique',
      description: 'Particules stellaires douces',
      colors: ['#667eea', '#764ba2', '#f093fb'],
      pattern: 'particle',
      intensity: 0.8
    },
    {
      id: 'aurora-flow',
      name: 'Flux Auroral',
      description: 'Couleurs dansantes nordiques',
      colors: ['#a8edea', '#fed6e3', '#ffecd2'],
      pattern: 'fluid',
      intensity: 0.6
    },
    {
      id: 'geometric-calm',
      name: 'Calme Géométrique',
      description: 'Formes douces et structurées',
      colors: ['#667eea', '#764ba2'],
      pattern: 'geometric',
      intensity: 0.4
    }
  ];

  // Détecter GPU faible
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setLiteMode(true);
      toast.info('Mode Lite activé', {
        description: 'Optimisation pour votre appareil'
      });
    }
  }, []);

  // Détecter prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setAnimationSpeed([0.3]);
      toast.info('Animations réduites', {
        description: 'Respect de vos préférences d\'accessibilité'
      });
    }
  }, []);

  // Animation canvas
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationTime = 0;
    const currentTexture = textures.find(t => t.id === selectedTexture) || textures[0];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * devicePixelRatio;
      canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      if (!isActive) return;

      animationTime += 0.016 * animationSpeed[0];
      
      // Nettoyer
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (liteMode) {
        // Version simplifiée
        drawSimpleTexture(ctx, canvas, currentTexture, animationTime);
      } else {
        // Version complète
        drawComplexTexture(ctx, canvas, currentTexture, animationTime);
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, selectedTexture, animationSpeed, liteMode]);

  const drawSimpleTexture = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, texture: Texture, time: number) => {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Dégradé simple animé
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    const colorIndex = Math.sin(time * 0.5) * 0.5 + 0.5;
    
    gradient.addColorStop(0, texture.colors[0]);
    gradient.addColorStop(0.5, texture.colors[1] || texture.colors[0]);
    gradient.addColorStop(1, texture.colors[2] || texture.colors[0]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Ajout de formes douces
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 3; i++) {
      const x = width * 0.2 + (width * 0.6) * Math.sin(time * 0.3 + i);
      const y = height * 0.2 + (height * 0.6) * Math.cos(time * 0.2 + i * 1.5);
      const radius = 100 + 50 * Math.sin(time * 0.4 + i);
      
      const radialGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      radialGradient.addColorStop(0, texture.colors[i % texture.colors.length]);
      radialGradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = radialGradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }
    ctx.globalAlpha = 1;
  };

  const drawComplexTexture = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, texture: Texture, time: number) => {
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    switch (texture.pattern) {
      case 'fluid':
        drawFluidPattern(ctx, width, height, texture, time);
        break;
      case 'geometric':
        drawGeometricPattern(ctx, width, height, texture, time);
        break;
      case 'organic':
        drawOrganicPattern(ctx, width, height, texture, time);
        break;
      case 'particle':
        drawParticlePattern(ctx, width, height, texture, time);
        break;
    }
  };

  const drawFluidPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, texture: Texture, time: number) => {
    // Vagues fluides complexes
    ctx.globalAlpha = 0.8;
    
    for (let layer = 0; layer < 3; layer++) {
      ctx.beginPath();
      
      for (let x = 0; x <= width; x += 10) {
        const wave1 = Math.sin((x / width) * Math.PI * 2 + time * 0.5 + layer) * 50;
        const wave2 = Math.sin((x / width) * Math.PI * 4 + time * 0.3 - layer) * 30;
        const y = height * 0.5 + wave1 + wave2 + layer * 60;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, texture.colors[layer % texture.colors.length] + '60');
      gradient.addColorStop(1, texture.colors[layer % texture.colors.length] + '20');
      
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  };

  const drawGeometricPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, texture: Texture, time: number) => {
    // Motifs géométriques doux
    const gridSize = 60;
    ctx.globalAlpha = 0.4;
    
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        const rotation = time * 0.2 + (x + y) * 0.01;
        const scale = 0.8 + 0.2 * Math.sin(time * 0.3 + x * 0.01);
        
        ctx.save();
        ctx.translate(x + gridSize / 2, y + gridSize / 2);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        
        const colorIndex = Math.floor((x + y + time * 100) / gridSize) % texture.colors.length;
        ctx.fillStyle = texture.colors[colorIndex];
        
        ctx.fillRect(-gridSize * 0.3, -gridSize * 0.3, gridSize * 0.6, gridSize * 0.6);
        
        ctx.restore();
      }
    }
    
    ctx.globalAlpha = 1;
  };

  const drawOrganicPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, texture: Texture, time: number) => {
    // Formes organiques naturelles
    ctx.globalAlpha = 0.6;
    
    for (let i = 0; i < 8; i++) {
      const centerX = width * 0.1 + (width * 0.8) * Math.sin(time * 0.1 + i);
      const centerY = height * 0.1 + (height * 0.8) * Math.cos(time * 0.07 + i * 1.3);
      const radius = 40 + 30 * Math.sin(time * 0.15 + i);
      
      ctx.beginPath();
      
      for (let angle = 0; angle < Math.PI * 2; angle += 0.2) {
        const noise = 10 * Math.sin(angle * 3 + time * 0.5 + i);
        const x = centerX + (radius + noise) * Math.cos(angle);
        const y = centerY + (radius + noise) * Math.sin(angle);
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius + 20);
      gradient.addColorStop(0, texture.colors[i % texture.colors.length]);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  };

  const drawParticlePattern = (ctx: CanvasRenderingContext2D, width: number, height: number, texture: Texture, time: number) => {
    // Système de particules doux
    ctx.globalAlpha = 0.7;
    
    for (let i = 0; i < 50; i++) {
      const x = (width * (i / 50) + width * 0.1 * Math.sin(time * 0.3 + i * 0.1)) % width;
      const y = (height * 0.5 + height * 0.3 * Math.sin(time * 0.2 + i * 0.2)) % height;
      const size = 2 + 4 * Math.sin(time * 0.4 + i * 0.1);
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      gradient.addColorStop(0, texture.colors[i % texture.colors.length]);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  };

  // Timer de session
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const startSession = () => {
    setIsActive(true);
    setSessionTime(0);
    
    toast.success('Screen Silk activé', {
      description: 'Laissez-vous porter par les textures apaisantes',
      duration: 2000
    });
  };

  const pauseSession = () => {
    setIsActive(false);
    toast.info('Session en pause');
  };

  const stopSession = () => {
    setIsActive(false);
    setSessionTime(0);
    toast.success('Session Screen Silk terminée', {
      description: 'Vos yeux et votre esprit se sentent plus détendus'
    });
  };

  const toggleFullscreen = () => {
    if (!fullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setFullscreen(!fullscreen);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTexture = textures.find(t => t.id === selectedTexture) || textures[0];

  return (
    <div className={`min-h-screen ${fullscreen ? 'fixed inset-0 z-50' : ''} bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-4`}>
      <div className="max-w-6xl mx-auto h-full">
        {/* Header */}
        {!fullscreen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Screen Silk
            </h1>
            <p className="text-slate-300">
              Textures visuelles douces pour apaiser vos yeux et votre esprit
            </p>
            {sessionTime > 0 && (
              <p className="text-slate-400 text-sm mt-2">
                Session : {formatTime(sessionTime)}
              </p>
            )}
          </motion.div>
        )}

        <div className={`grid ${fullscreen ? 'h-full' : 'lg:grid-cols-4'} gap-6 h-full`}>
          {/* Zone de visualisation */}
          <div className={`${fullscreen ? 'col-span-full' : 'lg:col-span-3'} relative`}>
            <Card className="overflow-hidden h-full min-h-[500px] bg-slate-800/20 backdrop-blur-sm border-slate-700">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-cover"
                style={{ minHeight: fullscreen ? '100vh' : '500px' }}
              />
              
              {/* Overlay de contrôles en mode fullscreen */}
              {fullscreen && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-50 hover:opacity-100 transition-opacity">
                  <Button
                    onClick={toggleFullscreen}
                    size="sm"
                    variant="secondary"
                    className="bg-black/50 text-white border-white/20"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={stopSession}
                    size="sm"
                    variant="secondary"
                    className="bg-black/50 text-white border-white/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* État initial */}
              {!isActive && !fullscreen && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center space-y-6"
                  >
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                      <Palette className="w-10 h-10 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-2">
                        Prêt pour la détente visuelle ?
                      </h3>
                      <p className="text-slate-300 mb-6">
                        Choisissez votre texture préférée et laissez vos yeux se reposer
                      </p>
                      <Button
                        onClick={startSession}
                        size="lg"
                        className="bg-gradient-to-r from-indigo-500 to-purple-500"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Démarrer Screen Silk
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </Card>
          </div>

          {/* Panneau de contrôle */}
          {!fullscreen && (
            <div className="space-y-4">
              {/* Contrôles principaux */}
              <Card className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-700">
                <div className="space-y-4">
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Contrôles
                  </h3>
                  
                  <div className="flex gap-2">
                    {!isActive ? (
                      <Button
                        onClick={startSession}
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Démarrer
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={pauseSession}
                          variant="secondary"
                          className="flex-1"
                        >
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </Button>
                        <Button
                          onClick={toggleFullscreen}
                          variant="outline"
                          size="sm"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>

                  {isActive && (
                    <Button
                      onClick={stopSession}
                      variant="outline"
                      className="w-full"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Terminer
                    </Button>
                  )}
                </div>
              </Card>

              {/* Sélection de texture */}
              <Card className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-700">
                <div className="space-y-3">
                  <h3 className="font-semibold text-white">Texture</h3>
                  
                  <Select value={selectedTexture} onValueChange={setSelectedTexture}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {textures.map(texture => (
                        <SelectItem key={texture.id} value={texture.id}>
                          {texture.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <p className="text-sm text-slate-400">{currentTexture.description}</p>

                  <div className="flex gap-1">
                    {currentTexture.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-slate-600"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </Card>

              {/* Options avancées */}
              <Card className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-700">
                <div className="space-y-4">
                  <h3 className="font-semibold text-white">Options</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {musicEnabled ? <Volume2 className="w-4 h-4 text-slate-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                      <label className="text-sm text-white">Musique douce</label>
                    </div>
                    <Switch
                      checked={musicEnabled}
                      onCheckedChange={setMusicEnabled}
                    />
                  </div>

                  {musicEnabled && (
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">Volume</label>
                      <Slider
                        value={volume}
                        onValueChange={setVolume}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-sm text-slate-400 mb-2 block">
                      Vitesse d'animation
                    </label>
                    <Slider
                      value={animationSpeed}
                      onValueChange={setAnimationSpeed}
                      min={0.1}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm text-white">Mode Lite</label>
                    <div className="flex items-center gap-2">
                      {liteMode && <Badge variant="secondary" className="text-xs">Auto</Badge>}
                      <Switch
                        checked={liteMode}
                        onCheckedChange={setLiteMode}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Conseils */}
              <Card className="p-4 bg-slate-800/30 backdrop-blur-sm border-slate-700">
                <h3 className="font-semibold text-white mb-3">Conseils d'utilisation</h3>
                <ul className="text-sm text-slate-300 space-y-2">
                  <li>• Idéal pour les pauses écran de 5-15 minutes</li>
                  <li>• Regardez à distance confortable (bras tendu)</li>
                  <li>• Clignez naturellement des yeux</li>
                  <li>• Utilisez le mode plein écran pour plus d'immersion</li>
                  <li>• Adaptez la vitesse selon vos préférences</li>
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenSilkPage;