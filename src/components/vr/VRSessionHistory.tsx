
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { VRSession, VRSessionHistoryProps, VRSessionTemplate } from '@/types/vr';
import { CalendarIcon, Clock, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';

const VRSessionHistory: React.FC<VRSessionHistoryProps> = ({
  sessions = [],
  onSelect,
  emptyMessage = "Aucune session VR récente",
  limitDisplay = 5,
  userId,
  limit,
  showHeader = true,
  className = '',
  onSessionSelect
}) => {
  // Utiliser onSelect ou onSessionSelect selon ce qui est fourni
  const handleSelect = onSessionSelect || onSelect;

  // Calculer la date sous forme lisible
  const formatSessionDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Date inconnue';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'PPP', { locale: fr });
    } catch (e) {
      console.error('Error formatting date:', e);
      return 'Date invalide';
    }
  };

  // Calculer la durée en format lisible
  const formatDuration = (duration: number | null) => {
    if (duration === null || duration === undefined) return 'Durée inconnue';
    
    if (duration < 60) {
      return `${duration} sec`;
    }
    
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m${seconds > 0 ? ` ${seconds}s` : ''}`;
  };

  // Tableau des sessions à afficher (limité si nécessaire)
  const displayedSessions = sessions.slice(0, limitDisplay);

  // Vérifier s'il y a des sessions à afficher
  if (displayedSessions.length === 0) {
    return (
      <Card className={className}>
        {showHeader && (
          <CardHeader>
            <CardTitle>Historique des sessions</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            {emptyMessage}
          </div>
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
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {displayedSessions.map((session) => {
              // Get session title - safely handle template property
              const sessionTitle = session.templateId || 'Session VR';
              
              return (
                <div
                  key={session.id}
                  className="border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => handleSelect && handleSelect(session)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{sessionTitle}</h4>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span>{formatSessionDate(session.startTime)}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDuration(session.duration)}</span>
                      </div>
                      
                      {session.metrics?.emotionEnd && (
                        <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted">
                          <Activity className="h-3 w-3" />
                          <span>{session.metrics.emotionEnd}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {session.template && (
                    <div className="mt-2 w-full h-24 rounded-md overflow-hidden">
                      <img 
                        src={session.template.thumbnailUrl} 
                        alt={session.template.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        {sessions.length > limitDisplay && (
          <div className="text-center mt-4">
            <Button 
              variant="ghost" 
              onClick={() => handleSelect && handleSelect(sessions[0])}
            >
              Voir plus de sessions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VRSessionHistory;
