import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Camera, 
  CameraOff, 
  Download, 
  Settings,
  Sparkles,
  Heart,
  Smile,
  Zap,
  Star,
  Sun,
  Moon,
  Palette,
  Filter,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaceLandmarker, FilesetResolver, DrawingUtils } from '@mediapipe/tasks-vision';

interface EmotionFilter {
  id: string;
  name: string;
  description: string;
  emotion: 'joy' | 'calm' | 'energetic' | 'confident' | 'dreamy' | 'focused';
  icon: LucideIconType;
  effects: {
    particleColor: string;
    particleShape: 'heart' | 'star' | 'sparkle' | 'dot' | 'diamond';
    intensity: number;
    animation: 'float' | 'pulse' | 'spiral' | 'cascade';
    faceOverlay?: {
      type: 'glow' | 'shimmer' | 'aura' | 'frame';
      color: string;
      opacity: number;
    };
    backgroundEffect?: {
      type: 'gradient' | 'bokeh' | 'rays' | 'particles';
      colors: string[];
    };
  };
}

const emotionFilters: EmotionFilter[] = [
  {
    id: 'joy',
    name: 'Joie Rayonnante',
    description: 'Particules dorées et aura lumineuse',
    emotion: 'joy',
    icon: Smile,
    effects: {
      particleColor: '#FFD700',
      particleShape: 'star',
      intensity: 0.8,
      animation: 'float',
      faceOverlay: {
        type: 'glow',
        color: '#FFD700',
        opacity: 0.3
      },
      backgroundEffect: {
        type: 'rays',
        colors: ['#FFD700', '#FFA500']
      }
    }
  },
  {
    id: 'calm',
    name: 'Sérénité Océanique',
    description: 'Bulles bleues apaisantes',
    emotion: 'calm',
    icon: Heart,
    effects: {
      particleColor: '#4FC3F7',
      particleShape: 'dot',
      intensity: 0.5,
      animation: 'float',
      faceOverlay: {
        type: 'aura',
        color: '#81C784',
        opacity: 0.4
      },
      backgroundEffect: {
        type: 'gradient',
        colors: ['#E3F2FD', '#B3E5FC']
      }
    }
  },
  {
    id: 'energetic',
    name: 'Énergie Électrique',
    description: 'Éclairs et étincelles dynamiques',
    emotion: 'energetic',
    icon: Zap,
    effects: {
      particleColor: '#FF6B35',
      particleShape: 'diamond',
      intensity: 1.0,
      animation: 'spiral',
      faceOverlay: {
        type: 'shimmer',
        color: '#FF6B35',
        opacity: 0.6
      },
      backgroundEffect: {
        type: 'particles',
        colors: ['#FF6B35', '#F7931E']
      }
    }
  },
  {
    id: 'confident',
    name: 'Confiance Royale',
    description: 'Couronne et particules dorées',
    emotion: 'confident',
    icon: Star,
    effects: {
      particleColor: '#9C27B0',
      particleShape: 'diamond',
      intensity: 0.7,
      animation: 'pulse',
      faceOverlay: {
        type: 'frame',
        color: '#9C27B0',
        opacity: 0.5
      },
      backgroundEffect: {
        type: 'bokeh',
        colors: ['#9C27B0', '#E1BEE7']
      }
    }
  },
  {
    id: 'dreamy',
    name: 'Rêve Cosmique',
    description: 'Étoiles et brume mystique',
    emotion: 'dreamy',
    icon: Moon,
    effects: {
      particleColor: '#B39DDB',
      particleShape: 'sparkle',
      intensity: 0.6,
      animation: 'cascade',
      faceOverlay: {
        type: 'aura',
        color: '#B39DDB',
        opacity: 0.4
      },
      backgroundEffect: {
        type: 'gradient',
        colors: ['#2A1B69', '#5E35B1']
      }
    }
  },
  {
    id: 'focused',
    name: 'Focus Laser',
    description: 'Géométrie précise et lignes nettes',
    emotion: 'focused',
    icon: Sun,
    effects: {
      particleColor: '#00BCD4',
      particleShape: 'dot',
      intensity: 0.4,
      animation: 'pulse',
      faceOverlay: {
        type: 'frame',
        color: '#00BCD4',
        opacity: 0.6
      },
      backgroundEffect: {
        type: 'rays',
        colors: ['#00BCD4', '#4DD0E1']
      }
    }
  }
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  shape: string;
  rotation: number;
  rotationSpeed: number;
}

