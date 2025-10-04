// @ts-nocheck
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Cloud, CloudDrizzle, CloudRain, CloudSun, Sun } from 'lucide-react';

type EmotionalWeather = 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'mixed';

interface EmotionalWeatherWidgetProps {
  weather?: EmotionalWeather;
  score?: number;
  trend?: 'up' | 'down' | 'stable';
  className?: string;
}

const EmotionalWeatherWidget: React.FC<EmotionalWeatherWidgetProps> = ({
  weather = 'mixed',
  score = 72,
  trend = 'up',
  className = ''
}) => {
  const getWeatherIcon = () => {
    switch (weather) {
      case 'sunny':
        return <Sun size={48} className="text-warning" />;
      case 'cloudy':
        return <CloudSun size={48} className="text-primary/70" />;
      case 'rainy':
        return <CloudRain size={48} className="text-primary" />;
      case 'stormy':
        return <CloudDrizzle size={48} className="text-accent" />;
      case 'mixed':
      default:
        return <CloudSun size={48} className="text-primary" />;
    }
  };

  const getWeatherBackground = () => {
    switch (weather) {
      case 'sunny':
        return 'weather-animation bg-gradient-to-br from-warning/10 to-warning/20';
      case 'cloudy':
        return 'weather-animation bg-gradient-to-br from-primary/10 to-muted/20';
      case 'rainy':
        return 'weather-animation bg-gradient-to-br from-primary/20 to-primary/30';
      case 'stormy':
        return 'weather-animation bg-gradient-to-br from-accent/20 to-muted/30';
      case 'mixed':
      default:
        return 'weather-animation bg-gradient-to-br from-primary/10 to-accent/20';
    }
  };

  const getWeatherDescription = () => {
    switch (weather) {
      case 'sunny': return 'Climat émotionnel positif';
      case 'cloudy': return 'Climat émotionnel mitigé';
      case 'rainy': return 'Climat émotionnel tendu';
      case 'stormy': return 'Climat émotionnel difficile';
      case 'mixed': return 'Climat émotionnel varié';
      default: return 'Climat émotionnel';
    }
  };

  // Animation variants for the weather elements
  const cloudVariants = {
    animate: {
      x: ["0%", "100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  const sunRayVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 3,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle>Météo Émotionnelle</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className={`rounded-lg p-4 relative overflow-hidden ${getWeatherBackground()}`}>
          {/* Weather animation elements */}
          <div className="absolute inset-0 z-0">
            {weather === 'sunny' && (
              <>
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-warning/50 rounded-full opacity-30"
                  variants={sunRayVariants}
                  animate="animate"
                ></motion.div>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={`ray-${i}`}
                    className="sun-ray absolute left-1/2 top-1/2 bg-warning/70 h-12 w-1"
                    style={{
                      transformOrigin: "bottom center",
                      transform: `rotate(${i * 45}deg) translateY(-20px)`,
                    }}
                    variants={sunRayVariants}
                    animate="animate"
                  ></motion.div>
                ))}
              </>
            )}
            
            {(weather === 'cloudy' || weather === 'mixed') && (
              <>
                <motion.div
                  className="cloud absolute w-12 h-6 rounded-full top-1/4 opacity-60"
                  variants={cloudVariants}
                  animate="animate"
                  style={{ left: "-5%" }}
                ></motion.div>
                <motion.div
                  className="cloud absolute w-20 h-10 rounded-full top-1/3 opacity-40"
                  variants={cloudVariants}
                  animate="animate"
                  style={{ left: "-15%", animationDelay: "3s" }}
                ></motion.div>
              </>
            )}
            
            {(weather === 'rainy' || weather === 'stormy') && (
              <>
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={`rain-${i}`}
                    className="rain absolute w-0.5 h-3 rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `-10px`,
                      animationDelay: `${Math.random() * 2}s`,
                    }}
                  ></motion.div>
                ))}
              </>
            )}
          </div>
          
          {/* Weather content */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium">{getWeatherDescription()}</p>
              <p className="text-3xl font-bold mt-1">{score}%</p>
              <div className="flex items-center mt-1">
                {trend === 'up' ? (
                  <span className="text-sm text-success flex items-center">
                    ↑ +4% par rapport à hier
                  </span>
                ) : trend === 'down' ? (
                  <span className="text-sm text-destructive flex items-center">
                    ↓ -3% par rapport à hier
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground flex items-center">
                    → Stable par rapport à hier
                  </span>
                )}
              </div>
            </div>
            
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              className="weather-icon-container p-2"
            >
              {getWeatherIcon()}
            </motion.div>
          </div>
          
          <div className="relative z-10 mt-3 text-xs text-muted-foreground">
            <p>Mise à jour il y a 25 minutes</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalWeatherWidget;
