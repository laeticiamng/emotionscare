
import React from 'react';
import { VRSession, VRSessionTemplate } from '@/types/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, CheckCircle, Clock } from 'lucide-react';

interface VRSessionHistoryProps {
  sessions: VRSession[];
  title?: string;
  onSelectSession?: (session: VRSession) => void;
  templateMap?: Record<string, VRSessionTemplate>;
}

const VRSessionHistory: React.FC<VRSessionHistoryProps> = ({ 
  sessions = [], 
  title = 'Sessions récentes',
  onSelectSession,
  templateMap = {}
}) => {
  if (sessions.length === 0) {
    return null;
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date inconnue';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: fr });
    } catch (err) {
      return 'Date invalide';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map(session => {
            // Look up template by templateId or use embedded template if available
            const templateName = session.templateId && templateMap[session.templateId]
              ? templateMap[session.templateId].name || templateMap[session.templateId].title
              : 'Session VR';
              
            return (
              <div 
                key={session.id} 
                className="flex items-start space-x-4 p-3 rounded-lg hover:bg-accent/50 cursor-pointer"
                onClick={() => onSelectSession && onSelectSession(session)}
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  {session.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <Clock className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                
                <div className="flex flex-col flex-1">
                  <h4 className="font-medium">{templateName}</h4>
                  
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{formatDate(session.startDate?.toString() || session.startTime)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm mt-1">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>{Math.floor((session.duration_seconds || session.duration || 0) / 60)} min</span>
                  </div>
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
