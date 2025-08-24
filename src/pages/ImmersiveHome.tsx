
import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, Volume2, VolumeX, Palette, Monitor, 
  Sparkles, Heart, Brain, Music, Gamepad2, Mic,
  Sun, Moon, Wind, Waves, TreePine, Star, Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import UnifiedActionButtons from '@/components/home/UnifiedActionButtons';
import '@/styles/immersive-home.css';

interface Theme {
  id: string;
  name: string;
  colors: {
    primary: string;
    accent: string;
    background: string;
    text: string;
  };
  className: string;
}

interface AmbientSound {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  file: string;
  category: string;
}

const ImmersiveHome: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [currentTheme, setCurrentTheme] = useState<string>('light');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [ambientVolume, setAmbientVolume] = useState(30);
  const [selectedAmbient, setSelectedAmbient] = useState<string>('ocean');
  const [showControls, setShowControls] = useState(false);
  const [particlesEnabled, setParticlesEnabled] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const themes: Theme[] = [
    {
      id: 'light',
      name: 'Aurora',
      colors: {
        primary: '#3651ff',
        accent: '#7B61FF',
        background: '#f7f9fc',
        text: '#232949'
      },
      className: 'theme-light'
    },
    {
      id: 'dark',
      name: 'Cosmos',
      colors: {
        primary: '#5B87FF',
        accent: '#9D8DFF',
        background: '#0e1325',
        text: '#ffffff'
      },
      className: 'theme-dark dark'
    },
    {
      id: 'pastel',
      name: 'Dreams',
      colors: {
        primary: '#8C8CFF',
        accent: '#C4A5FF',
        background: '#f5f3ff',
        text: '#4b466b'
      },
      className: 'theme-pastel pastel'
    }
  ];

  const ambientSounds: AmbientSound[] = [
    { id: 'ocean', name: 'Océan', icon: Waves, file: '/sounds/ocean.mp3', category: 'Nature' },
    { id: 'forest', name: 'Forêt', icon: TreePine, file: '/sounds/forest.mp3', category: 'Nature' },
    { id: 'rain', name: 'Pluie', icon: Wind, file: '/sounds/rain.mp3', category: 'Nature' },
    { id: 'ambient', name: 'Ambiant', icon: Music, file: '/sounds/ambient.mp3', category: 'Musique' }
  ];

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];

  // Voice Command Simulation
  const toggleVoiceCommand = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      // Simulate voice activation
      setTimeout(() => {
        setIsVoiceActive(false);
      }, 3000);
    }
  };

  // Ambient Music Control
  const toggleAmbientMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.log);
      }
    }
  };

  // Theme Change Effect
  useEffect(() => {
    document.documentElement.className = currentThemeData.className;
    
    // Update CSS custom properties
    const root = document.documentElement;
    Object.entries(currentThemeData.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [currentTheme, currentThemeData]);

  // Particle System Component
  const ParticleSystem = () => {
    if (!particlesEnabled || shouldReduceMotion) return null;
    
    return (
      <div className="particles-container">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, -100, window.innerHeight + 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    );
  };

  // Music Visualizer Component
  const MusicVisualizer = () => {
    if (!isMusicPlaying) return null;

    return (
      <div className="flex items-end space-x-1 h-8">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="music-visualizer-bar w-1 bg-primary"
            style={{
              height: `${Math.random() * 100 + 20}%`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={cn("immersive-container", currentThemeData.className)}>
      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop>
        <source src={ambientSounds.find(s => s.id === selectedAmbient)?.file} type="audio/mpeg" />
      </audio>

      {/* Particle System */}
      <ParticleSystem />

      {/* Ambient Background Circles */}
      <div className="ambient-circle primary w-64 h-64 top-1/4 left-1/4" />
      <div className="ambient-circle accent w-80 h-80 bottom-1/4 right-1/4" />

      {/* Control Panel */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center space-x-2">
          {/* Show/Hide Controls */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowControls(!showControls)}
            className="control-button"
          >
            <Monitor className="h-4 w-4" />
          </Button>

          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-2 bg-card/80 backdrop-blur-md p-2 rounded-lg border"
              >
                {/* Theme Selector */}
                <div className="flex space-x-1">
                  {themes.map((theme) => (
                    <Button
                      key={theme.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentTheme(theme.id)}
                      className={cn(
                        "control-button",
                        currentTheme === theme.id && "active"
                      )}
                      title={theme.name}
                    >
                      <Palette className="h-4 w-4" />
                    </Button>
                  ))}
                </div>

                {/* Voice Command */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleVoiceCommand}
                  className={cn("control-button", isVoiceActive && "voice-active")}
                >
                  <Mic className="h-4 w-4" />
                </Button>

                {/* Ambient Music */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAmbientMusic}
                  className="control-button"
                >
                  {isMusicPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>

                {/* Volume Control */}
                {isMusicPlaying && (
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                    <Slider
                      value={[ambientVolume]}
                      onValueChange={(value) => setAmbientVolume(value[0])}
                      max={100}
                      step={1}
                      className="w-16"
                    />
                  </div>
                )}

                {/* Particles Toggle */}
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <Switch
                    checked={particlesEnabled}
                    onCheckedChange={setParticlesEnabled}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: shouldReduceMotion ? 0.1 : 1.2,
            type: "spring",
            stiffness: 100 
          }}
          className="text-center space-y-8"
        >
          {/* Premium Title */}
          <div className="space-y-4">
            <motion.h1 
              className="premium-title"
              animate={shouldReduceMotion ? {} : { 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              EmotionsCare
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center space-x-2"
            >
              <Crown className="h-6 w-6 text-yellow-500" />
              <Badge className="premium-badge bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 text-yellow-600">
                Premium Experience
              </Badge>
            </motion.div>

            <p className="premium-subtitle">
              Plateforme immersive de bien-être émotionnel avec IA avancée
            </p>
          </div>

          {/* Feature Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {[
              { icon: Brain, label: 'IA Émotionnelle', color: 'text-purple-400' },
              { icon: Music, label: 'Musicothérapie', color: 'text-blue-400' },
              { icon: Gamepad2, label: 'Gamification', color: 'text-green-400' },
              { icon: Heart, label: 'Bien-être 360°', color: 'text-pink-400' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex flex-col items-center p-4 glass-effect rounded-xl hover:scale-105 transition-transform cursor-pointer"
              >
                <feature.icon className={cn("h-8 w-8 mb-2", feature.color)} />
                <span className="text-sm font-medium text-foreground/80">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Interactive Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Card className="premium-card glass-effect max-w-2xl mx-auto">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center space-x-2 text-foreground">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span>Votre Parcours Personnalisé</span>
                  <Star className="h-5 w-5 text-yellow-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground">
                  Découvrez un environnement adaptatif qui évolue selon vos émotions et préférences
                </p>
                
                {/* Status Indicators */}
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-muted-foreground">Système actif</span>
                  </div>
                  {isMusicPlaying && (
                    <div className="flex items-center space-x-2">
                      <MusicVisualizer />
                      <span className="text-muted-foreground">Ambiance</span>
                    </div>
                  )}
                  {isVoiceActive && (
                    <div className="flex items-center space-x-2">
                      <motion.div
                        className="w-2 h-2 bg-blue-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      <span className="text-muted-foreground">Écoute active</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <UnifiedActionButtons />
              </CardContent>
            </Card>
          </motion.div>

          {/* Ambient Sound Selector */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="flex items-center justify-center space-x-2"
          >
            <span className="text-sm text-muted-foreground">Ambiance:</span>
            {ambientSounds.map((sound) => (
              <Button
                key={sound.id}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAmbient(sound.id)}
                className={cn(
                  "control-button",
                  selectedAmbient === sound.id && "active"
                )}
                title={sound.name}
              >
                <sound.icon className="h-4 w-4" />
              </Button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Theme Display */}
      <motion.div
        className="fixed bottom-4 left-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <Badge variant="outline" className="glass-effect">
          Thème: {currentThemeData.name}
        </Badge>
      </motion.div>
    </div>
  );
};

export default ImmersiveHome;
