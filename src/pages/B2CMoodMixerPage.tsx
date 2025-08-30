import React, { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Save, Play, Pause } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { useMotionPrefs } from '@/hooks/useMotionPrefs';

interface MoodVibe {
  id: string;
  name: string;
  softness: number;
  clarity: number;
  description: string;
}

const B2CMoodMixerPage: React.FC = () => {
  const navigate = useNavigate();
  const { shouldAnimate, getDuration } = useMotionPrefs();
  const [softness, setSoftness] = useState([50]);
  const [clarity, setClarity] = useState([50]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVibe, setCurrentVibe] = useState<string>('');
  const [savedVibes, setSavedVibes] = useState<MoodVibe[]>([
    { id: '1', name: 'brise lagon', softness: 70, clarity: 30, description: 'Douceur marine' },
    { id: '2', name: 'verre poli', softness: 40, clarity: 80, description: 'Netteté cristalline' }
  ]);
  const [dustParticles, setDustParticles] = useState<Array<{ x: number; y: number; opacity: number }>>([]);

  // Générateur de nom de vibe basé sur les sliders
  const generateVibeName = (soft: number, clear: number) => {
    const softWords = ['coton', 'soie', 'velours', 'brise', 'mousse'];
    const clearWords = ['cristal', 'acier', 'diamant', 'verre', 'lumière'];
    const neutralWords = ['sable', 'terre', 'bois', 'pierre', 'eau'];
    
    if (soft > 60 && clear < 40) {
      return `${softWords[Math.floor(Math.random() * softWords.length)]} ${['pâle', 'doux', 'tendre'][Math.floor(Math.random() * 3)]}`;
    } else if (clear > 60 && soft < 40) {
      return `${clearWords[Math.floor(Math.random() * clearWords.length)]} ${['vif', 'net', 'pur'][Math.floor(Math.random() * 3)]}`;
    } else {
      return `${neutralWords[Math.floor(Math.random() * neutralWords.length)]} ${['équilibré', 'stable', 'calme'][Math.floor(Math.random() * 3)]}`;
    }
  };

  // Animation des particules de poussière
  useEffect(() => {
    if (!shouldAnimate) return;
    
    const generateParticles = () => {
      const particles = [];
      for (let i = 0; i < 5; i++) {
        particles.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          opacity: Math.random() * 0.3
        });
      }
      setDustParticles(particles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 3000);
    return () => clearInterval(interval);
  }, [shouldAnimate]);

  // Mise à jour du nom de vibe en temps réel
  useEffect(() => {
    const vibeName = generateVibeName(softness[0], clarity[0]);
    setCurrentVibe(vibeName);
  }, [softness, clarity]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    // Simulation de lecture audio avec crossfade
  };

  const saveCurrentVibe = () => {
    const newVibe: MoodVibe = {
      id: Date.now().toString(),
      name: currentVibe,
      softness: softness[0],
      clarity: clarity[0],
      description: `Mix personnel ${softness[0]}% doux, ${clarity[0]}% clair`
    };
    
    setSavedVibes(prev => [newVibe, ...prev].slice(0, 6)); // Garder max 6 vibes
    
    // Animation de sauvegarde
    if (shouldAnimate) {
      const duration = getDuration(600);
      // Effet visuel de sauvegarde
    }
  };

  const loadVibe = (vibe: MoodVibe) => {
    setSoftness([vibe.softness]);
    setClarity([vibe.clarity]);
    setCurrentVibe(vibe.name);
  };

  const getVibeColor = () => {
    const soft = softness[0];
    const clear = clarity[0];
    
    // Couleur basée sur le mix des sliders
    const hue = (soft + clear) / 2 * 3.6; // 0-360
    const saturation = Math.abs(soft - clear) / 100 * 70 + 20; // 20-90%
    const lightness = 45 + (soft / 100) * 30; // 45-75%
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 p-4 relative overflow-hidden">
      {/* Particules de poussière */}
      {shouldAnimate && dustParticles.map((particle, index) => (
        <div
          key={index}
          className="absolute w-1 h-1 bg-foreground/10 rounded-full animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animationDuration: '3s',
            animationDelay: `${index * 0.5}s`
          }}
        />
      ))}

      {/* Header */}
      <div className="flex items-center gap-4 mb-8 relative z-10">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/dashboard')}
          className="hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Mood Mixer</h1>
          <p className="text-sm text-muted-foreground">Climat sur deux sliders</p>
        </div>
      </div>

      <div className="max-w-md mx-auto space-y-6 relative z-10">
        {/* Zone de mix principal */}
        <Card 
          className="p-6 bg-card/80 backdrop-blur-sm border-border/50 relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${getVibeColor()}15, ${getVibeColor()}05)`
          }}
        >
          {/* Nom de la vibe actuelle */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-light text-foreground mb-1" style={{ color: getVibeColor() }}>
              {currentVibe}
            </h2>
            <p className="text-xs text-muted-foreground">Votre climat sonore</p>
          </div>

          {/* Sliders */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Plus doux</label>
                <span className="text-xs text-muted-foreground">{softness[0]}%</span>
              </div>
              <Slider
                value={softness}
                onValueChange={setSoftness}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Plus clair</label>
                <span className="text-xs text-muted-foreground">{clarity[0]}%</span>
              </div>
              <Slider
                value={clarity}
                onValueChange={setClarity}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex items-center gap-3 mt-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePlay}
              className="hover:bg-white/10"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={saveCurrentVibe}
              className="hover:bg-white/10"
            >
              <Save className="h-4 w-4" />
            </Button>
            <div className="flex-1 text-center">
              <Volume2 className="h-4 w-4 text-muted-foreground mx-auto" />
            </div>
          </div>
        </Card>

        {/* Bibliothèque de vibes */}
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Vos vibes sauvées</h3>
          <div className="space-y-2">
            {savedVibes.map((vibe) => (
              <Card 
                key={vibe.id}
                className="p-3 bg-card/40 backdrop-blur-sm border-border/30 hover:bg-card/60 transition-all cursor-pointer group"
                onClick={() => loadVibe(vibe)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                      {vibe.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">{vibe.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full border border-border/50" 
                         style={{ 
                           backgroundColor: `hsl(${(vibe.softness + vibe.clarity) / 2 * 3.6}, 50%, 60%)`
                         }} 
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Option de défaut pour demain */}
        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Garder comme ambiance par défaut ?</p>
              <p className="text-xs text-muted-foreground">Pour demain matin</p>
            </div>
            <Button variant="ghost" size="sm" className="text-primary">
              Oui ✨
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default B2CMoodMixerPage;