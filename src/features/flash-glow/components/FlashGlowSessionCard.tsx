/**
 * FlashGlowSessionCard - Carte de session de luminothérapie
 */

import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  RotateCcw,
  Sun,
  Moon,
  Zap,
  Brain,
  Settings,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlashGlowSessionCardProps {
  presetId?: string;
  onComplete?: (duration: number) => void;
  className?: string;
}

interface ColorPreset {
  id: string;
  name: string;
  description: string;
  colors: string[];
  duration: number;
  category: 'relaxation' | 'energy' | 'focus' | 'sleep';
  icon: React.ReactNode;
}

const PRESETS: ColorPreset[] = [
  {
    id: 'sunset-calm',
    name: 'Coucher de Soleil',
    description: 'Couleurs chaudes apaisantes',
    colors: ['#FF6B6B', '#FF8E53', '#FFCD74', '#FFE66D'],
    duration: 180,
    category: 'relaxation',
    icon: <Sun className="h-5 w-5" />,
  },
  {
    id: 'ocean-blue',
    name: 'Océan Profond',
    description: 'Bleus relaxants pour le sommeil',
    colors: ['#1A365D', '#2C5282', '#4299E1', '#63B3ED'],
    duration: 300,
    category: 'sleep',
    icon: <Moon className="h-5 w-5" />,
  },
  {
    id: 'energy-boost',
    name: 'Boost Énergie',
    description: 'Stimulation matinale',
    colors: ['#48BB78', '#68D391', '#9AE6B4', '#C6F6D5'],
    duration: 120,
    category: 'energy',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    id: 'focus-mode',
    name: 'Mode Focus',
    description: 'Concentration optimale',
    colors: ['#805AD5', '#9F7AEA', '#B794F4', '#D6BCFA'],
    duration: 240,
    category: 'focus',
    icon: <Brain className="h-5 w-5" />,
  },
];

export const FlashGlowSessionCard = memo<FlashGlowSessionCardProps>(({
  presetId,
  onComplete,
  className,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<ColorPreset | null>(
    presetId ? PRESETS.find(p => p.id === presetId) || null : null
  );
  const [isActive, setIsActive] = useState(false);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [intensity, setIntensity] = useState(70);
  const [speed, setSpeed] = useState(2000);
  const [elapsed, setElapsed] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Effet de changement de couleur
  useEffect(() => {
    if (isActive && selectedPreset) {
      intervalRef.current = setInterval(() => {
        setCurrentColorIndex(prev => 
          (prev + 1) % selectedPreset.colors.length
        );
      }, speed);

      timerRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev + 1 >= selectedPreset.duration) {
            handleStop();
            onComplete?.(selectedPreset.duration);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isActive, selectedPreset, speed]);

  const handleStart = useCallback(() => {
    if (!selectedPreset) return;
    setIsActive(true);
    setElapsed(0);
  }, [selectedPreset]);

  const handleStop = useCallback(() => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const handleReset = useCallback(() => {
    handleStop();
    setElapsed(0);
    setCurrentColorIndex(0);
  }, [handleStop]);

  const currentColor = selectedPreset?.colors[currentColorIndex] || '#1a1a1a';
  const progress = selectedPreset 
    ? Math.round((elapsed / selectedPreset.duration) * 100) 
    : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      {/* Zone de visualisation */}
      <motion.div
        className="relative h-48 flex items-center justify-center overflow-hidden"
        animate={{
          backgroundColor: isActive ? currentColor : '#1a1a1a',
        }}
        transition={{ duration: speed / 1000, ease: 'easeInOut' }}
        style={{ opacity: intensity / 100 }}
      >
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: speed / 1000, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${currentColor}80 0%, transparent 70%)`,
              }}
            />
          )}
        </AnimatePresence>

        {/* Timer overlay */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-4xl font-mono drop-shadow-lg">
              {formatTime(elapsed)}
            </div>
          </div>
        )}

        {/* Progress bar */}
        {isActive && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <motion.div
              className="h-full bg-white/50"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Settings button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Paramètres"
        >
          {showSettings ? <X className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
        </Button>
      </motion.div>

      <CardContent className="p-4 space-y-4">
        {/* Sélection de preset */}
        {!isActive && !showSettings && (
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset)}
                className={cn(
                  "p-3 rounded-lg border text-left transition-all",
                  selectedPreset?.id === preset.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  {preset.icon}
                  <span className="font-medium text-sm">{preset.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {preset.description}
                </p>
                <div className="flex gap-1 mt-2">
                  {preset.colors.slice(0, 4).map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Paramètres */}
        {showSettings && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center justify-between">
                Intensité
                <span className="text-muted-foreground">{intensity}%</span>
              </label>
              <Slider
                value={[intensity]}
                onValueChange={([v]) => setIntensity(v)}
                min={20}
                max={100}
                step={10}
                aria-label="Intensité"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center justify-between">
                Vitesse de transition
                <span className="text-muted-foreground">{speed / 1000}s</span>
              </label>
              <Slider
                value={[speed]}
                onValueChange={([v]) => setSpeed(v)}
                min={500}
                max={5000}
                step={500}
                aria-label="Vitesse"
              />
            </div>
          </div>
        )}

        {/* Contrôles */}
        <div className="flex gap-2">
          {!isActive ? (
            <Button
              onClick={handleStart}
              disabled={!selectedPreset}
              className="flex-1"
            >
              <Play className="mr-2 h-4 w-4" />
              Démarrer
            </Button>
          ) : (
            <>
              <Button onClick={handleStop} variant="outline" className="flex-1">
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
              <Button onClick={handleReset} variant="ghost" size="icon">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Info preset */}
        {selectedPreset && !showSettings && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{selectedPreset.name}</span>
            <Badge variant="secondary">
              {formatTime(selectedPreset.duration)} total
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

FlashGlowSessionCard.displayName = 'FlashGlowSessionCard';

export default FlashGlowSessionCard;
