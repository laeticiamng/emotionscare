import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { VRSession, VRSessionTemplate } from '@/types';

interface VRSessionHistoryItemProps {
  session: VRSession;
  template: VRSessionTemplate;
  onClick: (session: VRSession) => void;
}

const VRSessionHistoryItem: React.FC<VRSessionHistoryItemProps> = ({ session, template, onClick }) => {
  const formattedDate = session.startTime
    ? formatDistanceToNow(new Date(session.startTime), { addSuffix: true })
    : 'Unknown';

  return (
    <div
      className="flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={() => onClick(session)}
    >
      <div>
        <h4 className="font-medium text-sm">{template.title}</h4>
        <p className="text-xs text-muted-foreground">
          {formattedDate}
        </p>
      </div>
      <span className="text-xs text-muted-foreground">
        {session.duration} minutes
      </span>
    </div>
  );
};

interface VRSessionHistoryProps {
  sessions: VRSession[];
  templates: VRSessionTemplate[];
  onSelectSession: (session: VRSession) => void;
}

const VRSessionHistory: React.FC<VRSessionHistoryProps> = ({ sessions, templates, onSelectSession }) => {
  const getTemplateForSession = (sessionId: string): VRSessionTemplate | undefined => {
    const session = sessions.find(s => s.id === sessionId);
    return templates.find(template => template.id === session?.templateId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Historique des sessions</h3>
      {sessions.length > 0 ? (
        <div className="divide-y">
          {sessions.map(session => {
            const template = getTemplateForSession(session.id);
            if (!template) return null;

            return (
              <VRSessionHistoryItem
                key={session.id}
                session={session}
                template={template}
                onClick={onSelectSession}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          Aucune session enregistrée pour le moment.
        </div>
      )}
    </div>
  );
};

export default VRSessionHistory;
