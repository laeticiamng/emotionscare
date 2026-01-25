/**
 * ParkWeatherWidget - Widget météo émotionnelle du parc
 * Affiche la "météo" basée sur les émotions récentes de l'utilisateur
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudLightning, Sparkles, Wind, Droplets, CloudSun, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export type WeatherType = 'sunny' | 'cloudy' | 'partly-cloudy' | 'rainy' | 'stormy' | 'magical' | 'windy';

interface ParkWeatherWidgetProps {
  weatherType?: WeatherType;
  mood?: number; // 0-100
  description?: string;
  onRefresh?: () => void;
}

const weatherConfig: Record<WeatherType, {
  icon: LucideIcon;
  label: string;
  gradient: string;
  emoji: string;
  color: string;
}> = {
  sunny: {
    icon: Sun,
    label: 'Ensoleillé',
    gradient: 'from-yellow-400/20 via-orange-400/20 to-amber-400/20',
    emoji: '☀️',
    color: 'text-yellow-500'
  },
  'partly-cloudy': {
    icon: CloudSun,
    label: 'Partiellement nuageux',
    gradient: 'from-blue-300/20 via-yellow-300/20 to-gray-300/20',
    emoji: '⛅',
    color: 'text-gray-400'
  },
  cloudy: {
    icon: Cloud,
    label: 'Nuageux',
    gradient: 'from-gray-400/20 via-slate-400/20 to-gray-500/20',
    emoji: '☁️',
    color: 'text-gray-500'
  },
  rainy: {
    icon: CloudRain,
    label: 'Pluvieux',
    gradient: 'from-blue-500/20 via-indigo-400/20 to-slate-500/20',
    emoji: '🌧️',
    color: 'text-blue-500'
  },
  stormy: {
    icon: CloudLightning,
    label: 'Orageux',
    gradient: 'from-purple-600/20 via-slate-600/20 to-gray-700/20',
    emoji: '⛈️',
    color: 'text-purple-600'
  },
  magical: {
    icon: Sparkles,
    label: 'Magique',
    gradient: 'from-pink-400/20 via-purple-400/20 to-indigo-400/20',
    emoji: '✨',
    color: 'text-pink-500'
  },
  windy: {
    icon: Wind,
    label: 'Venteux',
    gradient: 'from-cyan-400/20 via-teal-400/20 to-emerald-400/20',
    emoji: '💨',
    color: 'text-cyan-500'
  }
};

export const ParkWeatherWidget: React.FC<ParkWeatherWidgetProps> = ({
  weatherType = 'sunny',
  mood = 75,
  description = 'Le parc est en pleine forme !',
  onRefresh
}) => {
  const config = weatherConfig[weatherType];
  const _Icon = config.icon;

  // Determine weather based on mood if not explicitly provided
  const computedWeather = useMemo(() => {
    if (mood >= 85) return 'magical';
    if (mood >= 70) return 'sunny';
    if (mood >= 55) return 'partly-cloudy';
    if (mood >= 40) return 'cloudy';
    if (mood >= 25) return 'rainy';
    return 'stormy';
  }, [mood]);

  const actualConfig = weatherType ? config : weatherConfig[computedWeather];
  const IconComponent = actualConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`
        relative overflow-hidden
        bg-gradient-to-br ${actualConfig.gradient}
        border-2 border-border/50 hover:border-primary/30
        transition-all duration-300
      `}>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* Weather Icon */}
            <motion.div
              className={`p-4 rounded-2xl bg-background/50 backdrop-blur-sm ${actualConfig.color}`}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <IconComponent className="h-10 w-10" />
            </motion.div>

            {/* Weather Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{actualConfig.emoji}</span>
                <h3 className="text-lg font-bold text-foreground">{actualConfig.label}</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{description}</p>

              {/* Mood Progress */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Énergie du parc</span>
                  <span className="font-medium">{mood}%</span>
                </div>
                <Progress value={mood} className="h-2" />
              </div>
            </div>

            {/* Badge */}
            <Badge variant="secondary" className="absolute top-3 right-3">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'short' })}
            </Badge>
          </div>

          {/* Decorative Elements */}
          {weatherType === 'rainy' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ left: `${10 + i * 12}%`, top: '-10px' }}
                  animate={{ y: [0, 120], opacity: [0.7, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                >
                  <Droplets className="h-3 w-3 text-blue-400/50" />
                </motion.div>
              ))}
            </div>
          )}

          {weatherType === 'magical' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{ 
                    left: `${Math.random() * 80 + 10}%`, 
                    top: `${Math.random() * 80 + 10}%` 
                  }}
                  animate={{ 
                    scale: [0, 1, 0], 
                    opacity: [0, 1, 0],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.4 
                  }}
                >
                  <Sparkles className="h-4 w-4 text-pink-400/60" />
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ParkWeatherWidget;
