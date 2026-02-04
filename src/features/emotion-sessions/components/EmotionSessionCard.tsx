/**
 * EmotionSessionCard - Carte de session émotionnelle
 * Affiche un résumé visuel d'une session d'analyse
 */

import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  Mic, 
  Camera, 
  FileText, 
  Watch,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { EmotionSession, EmotionScores } from '../index';

interface EmotionSessionCardProps {
  session: EmotionSession;
  onView?: (session: EmotionSession) => void;
  onDelete?: (sessionId: string) => void;
  onShare?: (session: EmotionSession) => void;
  showTrend?: boolean;
  previousScores?: EmotionScores;
}

const EMOTION_COLORS: Record<string, { bg: string; text: string; emoji: string }> = {
  joy: { bg: 'bg-chart-1/20', text: 'text-chart-1', emoji: '😊' },
  sadness: { bg: 'bg-chart-2/20', text: 'text-chart-2', emoji: '😢' },
  anger: { bg: 'bg-destructive/20', text: 'text-destructive', emoji: '😠' },
  fear: { bg: 'bg-chart-4/20', text: 'text-chart-4', emoji: '😨' },
  surprise: { bg: 'bg-chart-5/20', text: 'text-chart-5', emoji: '😲' },
  disgust: { bg: 'bg-chart-3/20', text: 'text-chart-3', emoji: '🤢' },
  neutral: { bg: 'bg-muted', text: 'text-muted-foreground', emoji: '😐' },
};

const SOURCE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  camera: Camera,
  voice: Mic,
  text: FileText,
  manual: Brain,
  wearable: Watch,
};

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (diffDays === 1) {
    return `Hier à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  }
  if (diffDays < 7) {
    return date.toLocaleDateString('fr-FR', { weekday: 'long', hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

export const EmotionSessionCard = memo<EmotionSessionCardProps>(({
  session,
  onView,
  onDelete,
  onShare,
  showTrend = false,
  previousScores
}) => {
  const emotionConfig = EMOTION_COLORS[session.primary_emotion] || EMOTION_COLORS.neutral;
  const SourceIcon = SOURCE_ICONS[session.source] || Brain;

  // Calculer le score dominant
  const dominantScore = session.emotion_scores[session.primary_emotion] || 0;

  // Calculer la tendance
  const getTrend = () => {
    if (!showTrend || !previousScores) return null;
    const currentJoy = session.emotion_scores.joy || 0;
    const previousJoy = previousScores.joy || 0;
    const diff = currentJoy - previousJoy;
    
    if (diff > 5) return { direction: 'up', value: Math.round(diff) };
    if (diff < -5) return { direction: 'down', value: Math.abs(Math.round(diff)) };
    return { direction: 'stable', value: 0 };
  };

  const trend = getTrend();

  // Top 3 émotions
  const topEmotions = Object.entries(session.emotion_scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <Card 
      className={`
        overflow-hidden transition-all hover:shadow-md cursor-pointer
        border-l-4 ${emotionConfig.bg}
      `}
      onClick={() => onView?.(session)}
      role="article"
      aria-label={`Session du ${formatDate(session.started_at)} - Émotion: ${session.primary_emotion}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          {/* En-tête avec émotion principale */}
          <div className="flex items-center gap-3">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center text-2xl
              ${emotionConfig.bg}
            `}>
              {emotionConfig.emoji}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-semibold capitalize ${emotionConfig.text}`}>
                  {session.primary_emotion}
                </span>
                <Badge variant="outline" className="text-xs">
                  {Math.round(dominantScore)}%
                </Badge>
                {trend && (
                  <span className={`
                    flex items-center gap-0.5 text-xs
                    ${trend.direction === 'up' ? 'text-green-600' : 
                      trend.direction === 'down' ? 'text-destructive' : 'text-muted-foreground'}
                  `}>
                    {trend.direction === 'up' && <TrendingUp className="h-3 w-3" />}
                    {trend.direction === 'down' && <TrendingDown className="h-3 w-3" />}
                    {trend.direction === 'stable' && <Minus className="h-3 w-3" />}
                    {trend.value > 0 && `${trend.value}%`}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Clock className="h-3 w-3" />
                <span>{formatDate(session.started_at)}</span>
                {session.duration_seconds && (
                  <>
                    <span>•</span>
                    <span>{formatDuration(session.duration_seconds)}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs flex items-center gap-1">
              <SourceIcon className="h-3 w-3" />
              {session.source}
            </Badge>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onView?.(session); }}>
                  Voir détails
                </DropdownMenuItem>
                {onShare && (
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onShare(session); }}>
                    Partager
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
                  >
                    Supprimer
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Distribution des émotions */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Distribution émotionnelle</span>
          </div>
          <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-muted">
            {topEmotions.map(([emotion, score], index) => {
              const config = EMOTION_COLORS[emotion] || EMOTION_COLORS.neutral;
              return (
                <div
                  key={emotion}
                  className={`transition-all ${config.bg}`}
                  style={{ 
                    width: `${score}%`,
                    opacity: 1 - (index * 0.2)
                  }}
                  title={`${emotion}: ${Math.round(score)}%`}
                />
              );
            })}
          </div>
          <div className="flex gap-3 text-xs">
            {topEmotions.map(([emotion, score]) => (
              <span 
                key={emotion} 
                className={`flex items-center gap-1 ${EMOTION_COLORS[emotion]?.text || ''}`}
              >
                <span>{EMOTION_COLORS[emotion]?.emoji}</span>
                <span className="capitalize">{emotion}</span>
                <span className="text-muted-foreground">({Math.round(score)}%)</span>
              </span>
            ))}
          </div>
        </div>

        {/* Contexte/triggers */}
        {session.triggers && session.triggers.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {session.triggers.slice(0, 3).map((trigger, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {trigger}
              </Badge>
            ))}
            {session.triggers.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{session.triggers.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

EmotionSessionCard.displayName = 'EmotionSessionCard';

export default EmotionSessionCard;
