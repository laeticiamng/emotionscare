/**
 * Music Theme Selector - Thèmes visuels personnalisés
 * Sélection de thèmes, couleurs, animations, preview en temps réel
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Palette,
  Sparkles,
  Sun,
  Moon,
  Zap,
  Waves,
  Flame,
  Snowflake,
  Leaf,
  Star,
  Check,
  Settings2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MusicTheme {
  id: string;
  name: string;
  icon: React.ElementType;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  animation: 'smooth' | 'bounce' | 'pulse' | 'none';
  visualizer: 'bars' | 'wave' | 'circle' | 'particles';
}

const THEMES: MusicTheme[] = [
  {
    id: 'ocean',
    name: 'Océan',
    icon: Waves,
    colors: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#38bdf8', background: '#0c4a6e' },
    animation: 'smooth',
    visualizer: 'wave',
  },
  {
    id: 'sunset',
    name: 'Coucher de soleil',
    icon: Sun,
    colors: { primary: '#f97316', secondary: '#ea580c', accent: '#fb923c', background: '#7c2d12' },
    animation: 'pulse',
    visualizer: 'bars',
  },
  {
    id: 'midnight',
    name: 'Minuit',
    icon: Moon,
    colors: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa', background: '#1e1b4b' },
    animation: 'smooth',
    visualizer: 'particles',
  },
  {
    id: 'neon',
    name: 'Néon',
    icon: Zap,
    colors: { primary: '#ec4899', secondary: '#db2777', accent: '#f472b6', background: '#500724' },
    animation: 'bounce',
    visualizer: 'bars',
  },
  {
    id: 'fire',
    name: 'Feu',
    icon: Flame,
    colors: { primary: '#ef4444', secondary: '#dc2626', accent: '#f87171', background: '#450a0a' },
    animation: 'pulse',
    visualizer: 'wave',
  },
  {
    id: 'frost',
    name: 'Givre',
    icon: Snowflake,
    colors: { primary: '#06b6d4', secondary: '#0891b2', accent: '#22d3ee', background: '#083344' },
    animation: 'smooth',
    visualizer: 'particles',
  },
  {
    id: 'forest',
    name: 'Forêt',
    icon: Leaf,
    colors: { primary: '#22c55e', secondary: '#16a34a', accent: '#4ade80', background: '#14532d' },
    animation: 'smooth',
    visualizer: 'wave',
  },
  {
    id: 'cosmic',
    name: 'Cosmique',
    icon: Star,
    colors: { primary: '#a855f7', secondary: '#9333ea', accent: '#c084fc', background: '#2e1065' },
    animation: 'pulse',
    visualizer: 'circle',
  },
];

interface MusicThemeSelectorProps {
  currentTheme?: string;
  onThemeChange?: (theme: MusicTheme) => void;
}

export const MusicThemeSelector: React.FC<MusicThemeSelectorProps> = ({
  currentTheme = 'ocean',
  onThemeChange,
}) => {
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState(currentTheme);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customSettings, setCustomSettings] = useState({
    glowIntensity: 50,
    particleDensity: 50,
    animationSpeed: 50,
    autoTheme: false,
  });

  const handleThemeSelect = (theme: MusicTheme) => {
    setSelectedTheme(theme.id);
    onThemeChange?.(theme);
    toast({
      title: `🎨 Thème ${theme.name}`,
      description: 'Thème appliqué avec succès',
      duration: 2000,
    });
  };

  const activeTheme = THEMES.find((t) => t.id === selectedTheme) || THEMES[0];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Thèmes visuels
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="gap-1"
          >
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Theme Preview */}
        <motion.div
          key={selectedTheme}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative h-24 rounded-xl overflow-hidden"
          style={{ background: activeTheme.colors.background }}
        >
          {/* Animated Background */}
          <div className="absolute inset-0 overflow-hidden">
            {activeTheme.visualizer === 'wave' && (
              <svg className="absolute bottom-0 w-full h-16" viewBox="0 0 100 20">
                <motion.path
                  d="M0 10 Q 25 0, 50 10 T 100 10 V 20 H 0 Z"
                  fill={activeTheme.colors.primary}
                  opacity={0.3}
                  animate={{ d: ['M0 10 Q 25 0, 50 10 T 100 10 V 20 H 0 Z', 'M0 10 Q 25 20, 50 10 T 100 10 V 20 H 0 Z'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                />
              </svg>
            )}
            {activeTheme.visualizer === 'bars' && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 h-16">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 rounded-t"
                    style={{ background: activeTheme.colors.primary }}
                    animate={{ height: [20, 40 + Math.random() * 20, 20] }}
                    transition={{ duration: 0.5 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.05 }}
                  />
                ))}
              </div>
            )}
            {activeTheme.visualizer === 'particles' && (
              <div className="absolute inset-0">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ background: activeTheme.colors.accent, left: `${10 + i * 6}%` }}
                    animate={{ y: [60, 10, 60], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: i * 0.1 }}
                  />
                ))}
              </div>
            )}
            {activeTheme.visualizer === 'circle' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="rounded-full"
                  style={{ background: `${activeTheme.colors.primary}40`, width: 80, height: 80 }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            )}
          </div>

          {/* Theme Name */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {React.createElement(activeTheme.icon, { className: "h-8 w-8 mx-auto mb-1", style: { color: activeTheme.colors.accent } })}
              <p className="text-sm font-medium text-white">{activeTheme.name}</p>
            </div>
          </div>
        </motion.div>

        {/* Theme Grid */}
        <div className="grid grid-cols-4 gap-2">
          {THEMES.map((theme) => (
            <motion.button
              key={theme.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleThemeSelect(theme)}
              className={`relative p-3 rounded-lg border-2 transition-colors ${
                selectedTheme === theme.id
                  ? 'border-primary'
                  : 'border-transparent hover:border-muted-foreground/30'
              }`}
              style={{ background: theme.colors.background }}
            >
              {React.createElement(theme.icon, { className: "h-5 w-5 mx-auto", style: { color: theme.colors.accent } })}
              <p className="text-[10px] text-white/80 mt-1 truncate">{theme.name}</p>
              {selectedTheme === theme.id && (
                <motion.div
                  layoutId="theme-check"
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="h-3 w-3 text-primary-foreground" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* Advanced Settings */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 pt-3 border-t"
            >
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Intensité du glow</span>
                    <Badge variant="outline">{customSettings.glowIntensity}%</Badge>
                  </div>
                  <Slider
                    value={[customSettings.glowIntensity]}
                    onValueChange={([v]) => setCustomSettings((s) => ({ ...s, glowIntensity: v }))}
                    max={100}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Densité des particules</span>
                    <Badge variant="outline">{customSettings.particleDensity}%</Badge>
                  </div>
                  <Slider
                    value={[customSettings.particleDensity]}
                    onValueChange={([v]) => setCustomSettings((s) => ({ ...s, particleDensity: v }))}
                    max={100}
                    step={5}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Vitesse d'animation</span>
                    <Badge variant="outline">{customSettings.animationSpeed}%</Badge>
                  </div>
                  <Slider
                    value={[customSettings.animationSpeed]}
                    onValueChange={([v]) => setCustomSettings((s) => ({ ...s, animationSpeed: v }))}
                    max={100}
                    step={5}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Thème automatique</p>
                    <p className="text-xs text-muted-foreground">Basé sur l'heure</p>
                  </div>
                  <Switch
                    checked={customSettings.autoTheme}
                    onCheckedChange={(v) => setCustomSettings((s) => ({ ...s, autoTheme: v }))}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="flex-1 gap-1">
            <Sparkles className="h-3 w-3" />
            Aléatoire
          </Button>
          <Button size="sm" variant="outline" className="flex-1 gap-1">
            <Palette className="h-3 w-3" />
            Personnalisé
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicThemeSelector;
