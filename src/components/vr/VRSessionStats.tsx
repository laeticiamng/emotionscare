
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { VRSession } from '@/types/vr';
import { Heart, Clock, Calendar, Star, FileText } from 'lucide-react';

interface VRSessionStatsProps {
  session: VRSession;
  className?: string;
}

const VRSessionStats: React.FC<VRSessionStatsProps> = ({ session, className = '' }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}min ${remainingSeconds}s`;
  };

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  const calculateSessionDuration = () => {
    if (!session.startedAt) {
      return 'N/A';
    }
    
    const startDate = typeof session.startedAt === 'string' 
      ? new Date(session.startedAt) 
      : session.startedAt;
      
    if (session.completed && (session.completedAt || session.endedAt || session.end_time)) {
      const endDate = session.completedAt 
        ? (typeof session.completedAt === 'string' ? new Date(session.completedAt) : session.completedAt)
        : session.endedAt 
          ? (typeof session.endedAt === 'string' ? new Date(session.endedAt) : session.endedAt)
          : (typeof session.end_time === 'string' ? new Date(session.end_time) : session.end_time);
      
      if (endDate) {
        const durationMs = endDate.getTime() - startDate.getTime();
        return formatDistance(0, durationMs, { includeSeconds: true, locale: fr });
      }
    }
    
    return formatDuration(session.duration);
  };

  // Safety check for empty session object
  if (!session || !session.id) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Aucune donnée de session disponible</p>
        </CardContent>
      </Card>
    );
  }

  const heartRateBefore = session.heartRateBefore || session.heart_rate_before;
  const heartRateAfter = session.heartRateAfter || session.heart_rate_after;

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Détails de la session</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Durée</p>
                <p className="text-sm text-muted-foreground">{calculateSessionDuration()}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Date</p>
                <p className="text-sm text-muted-foreground">{formatDate(session.startedAt)}</p>
              </div>
            </div>
          </div>
          
          {(heartRateBefore !== undefined) && (
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">Rythme cardiaque avant</p>
                <p className="text-sm text-muted-foreground">{heartRateBefore} BPM</p>
              </div>
            </div>
          )}
          
          {(heartRateAfter !== undefined) && (
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Rythme cardiaque après</p>
                <p className="text-sm text-muted-foreground">{heartRateAfter} BPM</p>
              </div>
            </div>
          )}
          
          {(session.rating !== undefined) && (
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Évaluation</p>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < (session.rating || 0) ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {session.feedback && (
            <div className="flex items-start space-x-2">
              <FileText className="h-5 w-5 text-muted-foreground mt-1" />
              <div>
                <p className="text-sm font-medium">Feedback</p>
                <p className="text-sm text-muted-foreground">
                  {typeof session.feedback === 'string' ? session.feedback : JSON.stringify(session.feedback)}
                </p>
              </div>
            </div>
          )}
          
          {(session.emotionBefore || session.emotionAfter) && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm font-medium mb-3">Évolution émotionnelle</p>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-2 rounded-md bg-muted/50">
                  <p className="text-xs text-muted-foreground">Avant</p>
                  <p className="font-medium capitalize">{session.emotionBefore || "N/A"}</p>
                </div>
                
                <div className="p-2 rounded-md bg-muted/50">
                  <p className="text-xs text-muted-foreground">Après</p>
                  <p className="font-medium capitalize">{session.emotionAfter || "N/A"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VRSessionStats;
