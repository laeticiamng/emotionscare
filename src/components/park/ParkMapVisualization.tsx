/**
 * Visualisation Interactive de la Carte du Parc Émotionnel
 * Affiche une vue spatiale et interconnectée des zones du parc
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ZonePosition {
  name: string;
  emoji: string;
  color: string;
  x: number;
  y: number;
  attractions: number;
  completed: number;
}

interface ParkMapVisualizationProps {
  zones: ZonePosition[];
  selectedZone?: string;
  onZoneClick?: (zoneKey: string) => void;
  completionData?: Record<string, { visited: number; total: number }>;
}

export const ParkMapVisualization: React.FC<ParkMapVisualizationProps> = ({
  zones,
  selectedZone,
  onZoneClick,
  completionData
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-8"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5 border-2 border-border/50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <h3 className="font-bold text-lg flex items-center gap-2">
            🗺️ Carte du Parc Émotionnel
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* SVG Map */}
        <div className={`relative ${isExpanded ? 'h-96' : 'h-64'} overflow-hidden p-4`}>
          <svg
            className="w-full h-full"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background */}
            <defs>
              <linearGradient id="parkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#667eea" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#764ba2" stopOpacity="0.1" />
              </linearGradient>

              {/* Glow filters */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Base background */}
            <rect width="800" height="600" fill="url(#parkGradient)" />

            {/* Connection lines between zones */}
            {zones.map((zone, index) => {
              if (index < zones.length - 1) {
                const nextZone = zones[index + 1];
                return (
                  <motion.line
                    key={`connection-${index}`}
                    x1={zone.x}
                    y1={zone.y}
                    x2={nextZone.x}
                    y2={nextZone.y}
                    stroke="#667eea"
                    strokeWidth="2"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                );
              }
              return null;
            })}

            {/* Zones */}
            {zones.map((zone) => {
              const data = completionData?.[zone.name] || { visited: 0, total: 0 };
              const progress = data.total > 0 ? (data.visited / data.total) * 100 : 0;
              const isSelected = selectedZone === zone.name;
              const isHovered = hoveredZone === zone.name;

              return (
                <g
                  key={zone.name}
                  onClick={() => onZoneClick?.(zone.name)}
                  className="cursor-pointer"
                >
                  {/* Zone circle background */}
                  <motion.circle
                    cx={zone.x}
                    cy={zone.y}
                    r={isHovered || isSelected ? 55 : 45}
                    fill={zone.color}
                    opacity={isHovered || isSelected ? 0.3 : 0.15}
                    animate={{
                      r: isHovered || isSelected ? 55 : 45,
                      opacity: isHovered || isSelected ? 0.3 : 0.15
                    }}
                    transition={{ duration: 0.2 }}
                  />

                  {/* Progress ring */}
                  <motion.circle
                    cx={zone.x}
                    cy={zone.y}
                    r={40}
                    fill="none"
                    stroke={zone.color}
                    strokeWidth="3"
                    strokeDasharray={`${(251.2 * progress) / 100} 251.2`}
                    opacity="0.6"
                    style={{ transform: `rotate(-90deg)`, transformOrigin: `${zone.x}px ${zone.y}px` }}
                  />

                  {/* Border ring */}
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r={40}
                    fill="none"
                    stroke={isHovered || isSelected ? zone.color : '#666'}
                    strokeWidth={isHovered || isSelected ? 2.5 : 1.5}
                    opacity={isHovered || isSelected ? 1 : 0.5}
                  />

                  {/* Emoji */}
                  <text
                    x={zone.x}
                    y={zone.y}
                    textAnchor="middle"
                    dy="0.3em"
                    fontSize="28"
                    className="pointer-events-none"
                  >
                    {zone.emoji}
                  </text>

                  {/* Hover label */}
                  {(isHovered || isSelected) && (
                    <foreignObject x={zone.x - 60} y={zone.y - 80} width="120" height="70">
                      <div className="bg-black/80 text-white text-xs p-2 rounded-lg text-center backdrop-blur-sm">
                        <p className="font-bold">{zone.name}</p>
                        <p className="text-xs opacity-80">
                          {data.visited}/{data.total}
                        </p>
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="px-4 py-3 border-t border-border/50 bg-background/50">
          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <Info className="h-3 w-3" />
              <span>Survolez les zones pour voir la progression</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary/60" />
              <span>Zone non complétée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Zone complétée</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ParkMapVisualization;