export const AREmotionFilters: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<EmotionFilter>(emotionFilters[0]);
  const [intensity, setIntensity] = useState([0.7]);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [detectedFaces, setDetectedFaces] = useState<any[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    initializeMediaPipe();
    return () => {
      stopCamera();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const initializeMediaPipe = async () => {
    try {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      
      const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode: "VIDEO",
        numFaces: 1
      });
      
      setFaceLandmarker(landmarker);
    } catch (error) {
      console.error('Erreur initialisation MediaPipe:', error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
        
        videoRef.current.onloadedmetadata = () => {
          if (canvasRef.current && videoRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            startProcessing();
          }
        };
      }
    } catch (error) {
      console.error('Erreur accès caméra:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsActive(false);
    setDetectedFaces([]);
    setParticles([]);
  };

  const startProcessing = useCallback(() => {
    const processFrame = () => {
      if (!videoRef.current || !canvasRef.current || !faceLandmarker || !isActive) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;

      // Nettoyer le canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Dessiner la vidéo
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Détecter les visages
      try {
        const results = faceLandmarker.detectForVideo(video, performance.now());
        
        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
          setDetectedFaces(results.faceLandmarks);
          
          // Appliquer les effets pour chaque visage détecté
          results.faceLandmarks.forEach((landmarks) => {
            applyFilterEffects(ctx, landmarks, canvas.width, canvas.height);
          });
        }
      } catch (error) {
        console.error('Erreur détection:', error);
      }

      // Mettre à jour et dessiner les particules
      updateParticles();
      drawParticles(ctx);

      if (isActive) {
        animationRef.current = requestAnimationFrame(processFrame);
      }
    };

    animationRef.current = requestAnimationFrame(processFrame);
  }, [faceLandmarker, isActive, selectedFilter, intensity]);

  const applyFilterEffects = (
    ctx: CanvasRenderingContext2D, 
    landmarks: any[], 
    width: number, 
    height: number
  ) => {
    if (!landmarks || landmarks.length === 0) return;

    // Calculer la boîte englobante du visage
    const xs = landmarks.map((point: any) => point.x * width);
    const ys = landmarks.map((point: any) => point.y * height);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    
    const faceWidth = maxX - minX;
    const faceHeight = maxY - minY;
    const centerX = minX + faceWidth / 2;
    const centerY = minY + faceHeight / 2;

    // Appliquer l'effet de superposition du visage
    if (selectedFilter.effects.faceOverlay) {
      const overlay = selectedFilter.effects.faceOverlay;
      
      ctx.save();
      ctx.globalAlpha = overlay.opacity * intensity[0];
      
      switch (overlay.type) {
        case 'glow':
          const glowGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, faceWidth * 0.8
          );
          glowGradient.addColorStop(0, overlay.color + '80');
          glowGradient.addColorStop(1, overlay.color + '00');
          
          ctx.fillStyle = glowGradient;
          ctx.fillRect(minX - 20, minY - 20, faceWidth + 40, faceHeight + 40);
          break;
          
        case 'aura':
          ctx.strokeStyle = overlay.color;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, faceWidth * 0.6, faceHeight * 0.7, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;
          
        case 'frame':
          ctx.strokeStyle = overlay.color;
          ctx.lineWidth = 4;
          ctx.strokeRect(minX - 10, minY - 10, faceWidth + 20, faceHeight + 20);
          break;
      }
      
      ctx.restore();
    }

    // Générer des particules autour du visage
    if (Math.random() < selectedFilter.effects.intensity * intensity[0] * 0.1) {
      const particleCount = Math.floor(selectedFilter.effects.intensity * 5);
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const distance = faceWidth * (0.3 + Math.random() * 0.5);
        
        const particle: Particle = {
          x: centerX + Math.cos(angle) * distance,
          y: centerY + Math.sin(angle) * distance,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 3 - 1,
          size: Math.random() * 8 + 4,
          life: 60,
          maxLife: 60,
          color: selectedFilter.effects.particleColor,
          shape: selectedFilter.effects.particleShape,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2
        };
        
        setParticles(prev => [...prev.slice(-50), particle]);
      }
    }
  };

  const updateParticles = () => {
    setParticles(prev => 
      prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1,
        rotation: particle.rotation + particle.rotationSpeed,
        vy: particle.vy + 0.1 // Gravité
      })).filter(particle => particle.life > 0)
    );
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      
      ctx.save();
      ctx.globalAlpha = alpha * intensity[0];
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      
      ctx.fillStyle = particle.color;
      
      switch (particle.shape) {
        case 'heart':
          drawHeart(ctx, particle.size);
          break;
        case 'star':
          drawStar(ctx, particle.size);
          break;
        case 'diamond':
          drawDiamond(ctx, particle.size);
          break;
        case 'sparkle':
          drawSparkle(ctx, particle.size);
          break;
        default:
          ctx.beginPath();
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
      }
      
      ctx.restore();
    });
  };

  const drawHeart = (ctx: CanvasRenderingContext2D, size: number) => {
    const x = 0, y = 0;
    ctx.beginPath();
    ctx.moveTo(x, y + size/4);
    ctx.bezierCurveTo(x, y, x - size/2, y, x - size/2, y + size/4);
    ctx.bezierCurveTo(x - size/2, y + size/2, x, y + size*3/4, x, y + size);
    ctx.bezierCurveTo(x, y + size*3/4, x + size/2, y + size/2, x + size/2, y + size/4);
    ctx.bezierCurveTo(x + size/2, y, x, y, x, y + size/4);
    ctx.fill();
  };

  const drawStar = (ctx: CanvasRenderingContext2D, size: number) => {
    const spikes = 5;
    const outerRadius = size / 2;
    const innerRadius = outerRadius * 0.4;
    
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / spikes;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawDiamond = (ctx: CanvasRenderingContext2D, size: number) => {
    const half = size / 2;
    ctx.beginPath();
    ctx.moveTo(0, -half);
    ctx.lineTo(half, 0);
    ctx.lineTo(0, half);
    ctx.lineTo(-half, 0);
    ctx.closePath();
    ctx.fill();
  };

  const drawSparkle = (ctx: CanvasRenderingContext2D, size: number) => {
    const lines = 4;
    for (let i = 0; i < lines; i++) {
      const angle = (i * Math.PI) / (lines / 2);
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * size * 0.3, Math.sin(angle) * size * 0.3);
      ctx.lineTo(Math.cos(angle) * size * 0.6, Math.sin(angle) * size * 0.6);
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  };

  const capturePhoto = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `emotion-filter-${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Filtres AR Émotionnels</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Interface vidéo */}
      <Card className="relative overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Vidéo et Canvas */}
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="hidden"
              />
              <canvas
                ref={canvasRef}
                className="rounded-lg border-2 border-dashed border-muted max-w-full"
                style={{ maxHeight: '400px' }}
              />
              
              {!isActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Cliquez pour démarrer la caméra</p>
                  </div>
                </div>
              )}
            </div>

            {/* Contrôles */}
            <div className="flex items-center gap-4">
              <Button
                onClick={isActive ? stopCamera : startCamera}
                size="lg"
                variant={isActive ? "destructive" : "default"}
              >
                {isActive ? (
                  <>
                    <CameraOff className="mr-2 h-5 w-5" />
                    Arrêter
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 h-5 w-5" />
                    Démarrer
                  </>
                )}
              </Button>

              {isActive && (
                <>
                  <Button onClick={capturePhoto} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Capturer
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Intensité:</span>
                    <Slider
                      value={intensity}
                      onValueChange={setIntensity}
                      max={1}
                      min={0.1}
                      step={0.1}
                      className="w-24"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sélection des filtres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {emotionFilters.map(filter => {
          const FilterIcon = filter.icon;
          
          return (
            <Card
              key={filter.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedFilter.id === filter.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedFilter(filter)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="p-2 rounded-full"
                    style={{ backgroundColor: filter.effects.particleColor + '20' }}
                  >
                    <FilterIcon 
                      className="h-5 w-5" 
                      style={{ color: filter.effects.particleColor }}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{filter.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {filter.emotion}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{filter.description}</p>
                
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {filter.effects.particleShape} • {filter.effects.animation}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: filter.effects.particleColor }}
                  />
                  <span className="text-sm">Intensité {Math.round(filter.effects.intensity * 100)}%</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Informations détectées */}
      {isActive && detectedFaces.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Détection Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-green-50">
                {detectedFaces.length} visage{detectedFaces.length > 1 ? 's' : ''} détecté{detectedFaces.length > 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline">
                {particles.length} particules actives
              </Badge>
              <Badge variant="outline">
                Filtre: {selectedFilter.name}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AREmotionFilters;