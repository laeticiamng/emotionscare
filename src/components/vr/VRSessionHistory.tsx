// @ts-nocheck

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow, format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, Calendar, CheckCircle } from 'lucide-react';
import { VRSessionHistoryProps } from '@/types/vr';
import { getVRSessionStartTime, getVRSessionEndTime } from '@/utils/vrCompatibility';

const VRSessionHistory: React.FC<VRSessionHistoryProps> = ({
  sessions,
  onSelect,
  onSessionSelect,
  emptyMessage = "Aucune session récente",
  limitDisplay = 5,
  showHeader = true,
  className = ""
}) => {
  // Use compatibility helpers for consistent access
  const handleSessionClick = (session: any) => {
    if (onSelect) {
      onSelect(session);
    }
    if (onSessionSelect) {
      onSessionSelect(session);
    }
  };

  // Helper function to format date nicely with fallbacks
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Date inconnue";
    try {
      if (typeof date === 'string') {
        return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: fr });
      }
      return format(date, 'dd/MM/yyyy HH:mm', { locale: fr });
    } catch (e) {
      return "Date invalide";
    }
  };

  // Helper function to format relative time with fallbacks
  const formatRelativeTime = (date: string | Date | undefined) => {
    if (!date) return "";
    try {
      if (typeof date === 'string') {
        return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr });
      }
      return formatDistanceToNow(date, { addSuffix: true, locale: fr });
    } catch (e) {
      return "";
    }
  };

  const displaySessions = sessions.slice(0, limitDisplay);

  if (displaySessions.length === 0) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader>
            <CardTitle>Historique des sessions</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      {showHeader && (
        <CardHeader>
          <CardTitle>Historique des sessions</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-4">
          {displaySessions.map(session => {
            const startTime = getVRSessionStartTime(session);
            const endTime = getVRSessionEndTime(session);
            
            return (
              <div
                key={session.id}
                className="flex items-center p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => handleSessionClick(session)}
              >
                <div className="mr-4">
                  {session.completed ? (
                    <CheckCircle className="text-green-500 h-8 w-8" />
                  ) : (
                    <Clock className="text-amber-500 h-8 w-8" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">Session #{session.id.slice(0, 6)}</p>
                  <div className="flex items-center text-sm text-muted-foreground gap-2 mt-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(startTime)}</span>
                    <span className="text-xs">({formatRelativeTime(startTime)})</span>
                  </div>
                  {session.completed && endTime && (
                    <p className="text-sm text-green-600 mt-1">Terminée {formatRelativeTime(endTime)}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{session.duration} min</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {session.progress ? `${Math.round(session.progress * 100)}%` : ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default VRSessionHistory;
