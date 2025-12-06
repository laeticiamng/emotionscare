// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Zap, Lightbulb, Eye, Palette, Settings, 
  Play, Pause, RotateCcw, Monitor, Moon, Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface FlashTheme {
  id: string;
  name: string;
  colors: string[];
  pattern: 'pulse' | 'wave' | 'breathe' | 'strobe' | 'gradient';
  description: string;
  benefits: string[];
}

const flashThemes: FlashTheme[] = [
  {
    id: 'energy',
    name: 'Boost Énergie',
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    pattern: 'pulse',
    description: 'Stimule l\'éveil et la concentration',
    benefits: ['Augmente l\'énergie', 'Améliore l\'attention', 'Combat la fatigue']
  },
  {
    id: 'calm',
    name: 'Apaisement',
    colors: ['#A8E6CF', '#88D8C0', '#6FB98F', '#4F9A94'],
    pattern: 'breathe',
    description: 'Induit la relaxation et la sérénité',
    benefits: ['Réduit le stress', 'Favorise le calme', 'Aide à la méditation']
  },
  {
    id: 'focus',
    name: 'Focus Laser',
    colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
    pattern: 'wave',
    description: 'Optimise la concentration mentale',
    benefits: ['Améliore la focus', 'Stimule la créativité', 'Augmente la productivité']
  },
  {
    id: 'healing',
    name: 'Guérison',
    colors: ['#ffecd2', '#fcb69f', '#ff9a9e', '#fecfef'],
    pattern: 'gradient',
    description: 'Favorise la récupération et le bien-être',
    benefits: ['Accélère la guérison', 'Réduit la douleur', 'Améliore l\'humeur']
  }
];

const intensityLevels = [
  { value: 20, label: 'Très doux', description: 'Parfait pour la relaxation' },
  { value: 40, label: 'Doux', description: 'Idéal pour la détente' },
  { value: 60, label: 'Modéré', description: 'Équilibre efficacité/confort' },
  { value: 80, label: 'Intense', description: 'Maximum d\'efficacité' },
  { value: 100, label: 'Très intense', description: 'Pour les utilisateurs expérimentés' }
];

