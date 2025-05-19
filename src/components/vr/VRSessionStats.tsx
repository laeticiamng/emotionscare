
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, Brain, TrendingUp } from 'lucide-react';
import { VRSession } from '@/types/vr';
import { getVRSessionHeartRateBefore, getVRSessionHeartRateAfter, getVRSessionMetrics } from '@/utils/vrCompatibility';

interface VRSessionStatsProps {
  session: VRSession;
  className?: string;
}

const VRSessionStats: React.FC<VRSessionStatsProps> = ({ session, className = "" }) => {
  // Use compatibility helpers
  const heartRateBefore = getVRSessionHeartRateBefore(session);
  const heartRateAfter = getVRSessionHeartRateAfter(session);
  const heartRateChange = heartRateAfter !== undefined && heartRateBefore !== undefined 
    ? heartRateAfter - heartRateBefore 
    : undefined;
  
  const metrics = getVRSessionMetrics(session);
  
  const formatMetricValue = (value: any): string => {
    if (value === undefined || value === null) return 'N/A';
    if (typeof value === 'number') return value.toString();
    if (Array.isArray(value)) {
      if (value.length === 0) return 'N/A';
      if (typeof value[0] === 'number') {
        const avg = value.reduce((sum, val) => sum + val, 0) / value.length;
        return avg.toFixed(1);
      }
    }
    return String(value);
  };
  
  const renderMetrics = () => {
    if (!metrics || Object.keys(metrics).length === 0) {
      return (
        <p className="text-center text-muted-foreground py-4">Aucune métrique disponible</p>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {metrics.stressLevel !== undefined && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Niveau de stress</p>
              <Brain className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-bold">{formatMetricValue(metrics.stressLevel)}</p>
          </div>
        )}
        
        {metrics.focusLevel !== undefined && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium">Niveau de focus</p>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold">{formatMetricValue(metrics.focusLevel)}</p>
          </div>
        )}
        
        {Object.entries(metrics).map(([key, value]) => {
          // Skip already handled metrics
          if (['stressLevel', 'focusLevel', 'heartRate', 'heartRateBefore', 'heartRateAfter'].includes(key)) {
            return null;
          }
          
          return (
            <div key={key} className="bg-muted/50 p-3 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">{formatMetricValue(value)}</p>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          Statistiques de la session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {(heartRateBefore !== undefined || heartRateAfter !== undefined) && (
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                <h3 className="font-medium">Fréquence cardiaque</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {heartRateBefore !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Avant</p>
                    <p className="text-xl font-bold">{heartRateBefore} bpm</p>
                  </div>
                )}
                {heartRateAfter !== undefined && (
                  <div>
                    <p className="text-sm text-muted-foreground">Après</p>
                    <p className="text-xl font-bold">{heartRateAfter} bpm</p>
                  </div>
                )}
              </div>
              {heartRateChange !== undefined && (
                <div className="mt-2 flex items-center">
                  <p className="text-sm mr-2">Évolution:</p>
                  <span className={`text-sm font-medium ${heartRateChange < 0 ? 'text-green-500' : heartRateChange > 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {heartRateChange > 0 ? '+' : ''}{heartRateChange} bpm
                  </span>
                </div>
              )}
            </div>
          )}
          
          <div className="bg-muted/30 p-4 rounded-lg">
            <h3 className="font-medium mb-4">Métriques</h3>
            {renderMetrics()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRSessionStats;
