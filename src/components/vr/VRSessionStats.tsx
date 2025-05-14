
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Timer, Calendar, TrendingDown } from 'lucide-react';
import { VRSession } from '@/types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VRSessionStatsProps {
  lastSession?: VRSession | null;
  totalSessions: number;
  totalMinutes: number;
  averageHeartRateReduction: number;
}

const VRSessionStats: React.FC<VRSessionStatsProps> = ({ 
  lastSession, 
  totalSessions = 0,
  totalMinutes = 0,
  averageHeartRateReduction = 0
}) => {
  const getSessionDate = () => {
    if (!lastSession) return new Date().toISOString();
    return lastSession.date || lastSession.startedAt || lastSession.startTime || new Date().toISOString();
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Statistiques de vos sessions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              Nombre de sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            {lastSession && (
              <p className="text-xs text-muted-foreground">
                Dernière session: {formatDistanceToNow(
                  parseISO(typeof getSessionDate() === 'string' ? getSessionDate() : 
                          new Date().toISOString()), 
                  { addSuffix: true, locale: fr }
                )}
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Timer className="h-4 w-4 mr-2 text-primary" />
              Temps total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMinutes} min</div>
            <p className="text-xs text-muted-foreground">
              Moyenne: {totalSessions > 0 ? (totalMinutes / totalSessions).toFixed(1) : 0} min/session
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center">
            <Heart className="h-4 w-4 mr-2 text-red-500" />
            Amélioration du rythme cardiaque
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-5 w-5 text-green-500" />
            <span className="text-xl font-medium">-{averageHeartRateReduction} bpm</span>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between text-xs mb-1">
              <span>Impact</span>
              <span>Excellent</span>
            </div>
            <Progress value={averageHeartRateReduction * 5} className="h-2" />
          </div>
          
          <p className="text-xs text-muted-foreground mt-2">
            Une baisse de la fréquence cardiaque indique une réduction du stress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VRSessionStats;
