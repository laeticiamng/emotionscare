
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
      
    if (session.completed && (session.endedAt || session.end_time)) {
      const endDate = session.endedAt 
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

            {(session.heart_rate_before || session.heartRateBefore) && (
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-rose-500" />
                <div>
                  <p className="text-sm font-medium">Fréquence cardiaque initiale</p>
                  <p className="text-sm text-muted-foreground">
                    {session.heart_rate_before || session.heartRateBefore} bpm
                  </p>
                </div>
              </div>
            )}

            {(session.heart_rate_after || session.heartRateAfter) && (
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium">Fréquence cardiaque finale</p>
                  <p className="text-sm text-muted-foreground">
                    {session.heart_rate_after || session.heartRateAfter} bpm
                  </p>
                </div>
              </div>
            )}

            {session.rating !== undefined && (
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Notation</p>
                  <p className="text-sm text-muted-foreground">{session.rating} / 5</p>
                </div>
              </div>
            )}
          </div>

          {session.notes && (
            <div className="pt-2">
              <div className="flex items-center space-x-2 mb-1">
                <FileText className="h-5 w-5 text-blue-500" />
                <p className="text-sm font-medium">Notes</p>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{session.notes}</p>
              </div>
            </div>
          )}

          {session.feedback && (
            <div className="pt-2">
              <div className="flex items-center space-x-2 mb-1">
                <FileText className="h-5 w-5 text-purple-500" />
                <p className="text-sm font-medium">Feedback</p>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm whitespace-pre-wrap">{session.feedback}</p>
              </div>
            </div>
          )}

          {session.emotionBefore && session.emotionAfter && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-sm font-medium">Émotion initiale</p>
                <p className="text-sm text-muted-foreground capitalize">{session.emotionBefore}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Émotion finale</p>
                <p className="text-sm text-muted-foreground capitalize">{session.emotionAfter}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VRSessionStats;
