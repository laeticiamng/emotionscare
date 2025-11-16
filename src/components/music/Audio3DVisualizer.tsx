/**
 * Audio 3D Visualizer - Visualisations audio 3D avancées
 * Particules, ondes, spectre, géométries
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Music,
  BarChart3,
  Activity,
  Zap,
  Sparkles,
  Volume2,
} from 'lucide-react';

interface Audio3DVisualizerProps {
  isPlaying?: boolean;
  frequency?: number[];
  waveform?: number[];
  trackTitle?: string;
  trackArtist?: string;
  trackMood?: string;
  trackColor?: string;
}

type VisualizationType = 'bars' | 'wave' | 'particles' | 'spectrum' | 'circular';

export const Audio3DVisualizer: React.FC<Audio3DVisualizerProps> = ({
  isPlaying = false,
  frequency = Array(64)
    .fill(0)
    .map(() => Math.random() * 100),
  waveform = Array(100)
    .fill(0)
    .map(() => Math.sin(Math.random() * Math.PI) * 50 + 50),
  trackTitle = 'Titre inconnu',
  trackArtist = 'Artiste inconnu',
  trackMood = 'Neutre',
  trackColor = '#3b82f6',
}) => {
  const [vizType, setVizType] = useState<VisualizationType>('bars');
  const [animationData, setAnimationData] = useState(frequency);

  // Simulate audio data updates
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setAnimationData((prev) =>
        prev.map((val) => {
          const change = (Math.random() - 0.5) * 50;
          const newVal = Math.max(0, Math.min(100, val + change));
          return newVal;
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Bar Chart Visualizer
  const renderBars = () => (
    <div className="flex items-end justify-center gap-1 h-48 p-4 bg-gradient-to-t from-accent/20 to-transparent rounded-lg">
      {animationData.slice(0, 32).map((val, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${val * 2}px` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="flex-1 rounded-t bg-gradient-to-t from-accent via-purple-500 to-pink-500 origin-bottom"
          style={{
            opacity: isPlaying ? 0.8 : 0.3,
            filter: isPlaying
              ? `drop-shadow(0 0 ${val / 10}px ${trackColor})`
              : 'none',
          }}
        />
      ))}
    </div>
  );

  // Waveform Visualizer
  const renderWave = () => {
    const points = waveform.map((val, i) => {
      const x = (i / waveform.length) * 400;
      const y = 100 - (val / 100) * 80;
      return `${x},${y}`;
    });

    return (
      <div className="w-full h-48 bg-gradient-to-b from-background via-accent/10 to-background rounded-lg flex items-center justify-center p-4">
        <svg
          viewBox="0 0 400 200"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={trackColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={trackColor} stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Wave line */}
          <motion.polyline
            points={points.join(' ')}
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            animate={
              isPlaying
                ? {
                    strokeDashoffset: [0, 400],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
            strokeDasharray={400}
          />

          {/* Fill under curve */}
          <motion.polygon
            points={`0,200 ${points.join(' ')} 400,200`}
            fill="url(#waveGradient)"
            opacity={isPlaying ? 0.3 : 0.1}
          />
        </svg>
      </div>
    );
  };

  // Particle Visualizer
  const renderParticles = () => (
    <div className="relative w-full h-48 bg-gradient-to-br from-background via-accent/10 to-background rounded-lg overflow-hidden">
      {/* Background circles */}
      <motion.div
        className="absolute inset-0"
        animate={
          isPlaying
            ? {
                background: [
                  `radial-gradient(circle at 20% 50%, ${trackColor}20 0%, transparent 50%)`,
                  `radial-gradient(circle at 80% 50%, ${trackColor}20 0%, transparent 50%)`,
                  `radial-gradient(circle at 20% 50%, ${trackColor}20 0%, transparent 50%)`,
                ],
              }
            : {}
        }
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* Particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            backgroundColor: trackColor,
            left: `${(i * 100) / 12}%`,
            top: '50%',
          }}
          animate={
            isPlaying
              ? {
                  y: [0, -50, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }
              : { y: 0, opacity: 0 }
          }
          transition={{
            duration: 2,
            delay: i * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );

  // Spectrum Visualizer (Circular)
  const renderSpectrum = () => {
    const radius = 60;
    const points = animationData.slice(0, 16).map((val, i) => {
      const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
      const distance = (val / 100) * radius + 20;
      const x = 100 + Math.cos(angle) * distance;
      const y = 100 + Math.sin(angle) * distance;
      return `${x},${y}`;
    });

    return (
      <div className="w-full h-48 bg-gradient-to-br from-background via-accent/10 to-background rounded-lg flex items-center justify-center p-4">
        <svg viewBox="0 0 200 200" className="w-32 h-32">
          <defs>
            <radialGradient id="specGradient">
              <stop offset="0%" stopColor={trackColor} stopOpacity="0.8" />
              <stop offset="100%" stopColor={trackColor} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Center circle */}
          <circle cx="100" cy="100" r="15" fill={trackColor} opacity="0.5" />

          {/* Spectrum circle */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="url(#specGradient)"
            strokeWidth="1"
            opacity="0.3"
          />

          {/* Data points */}
          {animationData.slice(0, 16).map((val, i) => {
            const angle = (i / 16) * Math.PI * 2 - Math.PI / 2;
            const distance = (val / 100) * radius + 20;
            const x = 100 + Math.cos(angle) * distance;
            const y = 100 + Math.sin(angle) * distance;

            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                fill={trackColor}
                animate={
                  isPlaying ? { r: [2, 4, 2] } : {}
                }
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                }}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  // Circular Radial Visualizer
  const renderCircular = () => (
    <div className="w-full h-48 bg-gradient-to-br from-background via-accent/10 to-background rounded-lg flex items-center justify-center p-4">
      <div className="relative w-40 h-40">
        {/* Concentric circles */}
        {[1, 2, 3, 4, 5].map((ring) => (
          <motion.div
            key={ring}
            className="absolute inset-0 rounded-full border"
            style={{
              borderColor: trackColor,
              borderWidth: 1,
              opacity: 0.3 + ring * 0.1,
            }}
            animate={
              isPlaying
                ? { scale: [1, 1.2, 1] }
                : {}
            }
            transition={{
              duration: 2 + ring * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Center pulsing circle */}
        <motion.div
          className="absolute inset-1/3 rounded-full"
          style={{ backgroundColor: trackColor }}
          animate={
            isPlaying
              ? { scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }
              : { scale: 1, opacity: 0.3 }
          }
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );

  // Render selected visualizer
  const renderVisualizer = () => {
    switch (vizType) {
      case 'bars':
        return renderBars();
      case 'wave':
        return renderWave();
      case 'particles':
        return renderParticles();
      case 'spectrum':
        return renderSpectrum();
      case 'circular':
        return renderCircular();
      default:
        return renderBars();
    }
  };

  const vizOptions: Array<{
    id: VisualizationType;
    label: string;
    icon: React.ReactNode;
  }> = [
    { id: 'bars', label: 'Barres', icon: <BarChart3 className="h-4 w-4" /> },
    { id: 'wave', label: 'Onde', icon: <Activity className="h-4 w-4" /> },
    { id: 'particles', label: 'Particules', icon: <Sparkles className="h-4 w-4" /> },
    { id: 'spectrum', label: 'Spectre', icon: <Zap className="h-4 w-4" /> },
    { id: 'circular', label: 'Circulaire', icon: <Volume2 className="h-4 w-4" /> },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              Visualiseur 3D
            </CardTitle>
            {isPlaying && (
              <motion.span
                className="inline-flex gap-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-green-600">En direct</span>
              </motion.span>
            )}
          </div>

          {/* Track Info */}
          <div className="space-y-1">
            <p className="text-sm font-medium truncate">{trackTitle}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{trackArtist}</span>
              <Badge
                variant="secondary"
                className="text-xs"
                style={{
                  backgroundColor: `${trackColor}20`,
                  color: trackColor,
                }}
              >
                {trackMood}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Visualizer Display */}
        {renderVisualizer()}

        {/* Visualizer Selector */}
        <div className="grid grid-cols-5 gap-2">
          {vizOptions.map((option) => (
            <motion.button
              key={option.id}
              onClick={() => setVizType(option.id)}
              className={`p-2 rounded-lg border transition-all flex flex-col items-center gap-1 ${
                vizType === option.id
                  ? 'bg-accent border-accent text-accent-foreground'
                  : 'bg-muted/30 border-muted hover:bg-muted/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option.icon}
              <span className="text-xs font-medium text-center">
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Info */}
        <div className="p-3 rounded-lg bg-accent/5 border border-accent/20 text-xs text-muted-foreground space-y-1">
          <p>💡 <strong>Astuce:</strong> Les visualisations changent en temps réel selon la musique</p>
          <p>⚙️ <strong>Performance:</strong> Optimisées pour tous les appareils</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Audio3DVisualizer;
