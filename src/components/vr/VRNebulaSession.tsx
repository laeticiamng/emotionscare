import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Heart, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VRNebulaSessionProps {
  id: string;
  tsStart: string;
  tsEnd?: string;
  hrvPre?: number;
  hrvPost?: number;
  rmssdDelta?: number;
  respRateAvg?: number;
  coherenceScore?: number;
  durationMin?: number;
  className?: string;
}

/**
 * Affiche une session VR Nebula avec métriques HRV et cohérence cardiaque
 */
export const VRNebulaSession: React.FC<VRNebulaSessionProps> = ({
  tsStart,
  hrvPre,
  hrvPost,
  rmssdDelta,
  respRateAvg,
  coherenceScore,
  durationMin,
  className = '',
}) => {
  const startDate = new Date(tsStart);
  const formattedDate = format(startDate, "d MMMM yyyy 'à' HH:mm", { locale: fr });
  
  const getCoherenceLevel = (score?: number) => {
    if (!score) return { label: 'Non disponible', color: 'bg-muted text-muted-foreground' };
    if (score >= 80) return { label: 'Excellente', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    if (score >= 60) return { label: 'Bonne', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    if (score >= 40) return { label: 'Modérée', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    return { label: 'Faible', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' };
  };

  const coherenceLevel = getCoherenceLevel(coherenceScore);

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Session Nebula</span>
          </CardTitle>
          <Badge variant="secondary" className={coherenceLevel.color}>
            {coherenceLevel.label}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={tsStart}>{formattedDate}</time>
          {durationMin && (
            <>
              <span aria-hidden="true">•</span>
              <span>{durationMin} min</span>
            </>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* HRV Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              <p className="text-xs font-medium text-muted-foreground">HRV Avant</p>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {hrvPre ? `${hrvPre.toFixed(1)} ms` : 'N/A'}
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
              <p className="text-xs font-medium text-muted-foreground">HRV Après</p>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {hrvPost ? `${hrvPost.toFixed(1)} ms` : 'N/A'}
            </p>
          </div>
        </div>

        {/* Delta & Coherence */}
        {rmssdDelta !== undefined && rmssdDelta !== null && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10">
            <TrendingUp 
              className={`h-4 w-4 ${rmssdDelta > 0 ? 'text-green-600' : 'text-orange-600'}`} 
              aria-hidden="true" 
            />
            <div>
              <p className="text-xs font-medium text-muted-foreground">Évolution HRV</p>
              <p className="text-sm font-semibold text-foreground">
                {rmssdDelta > 0 ? '+' : ''}{rmssdDelta.toFixed(1)} ms
              </p>
            </div>
          </div>
        )}

        {/* Respiration */}
        {respRateAvg && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Fréquence respiratoire moyenne :</span>{' '}
            {respRateAvg.toFixed(1)} cycles/min
          </div>
        )}
      </CardContent>
    </Card>
  );
};
