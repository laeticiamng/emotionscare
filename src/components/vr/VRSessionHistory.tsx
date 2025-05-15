
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VRSession, VRSessionTemplate, VRSessionHistoryProps } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const VRSessionHistory: React.FC<VRSessionHistoryProps> = ({ 
  sessions, 
  templates = [],
  onSelectSession 
}) => {
  if (!sessions || sessions.length === 0) {
    return null;
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  // Get template title for a session
  const getTemplateTitle = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    return template ? template.title : 'Session immersive';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des sessions</CardTitle>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Aucune session récente
          </p>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <div 
                key={session.id}
                className="p-3 rounded-md border hover:bg-muted/50 cursor-pointer"
                onClick={() => onSelectSession && onSelectSession(session)}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">{getTemplateTitle(session.templateId)}</h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(session.startedAt || session.startTime || '')}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-muted-foreground">
                    Durée: {Math.round((session.duration || 0) / 60)} min
                  </span>
                  {session.completed || session.isCompleted ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">
                      Terminée
                    </span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-800/30 dark:text-amber-400">
                      En cours
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VRSessionHistory;
