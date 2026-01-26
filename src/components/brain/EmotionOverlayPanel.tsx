/**
 * EmotionOverlayPanel - Panneau d'affichage des émotions Hume AI
 * Affiche les émotions détectées et leur mapping cérébral
 */

import React, { memo, useMemo } from 'react';
import { 
  Heart, 
  Frown, 
  Smile, 
  Zap, 
  AlertTriangle,
  Sparkles,
  TrendingUp,
  Clock,
  RefreshCw,
  Play,
  Pause,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { EmotionRegionMap, AALRegion } from './types';
import { AAL_REGIONS, EMOTION_BRAIN_MAPPING } from './types';

// ============================================================================
// Types
// ============================================================================

interface EmotionOverlayPanelProps {
  emotions: EmotionRegionMap;
  dominantEmotion?: string;
  overallIntensity?: number;
  timestamp?: string;
  isRealtime?: boolean;
  isPlaying?: boolean;
  onToggleRealtime?: () => void;
  onRefresh?: () => void;
  onRegionClick?: (regionCode: string) => void;
  selectedRegion?: string | null;
}

interface EmotionDisplayData {
  key: string;
  label: string;
  intensity: number;
  color: string;
  regions: string[];
  icon: React.ReactNode;
}

// ============================================================================
// Helpers
// ============================================================================

const EMOTION_ICONS: Record<string, React.ReactNode> = {
  joy: <Smile className="h-4 w-4" />,
  happiness: <Smile className="h-4 w-4" />,
  sadness: <Frown className="h-4 w-4" />,
  anger: <Zap className="h-4 w-4" />,
  fear: <AlertTriangle className="h-4 w-4" />,
  anxiety: <AlertTriangle className="h-4 w-4" />,
  surprise: <Sparkles className="h-4 w-4" />,
  disgust: <Frown className="h-4 w-4" />,
  contempt: <Frown className="h-4 w-4" />,
};

const EMOTION_LABELS: Record<string, string> = {
  joy: 'Joie',
  happiness: 'Bonheur',
  sadness: 'Tristesse',
  anger: 'Colère',
  fear: 'Peur',
  anxiety: 'Anxiété',
  surprise: 'Surprise',
  disgust: 'Dégoût',
  contempt: 'Mépris',
};

function formatTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  } catch {
    return '--:--:--';
  }
}

// ============================================================================
// Composant EmotionBar
// ============================================================================

