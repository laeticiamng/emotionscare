/**
 * EmotionWheel - Visualisation de la roue des émotions
 * Affiche le profil émotionnel détecté avec couleurs
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface EmotionData {
  emotion: string;
  label: string;
  value: number; // 0-100
  color: string;
  emoji: string;
}

interface EmotionWheelProps {
  emotions: EmotionData[];
  dominantEmotion?: string;
  className?: string;
}

const EMOTION_COLORS: Record<string, string> = {
  serene: '#4ade80', // green
  stressed: '#f97316', // orange
  sad: '#60a5fa', // blue
  angry: '#ef4444', // red
  anxious: '#a855f7', // purple
  joyful: '#fbbf24', // yellow
  tired: '#94a3b8', // gray
  neutral: '#64748b', // slate
};

const EMOTION_LABELS: Record<string, string> = {
  serene: 'Sérénité',
  stressed: 'Stress',
  sad: 'Tristesse',
  angry: 'Colère',
  anxious: 'Anxiété',
  joyful: 'Joie',
  tired: 'Fatigue',
  neutral: 'Neutralité',
};

const EMOTION_EMOJIS: Record<string, string> = {
  serene: '😌',
  stressed: '😰',
  sad: '😢',
  angry: '😠',
  anxious: '😟',
  joyful: '😊',
  tired: '😴',
  neutral: '😐',
};

export const EmotionWheel: React.FC<EmotionWheelProps> = ({
  emotions,
  dominantEmotion,
  className,
}) => {
  const radius = 120;
  const centerX = 150;
  const centerY = 150;

  // Calculer les positions des segments
  const totalValue = emotions.reduce((sum, e) => sum + e.value, 0) || 1;
  let currentAngle = -90; // Commencer en haut

  const segments = emotions.map((emotion) => {
    const percentage = emotion.value / totalValue;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    // Calculer les coordonnées de l'arc
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = `
      M ${centerX} ${centerY}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      Z
    `;

    // Position du label
    const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
    const labelRadius = radius * 0.65;
    const labelX = centerX + labelRadius * Math.cos(midAngle);
    const labelY = centerY + labelRadius * Math.sin(midAngle);

    return {
      ...emotion,
      pathData,
      labelX,
      labelY,
      percentage,
    };
  });

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg viewBox="0 0 300 300" className="w-64 h-64 md:w-80 md:h-80">
        {/* Fond */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius + 5}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted/20"
        />

        {/* Segments */}
        {segments.map((segment, index) => (
          <motion.path
            key={segment.emotion}
            d={segment.pathData}
            fill={segment.color}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.85, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={cn(
              'transition-all cursor-pointer',
              segment.emotion === dominantEmotion && 'opacity-100'
            )}
            style={{
              filter: segment.emotion === dominantEmotion ? 'brightness(1.1)' : undefined,
            }}
          />
        ))}

        {/* Cercle central */}
        <motion.circle
          cx={centerX}
          cy={centerY}
          r={40}
          fill="hsl(var(--background))"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        />

        {/* Emoji central (émotion dominante) */}
        {dominantEmotion && (
          <motion.text
            x={centerX}
            y={centerY + 8}
            textAnchor="middle"
            fontSize="32"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
          >
            {EMOTION_EMOJIS[dominantEmotion] || '🎯'}
          </motion.text>
        )}
      </svg>

      {/* Légende */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 w-full max-w-md">
        {segments.filter(s => s.percentage > 0.05).map((segment) => (
          <motion.div
            key={segment.emotion}
            className={cn(
              'flex items-center gap-2 p-2 rounded-lg text-sm',
              segment.emotion === dominantEmotion && 'bg-muted font-semibold'
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: segment.color }}
            />
            <span className="truncate">
              {segment.emoji} {segment.label}
            </span>
            <span className="text-muted-foreground ml-auto">
              {Math.round(segment.percentage * 100)}%
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Helper pour convertir les réponses en données d'émotions
export const calculateEmotionData = (
  emotionalStates: string[],
  scores: { physical: number; energy: number; sleep: number; tension: number; thoughts: number; support: number }
): EmotionData[] => {
  const baseEmotions: Record<string, number> = {
    serene: 0,
    stressed: 0,
    sad: 0,
    angry: 0,
    anxious: 0,
    joyful: 0,
    tired: 0,
    neutral: 0,
  };

  // Ajouter les émotions sélectionnées directement
  emotionalStates.forEach((emotion) => {
    if (baseEmotions[emotion] !== undefined) {
      baseEmotions[emotion] += 40;
    }
  });

  // Ajuster selon les scores
  if (scores.energy <= 3) baseEmotions.tired += 20;
  if (scores.tension >= 7) baseEmotions.stressed += 15;
  if (scores.thoughts >= 7) {
    baseEmotions.anxious += 15;
    baseEmotions.sad += 10;
  }
  if (scores.support >= 7 && scores.physical >= 7) baseEmotions.serene += 15;
  if (scores.sleep >= 7 && scores.energy >= 7) baseEmotions.joyful += 15;

  // Si aucune émotion forte, ajouter du neutre
  const total = Object.values(baseEmotions).reduce((a, b) => a + b, 0);
  if (total < 20) baseEmotions.neutral = 50;

  // Convertir en tableau avec normalisation
  const maxValue = Math.max(...Object.values(baseEmotions), 1);
  
  return Object.entries(baseEmotions)
    .filter(([, value]) => value > 0)
    .map(([emotion, value]) => ({
      emotion,
      label: EMOTION_LABELS[emotion],
      value: (value / maxValue) * 100,
      color: EMOTION_COLORS[emotion],
      emoji: EMOTION_EMOJIS[emotion],
    }))
    .sort((a, b) => b.value - a.value);
};

export default EmotionWheel;
