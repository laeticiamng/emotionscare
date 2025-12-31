/**
 * CoachEmotionDisplay - Affichage visuel de l'émotion détectée
 */

import { memo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Smile, 
  Frown, 
  Meh, 
  Zap, 
  Heart, 
  Cloud,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

interface CoachEmotionDisplayProps {
  emotion?: string | null;
  confidence?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const emotionConfig: Record<string, {
  icon: typeof Smile;
  label: string;
  color: string;
  bgColor: string;
}> = {
  joie: {
    icon: Sun,
    label: 'Joyeux',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
  },
  happy: {
    icon: Smile,
    label: 'Heureux',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30'
  },
  tristesse: {
    icon: Frown,
    label: 'Triste',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30'
  },
  sad: {
    icon: Cloud,
    label: 'Mélancolique',
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-100 dark:bg-slate-800/50'
  },
  colère: {
    icon: Zap,
    label: 'En colère',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30'
  },
  angry: {
    icon: Zap,
    label: 'Frustré',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30'
  },
  peur: {
    icon: Moon,
    label: 'Anxieux',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30'
  },
  anxious: {
    icon: Moon,
    label: 'Inquiet',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30'
  },
  stress: {
    icon: Zap,
    label: 'Stressé',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30'
  },
  calm: {
    icon: Heart,
    label: 'Serein',
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-100 dark:bg-teal-900/30'
  },
  neutre: {
    icon: Meh,
    label: 'Neutre',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800/50'
  },
  neutral: {
    icon: Meh,
    label: 'Équilibré',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-800/50'
  },
  supportive: {
    icon: Heart,
    label: 'Soutenu',
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30'
  },
  encouraging: {
    icon: Sparkles,
    label: 'Encouragé',
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30'
  },
  energizing: {
    icon: Zap,
    label: 'Énergisé',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30'
  }
};

const sizeConfig = {
  sm: {
    icon: 'h-3 w-3',
    text: 'text-xs',
    padding: 'px-2 py-0.5'
  },
  md: {
    icon: 'h-4 w-4',
    text: 'text-sm',
    padding: 'px-2.5 py-1'
  },
  lg: {
    icon: 'h-5 w-5',
    text: 'text-base',
    padding: 'px-3 py-1.5'
  }
};

export const CoachEmotionDisplay = memo(function CoachEmotionDisplay({
  emotion,
  confidence,
  className,
  showLabel = true,
  size = 'md'
}: CoachEmotionDisplayProps) {
  if (!emotion) return null;

  const normalizedEmotion = emotion.toLowerCase();
  const config = emotionConfig[normalizedEmotion] || emotionConfig.neutral;
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        'inline-flex items-center gap-1.5 border-0 font-medium transition-all',
        config.bgColor,
        config.color,
        sizeStyles.padding,
        className
      )}
    >
      <Icon className={cn(sizeStyles.icon, 'shrink-0')} />
      {showLabel && (
        <span className={sizeStyles.text}>{config.label}</span>
      )}
      {confidence !== undefined && confidence > 0 && (
        <span className={cn(sizeStyles.text, 'opacity-60')}>
          {Math.round(confidence * 100)}%
        </span>
      )}
    </Badge>
  );
});