const EmotionBar = memo<{
  emotion: EmotionDisplayData;
  isSelected?: boolean;
  onClick?: () => void;
}>(({ emotion, isSelected, onClick }) => (
  <div
    className={`p-3 rounded-lg border transition-all cursor-pointer ${
      isSelected 
        ? 'border-primary bg-primary/10' 
        : 'border-border hover:border-primary/50 bg-card'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-3">
      <div 
        className="p-2 rounded-full"
        style={{ backgroundColor: `${emotion.color}20`, color: emotion.color }}
      >
        {emotion.icon}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium text-sm text-foreground">
            {emotion.label}
          </span>
          <span className="text-sm font-bold" style={{ color: emotion.color }}>
            {Math.round(emotion.intensity * 100)}%
          </span>
        </div>
        <Progress 
          value={emotion.intensity * 100} 
          className="h-2"
          style={{ 
            // @ts-ignore - custom CSS property
            '--progress-foreground': emotion.color 
          }}
        />
      </div>
    </div>
    
    {/* Régions associées */}
    <div className="mt-2 flex flex-wrap gap-1">
      {emotion.regions.slice(0, 3).map((region) => (
        <Badge 
          key={region} 
          variant="secondary" 
          className="text-xs"
        >
          {region}
        </Badge>
      ))}
      {emotion.regions.length > 3 && (
        <Badge variant="outline" className="text-xs">
          +{emotion.regions.length - 3}
        </Badge>
      )}
    </div>
  </div>
));

EmotionBar.displayName = 'EmotionBar';

// ============================================================================
// Composant Principal
// ============================================================================

export const EmotionOverlayPanel: React.FC<EmotionOverlayPanelProps> = memo(({
  emotions,
  dominantEmotion,
  overallIntensity = 0,
  timestamp,
  isRealtime = false,
  isPlaying = false,
  onToggleRealtime,
  onRefresh,
  onRegionClick,
  selectedRegion,
}) => {
  // Transformer les émotions pour l'affichage
  const emotionsList = useMemo<EmotionDisplayData[]>(() => {
    return Object.entries(emotions)
      .filter(([, data]) => data && data.intensity > 0)
      .map(([key, data]) => ({
        key,
        label: EMOTION_LABELS[key] || key.charAt(0).toUpperCase() + key.slice(1),
        intensity: data!.intensity,
        color: data!.color,
        regions: EMOTION_BRAIN_MAPPING[key]?.regions || [],
        icon: EMOTION_ICONS[key] || <Heart className="h-4 w-4" />,
      }))
      .sort((a, b) => b.intensity - a.intensity);
  }, [emotions]);

  // Régions affectées par l'émotion sélectionnée
  const affectedRegions = useMemo(() => {
    const regions = new Set<string>();
    emotionsList.forEach((emotion) => {
      emotion.regions.forEach((r) => regions.add(r));
    });
    return Array.from(regions);
  }, [emotionsList]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="py-3 px-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Overlay Émotionnel</CardTitle>
          </div>
          
          <div className="flex items-center gap-2">
            {isRealtime && (
              <Badge 
                variant={isPlaying ? 'default' : 'secondary'}
                className="gap-1"
              >
                {isPlaying ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    Live
                  </>
                ) : (
                  'Pause'
                )}
              </Badge>
            )}
            
            {timestamp && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTimestamp(timestamp)}
              </span>
            )}
          </div>
        </div>
      </CardHeader>

      <Separator />

      {/* Contrôles temps réel */}
      {onToggleRealtime && (
        <div className="px-4 py-2 flex gap-2 border-b border-border">
          <Button
            variant={isPlaying ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleRealtime}
            className="flex-1 gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Temps réel
              </>
            )}
          </Button>
          
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isPlaying}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Résumé */}
      {emotionsList.length > 0 && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Émotion dominante</span>
            <Badge 
              className="gap-1"
              style={{ 
                backgroundColor: emotionsList[0]?.color + '20',
                color: emotionsList[0]?.color,
                borderColor: emotionsList[0]?.color,
              }}
            >
              {emotionsList[0]?.icon}
              {emotionsList[0]?.label}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Intensité globale</span>
            <div className="flex items-center gap-2">
              <Progress value={overallIntensity * 100} className="w-20 h-2" />
              <span className="text-sm font-medium">
                {Math.round(overallIntensity * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Liste des émotions */}
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {emotionsList.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Aucune émotion détectée</p>
                <p className="text-xs mt-1">
                  Activez le mode temps réel ou importez des données Hume AI
                </p>
              </div>
            ) : (
              emotionsList.map((emotion) => (
                <EmotionBar
                  key={emotion.key}
                  emotion={emotion}
                  isSelected={emotion.regions.some(r => 
                    AAL_REGIONS.some(aal => 
                      aal.code === selectedRegion && 
                      (aal.name.includes(r) || aal.code.includes(r))
                    )
                  )}
                  onClick={() => {
                    // Sélectionner la première région associée
                    const firstRegion = emotion.regions[0];
                    const aalRegion = AAL_REGIONS.find(r => 
                      r.name.includes(firstRegion) || r.code.includes(firstRegion)
                    );
                    if (aalRegion && onRegionClick) {
                      onRegionClick(aalRegion.code);
                    }
                  }}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>

      {/* Footer avec régions */}
      {affectedRegions.length > 0 && (
        <div className="px-4 py-3 border-t border-border bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              Régions cérébrales impliquées
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {affectedRegions.slice(0, 6).map((region) => (
              <Badge 
                key={region} 
                variant="outline" 
                className="text-xs cursor-pointer hover:bg-primary/10"
                onClick={() => {
                  const aalRegion = AAL_REGIONS.find(r => 
                    r.name.includes(region) || r.code.includes(region)
                  );
                  if (aalRegion && onRegionClick) {
                    onRegionClick(aalRegion.code);
                  }
                }}
              >
                {region}
              </Badge>
            ))}
            {affectedRegions.length > 6 && (
              <Badge variant="secondary" className="text-xs">
                +{affectedRegions.length - 6}
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
});

EmotionOverlayPanel.displayName = 'EmotionOverlayPanel';

export default EmotionOverlayPanel;
