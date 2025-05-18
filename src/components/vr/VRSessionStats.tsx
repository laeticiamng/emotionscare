
import React from 'react';
import { VRSession } from '@/types/vr';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Activity, Brain } from 'lucide-react';

interface VRSessionStatsProps {
  session: VRSession;
  className?: string;
}

const VRSessionStats: React.FC<VRSessionStatsProps> = ({ session, className = '' }) => {
  // Calcul des statistiques
  const calculateHeartRateChange = () => {
    if (session.heartRateBefore && session.heartRateAfter) {
      return session.heartRateAfter - session.heartRateBefore;
    }
    return 0;
  };
  
  const calculateAverageHeartRate = () => {
    if (session.metrics?.heartRate) {
      if (Array.isArray(session.metrics.heartRate)) {
        return session.metrics.heartRate.length > 0 
          ? Math.round(session.metrics.heartRate.reduce((sum, rate) => sum + rate, 0) / session.metrics.heartRate.length) 
          : 0;
      } else {
        return session.metrics.heartRate;
      }
    }
    return 0;
  };
  
  const getHeartRateArray = () => {
    if (session.metrics?.heartRate && Array.isArray(session.metrics.heartRate)) {
      return session.metrics.heartRate;
    }
    return [];
  };
  
  const heartRateChange = calculateHeartRateChange();
  const averageHeartRate = calculateAverageHeartRate();
  const heartRateArray = getHeartRateArray();
  
  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">Statistiques de session</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Fréquence cardiaque */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fréquence cardiaque</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold">{averageHeartRate}</p>
                  <p className="text-sm text-muted-foreground mb-1">bpm moy.</p>
                </div>
              </div>
              <HeartPulse className="text-rose-500 h-8 w-8" />
            </div>
            
            {session.heartRateBefore && session.heartRateAfter && (
              <div className="mt-3 text-xs">
                <span className="inline-flex items-center">
                  Avant: {session.heartRateBefore} bpm 
                  <span className="mx-2">→</span> 
                  Après: {session.heartRateAfter} bpm
                  {heartRateChange !== 0 && (
                    <span className={`ml-2 ${heartRateChange < 0 ? 'text-emerald-500' : heartRateChange > 0 ? 'text-rose-500' : ''}`}>
                      ({heartRateChange > 0 ? '+' : ''}{heartRateChange})
                    </span>
                  )}
                </span>
              </div>
            )}
            
            {heartRateArray && Array.isArray(heartRateArray) && heartRateArray.length > 0 && (
              <div className="mt-3 h-12">
                <div className="flex items-end h-full space-x-1">
                  {heartRateArray.slice(0, 20).map((value, index) => (
                    <div 
                      key={index}
                      style={{ 
                        height: `${Math.min(100, value / 2)}%`,
                        width: `${100 / Math.min(20, heartRateArray.length)}%` 
                      }}
                      className="bg-rose-500/60 rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Niveau de stress */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Niveau de stress</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold">{session.metrics?.stressLevel || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground mb-1">/100</p>
                </div>
              </div>
              <Activity className="text-amber-500 h-8 w-8" />
            </div>
            
            <div className="mt-3 h-3 bg-muted-foreground/20 rounded-full">
              <div 
                className="h-3 bg-gradient-to-r from-green-500 to-amber-500 rounded-full"
                style={{ width: `${session.metrics?.stressLevel || 0}%` }}
              ></div>
            </div>
          </div>
          
          {/* Niveau de concentration */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Concentration</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold">{session.metrics?.focusLevel || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground mb-1">/100</p>
                </div>
              </div>
              <Brain className="text-blue-500 h-8 w-8" />
            </div>
            
            <div className="mt-3 h-3 bg-muted-foreground/20 rounded-full">
              <div 
                className="h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-full"
                style={{ width: `${session.metrics?.focusLevel || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VRSessionStats;