export const FlashGlowModule: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<FlashTheme>(flashThemes[0]);
  const [isActive, setIsActive] = useState(false);
  const [intensity, setIntensity] = useState([60]);
  const [duration, setDuration] = useState([5]);
  const [currentSession, setCurrentSession] = useState<number>(0);
  const [flashColor, setFlashColor] = useState('#667eea');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const sessionRef = useRef<NodeJS.Timeout>();

  // Générer des couleurs pour l'animation
  useEffect(() => {
    if (!isActive) return;

    const animateFlash = () => {
      const colors = selectedTheme.colors;
      const time = Date.now() / 1000;
      const speedMultiplier = intensity[0] / 50;

      let color: string;
      
      switch (selectedTheme.pattern) {
        case 'pulse':
          const pulseIndex = Math.floor(time * speedMultiplier) % colors.length;
          color = colors[pulseIndex];
          break;
          
        case 'wave':
          const waveProgress = (Math.sin(time * speedMultiplier) + 1) / 2;
          const waveIndex = Math.floor(waveProgress * colors.length);
          color = colors[Math.min(waveIndex, colors.length - 1)];
          break;
          
        case 'breathe':
          const breatheProgress = (Math.sin(time * speedMultiplier * 0.5) + 1) / 2;
          const breatheIndex = Math.floor(breatheProgress * colors.length);
          color = colors[Math.min(breatheIndex, colors.length - 1)];
          break;
          
        case 'strobe':
          const strobeIndex = Math.floor(time * speedMultiplier * 2) % colors.length;
          color = colors[strobeIndex];
          break;
          
        case 'gradient':
          const gradientProgress = (time * speedMultiplier * 0.3) % 1;
          const gradientIndex = Math.floor(gradientProgress * colors.length);
          color = colors[gradientIndex];
          break;
          
        default:
          color = colors[0];
      }

      setFlashColor(color);
      animationRef.current = requestAnimationFrame(animateFlash);
    };

    animateFlash();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, selectedTheme, intensity]);

  const startSession = () => {
    setIsActive(true);
    setCurrentSession(Date.now());
    
    // Timer pour arrêter automatiquement
    sessionRef.current = setTimeout(() => {
      stopSession();
      toast.success(`Session ${selectedTheme.name} terminée`);
    }, duration[0] * 60 * 1000);

    toast.info(`Session ${selectedTheme.name} démarrée pour ${duration[0]} minutes`);
  };

  const stopSession = () => {
    setIsActive(false);
    if (sessionRef.current) {
      clearTimeout(sessionRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        toast.error('Mode plein écran non supporté');
      }
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const getIntensityLevel = (value: number) => {
    return intensityLevels.find(level => level.value >= value) || intensityLevels[0];
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Zap className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Flash Glow</h1>
          <p className="text-muted-foreground">
            Thérapie par la lumière pour stimuler votre bien-être émotionnel
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Zone d'affichage principale */}
        <div className="lg:col-span-2">
          <Card className="relative overflow-hidden">
            <CardContent className="p-0">
              <div
                ref={containerRef}
                className={`relative transition-all duration-300 ${
                  isFullscreen ? 'h-screen' : 'h-96'
                } flex items-center justify-center`}
                style={{
                  backgroundColor: isActive ? flashColor : '#1f2937',
                  opacity: isActive ? intensity[0] / 100 : 1
                }}
              >
                {/* Overlay de contrôle */}
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-center text-white">
                    <AnimatePresence>
                      {isActive ? (
                        <motion.div
                          key="active"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Lightbulb className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                          <h3 className="text-2xl font-bold mb-2">{selectedTheme.name}</h3>
                          <p className="text-lg opacity-90">Session en cours</p>
                          <div className="mt-4 flex gap-2 justify-center">
                            <Button onClick={stopSession} variant="outline" size="sm">
                              <Pause className="h-4 w-4 mr-2" />
                              Arrêter
                            </Button>
                            <Button onClick={toggleFullscreen} variant="outline" size="sm">
                              <Monitor className="h-4 w-4 mr-2" />
                              {isFullscreen ? 'Quitter' : 'Plein écran'}
                            </Button>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="inactive"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <Eye className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <h3 className="text-2xl font-bold mb-2">Prêt à commencer</h3>
                          <p className="text-lg opacity-70">
                            Sélectionnez un thème et démarrez votre session
                          </p>
                          <Button 
                            onClick={startSession} 
                            className="mt-4"
                            disabled={isActive}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Démarrer la session
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Effets visuels supplémentaires */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    animate={{
                      background: [
                        `radial-gradient(circle at 20% 50%, ${flashColor} 0%, transparent 70%)`,
                        `radial-gradient(circle at 80% 50%, ${flashColor} 0%, transparent 70%)`,
                        `radial-gradient(circle at 50% 20%, ${flashColor} 0%, transparent 70%)`,
                        `radial-gradient(circle at 50% 80%, ${flashColor} 0%, transparent 70%)`
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Avertissements et informations */}
          <Card className="mt-4">
            <CardContent className="pt-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-5 w-5 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-800">Précautions importantes</h4>
                </div>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Ne pas utiliser en cas d'épilepsie ou de photosensibilité</li>
                  <li>• Commencez par une faible intensité et augmentez progressivement</li>
                  <li>• Arrêtez si vous ressentez des maux de tête ou des nausées</li>
                  <li>• Sessions recommandées : 5-15 minutes maximum</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panneau de contrôle */}
        <div className="space-y-4">
          {/* Sélection de thème */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thèmes Flash</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {flashThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedTheme.id === theme.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => !isActive && setSelectedTheme(theme)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex gap-1">
                      {theme.colors.slice(0, 3).map((color, i) => (
                        <div
                          key={i}
                          className="w-4 h-4 rounded-full border border-white shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <h4 className="font-medium">{theme.name}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {theme.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {theme.benefits.slice(0, 2).map((benefit, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Réglages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Paramètres
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Intensité: {intensity[0]}%
                </label>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  max={100}
                  step={10}
                  disabled={isActive}
                  className="w-full"
                />
                <div className="mt-2 text-xs text-muted-foreground">
                  {getIntensityLevel(intensity[0]).description}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-3 block">
                  Durée: {duration[0]} min
                </label>
                <Slider
                  value={duration}
                  onValueChange={setDuration}
                  min={1}
                  max={30}
                  step={1}
                  disabled={isActive}
                  className="w-full"
                />
              </div>

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pattern:</span>
                  <Badge variant="outline">{selectedTheme.pattern}</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Couleurs:</span>
                  <span>{selectedTheme.colors.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bénéfices */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bénéfices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {selectedTheme.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded bg-primary" />
                    {benefit}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conseils */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conseils d'utilisation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Utilisez dans un environnement calme</p>
              <p>• Fermez les yeux ou regardez indirectement</p>
              <p>• Respirez profondément pendant la session</p>
              <p>• Hydratez-vous après l'utilisation</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};